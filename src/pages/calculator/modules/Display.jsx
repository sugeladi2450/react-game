import PropTypes from "prop-types";

function Display({ expression, value }) {
  return (
    <div className="bg-gray-100 p-4 rounded mb-4 h-24">
      <div className="text-right text-xl text-gray-600 min-h-[1.5rem] break-words">
        {expression}
      </div>
      <div className="text-right text-3xl">{value}</div>
    </div>
  );
}

Display.propTypes = {
  expression: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Display;
