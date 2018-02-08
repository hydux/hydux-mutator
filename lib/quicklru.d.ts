export default class QuickLRU {
    maxSize: number;
    cache: {};
    oldCache: {};
    _size: number;
    constructor(opts: any);
    _set(key: any, value: any): void;
    get<T>(key: any): T | void;
    set<T>(key: string, value: T): this;
    has(key: any): boolean;
    delete(key: any): void;
}
