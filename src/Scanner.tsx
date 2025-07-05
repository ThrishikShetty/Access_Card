
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ScannerProps {
  onAccessGranted: () => void;
}

const Scanner = ({ onAccessGranted }: ScannerProps) => {
  const [scanStage, setScanStage] = useState<'waiting' | 'dragging' | 'inserted' | 'scanning' | 'granted'>('waiting');
  const [cardPosition, setCardPosition] = useState({ x: -104, y: -300 });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    setScanStage('dragging');
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    setIsDragging(false);
    
    // Get slot position (approximate center of the slot)
    const slotCenterX = window.innerWidth / 2;
    const slotCenterY = window.innerHeight / 2 + 40;
    
    // Check if card overlaps with slot area (more lenient detection)
    const cardCenterX = info.point.x;
    const cardCenterY = info.point.y;
    
    // Check if card is roughly in the slot area
    const isInSlotArea = Math.abs(cardCenterX - slotCenterX) < 150 && 
                         Math.abs(cardCenterY - slotCenterY) < 100;

    if (isInSlotArea && scanStage === 'dragging') {
      // Automatically snap card into slot position
      setCardPosition({ x: -104, y: -16 });
      setScanStage('inserted');
      
      // Start scanning immediately
      setTimeout(() => {
        setScanStage('scanning');
      }, 300);

      // Grant access after scanning
      setTimeout(() => {
        setScanStage('granted');
      }, 1500);

      // Move to website
      setTimeout(() => {
        onAccessGranted();
      }, 3000);
    } else {
      // Return card to original position
      setCardPosition({ x: -104, y: -300 });
      setScanStage('waiting');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 flex items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Instructions */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
        <motion.div
          className="text-blue-300 font-mono text-xl mb-4 font-bold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {scanStage === 'waiting' && "⬇ DRAG ID CARD TO SCANNER BELOW ⬇"}
          {scanStage === 'dragging' && "🎯 POSITION CARD OVER SCANNER SLOT"}
          {scanStage === 'inserted' && "✅ CARD INSERTED - INITIALIZING"}
          {scanStage === 'scanning' && "🔄 SCANNING IN PROGRESS"}
          {scanStage === 'granted' && "🎉 ACCESS GRANTED - WELCOME!"}
        </motion.div>
      </div>

      {/* Scanner Device */}
      <div className="relative">
        {/* Scanner Base */}
        <motion.div 
          className="w-80 h-64 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg border border-blue-400/30 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Card Slot - Same size as card */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-52 h-32 bg-slate-900 rounded border-2 border-blue-500/70 shadow-inner">
            <div className="absolute inset-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded" />
            {/* Slot indicator */}
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 rounded"
              animate={scanStage === 'dragging' ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
              transition={{ duration: 1, repeat: scanStage === 'dragging' ? Infinity : 0 }}
            />
            {/* Slot instructions */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-blue-300 text-sm font-mono text-center opacity-70">
                {scanStage === 'waiting' && "INSERT CARD HERE"}
                {scanStage === 'dragging' && "DROP CARD"}
                {(scanStage === 'inserted' || scanStage === 'scanning' || scanStage === 'granted') && "CARD INSERTED"}
              </div>
            </div>
          </div>

          {/* Command Screen - Enhanced and more visible */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-72 h-20 bg-black rounded border-4 border-green-400/80 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded" />
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {scanStage === 'waiting' && (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-green-400 text-center font-mono"
                  >
                    <div className="text-lg font-bold mb-1">SYSTEM READY</div>
                    <div className="text-sm">DRAG CARD TO SLOT ABOVE</div>
                  </motion.div>
                )}
                {scanStage === 'dragging' && (
                  <motion.div
                    key="dragging"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-yellow-400 text-center font-mono"
                  >
                    <div className="text-lg font-bold mb-1">POSITION CARD</div>
                    <div className="text-sm">OVER SCANNER SLOT</div>
                  </motion.div>
                )}
                {scanStage === 'inserted' && (
                  <motion.div
                    key="inserted"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-blue-400 text-center font-mono"
                  >
                    <div className="text-lg font-bold mb-1">CARD DETECTED</div>
                    <div className="text-sm">INITIALIZING SCAN...</div>
                  </motion.div>
                )}
                {scanStage === 'scanning' && (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-yellow-400 text-center font-mono flex items-center justify-center gap-3"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full"
                    />
                    <div>
                      <div className="text-lg font-bold">SCANNING</div>
                      <div className="text-sm">VERIFYING ID...</div>
                    </div>
                  </motion.div>
                )}
                {scanStage === 'granted' && (
                  <motion.div
                    key="granted"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-400 text-center font-mono flex items-center justify-center gap-3"
                  >
                    <motion.div 
                      className="w-5 h-5 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: 3 }}
                    />
                    <div>
                      <div className="text-lg font-bold">ACCESS GRANTED</div>
                      <div className="text-sm">WELCOME TO HAMSI CODE</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Screen glow effect */}
            <motion.div
              className="absolute inset-0 border-2 border-green-400 rounded"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          {/* Scanner Light Effects */}
          {scanStage === 'scanning' && (
            <>
              <motion.div
                className="absolute top-20 left-1/2 transform -translate-x-1/2 w-60 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                animate={{ x: [-120, 120, -120] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-blue-400 rounded-lg"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </>
          )}

          {/* Success glow effect */}
          {scanStage === 'granted' && (
            <motion.div
              className="absolute inset-0 border-2 border-green-400 rounded-lg"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </motion.div>

        {/* Draggable ID Card */}
        <motion.div
          className="absolute w-52 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-2xl border border-blue-300 cursor-grab active:cursor-grabbing"
          drag={scanStage === 'waiting' || scanStage === 'dragging'}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ 
            x: cardPosition.x, 
            y: cardPosition.y,
            scale: isDragging ? 1.05 : (scanStage === 'inserted' || scanStage === 'scanning' || scanStage === 'granted') ? 1 : 1,
            rotate: isDragging ? 5 : 0
          }}
          whileDrag={{ scale: 1.1, rotate: 10, zIndex: 10 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {/* Card Content */}
          <div className="p-4 h-full flex flex-col justify-between text-white pointer-events-none">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold opacity-80">PORTFOLIO ACCESS</div>
                <div className="text-lg font-bold mt-1">HAMSI CODE</div>
                <div className="text-xs opacity-70">SOFTWARE DEVELOPER</div>
              </div>
              <motion.div 
                className="w-12 h-12 bg-white/20 rounded border border-white/30"
                animate={scanStage === 'scanning' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: scanStage === 'scanning' ? Infinity : 0 }}
              />
            </div>
            <div className="text-xs opacity-60 font-mono">
              ID: DEV-2024-001
            </div>
          </div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg pointer-events-none"
            animate={{ x: [-200, 200] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />

          {scanStage === 'scanning' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/30 to-transparent rounded-lg pointer-events-none"
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </motion.div>
      </div>

      {/* Access Granted Message */}
      <AnimatePresence>
        {scanStage === 'granted' && (
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <motion.div
              className="text-4xl font-bold text-green-400 mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, repeat: 3 }}
            >
              🎉 ACCESS GRANTED! 🎉
            </motion.div>
            <motion.div 
              className="text-blue-300 font-mono text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Loading Portfolio...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scanner;
