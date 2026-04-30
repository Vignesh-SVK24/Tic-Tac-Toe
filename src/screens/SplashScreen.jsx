import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

const SplashScreen = () => {
  const { setGameState } = useGame();

  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState('home');
    }, 4000);
    return () => clearTimeout(timer);
  }, [setGameState]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: '#1a1311',
      color: 'var(--light-wood)',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ zIndex: 2 }}
        >
          <h1 className="engraved" style={{ fontSize: '5rem', letterSpacing: '15px', fontWeight: 900, marginBottom: '1rem' }}>SVK</h1>
          <div style={{ 
            width: '200px', 
            height: '2px', 
            background: 'rgba(215, 204, 200, 0.2)', 
            margin: '2rem auto',
            position: 'relative'
          }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              style={{ height: '100%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold)' }}
            />
          </div>
          <p style={{ fontFamily: 'Cinzel', letterSpacing: '8px', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>CREATIONZ</p>
        </motion.div>

        {/* Ambient light glow */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(255, 191, 0, 0.05) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 1
        }} />
      </div>

      <div style={{ 
        position: 'fixed', 
        bottom: '10%', 
        fontFamily: 'Cinzel', 
        fontSize: '0.7rem', 
        color: 'rgba(255,255,255,0.2)', 
        letterSpacing: '4px' 
      }}>
        CARVING THE EXPERIENCE...
      </div>
    </div>
  );
};

export default SplashScreen;
