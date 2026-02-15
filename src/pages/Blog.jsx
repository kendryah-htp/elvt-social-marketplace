import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export default function Blog() {
  const posts = [
    {
      title: '10 Proven Strategies to 10x Your Affiliate Earnings',
      excerpt: 'Learn the exact tactics top affiliates use to maximize their commissions and build sustainable income streams.',
      date: '2026-02-10',
      readTime: '8 min read',
      category: 'Strategy',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    },
    {
      title: 'Building Your Personal Brand as an Affiliate',
      excerpt: 'Why authenticity and trust are your biggest assets in affiliate marketing, and how to cultivate both.',
      date: '2026-02-05',
      readTime: '6 min read',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80'
    },
    {
      title: 'The Psychology Behind High-Converting Storefronts',
      excerpt: 'Discover the design principles and psychological triggers that make visitors click "Buy Now".',
      date: '2026-01-28',
      readTime: '10 min read',
      category: 'Conversion',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80'
    },
    {
      title: 'How to Choose the Right Apps for Your Audience',
      excerpt: 'A framework for selecting products that resonate with your followers and drive maximum conversions.',
      date: '2026-01-22',
      readTime: '7 min read',
      category: 'Product Selection',
      image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
    },
    {
      title: 'Traffic Sources That Actually Work in 2026',
      excerpt: 'Forget outdated tactics. These are the traffic channels driving real results for affiliate marketers today.',
      date: '2026-01-15',
      readTime: '9 min read',
      category: 'Traffic',
      image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&q=80'
    },
    {
      title: 'Case Study: From Zero to $10K/Month in 90 Days',
      excerpt: 'Real story from an ELVT Social affiliate who built a thriving business from scratch.',
      date: '2026-01-08',
      readTime: '12 min read',
      category: 'Case Study',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen elvt-gradient">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gradient">
            Blog & Insights
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Expert strategies, case studies, and actionable tips to grow your affiliate business
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="elvt-glass rounded-3xl overflow-hidden mb-16"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-[4/3] md:aspect-auto overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
              <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:py-12 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 w-fit" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                {posts[0].category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{posts[0].title}</h2>
              <p className="mb-6 text-lg" style={{ color: 'var(--text-secondary)' }}>{posts[0].excerpt}</p>
              <div className="flex items-center gap-6 mb-6" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(posts[0].date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {posts[0].readTime}
                </span>
              </div>
              <Button className="w-fit gap-2" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                Read Article
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx + 1) * 0.1 }}
              whileHover={{ y: -8 }}
              className="elvt-glass rounded-2xl overflow-hidden cursor-pointer group hover:elvt-glow transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent)' }}>
                  {post.category}
                </span>
                <h3 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" variant="outline" className="px-10" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            Load More Articles
          </Button>
        </motion.div>
      </div>
    </div>
  );
}