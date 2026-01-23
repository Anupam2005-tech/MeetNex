# MeetNex API Integration Guide

## Overview
This document outlines the API integration between the MeetNex frontend and backend. All APIs are properly integrated in the dedicated `src/utils/api.ts` file.

---

## API Architecture

### Base Configuration
- **Base URL**: `http://localhost:5000` (from `VITE_BACKEND_URL` env variable)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token from Clerk (automatically injected)

### Axios Instance
The API uses an Axios instance with:
- Request interceptor to add auth token
- Response interceptor for error handling
- CORS enabled with credentials

---

## Available Endpoints

### 1. **Create Meeting** 
**Endpoint**: `POST /meeting/create`

Create a new meeting/room for video conferencing.

**Request**:
```typescript
interface CreateMeetingPayload {
  type?: 'P2P' | 'SFU';        // Default: 'P2P'
  visibility?: 'OPEN' | 'PRIVATE';  // Default: 'PRIVATE'
  allowedUsers?: string[];      // User IDs allowed to join (for PRIVATE)
}
```

**Response**:
```typescript
interface CreateMeetingResponse {
  message: string;
  roomId: string;               // Unique room identifier
  type: 'P2P' | 'SFU';
  visibility: 'OPEN' | 'PRIVATE';
}
```

**Usage**:
```typescript
import { createMeeting } from '@/utils/api';

try {
  const meeting = await createMeeting({
    type: 'SFU',
    visibility: 'OPEN',
  });
  console.log('Room ID:', meeting.roomId);
  navigate(`/room/${meeting.roomId}?type=sfu`);
} catch (error) {
  console.error('Failed to create meeting:', error);
}
```

---

### 2. **Join Meeting**
**Endpoint**: `POST /meeting/join`

Join an existing meeting by room ID.

**Request**:
```typescript
interface JoinMeetingPayload {
  roomId: string;               // Room to join
}
```

**Response**:
```typescript
interface JoinMeetingResponse {
  message: string;
  roomId: string;
  type: 'P2P' | 'SFU';
}
```

**Usage**:
```typescript
import { joinMeeting } from '@/utils/api';

try {
  const result = await joinMeeting({ roomId: 'MeetNex-123-abc' });
  console.log('Joined:', result.roomId);
} catch (error) {
  console.error('Failed to join meeting:', error);
}
```

---

### 3. **Sync User**
**Endpoint**: `GET /user/sync`

Synchronize user data from Clerk to the database. Called automatically on login.

**Response**:
```typescript
interface SyncUserResponse {
  message: string;
}
```

**Usage**:
```typescript
import { syncUserToDatabase } from '@/utils/api';

try {
  await syncUserToDatabase();
  console.log('User synced to database');
} catch (error) {
  console.error('Sync failed:', error);
}
```

---

## Authentication Flow

### 1. **Clerk Authentication**
- Clerk provides the authentication token
- Token is obtained via `useAuth()` hook from Clerk

### 2. **API Token Initialization**
- Token is automatically set when user logs in
- `AuthContext` handles token injection into API calls
- Token is stored in `sessionStorage` for request interceptor

### 3. **Token in Requests**
```
Authorization: Bearer <clerk_token>
```

---

## Context Providers Setup

### AuthProvider
```typescript
<AuthProvider>
  {/* Handles auth token initialization and user sync */}
</AuthProvider>
```

### SocketProvider
```typescript
<SocketProvider>
  {/* Manages WebSocket connection and room joining */}
</SocketProvider>
```

### MediaProvider
```typescript
<MediaProvider>
  {/* Handles media stream management */}
</MediaProvider>
```

### Example App Setup
```typescript
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { MediaProvider } from "./context/MeetingContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MediaProvider>
          <YourAppComponents />
        </MediaProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
```

---

## Socket Events (Real-time Communication)

### Room Events

#### Join Room
```typescript
socket.emit('join-room', { roomId: 'meeting-123' });
socket.on('existing-peers', (peers) => {
  // Array of existing peers: [{ socketId, userId }, ...]
});
socket.on('user-joined', ({ socketId, userId }) => {
  // New user joined
});
```

#### Leave Room
```typescript
socket.emit('leave-room');
socket.on('user-left', ({ socketId, userId }) => {
  // User left
});
```

### Chat Events

#### Send Message
```typescript
socket.emit('chat:send', { roomId, message });
socket.on('chat:new', (message) => {
  // New message received
  // {_id, roomId, senderId, message, createdAt}
});
```

