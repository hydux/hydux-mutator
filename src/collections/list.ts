import { iterMap, iter } from './utils'
import { IImmutableSetable } from '../types'
import * as List from '@funkia/list'

function * iteri(len: number): IterableIterator<number> {
  for (let i = 0; i < len; i++) {
    yield i
  }
}

export { List }

export default class ImmuList<T> implements IImmutableSetable<number, T, ImmuList<T>> {
  get length() {
    return this._list.length
  }
  private _list: List.List<T>

  constructor(values?: T[]) {
    if (values) {
      this._list = List.fromArray(values)
    } else {
      this._list = List.empty()
    }
  }
  toString(): string {
    return 'ImmuList [' + List.toArray(this._list).toString() + ']'
  }
  toLocaleString(): string {
    return 'ImmuList [' + List.toArray(this._list).toLocaleString() + ']'
  }
  get(i: number) {
    return List.nth(i, this._list)
  }
  set(i: number, val: T): ImmuList<T> {
    let list = this._list
    if (i < 0 || i >= list.length) {
      console.error(`index out of range (0, ${this._list.length}), this would silent ignored`)
    }
    list = List.update(i, val, this._list)
    return this._new(list)
  }
  remove(from: number, amount: number = 1): ImmuList<T> {
    const list = List.remove(from, amount, this._list)
    return this._new(list)
  }
  includes(item: T) {
    return List.includes(item, this._list)
  }
  append(item: T) {
    return this._new(List.append(item, this._list))
  }
  prepend(item: T) {
    return this._new(List.prepend(item, this._list))
  }
  first() {
    return List.first(this._list)
  }
  last() {
    return List.last(this._list)
  }
  tail(): ImmuList<T> {
    return this._new(List.tail(this._list))
  }
  edit(cb: (list: List.List<T>, ListModule: typeof List) => List.List<T>): ImmuList<T> {
    return this._new(cb(this._list, List))
  }
  editWithAny<U>(cb: (list: List.List<T>, ListModule: typeof List) => U): U {
    return cb(this._list, List)
  }
  toArray() {
    return List.toArray(this._list)
  }
  toJSON() {
    return this.toArray()
  }
  concat(...items: (ImmuList<T> | Array<T> | T)[]): ImmuList<T> {
    let list = this._list
    iter(items, item => {
      if (item instanceof ImmuList) {
        list = List.concat(list, item._list)
      } else if (item instanceof Array) {
        list = item.reduce((l, i) => List.append(i, l), list)
      } else {
        list = List.append(item, list)
      }
    })
    if (list.length > this._list.length) {
      return this._new(list)
    }
    return this
  }
  join(separator?: string | undefined): string {
    let sep = separator || ','
    return List.join(sep, this._list as any)
  }
  slice(start?: number | undefined, end?: number | undefined) {
    const newList = List.slice(start || 0, end || this._list.length, this._list)
    if (newList.length !== this._list.length) {
      return this._new(newList)
    }
    return this
  }
  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    let list = this._list
    if (fromIndex) {
      list = List.slice(fromIndex, this._list.length, list)
    }
    return List.indexOf(searchElement, list)
  }
  every(callbackfn: (value: T, index: number, array: this) => boolean, thisArg?: any): boolean {
    let i = 0
    return List.every(v => {
      return callbackfn.call(thisArg, v, i++, this)
    }, this._list)
  }
  some(callbackfn: (value: T, index: number, array: this) => boolean, thisArg?: any): boolean {
    let i = 0
    return List.some(v => {
      return callbackfn.call(thisArg, v, i++, this)
    }, this._list)
  }
  forEach(callbackfn: (value: T, index: number, array: this) => void, thisArg?: any): void {
    let i = 0
    List.foldl(
      (_, v) => (callbackfn.call(thisArg, v, i++, this), undefined),
      undefined,
      this._list,
    )
  }
  map<U>(callbackfn: (value: T, index: number, array: this) => U, thisArg?: any): ImmuList<U> {
    let i = 0
    const list = List.map(
      v => callbackfn.call(thisArg, v, i++, this),
      this._list,
    )
    return this._new(list)
  }
  filter(callbackfn: (value: T, index: number, array: this) => boolean, thisArg?: any): ImmuList<T> {
    let i = 0
    const list = List.filter(
      v => callbackfn.call(thisArg, v, i++, this),
      this._list,
    )
    if (list.length !== this._list.length) {
      return this._new(list)
    }
    return this
  }
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: this) => U, initialValue: U, thisArg?: any): U {
    let i = 0
    return List.foldl(
      (acc, v) => callbackfn.call(thisArg, acc, v, i++, this),
      initialValue,
      this._list,
    )
  }
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: this) => U, initialValue: U, thisArg?: any): U {
    let i = 0
    return List.foldr(
      (v, acc) => callbackfn.call(thisArg, acc, v, i++, this),
      initialValue,
      this._list,
    )
  }
  [Symbol.iterator](): IterableIterator<T> {
    return iterMap(this._list, v => v)
  }
  entries(): IterableIterator<[number, T]> {
    let i = 0
    return iterMap(this._list, v => [i++, v] as [number, T])
  }
  keys(): IterableIterator<number> {
    return iteri(this._list.length)
  }
  values(): IterableIterator<T> {
    return iterMap(this._list, v => v)
  }
  find(predicate: (value: T, index: number, obj: this) => boolean, thisArg?: any): T | undefined {
    let i = 0
    return List.find(
      v => predicate.call(thisArg, v, i++, this),
      this._list,
    )
  }
  findIndex(predicate: (value: T, index: number, obj: this) => boolean, thisArg?: any): number {
    let i = 0
    return List.findIndex(
      v => predicate.call(thisArg, v, i++, this),
      this._list,
    )
  }
  private _new<T>(list: List.List<T>) {
    const newImmuList = new ImmuList<T>()
    newImmuList._list = list
    return newImmuList
  }
}
