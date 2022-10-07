
import { attr, click, create, forEach, model, renderIf, state, text } from "../lib/Plate";

const plateDOM = create(document.querySelector<HTMLElement>('#app')!);
// console.log(plateDOM);

// const [count, setCount] = state(0);
// text(plateDOM.refs.countDisplay, () => `${count()}`);
// click(plateDOM.refs.incr, () => setCount(count() + 1));
// click(plateDOM.refs.decr, () => setCount(count() - 1));
// const dom = plateDOM.dom;
// text(dom.h1, () => `Hello World!`);
// attr(dom.h1, "style", () => ({ padding: `${count()}px`, "background-color": "green", color: "white" }));
// attr(dom.div[0], "style", () => ({ padding: "10px", "background-color": "blue", color: "white" }));
// text(dom.div[0].h3, () => `Object!`);
// click(plateDOM.refs.helloBtn, (e) => {
//   console.log(e);
//   alert("hi!");
// });
// click(dom.div[1].helloBtn, (e) => {
//   console.log(e);
//   alert("das!");
// });
// renderIf(plateDOM.refs.high, () => count() > 10);

// const [bla, setBla] = state("Blub Blub");
// text(plateDOM.refs.inputTest.p, () => bla());
// model(plateDOM.refs.inputTest.input, bla, setBla);
// model(plateDOM.refs.inputTest.textarea, bla, setBla);



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
  (itemDOM, _, index) => {
    text(itemDOM.dom.span, () => list()[index].name);
    model(itemDOM.dom.input, () => list()[index].done, (done) => { list()[index].done = done; setList(list()) });
  }
);





// const counter = create(document.getElementById("counter")!);
// text(counter.dom.span, () => `Count is ${count()}`);
// click(counter.dom, () => setCount(count() + 1));