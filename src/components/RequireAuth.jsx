import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectUser } from "../features/auth/authSlice.js";

export function RequireAuth({ title, purpose, children }) {
  const user = useSelector(selectUser);
  if (user) return children;
  return (
    <section className="wrap">
      <h1 className="page-title">{title}</h1>
      <p className="notice">Masuk dulu untuk melihat {purpose}. <Link to="/akun">Masuk atau daftar</Link></p>
    </section>
  );
}

RequireAuth.propTypes = {
  title: PropTypes.string.isRequired,
  purpose: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
