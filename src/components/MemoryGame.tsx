import React, { useState, useEffect } from 'react';
import { Shuffle, RefreshCw, Clock, Award, ChevronUp } from 'lucide-react';


interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

const TECH_ICONS = [
'⚛️', // React
'🔷', // TypeScript
'🟨', // JavaScript
'🟦', // CSS
'🟧', // HTML
'🐍', // Python
'☕', // Java
'🟢' // Node.js
];

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showStats, setShowStats] = useState<boolean>(true);

  // Initialize game
  const initializeGame = () => {
    // Create pairs of cards with icons
    const cardPairs = [...TECH_ICONS, ...TECH_ICONS].map((icon, index) => ({
      id: index,
      icon,
      flipped: false,
      matched: false
    }));

    // Shuffle cards
    const shuffledCards = shuffleArray(cardPairs);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameStarted(false);
    setGameCompleted(false);
    setTimer(0);
  };

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === TECH_ICONS.length && gameStarted) {
      setGameCompleted(true);
      
      // Update best score if current score is better or if there's no best score yet
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('memoryGameBestScore', moves.toString());
      }
    }
  }, [matchedPairs, gameStarted, moves, bestScore]);

  // Handle card click
  const handleCardClick = (id: number) => {
    // Prevent clicks if:
    // 1. Card is already flipped or matched
    // 2. Two cards are already flipped and being checked
    if (
      cards.find(card => card.id === id)?.flipped ||
      cards.find(card => card.id === id)?.matched ||
      flippedCards.length >= 2
    ) {
      return;
    }
    
    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Flip the card
    setCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, flipped: true } : card
      )
    );
    
    // Add card to flipped cards
    setFlippedCards(prev => [...prev, id]);
    
    // If this is the second card flipped
    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      
      // Get the first flipped card
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === id);
      
      // Check if cards match
      if (firstCard?.icon === secondCard?.icon) {
        // Mark cards as matched
        setCards(prev => 
          prev.map(card => 
            card.id === firstCardId || card.id === id
              ? { ...card, matched: true }
              : card
          )
        );
        
        // Increment matched pairs
        setMatchedPairs(prev => prev + 1);
        
        // Reset flipped cards
        setFlippedCards([]);
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          setCards(prev => 
            prev.map(card => 
              card.id === firstCardId || card.id === id
                ? { ...card, flipped: false }
                : card
            )
          );
          
          // Reset flipped cards
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Shuffle array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-auto p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-white/90">Memory Match</h1>
          
          <div className="flex gap-2">
            <button
              onClick={initializeGame}
              className="p-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded-md transition-colors"
              title="New Game">
              
              <Shuffle size={18} className="text-white/70" />
            </button>
            <button
              onClick={() => {
                setCards(shuffleArray(cards));
                if (!gameStarted) {
                  setGameStarted(true);
                }
              }}
              className="p-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded-md transition-colors"
              title="Shuffle Cards">
              
              <RefreshCw size={18} className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="relative mb-4">
          <div
            className={`bg-[#2d2d2d] rounded-md p-3 transition-all duration-300 ${
            showStats ? 'max-h-40' : 'max-h-10 overflow-hidden'}`
            }>

            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowStats(!showStats)}>

              <h2 className="text-white/80 font-medium">Game Stats</h2>
              <ChevronUp
                size={18}
                className={`text-white/60 transition-transform duration-300 ${
                showStats ? '' : 'transform rotate-180'}`
                } />

            </div>

            {showStats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Time
                  </div>
                  <div className="text-lg text-white/90 font-mono">
                    {formatTime(timer)}
                  </div>
                </div>

                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1">Moves</div>
                  <div className="text-lg text-white/90 font-mono">{moves}</div>
                </div>

                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1">Pairs Found</div>
                  <div className="text-lg text-white/90 font-mono">
                    {matchedPairs}/{TECH_ICONS.length}
                  </div>
                </div>

                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1 flex items-center">
                    <Award size={12} className="mr-1" />
                    Best Score
                  </div>
                  <div className="text-lg text-white/90 font-mono">
                    {bestScore !== null ? bestScore : '-'}
                  </div>
                </div>
              </div>
              )}
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square flex items-center justify-center rounded-md text-3xl cursor-pointer transition-all duration-300 transform ${
              card.flipped || card.matched ?
              'bg-[#1e1e1e] rotate-y-180' :
              'bg-[#2d2d2d] hover:bg-[#3d3d3d]'} ${

              card.matched ? 'ring-2 ring-green-500/50' : ''}`
              }
              style={{
                perspective: '1000px'
              }}>

              {(card.flipped || card.matched) ? (
              <span className="transform rotate-y-180" style={{ fontSize: '2rem' }}>
                  {card.icon}
                </span>
              ) : null}
            </div>
            ))}
        </div>

        {/* Game Completed Message */}
        {gameCompleted && (
            <div className="mt-6 bg-[#2d2d2d] rounded-md p-4 text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-white/90 mb-2">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-white/70 mb-4">
              You completed the game in {moves} moves and {formatTime(timer)}!
            </p>
            {bestScore === moves && (
                  <p className="text-yellow-400 text-sm mb-4">
                🏆 New Best Score! 🏆
              </p>
                )}
            <button
                onClick={() => initializeGame()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">

              Play Again
            </button>
          </div>
          )}

        {/* Game Instructions */}
        {!gameStarted && !gameCompleted && (
            <div className="mt-6 bg-[#2d2d2d] rounded-md p-4">
            <h2 className="text-lg font-medium text-white/90 mb-2">
              How to Play
            </h2>
            <ul className="text-white/70 text-sm space-y-1 list-disc pl-5">
              <li>Click on any card to flip it and reveal the icon</li>
              <li>Try to find matching pairs of icons</li>
              <li>The game is completed when all pairs are matched</li>
              <li>Try to complete the game in as few moves as possible</li>
            </ul>
          </div>
          )}
      </div>
    </div>
  );
};

export default MemoryGame;
