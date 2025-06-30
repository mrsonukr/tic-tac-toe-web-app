import React from 'react';
import { RotateCcw, User, Bot, Users, Volume2, VolumeX } from 'lucide-react';

interface GameControlsProps {
  gameMode: 'single' | 'multi';
  setGameMode: (mode: 'single' | 'multi') => void;
  botLevel: 'easy' | 'medium' | 'hard' | 'expert';
  setBotLevel: (level: 'easy' | 'medium' | 'hard' | 'expert') => void;
  onReset: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isGameActive: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  setGameMode,
  botLevel,
  setBotLevel,
  onReset,
  soundEnabled,
  setSoundEnabled,
  isGameActive
}) => {
  const levelColors = {
    easy: 'bg-green-500 hover:bg-green-600',
    medium: 'bg-yellow-500 hover:bg-yellow-600',
    hard: 'bg-orange-500 hover:bg-orange-600',
    expert: 'bg-red-500 hover:bg-red-600'
  };

  return (
    <div className="space-y-6">
      {/* Game Mode Toggle */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Game Mode</h3>
        <div className="flex space-x-3">
          <button
            onClick={() => setGameMode('single')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300
              ${gameMode === 'single' 
                ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Bot size={20} />
            <span className="font-medium">vs Bot</span>
          </button>
          <button
            onClick={() => setGameMode('multi')}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-300
              ${gameMode === 'multi' 
                ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            <Users size={20} />
            <span className="font-medium">2 Players</span>
          </button>
        </div>
      </div>

      {/* Bot Difficulty */}
      {gameMode === 'single' && (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bot Difficulty</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['easy', 'medium', 'hard', 'expert'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setBotLevel(level)}
                className={`
                  py-3 px-4 rounded-xl font-medium text-white transition-all duration-300 transform
                  ${botLevel === level ? 'scale-105 shadow-lg' : 'hover:scale-102'}
                  ${levelColors[level]}
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-3">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <RotateCcw size={20} />
          <span className="font-medium">Reset Game</span>
        </button>
        
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`
            p-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg
            ${soundEnabled 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
            }
          `}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </div>
  );
};

export default GameControls;