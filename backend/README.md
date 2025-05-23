# Portfolio Backend

This is a simple backend server for the portfolio website, specifically handling the like button functionality with real-time updates using WebSockets.

## Features

- Track likes based on IP addresses
- Prevent users from liking multiple times
- Store likes in a MongoDB database
- Real-time updates via WebSockets
- Fallback to HTTP requests when WebSockets are unavailable

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

5. Update the `.env` file with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/portfolio
PORT=3001
NODE_ENV=development
WEBSOCKET_ORIGINS=http://localhost:5173,https://anujkidding-portfolio.vercel.app
```

6. Start the server:

```bash
npm run dev
```

The server will run on port 3001 by default.

## API Endpoints

### REST API

### GET /api/likes

Returns the total number of likes.

**Response:**

```json
{
  "success": true,
  "count": 42
}
```

### GET /api/likes/check

Checks if the current IP address has already liked.

**Response:**

```json
{
  "success": true,
  "hasLiked": true
}
```

### POST /api/likes

Adds a new like for the current IP address.

**Response (success):**

```json
{
  "success": true,
  "message": "Like added successfully",
  "count": 43
}
```

**Response (already liked):**

```json
{
  "success": false,
  "message": "You have already liked this portfolio"
}
```

### WebSocket Events

The server also supports real-time communication via WebSockets.

#### Connection Events

- `connection`: Triggered when a client connects to the WebSocket server
- `disconnect`: Triggered when a client disconnects from the WebSocket server

#### Server-to-Client Events

- `initial-likes`: Sent to a client when they first connect, containing the current likes count
  ```json
  { "count": 42 }
  ```

- `like-update`: Broadcast to all connected clients when a new like is added
  ```json
  { "count": 43 }
  ```

## Deployment

### Render (Recommended for WebSocket Support)

For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md).

Quick steps:

1. Create a [Render](https://render.com/) account

2. From your Render dashboard, click "New" and select "Web Service"

3. Connect your GitHub repository or use the "Deploy from Git Repository" option

4. Configure your web service:
   - **Name**: `portfolio-backend` (or your preferred name)
   - **Region**: Choose a region close to your target audience
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (important if your backend is in a subdirectory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select a paid plan for production)

5. Add environment variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `WEBSOCKET_ORIGINS`: Your frontend URL(s), comma-separated (e.g., `https://your-portfolio.vercel.app,http://localhost:5173`)

6. Click "Create Web Service"

7. Once deployed, Render will provide a URL for your backend (e.g., `https://portfolio-backend.onrender.com`)

8. Update your frontend's `.env` file with this URL:
   ```
   VITE_BACKEND_URL=https://portfolio-backend.onrender.com
   ```

### Vercel (Alternative, but WebSockets Not Supported)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in the Vercel dashboard.

> **Note**: Vercel's serverless functions don't support WebSockets. If you deploy to Vercel, your application will fall back to HTTP requests, losing real-time functionality.

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Set up a database user with read/write permissions
4. Whitelist your IP address or set it to allow access from anywhere (0.0.0.0/0)
5. Get your connection string from the "Connect" button
6. Replace the placeholder values with your actual username and password

## Database Schema

The MongoDB schema for the likes collection:

```javascript
const likeSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```
