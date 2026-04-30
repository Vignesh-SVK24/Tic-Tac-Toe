import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Play, Users, Globe, Settings as SettingsIcon } from 'lucide-react';

const HomeScreen = () => {
  const { setGameState, setGameMode } = useGame();

  const handleStart = (mode) => {
    setGameMode(mode);
    setGameState(mode === 'online' ? 'online-lobby' : 'game');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="screen home-screen"
    >
      <header style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 className="engraved" style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '8px', color: 'var(--light-wood)' }}>
          TIC-TAC-TOE
        </h1>
        <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', letterSpacing: '2px' }}>
          By SVK Creationz • Handcrafted Edition
        </div>
      </header>

      <div className="menu-options" style={{ display: 'grid', gap: '2rem' }}>
        <motion.button 
          whileHover={{ scale: 1.02, brightness: 1.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStart('local')}
          className="btn wood-panel"
          style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: '2.5rem', height: '140px', padding: '2rem' }}
        >
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Users size={48} color="var(--oak)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 className="engraved-light" style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>OFFLINE PLAY</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Playfair Display' }}>Battle locally on this board</p>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStart('online')}
          className="btn wood-panel"
          style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: '2.5rem', height: '140px', padding: '2rem' }}
        >
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <Globe size={48} color="var(--gold)" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 className="engraved-light" style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>GLOBAL MATCH</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontFamily: 'Playfair Display' }}>Connect across the digital realm</p>
          </div>
        </motion.button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameState('settings')}
            className="btn wood-panel"
            style={{ padding: '2.5rem', height: 'auto', flexDirection: 'column' }}
          >
            <SettingsIcon size={32} />
            <span style={{ fontSize: '0.8rem', marginTop: '12px' }}>SETTINGS</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setGameState('theme-select')}
            className="btn wood-panel"
            style={{ padding: '2.5rem', height: 'auto', flexDirection: 'column' }}
          >
            <Play size={32} />
            <span style={{ fontSize: '0.8rem', marginTop: '12px' }}>CUSTOMIZE</span>
          </motion.button>
        </div>
      </div>

      <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '4rem 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', letterSpacing: '4px' }}>
        EST. 2026 • SVK PREMIUM TABLETOP
      </footer>
    </motion.div>
  );
};

export default HomeScreen;
