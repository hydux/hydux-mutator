import * as assert from 'assert'
import mutator from '../index'

function sleep(ns) {
  return new Promise(resolve => setTimeout(resolve, ns))
}

class Category {
  name = 'novel'
  count = 123
}
const originalBook = {
  title: {
    zh: '哈利·波特与魔法石',
    en: 'Harry Potter and the Philosopher\'s Stone',
  },
  category: new Category(),
  author: 'J. k. rowling',
  tags: ['novel', 'magic'],
  pub_date: new Date('2017-7-11'),
}

const book = {
  title: {
    zh: '哈利·波特与魔法石',
    en: 'Harry Potter and the Philosopher\'s Stone',
  },
  category: new Category(),
  author: 'J. k. rowling',
  tags: ['novel', 'magic'],
  pub_date: new Date('2017-7-11'),
}

describe('setIn', () => {
  it('simple', () => {
    const newBook = mutator.setIn(book, _ => _.author, 'J')
    assert(newBook.author === 'J')
    assert(book.author === originalBook.author)
    assert(newBook !== book)
    assert(newBook.category === book.category)
    assert(newBook.pub_date === book.pub_date)
  })
  it('simple', () => {
    const newBook = mutator.setIn(book, _ => _.title.en, 'Harry Potter and something...')
    assert.deepEqual(book, originalBook, 'book shouldn\'t change')
    assert.equal(newBook.title.en, 'Harry Potter and something...', 'title.en should change')
    assert.equal(newBook.title.zh, '哈利·波特与魔法石', 'title.zh shouldn\'t change')
    assert(newBook.tags === book.tags)
    assert.deepEqual(newBook.tags, book.tags)
    assert.deepEqual(newBook.category, book.category)
    assert.notEqual(newBook, book)
    assert.notEqual(newBook.title, book.title)
  })

  it('class', () => {
    const newBook = mutator.setIn(book, _ => _.category.name, 'book')
    assert(newBook.category.name === 'book')
    assert(newBook.category.count === book.category.count)
    assert(newBook !== book)
    assert(newBook.category !== book.category)
    assert(newBook.title === book.title)
    assert(newBook.category instanceof Category)
  })

  it('quote', () => {
    const newBook = mutator.setIn(book, _ => _['category']['name'], 'book')
    assert(newBook.category.name === 'book')
    assert(newBook.category.count === book.category.count)
    assert(newBook !== book)
    assert(newBook.category !== book.category)
    assert(newBook.title === book.title)
    assert(newBook.category instanceof Category)
  })

  it('array', () => {
    const newBook = mutator.setIn(book, _ => _.tags[0], 'N')
    assert(newBook.tags[0] === 'N', 'First tag should change')
    assert(newBook.tags[1] === 'magic', 'Second tag should keep')
    assert(newBook.tags.length === 2, 'tags length should keep')
    assert(newBook.tags instanceof Array, 'tags type should keep')
    assert(newBook.category === book.category, 'category should keep')
    assert(newBook !== book)
    assert(newBook.tags !== book.tags)
    assert(newBook.title === book.title)
    assert(newBook.category instanceof Category)
  })
})

describe('updateIn', () => {
  it('simple', () => {
    const newBook = mutator.updateIn(book, _ => _.title.en, title => title + ' (Original Edition)')
    assert.deepEqual(book, originalBook)
    assert.equal(newBook.title.en, 'Harry Potter and the Philosopher\'s Stone (Original Edition)')
    assert(newBook.tags === book.tags)
    assert.deepEqual(newBook.tags, book.tags)
    assert.notEqual(newBook, book)
    assert.notEqual(newBook.title, book.title)
  })
})


let newBook = mutator.setIn(book, _ => _.title.en, 'nnn')
newBook = mutator.updateIn(book, _ => _.tags, t => [...t, 'novel'])
