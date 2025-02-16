import { useState, useEffect, useCallback, useRef } from 'react'
import { Bug, Volume2, VolumeX } from 'lucide-react'
import ConfettiGenerator from 'confetti-js'

interface BugPosition {
  id: number
  x: number
  y: number
  speed: number
  direction: number
  size: 'small' | 'medium' | 'large'
}

const BUG_SIZES = {
  small: { scale: 1, points: 10, color: '#4ec9b0' },
  medium: { scale: 1.5, points: 20, color: '#569cd6' },
  large: { scale: 2, points: 30, color: '#ce9178' }
}

const BugGame = () => {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [bugs, setBugs] = useState<BugPosition[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [level, setLevel] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const confettiRef = useRef<HTMLCanvasElement>(null)

  // Sound effects
  const shootSound = new Audio('/sounds/shoot.mp3')
  const bugDeathSound = new Audio('/sounds/bug-death.mp3')
  const gameOverSound = new Audio('/sounds/game-over.mp3')
  const levelUpSound = new Audio('/sounds/level-up.mp3')

  const playSound = useCallback((sound: HTMLAudioElement) => {
    if (!isMuted) {
      sound.currentTime = 0
      sound.play().catch(() => {
        // Handle any playback errors silently
      })
    }
  }, [isMuted])

  const startConfetti = useCallback(() => {
    if (confettiRef.current) {
      const confettiSettings = {
        target: confettiRef.current,
        max: 80,
        size: 1.5,
        animate: true,
        props: ['circle', 'square', 'triangle', 'line'],
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]],
        clock: 25,
        rotate: true,
        start_from_edge: true,
        respawn: false
      }
      const confetti = new ConfettiGenerator(confettiSettings)
      confetti.render()

      // Stop confetti after 2 seconds
      setTimeout(() => {
        confetti.clear()
      }, 2000)
    }
  }, [])

  const spawnBug = useCallback(() => {
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large']
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    
    const newBug: BugPosition = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      speed: 2 + Math.random() * (level * 0.5),
      direction: Math.random() * Math.PI * 2,
      size
    }
    setBugs(prev => [...prev, newBug])
  }, [level])

  const removeBug = (id: number, size: 'small' | 'medium' | 'large') => {
    playSound(bugDeathSound)
    setBugs(prev => prev.filter(bug => bug.id !== id))
    setScore(prev => {
      const newScore = prev + (BUG_SIZES[size].points * level)
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('bugHunterHighScore', newScore.toString())
        startConfetti() // Celebrate new high score
      }
      return newScore
    })
  }

  const startGame = () => {
    setIsPlaying(true)
    setScore(0)
    setTimeLeft(30)
    setLevel(1)
    setBugs([])
  }

  // Load high score
  useEffect(() => {
    const savedHighScore = localStorage.getItem('bugHunterHighScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
  }, [])

  // Game timer
  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false)
          playSound(gameOverSound)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying])

  // Spawn bugs
  useEffect(() => {
    if (!isPlaying) return

    const spawnInterval = setInterval(() => {
      spawnBug()
    }, 2000 / level)

    return () => clearInterval(spawnInterval)
  }, [isPlaying, level, spawnBug])

  // Move bugs
  useEffect(() => {
    if (!isPlaying) return

    const moveInterval = setInterval(() => {
      setBugs(prev => prev.map(bug => {
        let newX = bug.x + Math.cos(bug.direction) * bug.speed
        let newY = bug.y + Math.sin(bug.direction) * bug.speed

        // Bounce off walls
        if (newX < 0 || newX > window.innerWidth - 100) {
          bug.direction = Math.PI - bug.direction
          newX = bug.x
        }
        if (newY < 0 || newY > window.innerHeight - 100) {
          bug.direction = -bug.direction
          newY = bug.y
        }

        return { ...bug, x: newX, y: newY }
      }))
    }, 16)

    return () => clearInterval(moveInterval)
  }, [isPlaying])

  // Level up
  useEffect(() => {
    if (score >= level * 100) {
      setLevel(prev => prev + 1)
    }
  }, [score, level])

  // Level up effect
  useEffect(() => {
    if (level > 1) {
      playSound(levelUpSound)
      startConfetti()
    }
  }, [level, playSound, startConfetti])

  return (
    <div className="relative w-full h-full bg-[#1e1e1e] overflow-hidden p-6">
      <canvas 
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Header */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 hover:bg-[#37373d] rounded-md transition-colors text-white/80"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Score Display */}
      <div className="absolute top-4 left-4 text-white/80 space-y-2 bg-[#2d2d2d] p-4 rounded-lg">
        <div className="text-lg">Score: {score}</div>
        <div className="text-lg">High Score: {highScore}</div>
        <div className="text-lg">Level: {level}</div>
        <div className="text-lg">Time: {timeLeft}s</div>
      </div>

      {/* Bug Legend */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-6 bg-[#2d2d2d] p-4 rounded-lg">
        {Object.entries(BUG_SIZES).map(([size, { points, color }]) => (
          <div key={size} className="flex items-center gap-2 text-white/80">
            <Bug style={{ color }} size={16 * (size === 'small' ? 1 : size === 'medium' ? 1.5 : 2)} />
            <span>{points} pts</span>
          </div>
        ))}
      </div>

      {/* Bugs */}
      {bugs.map(bug => (
        <button
          key={bug.id}
          className="absolute transition-transform hover:scale-110 active:scale-95"
          style={{ 
            left: bug.x,
            top: bug.y,
            transform: `rotate(${(bug.direction * 180) / Math.PI}deg)`,
            color: BUG_SIZES[bug.size].color
          }}
          onClick={() => {
            playSound(shootSound)
            removeBug(bug.id, bug.size)
          }}
        >
          <Bug 
            className="transition-colors" 
            size={24 * BUG_SIZES[bug.size].scale}
          />
        </button>
      ))}

      {/* Start/Game Over Screen */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-white">
              {timeLeft === 0 ? 'Game Over!' : 'Bug Hunter'}
            </h2>
            {timeLeft === 0 && (
              <p className="text-xl text-white">Final Score: {score}</p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-2 bg-vscode-accent text-white rounded-md hover:bg-vscode-accent/80 transition-colors"
            >
              {timeLeft === 0 ? 'Play Again' : 'Start Game'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BugGame