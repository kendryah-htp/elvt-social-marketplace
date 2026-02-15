import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { getFeatureLockMessage } from '@/utils/subscriptionUtils';

export default function FeatureLock({ feature, children, showLock = true }) {
  const message = getFeatureLockMessage(feature);

  if (!showLock) {
    return children;
  }

  return (
    <div className="relative group/lock">
      <div className="opacity-50 pointer-events-none blur-sm">
        {children}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="elvt-glass rounded-lg p-6 text-center max-w-sm border" style={{ borderColor: 'var(--border)' }}>
          <Lock className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent)' }} />
          <p className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Feature Locked</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{message}</p>
          <Link to={createPageUrl('Pricing')}>
            <Button size="sm" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
              View Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}