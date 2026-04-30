import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ChevronLeft, User, Users } from 'lucide-react';

const ModeSelectScreen = () => {
  const { setGameState, gameMode } = useGame();

  const handleModeChoice = (choice) => {
    if (gameMode === 'online') {
      setGameState('online-lobby');
    } else {
      setGameState('game');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="screen"
    >
      <button 
        onClick={() => setGameState('home')}
        className="btn-secondary" 
        style={{ width: 'fit-content', padding: '8px 16px', marginBottom: '2rem', borderRadius: '100px' }}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
        {gameMode === 'online' ? 'Online Match' : 'Local Match'}
      </h2>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
          className="glass card"
          style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => handleModeChoice('1v1')}
        >
          <div className="icon-box" style={{ background: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
            <User size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem' }}>1 vs 1 Mode</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Classic turn-based duel</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ModeSelectScreen;
