import ImmuList from './list'
import ImmuMap from './map'
import ImmuSet from './set'
export * from './utils'

export { ImmuList, ImmuMap, ImmuSet }
export default { ImmuList, ImmuMap, ImmuSet }

export function stringify(val: any, replacer?: (key: string, value: any) => any, space?: string | number) {
  return JSON.stringify(
    val,
    replacer,
    space,
  )
}

export function parse(text: string, reviver?: (key: any, value: any) => any) {
  return JSON.parse(
    text,
    (key, val) => {
      if (typeof val === 'object' && val && val.class) {
        switch (val.class) {
          case '@hydux/ImmuList':
            return new ImmuList(val.data)
          case '@hydux/ImmuSet':
            return new ImmuSet(val.data)
          case '@hydux/ImmuMap':
            return new ImmuMap(val.data)
        }
      }
      return val
    }
  )
}
