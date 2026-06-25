'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuthStore } from '@/hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const safeOnClose = onClose ?? (() => {});
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleLogin, handleRegister } = useAuthActions();
  const { error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let success = false;
    if (isLogin) {
      success = await handleLogin(email, password);
    } else {
      success = await handleRegister(email, password, name);
    }

    if (success) {
      safeOnClose();

      setEmail('');
      setPassword('');
      setName('');
    }

    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={safeOnClose}

        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative max-w-md w-full mx-4 p-8 rounded-2xl border border-white/10 bg-black/95 shadow-2xl shadow-cyan-500/20"
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 rounded-2xl" />

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-light tracking-[0.1em] text-white uppercase mb-2">
                  {isLogin ? 'Welcome Back' : 'Join Us'}
                </h2>
                <p className="text-xs text-zinc-400 tracking-[0.2em]">
                  {isLogin ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE YOUR Plasma Atelier ACCOUNT'}
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                onClick={safeOnClose}

                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </motion.div>

                {/* Name (Register only) */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all"
                      placeholder="Your Name"
                      required
                    />
                  </motion.div>
                )}

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isLogin ? 0.25 : 0.3 }}
                >
                  <label className="block text-xs font-bold tracking-[0.2em] text-white uppercase mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:bg-cyan-400/5 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-400/50"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isLogin ? 0.35 : 0.4 }}
                >
                  {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                </motion.button>
              </form>

              {/* Toggle Auth Mode */}
              <motion.div
                className="text-center text-sm text-zinc-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isLogin ? 0.4 : 0.45 }}
              >
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </motion.div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-black text-zinc-500">OR</span>
                </div>
              </div>

              {/* OAuth Options */}
              <motion.button
                className="w-full py-2 border border-white/20 text-white font-semibold tracking-widest uppercase rounded-lg hover:border-white/40 hover:bg-white/5 transition-all text-xs"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isLogin ? 0.45 : 0.5 }}
              >
                Continue with Google
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
