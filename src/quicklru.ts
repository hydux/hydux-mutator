// MIT © Sindre Sorhus
// Fork from https://github.com/sindresorhus/quick-lru
export default class QuickLRU {
  maxSize = 0
  cache = new Map()
  oldCache = new Map()
  _size = 0
  constructor(opts) {
    opts = Object.assign({}, opts)

    if (!(opts.maxSize && opts.maxSize > 0)) {
      throw new TypeError('`maxSize` must be a number greater than 0')
    }

    this.maxSize = opts.maxSize
  }

  _set(key, value) {
    this.cache.set(key, value)
    this._size++

    if (this._size >= this.maxSize) {
      this._size = 0
      this.oldCache = this.cache
      this.cache = new Map()
    }
  }

  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    if (this.oldCache.has(key)) {
      const value = this.oldCache.get(key)
      this._set(key, value)
      return value
    }
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.set(key, value)
    } else {
      this._set(key, value)
    }

    return this
  }

  has(key) {
    return this.cache.has(key) || this.oldCache.has(key)
  }

  delete(key) {
    if (this.cache.delete(key)) {
      this._size--
    }

    this.oldCache.delete(key)
  }
}

