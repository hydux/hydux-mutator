import QuickLRU, { assign } from './quicklru'
let cache = new QuickLRU({ maxSize: 50 })
const funRe = /(?:return|[\w$]+\s*\=\>)\s+[\w$]+(.*)\s*(?:;|}|$)/

export function setCacheSize(maxSize = 50) {
  cache = new QuickLRU({ maxSize })
}

const isQuote = s => s === '"' || s === '\''
function lambda2path(accessor: Function) {
  let setter = accessor.toString()
  let keys: string[] = cache.get(setter)
  if (keys) {
    return keys
  }
  let m = setter.match(funRe)
  if (!m || setter.indexOf('(') >= 0) {
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
function mutate<T, V>(record: T, accessor: ((obj: T) => V) | string[], type: MutateType, updator: ((v: V) => V) | V): T {
  let keys =
    typeof accessor === 'function'
      ? lambda2path(accessor)
      : accessor
  let newRecord = new (record as any).constructor()
  assign(newRecord, record)
  let dist = newRecord
  let src = record
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    src = src[key]
    dist = dist[key] = new (src as any).constructor()
    assign(dist, src)
  }
  let lastKey = keys[keys.length - 1]
  dist[lastKey] =
    type === MutateType.updateIn
      ? (updator as any)(src[lastKey])
      : updator
  return newRecord
}
/**
 * Set a deep child
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 */
export function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V): T {
  return mutate(record, accessor, MutateType.setIn, value as V)
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

export default { setIn, updateIn }
