"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSet = function (val) { return typeof val !== 'undefined' && val !== null; };
exports.isFn = function (fn) { return typeof fn === 'function'; };
exports.isPojo = function (obj) { return !exports.isSet(obj.constructor) || obj.constructor === Object; };
exports.error = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return console.error.apply(console, ['[hydux-mutator]'].concat(args));
};
exports.isObj = function (obj) { return typeof obj === 'object' && obj; };
//# sourceMappingURL=utils.js.map