import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="elvt-glass p-12 text-center">
        {Icon && (
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-[#D4AF37]" />
          </div>
        )}
        <h3 className="text-2xl font-bold text-[#F5F0EB] mb-3">{title}</h3>
        <p className="text-[#E5E0DB] mb-6 max-w-md mx-auto">{description}</p>
        {action && actionLabel && (
          <Button 
            onClick={action}
            className="bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A]"
          >
            {actionLabel}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}