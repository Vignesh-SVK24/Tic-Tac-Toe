import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const GameContext = createContext();

const SOCKET_URL = 'http://localhost:3001';

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState('splash'); // splash, home, mode-select, theme-select, custom-colors, online-lobby, game, results, settings
  const [gameMode, setGameMode] = useState(null); // local, online
  const [mySymbol, setMySymbol] = useState(null); // X or O
  const [players, setPlayers] = useState({
    p1: { name: 'Player 1', symbol: 'X', color: '#38bdf8' },
    p2: { name: 'Player 2', symbol: 'O', color: '#fb7185' }
  });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [theme, setTheme] = useState('glass');
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const [messages, setMessages] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn('X');
    setWinner(null);
    setWinningLine([]);
  };

  const updatePlayers = (p1Data, p2Data) => {
    setPlayers(prev => ({
      p1: { ...prev.p1, ...p1Data },
      p2: { ...prev.p2, ...p2Data }
    }));
  };

  const value = {
    gameState, setGameState,
    gameMode, setGameMode,
    mySymbol, setMySymbol,
    players, setPlayers, updatePlayers,
    board, setBoard,
    turn, setTurn,
    winner, setWinner,
    winningLine, setWinningLine,
    theme, setTheme,
    socket,
    roomCode, setRoomCode,
    messages, setMessages,
    scores, setScores,
    resetGame
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
