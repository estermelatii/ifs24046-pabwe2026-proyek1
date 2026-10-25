import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { selectCount } from './features/cart/cartSlice.js';
import { fetchMe } from './features/auth/authSlice.js';
import { Ic } from './components/Bouquet.jsx';
import { Home } from './features/home/Home.jsx';
import { Shop } from './features/catalog/Shop.jsx';
import { Product } from './features/catalog/Product.jsx';
import { Find } from './features/quiz/Find.jsx';
import { Cart } from './features/cart/Cart.jsx';
import { Checkout } from './features/checkout/Checkout.jsx';
import { Success } from './features/orders/Success.jsx';
import { Track } from './features/orders/Track.jsx';
import { History } from './features/orders/History.jsx';
import { Account } from './features/account/Account.jsx';
import { About } from './features/static/About.jsx';
import { Contact } from './features/static/Contact.jsx';

export default function App() {
  const dispatch = useDispatch();
  const count = useSelector(selectCount);
  const user = useSelector((s) => s.auth.user);
  useEffect(() => {
    if (localStorage.getItem('fg-token')) dispatch(fetchMe());
  }, [dispatch]);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const links = [['/', 'Home'], ['/toko', 'Shop'], ['/find', 'Find Your Bloom'], ['/about', 'About'], ['/kontak', 'Contact']];
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">FloraGift</Link>
        <nav className="menu">{links.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}</nav>
        <div className="icons">
          {open && (
            <form onSubmit={(e) => { e.preventDefault(); nav('/toko?q=' + encodeURIComponent(q)); setOpen(false); }}>
              <input autoFocus className="mini-search" placeholder="Cari buket" value={q} onChange={(e) => setQ(e.target.value)} />
            </form>
          )}
          <button aria-label="Cari" onClick={() => setOpen(!open)}><Ic n="search" /></button>
          <Link to="/akun" aria-label="Akun">{user ? <span className="avatar">{user.name.charAt(0).toUpperCase()}</span> : <Ic n="user" />}</Link>
          <Link to="/keranjang" aria-label="Keranjang" className="bag"><Ic n="bag" />{count > 0 && <b>{count}</b>}</Link>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/toko" element={<Shop />} />
          <Route path="/produk/:id" element={<Product />} />
          <Route path="/find" element={<Find />} />
          <Route path="/keranjang" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/sukses/:code" element={<Success />} />
          <Route path="/lacak" element={<Track />} />
          <Route path="/lacak/:code" element={<Track />} />
          <Route path="/riwayat" element={<History />} />
          <Route path="/akun" element={<Account />} />
          <Route path="/auth/login" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/kontak" element={<Contact />} />
        </Routes>
      </main>
      <footer className="foot">
        <div><div className="logo">FloraGift</div><p>Little flowers, meaningful moments.</p></div>
        <div><h4 aria-level="2">Quick Links</h4><Link to="/">Home</Link><Link to="/toko">Shop</Link><Link to="/find">Find Your Bloom</Link><Link to="/about">About</Link></div>
        <div><h4 aria-level="2">Customer Care</h4><Link to="/kontak">Contact</Link><Link to="/lacak">Track Order</Link><Link to="/riwayat">Order History</Link></div>
        <div><h4 aria-level="2">Follow Us</h4><div className="social"><a href="https://instagram.com"><span aria-hidden="true">IG</span><span className="sr-only">Instagram</span></a><a href="https://tiktok.com"><span aria-hidden="true">TT</span><span className="sr-only">TikTok</span></a><a href="https://wa.me/6282160183466"><span aria-hidden="true">WA</span><span className="sr-only">WhatsApp</span></a></div></div>
        <p className="copy">© 2026 FloraGift. All rights reserved.</p>
      </footer>
      <nav className="tabbar">
        <NavLink to="/" end><Ic n="home" />Home</NavLink>
        <NavLink to="/toko"><Ic n="shop" />Shop</NavLink>
        <NavLink to="/find"><Ic n="heart" />Find</NavLink>
        <NavLink to="/keranjang"><Ic n="bag" />Cart{count > 0 && <b>{count}</b>}</NavLink>
        <NavLink to="/akun"><Ic n="user" />Profile</NavLink>
      </nav>
    </>
  );
}
