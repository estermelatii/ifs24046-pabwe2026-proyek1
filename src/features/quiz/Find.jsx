import { useState } from 'react';
import { api } from '../../helpers/api.js';
import useFetch from '../../hooks/useFetch.js';
import { Card } from '../../components/ui.jsx';

export function Find() {
  const [cats] = useFetch('/api/categories');
  const Q = [
    { k: 'moment', t: 'Untuk momen apa buket ini dibeli?', o: (cats || []).map((c) => ({ v: c.id, l: c.name })) },
    { k: 'style', t: 'Gaya buket seperti apa yang kamu suka?', o: ['Cute', 'Soft', 'Elegant', 'Cheerful'].map((x) => ({ v: x, l: x })) },
    { k: 'max', t: 'Berapa budgetmu?', o: [[150000, 'Maks. Rp150.000'], [200000, 'Maks. Rp200.000'], [300000, 'Maks. Rp300.000']].map(([v, l]) => ({ v, l })) },
  ];
  const [step, setStep] = useState(0), [ans, setAns] = useState({}), [res, setRes] = useState(null), [err, setErr] = useState('');
  const q = Q[step];
  const next = async () => {
    if (step < Q.length - 1) return setStep(step + 1);
    try { setRes((await api('/api/recommend?' + new URLSearchParams(ans))).items); } catch (e) { setErr(e.message); }
  };
  if (res) return (
    <section className="wrap">
      <h1 className="page-title">Rekomendasi untukmu</h1><p className="muted">Buket yang paling cocok dengan jawabanmu.</p>
      <div className="grid">{res.map((p) => <Card key={p.id} p={p} />)}</div>
      <button className="btn ghost" onClick={() => { setRes(null); setStep(0); setAns({}); }}>Ulangi kuis</button>
    </section>
  );
  return (
    <section className="wrap narrow">
      <h1 className="page-title">Find Your Bloom</h1>
      <p className="muted">Jawab beberapa pertanyaan singkat untuk mendapatkan rekomendasi buket yang paling cocok.</p>
      <div className="box quiz">
        <div className="progress"><i style={{ width: `${((step + 1) / Q.length) * 100}%` }} /></div>
        <p className="muted small">Pertanyaan {step + 1} dari {Q.length}</p>
        <h3>{q.t}</h3>
        <div className="opts">{q.o.map((o) => <button key={o.v} className={String(ans[q.k]) === String(o.v) ? 'on' : ''} onClick={() => setAns({ ...ans, [q.k]: o.v })}>{o.l}</button>)}</div>
        {err && <p className="error">{err}</p>}
        <div className="between">
          <button className="link" disabled={!step} onClick={() => setStep(step - 1)}>Kembali</button>
          <button className="btn" disabled={ans[q.k] === undefined} onClick={next}>{step < Q.length - 1 ? 'Selanjutnya →' : 'Lihat rekomendasi'}</button>
        </div>
      </div>
    </section>
  );
}
