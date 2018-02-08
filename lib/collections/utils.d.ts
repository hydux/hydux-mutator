export declare function iterMap<T, U>(list: Iterable<T>, cb: (a: T) => U): IterableIterator<U>;
export declare function iter<T>(list: Iterable<T>, cb: (a: T) => void): void;
export declare type Hash = (v: any) => string;
export declare function defaultHash(key: any): string;
