export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.substring(0, len) + '...' : str;
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

export const generateSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const getStockStatus = (stock) => {
  if (stock <= 0) return { text: 'Out of Stock', color: 'text-red-600', urgent: false };
  if (stock <= 5) return { text: `Only ${stock} left!`, color: 'text-orange-600', urgent: true };
  return { text: 'In Stock', color: 'text-green-600', urgent: false };
};

export const FREE_SHIPPING_THRESHOLD = 75;

export const getFreeShippingProgress = (subtotal) => {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return { eligible: true, remaining: 0, percentage: 100 };
  }
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const percentage = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
  return { eligible: false, remaining, percentage };
};
