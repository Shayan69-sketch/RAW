export const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-[3/4] mb-3" />
    <div className="h-3 bg-gray-200 w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 w-1/3" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="bg-gray-200 aspect-square" />
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 w-3/4" />
        <div className="h-6 bg-gray-200 w-1/4" />
        <div className="h-4 bg-gray-200 w-full" />
        <div className="h-4 bg-gray-200 w-full" />
        <div className="h-4 bg-gray-200 w-2/3" />
        <div className="flex gap-3 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-12 h-12 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-14 bg-gray-200 mt-6" />
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
  <div className="animate-pulse space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4">
        {[...Array(cols)].map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 flex-1" />
        ))}
      </div>
    ))}
  </div>
);

const Loader = ({ type = 'spinner', className = '' }) => {
  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <ProductGridSkeleton />;
};

export default Loader;
