import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMobileMenuOpen } from '../../features/ui/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import { useCurrency } from '../../context/CurrencyContext';
import { FiChevronRight, FiArrowLeft, FiUser, FiHeart, FiPackage, FiLogOut, FiHelpCircle, FiBookOpen, FiInfo, FiGlobe, FiCheck } from 'react-icons/fi';
import { useState } from 'react';

const MobileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();
  const { currency, currencies, changeCurrency } = useCurrency();
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const close = () => dispatch(setMobileMenuOpen(false));

  const menuLinks = [
    { label: 'Men', href: '/products?gender=men' },
    { label: 'Women', href: '/products?gender=women' },
    { label: 'Accessories', href: '/products?category=accessories' },
    { label: 'Sale', href: '/products?isSale=true', accent: true },
  ];

  const handleLogout = async () => {
    await logout();
    close();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[59] bg-black/30 backdrop-blur-sm lg:hidden"
        onClick={close}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
        className="fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm bg-white overflow-y-auto lg:hidden shadow-2xl"
      >
        {/* Top bar with back button */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between px-5 py-4">
            <button
              onClick={close}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 active:scale-95 transition-transform"
            >
              <FiArrowLeft size={20} />
              <span className="uppercase tracking-widest text-xs">Back</span>
            </button>
            <span className="text-sm font-black tracking-[0.2em] uppercase">RAWTHREAD</span>
          </div>
        </div>

        {/* User greeting / Auth CTA */}
        <div className="px-5 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Hi, {user?.firstName}!</p>
                <Link to="/account" onClick={close} className="text-xs text-gray-500 underline">
                  Manage account
                </Link>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={close}
              className="flex items-center gap-3 w-full"
            >
              <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser size={18} className="text-gray-500" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">Sign In / Register</p>
                <p className="text-xs text-gray-400">Access orders & wishlist</p>
              </div>
              <FiChevronRight size={16} className="ml-auto text-gray-400" />
            </Link>
          )}
        </div>

        {/* Main nav */}
        <nav className="px-2 py-3">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Shop</p>
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={close}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold active:bg-gray-100 transition-colors ${
                link.accent ? 'text-red-600' : 'text-gray-900'
              }`}
            >
              {link.label}
              <FiChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </nav>

        {/* Currency Selector */}
        <div className="px-2 py-2 border-t border-gray-100">
          <p className="px-3 mb-2 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Currency</p>
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm text-gray-700 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FiGlobe size={16} className="text-gray-400" />
              <span className="text-[15px] font-semibold">{currency.flag} {currency.code}</span>
              <span className="text-xs text-gray-400">({currency.symbol})</span>
            </div>
            <FiChevronRight size={16} className={`text-gray-300 transition-transform ${currencyOpen ? 'rotate-90' : ''}`} />
          </button>
          {currencyOpen && (
            <div className="ml-2 mr-2 mb-2 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    changeCurrency(c.code);
                    setCurrencyOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{c.flag}</span>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{c.code}</p>
                      <p className="text-[10px] text-gray-400">{c.name}</p>
                    </div>
                  </div>
                  {currency.code === c.code && <FiCheck size={14} className="text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Account section */}
        {isLoggedIn && (
          <div className="px-2 py-2 border-t border-gray-100">
            <p className="px-3 mb-2 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Account</p>
            {[
              { label: 'My Account', href: '/account', icon: FiUser },
              { label: 'Wishlist', href: '/account/wishlist', icon: FiHeart },
              { label: 'Order History', href: '/account/orders', icon: FiPackage },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={close}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 active:bg-gray-100 transition-colors"
              >
                <link.icon size={16} className="text-gray-400" />
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-accent active:bg-gray-100 transition-colors">
                <FiPackage size={16} />
                Admin Dashboard
              </Link>
            )}
          </div>
        )}

        {/* Help links */}
        <div className="px-2 py-2 border-t border-gray-100">
          <p className="px-3 mb-2 mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">More</p>
          {[
            { label: 'Help Center', href: '/help', icon: FiHelpCircle },
            { label: 'About Us', href: '/about', icon: FiInfo },
            { label: 'Blog', href: '/blog', icon: FiBookOpen },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={close}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-700 active:bg-gray-100 transition-colors"
            >
              <link.icon size={16} className="text-gray-400" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        {isLoggedIn && (
          <div className="px-2 py-3 border-t border-gray-100 mb-8">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-600 w-full active:bg-red-50 transition-colors"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default MobileMenu;
