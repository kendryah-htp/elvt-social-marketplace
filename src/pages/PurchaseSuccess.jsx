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
    <div className="min-h-screen elvt-gradient flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-lg"
      >
        <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 elvt-gold-glow">
          <Check className="w-10 h-10 text-[#0A0A0A]" />
        </div>
        <h2 className="text-4xl font-bold text-gradient mb-4">Purchase Complete!</h2>
        <p className="text-[#E5E0DB] text-lg mb-8">
          Check your email for access details to <span className="text-[#D4AF37] font-semibold">{appName}</span>
        </p>
        <div className="space-y-3">
          <Link to={createPageUrl('AppCatalog')}>
            <Button className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-semibold">
              Browse More Apps
            </Button>
          </Link>
          <Link to={createPageUrl('Join')}>
            <Button variant="outline" className="w-full border-[#D4AF37] text-[#D4AF37]">
              Become an Affiliate
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}