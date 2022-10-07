export type PlateDOM = {
    dom: any,
    refs: any
}

export function create(element: Element): PlateDOM {
    const refs = {};
    const dom = createDOMAndFillRefs(element, refs);
    return { dom, refs };
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
                const childDOM = createDOMAndFillRefs(childElement, refs);
                child = new Proxy({}, {
                    get(_, prop) {
                        if (prop === "self") {
                            return childElement;
                        }
                        return childDOM[prop];
                    }
                });
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

function bind(valueFunction: () => any, updateFunction: () => void): any {
    createObserverMode = true;

    valueFunction();

    if (statesToObserve.length > 0) {
        const observer: StateObserver = { update: updateFunction };
        for (const state of statesToObserve) {
            state.observers.push(observer);
        }
    }

    createObserverMode = false;
    statesToObserve = [];
}

export function text(element: Element, text: () => string): void {
    const update = () => updateForEach(element, el => el.textContent = text());
    bind(text, update)
    update();
}

export function attr(element: Element | Element[], name: string, value: () => Object | string): void {
    const val: Object | string = value();
    let result: string;
    if (typeof val === 'object') {
        result = Object.entries(val).map(([key, value]) => `${key}:${value}`).join(";");
    } else {
        result = val;
    }
    updateForEach(element, el => getElement(el).setAttribute(name, result));
}

export function click(element: Element | Element[], handler: (e: Event) => void): void {
    updateForEach(element, el => el.addEventListener("click", handler));
}

function getElement(element: any) {
    if (element instanceof Element) {
        return element;
    }
    return element.self;
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