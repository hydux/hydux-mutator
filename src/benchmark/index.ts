
const Benchmark = require('benchmark')
const immutable = require('immutable')
const timm = require('timm')

import * as monolite from 'monolite'
import mutator from '../index'

const Seamlessimmutable = require('seamless-immutable/seamless-immutable.production.min.js')
const async = false
const assert = require('assert')
const category = {
  name: 'novel',
  count: 123,
}

const { Record } = immutable
const keyArray = 'aa.bb.cc.dd.ee.ff.gg.hh.ii.jj'.split('.')

const book = {
  title: {
    zh: '哈利·波特与魔法石',
    en: 'Harry Potter and the Philosopher\'s Stone',
  },
  category,
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
}
let originalStructBook = book
let structBook = originalStructBook
let immutableBook = createimmutable()
let seamlessimmutableBook = Seamlessimmutable(book)

function init() {
  immutableBook = createimmutable()
  seamlessimmutableBook = Seamlessimmutable(book)
}

function createimmutable() {
  const Category = Record({
    name: 'novel',
    count: 123,
  })
  const Title = Record({
    zh: '哈利·波特与魔法石',
    en: 'Harry Potter and the Philosopher\'s Stone',
  })
  const category = new Category()
  const Book = Record({
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
  })
  return new Book()
}

const suitOptions = {
  onCycle(event) {
    console.log(String(event.target))
  },
  onComplete () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('\n')
  },
  onStart(bench) {
    console.log('Start Suit:', bench.currentTarget.name)
  },
  onError(err) {
    console.error(err)
  },
}

// add tests
new Benchmark.Suite('Set 1 key', Object.assign({}, suitOptions, {
  onStart(bench) {
    suitOptions.onStart(bench)
    init()
  },
}))
    .add('immutable', function() {
      immutableBook.setIn(['author'], 'haha')
    })
    .add('seamless-immutable', function() {
      seamlessimmutableBook.setIn(['author'], 'haha')
    })
    .add('timm', function() {
      timm.setIn(book, ['author'], 'haha')
    })
    .add('monolite', function() {
      monolite.set(book, _ => _.author)('haha')
    })
    .add('mutator', function() {
      mutator.setIn(book, _ => _.author, 'haha')
    })
    // run async
    .run({ async })
// add tests
new Benchmark.Suite('Set 2 key', Object.assign({}, suitOptions, {
  onStart(bench) {
    suitOptions.onStart(bench)
    init()
  },
}))
  .add('immutable', function() {
    immutableBook.aa.setIn(['aa', 'bb'], {
      aa: 123,
    })
  })
  .add('seamless-immutable', function() {
    seamlessimmutableBook.setIn(['aa', 'bb'], {
      aa: 123,
    })
  })
  .add('timm', function() {
    timm.setIn(book, ['aa', 'bb'], {
      aa: 123,
    })
  })
  .add('monolite', function() {
    monolite.set(book, _ => _.aa.bb)({ aa: 123 } as any)
  })
  .add('mutator', function() {
    mutator.setIn(book, _ => _.aa.bb, { aa: 123 } as any)
  })
  // run async
  .run({ async })

// add tests
new Benchmark.Suite('Set 5 key', Object.assign({}, suitOptions, {
  onStart(bench) {
    suitOptions.onStart(bench)
    init()
  },
}))
  .add('immutable', function() {
    immutableBook.set('aa', immutableBook.aa.setIn(['bb', 'cc', 'dd', 'ee'], {
      aa: 123,
    }))
  })
  .add('seamless-immutable', function() {
    seamlessimmutableBook.setIn(['aa', 'bb', 'cc', 'dd', 'ee'], {
      aa: 1,
    })
  })
  .add('timm', function() {
    timm.setIn(book, ['aa', 'bb', 'cc', 'dd', 'ee'], {
      aa: 1,
    })
  })
  .add('monolite', function() {
    monolite.set(book, _ => _.aa.bb.cc.dd.ee)({ aa: 1 } as any)
  })
  .add('mutator', function() {
    mutator.setIn(book, _ => _.aa.bb.cc.dd.ee, { aa: 1 } as any)
  })
  // run async
  .run({ async })

// add tests
new Benchmark.Suite('Set 10 key', Object.assign({}, suitOptions, {
  onStart(bench) {
    suitOptions.onStart(bench)
    init()
  },
}))
  .add('immutable', function() {
    immutableBook.set('aa', immutableBook.aa.setIn(keyArray.slice(1), 1))
  })
  .add('seamless-immutable', function() {
    seamlessimmutableBook.setIn(keyArray, 1)
  })
  .add('timm', function() {
    timm.setIn(book, keyArray, 1)
  })
  .add('monolite', function() {
    monolite.set(book, _ => _.aa.bb.cc.dd.ee.ff.gg.hh.ii.jj)(1)
  })
  .add('mutator', function() {
    mutator.setIn(book, _ => _.aa.bb.cc.dd.ee.ff.gg.hh.ii.jj, 1)
  })
  // run async
  .run({ async })
