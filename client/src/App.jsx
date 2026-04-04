import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnnouncementBar from './components/layout/AnnouncementBar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BackToTop from './components/common/BackToTop';
import CookieConsent from './components/common/CookieConsent';
import AppRouter from './router/AppRouter';
import { generateSessionId } from './utils/helpers';
import { useEffect } from 'react';

// Ensure session ID exists
generateSessionId();

function App() {
  const location = useLocation();
  const isCheckout = location.pathname === '/checkout';
  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      {!isCheckout && !isAdmin && (
        <>
          <AnnouncementBar />
          <Header />
        </>
      )}

      <main className={`flex-1 ${!isCheckout && !isAdmin ? 'pb-8' : ''}`}>
        <AppRouter />
      </main>

      {!isCheckout && !isAdmin && <Footer />}

      <BackToTop />
      <CookieConsent />
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        theme="dark"
        toastStyle={{ borderRadius: 0 }}
      />
    </div>
  );
}

export default App;
