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
          className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white p-4 lg:p-5 safe-bottom"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs sm:text-sm text-white/80 text-center sm:text-left">
              We use cookies to improve your experience. By continuing, you agree to our{' '}
              <a href="#" className="underline">Cookie Policy</a>.
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={accept} className="flex-1 sm:flex-initial px-5 py-2.5 bg-white text-primary text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 active:scale-95 transition-all">
                Accept
              </button>
              <button onClick={accept} className="flex-1 sm:flex-initial px-5 py-2.5 border border-white/30 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-white/10 active:scale-95 transition-all">
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
