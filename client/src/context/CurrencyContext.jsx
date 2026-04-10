import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CURRENCIES } from '../utils/constants';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem('currency');
    return CURRENCIES.find(c => c.code === saved) || CURRENCIES[0];
  });
  const [rates, setRates] = useState({ USD: 1 });

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      const data = await res.json();
      if (data.rates) setRates(data.rates);
    } catch {
      setRates({
        USD: 1, GBP: 0.79, EUR: 0.92, PKR: 278,
        CAD: 1.36, AUD: 1.53, AED: 3.67,
      });
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const changeCurrency = useCallback((code) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrency(found);
      localStorage.setItem('currency', code);
    }
  }, []);

  const convert = useCallback((amountInUSD) => {
    if (!amountInUSD) return 0;
    const rate = rates[currency.code] || 1;
    return amountInUSD * rate;
  }, [rates, currency.code]);

  const format = useCallback((amountInUSD) => {
    const converted = convert(amountInUSD);
    return `${currency.symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: currency.code === 'PKR' ? 0 : 2,
      maximumFractionDigits: currency.code === 'PKR' ? 0 : 2,
    })}`;
  }, [convert, currency.symbol, currency.code]);

  const value = useMemo(() => ({
    currency, currencies: CURRENCIES, changeCurrency, convert, format,
  }), [currency, changeCurrency, convert, format]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
