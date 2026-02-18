import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ErrorBoundary from '@/components/ErrorBoundary';
import { trackConversion } from '@/components/AnalyticsTracker';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutForm({ app, affiliateSlug, buyerInfo, setBuyerInfo }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh and try again.');
      trackConversion('checkout_error', { error_type: 'stripe_not_ready' });
      return;
    }

    // Validate inputs
    if (!buyerInfo.name?.trim()) {
      setError('Please enter your full name');
      trackConversion('checkout_error', { error_type: 'missing_name' });
      return;
    }

    if (buyerInfo.name.trim().length < 2) {
      setError('Please enter your complete name');
      trackConversion('checkout_error', { error_type: 'invalid_name' });
      return;
    }

    if (!buyerInfo.email?.trim() || !buyerInfo.email.includes('@') || !buyerInfo.email.includes('.')) {
      setError('Please enter a valid email address');
      trackConversion('checkout_error', { error_type: 'invalid_email' });
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: buyerInfo.name,
          email: buyerInfo.email
        }
      });

      if (cardError) {
        setError(cardError.message);
        setProcessing(false);
        return;
      }

      // Create payment intent via backend function
      const { data: paymentIntent } = await base44.functions.invoke('createPaymentIntent', {
        amount: Math.round(app.price * 100),
        currency: 'usd',
        payment_method: paymentMethod.id,
        metadata: {
          app_id: app.id,
          buyer_email: buyerInfo.email,
          affiliate_slug: affiliateSlug || ''
        }
      });

      if (paymentIntent.status === 'succeeded') {
        trackConversion('purchase_completed', { 
          app_id: app.id, 
          amount: app.price,
          affiliate_slug: affiliateSlug || 'direct'
        });
        
        // Complete purchase and trigger emails
        try {
          await base44.functions.invoke('completePurchase', {
            app_id: app.id,
            buyer_name: buyerInfo.name,
            buyer_email: buyerInfo.email,
            affiliate_slug: affiliateSlug,
            payment_id: paymentIntent.id
          });

          navigate(createPageUrl('PurchaseSuccess') + '?app=' + encodeURIComponent(app.name));
        } catch (completionError) {
          console.warn('Purchase completion error:', completionError);
          navigate(createPageUrl('PurchaseSuccess') + '?app=' + encodeURIComponent(app.name));
        }
      } else if (paymentIntent.status === 'requires_action') {
        setError('Please complete the additional verification step with your bank.');
        setRetryCount(Math.min(retryCount + 1, 2));
      } else if (paymentIntent.status === 'requires_payment_method') {
        setError('Payment method was declined. Please try a different card.');
        setRetryCount(Math.min(retryCount + 1, 2));
      } else {
        setError(`Payment failed. ${retryCount < 2 ? 'Please try again or use a different card.' : 'Contact support if this persists.'}`);
        setRetryCount(Math.min(retryCount + 1, 2));
      }
    } catch (err) {
      setError(err.message || 'Payment processing error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label style={{ color: '#1A1A2E' }}>Full Name</Label>
        <Input
          value={buyerInfo.name}
          onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
          placeholder="John Doe"
          style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
          required
        />
      </div>

      <div>
        <Label style={{ color: '#1A1A2E' }}>Email Address</Label>
        <Input
          type="email"
          value={buyerInfo.email}
          onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
          placeholder="john@example.com"
          style={{ backgroundColor: '#F8F7FF', borderColor: 'rgba(139, 92, 246, 0.2)', color: '#1A1A2E' }}
          required
        />
      </div>

      <div className="border-t pt-6" style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}>
        <Label className="mb-4 block" style={{ color: '#1A1A2E' }}>Card Details</Label>
        <div className="border rounded-lg p-4 shadow-sm" style={{ 
          backgroundColor: '#F8F7FF',
          borderColor: 'rgba(139, 92, 246, 0.2)'
        }}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1A1A2E',
                  '::placeholder': { color: '#6B6B80' }
                }
              }
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          size="lg"
          disabled={!stripe || processing}
          className="w-full font-bold py-6 text-lg text-white shadow-lg"
          style={{ backgroundColor: '#7C3AED' }}
        >
          {processing ? (
            <>
              <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing Payment...
            </>
          ) : `Pay $${app.price}`}
        </Button>
        
        {error && retryCount < 2 && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              setError(null);
              setRetryCount(retryCount + 1);
            }}
            className="w-full font-semibold"
            style={{ borderColor: '#7C3AED', color: '#7C3AED' }}
          >
            Try Again
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#6B6B80' }}>
        <ShieldCheck className="w-4 h-4" style={{ color: '#7C3AED' }} />
        <span>Secure checkout powered by Stripe</span>
      </div>
    </form>
  );
}

