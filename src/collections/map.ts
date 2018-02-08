import { defaultHash, Hash, iterMap, iter } from './utils'
import { error } from '../utils'
import { IImmutableSetable } from '../types'

interface TreeNode<K, V> {
  value: [K, V],
  left: Tree<K, V>,
  right: Tree<K, V>,
  height: number,
}

type Tree<K, V> = TreeNode<K, V> | null

export { defaultHash }

function height<K, V>(t: Tree<K, V>) {
  if (t) {
    return t.height
  } else {
    return 0
  }
}

function create<K, V>(left: Tree<K, V>, value: [K, V], right: Tree<K, V>): TreeNode<K, V> {
  return {
    value,
    left,
    right,
    height: Math.max(height(left), height(right)) + 1,
  }
}

function impossible(): never {
  throw new Error('[hydux-mutator/map] imposible')
}

function balance<K, V>(left: Tree<K, V>, value: [K, V], right: Tree<K, V>): Tree<K, V> {
  let leftHeight = height(left)
  let rightHeit = height(right)
  if (leftHeight > rightHeit + 2) {
    if (!left) {
      return impossible()
    } else {
      if (height(left.left) >= height(left.right)) {
        return create(left.left, left.value, create(left.right, value, right))
      } else if (!left.right) {
        return impossible()
      } else {
        return create(create(left.left, left.value, left.right.left), left.right.value, create(left.right.right, value, right))
      }
    }
  } else if (rightHeit > leftHeight + 2) {
    if (!right) {
      return impossible()
    } else {
      if (height(right.right) >= height(right.right)) {
        return create(create(left, value, right.left), right.value, right.right)
      } else if (!right.left) {
        return impossible()
      } else {
        return create(create(left, value, right.left.left), right.left.value, create(right.left.right, right.value, right.right))
      }
    }
  } else {
    return create(left, value, right)
  }
}

enum AddStatus {
  none = 0,
  added = 1,
  updated = 2,
}

function add<K, V>(key: K, value: V, tree: Tree<K, V>, hash: (v: any) => string): [AddStatus, Tree<K, V>] {
  if (tree) {
    const newKeyHash = hash(key)
    const [treeKey, treeValue] = tree.value
    const rootKeyHash = hash(treeKey)
    if (newKeyHash === rootKeyHash) {
      if (treeValue === value) {
        return [AddStatus.none, tree]
      } else {
        return [AddStatus.updated, create(tree.left, [key, value], tree.right)]
      }
    } else if (newKeyHash < rootKeyHash) {
      const res = add(key, value, tree.left, hash)
      return [res[0], balance(res[1], tree.value, tree.right)]
    } else {
      const res = add(key, value, tree.right, hash)
      return [res[0], balance(tree.left, tree.value, res[1])]
    }
  } else {
    return [AddStatus.added, create(null, [key, value], null)]
  }
}

function minElt<K, V>(value: [K, V], tree: Tree<K, V>) {
  if (!tree) {
    return value
  } else if (!tree.left) {
    return tree.value
  } else {
    return minElt(tree.value, tree.left)
  }
}

function removeMinElt<K, V>(left: Tree<K, V>, value: [K, V], right: Tree<K, V>) {
  if (!left) {
    return right
  } else {
    return balance(removeMinElt(left.left, left.value, left.right), value, right)
  }
}

function internalMerge<K, V>(left: Tree<K, V>, right: Tree<K, V>) {
  if (!left) {
    return right
  } else if (!right) {
    return left
  } else if (right) {
    return balance(left, minElt(right.value, right), removeMinElt(right.left, right.value, right.right))
  }
  return impossible()
}

function remove<K, V>(key: K, tree: Tree<K, V>, hash: Hash): [boolean, Tree<K, V>] {
  if (!tree) {
    return [false, null]
  } else {
    let keyHash = hash(key)
    let oldKeyHash = hash(tree.value[0])
    if (keyHash === oldKeyHash) {
      return [true, internalMerge(tree.left, tree.right)]
    } else if (keyHash < oldKeyHash) {
      const res = remove(key, tree.left, hash)
      return [res[0], balance(res[1], tree.value, tree.right)]
    } else {
      const res = remove(key, tree.right, hash)
      return [res[0], balance(tree.left, tree.value, res[1])]
    }
  }
}

