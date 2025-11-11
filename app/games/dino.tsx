"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 200
const GROUND_HEIGHT = 170
const DINO_WIDTH = 44
const DINO_HEIGHT = 47
const DINO_X = 50
const GRAVITY = 0.6
const JUMP_STRENGTH = 13
const GAME_SPEED_START = 6
const GAME_SPEED_INCREMENT = 0.0005
const OBSTACLE_WIDTH = 20
const OBSTACLE_HEIGHT_MIN = 30
const OBSTACLE_HEIGHT_MAX = 50
const OBSTACLE_SPACING_MIN = 400
const OBSTACLE_SPACING_MAX = 800
const BIRD_WIDTH = 46
const BIRD_HEIGHT = 40
const BIRD_Y_MIN = 80
const BIRD_Y_MAX = 120

interface Dino {
  y: number
  velocity: number
  isJumping: boolean
}

interface Obstacle {
  x: number
  width: number
  height: number
  type: 'cactus' | 'bird'
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Use refs for game state
  const dinoRef = useRef<Dino>({ y: GROUND_HEIGHT - DINO_HEIGHT, velocity: 0, isJumping: false })
  const obstaclesRef = useRef<Obstacle[]>([])
  const scoreRef = useRef(0)
  const gameSpeedRef = useRef(GAME_SPEED_START)
  const gameOverRef = useRef(false)
  const gameStartedRef = useRef(false)
  const animationFrameRef = useRef<number | null>(null)
  const frameCountRef = useRef(0)
  const cloudPositionsRef = useRef<{ x: number; y: number }[]>([])

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('dinoHighScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }

    // Initialize clouds
    for (let i = 0; i < 5; i++) {
      cloudPositionsRef.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: Math.random() * 50 + 20
      })
    }
  }, [])

  const resetGame = useCallback(() => {
    dinoRef.current = { y: GROUND_HEIGHT - DINO_HEIGHT, velocity: 0, isJumping: false }
    obstaclesRef.current = []
    scoreRef.current = 0
    gameSpeedRef.current = GAME_SPEED_START
    gameOverRef.current = false
    gameStartedRef.current = true
    frameCountRef.current = 0
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }, [])

  const jump = useCallback(() => {
    if (!dinoRef.current.isJumping && !gameOverRef.current && gameStartedRef.current) {
      dinoRef.current.velocity = -JUMP_STRENGTH
      dinoRef.current.isJumping = true
    }
  }, [])

  const drawDino = useCallback((ctx: CanvasRenderingContext2D) => {
    const dino = dinoRef.current

    // Simple dino shape
    ctx.fillStyle = '#535353'

    // Body
    ctx.fillRect(DINO_X, dino.y, DINO_WIDTH, DINO_HEIGHT)

    // Eye
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(DINO_X + 30, dino.y + 10, 6, 6)

    // Legs animation (only when on ground)
    if (!dino.isJumping) {
      const legOffset = Math.floor(frameCountRef.current / 5) % 2 === 0 ? 0 : 8
      ctx.fillStyle = '#535353'
      ctx.fillRect(DINO_X + 10 + legOffset, dino.y + DINO_HEIGHT, 8, 10)
      ctx.fillRect(DINO_X + 26 - legOffset, dino.y + DINO_HEIGHT, 8, 10)
    }
  }, [])

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    if (obstacle.type === 'cactus') {
      ctx.fillStyle = '#535353'
      ctx.fillRect(obstacle.x, GROUND_HEIGHT - obstacle.height, obstacle.width, obstacle.height)

      // Cactus arms
      ctx.fillRect(obstacle.x - 5, GROUND_HEIGHT - obstacle.height + 10, 5, 15)
      ctx.fillRect(obstacle.x + obstacle.width, GROUND_HEIGHT - obstacle.height + 10, 5, 15)
    } else if (obstacle.type === 'bird') {
      ctx.fillStyle = '#535353'

      // Bird body
      const birdY = GROUND_HEIGHT - obstacle.height
      ctx.fillRect(obstacle.x + 10, birdY + 15, 26, 10)

      // Bird wings (animated)
      const wingOffset = Math.floor(frameCountRef.current / 5) % 2 === 0 ? 0 : 5
      ctx.fillRect(obstacle.x, birdY + 10 - wingOffset, 46, 8)
      ctx.fillRect(obstacle.x, birdY + 25 + wingOffset, 46, 8)

      // Bird head
      ctx.fillRect(obstacle.x + 30, birdY + 10, 10, 15)
    }
  }, [])

  const drawGround = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#535353'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GROUND_HEIGHT)
    ctx.lineTo(CANVAS_WIDTH, GROUND_HEIGHT)
    ctx.stroke()

    // Ground pattern
    const groundOffset = (frameCountRef.current * gameSpeedRef.current) % 20
    for (let i = -20; i < CANVAS_WIDTH; i += 20) {
      ctx.fillStyle = '#535353'
      ctx.fillRect(i - groundOffset, GROUND_HEIGHT + 5, 2, 2)
    }
  }, [])

  const drawClouds = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#c4c4c4'

    cloudPositionsRef.current.forEach((cloud, index) => {
      // Move clouds slowly
      cloud.x -= gameSpeedRef.current * 0.3
      if (cloud.x < -50) {
        cloud.x = CANVAS_WIDTH + 50
        cloud.y = Math.random() * 50 + 20
      }

      // Draw simple cloud
      ctx.beginPath()
      ctx.arc(cloud.x, cloud.y, 15, 0, Math.PI * 2)
      ctx.arc(cloud.x + 15, cloud.y, 20, 0, Math.PI * 2)
      ctx.arc(cloud.x + 30, cloud.y, 15, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [])

  const checkCollision = useCallback(() => {
    const dino = dinoRef.current
    const dinoRect = {
      x: DINO_X + 5,
      y: dino.y + 5,
      width: DINO_WIDTH - 10,
      height: DINO_HEIGHT - 10
    }

    for (const obstacle of obstaclesRef.current) {
      let obstacleRect
      if (obstacle.type === 'cactus') {
        obstacleRect = {
          x: obstacle.x + 5,
          y: GROUND_HEIGHT - obstacle.height + 5,
          width: obstacle.width - 10,
          height: obstacle.height - 10
        }
      } else {
        // Bird
        obstacleRect = {
          x: obstacle.x + 10,
          y: GROUND_HEIGHT - obstacle.height + 10,
          width: BIRD_WIDTH - 20,
          height: BIRD_HEIGHT - 20
        }
      }

      if (
        dinoRect.x < obstacleRect.x + obstacleRect.width &&
        dinoRect.x + dinoRect.width > obstacleRect.x &&
        dinoRect.y < obstacleRect.y + obstacleRect.height &&
        dinoRect.y + dinoRect.height > obstacleRect.y
      ) {
        return true
      }
    }
    return false
  }, [])

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.fillStyle = '#f7f7f7'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw clouds
    drawClouds(ctx)

    // Draw ground
    drawGround(ctx)

    if (!gameStartedRef.current) {
      // Draw start message
      ctx.fillStyle = '#535353'
      ctx.font = '20px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Press SPACE or Click to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)

      // Draw dino at start position
      drawDino(ctx)

      animationFrameRef.current = requestAnimationFrame(updateGame)
      return
    }

    if (!gameOverRef.current) {
      frameCountRef.current++

      // Update dino physics
      dinoRef.current.velocity += GRAVITY
      dinoRef.current.y += dinoRef.current.velocity

      // Ground collision
      if (dinoRef.current.y >= GROUND_HEIGHT - DINO_HEIGHT) {
        dinoRef.current.y = GROUND_HEIGHT - DINO_HEIGHT
        dinoRef.current.velocity = 0
        dinoRef.current.isJumping = false
      }

      // Increase game speed gradually
      gameSpeedRef.current += GAME_SPEED_INCREMENT

      // Generate obstacles
      if (
        obstaclesRef.current.length === 0 ||
        obstaclesRef.current[obstaclesRef.current.length - 1].x <
          CANVAS_WIDTH - (OBSTACLE_SPACING_MIN + Math.random() * (OBSTACLE_SPACING_MAX - OBSTACLE_SPACING_MIN))
      ) {
        const obstacleType = Math.random() > 0.3 ? 'cactus' : 'bird'

        if (obstacleType === 'cactus') {
          obstaclesRef.current.push({
            x: CANVAS_WIDTH,
            width: OBSTACLE_WIDTH,
            height: OBSTACLE_HEIGHT_MIN + Math.random() * (OBSTACLE_HEIGHT_MAX - OBSTACLE_HEIGHT_MIN),
            type: 'cactus'
          })
        } else {
          obstaclesRef.current.push({
            x: CANVAS_WIDTH,
            width: BIRD_WIDTH,
            height: BIRD_Y_MIN + Math.random() * (BIRD_Y_MAX - BIRD_Y_MIN),
            type: 'bird'
          })
        }
      }

      // Move obstacles
      obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
        obstacle.x -= gameSpeedRef.current
        return obstacle.x + obstacle.width > 0
      })

      // Update score
      if (frameCountRef.current % 10 === 0) {
        scoreRef.current++
        setScore(scoreRef.current)
      }

      // Check collision
      if (checkCollision()) {
        gameOverRef.current = true
        setGameOver(true)

        // Update high score
        if (scoreRef.current > highScore) {
          setHighScore(scoreRef.current)
          localStorage.setItem('dinoHighScore', scoreRef.current.toString())
        }
      }
    }

    // Draw game objects
    obstaclesRef.current.forEach(obstacle => drawObstacle(ctx, obstacle))
    drawDino(ctx)

    // Draw score
    ctx.fillStyle = '#535353'
    ctx.font = '20px monospace'
    ctx.textAlign = 'right'
    ctx.fillText(`HI ${highScore.toString().padStart(5, '0')} ${scoreRef.current.toString().padStart(5, '0')}`, CANVAS_WIDTH - 10, 30)

    if (gameOverRef.current) {
      ctx.fillStyle = '#535353'
      ctx.font = '24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20)
      ctx.font = '16px Arial'
      ctx.fillText('Press SPACE or Click to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10)
    }

    animationFrameRef.current = requestAnimationFrame(updateGame)
  }, [drawDino, drawObstacle, drawGround, drawClouds, checkCollision, highScore])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!gameStartedRef.current || gameOverRef.current) {
          resetGame()
        } else {
          jump()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [jump, resetGame])

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateGame)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [updateGame])

  const handleCanvasClick = useCallback(() => {
    if (!gameStartedRef.current || gameOverRef.current) {
      resetGame()
    } else {
      jump()
    }
  }, [jump, resetGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 cursor-pointer"
        onClick={handleCanvasClick}
      />
      <p className="mt-4 text-lg text-gray-700">Press SPACE or Click to jump</p>
    </div>
  )
}
