import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { STORAGE_KEYS } from './config.js';
import { fetchMe } from './features/auth/authSlice.js';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { TabBar } from './components/layout/TabBar.jsx';
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

  // Pulihkan sesi login bila token masih tersimpan.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.token)) dispatch(fetchMe());
  }, [dispatch]);

  return (
    <>
      <Header />
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
      <Footer />
      <TabBar />
    </>
  );
}
