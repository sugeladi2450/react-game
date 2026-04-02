import PropTypes from "prop-types";
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

const buttonShape = PropTypes.shape({
  label: PropTypes.node.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.string.isRequired,
});

ButtonPad.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.arrayOf(buttonShape).isRequired).isRequired,
};

export default ButtonPad;
