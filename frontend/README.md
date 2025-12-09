# Allmaps Frontend

## Overview
This is the frontend client for Allmaps, a dynamic roadmap visualization tool. Built with React and Vite, it provides an interactive interface for users to generate, view, and manage learning roadmaps powered by AI.

## Architecture & Flow

The frontend interfaces with the NestJS backend to authenticate users and retrieve generated roadmaps. It uses React Flow to render interactive diagrams.

```mermaid
graph LR
    %% User
    User((User))

    %% Frontend Components
    subgraph "Frontend (React + Vite)"
        UI[UI Components (MUI)]
        AuthPage[Auth Pages]
        Dashboard[Dashboard]
        RoadmapCanvas[Roadmap Canvas (React Flow)]
        API[API Service (Axios)]
    end

    %% Backend
    subgraph "Backend System"
        NestAPI[NestJS API]
        Gemini[Gemini AI]
    end

    %% Styles
    style User fill:#fff,stroke:#333
    style Gemini fill:#4285F4,stroke:#fff,stroke-width:2px,color:#fff
    style NestAPI fill:#E0234E,stroke:#fff,stroke-width:2px,color:#fff
    style Interaction fill:#f9f,stroke:#333,stroke-dasharray: 5 5

    %% Application Flow
    User -- "Interacts" --> UI
    UI -- "Login/Register" --> AuthPage
    UI -- "View Maps" --> Dashboard
    
    Dashboard -- "Render Map" --> RoadmapCanvas
    
    AuthPage -- "Auth Request" --> API
    Dashboard -- "Fetch Data" --> API
    
    API -- "HTTP / REST" --> NestAPI
    NestAPI -.-> Gemini
```

## Tech Stack
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Material UI (MUI)](https://mui.com/)
- **Visualization**: [React Flow](https://reactflow.dev/)
- **HTTP Client**: Axios
- **Language**: TypeScript

## Key Components
- **RoadmapCanvas**: The core component that renders the interactive node-based roadmap using React Flow.
- **API Service**: Centralized service for handling HTTP requests to the backend, including interceptors for JWT authentication.
- **Auth Components**: Login and Registration forms utilizing MUI for a polished look.

## Setup & Running

### Prerequisites
- Node.js (v18+)
- Backend server running on port 3000 (default)

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Setup:**
    Ensure the backend URL is configured (usually defaults to `http://localhost:3000` in the API service, or set via `.env` if configured).

### Running the App

```bash
# Development Server
npm run dev

# Build for Production
npm run build
```

## Features
- **AI-Powered Generation**: Generate learning paths instantly.
- **Interactive UI**: Drag, zoom, and explore roadmap nodes.
- **Responsive Design**: Modern UI/UX adapted for different screen sizes.
