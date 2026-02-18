import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, desc, index, hoverEffect = true, isSpecial = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={hoverEffect ? { y: -4 } : {}}
      className="rounded-xl p-6 card-hover border shadow-lg hover:shadow-xl transition-all duration-300" style={{ 
        backgroundColor: 'white',
        borderColor: 'rgba(139, 92, 246, 0.15)'
      }}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F0EDFF' }}>
        {isSpecial ? (
          <img 
            src="https://storage.googleapis.com/msgsndr/2baC3dJ9Apyv9hhVPhn4/media/68e5977fae13a44eb1179e7e.gif"
            alt="MILO"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <Icon className="w-6 h-6" style={{ color: '#7C3AED' }} />
        )}
      </div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>{title}</h3>
      <p className="text-sm" style={{ color: '#2E2E42' }}>{desc}</p>
    </motion.div>
  );
}