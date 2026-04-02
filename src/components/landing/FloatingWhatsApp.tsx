import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingWhatsApp() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 20, stiffness: 260 }}
      className="fixed bottom-6 right-4 lg:right-6 z-50"
    >
      <a
        href="https://wa.me/5511920470829"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => {
          e.stopPropagation();
          window.open('https://wa.me/5511920470829', '_blank');
        }}
      >
        <Button
          type="button"
          className="w-14 h-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#1ebe57] hover:scale-110 transition-transform pointer-events-none"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </a>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]/30 -z-10"
        animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Badge */}
      <div className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white bg-[#25D366] rounded-full shadow-lg">
        Suporte
      </div>
    </motion.div>
  );
}
