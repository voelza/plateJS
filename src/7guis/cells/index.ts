import { attr, click, create, event, forEach, model, notify, renderIf, state, text } from "../../../lib/Plate";
import { cells, evalCell } from "./store";

const [cols] = state(cells().map((_: any, i: number) => String.fromCharCode(65 + i)));
const [colsLengthAsArray, setColsLengthAsArray] = state([] as Number[]);
for (let i = 0; i < cells()[0].length; i++) {
    setColsLengthAsArray([...colsLengthAsArray(), i]);
}

const refs = create(document.getElementById("app")!).refs;
forEach(refs.head, cols, ({ element, item }) => {
    element.textContent = item;
});

forEach(refs.colsLengthAsArray, colsLengthAsArray, ({ element, item, index: r }) => {
    const refs = create(element).refs;
    text(refs.rowNum, () => item);

    forEach(refs.cols, cols, ({ element: el, index: c }) => {
        const [editing, setEditing] = state(false);

        const refs = create(el).refs;
        attr(refs.cell, "title", () => cells()[c][r]);
        click(refs.cell, () => setEditing(true));

        renderIf(refs.editInput, editing);
        attr(refs.editInput, "value", () => cells()[c][r]);
        event(refs.editInput, "blur", (e) => {
            setEditing(false);
            // @ts-ignore
            cells()[c][r] = e.target.value.trim();
            notify(cells);
        });

        renderIf(refs.cellValue, () => !editing());
        text(refs.cellValue, () => evalCell(cells()[c][r]));
    })
});