import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, rupiah } from '../../helpers/api.js';
import { STEPS } from '../../helpers/constants.js';

export function Track() {
  const { code } = useParams();
  const nav = useNavigate();
  const [input, setInput] = useState(code || ''), [order, setOrder] = useState(null), [error, setError] = useState('');
  const load = () => api(`/api/orders/${code}`).then((o) => { setOrder(o); setError(''); }).catch((e) => { setOrder(null); setError(e.message); });
  useEffect(() => { code ? load() : setOrder(null); }, [code]);
  const at = order ? STEPS.indexOf(order.status) : -1;
  const demo = async () => { await api(`/api/orders/${code}/status`, { method: 'PATCH', body: { status: STEPS[Math.min(at + 1, 3)] } }); load(); };
  return (
    <section className="wrap narrow">
      <h1 className="page-title">Lacak Pesanan</h1>
      <form className="row" onSubmit={(e) => { e.preventDefault(); input && nav('/lacak/' + input.trim()); }}>
        <input className="search grow" placeholder="Contoh: FG2026100001" value={input} onChange={(e) => setInput(e.target.value)} /><button className="btn">Lacak</button>
      </form>
      {error && <p className="error">{error}</p>}
      {order && (
        <div className="box">
          <h3>{order.code}</h3>
          <ol className="tl">{STEPS.map((s, i) => <li key={s} className={i <= at ? 'done' : ''}><b>{s}</b>{i === at && <span className="muted small">{order.created_at}</span>}</li>)}</ol>
          <h4>Detail Pesanan</h4>
          {order.items.map((i) => <p className="between" key={i.id}><span>{i.name} ({i.color}) × {i.quantity}</span><span>{rupiah(i.price * i.quantity)}</span></p>)}
          <p className="between"><span>Ongkir ({order.courier})</span><span>{rupiah(order.shipping_cost)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(order.total)}</b></p>
          {at < 3 && <button className="link" onClick={demo}>Demo: majukan status ke tahap berikutnya</button>}
        </div>
      )}
    </section>
  );
}
