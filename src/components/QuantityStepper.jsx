import PropTypes from "prop-types";

// Tombol tambah/kurang jumlah. Tombol dinonaktifkan di batas min/max (mis. stok habis).
export function QuantityStepper({ value, min, max, onChange }) {
  return (
    <div className="qty">
      <button aria-label="Kurangi" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span>{value}</span>
      <button aria-label="Tambah" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}

QuantityStepper.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
