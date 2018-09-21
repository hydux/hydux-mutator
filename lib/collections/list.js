"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var List = require("@funkia/list");
exports.List = List;
function iteri(len) {
    var i;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < len)) return [3 /*break*/, 4];
                return [4 /*yield*/, i];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}
var ImmuList = /** @class */ (function () {
    function ImmuList(values) {
        if (values) {
            this._list = List.fromArray(values);
        }
        else {
            this._list = List.empty();
        }
    }
    Object.defineProperty(ImmuList.prototype, "length", {
        get: function () {
            return this._list.length;
        },
        enumerable: true,
        configurable: true
    });
    ImmuList.prototype.toString = function () {
        return 'ImmuList [' + List.toArray(this._list).toString() + ']';
    };
    ImmuList.prototype.toLocaleString = function () {
        return 'ImmuList [' + List.toArray(this._list).toLocaleString() + ']';
    };
    ImmuList.prototype.get = function (i) {
        return List.nth(i, this._list);
    };
    ImmuList.prototype.set = function (i, val) {
        var list = this._list;
        if (i < 0 || i >= list.length) {
            console.error("index out of range (0, " + this._list.length + "), this would silent ignored");
        }
        list = List.update(i, val, this._list);
        return this._new(list);
    };
    ImmuList.prototype.remove = function (from, amount) {
        if (amount === void 0) { amount = 1; }
        var list = List.remove(from, amount, this._list);
        return this._new(list);
    };
    ImmuList.prototype.includes = function (item) {
        return List.includes(item, this._list);
    };
    ImmuList.prototype.append = function (item) {
        return this._new(List.append(item, this._list));
    };
    ImmuList.prototype.prepend = function (item) {
        return this._new(List.prepend(item, this._list));
    };
    ImmuList.prototype.first = function () {
        return List.first(this._list);
    };
    ImmuList.prototype.last = function () {
        return List.last(this._list);
    };
    ImmuList.prototype.tail = function () {
        return this._new(List.tail(this._list));
    };
    ImmuList.prototype.edit = function (cb) {
        return this._new(cb(this._list, List));
    };
    ImmuList.prototype.editWithAny = function (cb) {
        return cb(this._list, List);
    };
    ImmuList.prototype.toArray = function () {
        return List.toArray(this._list);
    };
    ImmuList.prototype.toJSON = function () {
        return {
            class: '@hydux/ImmuList',
            data: this.toArray(),
        };
    };
    ImmuList.prototype.concat = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var list = this._list;
        utils_1.iter(items, function (item) {
            if (item instanceof ImmuList) {
                list = List.concat(list, item._list);
            }
            else if (item instanceof Array) {
                list = item.reduce(function (l, i) { return List.append(i, l); }, list);
            }
            else {
                list = List.append(item, list);
            }
        });
        if (list.length > this._list.length) {
            return this._new(list);
        }
        return this;
    };
    ImmuList.prototype.join = function (separator) {
        var sep = separator || ',';
        return List.join(sep, this._list);
    };
    ImmuList.prototype.slice = function (start, end) {
        var newList = List.slice(start || 0, end || this._list.length, this._list);
        if (newList.length !== this._list.length) {
            return this._new(newList);
        }
        return this;
    };
    ImmuList.prototype.indexOf = function (searchElement, fromIndex) {
        var list = this._list;
        if (fromIndex) {
            list = List.slice(fromIndex, this._list.length, list);
        }
        return List.indexOf(searchElement, list);
    };
    ImmuList.prototype.every = function (callbackfn, thisArg) {
        var _this = this;
        var i = 0;
        return List.every(function (v) {
            return callbackfn.call(thisArg, v, i++, _this);
        }, this._list);
    };
    ImmuList.prototype.some = function (callbackfn, thisArg) {
        var _this = this;
        var i = 0;
        return List.some(function (v) {
            return callbackfn.call(thisArg, v, i++, _this);
        }, this._list);
    };
    ImmuList.prototype.forEach = function (callbackfn, thisArg) {
        var _this = this;
        var i = 0;
        List.foldl(function (_, v) { return (callbackfn.call(thisArg, v, i++, _this), undefined); }, undefined, this._list);
    };
    ImmuList.prototype.map = function (callbackfn, thisArg) {
        var _this = this;
        var i = 0;
        var list = List.map(function (v) { return callbackfn.call(thisArg, v, i++, _this); }, this._list);
        return this._new(list);
    };
    ImmuList.prototype.filter = function (callbackfn, thisArg) {
        var _this = this;
        var i = 0;
        var list = List.filter(function (v) { return callbackfn.call(thisArg, v, i++, _this); }, this._list);
        if (list.length !== this._list.length) {
            return this._new(list);
        }
        return this;
    };
    ImmuList.prototype.reduce = function (callbackfn, initialValue, thisArg) {
        var _this = this;
        var i = 0;
        return List.foldl(function (acc, v) { return callbackfn.call(thisArg, acc, v, i++, _this); }, initialValue, this._list);
    };
    ImmuList.prototype.reduceRight = function (callbackfn, initialValue, thisArg) {
        var _this = this;
        var i = 0;
        return List.foldr(function (v, acc) { return callbackfn.call(thisArg, acc, v, i++, _this); }, initialValue, this._list);
    };
    ImmuList.prototype[Symbol.iterator] = function () {
        return utils_1.iterMap(this._list, function (v) { return v; });
    };
    ImmuList.prototype.entries = function () {
        var i = 0;
        return utils_1.iterMap(this._list, function (v) { return [i++, v]; });
    };
    ImmuList.prototype.keys = function () {
        return iteri(this._list.length);
    };
    ImmuList.prototype.values = function () {
        return utils_1.iterMap(this._list, function (v) { return v; });
    };
    ImmuList.prototype.find = function (predicate, thisArg) {
        var _this = this;
        var i = 0;
        return List.find(function (v) { return predicate.call(thisArg, v, i++, _this); }, this._list);
    };
    ImmuList.prototype.findIndex = function (predicate, thisArg) {
        var _this = this;
        var i = 0;
        return List.findIndex(function (v) { return predicate.call(thisArg, v, i++, _this); }, this._list);
    };
    ImmuList.prototype._new = function (list) {
        var newImmuList = new ImmuList();
        newImmuList._list = list;
        return newImmuList;
    };
    return ImmuList;
}());
exports.default = ImmuList;
//# sourceMappingURL=list.js.map