export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

export const getDiscountedPrice = (basePrice, salePrice, isSale) => {
  if (isSale && salePrice) return salePrice;
  return basePrice;
};

export const getDiscountPercentage = (basePrice, salePrice) => {
  if (!salePrice || salePrice >= basePrice) return 0;
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
};
