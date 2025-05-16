import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { T } from "gt-react";

// API URL - Always use environment variable if available, regardless of environment
// Add VITE_BACKEND_URL to your .env file (e.g., VITE_BACKEND_URL=https://your-api-domain.com)
const API_URL = import.meta.env.VITE_BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://vscode-portfolio-x55n.onrender.com'
    : 'http://localhost:3001');

// Log the backend URL for debugging
console.log('Using backend URL:', API_URL);
console.log('Environment variables available:', {
  VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'not set',
  NODE_ENV: process.env.NODE_ENV || 'not set'
});

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
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    const connectSocket = () => {
      console.log(`Attempting to connect to WebSocket at: ${API_URL}`);

      // Initialize socket connection with better options
      const socket = io(API_URL, {
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 10000,
        transports: ['websocket', 'polling'], // Try WebSocket first, fall back to polling
        autoConnect: true, // Ensure auto connection is enabled
        // Don't specify path - use the default
      } as any); // Using 'as any' to bypass TypeScript checking for socket.io options

      socketRef.current = socket;

      // Handle connection events
      socket.on('connect', () => {
        console.log('WebSocket connected successfully');
        setSocketConnected(true);
        reconnectAttempts = 0; // Reset reconnect attempts on successful connection

        // Set up ping interval to keep connection alive
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
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectTimer = setTimeout(connectSocket, 3000);
          } else {
            console.log('Max reconnect attempts reached, falling back to HTTP');
            fetchLikesHttp();
          }
        }
      });

      socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setSocketConnected(false);

        // Fall back to HTTP if WebSocket fails
        fetchLikesHttp();

        // Try to reconnect after a delay, but only up to MAX_RECONNECT_ATTEMPTS
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempts++;
          console.log(`Attempting to reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
          reconnectTimer = setTimeout(connectSocket, 5000);
        } else {
          console.log('Max reconnect attempts reached, giving up on WebSocket');
        }
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

    // Initial connection attempt
    try {
      connectSocket();
    } catch (error) {
      console.error('Error during WebSocket initialization:', error);
      fetchLikesHttp();
    }

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
        console.log(`Checking like status via HTTP from: ${API_URL}/api/likes/check`);

        // First check localStorage for a quick response
        const userLikedFromStorage = localStorage.getItem('portfolio_user_liked') === 'true';
        if (userLikedFromStorage) {
          console.log('User has already liked according to localStorage');
          setHasLiked(true);
        }

        // Check if user has already liked with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const checkResponse = await fetch(`${API_URL}/api/likes/check`, {
          signal: controller.signal,
          method: 'GET',
          // Removed problematic headers that were causing CORS issues
        });

        clearTimeout(timeoutId);

        if (!checkResponse.ok) {
          throw new Error(`Failed to check like status: ${checkResponse.status} ${checkResponse.statusText}`);
        }

        const checkData = await checkResponse.json();
        console.log('Successfully checked like status:', checkData);
        setHasLiked(checkData.hasLiked);

        // Update localStorage with the server's response
        localStorage.setItem('portfolio_user_liked', checkData.hasLiked ? 'true' : 'false');

        // If we already have a WebSocket connection, we don't need to fetch likes count
        if (!socketConnected) {
          fetchLikesHttp();
        }
      } catch (err) {
        console.error('Error checking like status:', err);

        // Fallback to localStorage
        const userLiked = localStorage.getItem('portfolio_user_liked') === 'true';
        console.log('Using localStorage fallback for like status:', userLiked);
        setHasLiked(userLiked);

        if (!socketConnected) {
          // Try to get likes from localStorage if WebSocket and HTTP both fail
          try {
            const storedLikes = localStorage.getItem('portfolio_likes');
            if (storedLikes) {
              console.log('Using localStorage fallback for likes count');
              setLikes(parseInt(storedLikes, 10));
            } else {
              console.log('No localStorage fallback available for likes count, defaulting to 0');
              setLikes(0);
            }
          } catch (localErr) {
            console.error('Error with localStorage fallback:', localErr);
            setLikes(0); // Default to 0 if all else fails
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

      console.log(`Fetching likes via HTTP from: ${API_URL}/api/likes`);

      // Fetch likes count from backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const countResponse = await fetch(`${API_URL}/api/likes`, {
        signal: controller.signal,
        method: 'GET',
        // Removed problematic headers that were causing CORS issues
      });

      clearTimeout(timeoutId);

      if (!countResponse.ok) {
        throw new Error(`Failed to fetch likes count: ${countResponse.status} ${countResponse.statusText}`);
      }

      const countData = await countResponse.json();
      console.log('Successfully fetched likes via HTTP:', countData);
      setLikes(countData.count);

      // Store in localStorage as a fallback for future sessions
      localStorage.setItem('portfolio_likes', String(countData.count));

    } catch (err) {
      console.error('Error fetching likes via HTTP:', err);
      setError('Failed to load likes');

      // Fallback to localStorage if API fails
      try {
        const storedLikes = localStorage.getItem('portfolio_likes');
        if (storedLikes) {
          console.log('Using localStorage fallback for likes count');
          const initialLikes = parseInt(storedLikes, 10);
          setLikes(initialLikes);
        } else {
          console.log('No localStorage fallback available, defaulting to 0');
          setLikes(0);
        }
      } catch (localErr) {
        console.error('Error with localStorage fallback:', localErr);
        setLikes(0); // Default to 0 if all else fails
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

      console.log(`Sending like via HTTP to: ${API_URL}/api/likes`);

      // Call backend API to add like with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${API_URL}/api/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Keep only the essential Content-Type header
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add like');
      }

      console.log('Successfully added like:', data);

      // Update with actual count from server
      setLikes(data.count);

      // Store in localStorage as fallback
      localStorage.setItem('portfolio_likes', String(data.count));
      localStorage.setItem('portfolio_user_liked', 'true');

      // If we have a socket connection, no need to do anything else
      // The server will broadcast the update to all connected clients
      if (!socketConnected) {
        console.log('No WebSocket connection, using HTTP response for like count');
      }

    } catch (err) {
      console.error('Error adding like:', err);
      // Revert optimistic update on error
      setLikes((prevLikes) => prevLikes - 1);
      setHasLiked(false);
      setError('Failed to add like');

      // Still mark as liked in localStorage to prevent multiple attempts
      // This prevents the user from hammering the server with failed requests
      localStorage.setItem('portfolio_user_liked', 'true');
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