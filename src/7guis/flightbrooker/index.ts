import { attr, click, computed, create, forEach, model, state, text } from "../../../lib/Plate";

const refs = create(document.getElementById("app")!).refs;

const [type, setType] = state("one-way flight");
model(refs.type, type, setType);

const [date, setDate] = state(new Date());
const [returnDate, setReturnDate] = state(new Date(new Date().getTime() + 86000000));

model(refs.date, date, setDate);
model(refs.returnDate, returnDate, setReturnDate);
attr(refs.returnDate, "disabled", () => type() === "one-way flight");

const returnDateBeforeDate = computed(() => returnDate().getTime() < date().getTime());
attr(refs.book, "disabled", () => returnDateBeforeDate() && type() === "two-way flight");
click(refs.book, () => {
    alert(`
    You booked ${type()}:
    Date: ${date().toLocaleDateString()}
    ${type() === "two-way flight" ? `Return Date: ${returnDate().toLocaleDateString()}` : ""}
    `);
});
