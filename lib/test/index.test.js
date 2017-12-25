"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var index_1 = require("../index");
function sleep(ns) {
    return new Promise(function (resolve) { return setTimeout(resolve, ns); });
}
var Category = /** @class */ (function () {
    function Category() {
        this.name = 'novel';
        this.count = 123;
    }
    return Category;
}());
var originalBook = {
    title: {
        zh: '哈利·波特与魔法石',
        en: 'Harry Potter and the Philosopher\'s Stone',
    },
    category: new Category(),
    author: 'J. k. rowling',
    tags: ['novel', 'magic'],
    pub_date: new Date('2017-7-11'),
};
var book = {
    title: {
        zh: '哈利·波特与魔法石',
        en: 'Harry Potter and the Philosopher\'s Stone',
    },
    category: new Category(),
    author: 'J. k. rowling',
    tags: ['novel', 'magic'],
    pub_date: new Date('2017-7-11'),
};
describe('setIn', function () {
    it('simple', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _.author; }, 'J');
        assert(newBook.author === 'J');
        assert(book.author === originalBook.author);
        assert(newBook !== book);
        assert(newBook.category === book.category);
        assert(newBook.pub_date === book.pub_date);
    });
    it('simple', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _.title.en; }, 'Harry Potter and something...');
        assert.deepEqual(book, originalBook, 'book shouldn\'t change');
        assert.equal(newBook.title.en, 'Harry Potter and something...', 'title.en should change');
        assert.equal(newBook.title.zh, '哈利·波特与魔法石', 'title.zh shouldn\'t change');
        assert(newBook.tags === book.tags);
        assert.deepEqual(newBook.tags, book.tags);
        assert.deepEqual(newBook.category, book.category);
        assert.notEqual(newBook, book);
        assert.notEqual(newBook.title, book.title);
    });
    it('class', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _.category.name; }, 'book');
        assert(newBook.category.name === 'book');
        assert(newBook.category.count === book.category.count);
        assert(newBook !== book);
        assert(newBook.category !== book.category);
        assert(newBook.title === book.title);
        assert(newBook.category instanceof Category);
    });
    it('quote', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _['category']['name']; }, 'book');
        assert(newBook.category.name === 'book');
        assert(newBook.category.count === book.category.count);
        assert(newBook !== book);
        assert(newBook.category !== book.category);
        assert(newBook.title === book.title);
        assert(newBook.category instanceof Category);
    });
    it('array', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _.tags[0]; }, 'N');
        assert(newBook.tags[0] === 'N', 'First tag should change');
        assert(newBook.tags[1] === 'magic', 'Second tag should keep');
        assert(newBook.tags.length === 2, 'tags length should keep');
        assert(newBook.tags instanceof Array, 'tags type should keep');
        assert(newBook.category === book.category, 'category should keep');
        assert(newBook !== book);
        assert(newBook.tags !== book.tags);
        assert(newBook.title === book.title);
        assert(newBook.category instanceof Category);
    });
    it('delete', function () {
        var newBook = index_1.default.setIn(book, function (_) { return _.title.en; }, null);
        assert(newBook.title.en === null);
        assert(newBook.title.zh === book.title.zh);
        assert(newBook.title !== book.title);
        assert(newBook !== book);
        assert(newBook.category === book.category);
    });
});
describe('updateIn', function () {
    it('simple', function () {
        var newBook = index_1.default.updateIn(book, function (_) { return _.title.en; }, function (title) { return title + ' (Original Edition)'; });
        assert.deepEqual(book, originalBook);
        assert.equal(newBook.title.en, 'Harry Potter and the Philosopher\'s Stone (Original Edition)');
        assert(newBook.tags === book.tags);
        assert.deepEqual(newBook.tags, book.tags);
        assert.notEqual(newBook, book);
        assert.notEqual(newBook.title, book.title);
    });
});
var newBook = index_1.default.setIn(book, function (_) { return _.title.en; }, 'nnn');
newBook = index_1.default.updateIn(book, function (_) { return _.tags; }, function (t) { return t.concat(['novel']); });
//# sourceMappingURL=index.test.js.map