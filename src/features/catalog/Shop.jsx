import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch.js';
import { Status, Card } from '../../components/ui.jsx';

const RANGES = [['Di bawah Rp150.000', 0, 149999], ['Rp150.000 – Rp200.000', 150000, 200000], ['Rp200.000 – Rp250.000', 200001, 250000], ['Di atas Rp250.000', 250001, 999999]];
const COLORS = { Pink: '#f2a7bb', Yellow: '#f6cf5c', Purple: '#b9a0d8', Orange: '#f08a3c', Blue: '#9db9e0', White: '#fbf6ee', Red: '#d85a6a' };

export function Shop() {
  const [sp, setSp] = useSearchParams();
  const g = (k) => sp.get(k) || '';
  const upd = (k, v) => { const n = new URLSearchParams(sp); g(k) === String(v) ? n.delete(k) : n.set(k, v); n.delete('page'); setSp(n); };
  const range = (min, max) => { const n = new URLSearchParams(sp); n.delete('page'); if (g('min') === String(min)) { n.delete('min'); n.delete('max'); } else { n.set('min', min); n.set('max', max); } setSp(n); };
  const go = (page) => { const n = new URLSearchParams(sp); n.set('page', page); setSp(n); window.scrollTo(0, 0); };
  const [cats] = useFetch('/api/categories');
  const [d, err] = useFetch('/api/products?' + sp.toString());
  const Chk = ({ on, onClick, children }) => <label className="chk"><input type="checkbox" checked={on} onChange={onClick} />{children}</label>;
  return (
    <section className="wrap">
      <h1 className="page-title">Shop Our Bouquets</h1>
      <p className="muted">Temukan buket mini yang sesuai dengan momenmu.{g('q') && ` Hasil untuk “${g('q')}”.`}</p>
      <div className="shop">
        <aside className="filters">
          <h4 aria-level="2">Harga</h4>{RANGES.map(([l, a, b]) => <Chk key={l} on={g('min') === String(a)} onClick={() => range(a, b)}>{l}</Chk>)}
          <h4 aria-level="2">Warna</h4><div className="swatches">{Object.entries(COLORS).map(([n, h]) => <button key={n} title={n} aria-label={n} aria-pressed={g('color') === n} className={g('color') === n ? 'on' : ''} style={{ background: h }} onClick={() => upd('color', n)} />)}</div>
          <h4 aria-level="2">Gaya</h4>{['Cute', 'Soft', 'Elegant', 'Cheerful'].map((s) => <Chk key={s} on={g('style') === s} onClick={() => upd('style', s)}>{s}</Chk>)}
          <h4 aria-level="2">Momen</h4>{cats?.map((c) => <Chk key={c.id} on={g('moment') === String(c.id)} onClick={() => upd('moment', c.id)}>{c.name}</Chk>)}
          {sp.toString() && <button className="link" onClick={() => setSp({})}>Hapus semua filter</button>}
        </aside>
        <div>
          <div className="between toolbar">
            <span className="muted">{d ? `${d.total} buket` : ''}</span>
            <label>Urutkan: <select value={g('sort') || 'popular'} onChange={(e) => { const n = new URLSearchParams(sp); n.set('sort', e.target.value); n.delete('page'); setSp(n); }}>
              <option value="popular">Terpopuler</option><option value="newest">Terbaru</option><option value="price_asc">Harga terendah</option><option value="price_desc">Harga tertinggi</option>
            </select></label>
          </div>
          <Status data={d} error={err}>
            {d?.items.length ? <div className="grid three">{d.items.map((p) => <Card key={p.id} p={p} />)}</div> : <p className="notice">Tidak ada buket yang cocok. Coba ubah atau hapus filter.</p>}
            {d?.pages > 1 && <div className="pager">{[...Array(d.pages)].map((_, i) => <button key={i} className={d.page === i + 1 ? 'on' : ''} onClick={() => go(i + 1)}>{i + 1}</button>)}</div>}
          </Status>
        </div>
      </div>
    </section>
  );
}
