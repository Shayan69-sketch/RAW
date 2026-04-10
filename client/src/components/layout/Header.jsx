import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { selectCartItemCount } from '../../features/cart/cartSlice';
import { setMobileMenuOpen, setSearchOpen } from '../../features/ui/uiSlice';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import SearchOverlay from './SearchOverlay';
import CartPreview from './CartPreview';
import CurrencySelector from '../../context/CurrencySelector';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useAuth();
  const cartCount = useSelector(selectCartItemCount);
  const prevCartCount = useRef(cartCount);
  const { mobileMenuOpen, searchOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cartCount > prevCartCount.current) {
      setCartOpen(true);
    }
    prevCartCount.current = cartCount;
  }, [cartCount]);

  const navItems = [
    { label: 'Men', key: 'men', href: '/products?gender=men' },
    { label: 'Women', key: 'women', href: '/products?gender=women' },
    { label: 'Accessories', key: 'accessories', href: '/products?category=accessories' },
    { label: 'Sale', key: 'sale', href: '/products?isSale=true' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        {/* Top utility bar — desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-[11px] text-text-light border-b border-gray-100">
          <div className="flex gap-6">
            <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
            <Link to="/account/orders" className="hover:text-primary transition-colors">Track Order</Link>
          </div>
          <div className="flex gap-6 items-center">
            <CurrencySelector />
            {isAdmin && (
              <Link to="/admin" className="hover:text-primary transition-colors font-semibold">Admin Dashboard</Link>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between px-4 lg:px-8 h-14 lg:h-16">
          {/* Left: menu + nav */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button
              className="lg:hidden p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"
              onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div
                  key={item.key}
                  className="relative py-4"
                  onMouseEnter={() => setActiveMenu(item.key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                      item.key === 'sale' ? 'text-red-600 hover:text-red-700' : 'hover:text-text-light'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {(item.key === 'men' || item.key === 'women') && activeMenu === item.key && (
                    <MegaMenu gender={item.key} onClose={() => setActiveMenu(null)} />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
            <h1 className="text-lg lg:text-2xl font-black tracking-[0.2em] lg:tracking-[0.3em] uppercase">RAWTHREAD</h1>
          </Link>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <button
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* User icon — always visible on mobile for auth access */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Account"
            >
              <FiUser size={20} />
            </Link>

            <Link
              to={isLoggedIn ? '/account/wishlist' : '/login'}
              className="hidden sm:flex p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
            </Link>

            <div className="relative">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <CartPreview isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <AnimatePresence>
        {mobileMenuOpen && <MobileMenu />}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchOverlay />}
      </AnimatePresence>
    </>
  );
};

export default Header;