import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { T } from "gt-react";

// API URL - Uses environment variable in production
// Add VITE_BACKEND_URL to your .env file (e.g., VITE_BACKEND_URL=https://your-api-domain.com)
const API_URL = process.env.NODE_ENV === 'production' ?
import.meta.env.VITE_BACKEND_URL || 'https://your-backend-url.com' // Will use the environment variable when deployed
: 'http://localhost:3001';

/**
 * Props for the LikeButton component
 */
interface LikeButtonProps {
  /** Optional CSS class name */
  className?: string;
}

/**
 * LikeButton component that allows users to like the portfolio
 * Uses IP address to track unique likes without authentication
 *
 * @param {LikeButtonProps} props - Component props
 * @returns {JSX.Element} Rendered LikeButton component
 */
const LikeButton: React.FC<LikeButtonProps> = ({ className = '' }) => {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  // Setup WebSocket connection with improved reconnection logic
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let pingInterval: NodeJS.Timeout;

    const connectSocket = () => {
      // Initialize socket connection with better options for Render
      const socket = io(API_URL, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling'] // Try WebSocket first, fall back to polling
      });
      socketRef.current = socket;

      // Handle connection events
      socket.on('connect', () => {
        console.log('WebSocket connected');
        setSocketConnected(true);

        // Set up ping interval to keep connection alive (especially important for Render)
        pingInterval = setInterval(() => {
          socket.emit('ping', (response: any) => {
            console.log('Ping response:', response);
          });
        }, 30000); // Ping every 30 seconds
      });

      socket.on('disconnect', (reason) => {
        console.log(`WebSocket disconnected: ${reason}`);
        setSocketConnected(false);
        clearInterval(pingInterval);

        // Attempt to reconnect if disconnected unexpectedly
        if (reason === 'io server disconnect' || reason === 'transport close') {
          reconnectTimer = setTimeout(connectSocket, 3000);
        }
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setSocketConnected(false);
        // Fall back to HTTP if WebSocket fails
        fetchLikesHttp();

        // Try to reconnect after a delay
        reconnectTimer = setTimeout(connectSocket, 5000);
      });

      // Handle initial likes count
      socket.on('initial-likes', (data) => {
        console.log('Received initial likes:', data);
        if (data.error) {
          console.warn('Error in initial likes data, using fallback value');
          fetchLikesHttp();
        } else {
          setLikes(data.count);
          setIsLoading(false);
        }
      });

      // Handle real-time like updates
      socket.on('like-update', (data) => {
        console.log('Received like update:', data);
        setLikes(data.count);
      });
    };

    connectSocket();

    // Clean up socket connection and timers on unmount
    return () => {
      if (socketRef.current) {
        console.log('Disconnecting WebSocket');
        socketRef.current.disconnect();
      }
      clearTimeout(reconnectTimer);
      clearInterval(pingInterval);
    };
  }, []);

  // Load likes count and check if user has already liked
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        // Check if user has already liked
        const checkResponse = await fetch(`${API_URL}/api/likes/check`);
        if (!checkResponse.ok) {
          throw new Error('Failed to check like status');
        }
        const checkData = await checkResponse.json();
        setHasLiked(checkData.hasLiked);

        // If we already have a WebSocket connection, we don't need to fetch likes count
        if (!socketConnected) {
          fetchLikesHttp();
        }
      } catch (err) {
        console.error('Error checking like status:', err);

        // Fallback to localStorage
        const userLiked = localStorage.getItem('portfolio_user_liked') === 'true';
        setHasLiked(userLiked);

        if (!socketConnected) {
          // Try to get likes from localStorage if WebSocket and HTTP both fail
          try {
            const storedLikes = localStorage.getItem('portfolio_likes');
            if (storedLikes) {
              setLikes(parseInt(storedLikes, 10));
            }
          } catch (localErr) {
            console.error('Error with localStorage fallback:', localErr);
          }
          setIsLoading(false);
        }
      }
    };

    checkLikeStatus();
  }, [socketConnected]);

  // Fetch likes using HTTP as fallback
  const fetchLikesHttp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch likes count from backend
      const countResponse = await fetch(`${API_URL}/api/likes`);
      if (!countResponse.ok) {
        throw new Error('Failed to fetch likes count');
      }
      const countData = await countResponse.json();
      setLikes(countData.count);
    } catch (err) {
      console.error('Error fetching likes:', err);
      setError('Failed to load likes');

      // Fallback to localStorage if API fails
      try {
        const storedLikes = localStorage.getItem('portfolio_likes');
        const initialLikes = storedLikes ? parseInt(storedLikes, 10) : 0;
        setLikes(initialLikes);
      } catch (localErr) {
        console.error('Error with localStorage fallback:', localErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle like button click
   * Increments like count and stores in backend
   */
  const handleLike = async () => {
    if (hasLiked || isLoading) return;

    try {
      // Optimistically update UI
      setLikes((prevLikes) => prevLikes + 1);
      setHasLiked(true);
      setIsLoading(true);

      // Call backend API to add like
      const response = await fetch(`${API_URL}/api/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add like');
      }

      // Update with actual count from server
      setLikes(data.count);

      // Store in localStorage as fallback
      localStorage.setItem('portfolio_likes', String(data.count));
      localStorage.setItem('portfolio_user_liked', 'true');
    } catch (err) {
      console.error('Error adding like:', err);
      // Revert optimistic update on error
      setLikes((prevLikes) => prevLikes - 1);
      setHasLiked(false);
      setError('Failed to add like');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className={`flex flex-col items-center ${className}`}>
      <button
      onClick={handleLike}
      disabled={hasLiked || isLoading}
      className={`w-12 h-12 flex items-center justify-center transition-colors relative
          ${hasLiked ?
      'text-red-500 hover:text-red-600' :
      'text-white/40 hover:text-white'}
          ${
      isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      title={hasLiked ? "You've already liked this portfolio" : "Like this portfolio"}>

        <Heart
        size={24}
        fill={hasLiked ? "currentColor" : "none"}
        className={hasLiked ? "animate-pulse" : ""} />
      </button>

      <div className="text-xs text-white/60 font-medium">
        {isLoading ? (
      <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></span>
      ) : error ? (<T id="components.likebutton.0">
        <span className="text-red-400 text-xs">Error</span></T>
      ) : (
      <span>{likes}</span>
      )}
      </div>
    </div>
  );
};

export default LikeButton;