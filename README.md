# hydux-mutator

[![Build Status](https://travis-ci.org/hydux/hydux-mutator.svg?branch=master)](https://travis-ci.org/hydux/hydux-mutator) [![npm](https://img.shields.io/npm/v/hydux-mutator.svg)](https://www.npmjs.com/package/hydux-mutator) [![npm](https://img.shields.io/npm/dm/hydux-mutator.svg)](https://www.npmjs.com/package/hydux-mutator)

A statically-typed immutable update helper library.

> For [Hydux](https://github.com/hydux/hydux).

## Features

* Statically-typed
* Support class state

## install

```sh
yarn add hydux-mutator # or npm i hydux-mutator
```

![](https://github.com/hydux/hydux-mutator/raw/master/docs/media.gif)

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

**Note**: The accessor lambda function only support literal field of plain object/array. e.g.

```js
setIn(user, _ => _.name, 'a')
setIn(user, _ => _.teacher.name, 'a')
setIn(user, _ => _['tags'][0], 'a')
setIn(user, _ => _.tags[0], 'a')
```

Which **not** support:

* Map/Set/Third-party collection library
* dynamic keys

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
state = updateIn(state, _ => _.userObjMap, m => ({
  ...m,
  [key]: setIn(m[key], _ => _.name, 'new name')
}))
```

## What's the difference with `monolite`

The main difference is [monolite](https://github.com/kube/monolite) is using es6's `Proxy<T>` under the hood, which might not support well in many browsers.

`hydux-mutator` is implement by parsing lambda function's source string(`fn.toString()`), this have better browser support. And the parsing part can easily be cached, which means it can have better performance.

What's more, this support class state, which I merely see in other immuatble update helpers.

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

* flow has bug in checking `setIn`, see: [5569](https://github.com/facebook/flow/issues/5569)

## Benchmark

```sh
Start Suit: Set 1 key
immutable x 463,347 ops/sec ±17.83% (38 runs sampled)
seamless-immutable x 43,151 ops/sec ±16.57% (43 runs sampled)
timm x 399,784 ops/sec ±10.87% (43 runs sampled)
monolite x 85,844 ops/sec ±13.53% (47 runs sampled)
mutator x 104,687 ops/sec ±24.44% (47 runs sampled)
Fastest is immutable


Start Suit: Set 2 key
immutable x 384,360 ops/sec ±21.31% (27 runs sampled)
seamless-immutable x 16,637 ops/sec ±9.56% (50 runs sampled)
timm x 321,120 ops/sec ±11.68% (40 runs sampled)
monolite x 54,933 ops/sec ±12.02% (49 runs sampled)
mutator x 85,824 ops/sec ±8.92% (58 runs sampled)
Fastest is immutable


Start Suit: Set 5 key
immutable x 178,582 ops/sec ±19.49% (40 runs sampled)
seamless-immutable x 9,104 ops/sec ±12.88% (44 runs sampled)
timm x 183,485 ops/sec ±11.72% (51 runs sampled)
monolite x 34,557 ops/sec ±11.83% (45 runs sampled)
mutator x 47,307 ops/sec ±12.90% (51 runs sampled)
Fastest is timm,immutable


Start Suit: Set 10 key
immutable x 119,701 ops/sec ±13.85% (48 runs sampled)
seamless-immutable x 5,727 ops/sec ±10.60% (46 runs sampled)
timm x 115,028 ops/sec ±15.41% (51 runs sampled)
monolite x 23,343 ops/sec ±15.45% (56 runs sampled)
mutator x 32,228 ops/sec ±9.58% (57 runs sampled)
Fastest is immutable,timm
```

## License

MIT
