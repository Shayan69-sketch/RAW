import { motion } from 'framer-motion';
import { useCurrency } from '../../context/CurrencyContext';

const AnnouncementBar = () => {
  const { format } = useCurrency();

  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="bg-primary text-white text-center py-2 px-4 text-[11px] tracking-widest uppercase font-medium"
    >
      <span className="hidden sm:inline">Free Shipping On Orders Over {format(75)} | Use Code </span>
      <span className="sm:hidden">Free Shipping {format(75)}+ | Code </span>
      <span className="font-bold underline">WELCOME10</span>
      <span className="hidden sm:inline"> For 10% Off</span>
      <span className="sm:hidden"> = 10% Off</span>
    </motion.div>
  );
};

export default AnnouncementBar;
