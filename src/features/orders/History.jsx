import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/format.js';
import { ORDER_STATUSES, STATUS_SHIPPED } from '../../helpers/constants.js';
import { ADMIN_WHATSAPP_URL } from '../../config.js';
import { fetchMyOrders, markOrderReceived } from '../../services/orderService.js';
import { Pic } from '../../components/ui.jsx';
import { addItem } from '../cart/cartSlice.js';

const ALL_STATUSES = 'Semua';

function OrderCard({ order, onReceived, onReorder }) {
  const itemSummary = order.items.map((item) => `${item.name} ×${item.quantity}`).join(', ');
  const adminChatLink = `${ADMIN_WHATSAPP_URL}?text=Halo%20admin%2C%20saya%20mau%20tanya%20pesanan%20${order.code}`;

  return (
    <div className="box order">
      <div className="between"><b>{order.code}</b><span className="pill">{order.status}</span></div>
      <div className="row">
        {order.items.map((item) => <div className="mini" key={item.id}><Pic hex={item.color_hex} seed={item.product_id} src={`/foto/${item.product_id}-1.jpg`} /></div>)}
        <span className="muted small">{itemSummary}</span>
      </div>
      <p className="between"><span className="muted small">{order.created_at}</span><b>{rupiah(order.total)}</b></p>
      <div className="row">
        <Link className="btn ghost sm" to={`/lacak/${order.code}`}>Lihat Detail</Link>
        {order.status === STATUS_SHIPPED && <button className="btn sm" onClick={() => onReceived(order)}>Received</button>}
        <button className="btn ghost sm" onClick={() => onReorder(order)}>Reordering</button>
        <a className="btn ghost sm" href={adminChatLink} target="_blank" rel="noreferrer">Chat Admin</a>
      </div>
    </div>
  );
}

export function History() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [activeStatus, setActiveStatus] = useState(ALL_STATUSES);

  const loadOrders = () => fetchMyOrders().then(setOrders).catch((err) => setError(err.message));

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  if (!user) {
    return (
      <section className="wrap">
        <h1 className="page-title">Riwayat Pesanan</h1>
        <p className="notice">Masuk dulu untuk melihat riwayat pesananmu. <Link to="/akun">Masuk atau daftar</Link></p>
      </section>
    );
  }

  const visibleOrders = orders?.filter((order) => activeStatus === ALL_STATUSES || order.status === activeStatus);

  const reorder = (order) => {
    order.items.forEach((item) => dispatch(addItem({
      product: { id: item.product_id, name: item.name, price: item.price },
      qty: item.quantity,
      color: { name: item.color, hex: item.color_hex },
    })));
    navigate('/keranjang');
  };

  const confirmReceived = async (order) => {
    await markOrderReceived(order.code);
    loadOrders();
  };

  return (
    <section className="wrap narrow">
      <h1 className="page-title">Riwayat Pesanan</h1>
      <div className="chips">
        {[ALL_STATUSES, ...ORDER_STATUSES].map((status) => (
          <button key={status} className={'chip' + (activeStatus === status ? ' on' : '')} onClick={() => setActiveStatus(status)}>{status}</button>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      {visibleOrders && !visibleOrders.length && <p className="notice">Belum ada pesanan. <Link to="/toko">Mulai belanja</Link></p>}
      {visibleOrders?.map((order) => <OrderCard key={order.id} order={order} onReceived={confirmReceived} onReorder={reorder} />)}
    </section>
  );
}
