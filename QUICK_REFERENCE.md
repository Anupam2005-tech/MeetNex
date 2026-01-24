# Quick Reference: Using the Integrated APIs

## In Your Components

### 1. Create a Meeting
```typescript
import { createMeeting } from '@/utils/api';
import { useNavigate } from 'react-router-dom';

function StartMeeting() {
  const navigate = useNavigate();
  
  const handleStart = async () => {
    try {
      const meeting = await createMeeting({
        type: 'SFU',
        visibility: 'OPEN'
      });
      navigate(`/room/${meeting.roomId}?type=sfu`);
    } catch (error) {
      alert('Failed to create meeting');
    }
  };

  return <button onClick={handleStart}>Start Meeting</button>;
}
```

### 2. Join a Meeting
```typescript
import { joinMeeting } from '@/utils/api';

async function joinExistingMeeting(roomId: string) {
  try {
    await joinMeeting({ roomId });
    navigate(`/room/${roomId}?type=sfu`);
  } catch (error) {
    alert('Cannot join: ' + error.message);
  }
}
```

### 3. Send Chat Message
```typescript
import { useSocket } from '@/context/SocketContext';

function ChatBox() {
  const { sendMessage } = useSocket();
  
  const handleSend = (message: string) => {
    sendMessage(message);
  };

  return <input onKeyPress={e => handleSend(e.target.value)} />;
}
```

### 4. Get Socket Instance
```typescript
import { useSocket } from '@/context/SocketContext';

function MyComponent() {
  const { socket, isConnected, joinRoom } = useSocket();

  useEffect(() => {
    if (isConnected) {
      joinRoom('room-id');
    }
  }, [isConnected]);
}
```

### 5. Listen to Real-time Events
```typescript
import { useEffect } from 'react';
import { getSocket } from '@/lib/socket';

function RealtimeComponent() {
  useEffect(() => {
    const socket = getSocket();
    
    socket?.on('chat:new', (message) => {
      console.log('New message:', message);
    });

    socket?.on('user-joined', ({ userId }) => {
      console.log('User joined:', userId);
    });

    return () => {
      socket?.off('chat:new');
      socket?.off('user-joined');
    };
  }, []);
}
```

## API Quick Functions

| Function | Usage | Returns |
|----------|-------|---------|
| `createMeeting(payload)` | Create new meeting | `{roomId, type, visibility}` |
| `joinMeeting({roomId})` | Join meeting | `{roomId, type}` |
| `syncUserToDatabase()` | Sync user data | `{message}` |
| `initializeApiAuth(token)` | Set auth token | void |
| `logoutApi()` | Clear auth | void |
| `getApiClient()` | Get Axios instance | AxiosInstance |

## Socket Quick Methods

| Method | Usage | Example |
|--------|-------|---------|
| `joinRoom(roomId)` | Join a room | `await joinRoom('room-123')` |
| `leaveRoom()` | Leave current room | `leaveRoom()` |
| `sendMessage(msg)` | Send chat message | `sendMessage('Hello')` |
| `isTyping(roomId, bool)` | Send typing indicator | `isTyping(roomId, true)` |

## Socket Event Listeners

```typescript
// Listen for new messages
socket.on('chat:new', (msg) => {});

// Listen for typing
socket.on('chat:typing', ({userId, isTyping}) => {});

// Listen for user join/leave
socket.on('user-joined', ({userId, socketId}) => {});
socket.on('user-left', ({userId, socketId}) => {});

// WebRTC signals
socket.on('offer', ({from, offer}) => {});
socket.on('answer', ({from, answer}) => {});
socket.on('ice-candidate', ({from, candidate}) => {});

// Existing peers on join
socket.on('existing-peers', (peers) => {});
```

## Error Handling Pattern

```typescript
import { ApiError } from '@/utils/api';

try {
  const result = await createMeeting({ type: 'SFU' });
} catch (err) {
  const error = err as ApiError;
  if (error.status === 403) {
    // Access denied
  } else if (error.status === 404) {
    // Not found
  } else {
    // Other error
    console.error(error.message);
  }
}
```

## Common Patterns

### Pattern 1: Create → Navigate → Join
```typescript
const meeting = await createMeeting({ type: 'SFU' });
navigate(`/room/${meeting.roomId}?type=sfu`);
// RoomPage automatically joins via socket
```

### Pattern 2: Join from URL
```typescript
// URL: /join/room-123
const { roomId } = useParams();
if (roomId) {
  await joinMeeting({ roomId });
  navigate(`/room/${roomId}?type=sfu`);
}
```

### Pattern 3: Real-time Chat
```typescript
socket?.on('chat:new', ({message, senderId}) => {
  setMessages(prev => [...prev, {message, senderId}]);
});
```

### Pattern 4: Connection Check
```typescript
const { isConnected } = useSocket();

if (!isConnected) {
  return <p>Connecting...</p>;
}
```

## Important Notes

✅ **Do's:**
- Use `useSocket()` hook in components
- Handle errors with try-catch
- Always check socket connection before emitting
- Clean up socket listeners in useEffect cleanup

❌ **Don'ts:**
- Don't create socket manually (use context)
- Don't forget to initialize API auth
- Don't emit events before socket connects
- Don't forget to unsubscribe from events

## File Locations

```
Important Files:
- API: src/utils/api.ts
- Auth Context: src/context/AuthContext.tsx
- Socket Context: src/context/SocketContext.tsx
- Socket Init: src/lib/socket.ts
- Meeting Page: src/pages/meeting/JoinMeetingPage.tsx
- Room Page: src/pages/meeting/RoomPage.tsx
```

## Testing Locally

```bash
# Terminal 1: Backend
cd server
npm install
npm start

# Terminal 2: Frontend
cd client/MeetNex
npm install
npm run dev

# Open http://localhost:5173
# Login with Clerk
# Create meeting or join via URL
```

---

For detailed documentation, see `API_INTEGRATION_GUIDE.md`
