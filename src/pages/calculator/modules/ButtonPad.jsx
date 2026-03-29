import React from "react";
import CalcButton from "./CalcButton";

function ButtonPad({ rows }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {rows.map((row, rowIndex) =>
        row.map((button, colIndex) => (
          <CalcButton key={`${rowIndex}-${colIndex}`} onPress={button.onPress} className={button.style}>
            {button.label}
          </CalcButton>
        ))
      )}
    </div>
  );
}

export default ButtonPad;
