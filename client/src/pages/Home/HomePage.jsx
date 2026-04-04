import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import SEO from '../../components/common/SEO';
import ProductCard from '../../components/common/ProductCard';
import { useGetProductsQuery } from '../../services/productApi';
import { ProductGridSkeleton } from '../../components/common/Loader';
import { useState, useRef } from 'react';
import { FiArrowRight, FiSend } from 'react-icons/fi';

const fadeUp = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } };
const stagger = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { staggerChildren: 0.1 } };
const staggerChild = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const HomePage = () => {
  const { data: trendingData, isLoading: trendingLoading } = useGetProductsQuery({ isTrending: true, limit: 8 });
  const { data: bestSellersData } = useGetProductsQuery({ isBestSeller: true, limit: 4 });
  const { data: saleData } = useGetProductsQuery({ isSale: true, limit: 4 });
  const [email, setEmail] = useState('');
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const heroSlides = [
    { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop&q=85', title: 'NEW SEASON.\nNEW STANDARDS.', subtitle: 'Unlock your potential with performance-engineered apparel.', cta: 'Shop Now', link: '/products' },
    { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&h=1080&fit=crop&q=85', title: 'TRAIN\nWITHOUT LIMITS', subtitle: 'Every rep. Every set. Be Unstoppable.', cta: 'Shop Men', link: '/products?gender=men' },
    { image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&h=1080&fit=crop&q=85', title: 'EMPOWER\nYOUR MOVEMENT', subtitle: 'Built for performance. Designed for you.', cta: 'Shop Women', link: '/products?gender=women' },
  ];

  const categories = [
    { name: 'Men', image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop', link: '/products?gender=men' },
    { name: 'Women', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop', link: '/products?gender=women' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=800&fit=crop', link: '/products?category=accessories' },
    { name: 'Sale', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=800&fit=crop', link: '/products?isSale=true' },
  ];

  const sports = [
    { name: 'Lifting', image: 'https://images.unsplash.com/photo-1533681904393-9ab6ebed4d22?w=500&h=650&fit=crop', link: '/products?sport=lifting' },
    { name: 'Running', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&h=650&fit=crop', link: '/products?sport=running' },
    { name: 'Yoga', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=650&fit=crop', link: '/products?sport=yoga' },
    { name: 'Training', image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=500&h=650&fit=crop', link: '/products?sport=training' },
  ];

  const ambassadors = [
    { name: 'David Laid', role: 'Bodybuilder', image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=400&fit=crop' },
    { name: 'Whitney Simmons', role: 'Fitness Creator', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&h=400&fit=crop' },
    { name: 'Chris Bumstead', role: 'Classic Physique', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop' },
    { name: 'Natacha Oceane', role: 'Athlete', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=400&fit=crop' },
  ];

  const marqueeText = 'FREE SHIPPING OVER $75  ★  NEW ARRIVALS WEEKLY  ★  RAWTHREAD REWARDS  ★  14-DAY RETURNS  ★  ';

  return (
    <>
      <SEO title="Home" description="RAWTHREAD — Premium fitness apparel engineered for peak performance." />

      {/* ── HERO BANNER ── */}
      <section className="relative">
        <Swiper modules={[Autoplay, Pagination, Navigation, EffectFade]} effect="fade" autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true }} navigation loop className="w-full">
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative h-[65vh] lg:h-[90vh] overflow-hidden">
                <motion.img src={slide.image} alt={slide.title} className="w-full h-full object-cover" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: 'easeOut' }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex items-center">
                  <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
                    <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
                      <h2 className="text-4xl lg:text-8xl font-black text-white leading-[0.95] whitespace-pre-line mb-5 tracking-tighter">{slide.title}</h2>
                      <p className="text-white/70 text-base lg:text-lg mb-8 max-w-md">{slide.subtitle}</p>
                      <Link to={slide.link} className="group inline-flex items-center gap-3 bg-white text-primary px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/90 transition-all">
                        {slide.cta} <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ── SCROLLING MARQUEE ── */}
      <div className="bg-primary text-white py-3 overflow-hidden">
        <motion.div className="flex whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
          <span className="text-xs font-bold tracking-[0.3em] uppercase mx-8">{marqueeText.repeat(6)}</span>
        </motion.div>
      </div>

      {/* ── CATEGORY GRID ── */}
      <section className="max-w-7xl mx-auto px-4 py-14 lg:py-24">
        <motion.h2 {...fadeUp} className="section-title text-center mb-12">Shop By Category</motion.h2>
        <motion.div {...stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {categories.map((cat) => (
            <motion.div key={cat.name} {...staggerChild}>
              <Link to={cat.link} className="group relative block overflow-hidden aspect-[3/4]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white text-xl lg:text-2xl font-black uppercase tracking-wider">{cat.name}</h3>
                  <span className="text-white/0 group-hover:text-white/70 text-xs uppercase tracking-widest transition-colors duration-300 flex items-center gap-1">Shop Now <FiArrowRight size={12} /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── TRENDING ── */}
      <section className="bg-bg-alt py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-12">
            <div>
              <h2 className="section-title">Trending Now</h2>
              <p className="text-text-muted text-sm mt-1">The most-wanted pieces this week</p>
            </div>
            <Link to="/products?isTrending=true" className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:underline">View All <FiArrowRight size={14} /></Link>
          </motion.div>
          {trendingLoading ? <ProductGridSkeleton count={4} /> : (
            <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {trendingData?.products?.slice(0, 8).map((product) => (
                <motion.div key={product._id} {...staggerChild}><ProductCard product={product} /></motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── PARALLAX BANNER ── */}
      <section ref={parallaxRef} className="relative h-[50vh] lg:h-[60vh] overflow-hidden flex items-center justify-center">
        <motion.img src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920&h=1080&fit=crop&q=85" alt="Banner" className="absolute inset-0 w-full h-[120%] object-cover" style={{ y: parallaxY }} />
        <div className="absolute inset-0 bg-black/50" />
        <motion.div {...fadeUp} className="relative text-center px-4 z-10">
          <h2 className="text-3xl lg:text-6xl font-black text-white uppercase tracking-tight mb-4">Built Different</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">Performance-engineered fabric meets athlete-tested design. Every stitch counts.</p>
          <Link to="/products" className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-300">
            Shop All <FiArrowRight />
          </Link>
        </motion.div>
      </section>

      {/* ── BEST SELLERS ── */}
      {bestSellersData?.products?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14 lg:py-24">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-12">
            <div><h2 className="section-title">Best Sellers</h2><p className="text-text-muted text-sm mt-1">Our all-time favourites</p></div>
            <Link to="/products?sort=best-sellers" className="hidden sm:flex items-center gap-2 text-sm font-semibold uppercase tracking-wider hover:underline">View All <FiArrowRight size={14} /></Link>
          </motion.div>
          <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {bestSellersData.products.map((p) => (<motion.div key={p._id} {...staggerChild}><ProductCard product={p} /></motion.div>))}
          </motion.div>
        </section>
      )}

      {/* ── SHOP BY SPORT ── */}
      <section className="bg-primary text-white py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="text-2xl lg:text-3xl font-black uppercase tracking-wider text-center mb-12">Shop By Sport</motion.h2>
          <motion.div {...stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {sports.map((sport) => (
              <motion.div key={sport.name} {...staggerChild}>
                <Link to={sport.link} className="group relative block overflow-hidden aspect-[3/5]">
                  <img src={sport.image} alt={sport.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                    <h3 className="text-white text-lg font-black uppercase tracking-[0.2em]">{sport.name}</h3>
                    <span className="inline-block mt-2 text-white/0 group-hover:text-white/80 text-xs uppercase tracking-widest transition-all duration-300 translate-y-2 group-hover:translate-y-0">Explore →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── SALE SECTION ── */}
      {saleData?.products?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14 lg:py-24">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-12">
            <div><h2 className="section-title"><span className="text-red-600">Sale</span> — Up to 30% Off</h2></div>
            <Link to="/products?isSale=true" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-red-600 uppercase tracking-wider hover:underline">Shop Sale <FiArrowRight size={14} /></Link>
          </motion.div>
          <motion.div {...stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {saleData.products.map((p) => (<motion.div key={p._id} {...staggerChild}><ProductCard product={p} /></motion.div>))}
          </motion.div>
        </section>
      )}

      {/* ── ATHLETES ── */}
      <section className="bg-bg-alt py-14 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2 {...fadeUp} className="section-title text-center mb-3">Our Athletes</motion.h2>
          <motion.p {...fadeUp} className="text-center text-text-light mb-12 max-w-xl mx-auto">Meet the athletes and creators who push the limits every day.</motion.p>
          <motion.div {...stagger} className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            {ambassadors.map((amb) => (
              <motion.div key={amb.name} {...staggerChild} whileHover={{ y: -8 }} className="text-center group cursor-pointer">
                <div className="overflow-hidden mb-4 aspect-square rounded-sm shadow-lg">
                  <img src={amb.image} alt={amb.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h4 className="font-bold uppercase tracking-wider text-sm">{amb.name}</h4>
                <p className="text-xs text-text-muted mt-0.5">{amb.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <motion.div {...fadeUp} className="relative max-w-2xl mx-auto px-4 text-center z-10">
          <h2 className="text-2xl lg:text-4xl font-black text-white uppercase tracking-wider mb-3">Join The Movement</h2>
          <p className="text-white/60 mb-8">Sign up for early access to new drops, exclusive offers, and training tips.</p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(''); }} className="flex max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/50" required />
            <button type="submit" className="px-6 py-4 bg-white text-primary font-bold text-sm uppercase tracking-wider hover:bg-white/90 transition-colors flex items-center gap-2">
              <FiSend size={16} /> Join
            </button>
          </form>
          <p className="text-[10px] text-white/30 mt-3">By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.</p>
        </motion.div>
      </section>

      {/* ── BLOG ── */}
      <section className="max-w-7xl mx-auto px-4 py-14 lg:py-24">
        <motion.div {...fadeUp} className="flex items-center justify-between mb-12">
          <h2 className="section-title">From The Blog</h2>
          <Link to="/blog" className="text-sm font-semibold uppercase tracking-wider hover:underline flex items-center gap-1">View All <FiArrowRight size={14} /></Link>
        </motion.div>
        <motion.div {...stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '5 Essential Exercises for Strength', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', category: 'Training' },
            { title: 'The Ultimate Recovery Guide', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', category: 'Wellness' },
            { title: 'Style Athleisure for Every Occasion', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop', category: 'Lifestyle' },
          ].map((post, idx) => (
            <motion.div key={idx} {...staggerChild}>
              <Link to="/blog" className="group block">
                <div className="overflow-hidden mb-4 aspect-[16/10]">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted">{post.category}</span>
                <h3 className="text-lg font-semibold mt-1 group-hover:underline">{post.title}</h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="py-14">
        <motion.h2 {...fadeUp} className="section-title text-center mb-10">@RAWTHREAD</motion.h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          {['1534438327276-14e5300c3a48', '1571019613454-1bd2f1e7f68e', '1518611012118-696072aa579a', '1517836357463-d25dfeac3438', '1556906781-9a412961c28c', '1544367567-0f2fcb009e0b'].map((id, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.5 }} whileHover={{ scale: 1.05, zIndex: 10 }} className="aspect-square overflow-hidden cursor-pointer">
              <img src={`https://images.unsplash.com/photo-${id}?w=300&h=300&fit=crop`} alt="Instagram" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
