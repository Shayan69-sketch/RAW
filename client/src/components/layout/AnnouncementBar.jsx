import { motion } from 'framer-motion';

const AnnouncementBar = () => {
  return (
    <motion.div
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      className="bg-primary text-white text-center py-2.5 px-4 text-xs tracking-widest uppercase font-medium"
    >
      Free Shipping On Orders Over $75 | Use Code <span className="font-bold underline">WELCOME10</span> For 10% Off
    </motion.div>
  );
};

export default AnnouncementBar;
