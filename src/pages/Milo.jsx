import React from 'react';
import { motion } from 'framer-motion';
import MiloChat from '@/components/MiloChat';

export default function Milo() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b p-4 md:p-6 shadow-sm" style={{ 
          backgroundColor: 'white',
          borderColor: 'rgba(139, 92, 246, 0.15)'
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>MILO Strategy Engine</h1>
          <p style={{ color: '#6B6B80' }} className="mt-1 text-sm md:text-base">
            Build high-converting SaaS strategies. No fluff. Architecture-first thinking.
          </p>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-3 md:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full rounded-xl md:rounded-2xl overflow-hidden flex flex-col border shadow-xl" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}
        >
          <MiloChat />
        </motion.div>
      </div>
    </div>
  );
}