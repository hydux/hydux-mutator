import { IShallowClonable } from './types'
import QuickLRU from './quicklru'
import P from 'parsimmon'
let cache = new QuickLRU({ maxSize: 50 })
const funRe = /(?:return|[\w$]+\s*\=\>)\s+[\w$]+([^;}]*)?\s*(?:;|}|$)/

export { IShallowClonable }

export function setCacheSize(maxSize = 50) {
  cache = new QuickLRU({ maxSize })
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

const isQuote = s => s === '"' || s === '\''
function getPathKeys(accessor: Function | string[]): string[] {
  if (!isFn(accessor)) {
    return accessor
  }
  let setter = accessor.toString()
  let keys: string[] = cache.get(setter)
  if (keys) {
    return keys
  }
  let m = setter.match(funRe)
  if (!m || m[0].indexOf('(') >= 0) {
    throw new Error('Invalid setter:' + setter)
  }
  let pathStr = m[1]
  let start = 0
  keys = []
  let push = str => str && keys.push(str)
  for (let i = 0; i < pathStr.length; i++) {
    const c = pathStr[i]
    if (c === '.') {
      push(pathStr.slice(start, i))
      start = i + 1
    } else if (c === '[') {
      push(pathStr.slice(start, i))
      if (isQuote(pathStr[i + 1])) {
        start = i + 2
      } else {
        start = i + 1
      }
    } else if (c === ']') {
      if (isQuote(pathStr[i - 1])) {
        push(pathStr.slice(start, i - 1))
      } else {
        push(pathStr.slice(start, i))
      }
      start = i + 1
    }
  }
  push(pathStr.slice(start))
  cache.set(setter, keys)
  return keys
}

enum MutateType {
  setIn = 1,
  updateIn = 2
}

function mutate<T, V, A>(record: T, accessor: ((obj: T, args: A) => V) | string[], type: MutateType, updator: ((v: V) => V) | V, args: A): T {
  const isUpdate = type === MutateType.updateIn
  let keys = getPathKeys(accessor)
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
 */
export function getIn<T, V>(record: T, accessor: ((obj: T) => V) | string[]): V {
  let v = record as any as V
  const keys = getPathKeys(accessor)
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
 */
export function setIn<T, V, A>(record: T, accessor: ((obj: T, args: A) => V) | string[], value?: V, args?: A): T {
  return mutate(record, accessor, MutateType.setIn, value as V, args)
}
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 */
export function unsetIn<T, V>(record: T, accessor: ((obj: T) => V | undefined) | string[]): T {
  return mutate(record, accessor, MutateType.setIn, void 0)
}
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 */
export function updateIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V): T {
  if (!updator) {
    return record
  }
  return mutate(record, accessor, MutateType.updateIn, updator)
}

export default { setIn, unsetIn, updateIn }
