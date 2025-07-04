
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scanner from './Scanner';



const Index = () => {
  const [showScanner, setShowScanner] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleAccessGranted = () => {
    setShowScanner(false);
    setTimeout(() => {
      setShowPortfolio(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <AnimatePresence mode="wait">
        {showScanner && (
          <Scanner onAccessGranted={handleAccessGranted} />
        )}
        
        {showPortfolio && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className='text-red-300 text-9xl'>WELCOME</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
