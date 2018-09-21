"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var list_1 = require("./list");
exports.ImmuList = list_1.default;
var map_1 = require("./map");
exports.ImmuMap = map_1.default;
var set_1 = require("./set");
exports.ImmuSet = set_1.default;
tslib_1.__exportStar(require("./utils"), exports);
exports.default = { ImmuList: list_1.default, ImmuMap: map_1.default, ImmuSet: set_1.default };
function stringify(val, replacer, space) {
    return JSON.stringify(val, replacer, space);
}
exports.stringify = stringify;
function parse(text, reviver) {
    return JSON.parse(text, function (key, val) {
        if (typeof val === 'object' && val && val.class) {
            switch (val.class) {
                case '@hydux/ImmuList':
                    return new list_1.default(val.data);
                case '@hydux/ImmuSet':
                    return new set_1.default(val.data);
                case '@hydux/ImmuMap':
                    return new map_1.default(val.data);
            }
        }
        return val;
    });
}
exports.parse = parse;
//# sourceMappingURL=index.js.map