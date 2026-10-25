// Ilustrasi buket dibuat dengan SVG (tanpa foto) agar warna bisa mengikuti pilihan variasi.
const ACCENT_COLORS = ['#fbf6ee', '#f6cf5c', '#ffffff', '#f4b6c4'];
const LEAF_COUNT = 7;
const FLOWER_COUNT = 9;
const DOT_COUNT = 14;

export default function Bouquet({ color = '#f2a7bb', seed = 1 }) {
  // Generator acak sederhana berbasis seed supaya tiap produk punya susunan bunga yang tetap.
  let randomState = seed * 131 + 7;
  const nextRandom = () => (randomState = (randomState * 9301 + 49297) % 233280) / 233280;

  const leaves = Array.from({ length: LEAF_COUNT }, (_, index) => (
    <ellipse key={'leaf' + index} cx="100" cy="72" rx="9" ry="34" fill="#7fa385" opacity=".9" transform={`rotate(${-66 + index * 22} 100 138)`} />
  ));
  const flowers = Array.from({ length: FLOWER_COUNT }, (_, index) => {
    const x = 100 + (nextRandom() - 0.5) * 84;
    const y = 58 + nextRandom() * 52;
    const radius = 13 + nextRandom() * 8;
    const petalColor = index % 4 === 3 ? ACCENT_COLORS[(seed + index) % 4] : color;
    return (
      <g key={'flower' + index}>
        <circle cx={x} cy={y} r={radius} fill={petalColor} stroke="#0001" />
        <circle cx={x} cy={y} r={radius * 0.62} fill="#fff" opacity=".28" />
        <circle cx={x} cy={y} r={radius * 0.24} fill="#f6cf5c" />
      </g>
    );
  });
  const dots = Array.from({ length: DOT_COUNT }, (_, index) => (
    <circle key={'dot' + index} cx={100 + (nextRandom() - 0.5) * 100} cy={46 + nextRandom() * 70} r="2.6" fill="#fff" />
  ));

  return (
    <svg viewBox="0 0 200 240" role="img" aria-label="Ilustrasi buket bunga">
      {leaves}{dots}{flowers}
      <path d="M38 118 Q100 132 162 118 L112 222 Q100 230 88 222 Z" fill="#fffaf4" stroke="#ead9d6" />
      <path d="M100 134 L162 118 L112 222 Q100 228 100 224 Z" fill={color} opacity=".3" />
      <ellipse cx="86" cy="150" rx="17" ry="8" fill="#8a4a62" transform="rotate(-22 86 150)" />
      <ellipse cx="114" cy="150" rx="17" ry="8" fill="#8a4a62" transform="rotate(22 114 150)" />
      <circle cx="100" cy="151" r="6" fill="#6f3a4e" />
    </svg>
  );
}
