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
      className="min-h-screen pt-20 flex items-center justify-center px-6"
      style={{ backgroundColor: '#FAFAFA' }}
    >
      <div className="max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="w-20 md:w-24 h-20 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl" style={{ backgroundColor: '#10B981' }}>
            <Check className="w-10 md:w-12 h-10 md:h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4" style={{ 
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Payment Successful!</h1>
          <p className="text-base md:text-xl" style={{ color: '#2E2E42' }}>
            Your purchase is confirmed. Access details have been sent to your email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-8 md:p-12 mb-8 border shadow-xl" style={{ 
            backgroundColor: 'white',
            borderColor: 'rgba(139, 92, 246, 0.15)'
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#1A1A2E' }}>What's Next?</h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#7C3AED', color: 'white' }}>
                1
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A1A2E' }}>Check Your Email</h3>
                <p style={{ color: '#2E2E42' }}>We've sent access details and login information to your inbox (check spam if needed)</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#7C3AED', color: 'white' }}>
                2
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A1A2E' }}>Get Started</h3>
                <p style={{ color: '#2E2E42' }}>Follow the setup instructions in the email to begin using {appName}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: '#7C3AED', color: 'white' }}>
                3
              </div>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: '#1A1A2E' }}>Need Help?</h3>
                <p style={{ color: '#2E2E42' }}>Reply to our email or visit our support center for tutorials and FAQs</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          <Link to={createPageUrl('AppCatalog')} className="w-full">
            <Button className="w-full font-semibold text-white py-6 shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
              Explore More Apps
            </Button>
          </Link>
          <Link to={createPageUrl('Join')} className="w-full">
            <Button variant="outline" className="w-full font-semibold py-6" style={{ borderColor: '#7C3AED', color: '#7C3AED' }}>
              Earn as an Affiliate
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}