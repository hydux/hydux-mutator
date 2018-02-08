export type PropertyKey = string | number
export interface IShallowClonable<T> {
  shallowClone(): T
}

export interface IImmutableSetable<K, V, T> {
  set(key: K, val: V): T
}
