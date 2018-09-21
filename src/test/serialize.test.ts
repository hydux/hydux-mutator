import { parse, stringify, ImmuList, ImmuMap, ImmuSet, iter } from '../collections'
import * as assert from 'assert'

describe('serialize', () => {
  it('list', () => {
    let list = new ImmuList(['12', 23, { aa: 1 }])
    console.log('stringify(list)', stringify(list))
    assert.deepEqual(stringify(list), `{"class":"@hydux/ImmuList","data":["12",23,{"aa":1}]}`)
    let deserialized = parse(stringify(list))
    assert(deserialized instanceof ImmuList)
    assert.deepEqual(list.length, deserialized.length)
    for (let i = 0; i < list.length; i++) {
      assert.deepEqual(list.get(i), deserialized.get(i))
    }
  })

  it('map', () => {
    let map = new ImmuMap<string, number | string | object>([['123', '12'], ['1', 23], ['123', { aa: 1 }]])
    console.log('stringify(list)', stringify(map))
    assert.deepEqual(stringify(map), `{"class":"@hydux/ImmuMap","data":[["1",23],["123",{"aa":1}]]}`)
    let deserialized = parse(stringify(map))
    console.log('deserialized')
    assert(deserialized instanceof ImmuMap)
    assert.deepEqual(map.size, deserialized.size)
    iter(map.keys(), key => {
      assert.deepEqual(map.get(key), deserialized.get(key))
    })
  })

  it('set', () => {
    let set = new ImmuSet(['12', 23, { aa: 1 }])
    console.log('stringify(list)', stringify(set))
    assert.deepEqual(stringify(set), `{"class":"@hydux/ImmuSet","data":[23,{"aa":1},"12"]}`)
    let deserialized = parse(stringify(set))
    assert(deserialized instanceof ImmuSet)
    assert.deepEqual(set.size, deserialized.size)
    let [setArr, deArr] = [set.toArray(), deserialized.toArray()]
    assert.deepEqual(setArr, deArr)
  })

  it('mixed', () => {
    let mixed = {
      list: new ImmuList([
        '12',
        23,
        { aa: new ImmuSet([1, 'aa', 'bb']) },
      ]),
      map: new ImmuMap<string, string | ImmuList<any>>([['aa', 'bb'], ['cc', 'dd'], ['ee', new ImmuList([1,2,3])]]),
      set: new ImmuSet([1,2, 3])
    }
    console.log(stringify(mixed))
    assert.deepEqual(mixed, parse(stringify(mixed)))
  })
})
