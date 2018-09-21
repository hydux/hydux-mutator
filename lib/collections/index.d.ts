import ImmuList from './list';
import ImmuMap from './map';
import ImmuSet from './set';
export * from './utils';
export { ImmuList, ImmuMap, ImmuSet };
declare const _default: {
    ImmuList: typeof ImmuList;
    ImmuMap: typeof ImmuMap;
    ImmuSet: typeof ImmuSet;
};
export default _default;
export declare function stringify(val: any, replacer?: (key: string, value: any) => any, space?: string | number): string;
export declare function parse(text: string, reviver?: (key: any, value: any) => any): any;
