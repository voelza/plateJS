export declare type PlateDOM = {
    dom: any;
    refs: any;
};
export declare function create(element: Element): PlateDOM;
export declare function state<T>(startState: T): [() => T, (newState: T) => void];
export declare function computed<T>(computer: () => T): () => T;
export declare function notify(getter: () => any): void;
export declare function text(element: Element | Element[], text: () => string): void;
export declare function attr(element: Element | Element[], name: string, value: () => Object | string): void;
export declare function renderIf(element: Element | Element[], condition: () => boolean): void;
export declare type ItemSetupState = {
    element: Element;
    item: any;
    index: number;
};
export declare function forEach<T>(element: Element | Element[], list: () => T[], itemSetup: (itemSetupState: ItemSetupState) => void): void;
export declare function watch(watcher: () => void): void;
export declare function watchDetached(watcher: () => void, ...stateGetter: (() => any)[]): void;
export declare function event(element: Element | Element[], event: string, handler: (e: Event) => void): void;
export declare function click(element: Element | Element[], handler: (e: Event) => void): void;
export declare function model<T>(element: Element | Element[], stateGetter: () => T, stateSetter: (newState: T) => void): void;
