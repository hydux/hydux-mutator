// MIT © Sindre Sorhus
// Fork from https://github.com/sindresorhus/quick-lru

export default class QuickLRU {
  maxSize = 0
  cache = {}
  oldCache = {}
  _size = 0
  constructor(opts) {
    opts = { ...opts }

    if (!(opts.maxSize && opts.maxSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0')
    }

    this.maxSize = opts.maxSize
  }

  _set(key, value) {
    this.cache[key] = value
    this._size++

    if (this._size >= this.maxSize) {
      this._size = 0
      this.oldCache = this.cache
      this.cache = {}
    }
  }

  get<T>(key): T | void {
    if (typeof this.cache[key] !== 'undefined') {
      return this.cache[key]
    }

    if (typeof this.oldCache[key] !== 'undefined') {
      const value = this.oldCache[key]
      this._set(key, value)
      return value
    }
  }

  set<T>(key: string, value: T): this {
    if (typeof this.cache[key] !== 'undefined') {
      this.cache[key] = value
    } else {
      this._set(key, value)
    }

    return this
  }

  has(key) {
    return typeof this.cache[key] !== 'undefined' || typeof this.oldCache[key] !== 'undefined'
  }

  delete(key) {
    if (delete this.cache[key]) {
      this._size--
    }

    delete this.oldCache[key]
  }
}
