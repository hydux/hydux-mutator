# hydux-mutator

[![Build Status](https://travis-ci.org/hydux/hydux-mutator.svg?branch=master)](https://travis-ci.org/hydux/hydux-mutator) [![npm](https://img.shields.io/npm/v/hydux-mutator.svg)](https://www.npmjs.com/package/hydux-mutator) [![npm](https://img.shields.io/npm/dm/hydux-mutator.svg)](https://www.npmjs.com/package/hydux-mutator)

A statically-typed immutable update helper library.

> For [Hydux](https://github.com/hydux/hydux).

## Features

* Statically-typed
* Support class state
  * Using constructor to create new instance
  * Class can define a `shallowClone` method to customize shallow clone.

## install

```sh
yarn add hydux-mutator # or npm i hydux-mutator
```

![](https://github.com/hydux/hydux-mutator/raw/master/media/media.gif)

## Usage

```js
import { setIn, updateIn } from 'hydux-mutator'

class User {
  name = 'aa'
  age = 0
}

let user = new User()
user = setIn(user, _ => _.name, 'bb')
user = updateIn(user, _ => _.age, a => a + 10)
```

**Note**: The accessor lambda function only support plain object/array. e.g.

```js
setIn(user, _ => _.name, 'a')
setIn(user, _ => _.teacher.name, 'a')
setIn(user, _ => _['tags'][0], 'a')
setIn(user, _ => _.tags[0], 'a')
```

Which **not** support:

* Map/Set/Third-party collection library
* Function calls

But how can I use it in these scenarios? The answer is nesting:

```js
let state = {
  userMap: new Map<string, User>(),
  userObjMap: {} as {[key: string]: User},
}
let key = 'a'
state = updateIn(state, _ => _.userMap, map => (
  map = new Map(map),
  map.set(key, setIn(map.get(key), _ => _.name, 'new name')),
  map
))
```

### Dynamic keys

Because hydux-mutator get the deep key path by parsing the lambda string, we cannot get the dynamic path in the accessor scope, so we have to pass it to the function as ctx, see:

```js
let state = {
  userObjMap: {} as {[key: string]: User},
}
let key = 'some key'
state = setIn(state, _ => _.userObjMap[key], 'new name', [key])
```

> **NOTE:** The order of ctx should be the same as the occurrence order of dynamic keys.

### Collections

We also provide some immutable collections like [immutable-js](facebook.github.io/immutable-js/), which has O(1) - O(logN) performance for update operations.

* [ImmuList](https://hydux.github.io/hydux-mutator/classes/_collections_list_.immulist.html): Under the hood is [@funkia/list](https://github.com/funkia/list), a modified implemenation of RRB tree with pretty good performance.
* [ImmuMap](https://hydux.github.io/hydux-mutator/classes/_collections_map_.immumap.html): Based on [an OCaml's immutable balanced tree implementation](https://bucklescript.github.io/bucklescript-playground/index.html#Balanced_tree).
* [ImmuSet](https://hydux.github.io/hydux-mutator/classes/_collections_set_.immuset.html): Based on ImmuMap.

**Note:** Polyfill for `Symbol.iterator` is required!

All these collections can work seamlessly with `setIn/updateIn/getIn/unsetIn` functions!

```ts
import { setIn } from 'hydux-mutator'
import ImmuList from 'hydux-mutator/lib/list'

const book = {
  title: 'book1'
}
const state = {
  list: new ImmuList([book, book, book])
}
setIn(state, _ => _.list.get(0).title, 'new title')

```

We also support fb's [immutable-js](facebook.github.io/immutable-js/) or others contains `.get(key: string | number)` and `.set(key: string | number, value: any)` methods.

### [immer](https://github.com/mweststrate/immer)

Immer like api.

**Note:** This is based on [es6 Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), you might need a [proxy polyfill](https://github.com/GoogleChrome/proxy-polyfill) if you want to use in es5 environment.

```ts
import immer from 'hydux-mutator/lib/immer'

const state = {
  subState: {
    nestedSubState: 1
  }
}

const nextState = immer(state, (draft, state) => {
  draft.subState.nestedSubState = state.subState.nestedSubState + 1
})
// nextState => {
//   subState: {
//     nestedSubState: 2
//   }
// }
```

## What's the difference with `monolite`

The main difference is [monolite](https://github.com/kube/monolite) is using es6's `Proxy<T>` under the hood, which might not support well in many browsers.

`hydux-mutator` is implement by parsing lambda function's source string(`fn.toString()`), this have better browser support. And the parsing part can easily be cached, which means it can have better performance.

What's more, `hydux-mutator` support class state, which I rarely see in other immuatble update helpers.

```js
import * as mutator from 'hydux-mutator'
class User {
  constructor(name = '', age = 0) { // constructor should have an overload of zero parameters.
    this.name = name
    this.age = age
  }
}
let state = {
  user: new User()
}

state = mutator.setIn(state, _ => _.user.name, 'New Name')
state.user instanceof User // true!
```

## Known Issues

* flow has bug in checking `setIn`, see: [#5569](https://github.com/facebook/flow/issues/5569)

## Benchmark

```sh
Start Suit: Set 1 key
immutable x 932,328 ops/sec ±14.93% (46 runs sampled)
seamless-immutable x 67,021 ops/sec ±16.99% (44 runs sampled)
timm x 881,627 ops/sec ±17.53% (62 runs sampled)
monolite x 151,347 ops/sec ±13.51% (46 runs sampled)
mutator x 219,049 ops/sec ±5.03% (71 runs sampled)
Fastest is immutable,timm


Start Suit: Set 2 key
immutable x 732,474 ops/sec ±9.49% (57 runs sampled)
seamless-immutable x 28,802 ops/sec ±12.65% (53 runs sampled)
timm x 715,487 ops/sec ±9.31% (55 runs sampled)
monolite x 97,454 ops/sec ±12.41% (55 runs sampled)
mutator x 147,161 ops/sec ±16.37% (53 runs sampled)
Fastest is immutable,timm


Start Suit: Set 5 key
immutable x 374,647 ops/sec ±13.05% (55 runs sampled)
seamless-immutable x 19,725 ops/sec ±8.40% (62 runs sampled)
timm x 217,508 ops/sec ±9.00% (43 runs sampled)
monolite x 80,403 ops/sec ±6.32% (69 runs sampled)
mutator x 111,625 ops/sec ±4.92% (65 runs sampled)
Fastest is immutable


Start Suit: Set 10 key
immutable x 257,998 ops/sec ±4.59% (69 runs sampled)
seamless-immutable x 11,238 ops/sec ±10.45% (59 runs sampled)
timm x 219,370 ops/sec ±8.29% (59 runs sampled)
monolite x 32,778 ops/sec ±7.16% (48 runs sampled)
mutator x 54,496 ops/sec ±8.72% (60 runs sampled)
Fastest is immutable
```

## License

MIT
