import { useState, useEffect } from 'react';

const MAX_ITEMS = 10;

export const useRecentlyViewed = () => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    } catch {
      return [];
    }
  });

  const addItem = (product) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.slug !== product.slug);
      const updated = [
        {
          slug: product.slug,
          name: product.name,
          basePrice: product.basePrice,
          salePrice: product.salePrice,
          isSale: product.isSale,
          image: product.variants?.[0]?.images?.[0]?.url || '',
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return { items, addItem };
};
