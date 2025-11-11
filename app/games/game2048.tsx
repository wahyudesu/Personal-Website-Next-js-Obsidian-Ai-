'use client';

import React, { useState, useEffect, useCallback } from 'react';

const SIZE = 4;

interface Tile {
  value: number;
  id: number;
}

type Board = (Tile | null)[][];

const createEmptyBoard = (): Board => {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
};

const addRandomTile = (board: Board): Board => {
  const emptyCells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!board[r][c]) {
        emptyCells.push([r, c]);
      }
    }
  }

  if (emptyCells.length === 0) return board;

  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newBoard = board.map(row => row.slice());
  const value = Math.random() < 0.9 ? 2 : 4;
  newBoard[r][c] = { value, id: Date.now() + Math.random() };
  return newBoard;
};

const initializeGame = (): Board => {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const Game2048 = () => {
  const [board, setBoard] = useState<Board>(initializeGame());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };
    return colors[value] || '#3c3a32';
  };

  const getTileTextColor = (value: number): string => {
    return value > 4 ? '#f9f6f2' : '#776e65';
  };

  const moveLeft = (board: Board): [Board, number] => {
    let newBoard: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    let scoreGained = 0;

    for (let r = 0; r < SIZE; r++) {
      let tiles = board[r].filter(tile => tile !== null);
      let merged: Tile[] = [];

      for (let i = 0; i < tiles.length; i++) {
        if (i < tiles.length - 1 && tiles[i]!.value === tiles[i + 1]!.value) {
          const newValue = tiles[i]!.value * 2;
          merged.push({ value: newValue, id: Date.now() + Math.random() + i });
          scoreGained += newValue;
          i++; // Skip next tile as it's merged
        } else {
          merged.push(tiles[i]!);
        }
      }

      for (let c = 0; c < merged.length; c++) {
        newBoard[r][c] = merged[c];
      }
    }

    return [newBoard, scoreGained];
  };

  const rotateBoard = (board: Board): Board => {
    const newBoard: Board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        newBoard[c][SIZE - 1 - r] = board[r][c];
      }
    }
    return newBoard;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let rotations = 0;
    if (direction === 'up') rotations = 3;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 1;

    let currentBoard = board;
    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard);
    }

    const [movedBoard, scoreGained] = moveLeft(currentBoard);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(movedBoard);
    }

    // Check if board actually changed
    const boardChanged = JSON.stringify(board) !== JSON.stringify(currentBoard);

    if (boardChanged) {
      const newBoard = addRandomTile(currentBoard);
      setBoard(newBoard);
      setScore(prev => prev + scoreGained);

      // Check for 2048
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (newBoard[r][c]?.value === 2048 && !won) {
            setWon(true);
          }
        }
      }

      // Check game over
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, won]);

  const isGameOver = (board: Board): boolean => {
    // Check if there are any empty cells
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!board[r][c]) return false;
      }
    }

    // Check if any adjacent tiles can be merged
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const current = board[r][c];
        if (c < SIZE - 1 && current?.value === board[r][c + 1]?.value) return false;
        if (r < SIZE - 1 && current?.value === board[r + 1][c]?.value) return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, gameOver]);

  const resetGame = () => {
    setBoard(initializeGame());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-md">
        <div className="text-2xl font-bold">Score: {score}</div>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Game
        </button>
      </div>

      {won && !gameOver && (
        <div className="mb-4 p-4 bg-green-100 border-2 border-green-500 rounded">
          <p className="text-green-800 font-bold">You won! Keep playing to get higher score!</p>
        </div>
      )}

      {gameOver && (
        <div className="mb-4 p-4 bg-red-100 border-2 border-red-500 rounded">
          <p className="text-red-800 font-bold">Game Over! Final Score: {score}</p>
        </div>
      )}

      <div
        className="grid gap-2 p-4 bg-[#bbada0] rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 80px)`,
          gridTemplateRows: `repeat(${SIZE}, 80px)`,
        }}
      >
        {board.map((row, r) =>
          row.map((tile, c) => (
            <div
              key={`${r}-${c}`}
              className="flex items-center justify-center rounded font-bold text-2xl"
              style={{
                backgroundColor: tile ? getTileColor(tile.value) : '#cdc1b4',
                color: tile ? getTileTextColor(tile.value) : 'transparent',
                width: '80px',
                height: '80px',
              }}
            >
              {tile?.value || ''}
            </div>
          ))
        )}
      </div>

      <p className="text-sm text-gray-600 mt-4">
        Use arrow keys to move tiles. Tiles with the same number merge into one!
      </p>
    </div>
  );
};

export default Game2048;
