"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var quicklru_1 = require("./quicklru");
var parser_1 = require("./parser");
var utils_1 = require("./utils");
var Cache = new quicklru_1.default({ maxSize: 50 });
var parse = function (str) { return parser_1.default.accessor.tryParse(str); };
function setCacheSize(maxSize) {
    if (maxSize === void 0) { maxSize = 50; }
    Cache = new quicklru_1.default({ maxSize: maxSize });
}
exports.setCacheSize = setCacheSize;
function clone(obj) {
    if (utils_1.isPojo(obj)) {
        return tslib_1.__assign({}, obj);
    }
    var customClone = obj.shallowClone;
    if (utils_1.isFn(customClone)) {
        return customClone.call(obj);
    }
    var newObj = new obj.constructor();
    var keys = Object.keys(obj);
    var len = keys.length;
    while (len--) {
        var key = keys[keys.length - 1 - len];
        newObj[key] = obj[key];
    }
    return newObj;
}
function getPathKeys(accessor, ctx) {
    if (ctx === void 0) { ctx = []; }
    if (!utils_1.isFn(accessor)) {
        return accessor;
    }
    var setter = accessor.toString();
    var cache = Cache.get(setter);
    if (cache) {
        var len_1 = cache.dynamicKeys.length;
        for (var i = 0; i < len_1; i++) {
            cache.keys[cache.dynamicKeys[i]] = ctx[i];
        }
        return cache.keys;
    }
    var keys = [];
    var ast = null;
    try {
        ast = parse(setter);
    }
    catch (err) {
        utils_1.error('parse accessor failed, accessor:', setter);
        throw err;
    }
    var len = ast.keyPath.length;
    var dynamicKeys = [];
    var variableIdx = 0;
    for (var i = 0; i < len; i++) {
        var item = ast.keyPath[i];
        if (item.type === 'string' || item.type === 'number') {
            keys[i] = item.value;
        }
        else if (item.type === 'variable') {
            keys[i] = ctx[variableIdx++];
            dynamicKeys.push(i);
        }
    }
    Cache.set(setter, {
        keys: keys,
        dynamicKeys: dynamicKeys,
    });
    return keys;
}
exports.getPathKeys = getPathKeys;
var MutateType;
(function (MutateType) {
    MutateType[MutateType["setIn"] = 1] = "setIn";
    MutateType[MutateType["updateIn"] = 2] = "updateIn";
})(MutateType || (MutateType = {}));
function set(src, key, val) {
    src = src || {};
    var customSet = src.set;
    if (utils_1.isFn(customSet)) {
        return customSet.call(src, key, val);
    }
    var dist = clone(src);
    dist[key] = val;
    return dist;
}
function mutate(record, accessor, type, updator, ctx) {
    var isUpdate = type === MutateType.updateIn;
    var keys = getPathKeys(accessor, ctx);
    var keysLastIdx = keys.length - 1;
    var temp = record;
    var stack = [record];
    for (var i = 0; i < keysLastIdx; i++) {
        var key = keys[i];
        stack.push(temp = temp[key] || {});
    }
    var dist = isUpdate ? updator(stack[keysLastIdx][keys[keysLastIdx]]) : updator;
    for (var i = keysLastIdx; i >= 0; i--) {
        temp = stack[i];
        dist = set(temp, keys[i], dist);
    }
    return dist;
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
    if (utils_1.isFn(record.getIn)) {
        return record.getIn(keys);
    }
    var len = keys.length;
    for (var i = 0; i < len; i++) {
        var key = keys[i];
        v = utils_1.isObj(v)
            ? utils_1.isFn(v.get)
                ? v.get(key)
                : v[key]
            : undefined;
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