import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { RotateCcw, Home, Trophy, Frown, Users, Star } from 'lucide-react';

const ResultsScreen = () => {
  const { winner, players, setGameState, resetGame, gameMode, socket, roomCode } = useGame();

  const handleRematch = () => {
    if (gameMode === 'online') {
      socket.emit('restart_game', { roomCode });
    } else {
      resetGame();
    }
    setGameState('game');
  };

  const getWinnerInfo = () => {
    if (winner === 'draw') return { text: "A NOBLE DRAW", icon: <Users size={100} />, color: '#d7ccc8' };
    if (winner === 'X') return { text: `${players.p1.name.toUpperCase()} TRIUMPHS`, icon: <Trophy size={100} />, color: '#d7ccc8' };
    if (winner === 'O') return { text: `${players.p2.name.toUpperCase()} TRIUMPHS`, icon: <Trophy size={100} />, color: '#d4af37' };
    return { text: "GAME CONCLUDED", icon: <Frown size={100} />, color: '#fff' };
  };

  const info = getWinnerInfo();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="screen"
      style={{ justifyContent: 'center', alignItems: 'center' }}
    >
      <div className="wood-panel card" style={{ padding: '5rem', textAlign: 'center', width: '100%', maxWidth: '600px', border: '4px solid #2e1b18' }}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: info.color, marginBottom: '3rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
        >
          {info.icon}
        </motion.div>
        
        <motion.h2 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="engraved-light"
          style={{ 
            fontSize: '3rem', 
            fontWeight: 900, 
            marginBottom: '4rem', 
            color: info.color,
            letterSpacing: '4px'
          }}
        >
          {info.text}
        </motion.h2>

        <div style={{ display: 'grid', gap: '2rem' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary" 
            onClick={handleRematch}
            style={{ padding: '25px' }}
          >
            <RotateCcw size={24} /> REQUEST REMATCH
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary" 
            onClick={() => setGameState('home')}
            style={{ padding: '25px' }}
          >
            <Home size={24} /> LEAVE TABLE
          </motion.button>
        </div>
      </div>
      
      <div style={{ marginTop: '5rem', color: 'rgba(255,255,255,0.2)', fontFamily: 'Cinzel', letterSpacing: '6px', fontSize: '0.8rem' }}>
        SVK PREMIUM HANDCRAFTED GAMES
      </div>
    </motion.div>
  );
};

export default ResultsScreen;
