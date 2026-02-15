import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function AnalyticsTracker() {
  useEffect(() => {
    // Track page views
    base44.analytics.track({
      eventName: 'page_view',
      properties: { 
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    }).catch(() => {});
  }, []);

  return null;
}

export const trackConversion = (eventName, properties = {}) => {
  base44.analytics.track({
    eventName,
    properties: {
      ...properties,
      timestamp: new Date().toISOString()
    }
  }).catch(() => {});
};