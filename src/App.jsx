import React, { useEffect } from 'react';
import { useGame } from './context/GameContext';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ModeSelectScreen from './screens/ModeSelectScreen';
import ThemeSelectScreen from './screens/ThemeSelectScreen';
import CustomColorsScreen from './screens/CustomColorsScreen';
import OnlineLobbyScreen from './screens/OnlineLobbyScreen';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const { gameState, theme } = useGame();


  const renderScreen = () => {
    switch (gameState) {
      case 'splash': return <SplashScreen key="splash" />;
      case 'home': return <HomeScreen key="home" />;
      case 'mode-select': return <ModeSelectScreen key="mode-select" />;
      case 'theme-select': return <ThemeSelectScreen key="theme-select" />;
      case 'custom-colors': return <CustomColorsScreen key="custom-colors" />;
      case 'online-lobby': return <OnlineLobbyScreen key="online-lobby" />;
      case 'game': return <GameScreen key="game" />;
      case 'results': return <ResultsScreen key="results" />;
      case 'settings': return <SettingsScreen key="settings" />;
      default: return <HomeScreen key="home" />;
    }
  };

  return (
    <div className="app-container">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="dust" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: Math.random() * 0.3
          }} 
        />
      ))}
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>
    </div>
  );
}

export default App;
