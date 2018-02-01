export type PropertyKey = string | number
export interface IShallowClonable<T> {
  shallowClone(): T
}
