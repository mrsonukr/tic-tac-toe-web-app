import React from 'react';
import { X, Circle } from 'lucide-react';

interface GameBoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  isGameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick, winningLine, isGameOver }) => {
  const renderCell = (index: number) => {
    const value = board[index];
    const isWinningCell = winningLine?.includes(index);
    
    return (
      <button
        key={index}
        className={`
          aspect-square rounded-2xl border-2 flex items-center justify-center
          transition-all duration-300 transform hover:scale-105 active:scale-95
          ${value 
            ? 'border-slate-300 bg-white shadow-md' 
            : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-sm'
          }
          ${isWinningCell ? 'bg-green-100 border-green-300 shadow-lg' : ''}
          ${isGameOver && !value ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => onCellClick(index)}
        disabled={value !== null || isGameOver}
      >
        {value === 'X' && (
          <X 
            size={40} 
            className={`text-blue-600 transition-all duration-300 ${isWinningCell ? 'text-green-600' : ''}`}
            strokeWidth={3}
          />
        )}
        {value === 'O' && (
          <Circle 
            size={40} 
            className={`text-red-500 transition-all duration-300 ${isWinningCell ? 'text-green-600' : ''}`}
            strokeWidth={3}
          />
        )}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-xl">
      {board.map((_, index) => renderCell(index))}
    </div>
  );
};

export default GameBoard;