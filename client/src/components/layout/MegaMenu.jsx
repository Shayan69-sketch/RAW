import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';

const MegaMenu = ({ gender, onClose }) => {
  const links = NAV_LINKS[gender];
  if (!links) return null;

  const slugify = (text) => text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 w-[700px] bg-white border border-border shadow-lg z-50"
      onMouseLeave={onClose}
    >
      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Trending */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Trending</h3>
          <ul className="space-y-2.5">
            {links.trending.map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Sale' ? `/products?gender=${gender}&isSale=true` : `/products?gender=${gender}`}
                  className="text-sm hover:underline hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Products</h3>
          <ul className="space-y-2.5">
            {links.products.map((item) => (
              <li key={item}>
                <Link
                  to={`/products?gender=${gender}&category=${slugify(item)}`}
                  className="text-sm hover:underline hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore by sport */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Explore</h3>
          <ul className="space-y-2.5">
            {links.explore.map((item) => (
              <li key={item}>
                <Link
                  to={`/products?gender=${gender}&sport=${item.toLowerCase()}`}
                  className="text-sm hover:underline hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          {/* Featured image */}
          <div className="mt-6 relative overflow-hidden group cursor-pointer">
            <img
              src={gender === 'men'
                ? 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&h=200&fit=crop'
                : 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=200&fit=crop'
              }
              alt={`${gender}'s collection`}
              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex items-end p-3">
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                Shop {gender === 'men' ? "Men's" : "Women's"} →
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
