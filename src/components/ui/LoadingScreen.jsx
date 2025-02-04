// src/components/ui/LoadingScreen.jsx
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Chargement..." }) => {
  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-screen flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {/* Cercle de chargement rose/violet */}
          <div className="w-16 h-16 mb-4">
            <svg className="w-full h-full" viewBox="0 0 50 50">
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Message de chargement animé */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
          >
            {message}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;