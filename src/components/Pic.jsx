import { useState } from "react";
import PropTypes from "prop-types";
import Bouquet from "./Bouquet.jsx";

// Foto produk; bila foto gagal dimuat, diganti ilustrasi SVG.
export function Pic({ hex, seed, big, src }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = src && !photoFailed;
  const className = "pic" + (big ? " big" : "") + (showPhoto ? " photo" : "");
  return (
    <div className={className} style={{ background: `radial-gradient(circle at 50% 35%, ${hex}55, #3a0509 78%)` }}>
      {showPhoto ? <img src={src} alt="Foto produk" loading="lazy" onError={() => setPhotoFailed(true)} /> : <Bouquet color={hex} seed={seed} />}
    </div>
  );
}

Pic.propTypes = {
  hex: PropTypes.string.isRequired,
  seed: PropTypes.number,
  big: PropTypes.bool,
  src: PropTypes.string,
};
