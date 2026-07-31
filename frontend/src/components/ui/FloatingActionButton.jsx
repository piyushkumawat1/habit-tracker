import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick, icon: Icon = Plus, color = "bg-[hsl(var(--brand))]" }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`fixed right-5 bottom-[calc(80px+env(safe-area-inset-bottom))] md:bottom-10 z-50 w-14 h-14 rounded-full ${color} text-white shadow-[0_8px_30px_rgba(124,58,237,0.4)] flex items-center justify-center`}
    >
      <Icon size={28} strokeWidth={2.5} />
    </motion.button>
  );
}
