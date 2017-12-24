export declare function setCacheSize(maxSize?: number): void;
export declare function setIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], value?: V): T;
export declare function updateIn<T, V>(record: T, accessor: ((obj: T) => V) | string[], updator?: (v: V) => V): T;
declare const _default: {
    setIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V), value?: V | undefined) => T;
    updateIn: <T, V>(record: T, accessor: string[] | ((obj: T) => V), updator?: ((v: V) => V) | undefined) => T;
};
export default _default;
