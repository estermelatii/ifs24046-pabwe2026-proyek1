import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { rupiah, getFirstName, capitalize } from "../../helpers/format.js";
import { STATUS_COMPLETED } from "../../helpers/constants.js";
import useFetch from "../../hooks/useFetch.js";
import { fetchPopularProducts } from "../../services/productService.js";
import { fetchMyOrders } from "../../services/orderService.js";
import { Status } from "../../components/Status.jsx";
import { ProductCard } from "../../components/ProductCard.jsx";
import { logout } from "../auth/authSlice.js";

const describeItems = (order) => order.items.map((item) => `${item.name} ×${item.quantity}`).join(", ");

function WelcomeOverlay({ mode, name, onDismiss }) {
  const isRegister = mode === "register";
  return (
    <div
      className="welcome"
      role="dialog"
      aria-modal="true"
      aria-label={isRegister ? "Akun berhasil dibuat" : "Berhasil masuk"}
      tabIndex={0}
      onClick={onDismiss}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Escape") onDismiss();
      }}
    >
      <div>
        <span className="eyebrow">{isRegister ? "Akun berhasil dibuat" : "Berhasil masuk"}</span>
        <h1>{isRegister ? "Selamat datang," : "Selamat datang kembali,"}<br /><em>{name}</em></h1>
        <i className="wline" />
        <p>{isRegister ? "Akunmu sudah siap. Temukan buket pertamamu dan rayakan momen spesialmu." : "Senang melihatmu lagi. Buket cantik berikutnya sudah menunggu."}</p>
        <Link to="/toko" className="btn lg">Mulai Jelajahi</Link>
      </div>
    </div>
  );
}

WelcomeOverlay.propTypes = {
  mode: PropTypes.string,
  name: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export function AccountDashboard({ user, welcomeMode, onDismissWelcome }) {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState(null);
  const [popularProducts] = useFetch(fetchPopularProducts);

  useEffect(() => {
    fetchMyOrders().then(setOrders).catch(() => setOrders([]));
  }, []);

  const name = capitalize(getFirstName(user.name));
  const activeOrderCount = orders?.filter((order) => order.status !== STATUS_COMPLETED).length ?? 0;
  const totalSpent = orders?.reduce((sum, order) => sum + order.total, 0) ?? 0;
  const latestOrder = orders?.[0];

  return (
    <>
      {welcomeMode && <WelcomeOverlay mode={welcomeMode} name={name} onDismiss={onDismissWelcome} />}
      <section className="dash-hero">
        <div className="wrap dash-in">
          <span className="avatar big">{name.charAt(0)}</span>
          <div>
            <span className="eyebrow">Akun Saya</span>
            <h1>Halo, <em>{name}</em></h1>
            <p className="muted">{user.email}</p>
            <div className="row">
              <Link to="/toko" className="btn">Lanjut Belanja</Link>
              <Link to="/riwayat" className="btn ghost">Riwayat Pesanan</Link>
              <button className="btn ghost" onClick={() => dispatch(logout())}>Keluar</button>
            </div>
          </div>
        </div>
      </section>
      <section className="wrap">
        <div className="stats">
          <div><b>{orders ? orders.length : "–"}</b><span>Total pesanan</span></div>
          <div><b>{orders ? activeOrderCount : "–"}</b><span>Pesanan berjalan</span></div>
          <div><b>{orders ? rupiah(totalSpent) : "–"}</b><span>Total belanja</span></div>
        </div>
        <h2>Pesanan Terakhir</h2>
        {latestOrder ? (
          <div className="box order">
            <div className="between"><b>{latestOrder.code}</b><span className="pill">{latestOrder.status}</span></div>
            <p className="muted small">{describeItems(latestOrder)}</p>
            <p className="between"><span className="muted small">{latestOrder.created_at}</span><b>{rupiah(latestOrder.total)}</b></p>
            <Link className="btn ghost sm" to={`/lacak/${latestOrder.code}`}>Lacak Pesanan</Link>
          </div>
        ) : <p className="notice">{orders ? "Kamu belum punya pesanan. Yuk pilih buket pertamamu." : "Memuat…"}</p>}
        <div className="between" style={{ marginTop: 40 }}><h2>Pilihan Untukmu</h2><Link to="/toko">Lihat semua →</Link></div>
        <Status data={popularProducts} error="">
          {popularProducts && <div className="grid">{popularProducts.items.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        </Status>
      </section>
    </>
  );
}

AccountDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  welcomeMode: PropTypes.string,
  onDismissWelcome: PropTypes.func,
};

