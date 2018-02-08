"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_1 = require("./map");
var utils_1 = require("./utils");
exports.defaultHash = utils_1.defaultHash;
var ImmuSet = /** @class */ (function () {
    function ImmuSet(values, hash) {
        if (hash === void 0) { hash = utils_1.defaultHash; }
        if (values) {
            this._map = new map_1.default(utils_1.iterMap(values, function (v) { return [v, v]; }), hash);
        }
        else {
            this._map = new map_1.default([], hash);
        }
    }
    Object.defineProperty(ImmuSet.prototype, "size", {
        get: function () {
            return this._map.size;
        },
        enumerable: true,
        configurable: true
    });
    ImmuSet.prototype[Symbol.iterator] = function () {
        return this._map.keys();
    };
    ImmuSet.prototype.add = function (value) {
        var map = this._map.set(value, value);
        if (map.size > this._map.size) {
            var newSet = new ImmuSet();
            newSet._map = map;
            return newSet;
        }
        return this;
    };
    ImmuSet.prototype.clear = function () {
        return new ImmuSet();
    };
    ImmuSet.prototype.delete = function (value) {
        var map = this._map.delete(value);
        if (map.size < this._map.size) {
            var newSet = new ImmuSet();
            newSet._map = map;
            return newSet;
        }
        return this;
    };
    ImmuSet.prototype.entries = function () {
        return this._map.entries();
    };
    ImmuSet.prototype.keys = function () {
        return this._map.keys();
    };
    ImmuSet.prototype.values = function () {
        return this._map.values();
    };
    ImmuSet.prototype.toArray = function () {
        var arr = [];
        utils_1.iter(this.keys(), function (item) { return arr.push(item); });
        return arr;
    };
    ImmuSet.prototype.toJSON = function () {
        return this.toArray();
    };
    ImmuSet.prototype.forEach = function (callbackfn, thisArg) {
        var _this = this;
        this._map.forEach(function (v1, v2, _) { return callbackfn(v1, v2, _this); }, thisArg);
    };
    ImmuSet.prototype.has = function (value) {
        return this._map.has(value);
    };
    return ImmuSet;
}());
exports.default = ImmuSet;
//# sourceMappingURL=set.js.map