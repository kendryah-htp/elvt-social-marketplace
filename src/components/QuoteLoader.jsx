import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  { text: "Excellence is not a destination, it's a continuous journey.", author: "Kendryah Smith" },
  { text: "Your network is your net worth. Build it with intention.", author: "Kendryah Smith" },
  { text: "Success leaves clues. Follow the blueprint.", author: "Kendryah Smith" },
  { text: "The best time to start was yesterday. The second best time is now.", author: "Kendryah Smith" },
  { text: "High ticket requires high value. Deliver beyond expectations.", author: "Kendryah Smith" },
  { text: "Your storefront is your stage. Make every performance count.", author: "Kendryah Smith" },
  { text: "Automation without strategy is just organized chaos.", author: "Kendryah Smith" },
  { text: "Every click is an opportunity. Every conversion is a relationship.", author: "Kendryah Smith" }
];

export default function QuoteLoader({ onComplete }) {
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5 seconds
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]"
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Quote */}
            <blockquote className="mb-8">
              <p className="text-2xl md:text-3xl font-light text-[#F5F0EB] mb-4 leading-relaxed italic">
                "{quote.text}"
              </p>
              <footer className="text-[#D4AF37] font-medium text-lg">
                — {quote.author}
              </footer>
            </blockquote>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#2A2A2A] rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5F0EB]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <p className="text-[#E5E0DB] text-sm">Loading your experience...</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}