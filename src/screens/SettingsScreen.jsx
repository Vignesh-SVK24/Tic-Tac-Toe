import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Volume2, Info, Shield, Zap } from 'lucide-react';

const SettingsScreen = () => {
  const { setGameState } = useGame();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
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
        <h2 className="neon-text" style={{ fontSize: '2rem' }}>SYSTEM CFG</h2>
        <p className="arcade-font" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>CALIBRATE YOUR MACHINE</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="glass card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="icon-box" style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '10px', borderRadius: '8px', color: 'var(--lime)' }}>
              <Volume2 size={24} />
            </div>
            <span className="arcade-font" style={{ fontSize: '0.7rem' }}>FX AUDIO</span>
          </div>
          <div className="glass" style={{ width: '60px', height: '30px', padding: '4px', position: 'relative', cursor: 'pointer' }}>
             <motion.div 
               animate={{ x: 30 }}
               style={{ width: '20px', height: '20px', background: 'var(--lime)', borderRadius: '4px', boxShadow: '0 0 10px var(--lime)' }}
             />
          </div>
        </div>

        <div className="glass card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="icon-box" style={{ background: 'rgba(0, 210, 255, 0.1)', padding: '10px', borderRadius: '8px', color: 'var(--primary)' }}>
              <Shield size={24} />
            </div>
            <span className="arcade-font" style={{ fontSize: '0.7rem' }}>STEALTH MODE</span>
          </div>
          <div className="glass" style={{ width: '60px', height: '30px', padding: '4px', position: 'relative', cursor: 'pointer' }}>
             <motion.div 
               style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}
             />
          </div>
        </div>

        <div className="glass card" style={{ padding: '2rem', marginTop: '1rem', border: '2px dashed rgba(255, 255, 255, 0.1)' }}>
           <h4 className="arcade-font" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--yellow)' }}>
             <Info size={20}/> LOGS
           </h4>
           <p className="arcade-font" style={{ fontSize: '0.5rem', color: 'var(--text-muted)', lineHeight: '2' }}>
             MODEL: SVK-ARCADE-PREMIUM<br/>
             VERSION: 2.0.4<br/>
             BUILD: 2026.04.30<br/>
             DEVELOPER: SVK CREATIONZ
           </p>
           <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.6rem' }}>SOURCE</button>
              <button className="btn btn-secondary" style={{ flex: 1, padding: '12px', fontSize: '0.6rem' }}>CREDITS</button>
           </div>
        </div>
      </div>
      
      <footer style={{ marginTop: 'auto', textAlign: 'center', padding: '2rem 0' }}>
         <Zap size={24} color="var(--yellow)" style={{ opacity: 0.3 }} />
      </footer>
    </motion.div>
  );
};

export default SettingsScreen;
