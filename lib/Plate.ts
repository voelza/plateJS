export type PlateDOM = {
    dom: any,
    refs: any
}

export function create(element: Element): PlateDOM {
    const refs = {};
    return {
        dom: createDOMElement(createDOMAndFillRefs(element, refs), element),
        refs
    };
}

function createDOMElement(childDOM: any, element: Element): any {
    const dom: any = {};
    Object.entries(childDOM).forEach(([k, v]) => dom[k] = v);
    dom.__self = element;
    return dom;
}

function createDOMAndFillRefs(element: Element, refs: any): any {
    const dom: any = {};
    for (let i = 0; i < element.children.length; i++) {
        const childElement: Element = element.children[i];
        const names = [childElement.tagName.toLowerCase()];
        const ref = childElement.getAttribute("ref");
        if (ref) {
            names.push(ref);
        }

        for (const name of names) {
            let isArray = dom[name] instanceof Array;
            if (!isArray && dom[name]) {
                isArray = true;
                dom[name] = [dom[name]];
            }

            let child;
            if (childElement.children.length === 0) {
                child = childElement;
            } else {
                child = createDOMElement(createDOMAndFillRefs(childElement, refs), childElement);
            }

            if (isArray) {
                dom[name].push(child);
            } else {
                dom[name] = child;
            }

            if (ref) {
                refs[ref] = dom[name];
            }
        }
    }
    return dom;
}

type StateObserver = {
    update: () => void
};

type State<T> = {
    value: T,
    observers: StateObserver[]
};


let createObserverMode: boolean = false;
let statesToObserve: State<any>[] = [];
export function state<T>(startState: T): [() => T, (newState: T) => void] {
    const state: State<T> = {
        value: startState,
        observers: []
    }
    return [
        () => {
            if (createObserverMode) {
                statesToObserve.push(state);
            }
            return state.value;
        },
        (newState: T) => {
            state.value = newState;
            for (const observer of state.observers) {
                observer.update();
            }
        }
    ];
}

export function computed<T>(computer: () => T): () => T {
    const state: State<T | undefined> = {
        value: undefined,
        observers: []
    }
    bind(() => {
        state.value = computer();
        for (const observer of state.observers) {
            observer.update();
        }
    });
    return () => {
        if (createObserverMode) {
            statesToObserve.push(state);
        }
        return state.value!;
    };
}

function bind(updateFunction: () => void): void {
    createBinding(updateFunction, updateFunction);
}

function createBinding(bindingCollectorFunction: () => void, updateFunction: () => void): void {
    createObserverMode = true;

    bindingCollectorFunction();

    if (statesToObserve.length > 0) {
        const observer: StateObserver = { update: updateFunction };
        for (const state of statesToObserve) {
            state.observers.push(observer);
        }
    }

    createObserverMode = false;
    statesToObserve = [];
}

export function text(element: Element | Element[], text: () => string): void {
    bind(
        () => {
            const result = text();
            updateForEach(element, el => el.textContent = result);
        }
    );
}

export function attr(element: Element | Element[], name: string, value: () => Object | string): void {
    bind(
        () => {
            const val: Object | string = value();
            let result: string;
            if (typeof val === 'object') {
                result = Object.entries(val).map(([key, value]) => `${key}:${value}`).join(";");
            } else {
                result = val;
            }

            updateForEach(element, el => getElement(el).setAttribute(name, result));
        }
    );
}

export function renderIf(element: Element | Element[], condition: () => boolean): void {
    const positionReminders = new Map<Element, Text>();
    updateForEach(element, el => {
        const text = new Text();
        el.parentElement?.insertBefore(text, el);
        positionReminders.set(el, text);
    });
    let previousResult: boolean | undefined = undefined;
    bind(
        () => {
            const result = condition();
            try {
                if (result === previousResult) {
                    return;
                }

                updateForEach(element, el => {
                    if (result) {
                        const text = positionReminders.get(el);
                        text?.parentElement?.insertBefore(el, text.nextSibling);
                    } else {
                        el.remove();
                    }
                });
            } catch (e) {
                console.error(e);
            } finally {
                previousResult = result;
            }
        }
    );
}

export type ItemSetupState = {
    element: Element,
    item: any,
    index: number
}

export function forEach<T>(element: Element | Element[], list: () => T[], itemSetup: (itemSetupState: ItemSetupState) => void): void {
    const positionReminders = new Map<Element, Text>();
    const loopElements = new Map<Element, Element[]>();
    updateForEach(element, el => {
        const text = new Text();
        el.parentElement?.insertBefore(text, el);
        positionReminders.set(el, text);
        loopElements.set(el, []);
        el.remove();
    });
    let previousResult: any[] | undefined = undefined;
    bind(
        () => {
            const result = list();
            try {
                if (result === previousResult) {
                    return;
                }

                updateForEach(element, el => {
                    const loopElement = loopElements.get(el);
                    for (const element of loopElement!) {
                        element.remove();
                    }
                    const text = positionReminders.get(el);
                    for (let i = 0; i < result.length; i++) {
                        const item = result[i];
                        const cloneEl = el.cloneNode(true) as Element;
                        text?.parentElement?.insertBefore(cloneEl, text);
                        loopElement?.push(cloneEl);
                        requestAnimationFrame(() => itemSetup({ element: cloneEl, item, index: i }));
                    }
                });
            } catch (e) {
                console.error(e);
            } finally {
                previousResult = result;
            }
        }
    );
}

export function watch(watcher: () => void): void {
    bind(watcher);
}

export function watchDetached(watcher: () => void, ...stateGetter: (() => any)[]): void {
    createBinding(() => stateGetter.forEach(s => s()), watcher);
}

export function event(element: Element | Element[], event: string, handler: (e: Event) => void): void {
    updateForEach(element, el => el.addEventListener(event, handler));
}

export function click(element: Element | Element[], handler: (e: Event) => void): void {
    event(element, "click", handler);
}

export function model<T>(element: Element | Element[], stateGetter: () => T, stateSetter: (newState: T) => void): void {
    updateForEach(element, el => {
        event(el, "input", (e) => {
            const event = e as InputEvent;
            const target = event.target as HTMLInputElement;
            const value = target.value;
            let nextState: any = value;
            switch (target.type) {
                case "number":
                case "range":
                    nextState = parseFloat(value);
                case "date":
                case "datetime-local":
                    nextState = new Date(value);
                case "checkbox":
                case "radio":
                    nextState = target.checked;

            }
            //@ts-ignore
            stateSetter(nextState);
        });
    });

    bind(
        () => {
            const stateValue = stateGetter();
            updateForEach(element, el => {
                const target = el as HTMLInputElement;
                if (target.type === "checkbox" || target.type === "radio") {
                    //@ts-ignore
                    target.checked = stateValue;
                } else {
                    //@ts-ignore
                    target.value = stateValue;
                }
            });
        }
    );
}

function getElement(element: any) {
    if (element instanceof Element) {
        return element;
    }
    return element.__self;
}

function updateForEach(element: Element | Element[], consumer: (el: Element) => void) {
    let elements;
    if (element instanceof Array) {
        elements = [...element];
    } else {
        elements = [element];
    }
    elements.forEach(el => consumer(getElement(el)));
}