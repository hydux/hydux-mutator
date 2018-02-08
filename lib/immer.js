"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var dummy = {};
function createHandler(_a) {
    var _b = _a.keys, keys = _b === void 0 ? [] : _b, onSet = _a.onSet;
    return {
        get: function (target, property, receiver) {
            var value = target[property];
            if (typeof value === 'object' && value !== null) {
                return new Proxy(target[property] || dummy, createHandler({
                    keys: keys.concat([property]),
                    onSet: onSet
                }));
            }
            return value;
        },
        set: function (target, property, value, receiver) {
            onSet && onSet(keys.concat([property]), value);
            return true;
        },
    };
}
function immer(state, update) {
    var nextState = state;
    var proxy = new Proxy(state, createHandler({
        keys: [],
        onSet: function (keys, val) {
            nextState = index_1.setIn(nextState, keys, val);
        }
    }));
    update(proxy, state);
    return nextState;
}
exports.default = immer;
//# sourceMappingURL=immer.js.map