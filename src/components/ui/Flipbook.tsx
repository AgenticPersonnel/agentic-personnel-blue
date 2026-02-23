'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Flipbook.module.css';
import '../../styles/spiral-particles.css';

interface FlipbookItem {
  title: string;
  image?: string;
}

interface FlipbookProps {
  images?: string[];
  interval?: number; // Time between flips in milliseconds
  className?: string;
}

export default function Flipbook({ images, interval = 4500, className = '' }: FlipbookProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // New titles and image paths (using actual filenames from public folder)
  const flipbookItems: FlipbookItem[] = [
    { title: 'Discover', image: '/01_discover_card_v2.webp' },
    { title: 'Design', image: '/02_design_solutions_card.webp' },
    { title: 'Develop', image: '/03_development_build_card.webp' },
    { title: 'Deploy', image: '/04_training_implementation_card.webp' },
    { title: 'Deliver', image: '/05_customer_success_support_card.webp' }
  ];

  useEffect(() => {
    if (flipbookItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flipbookItems.length);
    }, interval);

    return () => clearInterval(timer);
  }, [flipbookItems.length, interval]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1.5, // 1.5 second crossfade
            ease: "easeInOut"
          }}
          className="flex items-center justify-center absolute"
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {/* Electric Holographic Card - 20% larger */}
          <div 
            className={`w-[230px] h-[230px] lg:w-[307px] lg:h-[307px] rounded-lg 
                      backdrop-blur-md flex items-center justify-center
                      relative overflow-hidden transition-all duration-300
                      hover:scale-105 ${styles.electricCard}`}
            style={{
              backgroundColor: 'rgba(0, 28, 56, 0.8)',
              border: '2px solid rgba(78, 138, 211, 0.6)',
              boxShadow: `
                0 0 0 1px rgba(78, 138, 211, 0.4),
                0 0 15px rgba(78, 138, 211, 0.6),
                0 0 25px rgba(78, 138, 211, 0.4),
                0 0 35px rgba(78, 138, 211, 0.3),
                0 0 50px rgba(78, 138, 211, 0.2),
                inset 0 0 20px rgba(78, 138, 211, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2),
                inset 0 0 5px rgba(78, 138, 211, 0.1)
              `
            }}
          >
            {/* Background Image Layer - full opacity (animation handles fading) */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${flipbookItems[currentIndex].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.8  // Slightly reduced for better text visibility
              }}
            ></div>
            
            {/* Animated Electric Shimmer */}
            <div 
              className={`absolute inset-0 ${styles.electricShimmer}`}
              style={{
                background: 'linear-gradient(45deg, transparent 20%, rgba(78, 138, 211, 0.3) 40%, rgba(78, 138, 211, 0.4) 50%, rgba(78, 138, 211, 0.3) 60%, transparent 80%)'
              }}
            ></div>
            
            {/* Electric Scan Lines */}
            <div 
              className={`absolute inset-0 ${styles.electricScanLines}`}
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(78, 138, 211, 0.1) 2px, rgba(78, 138, 211, 0.1) 4px)'
              }}
            ></div>
            
            {/* Holographic Interference */}
            <div 
              className={`absolute inset-0 ${styles.electricInterference}`}
              style={{
                background: 'radial-gradient(circle at 30% 20%, rgba(78, 138, 211, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 0, 255, 0.03) 0%, transparent 50%)'
              }}
            ></div>
            
            {/* Enhanced Electric Title */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span 
                className={`text-2xl lg:text-3xl font-bold text-white text-center px-4 relative z-10 ${styles.electricText}`}
                style={{
                  textShadow: `
                    0 0 5px rgba(78, 138, 211, 0.8),
                    0 0 10px rgba(78, 138, 211, 0.6),
                    0 0 15px rgba(78, 138, 211, 0.4),
                    0 0 25px rgba(78, 138, 211, 0.3),
                    0 0 35px rgba(78, 138, 211, 0.2),
                    0 2px 4px rgba(0, 0, 0, 0.8)
                  `,
                  filter: 'drop-shadow(0 0 12px rgba(78, 138, 211, 0.6))'
                }}
              >
                {flipbookItems[currentIndex].title}
              </span>
            </div>
            
            {/* Electric Particles */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.electricParticle}></div>
            ))}
            
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* SYSTEM 4: "FlipbookVortex" - COMMENTED OUT - 1000 particles spiraling into flipbook between image transitions
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {[...Array(1000)].map((_, i) => {
          const delay = (i / 1000) * 0.6; 
          
          return (
            <div 
              key={`spiral-${currentIndex}-${i}`} 
              style={{
                position: 'absolute',
                width: '3px',
                height: '3px', 
                background: 'rgba(78, 138, 211, 0.9)',
                borderRadius: '50%',
                boxShadow: '0 0 4px rgba(78, 138, 211, 0.8)',
                left: '50%',
                top: '50%',
                zIndex: 1000,
                transform: 'translate(-50%, -50%)',
                animation: `spiralBig 0.6s ease-in-out ${delay}s forwards`
              }}
            ></div>
          );
        })}
      </div>
      
      <style jsx>{\`
        @keyframes spiralBig {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) translateX(400px) scale(0.5);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(216deg) translateX(280px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(1800deg) translateX(0px) scale(0.2);
          }
        }
      \`}</style>
      END COMMENTED SECTION */}
      
    </div>
  );
}