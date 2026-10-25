import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { selectCount } from '../../features/cart/cartSlice.js';
import { selectUser } from '../../features/auth/authSlice.js';
import { LIMITS } from '../../helpers/validation.js';
import { Icon } from '../Icon.jsx';

const MENU_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/toko', label: 'Shop' },
  { to: '/find', label: 'Find Your Bloom' },
  { to: '/about', label: 'About' },
  { to: '/kontak', label: 'Contact' },
];

export function Header() {
  const navigate = useNavigate();
  const cartCount = useSelector(selectCount);
  const user = useSelector(selectUser);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    navigate('/toko?q=' + encodeURIComponent(query));
    setIsSearchOpen(false);
  };

  return (
    <header className="nav">
      <Link to="/" className="logo">FloraGift</Link>
      <nav className="menu">{MENU_LINKS.map(({ to, label }) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav>
      <div className="icons">
        {isSearchOpen && (
          <form onSubmit={handleSearch}>
            <input autoFocus className="mini-search" placeholder="Cari buket" maxLength={LIMITS.search.max} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
          </form>
        )}
        <button aria-label="Cari" onClick={() => setIsSearchOpen(!isSearchOpen)}><Icon name="search" /></button>
        <Link to="/akun" aria-label="Akun">{user ? <span className="avatar">{user.name.charAt(0).toUpperCase()}</span> : <Icon name="user" />}</Link>
        <Link to="/keranjang" aria-label="Keranjang" className="bag"><Icon name="bag" />{cartCount > 0 && <b>{cartCount}</b>}</Link>
      </div>
    </header>
  );
}