#### Typing Indicator
```typescript
socket.emit('chat:typing:start', { roomId });
socket.emit('chat:typing:stop', { roomId });
socket.on('chat:typing', ({ userId, isTyping }) => {
  // Update UI for typing indicator
});
```

### WebRTC Signaling

#### Send Offer
```typescript
socket.emit('offer', { to: peerId, offer: rtcOffer });
socket.on('offer', ({ from, offer }) => {
  // Handle incoming offer
});
```

#### Send Answer
```typescript
socket.emit('answer', { to: peerId, answer: rtcAnswer });
socket.on('answer', ({ from, answer }) => {
  // Handle incoming answer
});
```

#### ICE Candidate
```typescript
socket.emit('ice-candidate', { to: peerId, candidate });
socket.on('ice-candidate', ({ from, candidate }) => {
  // Handle incoming ICE candidate
});
```

---

## Usage Examples

### Example 1: Create and Join a Meeting
```typescript
import { createMeeting, joinMeeting } from '@/utils/api';
import { useSocket } from '@/context/SocketContext';
import { useNavigate } from 'react-router-dom';

function MeetingFlow() {
  const { joinRoom } = useSocket();
  const navigate = useNavigate();

  const startMeeting = async () => {
    try {
      // Step 1: Create meeting
      const meeting = await createMeeting({
        type: 'SFU',
        visibility: 'OPEN',
      });

      // Step 2: Join via socket
      await joinRoom(meeting.roomId);

      // Step 3: Navigate to room
      navigate(`/room/${meeting.roomId}?type=sfu`);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={startMeeting}>Start Meeting</button>;
}
```

### Example 2: Join Existing Meeting
```typescript
import { joinMeeting } from '@/utils/api';
import { useSocket } from '@/context/SocketContext';

async function joinExistingMeeting(roomId: string) {
  try {
    // Verify room exists and user has access
    await joinMeeting({ roomId });

    // Join via socket
    await joinRoom(roomId);

    // Navigate to room
    navigate(`/room/${roomId}?type=sfu`);
  } catch (error) {
    // Handle access denied, room not found, etc.
    console.error('Cannot join:', error.message);
  }
}
```

### Example 3: Send Chat Message
```typescript
import { useSocket } from '@/context/SocketContext';

function ChatInput({ roomId }: { roomId: string }) {
  const { sendMessage } = useSocket();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  return (
    <>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </>
  );
}
```

---

## Error Handling

### API Error Structure
```typescript
interface ApiError {
  message?: string;
  error?: string;
  status?: number;
}
```

### Error Handling Example
```typescript
import { createMeeting, ApiError } from '@/utils/api';

try {
  await createMeeting({ type: 'SFU' });
} catch (err) {
  const apiError = err as ApiError;
  
  if (apiError.status === 403) {
    console.error('Access denied');
  } else if (apiError.status === 404) {
    console.error('Meeting not found');
  } else {
    console.error(apiError.message);
  }
}
```

---

## Backend Routes Reference

### Meeting Routes
- `POST /meeting/create` - Create a new meeting
- `POST /meeting/join` - Join a meeting

### User Routes
- `GET /user/sync` - Sync user from Clerk to database

### Socket Namespace
- `join-room` - Join a video room
- `leave-room` - Leave current room
- `chat:send` - Send chat message
- `chat:typing:start/stop` - Typing indicators
- `offer/answer/ice-candidate` - WebRTC signaling

---

## File Structure

```
src/
  utils/
    api.ts              # Main API integration
  context/
    AuthContext.tsx     # Authentication and API token management
    SocketContext.tsx   # Socket connection and events
    MeetingContext.tsx  # Media stream management
  pages/
    meeting/
      JoinMeetingPage.tsx   # Create/join meeting UI
      RoomPage.tsx          # Video conference room
```

---

## Environment Variables

Create a `.env` file in `client/MeetNex/`:

```
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_GEMINI_API_KEY=your_gemini_key
```

---

## Testing the Integration

### 1. Start Backend
```bash
cd server
npm install
npm start
```

### 2. Start Frontend
```bash
cd client/MeetNex
npm install
npm run dev
```

### 3. Test Meeting Creation
1. Login with Clerk
2. Click "Create & Join" to create a new meeting
3. Share the room URL with another user
4. Other user can join via that URL

### 4. Test Chat
- Messages appear in real-time via Socket.IO
- Typing indicators show active typists

---

## Notes

- All API requests require valid Clerk authentication
- WebSocket connection is automatic after authentication
- Room capacity: 2 for P2P, 50 for SFU
- Meetings end when the host leaves
- Private meetings require explicit user allowlist
