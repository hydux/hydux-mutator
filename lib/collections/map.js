"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
exports.defaultHash = utils_1.defaultHash;
var utils_2 = require("../utils");
function height(t) {
    if (t) {
        return t.height;
    }
    else {
        return 0;
    }
}
function create(left, value, right) {
    return {
        value: value,
        left: left,
        right: right,
        height: Math.max(height(left), height(right)) + 1,
    };
}
function impossible() {
    throw new Error('[hydux-mutator/map] imposible');
}
function balance(left, value, right) {
    var leftHeight = height(left);
    var rightHeit = height(right);
    if (leftHeight > rightHeit + 2) {
        if (!left) {
            return impossible();
        }
        else {
            if (height(left.left) >= height(left.right)) {
                return create(left.left, left.value, create(left.right, value, right));
            }
            else if (!left.right) {
                return impossible();
            }
            else {
                return create(create(left.left, left.value, left.right.left), left.right.value, create(left.right.right, value, right));
            }
        }
    }
    else if (rightHeit > leftHeight + 2) {
        if (!right) {
            return impossible();
        }
        else {
            if (height(right.right) >= height(right.right)) {
                return create(create(left, value, right.left), right.value, right.right);
            }
            else if (!right.left) {
                return impossible();
            }
            else {
                return create(create(left, value, right.left.left), right.left.value, create(right.left.right, right.value, right.right));
            }
        }
    }
    else {
        return create(left, value, right);
    }
}
var AddStatus;
(function (AddStatus) {
    AddStatus[AddStatus["none"] = 0] = "none";
    AddStatus[AddStatus["added"] = 1] = "added";
    AddStatus[AddStatus["updated"] = 2] = "updated";
})(AddStatus || (AddStatus = {}));
function add(key, value, tree, hash) {
    if (tree) {
        var newKeyHash = hash(key);
        var _a = tree.value, treeKey = _a[0], treeValue = _a[1];
        var rootKeyHash = hash(treeKey);
        if (newKeyHash === rootKeyHash) {
            if (treeValue === value) {
                return [AddStatus.none, tree];
            }
            else {
                return [AddStatus.updated, create(tree.left, [key, value], tree.right)];
            }
        }
        else if (newKeyHash < rootKeyHash) {
            var res = add(key, value, tree.left, hash);
            return [res[0], balance(res[1], tree.value, tree.right)];
        }
        else {
            var res = add(key, value, tree.right, hash);
            return [res[0], balance(tree.left, tree.value, res[1])];
        }
    }
    else {
        return [AddStatus.added, create(null, [key, value], null)];
    }
}
function minElt(value, tree) {
    if (!tree) {
        return value;
    }
    else if (!tree.left) {
        return tree.value;
    }
    else {
        return minElt(tree.value, tree.left);
    }
}
function removeMinElt(left, value, right) {
    if (!left) {
        return right;
    }
    else {
        return balance(removeMinElt(left.left, left.value, left.right), value, right);
    }
}
function internalMerge(left, right) {
    if (!left) {
        return right;
    }
    else if (!right) {
        return left;
    }
    else if (right) {
        return balance(left, minElt(right.value, right), removeMinElt(right.left, right.value, right.right));
    }
    return impossible();
}
function remove(key, tree, hash) {
    if (!tree) {
        return [false, null];
    }
    else {
        var keyHash = hash(key);
        var oldKeyHash = hash(tree.value[0]);
        if (keyHash === oldKeyHash) {
            return [true, internalMerge(tree.left, tree.right)];
        }
        else if (keyHash < oldKeyHash) {
            var res = remove(key, tree.left, hash);
            return [res[0], balance(res[1], tree.value, tree.right)];
        }
        else {
            var res = remove(key, tree.right, hash);
            return [res[0], balance(tree.left, tree.value, res[1])];
        }
    }
}
function mem(key, tree, hash) {
    if (!tree) {
        return false;
    }
    var keyHash = hash(key);
    var oldKeyHash = hash(tree.value[0]);
    return keyHash === oldKeyHash || mem(key, (keyHash < oldKeyHash) ? tree.left : tree.right, hash);
}
function get(key, tree, hash) {
    if (!tree) {
        return void 0;
    }
    var keyHash = hash(key);
    var oldKeyHash = hash(tree.value[0]);
    if (keyHash === oldKeyHash) {
        return tree.value[1];
    }
    return get(key, (keyHash < oldKeyHash) ? tree.left : tree.right, hash);
}
function unimplemented() {
    throw new Error('unimplemented');
}
function iterTree(tree, getVal) {
    var iter_1, item, iter_2, item;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!tree) {
                    return [2 /*return*/];
                }
                if (!tree.left) return [3 /*break*/, 4];
                iter_1 = iterTree(tree.left, getVal)[Symbol.iterator]();
                item = iter_1.next();
                _a.label = 1;
            case 1:
                if (!!item.done) return [3 /*break*/, 4];
                return [4 /*yield*/, item.value];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                item = iter_1.next();
                return [3 /*break*/, 1];
            case 4: return [4 /*yield*/, getVal(tree.value)];
            case 5:
                _a.sent();
                if (!tree.right) return [3 /*break*/, 9];
                iter_2 = iterTree(tree.right, getVal)[Symbol.iterator]();
                item = iter_2.next();
                _a.label = 6;
            case 6:
                if (!!item.done) return [3 /*break*/, 9];
                return [4 /*yield*/, item.value];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                item = iter_2.next();
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/];
        }
    });
}
var ImmuMap = /** @class */ (function () {
    function ImmuMap(entries, hash) {
        if (hash === void 0) { hash = utils_1.defaultHash; }
        var _this = this;
        this._tree = null;
        this._size = 0;
        this._hash = hash;
        if (entries) {
            utils_1.iter(entries, function (_a) {
                var k = _a[0], v = _a[1];
                var _b = add(k, v, _this._tree, hash), status = _b[0], tree = _b[1];
                _this._tree = tree;
                if (status === AddStatus.added) {
                    _this._size++;
                }
            });
        }
    }
    Object.defineProperty(ImmuMap.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    ImmuMap.prototype[Symbol.iterator] = function () {
        return this.entries();
    };
    ImmuMap.prototype.forEach = function (callbackfn, thisArg) {
        var _this = this;
        utils_1.iter(this.entries(), function (_a) {
            var key = _a[0], value = _a[1];
            return callbackfn.call(thisArg, value, key, _this);
        });
    };
    ImmuMap.prototype.get = function (key) {
        return get(key, this._tree, this._hash);
    };
    ImmuMap.prototype.has = function (key) {
        return mem(key, this._tree, this._hash);
    };
    ImmuMap.prototype.clear = function () {
        return new ImmuMap();
    };
    ImmuMap.prototype.set = function (key, value) {
        var _a = add(key, value, this._tree, this._hash), status = _a[0], tree = _a[1];
        if (status !== AddStatus.none) {
            var map = new ImmuMap();
            map._tree = tree;
            map._size = this._size;
            if (status === AddStatus.added) {
                map._size++;
            }
            return map;
        }
        else {
            return this;
        }
    };
    ImmuMap.prototype.delete = function (key) {
        var _a = remove(key, this._tree, this._hash), removed = _a[0], tree = _a[1];
        if (removed) {
            var map = new ImmuMap();
            map._tree = tree;
            map._size = this._size - 1;
            return map;
        }
        else {
            return this;
        }
    };
    ImmuMap.prototype.keys = function () {
        return iterTree(this._tree, function (v) { return v[0]; });
    };
    ImmuMap.prototype.values = function () {
        return iterTree(this._tree, function (v) { return v[1]; });
    };
    ImmuMap.prototype.entries = function () {
        return iterTree(this._tree, function (v) { return v; });
    };
    ImmuMap.prototype.toJSON = function () {
        var obj = {};
        utils_1.iter(this.entries(), function (_a) {
            var k = _a[0], v = _a[1];
            if (typeof k !== 'string' && typeof k !== 'number') {
                utils_2.error('map.toJSON failed, key: ', k, 'value:', v);
                throw new TypeError("map.toJSON requires map's key to be number or string, but got " + k);
            }
            obj[String(k)] = v;
        });
        return obj;
    };
    return ImmuMap;
}());
exports.default = ImmuMap;
//# sourceMappingURL=map.js.map