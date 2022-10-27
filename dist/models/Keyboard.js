export class Keyboard {
    outputKey(keyElement) {
        if (!/^\d+$/.test(keyElement.name)) {
            switch (keyElement.name) {
                case "sin":
                    return "sin(";
                case "cos":
                    return "cos(";
                case "tan":
                    return "tan(";
                case "natural logarithm":
                    return "ln(";
                case "logarithm":
                    return "log(";
                case "fatorial":
                    return "!";
                case "power":
                    return "^";
                case "negative power":
                    return "^(-1)";
                default:
                    return keyElement.innerText;
            }
        }
        return keyElement.name;
    }
}
