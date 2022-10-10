import { create, model, state } from "../../../lib/Plate";

const refs = create(document.getElementById("app")!).refs;
const [celsius, setCelsius] = state(0);
const [fahrenheit, setFahrenheit] = state(32);

model(refs.celsius, celsius, (value) => {
    setCelsius(value);
    setFahrenheit(celsius() * (9 / 5) + 32);
});
model(refs.fahrenheit, fahrenheit, (value) => {
    setFahrenheit(value);
    setCelsius((fahrenheit() - 32) * (5 / 9));
});
