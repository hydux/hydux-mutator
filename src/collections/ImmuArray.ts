import { IShallowClonable } from './../types'

export default class ImmuArray<T> implements IShallowClonable<ImmuArray<T>> {
  private _start = 0
  private _end = 0
  private _data = [] as T[]
  constructor(data: T[] = [], start = 0, end = data.length) {
    this._data = data
    this._start = start
    this._end = end
  }

  static fromArray<T>(data: T[]) {
    return new ImmuArray<T>(data)
  }

  item(i: number) {
    if (i < this._start) {
      return void 0
    } else if (i >= this._end) {
      return void 0
    }
    return this._data[i]
  }

  find<Z>(callbackfn: (this: Z | void, value: T, index: number, array: ImmuArray<T>) => boolean, thisArg?: Z): T | undefined {
    for (let i = this._start; i < this._end; i++) {
      const item = this._data[i]
      if (callbackfn.call(thisArg, item, i - this._start, this)) {
        return item
      }
    }
    return
  }

  findIndex<Z>(callbackfn: (this: Z | void, value: T, index: number, array: ImmuArray<T>) => boolean, thisArg?: Z): number {
    for (let i = this._start; i < this._end; i++) {
      const item = this._data[i]
      if (callbackfn.call(thisArg, item, i - this._start, this)) {
        return i - this._start
      }
    }
    return -1
  }

  every<Z>(callbackfn: (this: Z | void, value: T, index: number, array: ImmuArray<T>) => boolean, thisArg?: Z) {
    for (let i = this._start; i < this._end; i++) {
      const item = this._data[i]
      if (!callbackfn.call(thisArg, item, i - this._start, this)) {
        return false
      }
    }
    return true
  }

  some<Z>(callbackfn: (this: Z | void, value: T, index: number, array: ImmuArray<T>) => boolean, thisArg?: Z) {
    return this.findIndex(callbackfn, thisArg) >= 0
  }

  map<A, Z>(callbackfn: (this: Z | void, value: T, index: number, array: ImmuArray<T>) => A, thisArg?: Z): ImmuArray<A> {
    let newArr = [] as A[]
    for (let i = this._start; i < this._end; i++) {
      const item = this._data[i]
      newArr.push(callbackfn(item, i, this))
    }
    return new ImmuArray(newArr)
  }

  toArray(): T[] {
    return this._data.slice(this._start, this._end)
  }

  push(a: T): ImmuArray<T> {
    this._data.push(a)
    return new ImmuArray(this._data, this._start, this._end + 1)
  }

  pop(): [T | void, ImmuArray<T>] {
    const last = this._end - 1
    return [this._data[last], new ImmuArray(this._data, this._start, last)]
  }

  shift(a: T): ImmuArray<T> {
    this._data.push(a)
    return new ImmuArray(this._data, this._start, this._end + 1)
  }

  unshift(): [T | void, ImmuArray<T>] {
    const last = this._end - 1
    return [this._data[last], new ImmuArray(this._data, this._start, last)]
  }

  slice(start: number, end: number = this._end - this._start) {
    if (start < 0) {
      start = this._end - this._start + start
    }
    if (end && end < 0) {
      end = this._end - this._start + end
    }
    return new ImmuArray(this._data, this._start + start, this._start + end)
  }

  concat(array: ImmuArray<T> | T[] | T) {
    let immuArray: ImmuArray<T>
    if (array instanceof Array) {
      immuArray = new ImmuArray(array)
    } else if (array instanceof ImmuArray) {
      immuArray = array
    } else {
      immuArray = new ImmuArray([array])
    }
    for (let i = immuArray._start; i < immuArray._end; i++) {
      const item = immuArray._data[i]
      this._data.push(item)
    }
    return new ImmuArray(this._data, this._start, this._end + immuArray._end - immuArray._start)
  }

  shallowClone(): ImmuArray<T> {
    return new ImmuArray<T>(this._data)
  }

  private _resize() {
    if (this._data.length > (this._end - this._start) * 2) {
      this._data = this._data.slice(this._start, this._end)
    }
  }
}
