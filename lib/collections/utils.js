"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function iterMap(list, cb) {
    var _i, list_1, item, iter, item;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(list instanceof Array)) return [3 /*break*/, 5];
                _i = 0, list_1 = list;
                _a.label = 1;
            case 1:
                if (!(_i < list_1.length)) return [3 /*break*/, 4];
                item = list_1[_i];
                return [4 /*yield*/, cb(item)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
            case 5:
                iter = list[Symbol.iterator]();
                item = iter.next();
                _a.label = 6;
            case 6:
                if (!!item.done) return [3 /*break*/, 9];
                return [4 /*yield*/, cb(item.value)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                item = iter.next();
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/];
        }
    });
}
exports.iterMap = iterMap;
function iter(list, cb) {
    if (list instanceof Array) {
        return list.forEach(cb);
    }
    var iter = list[Symbol.iterator]();
    for (var item = iter.next(); !item.done; item = iter.next()) {
        cb(item.value);
    }
}
exports.iter = iter;
function getType(key) {
    var t = Object.prototype.toString.call(key);
    return t.slice(8, -1).toLowerCase();
}
var objUid = 0;
var objUidKey = typeof Symbol !== 'undefined' ? Symbol('_hmuid_') : '_hmuid_';
var objUidMap = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
function defaultHash(key) {
    switch (getType(key)) {
        case 'undefined':
        case 'null':
        case 'boolean':
        case 'number':
        case 'regexp':
            return key + '';
        case 'date':
            return '📅' + key.getTime();
        case 'string':
            return '📝' + key;
        case 'array':
            return '🔗' + key.map(function (k) { return defaultHash(k); }).join('⁞');
        default:
            if (objUidMap) {
                var uid = objUidMap.get(key);
                if (!uid) {
                    uid = ++objUid;
                    objUidMap.set(key, uid);
                }
                return '⭕️' + uid;
            }
            // TODO: Don't use expandos when Object.defineProperty is not available?
            if (!key.hasOwnProperty(objUidKey)) {
                key[objUidKey] = ++objUid;
                hide(key, objUidKey);
            }
            return '⭕️' + key[objUidKey];
    }
}
exports.defaultHash = defaultHash;
function hide(obj, prop) {
    // Make non iterable if supported
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop, { enumerable: false });
    }
}
//# sourceMappingURL=utils.js.map