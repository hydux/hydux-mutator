export default function immer<S extends object>(state: S, update: (draft: S, state: S) => void): S;
