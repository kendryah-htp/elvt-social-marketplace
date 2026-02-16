import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function SocialProofFeed() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch recent purchases
    base44.entities.Purchase.filter({ payment_status: 'completed' }, '-created_date', 8)
      .then(purchases => {
        setNotifications(
          purchases.map(p => ({
            id: p.id,
            text: `${p.buyer_name || 'Someone'} just purchased ${p.product_name || 'an app'}`,
            timestamp: p.created_date
          }))
        );
      });

    // Subscribe to new purchases
    const unsubscribe = base44.entities.Purchase.subscribe(event => {
      if (event.type === 'create' && event.data.payment_status === 'completed') {
        setNotifications(prev => [
          {
            id: event.id,
            text: `${event.data.buyer_name || 'Someone'} just purchased ${event.data.product_name || 'an app'}`,
            timestamp: event.data.created_date
          },
          ...prev
        ].slice(0, 8));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-24 right-6 z-40 pointer-events-none">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(139, 92, 246, 0.6); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 1); }
        }
        .social-pill {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 1).map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            transition={{ duration: 0.4 }}
            className="px-4 py-2 rounded-full border pointer-events-auto relative social-pill"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--accent)',
              borderWidth: '2px'
            }}
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <p className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                {notif.text.split(' ').slice(0, 3).join(' ')}...
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}