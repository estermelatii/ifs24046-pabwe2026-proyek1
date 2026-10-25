import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/format.js';
import { ESTIMATED_SHIPPING_COST } from '../../helpers/constants.js';
import { Pic } from '../../components/ui.jsx';
import { QuantityStepper } from '../../components/QuantityStepper.jsx';
import { setQty, removeItem, selectSubtotal } from './cartSlice.js';

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectSubtotal);

  if (!items.length) {
    return (
      <section className="wrap">
        <h1 className="page-title">Keranjang Belanja</h1>
        <p className="notice">Keranjangmu masih kosong. <Link to="/toko">Pilih buket</Link></p>
      </section>
    );
  }

  return (
    <section className="wrap">
      <h1 className="page-title">Keranjang Belanja</h1><p className="muted">{items.length} item</p>
      <div className="cols">
        <table className="tbl">
          <thead><tr><th>Produk</th><th>Harga</th><th>Kuantitas</th><th>Subtotal</th><th /></tr></thead>
          <tbody>{items.map((item) => (
            <tr key={item.key}>
              <td><div className="prod"><div className="mini"><Pic hex={item.color.hex} seed={item.id} src={`/foto/${item.id}-1.jpg`} /></div><div><b>{item.name}</b><p className="muted small">Warna: {item.color.name}</p></div></div></td>
              <td>{rupiah(item.price)}</td>
              <td>
                <QuantityStepper
                  value={item.qty}
                  onDecrease={() => dispatch(setQty({ key: item.key, qty: item.qty - 1 }))}
                  onIncrease={() => dispatch(setQty({ key: item.key, qty: item.qty + 1 }))}
                />
              </td>
              <td><b>{rupiah(item.price * item.qty)}</b></td>
              <td><button className="link" onClick={() => dispatch(removeItem(item.key))}>Hapus</button></td>
            </tr>))}</tbody>
        </table>
        <aside className="box">
          <h3>Ringkasan Belanja</h3>
          <p className="between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></p>
          <p className="between"><span>Ongkir (estimasi)</span><span>{rupiah(ESTIMATED_SHIPPING_COST)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(subtotal + ESTIMATED_SHIPPING_COST)}</b></p>
          <Link to="/checkout" className="btn full">Checkout</Link>
          <Link to="/toko" className="btn ghost full">Lanjut Belanja</Link>
        </aside>
      </div>
    </section>
  );
}
