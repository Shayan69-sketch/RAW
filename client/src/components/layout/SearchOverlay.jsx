import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { setSearchOpen } from '../../features/ui/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { useGetProductsQuery } from '../../services/productApi';
import { useCurrency } from '../../context/CurrencyContext';

const SearchOverlay = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { format } = useCurrency();

  const { data, isFetching } = useGetProductsQuery(
    { search: debouncedQuery, limit: 6 },
    { skip: !debouncedQuery || debouncedQuery.length < 2 }
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const close = () => dispatch(setSearchOpen(false));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      close();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] bg-white"
    >
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wider">Search</h2>
          <button onClick={close} className="p-2">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative mb-8">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-12 pr-4 py-4 border-b-2 border-primary text-lg focus:outline-none"
          />
        </form>

        {/* Results */}
        {isFetching && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-16 h-20 bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 w-3/4" />
                  <div className="h-4 bg-gray-200 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.products && data.products.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">
              Products ({data.pagination.total})
            </h3>
            <div className="space-y-4">
              {data.products.map((product) => (
                <button
                  key={product._id}
                  onClick={() => {
                    navigate(`/products/${product.slug}`);
                    close();
                  }}
                  className="flex gap-4 w-full text-left hover:bg-bg-alt p-2 transition-colors"
                >
                  <img
                    src={product.variants?.[0]?.images?.[0]?.url || ''}
                    alt={product.name}
                    className="w-16 h-20 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-sm text-text-light">
                      {format(product.isSale && product.salePrice ? product.salePrice : product.basePrice)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {data.pagination.total > 6 && (
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                  close();
                }}
                className="mt-4 text-sm font-semibold underline"
              >
                View all {data.pagination.total} results
              </button>
            )}
          </div>
        )}

        {debouncedQuery && debouncedQuery.length >= 2 && !isFetching && data?.products?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-semibold mb-2">No results found</p>
            <p className="text-text-light text-sm">Try a different search term</p>
          </div>
        )}

        {/* Popular searches */}
        {!debouncedQuery && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['T-Shirts', 'Leggings', 'Hoodies', 'Shorts', 'Sports Bras', 'Joggers'].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 border border-border text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchOverlay;
