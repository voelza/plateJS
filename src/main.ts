
import { attr, click, computed, create, forEach, model, renderIf, state, text, watch, watchDetached } from "../lib/Plate";

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

const counterDoubled = computed(() => count() * 2);
text(counterDOM.dom.section[0].span, () => `${counterDoubled()}`);
watch(() => {
  console.log("Count: ", count(), counterDoubled());
});

watchDetached(() => {
  console.log("Eyooooo");
}, count);


const ul = document.createElement("ul");
const li = document.createElement("li");
ul.appendChild(li);

const [fruits, setFruits] = state(["strawberry", "apple", "banana"]);
forEach(li, fruits, ({ element, item, index }) => {
  element.textContent = `${index + 1}: ${item.toUpperCase()}`;
});

const addFruitBtn = document.createElement("button");
addFruitBtn.textContent = "Add Fruit";
const removeFruitBtn = document.createElement("button");
removeFruitBtn.textContent = "Remove Fruit";

let grapeCounter = 0;
click(addFruitBtn, () => setFruits([...fruits(), "grape" + [...Array(++grapeCounter).keys()].map(_ => "s").join("")]));
click(removeFruitBtn, () => {
  grapeCounter--;
  setFruits([...fruits().slice(0, fruits().length - 1)]);
});

const randomFruitOrder = document.createElement("button");
randomFruitOrder.textContent = "Randomize Fruits";
click(randomFruitOrder, () => {
  setFruits(fruits()
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value))
});

document.body.appendChild(ul);
document.body.appendChild(addFruitBtn);
document.body.appendChild(removeFruitBtn);
document.body.appendChild(randomFruitOrder);


const boolTest = create(document.getElementById("boolTest")!).refs;

const [boolA, setBoolA] = state(true);
const [boolB, setBoolB] = state(true);

click(boolTest.toggleA, () => setBoolA(!boolA()));
click(boolTest.toggleB, () => setBoolB(!boolB()));
text(boolTest.toggleA, () => `Toggle A (${boolA()})`);
text(boolTest.toggleB, () => `Toggle B (${boolB()})`);

text(boolTest.aAndB, () => `a && b = ${boolA() && boolB()}`);
text(boolTest.aOrB, () => `a || b = ${boolA() || boolB()}`);
text(boolTest.notAAndB, () => `!a && b  = ${!boolA() && boolB()}`);
text(boolTest.aAndNotB, () => `a && !b = ${boolA() && !boolB()}`);
text(boolTest.notAAndNotB, () => `!a && !b = ${!boolA() && !boolB()}`);