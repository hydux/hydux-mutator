import * as assert from 'assert'
import ImmuSet from '../collections/set'
import * as util from 'util'
import { toArray } from './utils'

let set = new ImmuSet()
for (const item of toArray(Array(3).keys())) {
  set = set.add(item)
}
describe('set', () => {
  it('init', () => {
    let set2 = new ImmuSet([0,1,2])
    assert.deepEqual(set2.toJSON(), set.toJSON())
  })
  it('add/has/delete', () => {
    assert.deepEqual(set.toArray(), [0,1,2], '1')
    assert.equal(set.size, 3, '2')
    assert.equal(set.has(1), true, '3')
    assert.equal(set.has(10), false, '4')
    assert.equal(set.delete(1).has(1), false, '5')
    assert.notEqual(set.delete(1), set, '6')
  })
  it('keys/values/entries', () => {
    assert.deepEqual(toArray(set.keys()), [0, 1, 2])
    assert.deepEqual(toArray(set.delete(0).keys()), [1, 2])
    assert.deepEqual(toArray(set.values()), [0, 1, 2])
    assert.deepEqual(toArray(set.entries()), [[0,0],[1,1],[2, 2]])
  })
  it('object', () => {
    const [k1, k2, k3, k4] = [{}, {}, {}, {}]
    const [v1, v2, v3, v4] = [{}, {}, {}, {}]
    let set = new ImmuSet([k1, k2, k3, k4])
    assert.equal(set.has(k1), true)
    assert.equal(set.has(k2), true)
    assert.equal(set.has(k3), true)
    assert.equal(set.has(k4), true)
    assert.equal(set.delete(k1).has(k1), false)
  })
  it('size', () => {
    assert.deepEqual(set.size, 3)
    assert.deepEqual(set.add(5).size, 4)
    assert.deepEqual(set.add(1).size, 3)
    assert.deepEqual(set.add(1).size, 3)
    assert.deepEqual(set.delete(1).size, 2)
    assert.deepEqual(set.clear().size, 0)
  })
})
