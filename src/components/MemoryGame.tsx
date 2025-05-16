import React, { useState, useEffect } from 'react';
import { Shuffle, RefreshCw, Clock, Award, ChevronUp } from 'lucide-react';
import { Var, T } from "gt-react";


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
    // Create pairs of cards with the same icon
    const cardPairs = [...TECH_ICONS, ...TECH_ICONS].map((icon, index) => ({
      id: index,
      icon,
      flipped: false,
      matched: false
    }));

    // Shuffle cards
    const shuffledCards = shuffleCards(cardPairs);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  // Shuffle cards using Fisher-Yates algorithm
  const shuffleCards = (cards: Card[]): Card[] => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore clicks if game is completed or card is already flipped/matched
    if (
    gameCompleted ||
    flippedCards.length >= 2 ||
    cards.find((card) => card.id === id)?.flipped ||
    cards.find((card) => card.id === id)?.matched)
    {
      return;
    }

    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Flip the card
    setCards((prevCards) =>
    prevCards.map((card) =>
    card.id === id ? { ...card, flipped: true } : card
    )
    );

    // Add card to flipped cards
    setFlippedCards((prev) => [...prev, id]);
  };

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = flippedCards;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard?.icon === secondCard?.icon) {
        // Match found
        setCards((prevCards) =>
        prevCards.map((card) =>
        card.id === firstId || card.id === secondId ?
        { ...card, matched: true, flipped: false } :
        card
        )
        );
        setMatchedPairs((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards((prevCards) =>
          prevCards.map((card) =>
          card.id === firstId || card.id === secondId ?
          { ...card, flipped: false } :
          card
          )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Check if game is completed
  useEffect(() => {
    if (matchedPairs === TECH_ICONS.length && gameStarted) {
      setGameCompleted(true);

      // Update best score
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('memoryGameBestScore', moves.toString());
      }
    }
  }, [matchedPairs, gameStarted, moves, bestScore]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted]);

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('memoryGameBestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }

    // Initialize game on component mount
    initializeGame();
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (<T id="components.memorygame.4">
    <div className="h-full w-full flex flex-col p-4 bg-vscode-editor-background">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white/90 mb-2 sm:mb-0">Memory Match</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => initializeGame()}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center">
              
              <RefreshCw size={14} className="mr-1" />
              New Game
            </button>
            <button
              onClick={() => setCards(shuffleCards(cards))}
              className="px-3 py-1 bg-[#3c3c3c] hover:bg-[#4c4c4c] text-white rounded-md text-sm flex items-center"
              disabled={gameStarted}>
              
              <Shuffle size={14} className="mr-1" />
              Shuffle
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
            
            <Var>{showStats && (<T id="components.memorygame.0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Time
                  </div>
                  <div className="text-lg text-white/90 font-mono">
                    <Var>{formatTime(timer)}</Var>
                  </div>
                </div>
                
                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1">Moves</div>
                  <div className="text-lg text-white/90 font-mono"><Var>{moves}</Var></div>
                </div>
                
                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1">Pairs Found</div>
                  <div className="text-lg text-white/90 font-mono">
                    <Var>{matchedPairs}</Var>/<Var>{TECH_ICONS.length}</Var>
                  </div>
                </div>
                
                <div className="bg-[#252525] p-2 rounded-md">
                  <div className="text-xs text-white/60 mb-1 flex items-center">
                    <Award size={12} className="mr-1" />
                    Best Score
                  </div>
                  <div className="text-lg text-white/90 font-mono">
                    <Var>{bestScore !== null ? bestScore : '-'}</Var>
                  </div>
                </div>
              </div></T>
              )}</Var>
          </div>
        </div>
        
        {/* Game Board */}
        <div className="grid grid-cols-4 gap-3">
          <Var>{cards.map((card) => (
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
            ))}</Var>
        </div>
        
        {/* Game Completed Message */}
        <Var>{gameCompleted && (<T id="components.memorygame.2">
            <div className="mt-6 bg-[#2d2d2d] rounded-md p-4 text-center animate-fadeIn">
            <h2 className="text-xl font-bold text-white/90 mb-2">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-white/70 mb-4">
              You completed the game in <Var>{moves}</Var> moves and <Var>{formatTime(timer)}</Var>!
            </p>
            <Var>{bestScore === moves && (<T id="components.memorygame.1">
                  <p className="text-yellow-400 text-sm mb-4">
                🏆 New Best Score! 🏆
              </p></T>
                )}</Var>
            <button
                onClick={() => initializeGame()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                
              Play Again
            </button>
          </div></T>
          )}</Var>
        
        {/* Game Instructions */}
        <Var>{!gameStarted && !gameCompleted && (<T id="components.memorygame.3">
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
          </div></T>
          )}</Var>
      </div>
    </div></T>
  );
};

export default MemoryGame;