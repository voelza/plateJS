export function create(element: Element): any {
    const dom: any = {};
    for (let i = 0; i < element.children.length; i++) {
        const childElement: Element = element.children[i];
        addElementToDOM(dom, childElement, childElement.tagName.toLowerCase());
        const ref = childElement.getAttribute("ref");
        if (ref) {
            addElementToDOM(dom, childElement, ref);
        }
    }
    return dom;
}

function addElementToDOM(dom: any, childElement: Element, name: string): void {
    let isArray = dom[name] instanceof Array;
    if (dom[name]) {
        isArray = true;
        dom[name] = [dom[name]];
    }

    let child;
    if (childElement.children.length === 0) {
        child = childElement;
    } else {
        const childDOM = create(childElement);
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

}

export function text(element: Element, text: () => string): void {
    updateForEach(element, el => el.textContent = text());
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