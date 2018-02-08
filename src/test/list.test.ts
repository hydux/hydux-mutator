import * as assert from 'assert'
import ImmuList from '../collections/list'
import { setIn } from '../index'
import { toArray } from './utils'

function sleep(ns) {
  return new Promise(resolve => setTimeout(resolve, ns))
}
const list = new ImmuList([1,2,3])

const book = {
  title: 'Some Title',
  related: new ImmuList([{
    title: 'book0',
    related: new ImmuList(),
  }, {
    title: 'book1',
    related: new ImmuList(),
  }, {
    title: 'book2',
    related: new ImmuList(),
  }]),
}

describe('list', () => {
  it('init', () => {
    let list = new ImmuList([1,2,3])
    assert.deepEqual(list.toArray(), [1,2,3])
  })
  it('append', () => {
    assert.deepEqual(list.toArray(), [1,2,3])
    const nextList = list.append(4)
    assert.notEqual(nextList, list)
    assert.deepEqual(nextList.get(3), 4)
    assert.deepEqual(nextList.toArray(), [1,2,3,4])
    assert.deepEqual(list.toArray(), [1,2,3])
  })
  it('append', () => {
    assert.deepEqual(list.toArray(), [1,2,3])
    const nextList = list.prepend(4)
    assert.notEqual(nextList, list)
    assert.deepEqual(nextList.get(0), 4)
    assert.deepEqual(nextList.get(3), 3)
    assert.deepEqual(nextList.toArray(), [4, 1,2,3])
    assert.deepEqual(list.toArray(), [1,2,3])
  })
  it('reduce', () => {
    const acc = list.reduce((acc, item, i) => {
      return (acc.push([item, i]), acc)
    }, [] as [number, number][])
    assert.deepEqual(acc, [[1, 0], [2, 1], [3, 2]])
  })
  it('reduceRight', () => {
    const acc = list.reduceRight((acc, item, i) => {
      return (acc.push([item, i]), acc)
    }, [] as [number, number][])
    assert.deepEqual(acc, [[3, 0], [2, 1], [1, 2]])
  })
  it('first/tail', () => {
    assert.equal(list.first(), 1)
    assert.equal(list.tail().first(), 2)
    assert.notEqual(list.tail(), list.tail())
    assert.deepEqual(list.tail().toArray(), [2, 3])
  })
  it('find', () => {
    assert.deepEqual(list.find(v => v === 1), 1)
    assert.deepEqual(list.findIndex(v => v === 1), 0)
    assert.deepEqual(list.indexOf(3), 2)
    assert.deepEqual(list.includes(1), true)
    assert.deepEqual(list.includes(10), false)
  })
  it('get/set', () => {
    assert.equal(list.get(1), 2)
    assert.deepEqual(list.set(2, 10).toArray(), [1, 2, 10])
    // assert.deepEqual(list.set(10, 4).toArray(), [1, 10, 3])
    assert.deepEqual(list.get(10), void 0)
  })

  it('keys/values/entries', () => {
    assert.deepEqual(toArray(list.keys()), [0, 1, 2])
    assert.deepEqual(toArray(list.values()), [1, 2, 3])
    assert.deepEqual(toArray(list.entries()), [[0, 1], [1, 2], [2, 3]])
  })

  it('every/some/filter/map', () => {
    assert.deepEqual(list.every(i => i > 0), true, 'every true')
    assert.deepEqual(list.every(i => i > 2), false, 'every false')
    assert.deepEqual(list.some(i => i > 0), true, 'some true')
    assert.deepEqual(list.some(i => i > 2), true, 'some true 2')
    assert.deepEqual(list.some(i => i <= 0), false, 'some false 1')
    assert.equal(list.filter(i => i < 10), list, 'filter list')
    assert.deepEqual(list.filter(i => i > 10).toArray(), [],'filter []')
    assert.deepEqual(list.filter(i => i > 1).toArray(), [2, 3], 'filter [2,3]')
    assert.deepEqual(list.map(i => i + 1).toArray(), [2, 3, 4], 'map')
  })

  it('forEach', () => {
    const acc = [] as [number, number][]
    list.forEach((v, i) => acc.push([i, v]))
    assert.deepEqual(acc, [[0, 1], [1, 2], [2, 3]])
  })

  it('setIn', () => {
    const newBook = setIn(book, _ => _.related.get(0).title, 'ChangedTitle')
    assert.equal(newBook.related.get(0).title, 'ChangedTitle')
    assert.equal(newBook.related.get(1).title, 'book1')
    assert.equal(newBook.related.get(2).title, 'book2')
    assert.notEqual(newBook.related.get(0), book.related.get(0))
    assert.notEqual(newBook.related, book.related)
    assert.notEqual(newBook, book)
    assert.equal(newBook.related.get(1), book.related.get(1))
    assert.equal(newBook.related.get(2), book.related.get(2))
  })
})
