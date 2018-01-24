import { IShallowClonable } from './types';
export { IShallowClonable };
export declare function setCacheSize(maxSize?: number): void;
/**
 * get a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export declare function getIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], ctx?: (string | number)[]): V;
/**
 * Set a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 * @param ctx Dynamic key map.
 */
export declare function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V, ctx?: (string | number)[]): T;
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export declare function unsetIn<T, V>(record: T, accessor: ((obj: T) => V | undefined) | string[], ctx?: (string | number)[]): T;
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 * @param ctx Dynamic key map.
 */
export declare function updateIn<T, V, A>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V, ctx?: (string | number)[]): T;
declare const _default: {
    setIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V), value?: V | undefined, ctx?: (string | number)[] | undefined) => T;
    unsetIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V | undefined), ctx?: (string | number)[] | undefined) => T;
    updateIn: <T, V, A>(record: T, accessor: string[] | ((obj: T) => V), updator?: ((v: V) => V) | undefined, ctx?: (string | number)[] | undefined) => T;
};
export default _default;
