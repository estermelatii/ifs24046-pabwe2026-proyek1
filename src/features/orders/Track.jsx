import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rupiah } from '../../helpers/format.js';
import { ORDER_STATUSES, LAST_ORDER_STEP } from '../../helpers/constants.js';
import { LIMITS } from '../../helpers/validation.js';
import { fetchOrder, updateOrderStatus } from '../../services/orderService.js';

export function Track() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [codeInput, setCodeInput] = useState(code || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const loadOrder = () => fetchOrder(code)
    .then((loaded) => { setOrder(loaded); setError(''); })
    .catch((err) => { setOrder(null); setError(err.message); });

  useEffect(() => {
    if (code) loadOrder();
    else setOrder(null);
  }, [code]);

  const currentStep = order ? ORDER_STATUSES.indexOf(order.status) : -1;

  const advanceStatus = async () => {
    await updateOrderStatus(code, ORDER_STATUSES[Math.min(currentStep + 1, LAST_ORDER_STEP)]);
    loadOrder();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (codeInput) navigate('/lacak/' + codeInput.trim());
  };

  return (
    <section className="wrap narrow">
      <h1 className="page-title">Lacak Pesanan</h1>
      <form className="row" onSubmit={handleSearch}>
        <input className="search grow" placeholder="Contoh: FG2026100001" maxLength={LIMITS.orderCode.max} value={codeInput} onChange={(event) => setCodeInput(event.target.value)} /><button className="btn">Lacak</button>
      </form>
      {error && <p className="error">{error}</p>}
      {order && (
        <div className="box">
          <h3>{order.code}</h3>
          <ol className="tl">
            {ORDER_STATUSES.map((status, index) => (
              <li key={status} className={index <= currentStep ? 'done' : ''}><b>{status}</b>{index === currentStep && <span className="muted small">{order.created_at}</span>}</li>
            ))}
          </ol>
          <h4>Detail Pesanan</h4>
          {order.items.map((item) => <p className="between" key={item.id}><span>{item.name} ({item.color}) × {item.quantity}</span><span>{rupiah(item.price * item.quantity)}</span></p>)}
          <p className="between"><span>Ongkir ({order.courier})</span><span>{rupiah(order.shipping_cost)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(order.total)}</b></p>
          {currentStep < LAST_ORDER_STEP && <button className="link" onClick={advanceStatus}>Demo: majukan status ke tahap berikutnya</button>}
        </div>
      )}
    </section>
  );
}
