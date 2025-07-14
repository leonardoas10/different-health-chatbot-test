# 🤖 Different Health Chatbot

## 📋 Description

This project fulfills the test requirements. For more detailed information, please refer to the PDF documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- Yarn package manager
- MongoDB Atlas account

### 🔧 Installation & Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd <repo-name>
    ```

2. **Set up environment variables**

    Create `.env` files in both `server` and `front` directories with the required environment variables:

    **Server (.env)**

    ```
    JWT_SECRET=your-jwt-secret
    MONGO_ATLAS_URL=your-mongodb-connection-string
    OPENAI_API_KEY=your-openai-api-key
    SERVER_PORT=8080
    ```

    **Frontend (.env.local)**

    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

3. **Install dependencies**
    ```bash
    yarn install
    ```

### 🏃‍♂️ Running the Application

1. **Start the backend server**

    ```bash
    cd server
    npm run dev
    ```

2. **Start the frontend (in a new terminal)**

    ```bash
    cd front
    npm run dev
    ```

3. **Access the application**
    - Frontend: http://localhost:3000
    - Backend API: http://localhost:8080

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Fastify, Node.js, TypeScript
- **Database**: MongoDB Atlas
- **AI**: OpenAI GPT-4, LangChain
- **Authentication**: JWT

## 📁 Project Structure

```
├── front/          # Next.js frontend application
├── server/         # Fastify backend API
├── package.json    # Workspace configuration
└── README.md       # This file
```

## 🔐 Authentication

The application uses a mock authentication system. Click "Log In" to authenticate and access the chatbot functionality.

## 💬 Features

- Health data analysis and insights
- Real-time chatbot interactions
- Body composition tracking (DEXA scans)
- HRV monitoring and trends
- VO2 Max progress tracking
- Wearable device data integration

---

Made with ❤️ for Different Health
