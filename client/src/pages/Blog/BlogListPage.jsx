import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';

const blogs = [
  { id: 1, title: '5 Essential Exercises for Building Strength', excerpt: 'Master these compound movements to build a solid foundation of strength and muscle.', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', category: 'Training', date: 'Mar 15, 2024' },
  { id: 2, title: 'The Ultimate Guide to Workout Recovery', excerpt: 'Learn the science behind recovery and how to optimize your rest days for maximum gains.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop', category: 'Wellness', date: 'Mar 10, 2024' },
  { id: 3, title: 'How to Style Athleisure for Every Occasion', excerpt: 'From the gym to brunch, here\'s how to make your workout wear work everywhere.', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop', category: 'Lifestyle', date: 'Mar 5, 2024' },
  { id: 4, title: 'Nutrition Tips for Optimal Performance', excerpt: 'Fuel your training with the right nutrition strategies for peak performance.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop', category: 'Nutrition', date: 'Feb 28, 2024' },
  { id: 5, title: 'The Benefits of Morning Workouts', excerpt: 'Discover why training in the morning can transform your fitness journey and daily productivity.', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop', category: 'Training', date: 'Feb 20, 2024' },
  { id: 6, title: 'Building a Home Gym on a Budget', excerpt: 'Everything you need to create an effective home gym without breaking the bank.', image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&h=400&fit=crop', category: 'Lifestyle', date: 'Feb 15, 2024' },
];

const BlogListPage = () => (
  <>
    <SEO title="Blog" description="Training tips, lifestyle content, and fitness inspiration from RAWTHREAD." />
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold uppercase tracking-wider text-center mb-4">The Blog</h1>
      <p className="text-center text-text-muted mb-12">Training, nutrition, lifestyle — everything you need to be your best.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link to={`/blog/${blog.id}`} key={blog.id} className="group">
            <div className="overflow-hidden aspect-[16/10] mb-4">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">{blog.category} · {blog.date}</span>
            <h2 className="text-lg font-semibold mt-2 group-hover:underline">{blog.title}</h2>
            <p className="text-sm text-text-light mt-1">{blog.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  </>
);

export const BlogDetailPage = () => (
  <>
    <SEO title="Blog Article" />
    <div className="max-w-3xl mx-auto px-4 py-12">
      <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Training · Mar 15, 2024</span>
      <h1 className="text-3xl font-bold mt-3 mb-6">5 Essential Exercises for Building Strength</h1>
      <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop" alt="" className="w-full aspect-[2/1] object-cover mb-8" />
      <div className="prose max-w-none text-text-light leading-relaxed space-y-4">
        <p>Building strength requires a focused approach to compound movements that engage multiple muscle groups simultaneously. These exercises form the foundation of any effective training program.</p>
        <h2 className="text-xl font-bold text-primary !mt-8">1. Barbell Back Squat</h2>
        <p>The king of all exercises. The squat develops your quads, glutes, hamstrings and core while building full-body strength. Focus on depth and controlled movement.</p>
        <h2 className="text-xl font-bold text-primary !mt-8">2. Conventional Deadlift</h2>
        <p>Nothing builds raw posterior chain strength like the deadlift. It targets your entire back, glutes, and hamstrings while developing grip strength.</p>
        <h2 className="text-xl font-bold text-primary !mt-8">3. Bench Press</h2>
        <p>The benchmark upper body exercise. It develops the chest, shoulders, and triceps. Focus on proper form and a full range of motion.</p>
        <h2 className="text-xl font-bold text-primary !mt-8">4. Overhead Press</h2>
        <p>Building strong shoulders is critical for overall upper body development. The overhead press develops shoulder strength and stability.</p>
        <h2 className="text-xl font-bold text-primary !mt-8">5. Barbell Row</h2>
        <p>A thick, strong back is built with rows. This exercise develops the lats, rhomboids, and rear delts while improving posture.</p>
      </div>
      <Link to="/blog" className="inline-block mt-10 text-sm font-semibold uppercase tracking-wider underline hover:text-text-light">← Back to Blog</Link>
    </div>
  </>
);

export default BlogListPage;
