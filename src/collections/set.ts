import ImmuMap from './map'
import { defaultHash, Hash, iter, iterMap } from './utils'

export { defaultHash, Hash }

export default class ImmuSet<T> implements ReadonlySet<T> {
  get size() {
    return this._map.size
  }
  private _map: ImmuMap<T, T>
  constructor(values?: ReadonlyArray<T> | Iterable<T>, hash: Hash = defaultHash) {
    if (values) {
      this._map = new ImmuMap(iterMap(values, v => [v, v] as [T, T]), hash)
    } else {
      this._map = new ImmuMap([], hash)
    }
  }
  [Symbol.iterator](): IterableIterator<T> {
    return this._map.keys()
  }
  add(value: T): ImmuSet<T> {
    const map = this._map.set(value, value)
    if (map.size > this._map.size) {
      const newSet = new ImmuSet<T>()
      newSet._map = map
      return newSet
    }
    return this
  }
  clear(): ImmuSet<T> {
    return new ImmuSet()
  }
  delete(value: T): ImmuSet<T> {
    const map = this._map.delete(value)
    if (map.size < this._map.size) {
      const newSet = new ImmuSet<T>()
      newSet._map = map
      return newSet
    }
    return this
  }
  entries(): IterableIterator<[T, T]> {
    return this._map.entries()
  }
  keys(): IterableIterator<T> {
    return this._map.keys()
  }
  values(): IterableIterator<T> {
    return this._map.values()
  }
  toArray(): T[] {
    const arr = [] as T[]
    iter(this.keys(), item => arr.push(item))
    return arr
  }
  toJSON(): T[] {
    return this.toArray()
  }
  forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void {
    this._map.forEach((v1, v2, _) => callbackfn(v1, v2, this), thisArg)
  }
  has(value: T): boolean {
    return this._map.has(value)
  }
}
