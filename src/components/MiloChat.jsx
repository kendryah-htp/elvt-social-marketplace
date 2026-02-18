import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

export default function MiloChat() {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const initChat = async () => {
      try {
        const user = await base44.auth.me();
        if (!user) {
          base44.auth.redirectToLogin();
          return;
        }

        const newConversation = await base44.agents.createConversation({
          agent_name: 'milo',
          metadata: {
            name: `Chat with MILO - ${new Date().toLocaleDateString()}`,
            user_email: user.email
          }
        });

        setConversation(newConversation);
        setMessages(newConversation.messages || []);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      }
    };

    initChat();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!conversation?.id) return;

    const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (updatedConversation) => {
      setMessages(updatedConversation.messages || []);
    });

    return unsubscribe;
  }, [conversation?.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversation || loading) return;

    setLoading(true);
    setIsTyping(true);
    
    // Simulate human-like delay before MILO starts responding
    setTimeout(() => {
      setIsTyping(false);
    }, 800 + Math.random() * 400);

    try {
      await base44.agents.addMessage(conversation, {
        role: 'user',
        content: input
      });
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center"
            >
              <img 
                src="https://storage.googleapis.com/msgsndr/2baC3dJ9Apyv9hhVPhn4/media/68e5977fae13a44eb1179e7e.gif"
                alt="MILO"
                className="w-24 h-24 rounded-full mb-6 object-cover shadow-xl"
              />
              <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>MILO</h3>
              <p style={{ color: 'var(--text-secondary)' }} className="max-w-md text-sm">
                Your AI strategist. No fluff. Architecture-first thinking. I help you build and scale with precision.
              </p>
              <div className="mt-6 space-y-2">
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">Try asking:</p>
                <div className="text-sm space-y-1" style={{ color: 'var(--accent)' }}>
                  <p>• Help me build a go-to-market strategy</p>
                  <p>• What's the real problem I'm solving?</p>
                  <p>• How do I position this product?</p>
                </div>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.role !== 'user' && (
                  <img 
                    src="https://storage.googleapis.com/msgsndr/2baC3dJ9Apyv9hhVPhn4/media/68e5977fae13a44eb1179e7e.gif"
                    alt="MILO"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                  />
                )}
                <div
                  className="max-w-xs lg:max-w-md rounded-xl px-4 py-3 shadow-md"
                  style={{
                    backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-tertiary)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {msg.role === 'user' ? (
                    <p className="text-sm">{msg.content}</p>
                  ) : (
                    <div className="text-sm prose prose-invert prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_a]:text-blue-400 [&_a]:underline">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          code: ({ children }) => <code style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '2px 4px', borderRadius: '3px' }}>{children}</code>
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
          {(loading || isTyping) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start items-center gap-3"
            >
              <img 
                src="https://storage.googleapis.com/msgsndr/2baC3dJ9Apyv9hhVPhn4/media/68e5977fae13a44eb1179e7e.gif"
                alt="MILO"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="rounded-lg px-4 py-3 flex items-center gap-2" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <div className="flex gap-1">
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MILO anything..."
            disabled={loading}
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)'
            }}
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}