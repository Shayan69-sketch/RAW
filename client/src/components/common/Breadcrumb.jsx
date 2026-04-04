import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-xs text-text-muted py-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-primary transition-colors">
        <FiHome size={14} />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <FiChevronRight size={12} />
          {index === items.length - 1 ? (
            <span className="text-text font-medium">{item.label}</span>
          ) : (
            <Link to={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
