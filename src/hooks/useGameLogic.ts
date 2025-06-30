import { useState, useCallback, useEffect } from 'react';

export type Player = 'X' | 'O';
export type GameMode = 'single' | 'multi';
export type BotLevel = 'easy' | 'medium' | 'hard' | 'expert';

interface GameStats {
  xWins: number;
  oWins: number;
  draws: number;
  totalGames: number;
}

interface GameState {
  board: (Player | null)[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  winningLine: number[] | null;
  isGameOver: boolean;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
    isGameOver: false
  });

  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [botLevel, setBotLevel] = useState<BotLevel>('medium');
  const [stats, setStats] = useState<GameStats>({
    xWins: 0,
    oWins: 0,
    draws: 0,
    totalGames: 0
  });

  const checkWinner = useCallback((board: (Player | null)[]) => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a] as Player, winningLine: combination };
      }
    }
    
    if (board.every(cell => cell !== null)) {
      return { winner: 'draw' as const, winningLine: null };
    }
    
    return { winner: null, winningLine: null };
  }, []);

  const makeMove = useCallback((index: number) => {
    if (gameState.board[index] || gameState.isGameOver) return false;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;
    
    const { winner, winningLine } = checkWinner(newBoard);
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      winningLine,
      isGameOver: winner !== null
    }));

    if (winner) {
      setStats(prev => ({
        ...prev,
        xWins: winner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: winner === 'O' ? prev.oWins + 1 : prev.oWins,
        draws: winner === 'draw' ? prev.draws + 1 : prev.draws,
        totalGames: prev.totalGames + 1
      }));
    }

    return true;
  }, [gameState.board, gameState.currentPlayer, gameState.isGameOver, checkWinner]);

  const getBotMove = useCallback((board: (Player | null)[], level: BotLevel): number => {
    const emptyCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[];
    
    if (emptyCells.length === 0) return -1;

    // Expert level: Minimax algorithm
    if (level === 'expert') {
      const minimax = (board: (Player | null)[], depth: number, isMaximizing: boolean): number => {
        const { winner } = checkWinner(board);
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (winner === 'draw') return 0;

        if (isMaximizing) {
          let bestScore = -Infinity;
          for (const index of emptyCells) {
            if (board[index] === null) {
              board[index] = 'O';
              const score = minimax(board, depth + 1, false);
              board[index] = null;
              bestScore = Math.max(score, bestScore);
            }
          }
          return bestScore;
        } else {
          let bestScore = Infinity;
          for (const index of emptyCells) {
            if (board[index] === null) {
              board[index] = 'X';
              const score = minimax(board, depth + 1, true);
              board[index] = null;
              bestScore = Math.min(score, bestScore);
            }
          }
          return bestScore;
        }
      };

      let bestMove = -1;
      let bestScore = -Infinity;
      
      for (const index of emptyCells) {
        board[index] = 'O';
        const score = minimax(board, 0, false);
        board[index] = null;
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
      
      return bestMove;
    }

    // Hard level: Try to win, block player, strategic moves
    if (level === 'hard') {
      // Try to win
      for (const index of emptyCells) {
        const testBoard = [...board];
        testBoard[index] = 'O';
        if (checkWinner(testBoard).winner === 'O') return index;
      }
      
      // Block player from winning
      for (const index of emptyCells) {
        const testBoard = [...board];
        testBoard[index] = 'X';
        if (checkWinner(testBoard).winner === 'X') return index;
      }
      
      // Take center if available
      if (board[4] === null) return 4;
      
      // Take corners
      const corners = [0, 2, 6, 8];
      const availableCorners = corners.filter(index => board[index] === null);
      if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
      }
    }

    // Medium level: Try to win, sometimes block
    if (level === 'medium') {
      // Try to win
      for (const index of emptyCells) {
        const testBoard = [...board];
        testBoard[index] = 'O';
        if (checkWinner(testBoard).winner === 'O') return index;
      }
      
      // 70% chance to block
      if (Math.random() < 0.7) {
        for (const index of emptyCells) {
          const testBoard = [...board];
          testBoard[index] = 'X';
          if (checkWinner(testBoard).winner === 'X') return index;
        }
      }
    }

    // Easy level or fallback: Random move
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }, [checkWinner]);

  // Bot move effect
  useEffect(() => {
    if (gameMode === 'single' && gameState.currentPlayer === 'O' && !gameState.isGameOver) {
      const timer = setTimeout(() => {
        const botMove = getBotMove(gameState.board, botLevel);
        if (botMove !== -1) {
          makeMove(botMove);
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.isGameOver, gameMode, gameState.board, botLevel, getBotMove, makeMove]);

  const resetGame = useCallback(() => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      isGameOver: false
    });
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      xWins: 0,
      oWins: 0,
      draws: 0,
      totalGames: 0
    });
  }, []);

  return {
    gameState,
    gameMode,
    setGameMode,
    botLevel,
    setBotLevel,
    stats,
    makeMove,
    resetGame,
    resetStats
  };
};