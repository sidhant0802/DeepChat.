# DeepChat 🤖

DeepChat is a full-stack AI chat application with authentication, persistent chat history, and a modern ChatGPT-style interface.

It connects to an LLM through the **OpenRouter API** and stores conversations in **MongoDB** for each user.

The project uses a **Node.js backend with API routes**, a **clean frontend UI**, and is designed for **easy deployment on Vercel**.

---

# ✨ Features

### 🤖 AI Chat

* ChatGPT-style interface
* AI responses via OpenRouter
* Markdown-style formatted responses
* Typing indicator

### 👤 Authentication

* Secure user login & signup
* JWT-based authentication
* Cookie-based sessions
* Protected API routes

### 💬 Chat History

* Conversations stored in MongoDB
* Each user has their own chat history
* Load previous messages
* Persistent sessions

### 🎤 Voice Input

* Voice-to-text input using the Speech Recognition API
* Supported in Chrome and Edge

### 🎨 Modern UI

* Clean responsive design
* Works on mobile and desktop
* Dropdown profile menu
* Logout functionality

### 🚀 Deployment Ready

* Serverless-friendly architecture
* Easily deployable on Vercel

---

# 📁 Project Structure

```
ChatBot
│
├── api
│   ├── auth.js        # Login / signup / logout API
│   ├── chat.js        # Chat endpoint
│   ├── history.js     # Chat history API
│   └── llm.js         # LLM request logic (OpenRouter)
│
├── lib
│   └── db.js          # MongoDB connection
│
├── middleware
│   └── authMiddleware.js  # JWT authentication middleware
│
├── models
│   ├── Chat.js        # Chat message schema
│   └── User.js        # User schema
│
├── public
│   ├── auth.html      # Login / signup page
│   ├── index.html     # Chat UI
│   ├── script.js      # Chat frontend logic
│   ├── script1.js     # Auth frontend logic
│   ├── style.css      # Chat styles
│   └── style1.css     # Auth styles
│
├── logo.png
├── package.json
├── vercel.json
├── .env
└── README.md
```

---

# ⚙️ Local Setup

## 1 Clone Repository

```
git clone https://github.com/sidhant0802/DeepChat.git
cd ChatBot
```

---

## 2 Install Dependencies

```
npm install
```

Dependencies used:

```
axios
bcryptjs
cookie-parser
dotenv
jsonwebtoken
mongoose
```

---

## 3 Create `.env`

Create a file called:

```
.env
```

Add the required environment variables.

Example:

```
OPENROUTER_API_KEY=your_openrouter_key
MONGODB_URI=mongodb://localhost:27017/deepchat
JWT_SECRET=deepchat_secret
```

---

# 🚀 Running Locally

Start the server:

```
node server.js
```

Then open:

```
http://localhost:3000
```

---

# 🧠 How It Works

### Authentication Flow

```
auth.html
   ↓
/api/auth
   ↓
User.js (MongoDB)
   ↓
JWT Cookie
```

---

### Chat Flow

```
index.html
   ↓
POST /api/chat
   ↓
authMiddleware.js
   ↓
llm.js
   ↓
OpenRouter API
   ↓
AI Response
```

---

### Chat History Flow

```
index.html
   ↓
GET /api/history
   ↓
MongoDB (Chat model)
   ↓
Previous messages loaded
```

---

# 🗄 Database

MongoDB stores:

### Users

```
User
 ├─ name
 ├─ username
 ├─ email
 ├─ password (hashed)
 └─ timestamps
```

### Chat Messages

```
Chat
 ├─ userId
 ├─ role (user / assistant)
 ├─ message
 └─ createdAt
```

---

# 🔑 Environment Variables

Required variables:

```
OPENROUTER_API_KEY
MONGODB_URI
JWT_SECRET
```

Example `.env`:

```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
MONGODB_URI=mongodb://localhost:27017/deepchat
JWT_SECRET=deepchat_secret
```

Your `.gitignore` should contain:

```
node_modules
.env
.DS_Store
```

---

# 🚀 Deployment (Vercel)

1 Push repository

```
git add .
git commit -m "DeepChat ready"
git push
```

2 Go to

```
https://vercel.com
```

3 Import GitHub repository

4 Add Environment Variables

```
OPENROUTER_API_KEY
MONGODB_URI
JWT_SECRET
```

5 Click **Deploy**

---

# 🎤 Voice Input

Voice input uses the browser Speech Recognition API.

Supported browsers:

* Chrome
* Edge

---

# 🛠 Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* API routes

### Database

* MongoDB
* Mongoose

### Authentication

* JWT
* Cookies

### AI

* OpenRouter API

### Deployment

* Vercel

---

# 👨‍💻 Author

**Sidhant Nirupam**

