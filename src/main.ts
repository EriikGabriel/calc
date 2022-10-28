import { Keyboard } from "./models/Keyboard.js";

const panelInputElement = document.querySelector(".panel input") as HTMLInputElement;
const panelResultElement = document.querySelector(".panel .result") as HTMLParagraphElement;
const keyboardButtons = document.querySelectorAll(".keyboard button") as NodeListOf<HTMLButtonElement>;

const keyboard = new Keyboard();

let ans = "";

const resolveFunctions = (exp: string): string => {
  let funcResult = exp;

  const funcRegex = /(?<func>cos|sin|tan|log|ln|√)\((?<value>[^\)]*)\)*/gm;
  let funcRegexResult: RegExpExecArray | null;

  let res = null;

  while ((funcRegexResult = funcRegex.exec(exp))) {
    const func = funcRegexResult.groups?.func;
    const value = funcRegexResult.groups?.value;

    const evalResult = evalStringExp(value ?? "");

    if (evalResult) {
      switch (func) {
        case "sin":
          res = Math.sin(Number(evalResult));
          break;
        case "cos":
          res = Math.cos(Number(evalResult));
          break;
        case "tan":
          res = Math.tan(Number(evalResult));
          break;
        case "log":
          res = Math.log10(Number(evalResult));
          break;
        case "ln":
          res = Math.log(Number(evalResult));
          break;
        case "√":
          res = Math.sqrt(Number(evalResult));
          break;
      }

      funcResult = funcResult.replace(funcRegexResult[0], String(res));
    }
  }

  return funcResult;
};

const resolveOtherOperations = (exp: string): string => {
  let othersOpResult = exp;

  let unaryOpRegex = /(\((?<valueGroup>[^\)]*)\)*|(?<valueUnique>\S))(?<unaryOp>!|%|\^\(-1\))/gm;
  let unaryOpRegexResult: RegExpExecArray | null;

  let res = null;

  while ((unaryOpRegexResult = unaryOpRegex.exec(exp))) {
    const unaryOp = unaryOpRegexResult.groups?.unaryOp;
    const valueGroup = unaryOpRegexResult.groups?.valueGroup;
    const valueUnique = unaryOpRegexResult.groups?.valueUnique;

    const value = valueGroup ?? valueUnique;

    const evalResult = evalStringExp(value ?? "");

    switch (unaryOp) {
      case "!":
        let resFat = Number(evalResult);
        if (resFat != 0) {
          for (var i = 1; i < Number(evalResult); i++) resFat *= i;
        } else resFat = 1;
        res = resFat;
        break;
      case "%":
        res = Number(evalResult) / 100;
        break;
      case "^(-1)":
        res = Math.pow(Number(evalResult), -1);
        break;
    }

    othersOpResult = othersOpResult.replace(unaryOpRegexResult[0], String(res));
  }

  let binaryOpRegex =
    /(\((?<baseValueGroup>[^\)]*)\)*|(?<baseValueUnique>\S))(?<binaryOp>\^)(\((?<expValueGroup>[^\)]*)\)*)/gm;
  let binaryOpRegexResult: RegExpExecArray | null;

  res = null;

  while ((binaryOpRegexResult = binaryOpRegex.exec(exp))) {
    const binaryOp = binaryOpRegexResult.groups?.binaryOp;
    const baseValueGroup = binaryOpRegexResult.groups?.baseValueGroup;
    const baseValueUnique = binaryOpRegexResult.groups?.baseValueUnique;
    const expValueGroup = binaryOpRegexResult.groups?.expValueGroup;

    const baseValue = baseValueGroup ?? baseValueUnique;
    const expValue = expValueGroup;

    const baseEvalResult = evalStringExp(baseValue ?? "");
    const expEvalResult = evalStringExp(expValue ?? "");

    switch (binaryOp) {
      case "^":
        res = Math.pow(Number(baseEvalResult), Number(expEvalResult));
        break;
    }

    othersOpResult = othersOpResult.replace(binaryOpRegexResult[0], String(res));
  }

  return othersOpResult;
};

const resolveCalc = (calc: string): string => {
  let calcResult = calc;

  //? Constants symbols replace
  calcResult = calcResult.replace(/π/gm, String(Math.PI));
  calcResult = calcResult.replace(/e/gm, String(Math.E));

  //? Basics operations symbols replace
  calcResult = calcResult.replace(/Ans/gm, ans);
  calcResult = calcResult.replace(/×/gm, "*");
  calcResult = calcResult.replace(/÷/gm, "/");

  calcResult = resolveOtherOperations(calcResult);
  calcResult = resolveFunctions(calcResult);

  // console.log(`${calcResult} = ${evalStringExp(calcResult)}`);

  return evalStringExp(calcResult) ? String(evalStringExp(calcResult)) : "";
};

keyboardButtons?.forEach((button) => {
  button.addEventListener("click", (e: Event) => {
    const buttonElement = e.currentTarget as HTMLButtonElement;

    if (panelResultElement.classList.contains("result-highlight")) {
      panelInputElement.value = "";
      panelResultElement.innerText = "";

      panelResultElement.classList.remove("result-highlight");
      panelInputElement.classList.remove("result-highlight");
    }

    switch (buttonElement.name) {
      case "clear":
        panelInputElement.value = "0";
        panelResultElement.innerText = "";

        panelResultElement.classList.remove("result-highlight");
        panelInputElement.classList.remove("result-highlight");
        break;
      case "rad":
        break;
      case "deg":
        break;
      case "inverse":
        break;
      case "equals":
        if (panelInputElement.value) {
          panelResultElement.classList.add("result-highlight");
          panelInputElement.classList.add("result-highlight");

          ans = resolveCalc(panelInputElement.value);
        }
        break;
      default:
        if (panelInputElement.value === "0" && !buttonElement.classList.contains("func")) {
          panelInputElement.value = keyboard.outputKey(buttonElement);
        } else panelInputElement.value += keyboard.outputKey(buttonElement);
        break;
    }

    const result = resolveCalc(panelInputElement.value);

    if (result) panelResultElement.innerText = `= ${result}`;
  });
});

const evalStringExp = (exp: string): Number | null => {
  try {
    return Number(eval(exp));
  } catch (error) {
    return null;
  }
};
