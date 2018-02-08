"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var list_1 = require("../collections/list");
var index_1 = require("../index");
var utils_1 = require("./utils");
function sleep(ns) {
    return new Promise(function (resolve) { return setTimeout(resolve, ns); });
}
var list = new list_1.default([1, 2, 3]);
var book = {
    title: 'Some Title',
    related: new list_1.default([{
            title: 'book0',
            related: new list_1.default(),
        }, {
            title: 'book1',
            related: new list_1.default(),
        }, {
            title: 'book2',
            related: new list_1.default(),
        }]),
};
describe('list', function () {
    it('init', function () {
        var list = new list_1.default([1, 2, 3]);
        assert.deepEqual(list.toArray(), [1, 2, 3]);
    });
    it('append', function () {
        assert.deepEqual(list.toArray(), [1, 2, 3]);
        var nextList = list.append(4);
        assert.notEqual(nextList, list);
        assert.deepEqual(nextList.get(3), 4);
        assert.deepEqual(nextList.toArray(), [1, 2, 3, 4]);
        assert.deepEqual(list.toArray(), [1, 2, 3]);
    });
    it('append', function () {
        assert.deepEqual(list.toArray(), [1, 2, 3]);
        var nextList = list.prepend(4);
        assert.notEqual(nextList, list);
        assert.deepEqual(nextList.get(0), 4);
        assert.deepEqual(nextList.get(3), 3);
        assert.deepEqual(nextList.toArray(), [4, 1, 2, 3]);
        assert.deepEqual(list.toArray(), [1, 2, 3]);
    });
    it('reduce', function () {
        var acc = list.reduce(function (acc, item, i) {
            return (acc.push([item, i]), acc);
        }, []);
        assert.deepEqual(acc, [[1, 0], [2, 1], [3, 2]]);
    });
    it('reduceRight', function () {
        var acc = list.reduceRight(function (acc, item, i) {
            return (acc.push([item, i]), acc);
        }, []);
        assert.deepEqual(acc, [[3, 0], [2, 1], [1, 2]]);
    });
    it('first/tail', function () {
        assert.equal(list.first(), 1);
        assert.equal(list.tail().first(), 2);
        assert.notEqual(list.tail(), list.tail());
        assert.deepEqual(list.tail().toArray(), [2, 3]);
    });
    it('find', function () {
        assert.deepEqual(list.find(function (v) { return v === 1; }), 1);
        assert.deepEqual(list.findIndex(function (v) { return v === 1; }), 0);
        assert.deepEqual(list.indexOf(3), 2);
        assert.deepEqual(list.includes(1), true);
        assert.deepEqual(list.includes(10), false);
    });
    it('get/set', function () {
        assert.equal(list.get(1), 2);
        assert.deepEqual(list.set(2, 10).toArray(), [1, 2, 10]);
        // assert.deepEqual(list.set(10, 4).toArray(), [1, 10, 3])
        assert.deepEqual(list.get(10), void 0);
    });
    it('keys/values/entries', function () {
        assert.deepEqual(utils_1.toArray(list.keys()), [0, 1, 2]);
        assert.deepEqual(utils_1.toArray(list.values()), [1, 2, 3]);
        assert.deepEqual(utils_1.toArray(list.entries()), [[0, 1], [1, 2], [2, 3]]);
    });
    it('every/some/filter/map', function () {
        assert.deepEqual(list.every(function (i) { return i > 0; }), true, 'every true');
        assert.deepEqual(list.every(function (i) { return i > 2; }), false, 'every false');
        assert.deepEqual(list.some(function (i) { return i > 0; }), true, 'some true');
        assert.deepEqual(list.some(function (i) { return i > 2; }), true, 'some true 2');
        assert.deepEqual(list.some(function (i) { return i <= 0; }), false, 'some false 1');
        assert.equal(list.filter(function (i) { return i < 10; }), list, 'filter list');
        assert.deepEqual(list.filter(function (i) { return i > 10; }).toArray(), [], 'filter []');
        assert.deepEqual(list.filter(function (i) { return i > 1; }).toArray(), [2, 3], 'filter [2,3]');
        assert.deepEqual(list.map(function (i) { return i + 1; }).toArray(), [2, 3, 4], 'map');
    });
    it('forEach', function () {
        var acc = [];
        list.forEach(function (v, i) { return acc.push([i, v]); });
        assert.deepEqual(acc, [[0, 1], [1, 2], [2, 3]]);
    });
    it('setIn', function () {
        var newBook = index_1.setIn(book, function (_) { return _.related.get(0).title; }, 'ChangedTitle');
        assert.equal(newBook.related.get(0).title, 'ChangedTitle');
        assert.equal(newBook.related.get(1).title, 'book1');
        assert.equal(newBook.related.get(2).title, 'book2');
        assert.notEqual(newBook.related.get(0), book.related.get(0));
        assert.notEqual(newBook.related, book.related);
        assert.notEqual(newBook, book);
        assert.equal(newBook.related.get(1), book.related.get(1));
        assert.equal(newBook.related.get(2), book.related.get(2));
    });
});
//# sourceMappingURL=list.test.js.map