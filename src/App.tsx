import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import GameStats from './components/GameStats';
import { useGameLogic } from './hooks/useGameLogic';
import { useSoundEffects } from './hooks/useSoundEffects';
import { Trophy, Gamepad2, Sparkles } from 'lucide-react';

function App() {
  const {
    gameState,
    gameMode,
    setGameMode,
    botLevel,
    setBotLevel,
    stats,
    makeMove,
    resetGame
  } = useGameLogic();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playMoveSound, playWinSound, playDrawSound, playButtonSound } = useSoundEffects(soundEnabled);

  // Play sounds based on game state changes
  useEffect(() => {
    if (gameState.winner === 'draw') {
      playDrawSound();
    } else if (gameState.winner) {
      playWinSound();
    }
  }, [gameState.winner, playDrawSound, playWinSound]);

  const handleCellClick = (index: number) => {
    const success = makeMove(index);
    if (success) {
      playMoveSound();
    }
  };

  const handleReset = () => {
    resetGame();
    playButtonSound();
  };

  const handleGameModeChange = (mode: 'single' | 'multi') => {
    setGameMode(mode);
    resetGame();
    playButtonSound();
  };

  const handleBotLevelChange = (level: 'easy' | 'medium' | 'hard' | 'expert') => {
    setBotLevel(level);
    resetGame();
    playButtonSound();
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) playButtonSound();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Gamepad2 className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tic Tac Toe
            </h1>
            <Sparkles className="text-purple-500" size={28} />
          </div>
          <p className="text-gray-600 text-lg">
            Challenge the AI or play with a friend in this modern tic-tac-toe experience
          </p>
        </div>

        {/* Game Status */}
        {gameState.winner && (
          <div className="mb-6 text-center">
            <div className={`
              inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg
              ${gameState.winner === 'draw'
                ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                : 'bg-green-100 text-green-800 border-2 border-green-300'
              }
            `}>
              <Trophy size={24} />
              <span>
                {gameState.winner === 'draw'
                  ? "It's a Draw!"
                  : `Player ${gameState.winner} Wins!`
                }
              </span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-full max-w-md">
              <GameBoard
                board={gameState.board}
                onCellClick={handleCellClick}
                winningLine={gameState.winningLine}
                isGameOver={gameState.isGameOver}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Game Stats */}
            <GameStats
              stats={stats}
              currentPlayer={gameState.currentPlayer}
              gameMode={gameMode}
            />

            {/* Game Controls */}
            <GameControls
              gameMode={gameMode}
              setGameMode={handleGameModeChange}
              botLevel={botLevel}
              setBotLevel={handleBotLevelChange}
              onReset={handleReset}
              soundEnabled={soundEnabled}
              setSoundEnabled={handleSoundToggle}
              isGameActive={!gameState.isGameOver}
            />
          </div>
        </div>

        <footer>
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Created with ❤️ by{' '}
                <a
                  href="https://mrsonu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                >
                  Sonu Kumar
                </a>
              </p>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;