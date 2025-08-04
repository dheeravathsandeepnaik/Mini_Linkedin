# MongoDB Data Persistence Setup Guide

## Current Issue
MongoDB has permission conflicts with the existing data directory. Here's how to fix it:

## Solution 1: Clean Setup with User-Owned Data Directory (Recommended)

### Step 1: Create a user-owned MongoDB data directory
```bash
# Create MongoDB directories in your user space
mkdir -p ~/mongodb/data
mkdir -p ~/mongodb/logs

# Set proper permissions
chmod 755 ~/mongodb/data
chmod 755 ~/mongodb/logs
```

### Step 2: Start MongoDB with your data directory
```bash
# Start MongoDB with persistent storage in your user directory
mongod --dbpath ~/mongodb/data --logpath ~/mongodb/logs/mongod.log --fork --bind_ip 127.0.0.1 --port 27017
```

### Step 3: Create a startup script
Create a file called `start-mongo.sh`:
```bash
#!/bin/bash
echo "Starting MongoDB with persistent data storage..."

# Ensure directories exist
mkdir -p ~/mongodb/data
mkdir -p ~/mongodb/logs

# Start MongoDB
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
else
    echo "❌ Failed to start MongoDB"
fi
```

### Step 4: Make it executable and test
```bash
chmod +x start-mongo.sh
./start-mongo.sh
```

## Solution 2: Fix Homebrew Installation (Alternative)

If you prefer using Homebrew's MongoDB:

### Step 1: Fix permissions
```bash
# Take ownership of MongoDB directories
sudo chown -R $(whoami):staff /opt/homebrew/var/mongodb
sudo chown -R $(whoami):staff /opt/homebrew/var/log/mongodb

# Fix permissions
chmod -R 755 /opt/homebrew/var/mongodb
chmod -R 755 /opt/homebrew/var/log/mongodb
```

### Step 2: Clean start
```bash
# Remove lock files if they exist
rm -f /opt/homebrew/var/mongodb/mongod.lock

# Start MongoDB manually
mongod --config /opt/homebrew/etc/mongod.conf --fork
```

## Verification Steps

### 1. Check if MongoDB is running
```bash
ps aux | grep mongod
```

### 2. Connect to MongoDB
```bash
mongosh mongodb://localhost:27017
```

### 3. Test data persistence
```bash
# In mongosh:
use mini_linkedin
db.test.insertOne({message: "persistence test", timestamp: new Date()})
db.test.find()

# Exit mongosh, restart MongoDB, then reconnect and verify:
db.test.find()  # Should still show your test data
```

## Auto-start on System Boot (Optional)

### For macOS (using launchd):
Create a file `~/Library/LaunchAgents/com.mongodb.mongod.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.mongodb.mongod</string>
    <key>Program</key>
    <string>/opt/homebrew/bin/mongod</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/homebrew/bin/mongod</string>
        <string>--dbpath</string>
        <string>/Users/sunnynaik/mongodb/data</string>
        <string>--logpath</string>
        <string>/Users/sunnynaik/mongodb/logs/mongod.log</string>
        <string>--logappend</string>
        <string>--bind_ip</string>
        <string>127.0.0.1</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Then load it:
```bash
launchctl load ~/Library/LaunchAgents/com.mongodb.mongod.plist
```

## Key Points for Data Persistence

1. **Data Directory**: Always use the same `--dbpath` when starting MongoDB
2. **Permissions**: Ensure the MongoDB process has read/write access to the data directory
3. **Clean Shutdown**: Use `mongod --shutdown` or `pkill mongod` to stop properly
4. **Backup**: Regularly backup your data directory for safety

## Troubleshooting

- **Permission Denied**: Check directory ownership and permissions
- **Port in Use**: Kill existing MongoDB processes: `pkill mongod`
- **Corrupt Data**: Remove `mongod.lock` file and restart
- **Service Issues**: Use manual startup instead of Homebrew services

Your data will persist across restarts as long as you:
1. Use the same data directory path
2. Don't delete the data directory
3. Shut down MongoDB properly
