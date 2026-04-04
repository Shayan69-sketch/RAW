import { formatPrice } from '../../utils/formatPrice';
import { getFreeShippingProgress } from '../../utils/helpers';

const FreeShippingBar = ({ subtotal }) => {
  const { eligible, remaining, percentage } = getFreeShippingProgress(subtotal);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs mb-1.5">
        {eligible ? (
          <span className="text-green-600 font-semibold">✓ You've unlocked free shipping!</span>
        ) : (
          <span className="text-text-light">
            Spend <span className="font-semibold text-primary">{formatPrice(remaining)}</span> more for free shipping
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${eligible ? 'bg-green-500' : 'bg-primary'}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default FreeShippingBar;
