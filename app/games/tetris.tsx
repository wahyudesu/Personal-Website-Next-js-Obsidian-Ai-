'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

const createEmptyGrid = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
};

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: 'cyan' },
  O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' },
};

const randomTetromino = () => {
  const keys = Object.keys(TETROMINOES) as Array<keyof typeof TETROMINOES>;
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOES[rand], name: rand };
};

interface Tetromino {
  shape: number[][];
  color: string;
  name: string;
}

interface Position {
  x: number;
  y: number;
}

const TetrisGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid());
  const [currentPiece, setCurrentPiece] = useState<Tetromino>(randomTetromino());
  const [position, setPosition] = useState<Position>({ x: Math.floor(COLS / 2) - 1, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to avoid stale closures
  const gridRef = useRef(grid);
  const currentPieceRef = useRef(currentPiece);
  const positionRef = useRef(position);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    currentPieceRef.current = currentPiece;
  }, [currentPiece]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Cek collision antara bentuk tetromino dan grid
  const checkCollision = useCallback((shape: number[][], pos: Position, gridToCheck?: (string | null)[][]) => {
    const currentGrid = gridToCheck || gridRef.current;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && currentGrid[newY][newX]) return true;
        }
      }
    }
    return false;
  }, []);

  // Hapus baris penuh dan tambahkan baris kosong di atas
  const clearLines = useCallback((gridToClear: (string | null)[][]) => {
    const newGrid = gridToClear.filter((row) => row.some((cell) => cell === null));
    const cleared = ROWS - newGrid.length;
    if (cleared > 0) {
      setScore(prev => prev + cleared * 100);
    }
    const emptyRows = Array.from({ length: cleared }, () =>
      Array(COLS).fill(null)
    );
    return [...emptyRows, ...newGrid];
  }, []);

  // Munculkan tetromino baru dan cek apakah terjadi collision di posisi awal (game over)
  const spawnNewPiece = useCallback((newGrid: (string | null)[][]) => {
    const newPiece = randomTetromino();
    const startPos = { x: Math.floor(COLS / 2) - 1, y: 0 };
    if (checkCollision(newPiece.shape, startPos, newGrid)) {
      setIsPlaying(false);
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setTimeout(() => alert(`Game Over! Score: ${score}`), 100);
      return;
    }
    setCurrentPiece(newPiece);
    setPosition(startPos);
  }, [checkCollision, score]);

  // Gabungkan currentPiece ke grid ketika sudah tidak dapat bergerak ke bawah
  const mergePiece = useCallback(() => {
    const newGrid = gridRef.current.map((row) => row.slice());
    currentPieceRef.current.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const gridX = positionRef.current.x + x;
          const gridY = positionRef.current.y + y;
          if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
            newGrid[gridY][gridX] = currentPieceRef.current.color;
          }
        }
      });
    });
    const clearedGrid = clearLines(newGrid);
    setGrid(clearedGrid);
    spawnNewPiece(clearedGrid);
  }, [clearLines, spawnNewPiece]);

  // Fungsi untuk menggerakkan tetromino
  const movePiece = useCallback((dx: number, dy: number) => {
    if (!isPlayingRef.current) return;

    const newPos = { x: positionRef.current.x + dx, y: positionRef.current.y + dy };
    if (!checkCollision(currentPieceRef.current.shape, newPos)) {
      setPosition(newPos);
    } else {
      if (dy === 1) {
        // Collision saat bergerak ke bawah artinya piece sudah mencapai tempatnya
        mergePiece();
      }
    }
  }, [checkCollision, mergePiece]);

  // Rotasi tetromino (transpose dan reverse tiap baris)
  const rotatePiece = useCallback(() => {
    if (!isPlayingRef.current) return;

    const shape = currentPieceRef.current.shape;
    if (shape.length === 0 || shape[0].length === 0) return;

    const rotated = shape[0].map((_, index) =>
      shape.map((row) => row[index]).reverse()
    );
    if (!checkCollision(rotated, positionRef.current)) {
      setCurrentPiece({ ...currentPieceRef.current, shape: rotated });
    }
  }, [checkCollision]);

  // Handle keyboard control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayingRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece, rotatePiece]);

  // Otomatis turun setiap interval (drop) dan update stopwatch
  useEffect(() => {
    if (isPlaying) {
      dropIntervalRef.current = setInterval(() => {
        movePiece(0, 1);
      }, 500); // kecepatan turun setiap 500ms
      timerIntervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, movePiece]);

  // Menggambar grid dan current piece ke canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

    // Gambar grid yang sudah ter-merge
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (grid[y][x]) {
          ctx.fillStyle = grid[y][x] as string;
          ctx.fillRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
          // Add border to blocks
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            x * BLOCK_SIZE,
            y * BLOCK_SIZE,
            BLOCK_SIZE,
            BLOCK_SIZE
          );
        }
      }
    }

    // Gambar tetromino yang sedang aktif
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const drawX = (position.x + x) * BLOCK_SIZE;
          const drawY = (position.y + y) * BLOCK_SIZE;
          ctx.fillStyle = currentPiece.color;
          ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
          // Add border to blocks
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
        }
      });
    });
  }, [grid, currentPiece, position]);

  // Reset permainan
  const resetGame = () => {
    setGrid(createEmptyGrid());
    setCurrentPiece(randomTetromino());
    setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setTime(0);
    setScore(0);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={COLS * BLOCK_SIZE}
        height={ROWS * BLOCK_SIZE}
        className="border-2 border-black bg-white"
      />
      <div className="mt-4 space-y-2">
        <div className="text-lg font-bold">Score: {score}</div>
        <div className="text-lg">Time: {time}s</div>
        {!isPlaying ? (
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {time === 0 ? 'Start' : 'Play Again'}
          </button>
        ) : (
          <button
            onClick={() => setIsPlaying(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop
          </button>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Use arrow keys: ← → to move, ↑ to rotate, ↓ to drop faster
        </p>
      </div>
    </div>
  );
};

export default TetrisGame;
