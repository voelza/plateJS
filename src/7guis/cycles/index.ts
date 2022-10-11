import { attr, click, computed, create, event, forEach, model, renderIf, state, text } from "../../../lib/Plate";

const refs = create(document.getElementById("app")!).refs;

const [history] = state([[]]);
const [index, setIndex] = state(0);
const [circles, setCircles] = state([]);
const [selected, setSelected] = state(null);
const [adjusting, setAdjusting] = state(false);
const isAtFirstIndex = computed(() => index() <= 0);
const isAtLastIndex = computed(() => index() >= history().length - 1);

function adjust(circle: any, e: any) {
    e.preventDefault();
    setSelected(circle);
    setAdjusting(true);
}

forEach(refs.circle, circles, ({ element, item }) => {
    attr(element, "cx", () => item.cx);
    attr(element, "cy", () => item.cy);
    attr(element, "r", () => item.r);
    attr(element, "fill", () => item === selected() ? '#ccc' : '#fff');
    click(element, () => setSelected(item));
    event(element, "contextmenu", (e) => adjust(item, e));
});

// @ts-ignore
click(refs.svg, onClick);

click(refs.undo, undo);
attr(refs.undo, "disabled", isAtFirstIndex);

click(refs.redo, redo);
attr(refs.redo, "disabled", isAtLastIndex);

// @ts-ignore
text(refs.adjustText, () => `Adjust radius of circle at (${selected()?.cx}, ${selected()?.cy})`)
renderIf(refs.dialog, adjusting);

// @ts-ignore
model(refs.range, () => selected()?.r, (r) => {
    // @ts-ignore
    selected().r = r;
    setCircles([...circles()]);
});

// @ts-ignore: Unreachable code error
function onClick({ clientX: x, clientY: y }) {
    if (adjusting()) {
        setAdjusting(false);
        setSelected(null);
        push();
        return
    }
    // @ts-ignore: Unreachable code error
    setSelected(circles().find(({ cx, cy, r }) => {
        const dx = cx - x
        const dy = cy - y
        return Math.sqrt(dx * dx + dy * dy) <= r
    }));

    if (!selected()) {
        // @ts-ignore
        setCircles([...circles(), { cx: x, cy: y, r: 50 }]);
        console.log(circles());
        push();
    }
}

function push() {
    setIndex(index() + 1);
    history().length = index();
    history().push(clone(circles()));
}

function undo() {
    setIndex(index() - 1);
    setCircles(clone(history()[index()]));
}

function redo() {
    setIndex(index() + 1);
    setCircles(clone(history()[index()]));
}

function clone(circles: any) {
    return circles.map((c: any) => ({ ...c }))
}
