import { IShallowClonable } from './types'
import QuickLRU from './quicklru'
import Parser from './parser'
let Cache = new QuickLRU({ maxSize: 50 })
const parse = str => Parser.accessor.tryParse(str)

export { IShallowClonable }

export function setCacheSize(maxSize = 50) {
  Cache = new QuickLRU({ maxSize })
}
const isSet = val => typeof val !== 'undefined' && val !== null
const isFn = (fn): fn is Function => typeof fn === 'function'
const isPlainObject = obj => !isSet(obj.constructor) || obj.constructor === Object

function clone(obj) {
  if (isPlainObject(obj)) {
    return { ...obj }
  }
  if (isFn(obj.shallowClone)) {
    return obj.shallowClone()
  }
  const newObj = new obj.constructor()
  const keys = Object.keys(obj)
  let len = keys.length
  while (len--) {
    const key = keys[len]
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

type KeyPath = (string | number)[]

function getPathKeys(accessor: Function | string[], ctx: {[key: string]: string} = {}): KeyPath {
  if (!isFn(accessor)) {
    return accessor
  }
  let setter = accessor.toString()
  const cache = Cache.get(setter)
  if (cache) {
    for (const [i, key] of cache.map) {
      cache.keys[i] = ctx[key]
    }
    return cache.keys
  }
  let keys: (string | number)[] = []
  const ast: Ast = parse(setter)

  const len = ast.keyPath.length
  const map: [number, string][] = []
  for (let i = 0; i < len; i++) {
    const item = ast.keyPath[i]
    if (item.type === 'string' || item.type === 'number') {
      keys[i] = item.value
    } else if (item.type === 'variable') {
      if (!(item.value in ctx)) {
        console.error('context', ctx)
        throw TypeError('Cannot find dynamic key in context:' + accessor)
      }
      keys[i] = ctx[item.value]
      map.push([i, item.value])
    }
  }
  Cache.set(setter, {
    keys,
    map,
  })
  return keys
}

enum MutateType {
  setIn = 1,
  updateIn = 2
}

function mutate<T, V>(record: T, accessor: ((obj: T) => V) | string[], type: MutateType, updator: ((v: V) => V) | V, ctx?: {[key: string]: any}): T {
  const isUpdate = type === MutateType.updateIn
  let keys = getPathKeys(accessor, ctx)
  if (isUpdate && isFn((record as any).updateIn)) {
    return (record as any).updateIn(keys, updator)
  } else if (isFn((record as any).setIn)) {
    return (record as any).setIn(keys, updator)
  }
  let newRecord = clone(record)
  let dist = newRecord
  let src = record
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    src = src[key]
    dist = dist[key] = clone(src)
  }
  let lastKey = keys[keys.length - 1]
  dist[lastKey] =
    isUpdate
      ? (updator as any)(src[lastKey])
      : updator
  return newRecord
}
/**
 * get a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export function getIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], ctx?: {[key: string]: any}): V {
  let v = record as any as V
  const keys = getPathKeys(accessor, ctx)
  if (isFn((record as any).getIn)) {
    return (record as any).getIn(keys)
  }
  let len = keys.length
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    v = record[key]
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
export function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V, ctx?: {[key: string]: any}): T {
  return mutate(record, accessor, MutateType.setIn, value as V, ctx)
}

/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export function unsetIn<T, V>(record: T, accessor: ((obj: T) => V | undefined) | string[], ctx?: {[key: string]: string}): T {
  return mutate(record, accessor, MutateType.setIn, void 0, ctx)
}
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 * @param ctx Dynamic key map.
 */
export function updateIn<T, V, A>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V, ctx?: {[key: string]: any}): T {
  if (!updator) {
    return record
  }
  return mutate(record, accessor, MutateType.updateIn, updator, ctx)
}

export default { setIn, unsetIn, updateIn }
