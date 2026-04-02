import PropTypes from "prop-types";

function CalcButton({ onPress, className = "", children }) {
  return (
    <button type="button" onClick={onPress} className={`p-4 rounded ${className}`}>
      {children}
    </button>
  );
}

CalcButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CalcButton;
