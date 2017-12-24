"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var quicklru_1 = require("./quicklru");
var cache = new quicklru_1.default({ maxSize: 50 });
var funRe = /(?:return|[\w$]+\s*\=\>)\s+[\w$]+(.*)\s*(?:;|}|$)/;
function setCacheSize(maxSize) {
    if (maxSize === void 0) { maxSize = 50; }
    cache = new quicklru_1.default({ maxSize: maxSize });
}
exports.setCacheSize = setCacheSize;
var isQuote = function (s) { return s === '"' || s === '\''; };
function lambda2path(accessor) {
    var setter = accessor.toString();
    var keys = cache.get(setter);
    if (keys) {
        return keys;
    }
    var m = setter.match(funRe);
    if (!m) {
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
    var newRecord = new record.constructor();
    quicklru_1.assign(newRecord, record);
    var dist = newRecord;
    var src = record;
    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        src = src[key];
        dist = dist[key] = new src.constructor();
        quicklru_1.assign(dist, src);
    }
    var lastKey = keys[keys.length - 1];
    dist[lastKey] =
        type === MutateType.updateIn
            ? updator(src[lastKey])
            : updator;
    return newRecord;
}
function setIn(record, accessor, value) {
    if (!value) {
        return record;
    }
    return mutate(record, accessor, MutateType.setIn, value);
}
exports.setIn = setIn;
function updateIn(record, accessor, updator) {
    if (!updator) {
        return record;
    }
    return mutate(record, accessor, MutateType.updateIn, updator);
}
exports.updateIn = updateIn;
exports.default = { setIn: setIn, updateIn: updateIn };
//# sourceMappingURL=index.js.map