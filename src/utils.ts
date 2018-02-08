
export const isSet = val => typeof val !== 'undefined' && val !== null
export const isFn = (fn): fn is Function => typeof fn === 'function'
export const isPojo = obj => !isSet(obj.constructor) || obj.constructor === Object
export const error = (...args) => console.error('[hydux-mutator]', ...args)
export const isObj = obj => typeof obj === 'object' && obj
