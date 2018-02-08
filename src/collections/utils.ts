export function * iterMap<T, U>(list: Iterable<T>, cb: (a: T) => U) {
  if (list instanceof Array) {
    for (const item of list) {
      yield cb(item)
    }
    return
  }
  const iter = list[Symbol.iterator]()
  for (let item = iter.next(); !item.done; item = iter.next()) {
    yield cb(item.value)
  }
}

export function iter<T>(list: Iterable<T>, cb: (a: T) => void) {
  if (list instanceof Array) {
    return list.forEach(cb)
  }
  const iter = list[Symbol.iterator]()
  for (let item = iter.next(); !item.done; item = iter.next()) {
    cb(item.value)
  }
}

function getType(key: any) {
  const t: string = Object.prototype.toString.call(key)
  return t.slice(8, -1).toLowerCase()
}

let objUid = 0
let objUidKey = typeof Symbol !== 'undefined' ? Symbol('_hmuid_') : '_hmuid_'
let objUidMap = typeof WeakMap !== 'undefined' ? new WeakMap<object, number>() : null

export type Hash = (v: any) => string

export function defaultHash(key: any): string {
  switch (getType(key)) {
    case 'undefined':
    case 'null':
    case 'boolean':
    case 'number':
    case 'regexp':
      return key + ''

    case 'date':
      return '📅' + key.getTime()

    case 'string':
      return '📝' + key

    case 'array':
      return '🔗' + (key as any[]).map(k => defaultHash(k)).join('⁞')

    default:
      if (objUidMap) {
        let uid = objUidMap.get(key)
        if (!uid) {
          uid = ++objUid
          objUidMap.set(key, uid)
        }
        return '⭕️' + uid
      }
      // TODO: Don't use expandos when Object.defineProperty is not available?
      if (!key.hasOwnProperty(objUidKey)) {
        key[objUidKey] = ++objUid
        hide(key, objUidKey)
      }

      return '⭕️' + key[objUidKey]
  }
}

function hide(obj, prop) {
  // Make non iterable if supported
  if (Object.defineProperty) {
    Object.defineProperty(obj, prop, { enumerable: false })
  }
}
