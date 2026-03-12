import React from 'react';
import ChatContainer from './components/Chat/ChatContainer';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-hospital-200 selection:text-hospital-900 bg-hospital-50 flex flex-col items-center justify-center p-4 md:p-8 xl:p-12 transition-all">
      {/* Background blobs for a friendly, hospital-appropriate aesthetic */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none transition-all duration-1000">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[50%] bg-pink-50 rounded-full blur-[120px] opacity-40 animate-pulse [animation-delay:-2s]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-yellow-50 rounded-full blur-[100px] opacity-30 animate-pulse [animation-delay:-4s]" />
      </div>

      <main className="w-full max-w-4xl relative z-10 h-[85vh] transition-all">
        {/* Entrance animation for the container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1
          }}
          className="h-full rounded-[2.5rem] p-1.5 bg-gradient-to-br from-white/60 to-white/20 backdrop-blur-md shadow-2xl border border-white/40"
        >
          <ChatContainer />
        </motion.div>
      </main>

      {/* Footer / Safety Disclaimer with premium typography */}
      <footer className="mt-8 relative z-10 text-center px-4 max-w-2xl mx-auto flex flex-col space-y-2 opacity-70 hover:opacity-100 transition-opacity">
        <p className="text-[11px] font-bold text-hospital-400 uppercase tracking-[0.2em] leading-relaxed">
          Healthcare Information Disclaimer
        </p>
        <p className="text-[12px] font-medium text-hospital-600/80 leading-relaxed max-w-lg">
          This assistant provides information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician.
        </p>
        <div className="flex items-center justify-center space-x-6 pt-4">
          <div className="flex items-center space-x-2 grayscale opacity-60">
            <div className="w-5 h-5 bg-hospital-500 rounded-lg flex items-center justify-center text-[10px] text-white font-bold">H</div>
            <span className="text-[10px] font-extrabold text-hospital-800 tracking-tighter">Verified Provider</span>
          </div>
          <div className="flex items-center space-x-2 grayscale opacity-40">
            <span className="text-[11px] font-bold text-hospital-800 tracking-wider">HIPAA SECURE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
