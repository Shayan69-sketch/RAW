import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiUser, FiPackage, FiMapPin, FiHeart, FiLogOut } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: '/account', icon: FiUser, label: 'Profile', exact: true },
    { to: '/account/orders', icon: FiPackage, label: 'Orders' },
    { to: '/account/addresses', icon: FiMapPin, label: 'Addresses' },
    { to: '/account/wishlist', icon: FiHeart, label: 'Wishlist' },
  ];

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <>
      <SEO title="My Account" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-8">
          Welcome, {user?.firstName}
        </h1>

        <div className="lg:flex lg:gap-10">
          <aside className="lg:w-56 mb-8 lg:mb-0">
            <nav className="space-y-1">
              {links.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.to, link.exact) ? 'bg-primary text-white' : 'hover:bg-bg-alt'
                  }`}
                >
                  <link.icon size={16} /> {link.label}
                </Link>
              ))}
              <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 w-full">
                <FiLogOut size={16} /> Sign Out
              </button>
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
