"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE
const GAME_SPEED = 100

interface Position {
  x: number
  y: number
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  // Game state refs
  const snake = useRef<Position[]>([{ x: 10, y: 10 }])
  const direction = useRef<Position>({ x: 1, y: 0 })
  const nextDirection = useRef<Position>({ x: 1, y: 0 })
  const food = useRef<Position>({ x: 15, y: 15 })
  const currentScore = useRef(0)
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const gameLoopInterval = useRef<NodeJS.Timeout | null>(null)

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.current.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }]
    direction.current = { x: 1, y: 0 }
    nextDirection.current = { x: 1, y: 0 }
    food.current = generateFood()
    currentScore.current = 0
    gameStartedRef.current = true
    gameOverRef.current = false
    setScore(0)
    setGameStarted(true)
    setGameOver(false)
  }, [generateFood])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw grid
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE)
      ctx.stroke()
    }

    if (!gameStartedRef.current) {
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Press SPACE or Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      return
    }

    // Draw food
    ctx.fillStyle = '#ff4444'
    ctx.fillRect(
      food.current.x * CELL_SIZE + 2,
      food.current.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    )

    // Draw snake
    snake.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#44ff44' : '#88ff88'
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      )
    })

    if (gameOverRef.current) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      ctx.fillStyle = '#ffffff'
      ctx.font = '30px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40)
      ctx.font = '20px Arial'
      ctx.fillText(`Score: ${currentScore.current}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.fillText('Press SPACE or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
    }
  }, [])

  const update = useCallback(() => {
    if (!gameStartedRef.current || gameOverRef.current) return

    // Update direction
    direction.current = { ...nextDirection.current }

    // Calculate new head
    const head = snake.current[0]
    const newHead = {
      x: head.x + direction.current.x,
      y: head.y + direction.current.y
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      gameOverRef.current = true
      setGameOver(true)
      if (currentScore.current > highScore) {
        setHighScore(currentScore.current)
        localStorage.setItem('snakeHighScore', currentScore.current.toString())
      }
      if (gameLoopInterval.current) {
        clearInterval(gameLoopInterval.current)
        gameLoopInterval.current = null
      }
      return
    }

    // Check self collision
    if (snake.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      gameOverRef.current = true
      setGameOver(true)
      if (currentScore.current > highScore) {
        setHighScore(currentScore.current)
        localStorage.setItem('snakeHighScore', currentScore.current.toString())
      }
      if (gameLoopInterval.current) {
        clearInterval(gameLoopInterval.current)
        gameLoopInterval.current = null
      }
      return
    }

    // Add new head
    snake.current = [newHead, ...snake.current]

    // Check food collision
    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      currentScore.current++
      setScore(currentScore.current)
      food.current = generateFood()
    } else {
      snake.current.pop()
    }

    draw()
  }, [draw, generateFood, highScore])

  const changeDirection = useCallback((newDir: Position) => {
    // Prevent reversing
    if (
      (newDir.x === -direction.current.x && newDir.x !== 0) ||
      (newDir.y === -direction.current.y && newDir.y !== 0)
    ) {
      return
    }
    nextDirection.current = newDir
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.code === 'Space') {
        if (!gameStartedRef.current || gameOverRef.current) {
          resetGame()
        }
        return
      }

      if (!gameStartedRef.current || gameOverRef.current) return

      switch (e.key) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          changeDirection({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          changeDirection({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          changeDirection({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [changeDirection, resetGame])

  // Draw initial state
  useEffect(() => {
    draw()
  }, [draw])

  // Game loop
  useEffect(() => {
    if (gameStartedRef.current && !gameOverRef.current) {
      if (gameLoopInterval.current) {
        clearInterval(gameLoopInterval.current)
      }
      gameLoopInterval.current = setInterval(update, GAME_SPEED)
    }

    return () => {
      if (gameLoopInterval.current) {
        clearInterval(gameLoopInterval.current)
        gameLoopInterval.current = null
      }
    }
  }, [gameStarted, gameOver, update])

  const handleCanvasClick = useCallback(() => {
    if (!gameStartedRef.current || gameOverRef.current) {
      resetGame()
    }
  }, [resetGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="mb-4 text-white">
        <div className="flex justify-between gap-8 text-xl">
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-4 border-gray-700 cursor-pointer"
        onClick={handleCanvasClick}
      />
      <p className="mt-4 text-lg text-white">Use Arrow Keys to move | Press SPACE to start/restart</p>
    </div>
  )
}
