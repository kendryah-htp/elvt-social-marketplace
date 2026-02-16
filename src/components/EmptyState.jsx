import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  actionLabel,
  secondaryAction,
  secondaryActionLabel
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="elvt-glass p-8 md:p-12 text-center">
        {Icon && (
          <div className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 md:mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
            <Icon className="w-6 md:w-8 h-6 md:h-8" style={{ color: 'var(--accent)' }} />
          </div>
        )}
        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-sm md:text-base mb-4 md:mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {action && actionLabel && (
              <Button 
                onClick={action}
                className="font-semibold h-11 md:h-12"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                {actionLabel}
              </Button>
            )}
            {secondaryAction && secondaryActionLabel && (
              <Button 
                onClick={secondaryAction}
                variant="outline"
                className="h-11 md:h-12"
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}