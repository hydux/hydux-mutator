export default class QuickLRU {
    maxSize: number;
    cache: {};
    oldCache: {};
    private _size;
    constructor(opts: any);
    get<T>(key: any): T | void;
    set<T>(key: string, value: T): this;
    has(key: any): boolean;
    delete(key: any): void;
    private _set(key, value);
}
