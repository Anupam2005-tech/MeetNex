# MeetNex

<div align="center">
  <h3>Collaborate at the Speed of Thought</h3>
  <p>A next-generation video conferencing platform with AI-powered assistance, built for seamless real-time collaboration.</p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Application Flow](#-application-flow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Core Concepts](#-core-concepts)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🌟 Overview

**MeetNex** is a modern, full-stack video conferencing application that combines real-time video communication with AI-powered assistance. Built with cutting-edge technologies powered by LiveKit infrastructure, it supports both 1:1 calls and scalable group meetings for optimal performance across different use cases.

### Why MeetNex?

- **LiveKit-Powered**: Both 1:1 and group calls use LiveKit's robust SFU infrastructure
- **AI Integration**: Built-in AI assistant (Lumi) powered by Google Gemini
- **Real-time Everything**: Instant messaging, live video, and synchronized state management
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Enterprise-Ready**: Secure authentication with Clerk, scalable infrastructure

---

## ✨ Key Features

### 🎥 Video Conferencing

- **LiveKit-Powered Infrastructure**
  - **1:1 Calls**: Optimized direct video calls between two participants
  - **Group Meetings**: Scalable multi-participant calls using SFU architecture
  - All connections managed through LiveKit Cloud for reliability and performance
- **Advanced Controls**
  - Camera toggle with preview
  - Microphone mute/unmute
  - Screen sharing with audio
  - Participant video maximization (focus mode)
  - Keyboard shortcuts for quick actions
- **Meeting Management**
  - Instant meeting creation
  - Schedule meetings with unique Room IDs
  - Join via link or Room ID
  - Copy meeting link for sharing

### 🤖 Lumi AI Assistant

- **Powered by Google Gemini AI**
- **Context-aware responses**
- **Integrated directly into the dashboard**

### 💬 Real-time Communication

- **In-meeting Chat**
  - Send messages during video calls
  - Real-time message synchronization
  - Emoji support with picker
  - Participant identification
- **Socket.io Integration**
  - WebSocket-based real-time messaging
  - Automatic reconnection
  - Event-driven architecture

### 🔐 Authentication & Security

- **Clerk Authentication**
  - Social login support
  - Secure session management
  - JWT token-based API authentication
  - Protected routes
- **Webhook Integration**
  - User sync with MongoDB
  - Automated user management

### 🎨 User Interface

- **Modern Design System**
  - Glassmorphism effects
  - Smooth animations with Framer Motion
  - GSAP-powered interactions
  - Responsive layouts with Tailwind CSS
- **Interactive Components**
  - 3D Globe visualization (Cobe)
  - Animated text effects
  - Bounce cards
  - Pointer highlights
  - Custom modals and dropdowns

### 📱 Responsive Experience

- **Mobile-First Design**
  - Touch-optimized controls
  - Bottom navigation for mobile
  - Adaptive layouts
  - Performance optimization for low-end devices
- **Desktop Features**
  - Collapsible sidebar
  - Keyboard shortcuts
  - Multi-panel layouts
  - Hover effects and interactions

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  React + Vite + TypeScript                          │   │
│  │  • Clerk Auth  • LiveKit Client  • Socket.io       │   │
│  │  • Redux Toolkit  • React Router  • Framer Motion  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      SERVER LAYER                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Express.js + Node.js                               │   │
│  │  • Socket.io Server  • LiveKit SDK                  │   │
│  │  • Clerk Webhooks  • MongoDB (Mongoose)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  • LiveKit Cloud (SFU)  • Clerk (Auth)                      │
│  • Google Gemini AI  • MongoDB Atlas                        │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

#### Video Call Flow (LiveKit)

1. **Meeting Creation**
   - User creates meeting → Server generates Room ID
   - Server stores meeting metadata in MongoDB
   - Room ID shared with participants

2. **Joining Flow**
   - User enters Room ID → Client requests LiveKit token
   - Server validates user → Generates JWT token with room permissions
   - Client connects to LiveKit SFU with token

3. **Media Streaming**
   - Local media tracks published to LiveKit room
   - LiveKit SFU forwards tracks to all participants (optimized for both 1:1 and group calls)
   - Client renders remote participant videos

4. **Real-time Chat**
   - Messages sent via Socket.io (parallel to LiveKit)
   - Server broadcasts to room participants
   - Messages stored in MongoDB

#### AI Chat Flow (Lumi)

1. User sends message → Client emits to Socket.io
2. Server receives message → Forwards to Google Gemini API
3. AI response streamed back → Client displays in chat
4. Conversation history saved to MongoDB (session-based)

---

## 🛠️ Tech Stack

### Frontend

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| **React 19**           | UI framework with latest features |
| **TypeScript**         | Type-safe development             |
| **Vite**               | Fast build tool and dev server    |
| **Tailwind CSS 4**     | Utility-first styling             |
| **LiveKit Components** | Pre-built video UI components     |
| **Clerk React**        | Authentication UI and hooks       |
| **Socket.io Client**   | WebSocket communication           |
| **Redux Toolkit**      | State management                  |
| **React Router 7**     | Client-side routing               |
| **Framer Motion**      | Animation library                 |
| **GSAP**               | Advanced animations               |
| **Axios**              | HTTP client                       |
| **Lucide React**       | Icon library                      |
| **Emoji Picker React** | Emoji selection                   |
| **Cobe**               | 3D globe visualization            |
| **Three.js**           | 3D graphics                       |

### Backend

| Technology             | Purpose                               |
| ---------------------- | ------------------------------------- |
| **Node.js**            | JavaScript runtime                    |
| **Express 5**          | Web framework                         |
| **Socket.io**          | Real-time bidirectional communication |
| **MongoDB + Mongoose** | Database and ODM                      |
| **LiveKit Server SDK** | Video infrastructure                  |
| **Clerk Express**      | Authentication middleware             |
| **Multer**             | File upload handling                  |
| **dotenv**             | Environment configuration             |

### External Services

- **LiveKit Cloud**: SFU video infrastructure
- **Clerk**: Authentication and user management
- **Google Gemini AI**: AI-powered chat assistant
- **MongoDB Atlas**: Cloud database (optional)

---

## 🔄 Application Flow

### User Journey

```mermaid
graph TD
    A[Landing Page] --> B{Authenticated?}
    B -->|No| C[Login/Register]
    B -->|Yes| D[Dashboard]
    C --> D

    D --> E[Create Meeting]
    D --> F[Join Meeting]
    D --> G[Chat with Lumi AI]
    D --> H[Settings]

    E --> I{Select Type}
    I -->|Instant| J[Choose Call Type]
    I -->|Schedule| K[Get Room ID]

    J -->|1:1 Call| L[Direct Call Setup]
    J -->|Group Call| M[Multi-participant Setup]

    L --> N[Video Room]
    M --> N
    F --> N

    N --> O[In-Meeting Features]
    O --> P[Video Controls]
    O --> Q[Screen Share]
    O --> R[Chat]
    O --> S[Participants]

    G --> T[AI Chat Interface]
    T --> U[Session History]
```

### Component Hierarchy

```
App
├── LenisProvider (Smooth scrolling)
├── SocketProvider (WebSocket context)
├── ChatProvider (Chat state)
└── AuthBoundary (Clerk authentication)
    └── Router
        ├── HomeLayout (Landing page)
        │   ├── Navbar
        │   ├── HeroSection
        │   ├── FeatureSection
        │   ├── ArchitectureLayout
        │   └── Footer
        │
        ├── MainLayout (Dashboard)
        │   ├── Sidebar (Desktop)
        │   │   ├── Navigation Links
        │   │   ├── Meeting Dropdown
        │   │   └── User Profile
        │   ├── MobileNav (Bottom bar)
        │   ├── MainLayoutText (Home content)
        │   ├── AIChat (Lumi interface)
        │   └── Settings Modal
        │
        ├── JoinMeetingPage
        │   └── Meeting Configuration
        │
        └── RoomPage (Video call)
            ├── LiveKitRoom
            │   ├── VideoTiles
            │   ├── ScreenShare
            │   └── LocalVideo
            ├── MeetingControls
            │   ├── AudioToggle
            │   ├── VideoToggle
            │   ├── ScreenShareButton
            │   └── EndCallButton
            ├── ChatPanel
            │   ├── MessageList
            │   └── ChatInput
            └── Participants Panel
```

---

## 📁 Project Structure

```
MeetNex/
├── client/MeetNex/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── chat/              # Chat components
│   │   │   │   ├── AI/            # Lumi AI chat
│   │   │   │   └── roomChat/      # In-meeting chat
│   │   │   ├── forms/             # Login/Register forms
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── MainLayout.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── ui/                # Reusable UI components
│   │   │   │   ├── buttons/
│   │   │   │   ├── Globe.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── ...
│   │   │   └── video/             # Video components
│   │   │       ├── Controls.tsx
│   │   │       ├── LocalVideo.tsx
│   │   │       └── ScreenShare.tsx
│   │   ├── context/               # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ChatContext.tsx
│   │   │   ├── MeetingContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/                 # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useMediaStream.ts
│   │   │   ├── useMeeting.ts
│   │   │   └── useSocket.ts
│   │   ├── pages/
│   │   │   ├── auth/              # Authentication pages
│   │   │   ├── dashboard/         # Dashboard & home
│   │   │   └── meeting/           # Meeting pages
│   │   │       ├── JoinMeetingPage.tsx
│   │   │       ├── RoomPage.tsx
│   │   │       └── MeetingControls.tsx
│   │   ├── routes/                # Routing configuration
│   │   ├── utils/                 # Utility functions
│   │   │   ├── api.ts
│   │   │   └── deviceDetection.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                    # Static assets
│   ├── .env                       # Environment variables
│   ├── package.json
│   └── vite.config.ts
│
├── server/                        # Backend application
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Route controllers
│   │   ├── livekitController.js
│   │   ├── meetingController.js
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── appMiddleware.js       # CORS, body parser
│   │   └── socketAuth.js          # Socket authentication
│   ├── models/                    # MongoDB schemas
│   │   ├── userdb.js
│   │   ├── meetingModal.js
│   │   └── ChatMessage.js
│   ├── routes/                    # API routes
│   │   ├── userAuthRoutes.js
│   │   ├── meetingRoutes.js
│   │   ├── livekit.route.js
│   │   └── uploadRoutes.js
│   ├── socket/                    # Socket.io handlers
│   │   ├── socketManager.js
│   │   ├── chat.js
│   │   └── signaling.js
│   ├── webhooks/                  # Webhook handlers
│   ├── uploads/                   # File uploads
│   ├── .env                       # Environment variables
│   ├── index.js                   # Server entry point
│   └── package.json
│
├── docker-compose.yml             # Docker configuration
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Clerk Account** (for authentication)
- **LiveKit Account** (for video infrastructure)
- **Google AI Studio Account** (for Gemini API)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Anupam2005-tech/MeetNex.git
   cd MeetNex
   ```

2. **Install dependencies**

   **Frontend:**

   ```bash
   cd client/MeetNex
   npm install
   ```

   **Backend:**

   ```bash
   cd ../../server
   npm install
   ```

3. **Configure environment variables** (see [Environment Variables](#-environment-variables))

4. **Start MongoDB** (if running locally)

   ```bash
   mongod
   ```

5. **Run the application**

   **Backend (Terminal 1):**

   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2):**

   ```bash
   cd client/MeetNex
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

### Docker Deployment (Optional)

```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

### Frontend (`client/MeetNex/.env`)

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000

# LiveKit
VITE_LIVEKIT_URL=wss://your-livekit-url.livekit.cloud

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional
VITE_GITHUB_PAGE_LINK=https://github.com/yourusername/MeetNex
```

### Backend (`server/.env`)

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb://localhost:27017/meetnex
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meetnex

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret

# LiveKit
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=wss://your-livekit-url.livekit.cloud

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key
```

### How to Get API Keys

1. **Clerk**: Sign up at [clerk.com](https://clerk.com) → Create application → Copy keys
2. **LiveKit**: Sign up at [livekit.io](https://livekit.io) → Create project → Get credentials
3. **Google Gemini**: Visit [ai.google.dev](https://ai.google.dev) → Get API key
4. **MongoDB Atlas**: Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)

---

## 💡 Core Concepts

### 1. Meeting Architecture

**All video calls in MeetNex use LiveKit's SFU (Selective Forwarding Unit) infrastructure**, which provides optimal performance for both 1:1 and group scenarios.

#### 1:1 Calls

- **Use Case**: Direct video calls between two participants
- **How it works**: LiveKit SFU optimizes the connection for minimal latency
- **Advantages**: Reliable, low latency, managed infrastructure
- **Technology**: LiveKit Cloud SFU

#### Group Calls

- **Use Case**: Multi-participant video calls (3+ participants)
- **How it works**: LiveKit SFU forwards streams between all participants
- **Advantages**: Highly scalable, bandwidth efficient, consistent quality
- **Technology**: LiveKit Cloud infrastructure

### 2. Real-time Communication Layers

#### LiveKit (Video/Audio)

- Handles media streaming
- Manages participant connections
- Provides track management
- Supports screen sharing

#### Socket.io (Chat/Signaling)

- Real-time messaging
- Event broadcasting
- Room management
- Connection state synchronization

### 3. State Management

#### Context API

- **AuthContext**: User authentication state
- **SocketContext**: WebSocket connection
- **ChatContext**: Chat messages and history
- **MeetingContext**: Meeting configuration

#### Redux Toolkit

- Global application state
- Meeting settings
- User preferences

### 4. Authentication Flow

1. User signs in via Clerk
2. Clerk issues JWT token
3. Frontend includes token in API requests
4. Backend validates token via Clerk middleware
5. Webhook syncs user data to MongoDB

### 5. Video Room Lifecycle

```
Create Meeting → Generate Room ID → Share Link
                                      ↓
Join Meeting ← Enter Room ID ← Receive Link
      ↓
Request Token → Validate User → Generate JWT
      ↓
Connect to LiveKit → Publish Tracks → Receive Remote Tracks
      ↓
In-Meeting Controls (Mute, Camera, Screen Share, Chat)
      ↓
Leave Meeting → Cleanup Resources
```

### 6. Responsive Design Strategy

- **Mobile First**: Base styles for mobile, enhanced for desktop
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Adaptive Components**: Different UI for mobile vs desktop
- **Performance**: Conditional rendering based on device capabilities

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /user/sync`

Webhook endpoint for Clerk user synchronization

- **Body**: Clerk webhook payload
- **Response**: User created/updated confirmation

### Meeting Endpoints

#### `POST /meeting/create`

Create a new meeting

- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "type": "SFU",
    "visibility": "OPEN" | "PRIVATE"
  }
  ```
- **Response**:
  ```json
  {
    "roomId": "unique-room-id",
    "createdAt": "timestamp"
  }
  ```

#### `GET /meeting/:roomId`

Get meeting details

- **Headers**: `Authorization: Bearer <token>`
- **Response**: Meeting metadata

### LiveKit Endpoints

#### `POST /api/livekit/token`

Generate LiveKit access token

- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "roomName": "room-id",
    "participantName": "user-name"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token"
  }
  ```

### Upload Endpoints

#### `POST /api/upload`

Upload files (profile pictures, etc.)

- **Headers**: `Authorization: Bearer <token>`
- **Body**: `multipart/form-data`
- **Response**: File URL

### Socket.io Events

#### Client → Server

| Event          | Payload                       | Description         |
| -------------- | ----------------------------- | ------------------- |
| `join-room`    | `{ roomId, userId }`          | Join a meeting room |
| `send-message` | `{ roomId, message, sender }` | Send chat message   |
| `ai-chat`      | `{ message, userId }`         | Send message to AI  |
| `leave-room`   | `{ roomId, userId }`          | Leave meeting       |

#### Server → Client

| Event             | Payload                          | Description      |
| ----------------- | -------------------------------- | ---------------- |
| `user-joined`     | `{ userId, userName }`           | User joined room |
| `receive-message` | `{ message, sender, timestamp }` | New chat message |
| `ai-response`     | `{ response, sessionId }`        | AI response      |
| `user-left`       | `{ userId }`                     | User left room   |

---

## 🎯 Key Features Implementation

### Video Tile Maximization

- Click any participant's video to maximize
- Others shown in sidebar
- Smooth transitions with Framer Motion

### Keyboard Shortcuts

- `m`: Toggle microphone
- `v`: Toggle camera
- `s`: Toggle screen share
- `c`: Open chat
- `p`: View participants

### AI Chat (Lumi)

- Session-based conversations
- Context retention within session
- History sidebar for recent queries
- Powered by Google Gemini 1.5

### Responsive Meeting Controls

- **Desktop**: Full control bar with all options
- **Mobile**: Essential controls + overflow menu
- **Adaptive**: Meeting ID moves to top-left on mobile

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Anupam**

- GitHub: [@Anupam2005-tech](https://github.com/Anupam2005-tech)

---

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io) for video infrastructure
- [Clerk](https://clerk.com) for authentication
- [Google AI](https://ai.google.dev) for Gemini API
- [Aceternity UI](https://ui.aceternity.com) for UI Components
- [React Biys](https://reactbits.dev/) for UI Components


---

<div align="center">
  <p>Built with ❤️ by Anupam</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
