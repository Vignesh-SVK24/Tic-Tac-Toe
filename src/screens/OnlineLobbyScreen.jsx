import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { ChevronLeft, Copy, Plus, LogIn, Loader2, ScrollText } from 'lucide-react';

const OnlineLobbyScreen = () => {
  const { setGameState, socket, setRoomCode, roomCode, setPlayers, setTurn, setMySymbol } = useGame();
  const [mode, setMode] = useState('menu'); // menu, create, join
  const [inputCode, setInputCode] = useState('');
  const [playerName, setPlayerName] = useState('GUEST_' + Math.floor(Math.random() * 999));
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('room_created', ({ roomCode, symbol }) => {
      setRoomCode(roomCode);
      setMySymbol(symbol);
      setMode('waiting');
      setIsLoading(false);
    });

    socket.on('room_joined', ({ roomCode, symbol, opponentName }) => {
      setRoomCode(roomCode);
      setMySymbol(symbol);
      setPlayers(prev => ({
        ...prev,
        p1: { ...prev.p1, name: opponentName, symbol: 'X' },
        p2: { ...prev.p2, name: playerName, symbol: 'O' }
      }));
      setGameState('game');
    });

    socket.on('player_joined', ({ players }) => {
      if (players.length === 2) {
        setPlayers({
          p1: { name: players[0].name, symbol: 'X', color: '#d7ccc8' },
          p2: { name: players[1].name, symbol: 'O', color: '#d4af37' }
        });
        setGameState('game');
      }
    });

    socket.on('error', (msg) => {
      setStatus(msg);
      setIsLoading(false);
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_joined');
      socket.off('error');
    };
  }, [socket, playerName, setGameState, setPlayers, setRoomCode, setMySymbol]);

  const handleCreateRoom = () => {
    setIsLoading(true);
    socket.emit('create_room', { playerName });
  };

  const handleJoinRoom = () => {
    if (inputCode.length !== 4) {
      setStatus('ROOM CODE MUST BE 4 DIGITS');
      return;
    }
    setIsLoading(true);
    socket.emit('join_room', { roomCode: inputCode, playerName });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="screen"
    >
      <button 
        onClick={() => setGameState('home')}
        className="btn-secondary wood-panel" 
        style={{ width: 'fit-content', padding: '12px 24px', marginBottom: '3rem', borderRadius: '5px' }}
      >
        <ChevronLeft size={24} /> BACK TO LOBBY
      </button>

      <div className="wood-panel card" style={{ padding: '4rem', textAlign: 'center', border: '2px solid rgba(0,0,0,0.3)' }}>
        <header style={{ marginBottom: '3rem' }}>
          <ScrollText size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
          <h2 className="engraved" style={{ fontSize: '2.5rem', letterSpacing: '4px', color: 'var(--light-wood)' }}>REGISTRATION</h2>
          <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>Secure your seat at the table</div>
        </header>
        
        <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
          <label className="engraved" style={{ display: 'block', marginBottom: '1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', letterSpacing: '2px' }}>PLAYER MONIKER</label>
          <input 
            type="text" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
            style={{ 
              width: '100%', 
              padding: '20px', 
              borderRadius: '5px', 
              border: '2px solid rgba(0,0,0,0.4)', 
              color: 'white', 
              background: 'rgba(0,0,0,0.3)', 
              fontSize: '1.2rem', 
              fontFamily: 'Cinzel',
              boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)'
            }}
          />
        </div>

        {mode === 'menu' && (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary" 
              onClick={() => setMode('create')}
              style={{ padding: '25px', fontSize: '1.2rem' }}
            >
              <Plus size={24} /> CREATE SESSION
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary" 
              onClick={() => setMode('join')}
              style={{ padding: '25px', fontSize: '1.2rem' }}
            >
              <LogIn size={24} /> JOIN SESSION
            </motion.button>
          </div>
        )}

        {mode === 'create' && (
          <div>
             <button 
              className="btn btn-primary" 
              onClick={handleCreateRoom}
              disabled={isLoading}
              style={{ width: '100%', padding: '25px' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'GENERATE FREQUENCY'}
            </button>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', marginTop: '2rem', cursor: 'pointer', fontFamily: 'Cinzel' }} onClick={() => setMode('menu')}>CANCEL</button>
          </div>
        )}

        {mode === 'join' && (
          <div>
            <input 
              type="text" 
              maxLength={4}
              placeholder="0000"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '25px', 
                borderRadius: '5px', 
                border: '2px solid rgba(0,0,0,0.4)', 
                color: 'var(--gold)', 
                fontSize: '2.5rem', 
                textAlign: 'center', 
                letterSpacing: '20px',
                background: 'rgba(0,0,0,0.3)',
                fontFamily: 'Cinzel',
                marginBottom: '2rem',
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)'
              }}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleJoinRoom}
              disabled={isLoading}
              style={{ width: '100%', padding: '25px' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'ESTABLISH LINK'}
            </button>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', marginTop: '2rem', cursor: 'pointer', fontFamily: 'Cinzel' }} onClick={() => setMode('menu')}>CANCEL</button>
            {status && <p style={{ color: '#ef4444', marginTop: '2rem', fontFamily: 'Cinzel' }}>{status}</p>}
          </div>
        )}

        {mode === 'waiting' && (
          <div style={{ padding: '1rem' }}>
            <p className="engraved" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', letterSpacing: '2px' }}>SHARE THIS SESSION KEY:</p>
            <div 
              className="wood-panel" 
              style={{ 
                fontSize: '5rem', 
                fontWeight: 900, 
                padding: '3rem', 
                borderRadius: '10px', 
                letterSpacing: '25px', 
                marginBottom: '3rem', 
                color: 'var(--gold)',
                textShadow: '2px 2px 10px rgba(0,0,0,0.8)',
                fontFamily: 'Cinzel',
                background: 'rgba(0,0,0,0.4)',
                border: '4px solid #2e1b18'
              }}
            >
              {roomCode}
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '20px' }} onClick={() => navigator.clipboard.writeText(roomCode)}>
              <Copy size={24} /> COPY KEY
            </button>
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
               <Loader2 className="animate-spin" size={24} color="var(--gold)" />
               <p style={{ fontFamily: 'Cinzel', color: 'rgba(255,255,255,0.5)' }}>AWAITING OPPONENT...</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OnlineLobbyScreen;
