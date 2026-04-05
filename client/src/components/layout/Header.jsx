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

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { isLoggedIn, isAdmin } = useAuth();
  const cartCount = useSelector(selectCartItemCount);
  const prevCartCount = useRef(cartCount);
  const { mobileMenuOpen, searchOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  // Auto-open cart preview when item is added
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
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        {/* Top utility bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-1.5 text-[11px] text-text-light border-b border-border">
          <div className="flex gap-6">
            <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
            <Link to="/account/orders" className="hover:text-primary transition-colors">Track Order</Link>
          </div>
          <div className="flex gap-6 items-center">
            <button className="hover:text-primary transition-colors">🇺🇸 US | USD $</button>
            {isAdmin && (
              <Link to="/admin" className="hover:text-primary transition-colors font-semibold">Admin Dashboard</Link>
            )}
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4">
          {/* Left: Hamburger + Nav */}
          <div className="flex items-center gap-6">
            <button
              className="lg:hidden p-1"
              onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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

          {/* Center: Logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-0 lg:translate-x-0">
            <h1 className="text-xl lg:text-2xl font-black tracking-[0.3em] uppercase">
              RAWTHREAD
            </h1>
          </Link>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 lg:gap-5">
            <button
              onClick={() => dispatch(setSearchOpen(true))}
              className="p-2 hover:bg-bg-alt rounded-full transition-colors"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            <Link
              to={isLoggedIn ? '/account/wishlist' : '/login'}
              className="hidden sm:block p-2 hover:bg-bg-alt rounded-full transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart size={20} />
            </Link>

            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="hidden sm:block p-2 hover:bg-bg-alt rounded-full transition-colors"
              aria-label="Account"
            >
              <FiUser size={20} />
            </Link>

            {/* Cart with preview */}
            <div className="relative">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-bg-alt rounded-full transition-colors"
                aria-label="Cart"
              >
                <FiShoppingBag size={20} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Preview Drawer */}
      <CartPreview isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && <MobileMenu />}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && <SearchOverlay />}
      </AnimatePresence>
    </>
  );
};

export default Header;