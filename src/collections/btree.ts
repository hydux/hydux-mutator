interface TreeNode<K, V> {
  value: [K, V],
  left: Tree<K, V>,
  right: Tree<K, V>,
  height: number,
}

type Tree<K, V> = TreeNode<K, V> | null

let keys = [] as any[]
function getType(key: any) {
  const t: string = Object.prototype.toString.call(key)
  return t.slice(8, -1).toLowerCase()
}

let objUid = 0
let objUidKey = typeof Symbol !== 'undefined' ? Symbol('_hmuid_') : '_hmuid_'
let objUidMap = typeof WeakMap !== 'undefined' ? new WeakMap<object, number>() : null
function hash(key: any) {
  switch (getType(key)) {
    case 'undefined':
    case 'null':
    case 'boolean':
    case 'number':
    case 'regexp':
      return key + ''

    case 'date':
      return '📅' + key.getTime()

    case 'string':
      return '📝' + key

    case 'array':
      return '🔗' + (key as any[]).map(k => hash(k)).join('⁞')

    default:
      if (objUidMap) {
        let uid = objUidMap.get(key)
        if (!uid) {
          uid = ++objUid
          objUidMap.set(key, uid)
        }
        return uid
      }
      // TODO: Don't use expandos when Object.defineProperty is not available?
      if (!key.hasOwnProperty(objUidKey)) {
        key[objUidKey] = ++objUid
        hide(key, objUidKey)
      }

      return '⭕️' + key[objUidKey]
  }
}

function hide(obj, prop) {
  // Make non iterable if supported
  if (Object.defineProperty) {
    Object.defineProperty(obj, prop, { enumerable: false })
  }
}

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
  throw new Error('imposible')
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

function add<K, V>(key: K, value: V, tree: Tree<K, V>): Tree<K, V> {
  if (tree) {
    const newKeyHash = hash(key)
    const rootKeyHash = hash(tree.value[0])
    if (newKeyHash === rootKeyHash) {
      return tree
    } else if (newKeyHash < rootKeyHash) {
      return balance(add(key, value, tree.left), tree.value, tree.right)
    } else {
      return balance(tree.left, tree.value, add(key, value, tree.right))
    }
  } else {
    return create(null, [key, value], null)
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
  if (!left && right) {
    return right
  } else if (left && !right) {
    return left
  } else if (right) {
    return balance(left, minElt(right.value, right), removeMinElt(right.left, right.value, right.right))
  }
}

function remove<K, V>(key: K, tree: Tree<K, V>) {
  if (!tree) {
    return null
  } else {
    let keyHash = hash(key)
    let oldKeyHash = hash(tree.value[0])
    if (keyHash === oldKeyHash) {
      return internalMerge(tree.left, tree.right)
    } else if (keyHash < oldKeyHash) {
      return balance(remove(key, tree.left), tree.value, tree.right)
    } else {
      return balance(tree.left, tree.value, remove(key, tree.right))
    }
  }
}

function mem<K, V>(key: K, tree: Tree<K, V>) {
  if (!tree) {
    return false
  }
  let keyHash = hash(key)
  let oldKeyHash = hash(tree.value[0])
  return keyHash === oldKeyHash || mem(key, (keyHash < oldKeyHash) ? tree.left : tree.right)
}
function get<K, V>(key: K, tree: Tree<K, V>) {
  if (!tree) {
    return void 0
  }
  let keyHash = hash(key)
  let oldKeyHash = hash(tree.value[0])
  if (keyHash === oldKeyHash) {
    return tree.value[1]
  }
  return get(key, (keyHash < oldKeyHash) ? tree.left : tree.right)
}

function unimplemented(): never {
  throw new Error('unimplemented')
}

function * treeKeys<K, V, T>(tree: Tree<K, V>, getVal: (v: [K, V]) => T): IterableIterator<T> {
  if (!tree) {
    return
  }
  if (tree.left) {
    for (const k of treeKeys(tree.left, getVal)) {
      yield k
    }
  }
  yield getVal(tree.value)
  if (tree.right) {
    for (const k of treeKeys(tree.right, getVal)) {
      yield k
    }
  }
}

let a: ReadonlyArray<any> = []
class ImmuMap<K, V> implements ReadonlyMap<K, V> {
  get size() {
    return this._size
  }
  private _size: number
  private _tree: Tree<K, V>

  constructor() {
    this._tree = null
    this._size = 0
  }

  [Symbol.iterator]() {
    return this.entries()
  }
  forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any) {
    for (const [key, value] of this.entries()) {
      callbackfn.call(thisArg, value, key, this)
    }
  }
  get(key: K) {
    return get(key, this._tree)
  }
  has(key: K) {
    return mem(key, this._tree)
  }
  set(key: K, value: V) {
    const map = new ImmuMap()
    map._tree = add(key, value, this._tree)
    map._size++
    return map
  }
  delete(key: K) {
    const map = new ImmuMap()
    map._tree = remove(key, this._tree)
    map._size--
    return map
  }
  keys() {
    return treeKeys(this._tree, v => v[0])
  }
  values() {
    return treeKeys(this._tree, v => v[1])
  }
  entries() {
    return treeKeys(this._tree, v => v)
  }
}

let v = null as Tree<number, number>

const l = Array(10).fill(0).map((_, i) => i)

l.map(i => v = add(i, i + 1, v))
function prettyPrint(x) {
  let opts = { depth: null, colors: 'auto' }
  // let s = require('util').inspect(x, opts)
  // console.log (s)
}
prettyPrint(v)
l.map(i => {
  if (!mem(i, v)) {
    impossible()
  }
})

l.map(i => {
  if (get(i, v) !== i + 1) {
    impossible()
  }
})

for (const key of treeKeys(v, v => v[0])) {
  console.log('iter key', key)
}

l.map(i => {
  v = remove(i, v)
})
prettyPrint(v)
if (v) {
  impossible()
} else {
  console.log('succuss')
}
