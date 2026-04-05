import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import { CurrencyProvider } from './context/CurrencyContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <CurrencyProvider>
            <App />
          </CurrencyProvider>
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);