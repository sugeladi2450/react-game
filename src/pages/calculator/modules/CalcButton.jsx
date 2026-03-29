import React from "react";

function CalcButton({ onPress, className = "", children }) {
  return (
    <button onClick={onPress} className={`p-4 rounded ${className}`}>
      {children}
    </button>
  );
}

export default CalcButton;
