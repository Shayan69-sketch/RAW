import { motion } from 'framer-motion';
import SEO from '../../components/common/SEO';

const AboutPage = () => (
  <>
    <SEO title="About Us" description="Our story, mission, and the athletes who inspire us." />
    {/* Hero */}
    <div className="relative h-[50vh] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&h=600&fit=crop" alt="About" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-wider">Our Story</h1>
      </div>
    </div>

    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
        <h2 className="text-2xl font-bold mb-4">We Exist To Unite The Conditioning Community</h2>
        <p className="text-text-light leading-relaxed">Since 2012, we've been creating innovative fitness apparel that helps athletes perform at their best. What started as a screen-printing operation in a garage has grown into a global community of millions.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        {[
          { number: '10M+', label: 'Global Community' },
          { number: '230+', label: 'Countries Shipped To' },
          { number: '2012', label: 'Founded' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
            <p className="text-4xl font-black mb-1">{stat.number}</p>
            <p className="text-sm text-text-muted uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop" alt="Mission" className="w-full aspect-[3/2] object-cover" />
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-text-light leading-relaxed mb-4">To unite the conditioning community. We believe that every rep brings you closer to your goals, and our gear is designed to move with you through every challenge.</p>
          <p className="text-text-light leading-relaxed">Innovation, community, and progression drive everything we do. From seamless knit technology to our commitment to sustainability, we're constantly pushing forward.</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Family', desc: 'We support each other and grow together as one team, one family.' },
            { title: 'Progression', desc: 'We never stop improving — our products, our people, and our planet.' },
            { title: 'Vision', desc: 'We see the bigger picture and work towards a future where everyone can be their best.' },
          ].map((val, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="border border-border p-6 text-center">
              <h3 className="font-bold text-lg mb-2">{val.title}</h3>
              <p className="text-sm text-text-light">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default AboutPage;
