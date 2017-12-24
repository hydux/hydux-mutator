"use strict";
// MIT © Sindre Sorhus
// Fork from https://github.com/sindresorhus/quick-lru
Object.defineProperty(exports, "__esModule", { value: true });
function assign(obj1, obj2) {
    for (var key in obj2) {
        obj1[key] = obj2[key];
    }
    return obj1;
}
exports.assign = assign;
var QuickLRU = /** @class */ (function () {
    function QuickLRU(opts) {
        this.maxSize = 0;
        this.cache = {};
        this.oldCache = {};
        this._size = 0;
        opts = assign({}, opts);
        if (!(opts.maxSize && opts.maxSize > 0)) {
            throw new TypeError('`maxSize` must be a number greater than 0');
        }
        this.maxSize = opts.maxSize;
    }
    QuickLRU.prototype._set = function (key, value) {
        this.cache[key] = value;
        this._size++;
        if (this._size >= this.maxSize) {
            this._size = 0;
            this.oldCache = this.cache;
            this.cache = {};
        }
    };
    QuickLRU.prototype.get = function (key) {
        if (typeof this.cache[key] !== 'undefined') {
            return this.cache[key];
        }
        if (typeof this.oldCache[key] !== 'undefined') {
            var value = this.oldCache[key];
            this._set(key, value);
            return value;
        }
    };
    QuickLRU.prototype.set = function (key, value) {
        if (typeof this.cache[key] !== 'undefined') {
            this.cache[key] = value;
        }
        else {
            this._set(key, value);
        }
        return this;
    };
    QuickLRU.prototype.has = function (key) {
        return typeof this.cache[key] !== 'undefined' || typeof this.oldCache[key] !== 'undefined';
    };
    QuickLRU.prototype.delete = function (key) {
        if (delete this.cache[key]) {
            this._size--;
        }
        delete this.oldCache[key];
    };
    return QuickLRU;
}());
exports.default = QuickLRU;
//# sourceMappingURL=quicklru.js.map