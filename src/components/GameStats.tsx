import React from 'react';
import { Trophy, Target, Users } from 'lucide-react';

interface GameStatsProps {
  stats: {
    xWins: number;
    oWins: number;
    draws: number;
    totalGames: number;
  };
  currentPlayer: string;
  gameMode: 'single' | 'multi';
}

const GameStats: React.FC<GameStatsProps> = ({ stats, currentPlayer, gameMode }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <Trophy className="text-yellow-500" size={24} />
        <span>Game Statistics</span>
      </h3>
      
      <div className="space-y-4">
        {/* Current Player */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <span className="text-gray-700 font-medium">Current Turn:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentPlayer === 'X' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-lg">
              Player {currentPlayer} {gameMode === 'single' && currentPlayer === 'O' ? '(Bot)' : ''}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{stats.xWins}</div>
            <div className="text-sm text-gray-600">Player X</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-600">{stats.draws}</div>
            <div className="text-sm text-gray-600">Draws</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">{stats.oWins}</div>
            <div className="text-sm text-gray-600">Player O</div>
          </div>
        </div>

        <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <div className="text-xl font-bold text-purple-600">{stats.totalGames}</div>
          <div className="text-sm text-gray-600">Total Games</div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;