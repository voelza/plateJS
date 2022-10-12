import { state } from "../../../lib/Plate";

const COLS = 5
const ROWS = 20

export const cells = state(Array.from(Array(COLS).keys()).map(() => Array.from(Array(ROWS).keys()).map(() => '')))[0];

// adapted from https://codesandbox.io/s/jotai-7guis-task7-cells-mzoit?file=/src/atoms.ts
// by @dai-shi
export function evalCell(exp: any) {
    if (!exp) {
        return;
    }

    if (!exp.startsWith('=')) {
        return exp
    }

    // = A1 + B2 ---> get(0,1) + get(1,2)
    exp = exp
        .slice(1)
        .replace(
            /\b([A-Z])(\d{1,2})\b/g,
            (_: any, c: any, r: any) => `get(${c.charCodeAt(0) - 65},${r})`
        )

    try {
        return new Function('get', `return ${exp}`)(getCellValue)
    } catch (e) {
        return `#ERROR ${e}`
    }
}

function getCellValue(c: any, r: any) {
    const val = evalCell(cells()[c][r])
    const num = Number(val)
    return Number.isFinite(num) ? num : val
}
