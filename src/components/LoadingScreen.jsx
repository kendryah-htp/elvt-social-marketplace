import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen elvt-gradient flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-16 h-16 text-[#D4AF37]" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-[#E5E0DB]"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}