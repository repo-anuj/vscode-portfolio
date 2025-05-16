import React, { useState, useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { T } from "gt-react";

// Lazy import socket.io-client to prevent it from blocking rendering
// This helps prevent white screen issues if socket.io fails to load
let io: any;
try {
  // We'll import this dynamically to prevent it from blocking the app
  import('socket.io-client').then(module => {
    io = module.io;
  }).catch(err => {
    console.error('Failed to load socket.io-client:', err);
  });
} catch (error) {
  console.error('Error importing socket.io-client:', error);
}

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

// Define a type for the socket to avoid TypeScript errors
interface SocketType {
  on: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
  connected: boolean;
}

/**
 * LikeButton component that allows users to like the portfolio
 * Uses IP address to track unique likes without authentication
 */
const LikeButton: React.FC<LikeButtonProps> = ({ className = '' }) => {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const socketRef = useRef<SocketType | null>(null);

  // Setup WebSocket connection with improved reconnection logic
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    let pingInterval: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;
    let fallbackTimer: NodeJS.Timeout;

    // First, try a simple HTTP request to check if the server is reachable
    // This helps us fail fast if the backend is completely unreachable
    const checkServerHealth = async () => {
      try {
        console.log(`Checking server health at: ${API_URL}/health`);
        const response = await fetch(`${API_URL}/health`, {
          method: 'GET',
          // Set a short timeout to fail fast
          signal: AbortSignal.timeout(5000)
        });

        if (response.ok) {
          console.log('Server health check successful:', response.status);
          return true;
        } else {
          console.warn('Server health check failed with status:', response.status);
          return false;
        }
      } catch (err) {
        console.error('Server health check failed:', err);
        return false;
      }
    };

    // Function to connect to WebSocket
    const connectSocket = async () => {
      // If socket.io module isn't loaded yet or server is unreachable, use HTTP fallback
      if (!io) {
        console.warn('Socket.io not available, using HTTP fallback');
        fetchLikesHttp();
        return;
      }

      try {
        // Check server health before attempting WebSocket connection
        const isServerHealthy = await checkServerHealth();
        if (!isServerHealthy) {
          console.warn('Server health check failed, using HTTP fallback');
          fetchLikesHttp();
          return;
        }

        console.log(`Attempting to connect to WebSocket at: ${API_URL}`);
        const isSecure = API_URL.startsWith('https://');
        console.log(`Using ${isSecure ? 'secure' : 'standard'} WebSocket connection`);

        // Initialize socket with more resilient options
        const socket = io(API_URL, {
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          timeout: 10000, // Reduced timeout to fail faster
          transports: ['polling', 'websocket'], // Try polling first, then WebSocket
          autoConnect: true,
          forceNew: true
        });

        socketRef.current = socket as unknown as SocketType;

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

        socket.on('disconnect', (reason: string) => {
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

        socket.on('connect_error', (err: Error) => {
          console.error('WebSocket connection error:', err.message);
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
        socket.on('initial-likes', (data: { count: number, error?: boolean }) => {
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
        socket.on('like-update', (data: { count: number }) => {
          console.log('Received like update:', data);
          setLikes(data.count);
        });
      } catch (error) {
        console.error('Error during WebSocket connection:', error);
        fetchLikesHttp();
      }
    };

    // Start with HTTP request to get initial data quickly
    fetchLikesHttp();

    // Then try to establish WebSocket connection for real-time updates
    // Wrap in setTimeout to ensure it doesn't block rendering
    setTimeout(() => {
      connectSocket().catch(err => {
        console.error('Failed to connect to WebSocket:', err);
        // Already called fetchLikesHttp in connectSocket
      });
    }, 100);

    // Set up a fallback timer in case the connection doesn't establish quickly
    fallbackTimer = setTimeout(() => {
      if (!socketConnected) {
        console.log('WebSocket connection taking too long, using HTTP fallback');
        fetchLikesHttp();
      }
    }, 5000);

    // Clean up function
    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(reconnectTimer);
      clearInterval(pingInterval);

      if (socketRef.current) {
        console.log('Disconnecting WebSocket');
        try {
          socketRef.current.disconnect();
        } catch (err) {
          console.error('Error disconnecting socket:', err);
        }
      }
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

        // Check if user has already liked with a longer timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for slower connections

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

        // Log the IP address for debugging
        if (checkData.ip) {
          console.log(`Server identified your IP as: ${checkData.ip}`);
        }

        setHasLiked(checkData.hasLiked);

        // Update localStorage with the server's response
        localStorage.setItem('portfolio_user_liked', checkData.hasLiked ? 'true' : 'false');

        // If we already have a WebSocket connection, we don't need to fetch likes count
        if (!socketConnected) {
          fetchLikesHttp();
        }
      } catch (err) {
        console.error('Error checking like status:', err);

        // If the error is an AbortError (timeout), try one more time without AbortController
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Timeout occurred when checking like status, trying one more time without timeout...');
          try {
            // One more attempt without AbortController
            const lastAttemptResponse = await fetch(`${API_URL}/api/likes/check`, {
              method: 'GET'
            });

            if (lastAttemptResponse.ok) {
              const lastAttemptData = await lastAttemptResponse.json();
              console.log('Successfully checked like status on last attempt:', lastAttemptData);
              setHasLiked(lastAttemptData.hasLiked);
              localStorage.setItem('portfolio_user_liked', lastAttemptData.hasLiked ? 'true' : 'false');

              // If we already have a WebSocket connection, we don't need to fetch likes count
              if (!socketConnected) {
                fetchLikesHttp();
              }
              return; // Exit early if successful
            }
          } catch (finalErr) {
            console.error('Final attempt to check like status failed:', finalErr);
          }
        }

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

      // Fetch likes count from backend with a longer timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for slower connections

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

      // If the error is an AbortError (timeout), try one more time without AbortController
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Timeout occurred, trying one more time without timeout...');
        try {
          // One more attempt without AbortController
          const lastAttemptResponse = await fetch(`${API_URL}/api/likes`, {
            method: 'GET'
          });

          if (lastAttemptResponse.ok) {
            const lastAttemptData = await lastAttemptResponse.json();
            console.log('Successfully fetched likes on last attempt:', lastAttemptData);
            setLikes(lastAttemptData.count);
            localStorage.setItem('portfolio_likes', String(lastAttemptData.count));
            setIsLoading(false);
            return; // Exit early if successful
          }
        } catch (finalErr) {
          console.error('Final attempt to fetch likes failed:', finalErr);
        }
      }

      setError('Failed to load likes');

      // Fallback to localStorage if all API attempts fail
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

      // Call backend API to add like with a longer timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for slower connections

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
        // If the server says we've already liked, update our state to reflect that
        if (data.message && data.message.includes('already liked')) {
          console.log('Server reports you have already liked this portfolio');
          if (data.ip) {
            console.log(`Server identified your IP as: ${data.ip}`);
          }
          // Don't throw an error, just update the state
          setHasLiked(true);
          localStorage.setItem('portfolio_user_liked', 'true');
          return; // Exit early
        } else {
          throw new Error(data.message || 'Failed to add like');
        }
      }

      console.log('Successfully added like:', data);

      // Log the IP address for debugging
      if (data.ip) {
        console.log(`Server identified your IP as: ${data.ip}`);
      }

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

      // If the error is an AbortError (timeout), try one more time without AbortController
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Timeout occurred when adding like, trying one more time without timeout...');
        try {
          // One more attempt without AbortController
          const lastAttemptResponse = await fetch(`${API_URL}/api/likes`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (lastAttemptResponse.ok) {
            const lastAttemptData = await lastAttemptResponse.json();
            console.log('Successfully added like on last attempt:', lastAttemptData);
            setLikes(lastAttemptData.count);
            localStorage.setItem('portfolio_likes', String(lastAttemptData.count));
            localStorage.setItem('portfolio_user_liked', 'true');
            setIsLoading(false);
            return; // Exit early if successful
          }
        } catch (finalErr) {
          console.error('Final attempt to add like failed:', finalErr);
        }
      }

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