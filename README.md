# plateJS

PlateJS is a JavaScript library to bind state to objects within your DOM. A quick counter example would look like this. 

```html
<div id="counterExample">
    <section>
        <label></label>
        <button ref="counter">+</button>
    </section>
    <section>
        <span>This is getting high!</span>
    </section>
</div>
```

```javascript
import { state, create, text, attr, click, renderIf } from "PlateJS";

const [count, setCount] = state(0);

const counterDOM = create(document.getElementById("counterExample")!);
text(counterDOM.dom.section[0].label, () => `The count is: ${count()}`);
click(counterDOM.refs.counter, () => setCount(count() + 1));

attr(counterDOM.dom.section[1], "style", () => count() > 10 ? `background-color:red;` : "");
renderIf(counterDOM.dom.section[1].span, () => count() > 10);
```

# Creating State

To create reactive state you will have to call the `state` function. This will return two functions in an array. The first index will be the getter for your state and the 
second index will be the setter to change your state.

```javascript
const [count, setCount] = state(0);
```

# Binding DOM elements to state

To bind DOM elements to state you will have to use the given linking functions.

Currently there are the following bindings exist:
- text
- attr
- model


## DOM binding: text()

To bind a reactive textContent to an element you use the `text` function. It takes in one or more elements and a function to create the text.

```typescript
function text(element: Element | Element[], text: () => string): void
```

Example: 
```html
<label></label>
```

```javascript
const [count, setCount] = state(0);

const labelElement = [...] // get it however you want.
text(labelElement, () => `The count is: ${count()}`);
```

## DOM binding: attr()

To bind a reactive attribute to an element you use the `attr` function. It takes in one or more elements, the name of the attribute and a function to create the value for the attribute. The attribute value can be a string or an object which will be converted into  string by concatenating its properties like this `prop1:value1;prop2:value2;prop3:value3;`.

```typescript
function attr(element: Element | Element[], name: string, value: () => Object | string): void
```

Example: 
```html
<section></section>
```

```javascript
const [count, setCount] = state(0);

const sectionElement = [...] // get it however you want.
attr(sectionElement, "style", () => count() > 10 ? `background-color:red;` : "");
```

## DOM binding: model()
For input-elements you might want to create a binding of the value of the element to a specific state and change this state whenever the `input` event of the input-element is thrown. Because this is a common use-case we create the `model` 
binding to bind a state to a specifc elements value. Use the `model` function to create such a binding by passing one or more elements to it, provide the state getter and the state setter.

```typescript
function model<T>(element: Element | Element[], stateGetter: () => T, stateSetter: (newState: T) => void): void
```

Example: 
```html
<input />
```

```javascript
const [text, setText] = state("This is the start value.");

const inputElement = [...] // get it however you want.
model(inputElement, text, setText);
```

# Control flow

This library give you two options to add control flow to your DOM elements.

## Conditional rendering

To use conditional rendering use the `renderIf` function and pass in one or more elements and a condition function which returns a boolean. The result of that function will determine whether the element(s) will be rendered in the DOM or not.

```typescript
function renderIf(element: Element | Element[], condition: () => boolean): void
```

Example: 
```html
<span>This is getting high!</span>
```

```javascript
const [count, setCount] = state(0);

const spanElement = [...] // get it however you want.
renderIf(spanElement, () => count() > 10);
```

## Loops

If you have a list-state and want to create a loop for a given element you can use the `forEach` function. It takes in one or more elements, the list getter and a function which gives you three parameter you can use to fill the element that where created with the loop. 

```typescript
function forEach<T>(element: Element | Element[], list: () => T[], itemSetup: (itemSetupState: ItemSetupState) => void): void
```

The `ItemSetupState` looks like this:
```typescript
type ItemSetupState = {
    element: Element,
    item: any,
    index: number
}
```

Example:
```html
<ul>
    <li></li>
</ul>
```

```javascript
const [fruits, setFruits] = state(["strawberry", "apple", "banana"]);

const liElement = [...] // get it however you want
forEach(liElement, fruits, ({element, item, index}) => {
    element.textContent = `${index + 1}: ${item}`;
});
```

# Event helpers

To create DOM events we provided you a little helper to make it shorter and easier. You can use the `event` function and pass one or more elements to it, provide the event name you want to bind to and the handler.

```typescript
function event(element: Element | Element[], event: string, handler: (e: Event) => void): void
```

Also we provide you with a `click` function which is just a shorthand for the `event` function for click events.
```typescript
export function click(element: Element | Element[], handler: (e: Event) => void): void {
    event(element, "click", handler);
}
```

Example:
```html
<button>+</button>
```

```javascript
const [count, setCount] = state(0);

const buttonElement = [...] // get the element however you like

event(buttonElement, "click", () => setCount(count() + 1));
// or
click(buttonElement, () => setCount(count() + 1));
```

# Plate DOM

To help you with binding DOM elments to state PlateJS offers a `create` function which takes in an element and returns an object that represents the elements structure with
and simple object. It also enables you to annotate certain elements with a `ref` attribute which you will be able to reference as well.

For example if you have this element:
```html
<div id="app">
    <section>
        <label></label>
        <button ref="counter">+</button>
    </section>
    <section>
        <span>This is getting high!</span>
    </section>
</div>
```

You can create a `PlateDOM` object like this:
```javascript
const plateDOM = create(document.getElementById("app"));
```

The `PlateDOM` offers the following properties:
```typescript
type PlateDOM = {
    dom: any,
    refs: any
}
```

The `dom` will be filled with an object that represents the element - hierarchy that you passed into the `create` function. Within the DOM every property on this object will reference the child DOM element by its tag name and its name given by a `ref` attribute. If there are multiple occurences of a tag name or a `ref` on a given hierarchy level theses will be put into an array in the order of their defintion.

For example to access the label in the first section we would use this code: 
```javascript
plateDOM.dom.section[0].label
```

If we wanted to select all the section elements we would use the folliwing code:
```javascript
plateDOM.dom.section
```

In our example the button within the first section has a `ref` attribute. We can now selected it by its tag name or its given ref-name.
```javascript
plateDOM.dom.section[0].counter  // <-- same element
plateDOM.dom.section[0].button   // <-- as this
```

The `refs` will contain all the elements which had a `ref` attribute. Again if there are multiple occurences of `ref` on a given hierarchy level theses will be put into an array in the order of their defintion.

In our example the only ref have is the counter button.
```javascript
plateDOM.refs.counter
```

The complete `PlateDOM` of our example looks like this

```javascript
{
    dom: {
        section: [
            {
                label,
                button,
                counter
            },
            {
                span
            }
        ]
    }
    refs: {
        counter
    }
}
```