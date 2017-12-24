"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Benchmark = require('benchmark');
var immutable = require('immutable');
var timm = require('timm');
var monolite = require("monolite");
var index_1 = require("../index");
var Seamlessimmutable = require('seamless-immutable/seamless-immutable.production.min.js');
var async = false;
var assert = require('assert');
var category = {
    name: 'novel',
    count: 123,
};
var Record = immutable.Record;
var keyArray = 'aa.bb.cc.dd.ee.ff.gg.hh.ii.jj'.split('.');
var book = {
    title: {
        zh: '哈利·波特与魔法石',
        en: 'Harry Potter and the Philosopher\'s Stone',
    },
    category: category,
    category2: category,
    author: 'J. k. rowling',
    tags: ['novel', 'magic'],
    pub_date: new Date('2017-7-11'),
    reg: /\d/,
    aa: {
        bb: {
            cc: {
                dd: {
                    ee: {
                        ff: {
                            gg: {
                                hh: {
                                    ii: {
                                        jj: 123,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
var originalStructBook = book;
var structBook = originalStructBook;
var immutableBook = createimmutable();
var seamlessimmutableBook = Seamlessimmutable(book);
function init() {
    immutableBook = createimmutable();
    seamlessimmutableBook = Seamlessimmutable(book);
}
function createimmutable() {
    var Category = Record({
        name: 'novel',
        count: 123,
    });
    var Title = Record({
        zh: '哈利·波特与魔法石',
        en: 'Harry Potter and the Philosopher\'s Stone',
    });
    var category = new Category();
    var Book = Record({
        title: new Title(),
        category: category,
        category2: category,
        author: 'J. k. rowling',
        tags: ['novel', 'magic'],
        pub_date: new Date('2017-7-11'),
        reg: /\d/,
        aa: immutable.fromJS({
            bb: {
                cc: {
                    dd: {
                        ee: {
                            ff: {
                                gg: {
                                    hh: {
                                        ii: {
                                            jj: 123,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }),
    });
    return new Book();
}
var suitOptions = {
    onCycle: function (event) {
        console.log(String(event.target));
    },
    onComplete: function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
        console.log('\n');
    },
    onStart: function (bench) {
        console.log('Start Suit:', bench.currentTarget.name);
    },
    onError: function (err) {
        console.error(err);
    },
};
// add tests
new Benchmark.Suite('Set 1 key', Object.assign({}, suitOptions, {
    onStart: function (bench) {
        suitOptions.onStart(bench);
        init();
    },
}))
    .add('immutable', function () {
    immutableBook.setIn(['author'], 'haha');
})
    .add('seamless-immutable', function () {
    seamlessimmutableBook.setIn(['author'], 'haha');
})
    .add('timm', function () {
    timm.setIn(book, ['author'], 'haha');
})
    .add('monolite', function () {
    monolite.set(book, function (_) { return _.author; })('haha');
})
    .add('mutator', function () {
    index_1.default.setIn(book, function (_) { return _.author; }, 'haha');
})
    .run({ async: async });
// add tests
new Benchmark.Suite('Set 2 key', Object.assign({}, suitOptions, {
    onStart: function (bench) {
        suitOptions.onStart(bench);
        init();
    },
}))
    .add('immutable', function () {
    immutableBook.aa.setIn(['aa', 'bb'], {
        aa: 123,
    });
})
    .add('seamless-immutable', function () {
    seamlessimmutableBook.setIn(['aa', 'bb'], {
        aa: 123,
    });
})
    .add('timm', function () {
    timm.setIn(book, ['aa', 'bb'], {
        aa: 123,
    });
})
    .add('monolite', function () {
    monolite.set(book, function (_) { return _.aa.bb; })({ aa: 123 });
})
    .add('mutator', function () {
    index_1.default.setIn(book, function (_) { return _.aa.bb; }, { aa: 123 });
})
    .run({ async: async });
// add tests
new Benchmark.Suite('Set 5 key', Object.assign({}, suitOptions, {
    onStart: function (bench) {
        suitOptions.onStart(bench);
        init();
    },
}))
    .add('immutable', function () {
    immutableBook.set('aa', immutableBook.aa.setIn(['bb', 'cc', 'dd', 'ee'], {
        aa: 123,
    }));
})
    .add('seamless-immutable', function () {
    seamlessimmutableBook.setIn(['aa', 'bb', 'cc', 'dd', 'ee'], {
        aa: 1,
    });
})
    .add('timm', function () {
    timm.setIn(book, ['aa', 'bb', 'cc', 'dd', 'ee'], {
        aa: 1,
    });
})
    .add('monolite', function () {
    monolite.set(book, function (_) { return _.aa.bb.cc.dd.ee; })({ aa: 1 });
})
    .add('mutator', function () {
    index_1.default.setIn(book, function (_) { return _.aa.bb.cc.dd.ee; }, { aa: 1 });
})
    .run({ async: async });
// add tests
new Benchmark.Suite('Set 10 key', Object.assign({}, suitOptions, {
    onStart: function (bench) {
        suitOptions.onStart(bench);
        init();
    },
}))
    .add('immutable', function () {
    immutableBook.set('aa', immutableBook.aa.setIn(keyArray.slice(1), 1));
})
    .add('seamless-immutable', function () {
    seamlessimmutableBook.setIn(keyArray, 1);
})
    .add('timm', function () {
    timm.setIn(book, keyArray, 1);
})
    .add('monolite', function () {
    monolite.set(book, function (_) { return _.aa.bb.cc.dd.ee.ff.gg.hh.ii.jj; })(1);
})
    .add('mutator', function () {
    index_1.default.setIn(book, function (_) { return _.aa.bb.cc.dd.ee.ff.gg.hh.ii.jj; }, 1);
})
    .run({ async: async });
//# sourceMappingURL=index.js.map