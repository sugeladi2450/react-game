import React, { useMemo, useState } from "react";
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

function Calculator() {
  // 表达式输入（第二行，支持括号）
  const [input, setInput] = useState("");

  // 可选：保留上一次求值结果（第一行展示）
  const [result, setResult] = useState(null);

  // 保留：展示用（括号表达式求值不依赖该 operator）
  const [operator, setOperator] = useState(null);

  // 清空计算器所有状态
  const clear = () => {
    setInput("");
    setResult(null);
    setOperator(null);
  };

  // 处理数字按钮点击事件：将点击的数字添加到输入框
  const handleNumberClick = (number) => {
    setInput((prev) => prev + number.toString());
  };

  // 处理运算符按钮点击事件（AST 模式：直接把运算符拼接到表达式中）
  const handleOperatorClick = (newOperator) => {
    if (input === "") {
      // 允许一元 +/-, 其他运算符忽略
      if (newOperator === "+" || newOperator === "-") {
        setInput(newOperator);
        setOperator(newOperator);
      }
      return;
    }

    // 防止连续输入二元运算符（允许把最后一个运算符替换为新运算符）
    setInput((prev) => {
      const last = prev.slice(-1);
      const isOp = last === "+" || last === "-" || last === "*" || last === "/";
      if (isOp) return prev.slice(0, -1) + newOperator;
      return prev + newOperator;
    });
    setOperator(newOperator);
  };

  // 处理等号按钮点击事件：对整个表达式求值
  const handleEqualClick = () => {
    if (input.trim() === "") return;

    try {
      const value = evaluateExpression(input);
      setResult(value);
      setOperator(null);
      setInput(value.toString());
    } catch (e) {
      // 解析/求值错误：清空（也可扩展为显示 error 状态）
      clear();
    }
  };

  // 处理正负号切换：在表达式末尾注入/取消一元负号（简化实现）
  // 说明：完整的“对当前数字取反”需要 token 级操作；此处保持最小可用。
  const handlePlusMinusClick = () => {
    setInput((prev) => {
      if (prev === "") return "-";
      // 若仅有一个前缀 '-'，再按则取消
      if (prev === "-") return "";
      // 其他情况：尝试在表达式头部切换符号
      return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
    });
  };

  // 处理百分比按钮：将整个表达式当前值 /100（基于 AST 求值）
  const handlePercentClick = () => {
    if (input.trim() === "") return;
    try {
      const value = evaluateExpression(input);
      setInput((value / 100).toString());
      setResult(value / 100);
      setOperator(null);
    } catch (e) {
      clear();
    }
  };

  // 处理小数点按钮：在“当前数字片段”内确保只能输入一次
  const handleDotClick = () => {
    setInput((prev) => {
      if (prev === "") return "0.";

      const lastOp = Math.max(
        prev.lastIndexOf("+"),
        prev.lastIndexOf("-"),
        prev.lastIndexOf("*"),
        prev.lastIndexOf("/"),
        prev.lastIndexOf("(")
      );
      const segment = prev.slice(lastOp + 1);
      if (segment.includes(".")) return prev;
      if (segment === "") return prev + "0.";
      return prev + ".";
    });
  };

  // 处理退格按钮：删除输入框最后一个字符
  const handleBackspaceClick = () => {
    setInput((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
  };

  const buttonRows = useMemo(
    () => [
      [
        { label: "C", kind: "clear", style: BUTTON_STYLES.clear, onPress: clear },
        { label: "(", kind: "function", style: BUTTON_STYLES.function, onPress: () => setInput((p) => p + "(") },
        { label: ")", kind: "function", style: BUTTON_STYLES.function, onPress: () => setInput((p) => p + ")") },
        { label: "÷", kind: "operator", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("/") },
      ],
      [
        { label: "7", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(7) },
        { label: "8", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(8) },
        { label: "9", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(9) },
        { label: "×", kind: "operator", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("*") },
      ],
      [
        { label: "4", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(4) },
        { label: "5", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(5) },
        { label: "6", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(6) },
        { label: "-", kind: "operator", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("-") },
      ],
      [
        { label: "1", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(1) },
        { label: "2", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(2) },
        { label: "3", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(3) },
        { label: "+", kind: "operator", style: BUTTON_STYLES.operator, onPress: () => handleOperatorClick("+") },
      ],
      [
        { label: "0", kind: "number", style: BUTTON_STYLES.number, onPress: () => handleNumberClick(0) },
        { label: ".", kind: "number", style: BUTTON_STYLES.number, onPress: handleDotClick },
        { label: "←", kind: "function", style: BUTTON_STYLES.function, onPress: handleBackspaceClick },
        { label: "=", kind: "equals", style: BUTTON_STYLES.equals, onPress: handleEqualClick },
      ],
    ],
    [input, operator, result]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-emerald-800 mb-4">计算器</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <Display result={result} operator={operator} input={input} />
        <ButtonPad rows={buttonRows} />
      </div>
    </div>
  );
}

export default Calculator;
