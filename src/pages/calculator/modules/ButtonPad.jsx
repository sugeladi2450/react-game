import PropTypes from "prop-types";
import CalcButton from "./CalcButton";

function ButtonPad({ rows }) {
  return (
    <div className="space-y-3">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-3"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}
        >
          {row.map((button, colIndex) => (
            <CalcButton key={`${rowIndex}-${colIndex}`} onPress={button.onPress} className={button.style}>
              {button.label}
            </CalcButton>
          ))}
        </div>
      ))}
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
