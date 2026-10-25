import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectCount } from '../../features/cart/cartSlice.js';
import { Icon } from '../Icon.jsx';

export function TabBar() {
  const cartCount = useSelector(selectCount);

  return (
    <nav className="tabbar">
      <NavLink to="/" end><Icon name="home" />Home</NavLink>
      <NavLink to="/toko"><Icon name="shop" />Shop</NavLink>
      <NavLink to="/find"><Icon name="heart" />Find</NavLink>
      <NavLink to="/keranjang"><Icon name="bag" />Cart{cartCount > 0 && <b>{cartCount}</b>}</NavLink>
      <NavLink to="/akun"><Icon name="user" />Profile</NavLink>
    </nav>
  );
}
