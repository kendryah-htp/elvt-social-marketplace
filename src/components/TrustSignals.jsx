import { motion } from 'framer-motion';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustSignals() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-8"
      >
        {/* Payment Methods */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>SECURE PAYMENTS</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="w-12 h-8 rounded bg-white flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-blue-600">STRIPE</span>
            </div>
            <div className="w-12 h-8 rounded bg-white flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-blue-500">VISA</span>
            </div>
            <div className="w-12 h-8 rounded bg-white flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-red-500">MC</span>
            </div>
            <div className="w-12 h-8 rounded bg-white flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-blue-700">AMEX</span>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>All major cards accepted</p>
        </motion.div>

        {/* Founder Credentials */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>BUILT BY FOUNDERS</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>3x SaaS Entrepreneurs</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>$50M+ in GMV built</p>
        </motion.div>

        {/* Security & Data */}
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>ENTERPRISE SECURITY</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Lock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>SOC 2</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>GDPR</span>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>Your data is protected</p>
        </motion.div>
      </motion.div>

      {/* Partners Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-16 pt-12 text-center border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-sm font-semibold mb-6" style={{ color: 'var(--text-muted)' }}>TRUSTED INTEGRATIONS & PARTNERS</p>
        <div className="flex items-center justify-center gap-8 flex-wrap opacity-70">
          {/* GoHighLevel */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#00D4FF' }}>
              GHL
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>GoHighLevel</span>
          </div>

          {/* Stripe */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#635BFF' }}>
              S
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Stripe</span>
          </div>

          {/* Base44 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
              B44
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Base44 Platform</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}