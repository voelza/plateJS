import { click, create, model, state } from "../../../lib/Plate";

const dom = create(document.getElementById("app")!).dom;
const [count, setCount] = state(0);
model(dom.input, count, setCount);
click(dom.button, () => setCount(count() + 1));