"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 20
const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE
const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_DIRECTION = { x: 1, y: 0 }
const GAME_SPEED = 100 // milliseconds

interface Position {
  x: number
  y: number
}

interface Direction {
  x: number
  y: number
}

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(0)

  // Use refs for game state
  const snakeRef = useRef<Position[]>(INITIAL_SNAKE)
  const directionRef = useRef<Direction>(INITIAL_DIRECTION)
  const nextDirectionRef = useRef<Direction>(INITIAL_DIRECTION)
  const foodRef = useRef<Position>({ x: 15, y: 15 })
  const scoreRef = useRef(0)
  const gameOverRef = useRef(false)
  const gameStartedRef = useRef(false)
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [])

  const generateFood = useCallback(() => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [])

  const resetGame = useCallback(() => {
    snakeRef.current = [...INITIAL_SNAKE]
    directionRef.current = { ...INITIAL_DIRECTION }
    nextDirectionRef.current = { ...INITIAL_DIRECTION }
    foodRef.current = generateFood()
    scoreRef.current = 0
    gameOverRef.current = false
    gameStartedRef.current = true
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }, [generateFood])

  const drawGame = useCallback(() => {
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
      foodRef.current.x * CELL_SIZE + 2,
      foodRef.current.y * CELL_SIZE + 2,
      CELL_SIZE - 4,
      CELL_SIZE - 4
    )

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#44ff44'
      } else {
        // Body
        ctx.fillStyle = '#88ff88'
      }
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
      ctx.fillText(`Score: ${scoreRef.current}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      ctx.fillText('Press SPACE or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40)
    }
  }, [])

  const updateGame = useCallback(() => {
    if (gameOverRef.current || !gameStartedRef.current) return

    // Update direction
    directionRef.current = { ...nextDirectionRef.current }

    // Calculate new head position
    const head = snakeRef.current[0]
    const newHead: Position = {
      x: head.x + directionRef.current.x,
      y: head.y + directionRef.current.y
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      gameOverRef.current = true
      setGameOver(true)

      // Update high score
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
        localStorage.setItem('snakeHighScore', scoreRef.current.toString())
      }
      return
    }

    // Check self collision
    if (snakeRef.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      gameOverRef.current = true
      setGameOver(true)

      // Update high score
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current)
        localStorage.setItem('snakeHighScore', scoreRef.current.toString())
      }
      return
    }

    // Add new head
    snakeRef.current.unshift(newHead)

    // Check food collision
    if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
      scoreRef.current++
      setScore(scoreRef.current)
      foodRef.current = generateFood()
    } else {
      // Remove tail if no food eaten
      snakeRef.current.pop()
    }

    drawGame()
  }, [drawGame, generateFood, highScore])

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    // Prevent reversing
    if (
      (newDirection.x === -directionRef.current.x && newDirection.x !== 0) ||
      (newDirection.y === -directionRef.current.y && newDirection.y !== 0)
    ) {
      return
    }
    nextDirectionRef.current = newDirection
  }, [])

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
          handleDirectionChange({ x: 0, y: -1 })
          break
        case 'ArrowDown':
          handleDirectionChange({ x: 0, y: 1 })
          break
        case 'ArrowLeft':
          handleDirectionChange({ x: -1, y: 0 })
          break
        case 'ArrowRight':
          handleDirectionChange({ x: 1, y: 0 })
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleDirectionChange, resetGame])

  useEffect(() => {
    drawGame()

    if (gameStartedRef.current && !gameOverRef.current) {
      gameLoopRef.current = setInterval(updateGame, GAME_SPEED)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [drawGame, updateGame])

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
        className="border-4 border-gray-700"
        onClick={handleCanvasClick}
      />
      <p className="mt-4 text-lg text-white">Use Arrow Keys to move | Press SPACE to start/restart</p>
    </div>
  )
}
