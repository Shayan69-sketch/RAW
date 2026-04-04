import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/common/ProductCard';
import { ProductGridSkeleton } from '../../components/common/Loader';
import { useGetProductsQuery } from '../../services/productApi';
import Breadcrumb from '../../components/common/Breadcrumb';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data, isLoading } = useGetProductsQuery({ search: query, limit: 24 }, { skip: !query });

  return (
    <>
      <SEO title={`Search: ${query}`} />
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb items={[{ label: `Search: "${query}"` }]} />
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        <p className="text-sm text-text-muted mb-8">
          {data ? `${data.pagination.total} results for "${query}"` : `Searching for "${query}"...`}
        </p>
        {isLoading ? <ProductGridSkeleton /> : data?.products?.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-text-muted mb-4">Try searching for something else</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['T-Shirts', 'Leggings', 'Hoodies', 'Shorts'].map((term) => (
                <a key={term} href={`/search?q=${term}`} className="px-4 py-2 border border-border hover:bg-primary hover:text-white transition-colors text-sm">{term}</a>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {data?.products?.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchResultsPage;