function mem<K, V>(key: K, tree: Tree<K, V>, hash: Hash): boolean {
  if (!tree) {
    return false
  }
  let keyHash = hash(key)
  let oldKeyHash = hash(tree.value[0])
  return keyHash === oldKeyHash || mem(key, (keyHash < oldKeyHash) ? tree.left : tree.right, hash)
}
function get<K, V>(key: K, tree: Tree<K, V>, hash: Hash): V | undefined {
  if (!tree) {
    return void 0
  }
  let keyHash = hash(key)
  let oldKeyHash = hash(tree.value[0])
  if (keyHash === oldKeyHash) {
    return tree.value[1]
  }
  return get(key, (keyHash < oldKeyHash) ? tree.left : tree.right, hash)
}

function unimplemented(): never {
  throw new Error('unimplemented')
}

function * iterTree<K, V, T>(tree: Tree<K, V>, getVal: (v: [K, V]) => T): IterableIterator<T> {
  if (!tree) {
    return
  }
  if (tree.left) {
    const iter = iterTree(tree.left, getVal)[Symbol.iterator]()
    for (let item = iter.next(); !item.done; item = iter.next()) {
      yield item.value
    }
  }
  yield getVal(tree.value)
  if (tree.right) {
    const iter = iterTree(tree.right, getVal)[Symbol.iterator]()
    for (let item = iter.next(); !item.done; item = iter.next()) {
      yield item.value
    }
  }
}

export default class ImmuMap<K, V> implements ReadonlyMap<K, V>, IImmutableSetable<K, V, ImmuMap<K, V>> {
  get size() {
    return this._size
  }
  private _size: number
  private _tree: Tree<K, V>
  private _hash: Hash

  constructor(entries?: ReadonlyArray<[K, V]> | Iterable<[K, V]>, hash: Hash = defaultHash) {
    this._tree = null
    this._size = 0
    this._hash = hash
    if (entries) {
      iter(entries, ([k, v]) => {
        const [status, tree] = add(k, v, this._tree, hash)
        this._tree = tree
        if (status === AddStatus.added) {
          this._size++
        }
      })
    }
  }

  [Symbol.iterator]() {
    return this.entries()
  }
  forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any) {
    iter(this.entries(), ([key, value]) =>
      callbackfn.call(thisArg, value, key, this))
  }
  get(key: K) {
    return get(key, this._tree, this._hash)
  }
  has(key: K) {
    return mem(key, this._tree, this._hash)
  }
  clear(): ImmuMap<K, V> {
    return new ImmuMap()
  }
  set(key: K, value: V): ImmuMap<K, V> {
    const [status, tree] = add(key, value, this._tree, this._hash)
    if (status !== AddStatus.none) {
      const map = new ImmuMap<K, V>()
      map._tree = tree
      map._size = this._size
      if (status === AddStatus.added) {
        map._size++
      }
      return map
    } else {
      return this
    }
  }
  delete(key: K): ImmuMap<K, V> {
    const [removed, tree] = remove(key, this._tree, this._hash)
    if (removed) {
      const map = new ImmuMap<K, V>()
      map._tree = tree
      map._size = this._size - 1
      return map
    } else {
      return this
    }
  }
  keys() {
    return iterTree(this._tree, v => v[0])
  }
  values() {
    return iterTree(this._tree, v => v[1])
  }
  entries() {
    return iterTree(this._tree, v => v)
  }
  toJSON(): { [ key: string ]: V } {
    const obj = {} as { [ key: string ]: V }
    iter(this.entries(), ([k, v]) => {
      if (typeof k !== 'string' && typeof k !== 'number') {
        error('map.toJSON failed, key: ', k, 'value:', v)
        throw new TypeError(`map.toJSON requires map's key to be number or string, but got ${k}`)
      }
      obj[String(k)] = v
    })
    return obj
  }
}
