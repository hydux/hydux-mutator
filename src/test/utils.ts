export function toArray<A>(iter: IterableIterator<A>) {
  const arr = [] as A[]
  for (let item = iter.next(); !item.done; item = iter.next()) {
    arr.push(item.value)
  }
  return arr
}
