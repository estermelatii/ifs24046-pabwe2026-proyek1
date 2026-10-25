export function QuantityStepper({ value, onDecrease, onIncrease }) {
  return (
    <div className="qty">
      <button aria-label="Kurangi" onClick={onDecrease}>−</button>
      <span>{value}</span>
      <button aria-label="Tambah" onClick={onIncrease}>+</button>
    </div>
  );
}
