
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
  throw new Error('imposib')
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

function add<K, V>(key: K, value: V, tree: Tree<K, V>) {
  if (tree) {
    const newKeyHash = hash(key)
    const rootKeyHash = hash(tree.value[0])
    if (newKeyHash === rootKeyHash) {
      return tree
    } else if (newKeyHash < rootKeyHash) {
      balance(add(key, value, tree.left), tree.value, tree.right)
    } else {
      balance(tree.left, tree.value, add(key, value, tree.right))
    }
  }
  return create(null, [key, value], null)
}
