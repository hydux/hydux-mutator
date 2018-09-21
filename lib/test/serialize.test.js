"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var collections_1 = require("../collections");
var assert = require("assert");
describe('serialize', function () {
    it('list', function () {
        var list = new collections_1.ImmuList(['12', 23, { aa: 1 }]);
        console.log('stringify(list)', collections_1.stringify(list));
        assert.deepEqual(collections_1.stringify(list), "{\"class\":\"@hydux/ImmuList\",\"data\":[\"12\",23,{\"aa\":1}]}");
        var deserialized = collections_1.parse(collections_1.stringify(list));
        assert(deserialized instanceof collections_1.ImmuList);
        assert.deepEqual(list.length, deserialized.length);
        for (var i = 0; i < list.length; i++) {
            assert.deepEqual(list.get(i), deserialized.get(i));
        }
    });
    it('map', function () {
        var map = new collections_1.ImmuMap([['123', '12'], ['1', 23], ['123', { aa: 1 }]]);
        console.log('stringify(list)', collections_1.stringify(map));
        assert.deepEqual(collections_1.stringify(map), "{\"class\":\"@hydux/ImmuMap\",\"data\":[[\"1\",23],[\"123\",{\"aa\":1}]]}");
        var deserialized = collections_1.parse(collections_1.stringify(map));
        console.log('deserialized');
        assert(deserialized instanceof collections_1.ImmuMap);
        assert.deepEqual(map.size, deserialized.size);
        collections_1.iter(map.keys(), function (key) {
            assert.deepEqual(map.get(key), deserialized.get(key));
        });
    });
    it('set', function () {
        var set = new collections_1.ImmuSet(['12', 23, { aa: 1 }]);
        console.log('stringify(list)', collections_1.stringify(set));
        assert.deepEqual(collections_1.stringify(set), "{\"class\":\"@hydux/ImmuSet\",\"data\":[23,{\"aa\":1},\"12\"]}");
        var deserialized = collections_1.parse(collections_1.stringify(set));
        assert(deserialized instanceof collections_1.ImmuSet);
        assert.deepEqual(set.size, deserialized.size);
        var _a = [set.toArray(), deserialized.toArray()], setArr = _a[0], deArr = _a[1];
        assert.deepEqual(setArr, deArr);
    });
    it('mixed', function () {
        var mixed = {
            list: new collections_1.ImmuList([
                '12',
                23,
                { aa: new collections_1.ImmuSet([1, 'aa', 'bb']) },
            ]),
            map: new collections_1.ImmuMap([['aa', 'bb'], ['cc', 'dd'], ['ee', new collections_1.ImmuList([1, 2, 3])]]),
            set: new collections_1.ImmuSet([1, 2, 3])
        };
        console.log(collections_1.stringify(mixed));
        assert.deepEqual(mixed, collections_1.parse(collections_1.stringify(mixed)));
    });
});
//# sourceMappingURL=serialize.test.js.map