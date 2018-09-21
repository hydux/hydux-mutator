import { IShallowClonable, IImmutableSetable } from './types'
import QuickLRU from './quicklru'
import Parser from './parser'
import {
  isPojo, isObj, isFn, isSet, error
} from './utils'
let Cache = new QuickLRU({ maxSize: 50 })
const parse = str => Parser.accessor.tryParse(str)

export {
  IShallowClonable,
  IImmutableSetable,
}

export function setCacheSize(maxSize = 50) {
  Cache = new QuickLRU({ maxSize })
}
function clone(obj) {
  if (isPojo(obj)) {
    return { ...obj }
  }
  const customClone: Function = obj.shallowClone
  if (isFn(customClone)) {
    return customClone.call(obj)
  }
  const newObj = new obj.constructor()
  const keys = Object.keys(obj)
  let len = keys.length
  while (len--) {
    const key = keys[keys.length - 1 - len]
    newObj[key] = obj[key]
  }
  return newObj
}
type AstKey = {
  type: 'string' | 'variable',
  value: string
}
| {
  type: 'number',
  value: number
}

type Ast = {
  args: (string | string[])[],
  obj: string,
  keyPath: AstKey[]
}
export type Key = string | number | symbol
export type KeyPath = Key[]
export type Accessor<T, V> = ((obj: T) => V) | KeyPath

type PathCache = {
  keys: KeyPath,
  dynamicKeys: number[],
}

export function getPathKeys<T, V>(accessor: Accessor<T, V>, ctx: KeyPath = []): KeyPath {
  if (!isFn(accessor)) {
    return accessor
  }
  let setter = accessor.toString()
  const cache = Cache.get<PathCache>(setter)
  if (cache) {
    const len = cache.dynamicKeys.length
    for (let i = 0; i < len; i++) {
      cache.keys[cache.dynamicKeys[i]] = ctx[i]
    }
    return cache.keys
  }
  let keys: KeyPath = []
  let ast: Ast = null as any
  try {
    ast = parse(setter)
  } catch (err) {
    error('parse accessor failed, accessor:', setter)
    throw err
  }

  const len = ast.keyPath.length
  const dynamicKeys: number[] = []
  let variableIdx = 0
  for (let i = 0; i < len; i++) {
    const item = ast.keyPath[i]
    if (item.type === 'string' || item.type === 'number') {
      keys[i] = item.value
    } else if (item.type === 'variable') {
      keys[i] = ctx[variableIdx++]
      dynamicKeys.push(i)
    }
  }
  Cache.set<PathCache>(setter, {
    keys,
    dynamicKeys,
  })
  return keys
}

enum MutateType {
  setIn = 1,
  updateIn = 2
}

function set(src, key, val) {
  src = src || {}
  const customSet = src.set
  if (isFn(customSet)) {
    return customSet.call(src, key, val)
  }
  let dist = clone(src)
  dist[key] = val
  return dist
}

function mutate<T, V>(record: T, accessor: Accessor<T, V>, type: MutateType, updator: ((v: V) => V) | V, ctx?: KeyPath): T {
  const isUpdate = type === MutateType.updateIn
  let keys = getPathKeys<T, V>(accessor, ctx)
  const keysLastIdx = keys.length - 1
  let temp: any = record
  const stack = [record]
  for (let i = 0; i < keysLastIdx; i++) {
    const key = keys[i]
    stack.push(temp = temp[key] || {})
  }
  let dist: any = isUpdate ? (updator as any)(stack[keysLastIdx][keys[keysLastIdx]]) : updator
  for (let i = keysLastIdx; i >= 0; i--) {
    temp = stack[i]
    dist = set(temp, keys[i], dist)
  }
  return dist
}
/**
 * get a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export function getIn<T, V>(record: T, accessor: Accessor<T, V>, ctx?: KeyPath): V | void {
  let v = record as any
  const keys = getPathKeys(accessor, ctx)
  if (isFn((record as any).getIn)) {
    return (record as any).getIn(keys)
  }
  let len = keys.length
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    v = isObj(v)
      ? isFn(v.get)
          ? v.get(key)
          : v[key]
      : undefined
  }
  return v
}
/**
 * Set a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 * @param ctx Dynamic key map.
 */
export function setIn<T, V>(record: T, accessor: Accessor<T, V>, value?: V, ctx?: KeyPath): T {
  return mutate(record, accessor, MutateType.setIn, value as V, ctx)
}

/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export function unsetIn<T, V>(record: T, accessor: Accessor<T, V | void>, ctx?: KeyPath): T {
  return mutate(record, accessor, MutateType.setIn, void 0, ctx)
}
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 * @param ctx Dynamic key map.
 */
export function updateIn<T, V, A>(record: T, accessor: Accessor<T, V>, updator?: (v: V) => V, ctx?: KeyPath): T {
  if (!updator) {
    return record
  }
  return mutate(record, accessor, MutateType.updateIn, updator, ctx)
}

export default { setIn, unsetIn, updateIn }
