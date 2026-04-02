import PropTypes from "prop-types";

function CalcButton({ onPress, className = "", children }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={`h-14 w-full rounded-xl text-xl font-semibold shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
    >
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
