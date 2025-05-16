declare module 'socket.io-client' {
  import { Manager } from 'socket.io-client';

  export interface SocketOptions {
    /**
     * the path of the endpoint the socket connects to
     * @default /socket.io
     */
    path?: string;
    /**
     * the name of the transport the socket uses
     * @default ['polling', 'websocket']
     */
    transports?: string[];
    /**
     * whether to upgrade the transport
     * @default true
     */
    upgrade?: boolean;
    /**
     * the query parameters sent when connecting
     * @default {}
     */
    query?: Record<string, any>;
    /**
     * the parser used to serialize/deserialize packets
     * @default Parser
     */
    parser?: any;
    /**
     * the serializer used to serialize/deserialize packets
     * @default Binary
     */
    serializer?: any;
    /**
     * timeout in milliseconds for the initial connection attempt
     * @default 20000
     */
    timeout?: number;
    /**
     * headers sent when connecting
     * @default {}
     */
    extraHeaders?: Record<string, string>;
    /**
     * whether to automatically connect
     * @default true
     */
    autoConnect?: boolean;
    /**
     * whether to automatically reconnect
     * @default true
     */
    reconnection?: boolean;
    /**
     * number of reconnection attempts before giving up
     * @default Infinity
     */
    reconnectionAttempts?: number;
    /**
     * how long to initially wait before attempting a new reconnection
     * @default 1000
     */
    reconnectionDelay?: number;
    /**
     * maximum amount of time to wait between reconnections
     * @default 5000
     */
    reconnectionDelayMax?: number;
    /**
     * used in the exponential backoff jitter when reconnecting
     * @default 0.5
     */
    randomizationFactor?: number;
    /**
     * additional options for the manager
     */
    ManagerOptions?: Partial<ManagerOptions>;
  }

  export interface ManagerOptions {
    /**
     * engine.io options
     */
    engine?: any;
    /**
     * the parser used to serialize/deserialize packets
     * @default Parser
     */
    parser?: any;
    /**
     * the serializer used to serialize/deserialize packets
     * @default Binary
     */
    serializer?: any;
    /**
     * whether to automatically connect
     * @default true
     */
    autoConnect?: boolean;
    /**
     * whether to automatically reconnect
     * @default true
     */
    reconnection?: boolean;
    /**
     * number of reconnection attempts before giving up
     * @default Infinity
     */
    reconnectionAttempts?: number;
    /**
     * how long to initially wait before attempting a new reconnection
     * @default 1000
     */
    reconnectionDelay?: number;
    /**
     * maximum amount of time to wait between reconnections
     * @default 5000
     */
    reconnectionDelayMax?: number;
    /**
     * used in the exponential backoff jitter when reconnecting
     * @default 0.5
     */
    randomizationFactor?: number;
  }

  export interface Socket {
    /**
     * Whether the socket is currently connected to the server.
     */
    connected: boolean;
    /**
     * Whether the socket is currently disconnected from the server.
     */
    disconnected: boolean;
    /**
     * The ID of the socket, assigned by the server.
     */
    id: string;
    /**
     * Connect to the server.
     */
    connect(): Socket;
    /**
     * Disconnect from the server.
     */
    disconnect(): Socket;
    /**
     * Emit an event to the server.
     */
    emit(event: string, ...args: any[]): Socket;
    /**
     * Listen for an event from the server.
     */
    on(event: string, callback: (...args: any[]) => void): Socket;
    /**
     * Listen for an event from the server, but only once.
     */
    once(event: string, callback: (...args: any[]) => void): Socket;
    /**
     * Remove a listener for an event.
     */
    off(event: string, callback?: (...args: any[]) => void): Socket;
    /**
     * Remove all listeners for an event.
     */
    removeAllListeners(event?: string): Socket;
  }

  export function io(uri: string, opts?: Partial<SocketOptions>): Socket;
  export function connect(uri: string, opts?: Partial<SocketOptions>): Socket;

  export { Manager };
}
