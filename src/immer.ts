import { setIn, Key } from './index'
const dummy = {}

function createHandler({ keys = [] as Key[], onSet }: { keys: Key[], onSet: (keys: Key[], val) => void }): ProxyHandler<any> {
  return {
    get(target, property, receiver) {
      const value = target[property]
      if (typeof value === 'object' && value !== null) {
        return new Proxy(target[property] || dummy, createHandler({
          keys: [...keys, property],
          onSet
        }))
      }
      return value
    },
    set(target, property, value, receiver) {
      onSet && onSet([...keys, property], value)
      return true
    },
  }
}

export default function immer<S extends object>(state: S, update: (draft: S, state: S) => void): S {
  let nextState = state
  const proxy = new Proxy<S>(state, createHandler({
    keys: [],
    onSet(keys, val) {
      nextState = setIn(nextState, keys, val)
    }
  }))

  update(proxy, state)

  return nextState
}
