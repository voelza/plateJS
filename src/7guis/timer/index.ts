import { create, computed, state, attr, text, model, click } from "../../../lib/Plate";

const refs = create(document.getElementById("app")!).refs;

const [duration, setDuration] = state(15000);
const durationDisplay = computed(() => (duration() / 1000).toFixed(1));
const [elapsed, setElapsed] = state(0);
const elapseDisplay = computed(() => (elapsed() / 1000).toFixed(1));
const progress = computed(() => elapsed() / duration());

let lastTime = performance.now();
let handle: number | undefined = undefined;
const update = () => {
    const time = performance.now();
    setElapsed(elapsed() + Math.min(time - lastTime, duration() - elapsed()));
    lastTime = time;
    handle = requestAnimationFrame(update);
}

update();

attr(refs.progress, "value", progress);
model(refs.range, duration, setDuration);
text(refs.elapseDisplay, elapseDisplay);
text(refs.durationDisplay, durationDisplay);
click(refs.reset, () => setElapsed(0));