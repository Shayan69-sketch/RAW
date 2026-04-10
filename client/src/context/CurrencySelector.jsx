import { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { useCurrency } from './CurrencyContext';

const CurrencySelector = () => {
  const { currency, currencies, changeCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-primary transition-colors text-[11px]"
      >
        <span>{currency.flag}</span>
        <span>{currency.code} | {currency.symbol}</span>
        <FiChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border shadow-lg z-50 py-1">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => { changeCurrency(c.code); setOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2 text-xs hover:bg-bg-alt transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{c.flag}</span>
                <div className="text-left">
                  <p className="font-semibold">{c.code}</p>
                  <p className="text-text-muted text-[10px]">{c.name}</p>
                </div>
              </div>
              {currency.code === c.code && <FiCheck size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
