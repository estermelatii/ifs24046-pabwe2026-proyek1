import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { rupiah } from '../../helpers/format.js';
import { COURIERS, PAYMENT_METHODS } from '../../helpers/constants.js';
import { createOrder } from '../../services/orderService.js';
import { clearCart, selectCartItems, selectSubtotal } from '../cart/cartSlice.js';
import { selectUser } from '../auth/authSlice.js';

const STEP_LABELS = ['Informasi', 'Pengiriman', 'Pembayaran'];
const LAST_STEP = STEP_LABELS.length;

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const submitLabel = (step, isSubmitting) => {
  if (step === 1) return 'Lanjut ke Pengiriman';
  if (step === 2) return 'Lanjut ke Pembayaran';
  return isSubmitting ? 'Memproses…' : 'Bayar & Buat Pesanan';
};

const buildOrderPayload = (form, cartItems) => ({
  ...form,
  items: cartItems.map((item) => ({ product_id: item.id, quantity: item.qty, color: item.color.name })),
});

function CustomerStep({ form, onInput }) {
  return (
    <>
      <h3>Informasi Pelanggan</h3>
      <label>Nama lengkap<input required value={form.customer_name} onChange={onInput('customer_name')} /></label>
      <label>Nomor telepon<input required inputMode="tel" value={form.phone} onChange={onInput('phone')} /></label>
      <label>Email<input required type="email" value={form.email} onChange={onInput('email')} /></label>
    </>
  );
}

function ShippingStep({ form, onInput, onSelect }) {
  return (
    <>
      <h3>Pengiriman</h3>
      <label>Alamat lengkap<textarea required rows="3" value={form.address} onChange={onInput('address')} /></label>
      <label>Kota<input required value={form.city} onChange={onInput('city')} /></label>
      <fieldset>
        <legend>Pilihan kurir</legend>
        {COURIERS.map((courier) => (
          <label key={courier.id} className="chk">
            <input type="radio" name="courier" checked={form.courier === courier.id} onChange={() => onSelect('courier', courier.id)} />
            {courier.name} · {rupiah(courier.cost)} · {courier.eta}
          </label>
        ))}
      </fieldset>
      <label>Tanggal pengiriman<input required type="date" min={todayIsoDate()} value={form.delivery_date} onChange={onInput('delivery_date')} /></label>
      <label>Pesan kartu ucapan (opsional)<textarea rows="2" value={form.card_message} onChange={onInput('card_message')} /></label>
    </>
  );
}

function PaymentStep({ form, onSelect }) {
  return (
    <>
      <h3>Pembayaran</h3>
      <fieldset>
        <legend>Metode pembayaran</legend>
        {PAYMENT_METHODS.map((method) => (
          <label key={method} className="chk">
            <input type="radio" name="payment" checked={form.payment_method === method} onChange={() => onSelect('payment_method', method)} />
            {method}
          </label>
        ))}
      </fieldset>
      <p className="muted small">Pembayaran bersifat simulasi untuk keperluan tugas. Tidak ada transaksi uang sungguhan.</p>
      <p className="muted">Dikirim ke: {form.address}, {form.city} pada {form.delivery_date}</p>
    </>
  );
}

export function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const user = useSelector(selectUser);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    city: '',
    courier: COURIERS[0].id,
    delivery_date: '',
    card_message: '',
    payment_method: PAYMENT_METHODS[0],
  });

  const setField = (field, value) => setForm({ ...form, [field]: value });
  const handleInput = (field) => (event) => setField(field, event.target.value);

  if (!cartItems.length) {
    return (
      <section className="wrap">
        <h1 className="page-title">Checkout</h1>
        <p className="notice">Keranjang kosong. <Link to="/toko">Pilih buket</Link></p>
      </section>
    );
  }

  const shippingCost = COURIERS.find((courier) => courier.id === form.courier).cost;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step < LAST_STEP) return setStep(step + 1);
    setIsSubmitting(true);
    setError('');
    try {
      const order = await createOrder(buildOrderPayload(form, cartItems));
      dispatch(clearCart());
      navigate('/sukses/' + order.code);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="wrap">
      <h1 className="page-title">Checkout</h1>
      <ol className="ck">{STEP_LABELS.map((label, index) => <li key={label} className={step > index ? 'done' : ''}><i>{index + 1}</i>{label}</li>)}</ol>
      <form className="cols" onSubmit={handleSubmit}>
        <div className="form">
          {step === 1 && <CustomerStep form={form} onInput={handleInput} />}
          {step === 2 && <ShippingStep form={form} onInput={handleInput} onSelect={setField} />}
          {step === 3 && <PaymentStep form={form} onSelect={setField} />}
        </div>
        <aside className="box">
          <h3>Pesananmu</h3>
          {cartItems.map((item) => <p className="between" key={item.key}><span>{item.name} ({item.color.name}) × {item.qty}</span><span>{rupiah(item.price * item.qty)}</span></p>)}
          <p className="between"><span>Subtotal</span><span>{rupiah(subtotal)}</span></p>
          <p className="between"><span>Ongkir</span><span>{rupiah(shippingCost)}</span></p>
          <p className="between total"><span>Total</span><b>{rupiah(subtotal + shippingCost)}</b></p>
          {error && <p className="error">{error}</p>}
          <button className="btn full" disabled={isSubmitting}>{submitLabel(step, isSubmitting)}</button>
          {step > 1 && <button type="button" className="link" onClick={() => setStep(step - 1)}>Kembali</button>}
        </aside>
      </form>
    </section>
  );
}
