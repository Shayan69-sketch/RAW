import { Link, Outlet, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiTag, FiLayers } from 'react-icons/fi';
import SEO from '../../components/common/SEO';

const AdminLayout = () => {
  const location = useLocation();
  const links = [
    { to: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: FiPackage, label: 'Products' },
    { to: '/admin/orders', icon: FiShoppingCart, label: 'Orders' },
    { to: '/admin/users', icon: FiUsers, label: 'Users' },
    { to: '/admin/coupons', icon: FiTag, label: 'Coupons' },
    { to: '/admin/categories', icon: FiLayers, label: 'Categories' },
  ];
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  return (
    <>
      <SEO title="Admin Dashboard" />
      <div className="min-h-screen bg-bg-alt">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold uppercase tracking-wider">Admin</h1>
            <Link to="/" className="text-sm underline">← Back to Store</Link>
          </div>
          <div className="lg:flex lg:gap-6">
            <aside className="lg:w-52 mb-6 lg:mb-0">
              <nav className="bg-white border border-border">
                {links.map((link) => (
                  <Link key={link.to} to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 text-sm border-b border-border last:border-0 transition-colors ${
                      isActive(link.to, link.exact) ? 'bg-primary text-white' : 'hover:bg-bg-alt'
                    }`}>
                    <link.icon size={16} /> {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="flex-1 min-w-0"><Outlet /></main>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
