import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <footer className="bg-primary text-white">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl font-bold tracking-wider uppercase mb-3">Join The Family</h3>
            <p className="text-xs sm:text-sm text-white/60 mb-5">
              Be the first to know about new releases, exclusive offers, and get 10% off your first order.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3.5 bg-white/10 text-white placeholder-white/40 text-sm rounded-lg sm:rounded-none sm:rounded-l focus:outline-none focus:bg-white/15 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-primary text-sm font-bold uppercase tracking-wider hover:bg-white/90 active:scale-[0.98] transition-all rounded-lg sm:rounded-none sm:rounded-r"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Help</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Delivery', 'Returns', 'Size Guide', 'Contact Us'].map((item) => (
                <li key={item}>
                  <Link to="/help" className="text-sm text-white/60 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">About</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Our Story', to: '/about' },
                { label: 'Athletes', to: '/about' },
                { label: 'Blog', to: '/blog' },
                { label: 'Careers', to: '/about' },
                { label: 'Sustainability', to: '/about' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Men's", to: '/products?gender=men' },
                { label: "Women's", to: '/products?gender=women' },
                { label: 'Accessories', to: '/products?category=accessories' },
                { label: 'New Arrivals', to: '/products?sort=newest' },
                { label: 'Sale', to: '/products?isSale=true' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-white/60 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4">Follow Us</h4>
            <div className="flex gap-3 mb-5">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-lg hover:bg-white hover:text-primary active:scale-95 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3">Payment Methods</h4>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-white/50">
              {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay'].map((method) => (
                <span key={method} className="px-2 py-1 border border-white/20 rounded">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} RAWTHREAD. All Rights Reserved.
          </p>
          <div className="flex gap-4 text-[11px] text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
