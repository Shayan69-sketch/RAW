import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMobileMenuOpen } from '../../features/ui/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { FiChevronRight } from 'react-icons/fi';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, isAdmin } = useAuth();
  const close = () => dispatch(setMobileMenuOpen(false));

  const menuLinks = [
    { label: 'Men', href: '/products?gender=men' },
    { label: 'Women', href: '/products?gender=women' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Sale', href: '/products?isSale=true', accent: true },
  ];

  const accountLinks = isLoggedIn
    ? [
        { label: 'My Account', href: '/account' },
        { label: 'Wishlist', href: '/account/wishlist' },
        { label: 'Order History', href: '/account/orders' },
      ]
    : [
        { label: 'Sign In', href: '/login' },
        { label: 'Create Account', href: '/register' },
      ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-0 z-[60] bg-white overflow-y-auto lg:hidden"
    >
      <div className="p-6 pt-20">
        {/* Main nav */}
        <nav className="space-y-1 mb-8">
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={close}
              className={`flex items-center justify-between py-4 border-b border-border text-lg font-semibold uppercase tracking-wider ${
                link.accent ? 'text-red-600' : ''
              }`}
            >
              {link.label}
              <FiChevronRight />
            </Link>
          ))}
        </nav>

        {/* Account section */}
        <div className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Account</h3>
          {accountLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={close}
              className="block py-3 text-sm hover:text-text-light transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" onClick={close} className="block py-3 text-sm font-semibold text-accent">
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* Help links */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Help</h3>
          <Link to="/help" onClick={close} className="block py-3 text-sm">Help Center</Link>
          <Link to="/about" onClick={close} className="block py-3 text-sm">About Us</Link>
          <Link to="/blog" onClick={close} className="block py-3 text-sm">Blog</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