export default function PurchaseFlow() {
  const urlParams = new URLSearchParams(window.location.search);
  const appId = urlParams.get('appId');
  const ref = urlParams.get('ref');
  
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: ''
  });

  const { data: app, isLoading: appLoading } = useQuery({
    queryKey: ['app-purchase', appId],
    queryFn: async () => {
      const apps = await base44.entities.App.filter({ id: appId });
      return apps[0];
    },
    enabled: !!appId
  });

  const { data: affiliate } = useQuery({
    queryKey: ['affiliate-ref', ref],
    queryFn: async () => {
      const affiliates = await base44.entities.AffiliateProfile.filter({ slug: ref });
      return affiliates[0];
    },
    enabled: !!ref
  });

  if (appLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-transparent rounded-full mx-auto mb-4"
            style={{ borderColor: '#7C3AED', borderTopColor: 'transparent' }}
          />
          <p className="font-semibold" style={{ color: '#2E2E42' }}>Loading checkout...</p>
        </div>
      </motion.div>
    );
  }

  if (!app) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="text-center">
          <p className="text-lg mb-6" style={{ color: '#2E2E42' }}>App not found</p>
          <Link to={createPageUrl('AppCatalog')}>
            <Button className="text-white shadow-lg" style={{ backgroundColor: '#7C3AED' }}>
              Browse Apps
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen py-12" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="max-w-5xl mx-auto px-6">
        <Link to={createPageUrl('AppDetail') + '?id=' + appId}>
          <Button variant="ghost" className="mb-8" style={{ color: '#7C3AED' }}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to App
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 max-sm:gap-4">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6 max-sm:p-4 border shadow-lg" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}>
              <h2 className="text-2xl font-bold mb-6 max-sm:text-xl" style={{ color: '#1A1A2E' }}>Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {app.thumbnail_url && (
                  <img
                    src={app.thumbnail_url}
                    alt={app.name}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: '#1A1A2E' }}>{app.name}</h3>
                  <p className="text-sm mt-1" style={{ color: '#6B6B80' }}>{app.short_description}</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-3" style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}>
                <div className="flex justify-between" style={{ color: '#6B6B80' }}>
                  <span>Price</span>
                  <span className="font-semibold">${app.price}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-3 border-t" style={{ 
                  color: '#7C3AED',
                  borderColor: 'rgba(139, 92, 246, 0.15)'
                }}>
                  <span>Total</span>
                  <span>${app.price}</span>
                </div>
              </div>

              {affiliate && (
                <div className="mt-6 rounded-lg p-4 border shadow-sm" style={{ 
                  backgroundColor: '#F0EDFF',
                  borderColor: 'rgba(139, 92, 246, 0.2)'
                }}>
                  <p className="text-sm text-center" style={{ color: '#2E2E42' }}>
                    Supporting: <span className="font-semibold" style={{ color: '#7C3AED' }}>{affiliate.full_name}</span>
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 max-sm:p-4 border shadow-lg" style={{ 
              backgroundColor: 'white',
              borderColor: 'rgba(139, 92, 246, 0.15)'
            }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 max-sm:text-xl" style={{ color: '#1A1A2E' }}>
                <CreditCard className="w-6 h-6" style={{ color: '#7C3AED' }} />
                Complete Purchase
              </h2>
              
              {stripePromise ? (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    app={app} 
                    affiliateSlug={ref}
                    buyerInfo={buyerInfo}
                    setBuyerInfo={setBuyerInfo}
                  />
                </Elements>
              ) : (
                <div className="rounded-lg p-6 text-center border shadow-md" style={{ 
                  backgroundColor: '#FEF3C7',
                  borderColor: '#F59E0B'
                }}>
                  <CreditCard className="w-12 h-12 mx-auto mb-4" style={{ color: '#F59E0B' }} />
                  <p className="font-semibold mb-2" style={{ color: '#78350F' }}>Payment Setup Required</p>
                  <p className="text-sm" style={{ color: '#92400E' }}>
                    Stripe integration is not configured. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}