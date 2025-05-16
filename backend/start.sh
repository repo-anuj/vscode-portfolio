#!/bin/bash
# This script is used to start the application on Render

# Print Node.js version
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Start the application
echo "Starting the application..."
node index.js
