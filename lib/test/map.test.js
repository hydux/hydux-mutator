"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var map_1 = require("../collections/map");
var utils_1 = require("./utils");
var index_1 = require("../index");
var map = new map_1.default();
var book = {
    title: 'Some Title',
    books: new map_1.default([
        ['book1', { title: 'book1' }],
        ['book2', { title: 'book2' }],
        ['book3', { title: 'book3' }],
    ]),
};
for (var _i = 0, _a = utils_1.toArray(Array(3).keys()); _i < _a.length; _i++) {
    var item = _a[_i];
    map = map.set(item, item + 1);
}
describe('map', function () {
    it('init', function () {
        var map2 = new map_1.default([[0, 1], [1, 2], [2, 3]]);
        assert.deepEqual(map2.toJSON(), map.toJSON());
    });
    it('get/set/has', function () {
        assert.equal(map.get(0), 1, '1');
        assert.equal(map.get(1), 2, '2');
        assert.equal(map.get(5), undefined, '3');
        var nextMap = map.set(0, 10);
        assert.equal(map.get(0), 1, '5');
        assert.equal(nextMap.get(0), 10, '6');
        assert.notEqual(map, nextMap, '7');
        assert.equal(map.has(0), true, '8');
        assert.equal(map.has(-1), false, '9');
    });
    it('keys/values/entries', function () {
        assert.deepEqual(utils_1.toArray(map.keys()), [0, 1, 2]);
        assert.deepEqual(utils_1.toArray(map.delete(0).keys()), [1, 2]);
        assert.deepEqual(utils_1.toArray(map.values()), [1, 2, 3]);
        assert.deepEqual(utils_1.toArray(map.entries()), [[0, 1], [1, 2], [2, 3]]);
    });
    it('object', function () {
        var _a = [{}, {}, {}, {}], k1 = _a[0], k2 = _a[1], k3 = _a[2], k4 = _a[3];
        var _b = [{}, {}, {}, {}], v1 = _b[0], v2 = _b[1], v3 = _b[2], v4 = _b[3];
        var map = new map_1.default([[k1, v1], [k2, v2], [k3, v3], [k4, v4]]);
        assert.equal(map.get(k1), v1);
        assert.equal(map.get(k2), v2);
        assert.equal(map.get(k3), v3);
        assert.equal(map.get(k4), v4);
        assert.equal(map.delete(k1).get(k1), undefined);
    });
    it('toJSON', function () {
        assert.deepEqual(map.toJSON(), {
            class: '@hydux/ImmuMap',
            data: [[0, 1], [1, 2], [2, 3]]
        });
    });
    it('size', function () {
        assert.deepEqual(map.size, 3);
        assert.deepEqual(map.set(5, 1).size, 4);
        assert.deepEqual(map.set(1, 5).size, 3);
        assert.deepEqual(map.set(1, 2).size, 3);
        assert.deepEqual(map.delete(1).size, 2);
        assert.deepEqual(map.clear().size, 0);
    });
    it('setIn', function () {
        var newBook = index_1.setIn(book, function (_) { return _.books.get('book1').title; }, 'ChangedTitle');
        assert.equal(newBook.books.get('book1').title, 'ChangedTitle');
        assert.equal(newBook.books.get('book2').title, 'book2');
        assert.equal(newBook.books.get('book3').title, 'book3');
        assert.notEqual(newBook.books.get('book1'), book.books.get('book1'));
        assert.equal(book.books.get('book1').title, 'book1');
        assert.notEqual(newBook.books, book.books);
        assert.notEqual(newBook, book);
        assert.equal(newBook.books.get('book2'), book.books.get('book2'));
        assert.equal(newBook.books.get('book3'), book.books.get('book3'));
        var k = 'book2';
        var newBook2 = index_1.setIn(book, function (_) { return _.books.get(k).title; }, 'ChangedTitle', [k]);
        assert.equal(newBook2.books.get('book2').title, 'ChangedTitle');
        assert.equal(index_1.getIn(newBook2, function (_) { return _.books.get('book2').title; }), 'ChangedTitle');
    });
});
//# sourceMappingURL=map.test.js.map