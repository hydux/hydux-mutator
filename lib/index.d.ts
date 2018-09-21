import { IShallowClonable, IImmutableSetable } from './types';
export { IShallowClonable, IImmutableSetable };
export declare function setCacheSize(maxSize?: number): void;
export declare type Key = string | number | symbol;
export declare type KeyPath = Key[];
export declare type Accessor<T, V> = ((obj: T) => V) | KeyPath;
export declare function getPathKeys<T, V>(accessor: Accessor<T, V>, ctx?: KeyPath): KeyPath;
/**
 * get a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export declare function getIn<T, V>(record: T, accessor: Accessor<T, V>, ctx?: KeyPath): V | void;
/**
 * Set a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 * @param ctx Dynamic key map.
 */
export declare function setIn<T, V>(record: T, accessor: Accessor<T, V>, value?: V, ctx?: KeyPath): T;
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param ctx Dynamic key map.
 */
export declare function unsetIn<T, V>(record: T, accessor: Accessor<T, V | void>, ctx?: KeyPath): T;
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 * @param ctx Dynamic key map.
 */
export declare function updateIn<T, V, A>(record: T, accessor: Accessor<T, V>, updator?: (v: V) => V, ctx?: KeyPath): T;
declare const _default: {
    setIn: <T, V>(record: T, accessor: Accessor<T, V>, value?: V | undefined, ctx?: PropertyKey[] | undefined) => T;
    unsetIn: <T, V>(record: T, accessor: Accessor<T, void | V>, ctx?: PropertyKey[] | undefined) => T;
    updateIn: <T, V, A>(record: T, accessor: Accessor<T, V>, updator?: ((v: V) => V) | undefined, ctx?: PropertyKey[] | undefined) => T;
};
export default _default;
