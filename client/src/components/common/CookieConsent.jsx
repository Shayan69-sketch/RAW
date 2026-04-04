import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white p-4 lg:p-5"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/80">
              We use cookies to improve your experience. By continuing, you agree to our{' '}
              <a href="#" className="underline">Cookie Policy</a>.
            </p>
            <div className="flex gap-3">
              <button onClick={accept} className="px-6 py-2 bg-white text-primary text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors">
                Accept
              </button>
              <button onClick={accept} className="px-6 py-2 border border-white/30 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
