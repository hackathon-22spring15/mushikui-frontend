export const transSymbol = (char: string) => {
    if (char === "*") {
        return "×";
    } else if (char === "/") {
        return "÷";
    } else {
        return char;
    }
};