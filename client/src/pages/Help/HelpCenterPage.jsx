import { useState } from 'react';
import { FiChevronDown, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SEO from '../../components/common/SEO';

const faqs = {
  'Orders': [
    { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with a tracking number. You can also check order status in your account under "Order History".' },
    { q: 'Can I cancel my order?', a: 'You can cancel your order within 1 hour of placement if it hasn\'t been processed yet. Go to your Order History and click "Cancel Order".' },
    { q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery is available at checkout for 1-2 business days.' },
  ],
  'Returns': [
    { q: 'What is your return policy?', a: 'We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and with tags attached.' },
    { q: 'How do I start a return?', a: 'Log into your account, go to Order History, select the order, and click "Start Return". Follow the instructions to print a prepaid shipping label.' },
  ],
  'Sizing': [
    { q: 'How do I find my size?', a: 'Check our Size Guide available on every product page. We recommend measuring yourself and comparing against our size charts for the best fit.' },
    { q: 'Do your items run true to size?', a: 'Most of our items are true to size. Some performance items may have a compression fit — check the product description for fit details.' },
  ],
  'Payments': [
    { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.' },
    { q: 'Is my payment secure?', a: 'Yes! All payments are processed through Stripe\'s secure payment system with SSL encryption.' },
  ],
};

const HelpCenterPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContact = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <SEO title="Help Center" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold uppercase tracking-wider text-center mb-4">Help Center</h1>
        <p className="text-center text-text-muted mb-12">Find answers to common questions or get in touch with our team.</p>

        {/* FAQ */}
        <div className="space-y-8 mb-16">
          {Object.entries(faqs).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-bold uppercase tracking-wider mb-4">{category}</h2>
              <div className="space-y-2">
                {items.map((faq, idx) => {
                  const key = `${category}-${idx}`;
                  return (
                    <div key={key} className="border border-border">
                      <button onClick={() => setOpenFaq(openFaq === key ? null : key)} className="flex items-center justify-between w-full p-4 text-left text-sm font-semibold">
                        {faq.q}
                        <FiChevronDown className={`transition-transform flex-shrink-0 ml-2 ${openFaq === key ? 'rotate-180' : ''}`} />
                      </button>
                      {openFaq === key && (
                        <div className="px-4 pb-4 text-sm text-text-light">{faq.a}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="border-t border-border pt-12">
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2"><FiMail /> Contact Us</h2>
          <form onSubmit={handleContact} className="space-y-4 max-w-lg">
            <input type="text" placeholder="Your Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="input-field" required />
            <input type="email" placeholder="Your Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="input-field" required />
            <textarea placeholder="How can we help?" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="input-field h-32 resize-none" required />
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>

        {/* Live chat placeholder */}
        <div className="fixed bottom-6 right-6 z-30">
          <button className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl hover:bg-primary-light transition-colors" onClick={() => toast.info('Live chat coming soon!')}>
            💬
          </button>
        </div>
      </div>
    </>
  );
};

export default HelpCenterPage;
