"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var quicklru_1 = require("./quicklru");
var cache = new quicklru_1.default({ maxSize: 50 });
var funRe = /(?:return|[\w$]+\s*\=\>)\s+[\w$]+([^;}]*)?\s*(?:;|}|$)/;
function setCacheSize(maxSize) {
    if (maxSize === void 0) { maxSize = 50; }
    cache = new quicklru_1.default({ maxSize: maxSize });
}
exports.setCacheSize = setCacheSize;
var isSet = function (val) { return typeof val !== 'undefined' && val !== null; };
var isFn = function (fn) { return typeof fn === 'function'; };
var isPlainObject = function (obj) { return !isSet(obj.constructor) || obj.constructor === Object; };
function clone(obj) {
    if (isPlainObject(obj)) {
        return tslib_1.__assign({}, obj);
    }
    if (isFn(obj.clone)) {
        return obj.clone();
    }
    var newObj = new obj.constructor();
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        newObj[key] = obj[key];
    }
    // for (const key in obj) {
    //   if (obj.hasOwnProperty(key)) {
    //   }
    // }
    return newObj;
}
var isQuote = function (s) { return s === '"' || s === '\''; };
function lambda2path(accessor) {
    var setter = accessor.toString();
    var keys = cache.get(setter);
    if (keys) {
        return keys;
    }
    var m = setter.match(funRe);
    if (!m || m[0].indexOf('(') >= 0) {
        throw new Error('Invalid setter:' + setter);
    }
    var pathStr = m[1];
    var start = 0;
    keys = [];
    var push = function (str) { return str && keys.push(str); };
    for (var i = 0; i < pathStr.length; i++) {
        var c = pathStr[i];
        if (c === '.') {
            push(pathStr.slice(start, i));
            start = i + 1;
        }
        else if (c === '[') {
            push(pathStr.slice(start, i));
            if (isQuote(pathStr[i + 1])) {
                start = i + 2;
            }
            else {
                start = i + 1;
            }
        }
        else if (c === ']') {
            if (isQuote(pathStr[i - 1])) {
                push(pathStr.slice(start, i - 1));
            }
            else {
                push(pathStr.slice(start, i));
            }
            start = i + 1;
        }
    }
    push(pathStr.slice(start));
    cache.set(setter, keys);
    return keys;
}
var MutateType;
(function (MutateType) {
    MutateType[MutateType["setIn"] = 1] = "setIn";
    MutateType[MutateType["updateIn"] = 2] = "updateIn";
})(MutateType || (MutateType = {}));
function mutate(record, accessor, type, updator) {
    var keys = typeof accessor === 'function'
        ? lambda2path(accessor)
        : accessor;
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
        type === MutateType.updateIn
            ? updator(src[lastKey])
            : updator;
    return newRecord;
}
/**
 * Set a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 */
function setIn(record, accessor, value) {
    return mutate(record, accessor, MutateType.setIn, value);
}
exports.setIn = setIn;
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 */
function unsetIn(record, accessor) {
    return mutate(record, accessor, MutateType.setIn, void 0);
}
exports.unsetIn = unsetIn;
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 */
function updateIn(record, accessor, updator) {
    if (!updator) {
        return record;
    }
    return mutate(record, accessor, MutateType.updateIn, updator);
}
exports.updateIn = updateIn;
exports.default = { setIn: setIn, unsetIn: unsetIn, updateIn: updateIn };
//# sourceMappingURL=index.js.map