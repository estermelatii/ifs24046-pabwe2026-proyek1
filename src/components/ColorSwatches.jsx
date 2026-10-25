export function ColorSwatches({ colors, selectedName, onSelect }) {
  return (
    <div className="swatches">
      {colors.map((color, index) => (
        <button
          key={color.name}
          title={color.name}
          aria-label={color.name}
          aria-pressed={selectedName === color.name}
          className={selectedName === color.name ? 'on' : ''}
          style={{ background: color.hex }}
          onClick={() => onSelect(color, index)}
        />
      ))}
    </div>
  );
}
