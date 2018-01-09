"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var quicklru_1 = require("./quicklru");
var parser_1 = require("./parser");
var Cache = new quicklru_1.default({ maxSize: 50 });
var parse = function (str) { return parser_1.default.accessor.tryParse(str); };
function setCacheSize(maxSize) {
    if (maxSize === void 0) { maxSize = 50; }
    Cache = new quicklru_1.default({ maxSize: maxSize });
}
exports.setCacheSize = setCacheSize;
var isSet = function (val) { return typeof val !== 'undefined' && val !== null; };
var isFn = function (fn) { return typeof fn === 'function'; };
var isPlainObject = function (obj) { return !isSet(obj.constructor) || obj.constructor === Object; };
function clone(obj) {
    if (isPlainObject(obj)) {
        return tslib_1.__assign({}, obj);
    }
    if (isFn(obj.shallowClone)) {
        return obj.shallowClone();
    }
    var newObj = new obj.constructor();
    var keys = Object.keys(obj);
    var len = keys.length;
    while (len--) {
        var key = keys[len];
        newObj[key] = obj[key];
    }
    return newObj;
}
function getPathKeys(accessor, ctx) {
    if (ctx === void 0) { ctx = {}; }
    if (!isFn(accessor)) {
        return accessor;
    }
    var setter = accessor.toString();
    var cache = Cache.get(setter);
    if (cache) {
        for (var _i = 0, _a = cache.map; _i < _a.length; _i++) {
            var _b = _a[_i], i = _b[0], key = _b[1];
            cache.keys[i] = ctx[key];
        }
        return cache.keys;
    }
    var keys = [];
    var ast = parse(setter);
    var len = ast.keyPath.length;
    var map = [];
    for (var i = 0; i < len; i++) {
        var item = ast.keyPath[i];
        if (item.type === 'string' || item.type === 'number') {
            keys[i] = item.value;
        }
        else if (item.type === 'variable') {
            if (!(item.value in ctx)) {
                console.error('context', ctx);
                throw TypeError('Cannot find dynamic key in context:' + accessor);
            }
            keys[i] = ctx[item.value];
            map.push([i, item.value]);
        }
    }
    Cache.set(setter, {
        keys: keys,
        map: map,
    });
    return keys;
}
var MutateType;
(function (MutateType) {
    MutateType[MutateType["setIn"] = 1] = "setIn";
    MutateType[MutateType["updateIn"] = 2] = "updateIn";
})(MutateType || (MutateType = {}));
function mutate(record, accessor, type, updator, ctx) {
    var isUpdate = type === MutateType.updateIn;
    var keys = getPathKeys(accessor, ctx);
    if (isUpdate && isFn(record.updateIn)) {
        return record.updateIn(keys, updator);
    }
    else if (isFn(record.setIn)) {
        return record.setIn(keys, updator);
    }
    var newRecord = clone(record);
    var dist = newRecord;
    var src = record;
    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        src = src[key];
        dist = dist[key] = clone(src);
    }
    var lastKey = keys[keys.length - 1];
    dist[lastKey] =
        isUpdate
            ? updator(src[lastKey])
            : updator;
    return newRecord;
}
/**
 * get a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
function getIn(record, accessor, ctx) {
    var v = record;
    var keys = getPathKeys(accessor, ctx);
    if (isFn(record.getIn)) {
        return record.getIn(keys);
    }
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        v = record[key];
    }
    return v;
}
exports.getIn = getIn;
/**
 * Set a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 * @param ctx Dynamic key map.
 */
function setIn(record, accessor, value, ctx) {
    return mutate(record, accessor, MutateType.setIn, value, ctx);
}
exports.setIn = setIn;
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
function unsetIn(record, accessor, ctx) {
    return mutate(record, accessor, MutateType.setIn, void 0, ctx);
}
exports.unsetIn = unsetIn;
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 * @param ctx Dynamic key map.
 */
function updateIn(record, accessor, updator, ctx) {
    if (!updator) {
        return record;
    }
    return mutate(record, accessor, MutateType.updateIn, updator, ctx);
}
exports.updateIn = updateIn;
exports.default = { setIn: setIn, unsetIn: unsetIn, updateIn: updateIn };
//# sourceMappingURL=index.js.map