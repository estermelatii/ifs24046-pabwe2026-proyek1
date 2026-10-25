import { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import { AUTH_EXPIRED_EVENT, STORAGE_KEYS } from "./config.js";
import { fetchMe, logout } from "./features/auth/authSlice.js";
import { Header } from "./components/layout/Header.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { TabBar } from "./components/layout/TabBar.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import { RequireAuth } from "./components/RequireAuth.jsx";

const lazyPage = (importer, exportName) => lazy(() => importer().then((module) => ({ default: module[exportName] })));

const Home = lazyPage(() => import("./features/home/Home.jsx"), "Home");
const Shop = lazyPage(() => import("./features/catalog/Shop.jsx"), "Shop");
const Product = lazyPage(() => import("./features/catalog/Product.jsx"), "Product");
const Find = lazyPage(() => import("./features/quiz/Find.jsx"), "Find");
const Cart = lazyPage(() => import("./features/cart/Cart.jsx"), "Cart");
const Checkout = lazyPage(() => import("./features/checkout/Checkout.jsx"), "Checkout");
const Success = lazyPage(() => import("./features/orders/Success.jsx"), "Success");
const Track = lazyPage(() => import("./features/orders/Track.jsx"), "Track");
const History = lazyPage(() => import("./features/orders/History.jsx"), "History");
const Account = lazyPage(() => import("./features/account/Account.jsx"), "Account");
const About = lazyPage(() => import("./features/static/About.jsx"), "About");
const Contact = lazyPage(() => import("./features/static/Contact.jsx"), "Contact");
const NotFound = lazyPage(() => import("./features/static/NotFound.jsx"), "NotFound");

export default function App() {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEYS.token)) dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    const handleAuthExpired = () => dispatch(logout());
    globalThis.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => globalThis.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [dispatch]);

  return (
    <>
      <Header />
      <main>
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<p className="notice">Memuat…</p>}>
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
              <Route path="/riwayat" element={<RequireAuth title="Riwayat Pesanan" purpose="riwayat pesananmu"><History /></RequireAuth>} />
              <Route path="/akun" element={<Account />} />
              <Route path="/auth/login" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/kontak" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <TabBar />
    </>
  );
}
