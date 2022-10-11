import { create, computed, state, text, model, click, watch, forEach } from "../../../lib/Plate";

const refs = create(document.getElementById("app")!).refs;


const [names, setNames] = state(['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman'])
const [selected, setSelected] = state('')
const [prefix, setPrefix] = state('')
const [first, setFirst] = state('')
const [last, setLast] = state('')

const filteredNames = computed(() =>
    names().filter((n) =>
        n.toLowerCase().startsWith(prefix().toLowerCase())
    )
);

watch(() => {
    const [l, f] = selected().split(', ');
    setFirst(f);
    setLast(l);
})

function createPerson() {
    if (hasValidInput()) {
        const fullName = `${last()}, ${first()}`
        if (!names().includes(fullName)) {
            setNames([...names(), fullName]);
            setFirst('');
            setLast('');
        }
    }
}

function update() {
    if (hasValidInput() && selected()) {
        const i = names().indexOf(selected())
        names()[i] = `${last()}, ${first()}`;
        setSelected(names()[i]);
        setNames([...names()]);
    }
}

function del() {
    if (selected()) {
        const i = names().indexOf(selected());
        names().splice(i, 1)
        setNames([...names()]);
        setSelected('');
        setFirst('');
        setLast('');
    }
}

function hasValidInput() {
    return first().trim() && last().trim();
}

model(refs.prefix, prefix, setPrefix);
model(refs.selected, selected, setSelected);
forEach(refs.names, filteredNames, ({ element, item }) => {
    text(element, () => item);
});

model(refs.first, first, setFirst);
model(refs.last, last, setLast);

click(refs.create, createPerson);
click(refs.update, update);
click(refs.del, del);