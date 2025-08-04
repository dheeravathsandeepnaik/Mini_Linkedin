#!/bin/bash

echo "🚀 Starting MongoDB with persistent data storage..."

# Kill any existing MongoDB processes
pkill mongod 2>/dev/null

# Ensure directories exist with proper permissions
mkdir -p ~/mongodb/data
mkdir -p ~/mongodb/logs
chmod 755 ~/mongodb/data
chmod 755 ~/mongodb/logs

# Remove any lock files
rm -f ~/mongodb/data/mongod.lock

# Start MongoDB with user-owned data directory
mongod --dbpath ~/mongodb/data \
       --logpath ~/mongodb/logs/mongod.log \
       --logappend \
       --fork \
       --bind_ip 127.0.0.1 \
       --port 27017

if [ $? -eq 0 ]; then
    echo "✅ MongoDB started successfully!"
    echo "📁 Data directory: ~/mongodb/data"
    echo "📄 Log file: ~/mongodb/logs/mongod.log"
    echo "🔗 Connection: mongodb://localhost:27017"
    echo ""
    echo "Your data will persist across restarts in ~/mongodb/data"
else
    echo "❌ Failed to start MongoDB"
    exit 1
fi
