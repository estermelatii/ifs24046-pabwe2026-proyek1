import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/api.js';
import { Pic } from '../../components/ui.jsx';
import { setQty, removeItem, selectSubtotal } from '../../features/cart/cartSlice.js';

const SHIP = 15000;
export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectSubtotal);
  if (!items.length) return <section className="wrap"><h1 className="page-title">Keranjang Belanja</h1><p className="notice">Keranjangmu masih kosong. <Link to="/toko">Pilih buket</Link></p></section>;
  return (
    <section className="wrap">
      <h1 className="page-title">Keranjang Belanja</h1><p className="muted">{items.length} item</p>
      <div className="cols">
        <table className="tbl">
          <thead><tr><th>Produk</th><th>Harga</th><th>Kuantitas</th><th>Subtotal</th><th /></tr></thead>
          <tbody>{items.map((i) => (
            <tr key={i.key}>
              <td><div className="prod"><div className="mini"><Pic hex={i.color.hex} seed={i.id} src={`/foto/${i.id}-1.jpg`} /></div><div><b>{i.name}</b><p className="muted small">Warna: {i.color.name}</p></div></div></td>
              <td>{rupiah(i.price)}</td>
              <td><div className="qty"><button aria-label="Kurangi" onClick={() => dispatch(setQty({ key: i.key, qty: i.qty - 1 }))}>−</button><span>{i.qty}</span><button aria-label="Tambah" onClick={() => dispatch(setQty({ key: i.key, qty: i.qty + 1 }))}>+</button></div></td>
              <td><b>{rupiah(i.price * i.qty)}</b></td>
              <td><button className="link" onClick={() => dispatch(removeItem(i.key))}>Hapus</button></td>
            </tr>))}</tbody>
        </table>
        <aside className="box">
          <h3>Ringkasan Belanja</h3>
          <p className="between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></p>
          <p className="between"><span>Ongkir (estimasi)</span><span>{rupiah(SHIP)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(subtotal + SHIP)}</b></p>
          <Link to="/checkout" className="btn full">Checkout</Link>
          <Link to="/toko" className="btn ghost full">Lanjut Belanja</Link>
        </aside>
      </div>
    </section>
  );
}
