"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 200
const GROUND_Y = 170
const DINO_WIDTH = 44
const DINO_HEIGHT = 47
const DINO_X = 50
const GRAVITY = 0.6
const JUMP_VELOCITY = -12
const INITIAL_SPEED = 6
const SPEED_INCREMENT = 0.0005
const MAX_SPEED = 13

interface Dino {
  y: number
  velocityY: number
  isDucking: boolean
  isJumping: boolean
}

interface Obstacle {
  x: number
  type: 'cactus-small' | 'cactus-medium' | 'cactus-large' | 'pterodactyl'
  height: number
}

interface Cloud {
  x: number
  y: number
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  // Game state refs
  const dino = useRef<Dino>({ y: GROUND_Y, velocityY: 0, isDucking: false, isJumping: false })
  const obstacles = useRef<Obstacle[]>([])
  const clouds = useRef<Cloud[]>([])
  const currentScore = useRef(0)
  const gameSpeed = useRef(INITIAL_SPEED)
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const animationId = useRef<number>()
  const frameCount = useRef(0)
  const groundX = useRef(0)
  const nextObstacleFrame = useRef(0)

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('dinoHighScore')
    if (saved) setHighScore(parseInt(saved))

    // Initialize clouds
    for (let i = 0; i < 3; i++) {
      clouds.current.push({
        x: Math.random() * CANVAS_WIDTH,
        y: 20 + Math.random() * 60
      })
    }
  }, [])

  const resetGame = useCallback(() => {
    dino.current = { y: GROUND_Y, velocityY: 0, isDucking: false, isJumping: false }
    obstacles.current = []
    currentScore.current = 0
    gameSpeed.current = INITIAL_SPEED
    gameStartedRef.current = true
    gameOverRef.current = false
    frameCount.current = 0
    groundX.current = 0
    nextObstacleFrame.current = 100
    setScore(0)
    setGameStarted(true)
    setGameOver(false)
  }, [])

  const jump = useCallback(() => {
    if (!dino.current.isJumping && !gameOverRef.current && gameStartedRef.current) {
      dino.current.velocityY = JUMP_VELOCITY
      dino.current.isJumping = true
    }
  }, [])

  const duck = useCallback((isDucking: boolean) => {
    if (!dino.current.isJumping && gameStartedRef.current && !gameOverRef.current) {
      dino.current.isDucking = isDucking
    }
  }, [])

  const drawDino = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#535353'

    const legFrame = Math.floor(frameCount.current / 6) % 2

    if (dino.current.isDucking) {
      // Ducking dino (smaller)
      // Body
      ctx.fillRect(DINO_X, dino.current.y + 20, 58, 27)
      // Head
      ctx.fillRect(DINO_X + 40, dino.current.y + 12, 22, 18)
      // Eye
      ctx.fillStyle = '#fff'
      ctx.fillRect(DINO_X + 54, dino.current.y + 16, 4, 4)
      // Tail
      ctx.fillStyle = '#535353'
      ctx.fillRect(DINO_X, dino.current.y + 24, 8, 8)
    } else {
      // Normal dino
      // Body
      ctx.fillRect(DINO_X + 6, dino.current.y + 20, 22, 24)
      // Tail
      ctx.fillRect(DINO_X, dino.current.y + 26, 8, 8)
      // Neck
      ctx.fillRect(DINO_X + 20, dino.current.y + 12, 8, 16)
      // Head
      ctx.fillRect(DINO_X + 24, dino.current.y + 4, 20, 18)
      // Eye
      ctx.fillStyle = '#fff'
      ctx.fillRect(DINO_X + 32, dino.current.y + 8, 4, 4)
      // Mouth
      ctx.fillStyle = '#535353'
      ctx.fillRect(DINO_X + 40, dino.current.y + 14, 4, 4)

      // Arms
      ctx.fillRect(DINO_X + 18, dino.current.y + 24, 6, 4)

      // Legs (only animate when on ground)
      if (!dino.current.isJumping) {
        if (legFrame === 0) {
          ctx.fillRect(DINO_X + 10, dino.current.y + 44, 6, 6)
          ctx.fillRect(DINO_X + 20, dino.current.y + 42, 6, 8)
        } else {
          ctx.fillRect(DINO_X + 10, dino.current.y + 42, 6, 8)
          ctx.fillRect(DINO_X + 20, dino.current.y + 44, 6, 6)
        }
      } else {
        ctx.fillRect(DINO_X + 10, dino.current.y + 42, 6, 8)
        ctx.fillRect(DINO_X + 20, dino.current.y + 42, 6, 8)
      }
    }
  }, [])

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    ctx.fillStyle = '#535353'

    if (obstacle.type.startsWith('cactus')) {
      const height = obstacle.type === 'cactus-small' ? 35 : obstacle.type === 'cactus-medium' ? 50 : 60
      const width = 20

      // Main cactus body
      ctx.fillRect(obstacle.x + 6, GROUND_Y - height, 8, height)

      // Arms
      if (obstacle.type !== 'cactus-small') {
        ctx.fillRect(obstacle.x, GROUND_Y - height + 12, 6, 16)
        ctx.fillRect(obstacle.x + 14, GROUND_Y - height + 12, 6, 16)
        ctx.fillRect(obstacle.x, GROUND_Y - height + 12, 10, 6)
        ctx.fillRect(obstacle.x + 10, GROUND_Y - height + 12, 10, 6)
      }
    } else if (obstacle.type === 'pterodactyl') {
      const y = obstacle.height
      const wingFrame = Math.floor(frameCount.current / 8) % 2

      // Body
      ctx.fillRect(obstacle.x + 8, y + 6, 18, 14)
      // Head
      ctx.fillRect(obstacle.x + 22, y + 2, 12, 10)
      // Beak
      ctx.fillRect(obstacle.x + 34, y + 6, 6, 4)
      // Tail
      ctx.fillRect(obstacle.x, y + 10, 10, 6)

      // Wings
      if (wingFrame === 0) {
        ctx.fillRect(obstacle.x + 10, y, 16, 6)
        ctx.fillRect(obstacle.x + 10, y + 20, 16, 6)
      } else {
        ctx.fillRect(obstacle.x + 8, y - 4, 18, 8)
        ctx.fillRect(obstacle.x + 8, y + 20, 18, 8)
      }
    }
  }, [])

  const drawGround = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#535353'
    ctx.lineWidth = 2

    // Ground line
    ctx.beginPath()
    ctx.moveTo(0, GROUND_Y)
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y)
    ctx.stroke()

    // Ground bumps
    const bumpSpacing = 20
    for (let i = 0; i < CANVAS_WIDTH / bumpSpacing + 2; i++) {
      const x = (i * bumpSpacing - groundX.current % bumpSpacing) | 0
      if (Math.random() > 0.5) {
        ctx.fillRect(x, GROUND_Y + 2, 2, 2)
      }
    }
  }, [])

  const drawClouds = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#c4c4c4'

    clouds.current.forEach(cloud => {
      // Move cloud
      cloud.x -= gameSpeed.current * 0.2
      if (cloud.x < -60) {
        cloud.x = CANVAS_WIDTH + 60
        cloud.y = 20 + Math.random() * 60
      }

      // Draw cloud (simple pixel cloud)
      ctx.fillRect(cloud.x, cloud.y, 20, 8)
      ctx.fillRect(cloud.x + 10, cloud.y - 6, 20, 8)
      ctx.fillRect(cloud.x + 20, cloud.y, 20, 8)
    })
  }, [])

  const checkCollision = useCallback(() => {
    const dinoRect = dino.current.isDucking
      ? { x: DINO_X, y: dino.current.y + 20, width: 58, height: 27 }
      : { x: DINO_X + 10, y: dino.current.y + 4, width: 30, height: 46 }

    for (const obstacle of obstacles.current) {
      let obstacleRect

      if (obstacle.type.startsWith('cactus')) {
        const height = obstacle.type === 'cactus-small' ? 35 : obstacle.type === 'cactus-medium' ? 50 : 60
        obstacleRect = {
          x: obstacle.x + 4,
          y: GROUND_Y - height,
          width: 12,
          height: height
        }
      } else {
        obstacleRect = {
          x: obstacle.x + 8,
          y: obstacle.height + 2,
          width: 30,
          height: 20
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

  const gameLoop = useCallback(() => {
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
      ctx.font = '16px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Press SPACE or ↑ to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
      drawDino(ctx)
      animationId.current = requestAnimationFrame(gameLoop)
      return
    }

    if (!gameOverRef.current) {
      frameCount.current++

      // Update dino physics
      dino.current.velocityY += GRAVITY
      dino.current.y += dino.current.velocityY

      // Ground collision
      if (dino.current.y >= GROUND_Y) {
        dino.current.y = GROUND_Y
        dino.current.velocityY = 0
        dino.current.isJumping = false
      }

      // Update ground
      groundX.current += gameSpeed.current

      // Update game speed
      if (gameSpeed.current < MAX_SPEED) {
        gameSpeed.current += SPEED_INCREMENT
      }

      // Generate obstacles
      if (frameCount.current >= nextObstacleFrame.current) {
        const types: ('cactus-small' | 'cactus-medium' | 'cactus-large' | 'pterodactyl')[] = [
          'cactus-small',
          'cactus-medium',
          'cactus-large',
          'pterodactyl'
        ]
        const type = types[Math.floor(Math.random() * types.length)]

        const obstacle: Obstacle = {
          x: CANVAS_WIDTH,
          type,
          height: type === 'pterodactyl' ? GROUND_Y - 60 - Math.floor(Math.random() * 40) : 0
        }

        obstacles.current.push(obstacle)
        nextObstacleFrame.current = frameCount.current + 60 + Math.floor(Math.random() * 90)
      }

      // Move obstacles
      obstacles.current = obstacles.current.filter(obstacle => {
        obstacle.x -= gameSpeed.current
        return obstacle.x > -100
      })

      // Update score
      if (frameCount.current % 6 === 0) {
        currentScore.current++
        setScore(currentScore.current)
      }

      // Check collision
      if (checkCollision()) {
        gameOverRef.current = true
        setGameOver(true)

        if (currentScore.current > highScore) {
          setHighScore(currentScore.current)
          localStorage.setItem('dinoHighScore', currentScore.current.toString())
        }
      }
    }

    // Draw obstacles
    obstacles.current.forEach(obstacle => drawObstacle(ctx, obstacle))

    // Draw dino
    drawDino(ctx)

    // Draw score
    ctx.fillStyle = '#535353'
    ctx.font = '16px monospace'
    ctx.textAlign = 'right'
    const scoreText = currentScore.current.toString().padStart(5, '0')
    const hiScoreText = highScore.toString().padStart(5, '0')
    ctx.fillText(`HI ${hiScoreText} ${scoreText}`, CANVAS_WIDTH - 20, 30)

    // Draw game over
    if (gameOverRef.current) {
      ctx.fillStyle = '#535353'
      ctx.font = '20px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('G A M E  O V E R', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10)
      ctx.font = '14px monospace'
      ctx.fillText('Press SPACE or ↑ to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15)

      // Draw restart icon
      ctx.fillStyle = '#535353'
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 45, 18, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#f7f7f7'
      ctx.beginPath()
      ctx.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 45, 14, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#535353'
      ctx.beginPath()
      ctx.moveTo(CANVAS_WIDTH / 2 - 4, CANVAS_HEIGHT / 2 - 50)
      ctx.lineTo(CANVAS_WIDTH / 2 - 4, CANVAS_HEIGHT / 2 - 40)
      ctx.lineTo(CANVAS_WIDTH / 2 + 6, CANVAS_HEIGHT / 2 - 45)
      ctx.fill()
    }

    animationId.current = requestAnimationFrame(gameLoop)
  }, [drawDino, drawObstacle, drawGround, drawClouds, checkCollision, highScore])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault()
        if (!gameStartedRef.current || gameOverRef.current) {
          resetGame()
        } else {
          jump()
        }
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        duck(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
        e.preventDefault()
        duck(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [jump, duck, resetGame])

  // Game loop
  useEffect(() => {
    animationId.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [gameLoop])

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
      <p className="mt-4 text-lg text-gray-700">Press SPACE or ↑ to jump | ↓ to duck</p>
    </div>
  )
}
