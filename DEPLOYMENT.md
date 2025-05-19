# Popya Mobile App Deployment Guide

This guide provides instructions for deploying the Popya Mobile App to a production environment.

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- Vercel account (for hosting)
- Git

## Database Setup

1. Create a PostgreSQL database for your application:

\`\`\`sql
CREATE DATABASE popya_production;
\`\`\`

2. Run the migration script to create the database schema:

\`\`\`bash
# Set the DATABASE_URL environment variable
export DATABASE_URL=postgres://username:password@hostname:port/popya_production

# Run the migration script
node database/migrate.js
\`\`\`

3. Seed the database with initial data:

\`\`\`bash
node database/seed.js
\`\`\`

## Environment Variables

Set up the following environment variables in your production environment:

\`\`\`
# Database
DATABASE_URL=postgres://username:password@hostname:port/popya_production

# WebSocket Server
NEXT_PUBLIC_SIGNALING_SERVER_URL=wss://your-signaling-server.com

# Application
NEXT_PUBLIC_APP_URL=https://your-app-domain.com
\`\`\`

## Deployment to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to your Vercel account and create a new project.

3. Import your Git repository.

4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. Add the environment variables in the Vercel project settings.

6. Deploy the project.

## WebSocket Server Setup

For real-time features, you need to set up a WebSocket server:

1. Create a new Node.js project for your WebSocket server.

2. Install the required dependencies:

\`\`\`bash
npm install socket.io cors express
\`\`\`

3. Create a server.js file:

\`\`\`javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST']
  }
});

// Store online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Get user info from query parameters
  const userId = socket.handshake.query.userId;
  const userRole = socket.handshake.query.userRole;
  
  if (userId && userId !== 'anonymous') {
    onlineUsers.set(userId, {
      socketId: socket.id,
      role: userRole || 'user',
      lastActive: new Date()
    });
    
    // Join role-specific rooms
    if (userRole === 'super_admin') {
      socket.join('admin_updates');
    } else if (userRole === 'expert') {
      socket.join('expert_updates');
    }
    
    // Join user-specific room
    socket.join(`user_${userId}`);
    
    // Broadcast user online status
    io.emit('user_status', {
      userId,
      status: 'online',
      timestamp: Date.now()
    });
  }
  
  // Handle chat messages
  socket.on('chat_message', (message) => {
    console.log('Chat message:', message);
    
    // If recipient is specified, send to specific user
    if (message.recipient) {
      const recipientSocket = onlineUsers.get(message.recipient)?.socketId;
      if (recipientSocket) {
        io.to(recipientSocket).emit('chat_message', message);
      }
    } 
    // If group is specified, send to all users in the group
    else if (message.group) {
      socket.to(`group_${message.group}`).emit('chat_message', message);
    }
  });
  
  // Handle expert status updates
  socket.on('expert_status', (message) => {
    io.emit('expert_status', message);
  });
  
  // Handle call requests
  socket.on('call_request', (message) => {
    if (message.recipient) {
      const recipientSocket = onlineUsers.get(message.recipient)?.socketId;
      if (recipientSocket) {
        io.to(recipientSocket).emit('call_request', message);
      }
    }
  });
  
  // Handle notifications
  socket.on('notification', (message) => {
    if (message.recipient) {
      const recipientSocket = onlineUsers.get(message.recipient)?.socketId;
      if (recipientSocket) {
        io.to(recipientSocket).emit('notification', message);
      }
    }
  });
  
  // Handle profile updates
  socket.on('profile_update', (message) => {
    console.log('Profile update:', message);
    
    // Broadcast to admin panel if needed
    if (message.data && message.data.broadcastToAdmin) {
      io.to('admin_updates').emit('admin_alert', {
        type: 'profile_update',
        data: message.data,
        timestamp: Date.now()
      });
    }
  });
  
  // Handle admin alerts
  socket.on('admin_alert', (message) => {
    io.to('admin_updates').emit('admin_alert', message);
  });
  
  // Handle expert alerts
  socket.on('expert_alert', (message) => {
    io.to('expert_updates').emit('expert_alert', message);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find and remove the disconnected user
    for (const [key, value] of onlineUsers.entries()) {
      if (value.socketId === socket.id) {
        onlineUsers.delete(key);
        
        // Broadcast user offline status
        io.emit('user_status', {
          userId: key,
          status: 'offline',
          timestamp: Date.now()
        });
        
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
\`\`\`

4. Deploy your WebSocket server to a hosting service like Heroku, Render, or DigitalOcean.

5. Update the `NEXT_PUBLIC_SIGNALING_SERVER_URL` environment variable in your Vercel project to point to your WebSocket server URL.

## Monitoring and Maintenance

1. Set up monitoring for your application using Vercel Analytics or a third-party service like Sentry.

2. Regularly back up your database.

3. Set up a CI/CD pipeline for automated testing and deployment.

4. Monitor server logs for errors and performance issues.

## Troubleshooting

If you encounter issues during deployment:

1. Check the Vercel deployment logs for errors.

2. Verify that all environment variables are correctly set.

3. Ensure your database is accessible from your Vercel deployment.

4. Check that your WebSocket server is running and accessible.

5. Test your application locally with production environment variables to identify issues.

## Support

For additional support, contact the Popya development team at support@popya.com.
\`\`\`

## Final Review and Recommendations

After a thorough inspection of the Popya mobile app, I've made several enhancements to ensure it's ready for deployment:

1. **Real-time Updates**
   - Enhanced WebSocket service for real-time communication
   - Added role-based rooms for targeted updates
   - Implemented profile update broadcasting

2. **User Profile Management**
   - Added profile picture upload functionality
   - Implemented password change mechanism
   - Added real-time profile updates

3. **Database Setup**
   - Created comprehensive database schema
   - Added migration and seeding scripts
   - Included deployment instructions

4. **Admin and Expert Panels**
   - Enhanced real-time data flow
   - Added WebSocket connections for instant notifications
   - Implemented status indicators for online users

The app is now ready for deployment. You can use the provided database scripts and deployment guide to set up your production environment.
