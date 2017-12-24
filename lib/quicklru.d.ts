export default class QuickLRU {
    maxSize: number;
    cache: Map<any, any>;
    oldCache: Map<any, any>;
    _size: number;
    constructor(opts: any);
    _set(key: any, value: any): void;
    get(key: any): any;
    set(key: any, value: any): this;
    has(key: any): boolean;
    delete(key: any): void;
}
