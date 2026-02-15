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
    <div className="fixed bottom-24 right-6 z-40 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.slice(0, 3).map((notif, idx) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 400 }}
            transition={{ duration: 0.3 }}
            className="mb-3 p-3 rounded-lg border pointer-events-auto"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--accent)',
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {notif.text}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}