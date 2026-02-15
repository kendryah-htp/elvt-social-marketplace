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
    
    if (!stripe || !elements || !buyerInfo.name || !buyerInfo.email) {
      setError('Please fill in all fields');
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

      // Create payment intent via Stripe integration
      const { data: paymentIntent } = await base44.integrations.Stripe.CreatePaymentIntent({
        amount: Math.round(app.price * 100),
        currency: 'usd',
        payment_method: paymentMethod.id,
        confirm: true,
        automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
        metadata: {
          app_id: app.id,
          buyer_email: buyerInfo.email,
          affiliate_slug: affiliateSlug || ''
        }
      });

      if (paymentIntent.status === 'succeeded') {
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
          // Purchase recorded but email may have failed - still redirect to success
          console.warn('Purchase completion error:', completionError);
          navigate(createPageUrl('PurchaseSuccess') + '?app=' + encodeURIComponent(app.name));
        }
      } else if (paymentIntent.status === 'requires_action') {
        setError('Please complete the additional verification step.');
      } else {
        setError(`Payment failed (${paymentIntent.status}). ${retryCount < 2 ? 'Please try again.' : 'Contact support if this persists.'}`);
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
        <Label className="text-[#F5F0EB]">Full Name</Label>
        <Input
          value={buyerInfo.name}
          onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
          placeholder="John Doe"
          className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB]"
          required
        />
      </div>

      <div>
        <Label className="text-[#F5F0EB]">Email Address</Label>
        <Input
          type="email"
          value={buyerInfo.email}
          onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
          placeholder="john@example.com"
          className="bg-[#1A1A1A] border-[#D4AF37]/20 text-[#F5F0EB]"
          required
        />
      </div>

      <div className="border-t border-[#D4AF37]/20 pt-6">
        <Label className="text-[#F5F0EB] mb-4 block">Card Details</Label>
        <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#F5F0EB',
                  '::placeholder': { color: '#E5E0DB' }
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
          className="w-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0A0A0A] font-bold py-6 text-lg"
        >
          {processing ? (
            <>
              <div className="inline-block w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin mr-2" />
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
            className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-semibold"
          >
            Try Again
          </Button>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-[#E5E0DB]">
        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
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
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#E5E0DB] font-semibold">Loading checkout...</p>
        </motion.div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen elvt-gradient flex items-center justify-center">
        <p className="text-[#E5E0DB]">App not found</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen elvt-gradient py-12">
        <div className="max-w-5xl mx-auto px-6">
        <Link to={createPageUrl('AppDetail') + '?id=' + appId}>
          <Button variant="ghost" className="text-[#D4AF37] hover:text-[#E5C158] mb-8">
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
            <Card className="elvt-glass p-6 max-sm:p-4">
              <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6 max-sm:text-xl">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {app.thumbnail_url && (
                  <img
                    src={app.thumbnail_url}
                    alt={app.name}
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                )}
                
                <div>
                  <h3 className="text-xl font-semibold text-[#F5F0EB]">{app.name}</h3>
                  <p className="text-[#E5E0DB] text-sm mt-1">{app.short_description}</p>
                </div>
              </div>

              <div className="border-t border-[#D4AF37]/20 pt-6 space-y-3">
                <div className="flex justify-between text-[#E5E0DB]">
                  <span>Price</span>
                  <span className="font-semibold">${app.price}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-[#D4AF37] pt-3 border-t border-[#D4AF37]/20">
                  <span>Total</span>
                  <span>${app.price}</span>
                </div>
              </div>

              {affiliate && (
                <div className="mt-6 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-4">
                  <p className="text-sm text-[#E5E0DB] text-center">
                    Supporting: <span className="font-semibold text-[#D4AF37]">{affiliate.full_name}</span>
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
            <Card className="elvt-glass p-6 max-sm:p-4">
              <h2 className="text-2xl font-bold text-[#F5F0EB] mb-6 flex items-center gap-2 max-sm:text-xl">
                <CreditCard className="w-6 h-6 text-[#D4AF37]" />
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
                <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-lg p-6 text-center">
                  <CreditCard className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                  <p className="text-[#E5E0DB] font-semibold mb-2">Payment Setup Required</p>
                  <p className="text-sm text-[#E5E0DB]/80">
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