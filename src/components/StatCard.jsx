import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ stat, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="elvt-glass rounded-xl p-6"
    >
      <div className="text-4xl font-black mb-2 text-gradient">{stat}</div>
      <p style={{ color: 'var(--text-secondary)' }}>{label}</p>
    </motion.div>
  );
}