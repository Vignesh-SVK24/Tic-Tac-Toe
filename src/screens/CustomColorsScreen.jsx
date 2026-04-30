import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ChevronLeft } from 'lucide-react';

const colorOptions = [
  { name: 'Neon Blue', hex: '#38bdf8' },
  { name: 'Neon Pink', hex: '#fb7185' },
  { name: 'Gold', hex: '#fcd34d' },
  { name: 'Cyan', hex: '#22d3ee' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#4ade80' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'White', hex: '#ffffff' }
];

const CustomColorsScreen = () => {
  const { setGameState, players, setPlayers } = useGame();

  const handleColorSelect = (player, color) => {
    setPlayers(prev => ({
      ...prev,
      [player]: { ...prev[player], color }
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="screen"
    >
      <button 
        onClick={() => setGameState('theme-select')}
        className="btn-secondary" 
        style={{ width: 'fit-content', padding: '8px 16px', marginBottom: '2rem', borderRadius: '100px' }}
      >
        <ChevronLeft size={20} /> Back
      </button>

      <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Customize XO</h2>

      <div className="customizer-sections" style={{ display: 'grid', gap: '2rem' }}>
        <div className="glass card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: players.p1.color, fontSize: '1.5rem', fontWeight: 800 }}>X</span> Color
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
            {colorOptions.map(c => (
              <motion.div
                key={c.hex}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleColorSelect('p1', c.hex)}
                style={{ 
                  height: '40px', 
                  background: c.hex, 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: players.p1.color === c.hex ? '3px solid white' : 'none',
                  boxShadow: players.p1.color === c.hex ? `0 0 15px ${c.hex}` : 'none'
                }}
              />
            ))}
          </div>
        </div>

        <div className="glass card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: players.p2.color, fontSize: '1.5rem', fontWeight: 800 }}>O</span> Color
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
            {colorOptions.map(c => (
              <motion.div
                key={c.hex}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleColorSelect('p2', c.hex)}
                style={{ 
                  height: '40px', 
                  background: c.hex, 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  border: players.p2.color === c.hex ? '3px solid white' : 'none',
                  boxShadow: players.p2.color === c.hex ? `0 0 15px ${c.hex}` : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ marginTop: '2rem', width: '100%' }}
        onClick={() => setGameState('home')}
      >
        Save & Return
      </button>
    </motion.div>
  );
};

export default CustomColorsScreen;
