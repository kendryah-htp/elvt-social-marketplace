import React from 'react';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function LaunchChecklist() {
  const checks = [
    {
      category: 'Navigation & Links',
      items: [
        { name: 'Home → All nav links functional', status: '✓' },
        { name: 'AppCatalog → Filters & search working', status: '✓' },
        { name: 'AppDetail → Redirects to correct checkout', status: '✓' },
        { name: 'Join → Creates affiliate profile', status: '✓' },
        { name: 'Onboarding → 3-step wizard completes', status: '✓' },
        { name: 'AffiliateDashboard → Profile loads correctly', status: '✓' },
        { name: 'Storefront → Public shareable link works', status: '✓' },
        { name: 'PurchaseFlow → Payment integrates', status: '⚠' }
      ]
    },
    {
      category: 'Affiliate Journey',
      items: [
        { name: 'Signup → Email validated', status: '✓' },
        { name: 'Profile creation → Data saved to DB', status: '✓' },
        { name: 'Theme selection → Persists on storefront', status: '✓' },
        { name: 'App selection → Correct items displayed', status: '✓' },
        { name: 'Social links → Optional field handling', status: '✓' },
        { name: 'Storefront URL → Unique slug generated', status: '✓' },
        { name: 'Earnings tracking → Real-time updates', status: '⚠' },
        { name: 'Payout system → 7-day schedule active', status: '⚠' }
      ]
    },
    {
      category: 'Buyer Journey',
      items: [
        { name: 'Browse apps → Full catalog loads', status: '✓' },
        { name: 'App detail → Demo & info accessible', status: '✓' },
        { name: 'Add to cart → Select quantity', status: '⚠' },
        { name: 'Checkout → Form validation works', status: '✓' },
        { name: 'Payment → Stripe integration active', status: '⚠' },
        { name: 'Confirmation email → Sent immediately', status: '⚠' },
        { name: 'Access provided → Auto-grant product access', status: '⚠' },
        { name: 'Affiliate credit → Commission recorded', status: '✓' }
      ]
    },
    {
      category: 'Admin Features',
      items: [
        { name: 'AdminPanel → Access control enforced', status: '✓' },
        { name: 'User management → Onboarding flow works', status: '✓' },
        { name: 'App marketplace → CRUD operations', status: '✓' },
        { name: 'Resources → FAQs & guides manager', status: '✓' },
        { name: 'Email templates → Customizable', status: '✓' },
        { name: 'Analytics dashboard → Real-time metrics', status: '⚠' },
        { name: 'Settings → Theme & branding options', status: '✓' },
        { name: 'Affiliate management → Earnings visibility', status: '⚠' }
      ]
    },
    {
      category: 'Error Handling & UX',
      items: [
        { name: 'Loading states → All async ops show spinner', status: '⚠' },
        { name: 'Error messages → User-friendly copy', status: '✓' },
        { name: '404 page → Branded & helpful', status: '✓' },
        { name: 'Network timeouts → Graceful degradation', status: '⚠' },
        { name: 'Form validation → Real-time feedback', status: '✓' },
        { name: 'Mobile responsive → All devices tested', status: '⚠' },
        { name: 'Accessibility → WCAG AA compliant', status: '⚠' },
        { name: 'Performance → Lighthouse 80+', status: '⚠' }
      ]
    }
  ];

  const stats = {
    '✓': 'Ready',
    '⚠': 'Needs Review'
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Launch Readiness Checklist</h2>
        <div className="flex gap-4 text-sm">
          {Object.entries(stats).map(([icon, label]) => (
            <div key={icon} className="flex items-center gap-1">
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {checks.map((section, idx) => (
        <div key={idx}>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">{section.category}</h3>
          <div className="grid gap-2">
            {section.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                <span className="text-gray-700">{item.name}</span>
                <span className={`font-semibold ${item.status === '✓' ? 'text-green-600' : 'text-orange-600'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}