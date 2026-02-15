import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PurchaseSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const appName = urlParams.get('app') || 'your app';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen elvt-gradient flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 elvt-glow" style={{ backgroundColor: 'var(--accent)' }}>
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gradient mb-4">Purchase Complete!</h2>
        <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
          Check your email for access details to <span className="font-semibold" style={{ color: 'var(--accent)' }}>{appName}</span>
        </p>
        <div className="space-y-3">
          <Link to={createPageUrl('AppCatalog')}>
            <Button className="w-full font-semibold text-white" style={{ backgroundColor: 'var(--accent)' }}>
              Browse More Apps
            </Button>
          </Link>
          <Link to={createPageUrl('Join')}>
            <Button variant="outline" className="w-full" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Become an Affiliate
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}