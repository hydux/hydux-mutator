"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toArray(iter) {
    var arr = [];
    for (var item = iter.next(); !item.done; item = iter.next()) {
        arr.push(item.value);
    }
    return arr;
}
exports.toArray = toArray;
//# sourceMappingURL=utils.js.map