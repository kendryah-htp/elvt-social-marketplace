import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Code2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const codeExamples = [
  {
    title: 'Basic iFrame Embed',
    language: 'html',
    code: `<iframe 
  src="https://market.htpelevate.com/Milo" 
  width="100%" 
  height="600" 
  frameborder="0"
  allow="clipboard-read; clipboard-write"
></iframe>`
  },
  {
    title: 'React Component Embed',
    language: 'jsx',
    code: `import { Iframe } from 'react-iframe';

export default function MyApp() {
  return (
    <Iframe
      url="https://market.htpelevate.com/ContentStudio"
      width="100%"
      height="600px"
      id="myIframe"
      allow="clipboard-read; clipboard-write"
    />
  );
}`
  },
  {
    title: 'API Integration (Coming Soon)',
    language: 'javascript',
    code: `// Access ELVT API programmatically
const response = await fetch('https://api.market.htpelevate.com/v1/prompts', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();`
  }
];

export default function EmbedGuide() {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen elvt-gradient pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gradient mb-2">Embed & Integration Guide</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
            Integrate ELVT Content Studio into your app, GHL agency, or custom SaaS solution
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Overview */}
          <div className="elvt-glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-gradient">Getting Started</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-4">
              ELVT Content Studio can be embedded in any web application using iFrame, integrated into React apps, or accessed via API.
            </p>
            <div className="space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Base URL:</strong> https://market.htpelevate.com
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Authentication:</strong> User must be logged in to their ELVT account
              </p>
              <p style={{ color: 'var(--text-secondary)' }}>
                <strong>Subscription:</strong> Content Studio requires active subscription ($17.99/month)
              </p>
            </div>
          </div>

          {/* Code Examples */}
          {codeExamples.map((example, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + idx * 0.05 }}
              className="elvt-glass rounded-2xl p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {example.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {example.language}
                  </p>
                </div>
                <Code2 className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>

              <div className="bg-black rounded-lg p-4 mb-4 font-mono text-sm overflow-x-auto">
                <pre style={{ color: '#10b981' }}>{example.code}</pre>
              </div>

              <Button
                onClick={() => copyToClipboard(example.code)}
                className="w-full text-white !text-inherit font-semibold"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </motion.div>
          ))}

          {/* Features & Limitations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="elvt-glass rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-gradient">What's Included</h3>
              <ul style={{ color: 'var(--text-secondary)' }} className="space-y-2">
                <li>✓ Full Content Studio access</li>
                <li>✓ Prompt library & templates</li>
                <li>✓ Real-time collaboration</li>
                <li>✓ Analytics & tracking</li>
                <li>✓ Priority email support</li>
              </ul>
            </div>

            <div className="elvt-glass rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4 text-gradient">Requirements</h3>
              <ul style={{ color: 'var(--text-secondary)' }} className="space-y-2">
                <li>✓ HTTPS enabled</li>
                <li>✓ Modern browser (Chrome, Firefox, Safari)</li>
                <li>✓ User authentication via ELVT</li>
                <li>✓ Active subscription</li>
                <li>✓ Iframe permissions enabled</li>
              </ul>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="elvt-glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Need Help?
            </h3>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              Have questions about integration? Contact our support team or check the documentation.
            </p>
            <Button
              className="text-white !text-inherit font-semibold"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Documentation
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}