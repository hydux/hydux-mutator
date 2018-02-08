"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var set_1 = require("../collections/set");
var utils_1 = require("./utils");
var set = new set_1.default();
for (var _i = 0, _a = utils_1.toArray(Array(3).keys()); _i < _a.length; _i++) {
    var item = _a[_i];
    set = set.add(item);
}
describe('set', function () {
    it('init', function () {
        var set2 = new set_1.default([0, 1, 2]);
        assert.deepEqual(set2.toJSON(), set.toJSON());
    });
    it('add/has/delete', function () {
        assert.deepEqual(set.toArray(), [0, 1, 2], '1');
        assert.equal(set.size, 3, '2');
        assert.equal(set.has(1), true, '3');
        assert.equal(set.has(10), false, '4');
        assert.equal(set.delete(1).has(1), false, '5');
        assert.notEqual(set.delete(1), set, '6');
    });
    it('keys/values/entries', function () {
        assert.deepEqual(utils_1.toArray(set.keys()), [0, 1, 2]);
        assert.deepEqual(utils_1.toArray(set.delete(0).keys()), [1, 2]);
        assert.deepEqual(utils_1.toArray(set.values()), [0, 1, 2]);
        assert.deepEqual(utils_1.toArray(set.entries()), [[0, 0], [1, 1], [2, 2]]);
    });
    it('object', function () {
        var _a = [{}, {}, {}, {}], k1 = _a[0], k2 = _a[1], k3 = _a[2], k4 = _a[3];
        var _b = [{}, {}, {}, {}], v1 = _b[0], v2 = _b[1], v3 = _b[2], v4 = _b[3];
        var set = new set_1.default([k1, k2, k3, k4]);
        assert.equal(set.has(k1), true);
        assert.equal(set.has(k2), true);
        assert.equal(set.has(k3), true);
        assert.equal(set.has(k4), true);
        assert.equal(set.delete(k1).has(k1), false);
    });
    it('size', function () {
        assert.deepEqual(set.size, 3);
        assert.deepEqual(set.add(5).size, 4);
        assert.deepEqual(set.add(1).size, 3);
        assert.deepEqual(set.add(1).size, 3);
        assert.deepEqual(set.delete(1).size, 2);
        assert.deepEqual(set.clear().size, 0);
    });
});
//# sourceMappingURL=set.test.js.map