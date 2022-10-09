
import { attr, click, create, forEach, model, renderIf, state, text } from "../lib/Plate";

const plateDOM = create(document.querySelector<HTMLElement>('#app')!);
console.log(plateDOM);

const [counter, setCounter] = state(0);
text(plateDOM.refs.countDisplay, () => `${counter()}`);
click(plateDOM.refs.incr, () => setCounter(counter() + 1));
click(plateDOM.refs.decr, () => setCounter(counter() - 1));
const dom = plateDOM.dom;
text(dom.h1, () => `Hello World!`);
attr(dom.h1, "style", () => ({ padding: `${counter()}px`, "background-color": "green", color: "white" }));
attr(dom.div[0], "style", () => ({ padding: "10px", "background-color": "blue", color: "white" }));
text(dom.div[0].h3, () => `Object!`);
click(plateDOM.refs.helloBtn, (e) => {
  console.log(e);
  alert("hi!");
});
click(dom.div[1].helloBtn, (e) => {
  console.log(e);
  alert("das!");
});
renderIf(plateDOM.refs.high, () => counter() > 10);

const [bla, setBla] = state("Blub Blub");
text(plateDOM.refs.inputTest.p, () => bla());
model(plateDOM.refs.inputTest.input, bla, setBla);
model(plateDOM.refs.inputTest.textarea, bla, setBla);



type TODO = {
  name: string,
  done: boolean
};
const [todoName, setTodoName] = state<string>("");
const [list, setList] = state<TODO[]>([
  {
    name: "YO",
    done: false
  },
  {
    name: "YO2",
    done: true
  }
]);

model(plateDOM.refs.todoName, todoName, setTodoName);
click(plateDOM.refs.addTodos, () => {
  setList([...list(), { name: todoName(), done: false }]);
  setTodoName("");
});
text(plateDOM.refs.todosAsJSON, () => JSON.stringify(list()));

forEach(
  plateDOM.refs.todos.li,
  list,
  ({ element, index }) => {
    const itemDOM = create(element);
    text(itemDOM.dom.span, () => list()[index].name);
    model(itemDOM.dom.input, () => list()[index].done, (done) => { list()[index].done = done; setList(list()) });
  }
);





const counterr = create(document.getElementById("counter")!);
text(counterr.dom.span, () => `Count is ${counter()}`);
click(counterr.dom, () => setCounter(counter() + 1));




const [count, setCount] = state(0);
const counterDOM = create(document.getElementById("counterExample")!);
text(counterDOM.dom.section[0].label, () => `The count is: ${count()}`);
click(counterDOM.refs.counter, () => setCount(count() + 1));

attr(counterDOM.dom.section[1], "style", () => count() > 10 ? `background-color:red;` : "");
renderIf(counterDOM.dom.section[1].span, () => count() > 10);

const [fruits] = state(["strawberry", "apple", "banana"]);

const liElement = counterDOM.dom.ul.li;
forEach(liElement, fruits, ({ element, item, index }) => {
  element.textContent = `${index + 1}: ${item.toUpperCase()}`;
});