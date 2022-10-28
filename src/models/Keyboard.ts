export class Keyboard {
  outputKey(keyElement: HTMLButtonElement): string {
    if (!/^\d+$/.test(keyElement.name)) {
      const isInverse = (
        document.querySelector(".keyboard button[name='inverse']") as HTMLButtonElement
      ).classList.contains("active");

      switch (keyElement.name) {
        case "sin":
          return isInverse ? "arcsin(" : "sin(";
        case "cos":
          return isInverse ? "arccos(" : "cos(";
        case "tan":
          return isInverse ? "arctan(" : "tan(";
        case "natural logarithm":
          return isInverse ? "e^(" : "ln(";
        case "logarithm":
          return isInverse ? "(10)^(" : "log(";
        case "square root":
          return isInverse ? "^(2)" : "√(";
        case "fatorial":
          return "!";
        case "power":
          return "^(";
        case "negative power":
          return "^(-1)";
        default:
          return keyElement.innerText;
      }
    }

    return keyElement.name;
  }
}
