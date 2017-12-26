export declare function setCacheSize(maxSize?: number): void;
/**
 * Set a deep child
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param value The new value to set, if it is ignored it will be set to undefined.
 */
export declare function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V): T;
/**
 * Unset a deep child
 *
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 */
export declare function unsetIn<T, V>(record: T, accessor: ((obj: T) => V | undefined) | string[]): T;
/**
 * Update a deep child by old value
 * @param record The object to update, it can be a plain object or a class instance
 * @param accessor A lambda function to get the key path, support dot, [''], [""], [1], **do not** support dynamic variable, function call, e.g.
 * @param updator A update function that take the old value and return the new value.
 */
export declare function updateIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V): T;
declare const _default: {
    setIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V), value?: V | undefined) => T;
    updateIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V), updator?: ((v: V) => V) | undefined) => T;
};
export default _default;
