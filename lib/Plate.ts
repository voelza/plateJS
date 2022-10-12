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
    observers: Set<StateObserver>
};


let currentObserver: StateObserver | undefined;
function createGetter<T>(state: State<T | undefined>): () => T {
    //@ts-ignore
    return (self: boolean | undefined = undefined) => {
        if (self) {
            return state;
        }
        if (currentObserver) {
            state.observers.add(currentObserver);
        }
        return state.value!;
    }
}

export function state<T>(startState: T): [() => T, (newState: T) => void] {
    const state: State<T> = {
        value: startState,
        observers: new Set<StateObserver>()
    }
    return [
        createGetter(state),
        (newState: T) => {
            state.value = newState;
            state.observers.forEach(observer => observer.update());
        }
    ];
}

export function computed<T>(computer: () => T): () => T {
    const state: State<T | undefined> = {
        value: undefined,
        observers: new Set<StateObserver>()
    }
    bind(() => {
        state.value = computer();
        for (const observer of state.observers) {
            observer.update();
        }
    });
    return createGetter(state);
}

export function notify(getter: () => any): void {
    //@ts-ignore
    const state: State<any> = getter(true);
    state.observers.forEach(observer => observer.update());
}

function bind(updateFunction: () => void): StateObserver {
    const observer: StateObserver = {
        update:
            () => {
                currentObserver = observer;
                updateFunction();
                currentObserver = undefined;
            }
    };
    observer.update();
    return observer;
}

export function text(element: Element | Element[], text: () => string): void {
    bind(() => {
        const result = text();
        updateForEach(element, el => el.textContent = result);
    });
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


            if (typeof result === "boolean") {
                if (Boolean(result)) {
                    updateForEach(element, el => getElement(el).setAttribute(name, ""));
                } else {
                    updateForEach(element, el => getElement(el).removeAttribute(name));
                }

            } else {
                updateForEach(element, el => getElement(el).setAttribute(name, result));
            }
        }
    );
}

export function renderIf(element: Element | Element[], condition: () => boolean): void {
    const positionReminders = new Map<Element, Text>();
    updateForEach(element, el => {
        const text = new Text();
        el.before(text);
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
                        text?.before(el);
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

type Loop = {
    marker: Text,
    template: Element,
    elements: Element[]
}

export function forEach<T>(element: Element | Element[], list: () => T[], itemSetup: (itemSetupState: ItemSetupState) => void): void {
    const loops: Loop[] = [];
    updateForEach(element, el => {
        const text = new Text();
        el.before(text);
        el.remove();
        loops.push({
            marker: text,
            template: el.cloneNode(true) as Element,
            elements: []
        });
    });
    let previousResult: any[] | undefined = undefined;
    bind(
        () => {
            const result = list();
            try {
                if (result === previousResult) {
                    return;
                }


                for (const loop of loops) {
                    let length = result.length;
                    if (previousResult !== undefined && previousResult.length > length) {
                        length = previousResult.length;
                    }
                    for (let i = 0; i < length; i++) {
                        const item = result[i];
                        const prevItem = previousResult ? previousResult[i] : null;
                        if (item == prevItem) {
                            continue;
                        }

                        const loopElement = loop.elements[i];
                        if (item === undefined) {
                            // index out of bound in current... remove old items
                            loopElement.remove();
                            loop.elements.splice(i, 1);
                        } else if (prevItem === undefined || !loopElement) {
                            // index out of bound in prev... add new item
                            const item = result[i];
                            const cloneEl = loop.template.cloneNode(true) as Element;
                            loop.marker.before(cloneEl);
                            loop.elements.push(cloneEl);
                            requestAnimationFrame(() => itemSetup({ element: cloneEl, item, index: i }));
                        } else {
                            itemSetup({ element: loopElement, item, index: i });
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                previousResult = result.map(o => {
                    if (o instanceof Object) {
                        return structuredClone(o);
                    }
                    return o;
                });
            }
        }
    );
}

export function watch(watcher: () => void): void {
    bind(watcher);
}

export function watchDetached(watcher: () => void, ...stateGetter: (() => any)[]): void {
    const observer = bind(watcher);
    for (const getter of stateGetter) {
        //@ts-ignore
        const state: State<any> = getter(true);
        state.observers.add(observer);
    }
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

            let nextState: any;
            if (event.target instanceof HTMLInputElement) {
                const value = event.target.value;
                nextState = value;
                switch (event.target.type) {
                    case "number":
                    case "range":
                        nextState = parseFloat(value);
                        break;
                    case "date":
                    case "datetime-local":
                        nextState = new Date(value);
                        break;
                    case "checkbox":
                    case "radio":
                        nextState = event.target.checked;
                        break;
                }
            } else if (el instanceof HTMLTextAreaElement) {
                nextState = el.value;
            } else if (event.target instanceof HTMLSelectElement) {
                nextState = event.target.options[event.target.selectedIndex].text;
            }
            //@ts-ignore
            stateSetter(nextState);
        });
    });

    bind(
        () => {
            const stateValue = stateGetter();
            updateForEach(element, el => {
                if (el instanceof HTMLInputElement) {
                    if (el.type === "checkbox" || el.type === "radio") {
                        //@ts-ignore
                        el.checked = stateValue;
                    } else if (el.type === "date" && stateValue instanceof Date) {
                        el.value = stateValue.toISOString().split('T')[0];
                    } else {
                        //@ts-ignore
                        el.value = stateValue;
                    }
                } else if (el instanceof HTMLTextAreaElement) {
                    //@ts-ignore
                    el.value = stateValue;
                }
                else if (el instanceof HTMLSelectElement) {
                    let selectedIndex = 0;
                    for (let i = 0; i < el.options.length; i++) {
                        const option = el.options[i];
                        if (option.text === stateValue) {
                            selectedIndex = i;
                            break;
                        }
                    }
                    el.selectedIndex = selectedIndex;
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