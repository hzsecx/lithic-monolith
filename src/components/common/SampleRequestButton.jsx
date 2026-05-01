import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function SampleRequestButton() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link
        to="/contact"
        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm font-medium tracking-wide"
      >
        <Package className="w-4 h-4" />
        <span className="hidden sm:inline">Request Sample</span>
      </Link>
    </motion.div>
  );
}