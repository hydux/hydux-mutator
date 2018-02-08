import { defaultHash, Hash } from './utils';
import { IImmutableSetable } from '../types';
export { defaultHash };
export default class ImmuMap<K, V> implements ReadonlyMap<K, V>, IImmutableSetable<K, V, ImmuMap<K, V>> {
    readonly size: number;
    private _size;
    private _tree;
    private _hash;
    constructor(entries?: ReadonlyArray<[K, V]> | Iterable<[K, V]>, hash?: Hash);
    [Symbol.iterator](): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    clear(): ImmuMap<K, V>;
    set(key: K, value: V): ImmuMap<K, V>;
    delete(key: K): ImmuMap<K, V>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    entries(): IterableIterator<[K, V]>;
    toJSON(): {
        [key: string]: V;
    };
}
