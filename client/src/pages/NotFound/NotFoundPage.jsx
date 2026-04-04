import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const NotFoundPage = () => (
  <>
    <SEO title="404 - Page Not Found" />
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
        <p className="text-text-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/products" className="btn btn-outline">Shop Now</Link>
        </div>
      </div>
    </div>
  </>
);

export default NotFoundPage;
