import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/5511920470829';

export function FloatingWhatsApp() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', damping: 20, stiffness: 260 }}
      className="fixed bottom-6 right-4 lg:right-6 z-50"
      style={{ marginBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl bg-[#25D366] hover:bg-[#1ebe57] hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />

        {/* Badge */}
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white bg-[#25D366] rounded-full shadow-lg">
          Suporte
        </span>
      </a>

      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]/30 -z-10 pointer-events-none"
        animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
