import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { MessageSquare, Home, RotateCcw, Send, X as CloseIcon } from 'lucide-react';

const GameScreen = () => {
  const { 
    board, setBoard, 
    turn, setTurn, 
    players, 
    gameMode, 
    socket, roomCode, 
    setGameState,
    setWinningLine,
    winningLine,
    winner, setWinner,
    messages, setMessages,
    mySymbol
  } = useGame();

  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const checkWinner = (newBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return { winner: newBoard[a], line: lines[i] };
      }
    }
    if (!newBoard.includes(null)) return { winner: 'draw', line: [] };
    return null;
  };

  useEffect(() => {
    if (gameMode === 'online' && socket) {
      socket.on('move_made', ({ index, symbol, nextTurn }) => {
        const newBoard = [...board];
        newBoard[index] = symbol;
        setBoard(newBoard);
        setTurn(nextTurn);
        
        const winResult = checkWinner(newBoard);
        if (winResult) {
          setWinner(winResult.winner);
          setWinningLine(winResult.line);
          setTimeout(() => setGameState('results'), 2500);
        }
      });

      socket.on('new_message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      return () => {
        socket.off('move_made');
        socket.off('new_message');
      };
    }
  }, [socket, gameMode, board, setBoard, setTurn, setWinner, setWinningLine, setGameState, setMessages]);

  const handleCellClick = (index) => {
    if (board[index] || winner) return;

    if (gameMode === 'online') {
      if (turn !== mySymbol) return;
      socket.emit('make_move', { roomCode, index, symbol: mySymbol });
    } else {
      const newBoard = [...board];
      newBoard[index] = turn;
      setBoard(newBoard);
      
      const winResult = checkWinner(newBoard);
      if (winResult) {
        setWinner(winResult.winner);
        setWinningLine(winResult.line);
        setTimeout(() => setGameState('results'), 2500);
      } else {
        setTurn(turn === 'X' ? 'O' : 'X');
      }
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    socket.emit('send_message', { 
      roomCode, 
      message: chatInput, 
      playerName: players.p1.name
    });
    setChatInput('');
  };

  const currentPlayer = turn === 'X' ? players.p1 : players.p2;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="screen game-screen"
      style={{ padding: '1rem', maxWidth: '1100px' }}
    >
      {/* Wooden Top Header */}
      <div className="wood-panel" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-secondary wood-panel" onClick={() => setGameState('home')} style={{ padding: '10px' }}><Home size={24}/></button>
        
        <div style={{ textAlign: 'center' }}>
          <div className="engraved" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '5px', letterSpacing: '4px' }}>CURRENT TURN</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="engraved-light" style={{ fontSize: '1.5rem', fontWeight: 900, color: currentPlayer.color }}>
              {gameMode === 'online' ? (turn === mySymbol ? 'YOUR MOVE' : `${currentPlayer.name.toUpperCase()}'S MOVE`) : `${currentPlayer.name.toUpperCase()}'S MOVE`}
            </div>
          </div>
        </div>

        <button className="btn-secondary wood-panel" onClick={() => setGameState('home')} style={{ padding: '10px' }}><RotateCcw size={24}/></button>
      </div>

      <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Game Board */}
        <div className="board-container board" style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1/1', 
          maxWidth: '500px',
          padding: '30px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '15px', 
            height: '100%'
          }}>
            {board.map((cell, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 0.98 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCellClick(i)}
                className={`cell ${winningLine.includes(i) ? 'winning-cell' : ''}`}
                style={{ 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '5rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <AnimatePresence>
                  {cell && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className={`symbol-${cell.toLowerCase()}`}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {cell}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Player Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '250px' }}>
          <div className="wood-panel" style={{ padding: '2rem', borderLeft: `8px solid ${players.p1.color}`, opacity: turn === 'X' ? 1 : 0.6 }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: players.p1.color, marginBottom: '10px' }}>X</div>
            <div className="engraved-light" style={{ fontSize: '1.2rem' }}>{players.p1.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>VALUED PLAYER</div>
          </div>

          <div className="wood-panel" style={{ padding: '2rem', borderLeft: `8px solid ${players.p2.color}`, opacity: turn === 'O' ? 1 : 0.6 }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: players.p2.color, marginBottom: '10px' }}>O</div>
            <div className="engraved-light" style={{ fontSize: '1.2rem' }}>{players.p2.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '5px' }}>VALUED PLAYER</div>
          </div>
        </div>
      </div>

      {gameMode === 'online' && (
        <div className="chat-toggle" style={{ position: 'fixed', bottom: '3rem', right: '3rem' }}>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(true)}
            className="btn wood-panel"
            style={{ borderRadius: '50%', width: '80px', height: '80px', padding: 0 }}
          >
            <MessageSquare size={32} />
          </motion.button>
        </div>
      )}

      {/* PvP Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="wood-panel"
            style={{ 
              position: 'fixed', 
              top: 0, 
              right: 0, 
              width: '100%', 
              maxWidth: '450px', 
              height: '100vh', 
              zIndex: 100,
              borderRadius: 0,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0 50px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.3)' }}>
              <h3 className="engraved-light" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}><MessageSquare size={28}/> GAME NOTES</h3>
              <button onClick={() => setChatOpen(false)} className="btn-secondary wood-panel" style={{ padding: '8px' }}><CloseIcon size={24}/></button>
            </div>
            
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx} 
                  style={{ alignSelf: msg.senderId === socket?.id ? 'flex-end' : 'flex-start', maxWidth: '85%' }}
                >
                  <div style={{ 
                    padding: '15px 20px', 
                    borderRadius: '5px', 
                    background: msg.senderId === socket?.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
                    fontSize: '1rem',
                    color: 'white',
                    fontFamily: 'Playfair Display'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: '5px' }}>{msg.sender.toUpperCase()}</div>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ padding: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.3)', display: 'flex', gap: '15px' }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="WRITE A NOTE..."
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', color: 'white', fontFamily: 'Cinzel' }}
              />
              <button onClick={sendMessage} className="btn-primary" style={{ padding: '15px', borderRadius: '5px', background: 'var(--walnut)' }}><Send size={28}/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GameScreen;
