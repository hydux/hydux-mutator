export declare function assign(obj1: any, obj2: any): any;
export default class QuickLRU {
    maxSize: number;
    cache: {};
    oldCache: {};
    _size: number;
    constructor(opts: any);
    _set(key: any, value: any): void;
    get(key: any): any;
    set(key: any, value: any): this;
    has(key: any): boolean;
    delete(key: any): void;
}
