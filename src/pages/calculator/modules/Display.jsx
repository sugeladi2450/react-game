import React from "react";

function Display({ result, operator, input }) {
  return (
    <div className="bg-gray-100 p-4 rounded mb-4 h-24">
      <div className="text-right text-xl text-gray-600 min-h-[1.5rem]">
        {result} {operator}
      </div>
      <div className="text-right text-3xl">{input}</div>
    </div>
  );
}

export default Display;
