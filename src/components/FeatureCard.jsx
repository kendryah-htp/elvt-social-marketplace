import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, desc, index, hoverEffect = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={hoverEffect ? { y: -4 } : {}}
      className="elvt-glass rounded-xl p-6 card-hover"
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <Icon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </motion.div>
  );
}