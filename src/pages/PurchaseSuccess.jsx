import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PurchaseSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const appName = urlParams.get('app') || 'your purchase';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen elvt-gradient pt-20 flex items-center justify-center px-6"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 elvt-glow" style={{ backgroundColor: 'var(--accent)' }}>
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-4">Payment Successful!</h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            Your purchase is confirmed. Access details have been sent to your email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="elvt-glass rounded-2xl p-8 md:p-12 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>What's Next?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Check Your Email</h3>
                <p style={{ color: 'var(--text-secondary)' }}>We've sent access details and login information to your inbox (check spam if needed)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Get Started</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Follow the setup instructions in the email to begin using {appName}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Need Help?</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Reply to our email or visit our support center for tutorials and FAQs</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl('AppCatalog')} className="w-full">
            <Button className="w-full font-semibold text-white py-6" style={{ backgroundColor: 'var(--accent)' }}>
              Explore More Apps
            </Button>
          </Link>
          <Link to={createPageUrl('Join')} className="w-full">
            <Button variant="outline" className="w-full font-semibold py-6" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Earn as an Affiliate
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}