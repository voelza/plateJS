
import { attr, click, create, text } from "../lib/Plate";

const plateDOM = create(document.querySelector<HTMLElement>('#app')!);
const dom = plateDOM.dom;
text(dom.h1, () => `Hello World!`);
attr(dom.h1, "style", () => ({ padding: "10px", "background-color": "green", color: "white" }));
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