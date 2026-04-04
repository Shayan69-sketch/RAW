import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../../services/userApi';
import { useAddToCartMutation } from '../../services/cartApi';
import { formatPrice } from '../../utils/formatPrice';
import { toast } from 'react-toastify';
import { generateSessionId } from '../../utils/helpers';

const WishlistPage = () => {
  const { data, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [addToCart] = useAddToCartMutation();

  const handleRemove = async (productId) => {
    try { await removeFromWishlist(productId).unwrap(); toast.success('Removed from wishlist'); } catch { toast.error('Failed'); }
  };

  const handleMoveToCart = async (item) => {
    const product = item.product;
    const variant = product?.variants?.[0];
    const size = variant?.sizes?.find((s) => s.isAvailable)?.size;
    if (!size) return toast.error('No available sizes');
    generateSessionId();
    try {
      await addToCart({ productId: product._id, variantId: variant._id, size, color: variant.color, quantity: 1 }).unwrap();
      await removeFromWishlist(product._id).unwrap();
      toast.success('Moved to bag!');
    } catch { toast.error('Failed'); }
  };

  if (isLoading) return <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-200" />)}</div>;

  return (
    <div>
      <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Wishlist ({data?.wishlist?.length || 0})</h2>
      {data?.wishlist?.length === 0 ? (
        <div className="text-center py-12 bg-bg-alt"><FiHeart className="mx-auto mb-3" size={32} /><p className="text-text-muted mb-4">Your wishlist is empty</p><Link to="/products" className="btn btn-primary">Start Browsing</Link></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data?.wishlist?.map((item) => {
            const product = item.product;
            const image = product?.variants?.[0]?.images?.[0]?.url || '';
            const price = product?.isSale && product?.salePrice ? product.salePrice : product?.basePrice;
            return (
              <div key={item._id} className="group relative">
                <Link to={`/products/${product?.slug}`} className="block aspect-[3/4] overflow-hidden mb-3">
                  <img src={image} alt={product?.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </Link>
                <h3 className="text-sm font-semibold mb-1">{product?.name}</h3>
                <p className="text-sm font-bold mb-3">{formatPrice(price)}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleMoveToCart(item)} className="flex-1 btn btn-primary py-2 text-xs"><FiShoppingBag className="mr-1" /> Move to Bag</button>
                  <button onClick={() => handleRemove(product?._id)} className="p-2 border border-border hover:bg-red-50 hover:text-red-600"><FiHeart size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
