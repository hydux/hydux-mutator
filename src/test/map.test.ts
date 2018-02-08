import * as assert from 'assert'
import ImmuMap from '../collections/map'
import { toArray } from './utils'
import { setIn, getIn } from '../index'

let map = new ImmuMap()
const book = {
  title: 'Some Title',
  books: new ImmuMap([
    ['book1', { title: 'book1' }],
    ['book2', { title: 'book2' }],
    ['book3', { title: 'book3' }],
  ])
}
for (const item of toArray(Array(3).keys())) {
  map = map.set(item, item + 1)
}
describe('map', () => {
  it('init', () => {
    let map2 = new ImmuMap([[0, 1],[1,2],[2,3]])
    assert.deepEqual(map2.toJSON(), map.toJSON())
  })
  it('get/set/has', () => {
    assert.equal(map.get(0), 1, '1')
    assert.equal(map.get(1), 2, '2')
    assert.equal(map.get(5), undefined, '3')
    let nextMap = map.set(0, 10)
    assert.equal(map.get(0), 1, '5')
    assert.equal(nextMap.get(0), 10, '6')
    assert.notEqual(map, nextMap, '7')
    assert.equal(map.has(0), true, '8')
    assert.equal(map.has(-1), false, '9')
  })
  it('keys/values/entries', () => {
    assert.deepEqual(toArray(map.keys()), [0, 1, 2])
    assert.deepEqual(toArray(map.delete(0).keys()), [1, 2])
    assert.deepEqual(toArray(map.values()), [1,2,3])
    assert.deepEqual(toArray(map.entries()), [[0,1],[1,2],[2, 3]])
  })
  it('object', () => {
    const [k1, k2, k3, k4] = [{}, {}, {}, {}]
    const [v1, v2, v3, v4] = [{}, {}, {}, {}]
    let map = new ImmuMap([
      [k1, v1],
      [k2, v2],
      [k3, v3],
      [k4, v4],
    ])
    assert.equal(map.get(k1), v1)
    assert.equal(map.get(k2), v2)
    assert.equal(map.get(k3), v3)
    assert.equal(map.get(k4), v4)
    assert.equal(map.delete(k1).get(k1), undefined)
  })
  it('toJSON', () => {
    assert.deepEqual(map.toJSON(), {
      '0': 1,
      '1': 2,
      '2': 3,
    })
  })
  it('size', () => {
    assert.deepEqual(map.size, 3)
    assert.deepEqual(map.set(5, 1).size, 4)
    assert.deepEqual(map.set(1, 5).size, 3)
    assert.deepEqual(map.set(1, 2).size, 3)
    assert.deepEqual(map.delete(1).size, 2)
    assert.deepEqual(map.clear().size, 0)
  })
  it('setIn', () => {
    const newBook = setIn(book, _ => _.books.get('book1')!.title, 'ChangedTitle')
    assert.equal(newBook.books.get('book1')!.title, 'ChangedTitle')
    assert.equal(newBook.books.get('book2')!.title, 'book2')
    assert.equal(newBook.books.get('book3')!.title, 'book3')
    assert.notEqual(newBook.books.get('book1'), book.books.get('book1'))
    assert.equal(book.books.get('book1')!.title, 'book1')
    assert.notEqual(newBook.books, book.books)
    assert.notEqual(newBook, book)
    assert.equal(newBook.books.get('book2'), book.books.get('book2'))
    assert.equal(newBook.books.get('book3'), book.books.get('book3'))
    const k = 'book2'
    const newBook2 = setIn(book, _ => _.books.get(k)!.title, 'ChangedTitle', [k])
    assert.equal(newBook2.books.get('book2')!.title, 'ChangedTitle')
    assert.equal(getIn(newBook2, _ => _.books.get('book2')!.title), 'ChangedTitle')
  })
})
