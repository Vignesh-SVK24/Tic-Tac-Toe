import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Check, Palette } from 'lucide-react';

const themes = [
  { id: 'neon', name: 'Neon Strike', color: '#00d2ff', bg: 'rgba(0, 210, 255, 0.2)' },
  { id: 'classic', name: 'Retro 80s', color: '#ff00e6', bg: 'rgba(255, 0, 230, 0.2)' },
  { id: 'futuristic', name: 'Cyberpunk', color: '#bd00ff', bg: 'rgba(189, 0, 255, 0.2)' },
  { id: 'glass', name: 'Vaporwave', color: '#39ff14', bg: 'rgba(57, 255, 20, 0.2)' }
];

const ThemeSelectScreen = () => {
  const { setGameState, theme, setTheme } = useGame();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="screen"
    >
      <button 
        onClick={() => setGameState('home')}
        className="btn-secondary" 
        style={{ width: 'fit-content', padding: '10px 20px', marginBottom: '2rem', borderRadius: '100px' }}
      >
        <ChevronLeft size={20} /> BACK
      </button>

      <header style={{ marginBottom: '3rem' }}>
        <h2 className="neon-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>CABINET SKINS</h2>
        <p className="arcade-font" style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>SELECT YOUR VISUAL INTERFACE</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {themes.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(t.id)}
            className="glass card"
            style={{ 
              cursor: 'pointer', 
              padding: '1.5rem', 
              position: 'relative',
              border: theme === t.id ? `2px solid ${t.color}` : '2px solid rgba(255,255,255,0.1)',
              boxShadow: theme === t.id ? `0 0 20px ${t.color}44` : 'none'
            }}
          >
            <div 
              style={{ 
                width: '100%', 
                height: '100px', 
                background: t.bg, 
                borderRadius: '8px', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px dashed ${t.color}`
              }}
            >
               <Palette size={40} color={t.color} />
            </div>
            <h4 className="arcade-font" style={{ textAlign: 'center', fontSize: '0.6rem', color: theme === t.id ? t.color : 'white' }}>{t.name}</h4>
            {theme === t.id && (
              <motion.div 
                layoutId="check"
                style={{ position: 'absolute', top: '10px', right: '10px', background: t.color, borderRadius: '50%', padding: '4px' }}
              >
                <Check size={14} color="#000" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <button 
        className="btn btn-primary rgb-border" 
        style={{ marginTop: '3rem', width: '100%', padding: '20px' }}
        onClick={() => setGameState('custom-colors')}
      >
        CUSTOMIZE COLORS
      </button>
    </motion.div>
  );
};

export default ThemeSelectScreen;
