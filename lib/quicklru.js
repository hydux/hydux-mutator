"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// MIT © Sindre Sorhus
// Fork from https://github.com/sindresorhus/quick-lru
var QuickLRU = /** @class */ (function () {
    function QuickLRU(opts) {
        this.maxSize = 0;
        this.cache = new Map();
        this.oldCache = new Map();
        this._size = 0;
        opts = Object.assign({}, opts);
        if (!(opts.maxSize && opts.maxSize > 0)) {
            throw new TypeError('`maxSize` must be a number greater than 0');
        }
        this.maxSize = opts.maxSize;
    }
    QuickLRU.prototype._set = function (key, value) {
        this.cache.set(key, value);
        this._size++;
        if (this._size >= this.maxSize) {
            this._size = 0;
            this.oldCache = this.cache;
            this.cache = new Map();
        }
    };
    QuickLRU.prototype.get = function (key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        if (this.oldCache.has(key)) {
            var value = this.oldCache.get(key);
            this._set(key, value);
            return value;
        }
    };
    QuickLRU.prototype.set = function (key, value) {
        if (this.cache.has(key)) {
            this.cache.set(key, value);
        }
        else {
            this._set(key, value);
        }
        return this;
    };
    QuickLRU.prototype.has = function (key) {
        return this.cache.has(key) || this.oldCache.has(key);
    };
    QuickLRU.prototype.delete = function (key) {
        if (this.cache.delete(key)) {
            this._size--;
        }
        this.oldCache.delete(key);
    };
    return QuickLRU;
}());
exports.default = QuickLRU;
//# sourceMappingURL=quicklru.js.map