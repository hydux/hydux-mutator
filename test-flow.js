// @flow

import mutator from './index'

let state = {
  name: 'aaa',
  age: 1
}
mutator.setIn(state, _ => _.name, {})

mutator.updateIn(state, _ => _.age, a => a + 1)
