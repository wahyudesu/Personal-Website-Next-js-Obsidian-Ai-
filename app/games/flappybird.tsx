"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'

const GRAVITY = 0.5
const JUMP_STRENGTH = 10
const PIPE_WIDTH = 52
const PIPE_GAP = 150
const PIPE_SPEED = 2
const BIRD_WIDTH = 34
const BIRD_HEIGHT = 24
const CANVAS_WIDTH = 288
const CANVAS_HEIGHT = 512

interface Position {
  x: number
  y: number
}

interface Pipe {
  x: number
  topHeight: number
}

export default function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  // Game state refs
  const birdY = useRef(200)
  const birdVelocity = useRef(0)
  const birdFrame = useRef(0)
  const pipes = useRef<Pipe[]>([])
  const currentScore = useRef(0)
  const frameCount = useRef(0)
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const animationId = useRef<number>()

  // Asset refs
  const birdSprites = useRef<HTMLImageElement[]>([])
  const backgroundImage = useRef<HTMLImageElement | null>(null)
  const numberSprites = useRef<HTMLImageElement[]>([])
  const gameOverImage = useRef<HTMLImageElement | null>(null)
  const messageImage = useRef<HTMLImageElement | null>(null)
  const pipeImage = useRef<HTMLImageElement | null>(null)
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  // Audio refs
  const pointSound = useRef<HTMLAudioElement | null>(null)
  const hitSound = useRef<HTMLAudioElement | null>(null)
  const wingSound = useRef<HTMLAudioElement | null>(null)

  // Load assets
  useEffect(() => {
    const birdUrls = [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-downflap-ZExrg9YxRxwFfLXDu6JijpJUQgByX6.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-midflap-8mBrx070GYsw2As4Ue9BfQJ5XNMUg3.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/yellowbird-upflap-hMo7jE66Ar0TzdbAMTzTMWaEGpTNx2.png'
    ]
    const numberUrls = [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-n6uJmiEzXXFf0NDHejRxdna8JdqZ9P.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-2s71zdNWUSfnqIUbOABB2QJzzbG7fR.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-QNpaMYRZvP9MgObyqVbxo7wu0MyjYE.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-6yXb5a7IxZyl8kdXXBatpxq48enb2d.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-9beOrHBy4QSBLifUwqaLXqbNWfK4Hr.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-pgAY4wiTYa2Ppho9w3YXtLx3UHryJI.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-5v6snji9HWY7UpBuqDkKDtck2zED4B.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-zTxqP8uIOG4OYFtl8x6Dby0mqKfNYo.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-gkhiN6iBVr2DY7SqrTZIEP7Q3doyo9.png',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-PxwOSLzHQAiMeneqctp2q5mzWAv0Kv.png'
    ]

    const loadImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })

    const loadAudio = (url: string) => new Promise<HTMLAudioElement>((resolve) => {
      const audio = new Audio(url)
      audio.oncanplaythrough = () => resolve(audio)
      audio.onerror = () => resolve(audio) // Don't fail on audio errors
      audio.src = url
    })

    Promise.all([
      ...birdUrls.map(loadImage),
      ...numberUrls.map(loadImage),
      loadImage('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-day-rvpnF7CJRMdBNqqBc8Zfzz3QpIfkBG.png'),
      loadImage('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gameover-NwA13AFRtIFat9QoA12T3lpjK76Qza.png'),
      loadImage('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/message-g1ru4NKF3KrKoFmiVpzR8fwdeLhwNa.png'),
      loadImage('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pipe-green-zrz2zTtoVXaLn6xDqgrNVF9luzjW1B.png'),
      loadAudio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/point-SdTORahWMlxujnLCoDbujDLHI6KFeC.wav'),
      loadAudio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hit-YVMFYQJEgZASG6O3xPWiyiqPtOLygb.wav'),
      loadAudio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wing-oOSsspXpVMDc0enrWj4WWLaHVqs6Hk.wav')
    ]).then((loadedAssets) => {
      birdSprites.current = loadedAssets.slice(0, 3) as HTMLImageElement[]
      numberSprites.current = loadedAssets.slice(3, 13) as HTMLImageElement[]
      backgroundImage.current = loadedAssets[13] as HTMLImageElement
      gameOverImage.current = loadedAssets[14] as HTMLImageElement
      messageImage.current = loadedAssets[15] as HTMLImageElement
      pipeImage.current = loadedAssets[16] as HTMLImageElement
      pointSound.current = loadedAssets[17] as HTMLAudioElement
      hitSound.current = loadedAssets[18] as HTMLAudioElement
      wingSound.current = loadedAssets[19] as HTMLAudioElement
      setAssetsLoaded(true)
    }).catch(err => {
      console.error("Error loading assets:", err)
      setAssetsLoaded(true) // Continue anyway
    })
  }, [])

  const playSound = useCallback((sound: HTMLAudioElement | null) => {
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(() => {}) // Ignore audio errors
    }
  }, [])

  const jump = useCallback(() => {
    if (!gameOverRef.current && gameStartedRef.current) {
      birdVelocity.current = -JUMP_STRENGTH
      playSound(wingSound.current)
    }
  }, [playSound])

  const startGame = useCallback(() => {
    birdY.current = 200
    birdVelocity.current = 0
    birdFrame.current = 0
    pipes.current = []
    currentScore.current = 0
    frameCount.current = 0
    gameStartedRef.current = true
    gameOverRef.current = false
    setGameStarted(true)
    setGameOver(false)
    setScore(0)
  }, [])

  const restartGame = useCallback(() => {
    startGame()
  }, [startGame])

  // Game loop
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw background
    if (backgroundImage.current) {
      ctx.drawImage(backgroundImage.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    if (!gameStartedRef.current) {
      // Draw message
      if (messageImage.current) {
        const messageWidth = 184
        const messageHeight = 267
        const messageX = (CANVAS_WIDTH - messageWidth) / 2
        const messageY = (CANVAS_HEIGHT - messageHeight) / 2
        ctx.drawImage(messageImage.current, messageX, messageY, messageWidth, messageHeight)
      }
      animationId.current = requestAnimationFrame(gameLoop)
      return
    }

    if (!gameOverRef.current) {
      // Update bird
      frameCount.current++
      if (frameCount.current % 5 === 0) {
        birdFrame.current = (birdFrame.current + 1) % 3
      }

      birdVelocity.current += GRAVITY
      birdY.current += birdVelocity.current

      // Update pipes
      pipes.current = pipes.current.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))

      // Generate new pipes
      if (pipes.current.length === 0 || pipes.current[pipes.current.length - 1].x < CANVAS_WIDTH - 200) {
        const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50
        pipes.current.push({ x: CANVAS_WIDTH, topHeight })
      }

      // Remove off-screen pipes and check for score
      const beforeLength = pipes.current.length
      pipes.current = pipes.current.filter(pipe => {
        if (pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH > 50 - PIPE_SPEED) {
          currentScore.current++
          setScore(currentScore.current)
          playSound(pointSound.current)
        }
        return pipe.x + PIPE_WIDTH > 0
      })

      // Check boundary collision
      if (birdY.current > CANVAS_HEIGHT - BIRD_HEIGHT || birdY.current < 0) {
        gameOverRef.current = true
        setGameOver(true)
        playSound(hitSound.current)
      }

      // Check pipe collision
      const birdRect = { x: 50, y: birdY.current, width: BIRD_WIDTH, height: BIRD_HEIGHT }
      for (const pipe of pipes.current) {
        const topPipeRect = { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.topHeight }
        const bottomPipeRect = {
          x: pipe.x,
          y: pipe.topHeight + PIPE_GAP,
          width: PIPE_WIDTH,
          height: CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP
        }

        if (
          birdRect.x < topPipeRect.x + topPipeRect.width &&
          birdRect.x + birdRect.width > topPipeRect.x &&
          birdRect.y < topPipeRect.y + topPipeRect.height &&
          birdRect.y + birdRect.height > topPipeRect.y
        ) {
          gameOverRef.current = true
          setGameOver(true)
          playSound(hitSound.current)
        }

        if (
          birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
          birdRect.x + birdRect.width > bottomPipeRect.x &&
          birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
          birdRect.y + birdRect.height > bottomPipeRect.y
        ) {
          gameOverRef.current = true
          setGameOver(true)
          playSound(hitSound.current)
        }
      }
    }

    // Draw pipes
    pipes.current.forEach(pipe => {
      if (pipeImage.current) {
        // Draw top pipe (flipped)
        ctx.save()
        ctx.scale(1, -1)
        ctx.drawImage(pipeImage.current, pipe.x, -pipe.topHeight, PIPE_WIDTH, 320)
        ctx.restore()

        // Draw bottom pipe
        ctx.drawImage(pipeImage.current, pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, 320)
      }
    })

    // Draw bird
    if (birdSprites.current[birdFrame.current]) {
      ctx.save()
      ctx.translate(50 + BIRD_WIDTH / 2, birdY.current + BIRD_HEIGHT / 2)
      ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, birdVelocity.current * 0.1)))
      ctx.drawImage(
        birdSprites.current[birdFrame.current],
        -BIRD_WIDTH / 2,
        -BIRD_HEIGHT / 2,
        BIRD_WIDTH,
        BIRD_HEIGHT
      )
      ctx.restore()
    }

    // Draw score
    const scoreString = currentScore.current.toString()
    const digitWidth = 24
    const totalWidth = scoreString.length * digitWidth
    const startX = (CANVAS_WIDTH - totalWidth) / 2
    scoreString.split('').forEach((digit, index) => {
      const digitImage = numberSprites.current[parseInt(digit)]
      if (digitImage) {
        ctx.drawImage(digitImage, startX + index * digitWidth, 20, digitWidth, 36)
      }
    })

    // Draw game over
    if (gameOverRef.current) {
      if (gameOverImage.current) {
        const gameOverWidth = 192
        const gameOverHeight = 42
        const gameOverX = (CANVAS_WIDTH - gameOverWidth) / 2
        const gameOverY = (CANVAS_HEIGHT - gameOverHeight) / 2
        ctx.drawImage(gameOverImage.current, gameOverX, gameOverY, gameOverWidth, gameOverHeight)

        // Draw Restart button
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.fillRect(CANVAS_WIDTH / 2 - 50, CANVAS_HEIGHT / 2 + 50, 100, 40)
        ctx.fillStyle = 'white'
        ctx.font = '20px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 75)
      }
    }

    animationId.current = requestAnimationFrame(gameLoop)
  }, [playSound])

  // Start game loop when assets loaded
  useEffect(() => {
    if (!assetsLoaded) return

    animationId.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current)
      }
    }
  }, [assetsLoaded, gameLoop])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        if (!gameStartedRef.current) {
          startGame()
        } else if (gameOverRef.current) {
          restartGame()
        } else {
          jump()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [jump, startGame, restartGame])

  // Mouse controls
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!gameStartedRef.current) {
      startGame()
    } else if (gameOverRef.current) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      // Check if clicked on restart button
      if (
        x >= CANVAS_WIDTH / 2 - 50 &&
        x <= CANVAS_WIDTH / 2 + 50 &&
        y >= CANVAS_HEIGHT / 2 + 50 &&
        y <= CANVAS_HEIGHT / 2 + 90
      ) {
        restartGame()
      }
    } else {
      jump()
    }
  }, [jump, startGame, restartGame])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-gray-300 cursor-pointer"
        onClick={handleCanvasClick}
      />
      <p className="mt-4 text-lg">Press Space to start/jump or click/tap the game area</p>
    </div>
  )
}
