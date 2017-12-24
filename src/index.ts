import 'core-js/es6/map'
import 'core-js/fn/object/assign'
import QuickLRU from './quicklru'
let cache = new QuickLRU({ maxSize: 50 })
const funRe = /(?:return|[\w$]+\s*\=\>)\s+[\w$]+(.*)\s*(?:;|$)/

export function setCacheSize(maxSize = 50) {
  cache = new QuickLRU({ maxSize })
}

function getByKeys (record, keys) {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    record = record[key]
  }
  return record
}
const isQuote = s => s === '"' || s === '\''
function lambda2path(accessor: Function) {
  let setter = accessor.toString()
  let keys: string[] = cache.get(setter)
  if (keys) {
    return keys
  }
  let m = setter.match(funRe)
  if (!m) {
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
  Object.assign(newRecord, record)
  let dist = newRecord
  let src = record
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    src = src[key]
    dist = dist[key] = new (src as any).constructor()
    Object.assign(dist, src)
  }
  let lastKey = keys[keys.length - 1]
  dist[lastKey] =
    type === MutateType.updateIn
      ? (updator as any)(src[lastKey])
      : updator
  return newRecord
}

export function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V): T {
  if (!value) {
    return record
  }
  return mutate(record, accessor, MutateType.setIn, value)
}

export function updateIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V): T {
  if (!updator) {
    return record
  }
  return mutate(record, accessor, MutateType.updateIn, updator)
}

export default { setIn, updateIn }
