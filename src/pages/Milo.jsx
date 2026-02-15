import React from 'react';
import { motion } from 'framer-motion';
import MiloChat from '@/components/MiloChat';

export default function Milo() {
  return (
    <div className="min-h-screen elvt-gradient flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b p-6" style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gradient">MILO Strategy Engine</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="mt-1">
            Build high-converting SaaS strategies. No fluff. Architecture-first thinking.
          </p>
        </div>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full elvt-glass rounded-2xl overflow-hidden flex flex-col border" style={{ borderColor: 'var(--border)' }}
        >
          <MiloChat />
        </motion.div>
      </div>
    </div>
  );
}