import { useState } from "react";
import Display from "./Display";
import ButtonPad from "./ButtonPad";
import { evaluateExpression } from "./ast";

const BUTTON_STYLES = {
  number: "bg-gray-200 hover:bg-gray-300",
  operator: "bg-blue-500 text-white hover:bg-blue-600",
  function: "bg-gray-300 hover:bg-gray-400",
  clear: "bg-red-500 text-white hover:bg-red-600",
  equals: "bg-green-500 text-white hover:bg-green-600",
};

const OPERATORS = new Set(["+", "-", "*", "/"]);

function isOperator(char) {
  return OPERATORS.has(char);
}

function countChar(text, target) {
  return [...text].filter((char) => char === target).length;
}

function getResultText(value) {
  return value == null ? "" : value.toString();
}

function Calculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const clear = () => {
    setInput("");
    setResult(null);
    setJustEvaluated(false);
  };

  const applyEdit = (nextInput) => {
    setInput(nextInput);
    setResult(null);
    setJustEvaluated(false);
  };

  const getFreshBase = () => (justEvaluated ? "" : input);
  const getContinuationBase = () => (justEvaluated ? getResultText(result) : input);

  const handleNumberClick = (number) => {
    const base = getFreshBase();
    const prefix = base.endsWith(")") ? "*" : "";
    applyEdit(`${base}${prefix}${number}`);
  };

  const handleOperatorClick = (nextOperator) => {
    const base = getContinuationBase();

    if (base === "") {
      if (nextOperator === "+" || nextOperator === "-") {
        applyEdit(nextOperator);
      }
      return;
    }

    const lastChar = base.slice(-1);

    if (lastChar === "(") {
      if (nextOperator === "+" || nextOperator === "-") {
        applyEdit(`${base}${nextOperator}`);
      }
      return;
    }

    if (isOperator(lastChar)) {
      applyEdit(`${base.slice(0, -1)}${nextOperator}`);
      return;
    }

    applyEdit(`${base}${nextOperator}`);
  };

  const handleEqualClick = () => {
    if (input.trim() === "") {
      return;
    }

    try {
      const value = evaluateExpression(input);
      setResult(value);
      setJustEvaluated(true);
    } catch {
      clear();
    }
  };

  const handleDotClick = () => {
    const base = getFreshBase();

    if (base === "") {
      applyEdit("0.");
      return;
    }

    if (base.endsWith(")")) {
      applyEdit(`${base}*0.`);
      return;
    }

    const lastBoundary = Math.max(
      base.lastIndexOf("+"),
      base.lastIndexOf("-"),
      base.lastIndexOf("*"),
      base.lastIndexOf("/"),
      base.lastIndexOf("(")
    );
    const segment = base.slice(lastBoundary + 1);

    if (segment.includes(".")) {
      return;
    }

    if (segment === "") {
      applyEdit(`${base}0.`);
      return;
    }

    applyEdit(`${base}.`);
  };

  const handleBackspaceClick = () => {
    const base = getContinuationBase();

    if (base === "") {
      return;
    }

    applyEdit(base.slice(0, -1));
  };

  const handleOpenParenClick = () => {
    const base = getContinuationBase();

    if (base === "") {
      applyEdit("(");
      return;
    }

    const lastChar = base.slice(-1);

    if (lastChar === ".") {
      return;
    }

    if (lastChar === "(" || isOperator(lastChar)) {
      applyEdit(`${base}(`);
      return;
    }

    applyEdit(`${base}*(`);
  };

  const handleCloseParenClick = () => {
    const base = getContinuationBase();

    if (base === "") {
      return;
    }

    if (countChar(base, "(") <= countChar(base, ")")) {
      return;
    }

    const lastChar = base.slice(-1);

    if (lastChar === "(" || isOperator(lastChar) || lastChar === ".") {
      return;
    }

    applyEdit(`${base})`);
  };

  const buttonRows = [
    [
      { label: "C", style: BUTTON_STYLES.clear, onPress: clear },
      { label: "(", style: BUTTON_STYLES.function, onPress: handleOpenParenClick },
      { label: ")", style: BUTTON_STYLES.function, onPress: handleCloseParenClick },
      { label: "/", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("/") },
    ],
    [
      { label: "7", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(7) },
      { label: "8", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(8) },
      { label: "9", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(9) },
      { label: "*", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("*") },
    ],
    [
      { label: "4", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(4) },
      { label: "5", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(5) },
      { label: "6", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(6) },
      { label: "-", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("-") },
    ],
    [
      { label: "1", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(1) },
      { label: "2", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(2) },
      { label: "3", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(3) },
      { label: "+", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("+") },
    ],
    [
      { label: "0", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(0) },
      { label: ".", style: BUTTON_STYLES.number, onPress: handleDotClick },
      { label: "<-", style: BUTTON_STYLES.function, onPress: handleBackspaceClick },
      { label: "=", style: BUTTON_STYLES.equals, onPress: handleEqualClick },
    ],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-emerald-800 mb-4">计算器</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <Display expression={input} value={justEvaluated ? getResultText(result) : ""} />
        <ButtonPad rows={buttonRows} />
      </div>
    </div>
  );
}

export default Calculator;
