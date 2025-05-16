# Deploying to Render

This guide provides step-by-step instructions for deploying this backend to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a database set up
3. Your frontend deployed (e.g., on Vercel)

## Deployment Steps

### 1. Fork or Push Your Repository to GitHub

Make sure your code is in a GitHub repository that Render can access.

### 2. Create a New Web Service on Render

1. Log in to your Render dashboard
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `portfolio-backend` (or your preferred name)
   - **Region**: Choose a region close to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` (important if your backend is in a subdirectory)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `bash ./start.sh`
   - **Plan**: Free (or select a paid plan for production)

### 3. Set Environment Variables

Add the following environment variables in the Render dashboard:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/portfolio`)
- `WEBSOCKET_ORIGINS`: Your frontend URL(s), comma-separated (e.g., `https://your-portfolio.vercel.app,http://localhost:5173`)

### 4. Deploy Your Service

Click "Create Web Service" and Render will start the deployment process.

### 5. Update Your Frontend

Update your frontend's `.env` file with the Render URL:

```
VITE_BACKEND_URL=https://your-backend-name.onrender.com
```

Then rebuild and redeploy your frontend.

## Troubleshooting

### Common Issues

1. **Build Fails**: Make sure your `package.json` has a `build` script.

2. **MongoDB Connection Fails**:
   - Check that your MongoDB Atlas connection string is correct
   - Ensure your IP is whitelisted in MongoDB Atlas (or set it to allow access from anywhere)
   - Verify that your MongoDB user has the correct permissions

3. **WebSocket Connection Issues**:
   - Check that `WEBSOCKET_ORIGINS` includes your frontend URL
   - Ensure your frontend is using the correct backend URL

4. **Service Crashes**:
   - Check the Render logs for error messages
   - Make sure all required environment variables are set

### Checking Logs

To view logs for your service:

1. Go to your Render dashboard
2. Select your web service
3. Click on the "Logs" tab

## Free Tier Limitations

Be aware of Render's free tier limitations:

- Free services spin down after 15 minutes of inactivity
- They take a few seconds to spin up when a new request comes in
- Limited to 750 hours of runtime per month

For production use, consider upgrading to a paid plan.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
