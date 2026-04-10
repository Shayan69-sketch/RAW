import { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/common/ProductCard';
import Breadcrumb from '../../components/common/Breadcrumb';
import { ProductGridSkeleton } from '../../components/common/Loader';
import { useGetProductsQuery } from '../../services/productApi';
import { useGetCategoriesQuery } from '../../services/categoryApi';
import { SORT_OPTIONS, SIZES, GENDERS, SPORT_TYPES } from '../../utils/constants';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const params = {
    gender: searchParams.get('gender') || '',
    category: searchParams.get('category') || '',
    color: searchParams.get('color') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    sport: searchParams.get('sport') || '',
    isSale: searchParams.get('isSale') || '',
    isTrending: searchParams.get('isTrending') || '',
    page,
    limit: 24,
  };

  // Clean empty params
  const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== ''));

  const { data, isLoading, isFetching } = useGetProductsQuery(cleanParams);
  const { data: categoriesData } = useGetCategoriesQuery();

  const activeFilters = useMemo(() => {
    const filters = [];
    if (params.gender) filters.push({ key: 'gender', label: params.gender.charAt(0).toUpperCase() + params.gender.slice(1) });
    if (params.size) filters.push({ key: 'size', label: `Size: ${params.size}` });
    if (params.color) filters.push({ key: 'color', label: `Color: ${params.color}` });
    if (params.sport) filters.push({ key: 'sport', label: params.sport.charAt(0).toUpperCase() + params.sport.slice(1) });
    if (params.isSale) filters.push({ key: 'isSale', label: 'On Sale' });
    if (params.minPrice || params.maxPrice) filters.push({ key: 'price', label: `$${params.minPrice || 0} - $${params.maxPrice || '∞'}` });
    return filters;
  }, [params.gender, params.size, params.color, params.sport, params.isSale, params.minPrice, params.maxPrice]);

  const removeFilter = (key) => {
    const newParams = new URLSearchParams(searchParams);
    if (key === 'price') {
      newParams.delete('minPrice');
      newParams.delete('maxPrice');
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setPage(1);
  };

  const title = params.gender
    ? `${params.gender.charAt(0).toUpperCase() + params.gender.slice(1)}'s Clothing`
    : params.isSale ? 'Sale' : 'All Products';

  return (
    <>
      <SEO title={title} description={`Shop ${title.toLowerCase()} at RAWTHREAD`} />

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb items={[{ label: 'Products', href: '/products' }, { label: title }]} />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight">{title}</h1>
            {data && (
              <p className="text-sm text-text-muted mt-1">
                Showing {((page - 1) * 24) + 1}–{Math.min(page * 24, data.pagination.total)} of {data.pagination.total} products
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border text-sm font-semibold"
            >
              <FiFilter size={16} /> Filter
            </button>

            <select
              value={params.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-2 border border-border text-sm bg-white focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => removeFilter(filter.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-alt text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {filter.label} <FiX size={12} />
              </button>
            ))}
            <button
              onClick={() => setSearchParams({})}
              className="text-xs font-semibold underline text-text-muted hover:text-primary"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="lg:flex lg:gap-8">
          {/* Sidebar filters */}
          <aside className={`lg:w-56 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="space-y-6 pb-8">
              {/* Gender */}
              <FilterSection title="Gender">
                {GENDERS.map((g) => (
                  <FilterButton key={g.value} label={g.label} active={params.gender === g.value}
                    onClick={() => updateFilter('gender', params.gender === g.value ? '' : g.value)} />
                ))}
              </FilterSection>

              {/* Category */}
              <FilterSection title="Category">
                {categoriesData?.categories?.map((cat) => (
                  <FilterButton key={cat._id} label={cat.name} active={params.category === cat._id}
                    onClick={() => updateFilter('category', params.category === cat._id ? '' : cat._id)} />
                ))}
              </FilterSection>

              {/* Size */}
              <FilterSection title="Size">
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s}
                      onClick={() => updateFilter('size', params.size === s ? '' : s)}
                      className={`px-3 py-1.5 border text-xs font-semibold transition-colors ${
                        params.size === s ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Sport */}
              <FilterSection title="Sport">
                {SPORT_TYPES.map((s) => (
                  <FilterButton key={s.value} label={s.label} active={params.sport === s.value}
                    onClick={() => updateFilter('sport', params.sport === s.value ? '' : s.value)} />
                ))}
              </FilterSection>

              {/* Price Range */}
              <FilterSection title="Price">
                <div className="flex gap-2 items-center">
                  <input type="number" placeholder="Min" value={searchParams.get('minPrice') || ''}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-border text-xs" />
                  <span className="text-text-muted">—</span>
                  <input type="number" placeholder="Max" value={searchParams.get('maxPrice') || ''}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-border text-xs" />
                </div>
              </FilterSection>

              {/* Sale */}
              <FilterSection title="Sale">
                <FilterButton label="On Sale" active={params.isSale === 'true'}
                  onClick={() => updateFilter('isSale', params.isSale === 'true' ? '' : 'true')} />
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : data?.products?.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-text-muted mb-6">Try adjusting your filters</p>
                <button onClick={() => setSearchParams({})} className="btn btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 ${isFetching ? 'opacity-50' : ''}`}>
                  {data?.products?.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination?.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {[...Array(data.pagination.pages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-semibold transition-colors ${
                          page === i + 1 ? 'bg-primary text-white' : 'border border-border hover:bg-bg-alt'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Helper components
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        <FiChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterButton = ({ label, active, onClick }) => (
  <button onClick={onClick}
    className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
      active ? 'bg-primary text-white' : 'hover:bg-bg-alt'
    }`}
  >
    {label}
  </button>
);

export default ProductListPage;
