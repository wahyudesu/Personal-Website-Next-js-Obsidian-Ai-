import React, { useEffect, useRef, useState } from 'react';

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
  const keys = Object.keys(TETROMINOES);
  const rand = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOES[rand], name: rand };
};

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(createEmptyGrid());
  const [currentPiece, setCurrentPiece] = useState(randomTetromino());
  const [position, setPosition] = useState({ x: Math.floor(COLS / 2) - 1, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const dropIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  // Handle keyboard control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
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
  }, [isPlaying, currentPiece, position, grid]);

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
      clearInterval(dropIntervalRef.current);
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      clearInterval(dropIntervalRef.current);
      clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, currentPiece, position, grid]);

  // Cek collision antara bentuk tetromino dan grid
  const checkCollision = (shape, pos) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
          if (newY >= 0 && grid[newY][newX]) return true;
        }
      }
    }
    return false;
  };

  // Fungsi untuk menggerakkan tetromino
  const movePiece = (dx, dy) => {
    const newPos = { x: position.x + dx, y: position.y + dy };
    if (!checkCollision(currentPiece.shape, newPos)) {
      setPosition(newPos);
    } else {
      if (dy === 1) {
        // Collision saat bergerak ke bawah artinya piece sudah mencapai tempatnya
        mergePiece();
      }
    }
  };

  // Gabungkan currentPiece ke grid ketika sudah tidak dapat bergerak ke bawah
  const mergePiece = () => {
    const newGrid = grid.map((row) => row.slice());
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const gridX = position.x + x;
          const gridY = position.y + y;
          if (gridY >= 0) {
            newGrid[gridY][gridX] = currentPiece.color;
          }
        }
      });
    });
    setGrid(newGrid);
    clearLines(newGrid);
    spawnNewPiece(newGrid);
  };

  // Hapus baris penuh dan tambahkan baris kosong di atas
  const clearLines = (gridToClear) => {
    const newGrid = gridToClear.filter((row) => row.some((cell) => cell === null));
    const cleared = ROWS - newGrid.length;
    const emptyRows = Array.from({ length: cleared }, () =>
      Array(COLS).fill(null)
    );
    setGrid([...emptyRows, ...newGrid]);
  };

  // Munculkan tetromino baru dan cek apakah terjadi collision di posisi awal (game over)
  const spawnNewPiece = (newGrid) => {
    const newPiece = randomTetromino();
    const startPos = { x: Math.floor(COLS / 2) - 1, y: 0 };
    if (checkCollision(newPiece.shape, startPos)) {
      alert("Game Over!");
      setIsPlaying(false);
      return;
    }
    setCurrentPiece(newPiece);
    setPosition(startPos);
  };

  // Rotasi tetromino (transpose dan reverse tiap baris)
  const rotatePiece = () => {
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    );
    if (!checkCollision(rotated, position)) {
      setCurrentPiece({ ...currentPiece, shape: rotated });
    }
  };

  // Menggambar grid dan current piece ke canvas
  const draw = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);

      // Gambar grid yang sudah ter-merge (tanpa garis grid)
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (grid[y][x]) {
            ctx.fillStyle = grid[y][x];
            ctx.fillRect(
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
          }
        });
      });
    }
  };

  useEffect(() => {
    draw();
  }, [grid, currentPiece, position]);

  // Reset permainan
  const resetGame = () => {
    setGrid(createEmptyGrid());
    setCurrentPiece(randomTetromino());
    setPosition({ x: Math.floor(COLS / 2) - 1, y: 0 });
    setTime(0);
    setIsPlaying(true);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={COLS * BLOCK_SIZE}
        height={ROWS * BLOCK_SIZE}
        style={{ border: '2px solid black', background: '#fff' }}
      />
      <div style={{ marginTop: '20px' }}>
        <h2>Stopwatch: {time} s</h2>
        {!isPlaying ? (
          <button onClick={resetGame}>Play</button>
        ) : (
          <button onClick={() => setIsPlaying(false)}>Reset</button>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;
