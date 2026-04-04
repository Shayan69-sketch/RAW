export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const GENDERS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

export const SPORT_TYPES = [
  { value: 'lifting', label: 'Lifting' },
  { value: 'running', label: 'Running' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'training', label: 'Training' },
  { value: 'everyday', label: 'Everyday' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'rating', label: 'Highest Rated' },
];

export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
];

export const NAV_LINKS = {
  men: {
    trending: ['New Releases', 'Best Sellers', 'Apex Collection', 'Sale'],
    products: ['T-Shirts & Tops', 'Hoodies & Jackets', 'Shorts', 'Joggers & Bottoms', 'Stringers', 'Tank Tops', 'Underwear', 'Accessories'],
    explore: ['Lifting', 'Running', 'Training', 'Everyday'],
  },
  women: {
    trending: ['New Releases', 'Best Sellers', 'Vital Collection', 'Sale'],
    products: ['Leggings', 'Sports Bras', 'T-Shirts & Tops', 'Hoodies & Jackets', 'Shorts', 'Joggers & Bottoms', 'Accessories'],
    explore: ['Lifting', 'Running', 'Yoga', 'Training'],
  },
};
