import { defaultHash, Hash } from './utils';
export { defaultHash, Hash };
export default class ImmuSet<T> implements ReadonlySet<T> {
    readonly size: number;
    private _map;
    constructor(values?: ReadonlyArray<T> | Iterable<T>, hash?: Hash);
    [Symbol.iterator](): IterableIterator<T>;
    add(value: T): ImmuSet<T>;
    clear(): ImmuSet<T>;
    delete(value: T): ImmuSet<T>;
    entries(): IterableIterator<[T, T]>;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    toArray(): T[];
    toJSON(): {
        class: string;
        data: T[];
    };
    forEach(callbackfn: (value: T, value2: T, set: ReadonlySet<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
}
