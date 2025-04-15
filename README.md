# Soccer MVP Points Tracking Web App - Documentation

## Overview
This is a Soccer MVP points tracking web application built with React, TypeScript, and Carbon Design System. The application allows teams to track player performance across matches using a configurable point model. It features both public pages for viewing scoreboard data and administrative pages for managing teams, players, matches, and the point model.

## Features
- Team management (create/edit team info and players)
- Match scheduling and results tracking
- Configurable point model for different positions and events
- Player position assignment with visual football pitch
- Event tracking per player per match
- MVP points calculation based on events and positions
- Public scoreboard with filtering options
- Team search functionality

## Technology Stack
- React 18
- TypeScript
- Vite (build tool)
- Carbon Design System (UI components)
- React Router (navigation)
- React DnD (drag and drop functionality)
- LocalStorage (data persistence)

## Project Structure
```
soccer-mvp-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── admin/       # Admin-specific components
│   │   ├── football/    # Football pitch visualization
│   │   └── layouts/     # Layout components
│   ├── context/         # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages
│   │   └── public/      # Public pages
│   ├── tests/           # Unit tests
│   ├── types/           # TypeScript interfaces and types
│   ├── utils/           # Utility functions
│   │   ├── localStorage.ts      # LocalStorage utilities
│   │   ├── mockData.ts          # Mock data generators
│   │   ├── pointCalculation.ts  # MVP point calculation
│   │   └── validation.ts        # Data validation
│   ├── App.css          # Application styles
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
```

## Pages and Navigation

### Public Pages
1. **Frontpage** (`/`)
   - Search for teams by name
   - Navigate to team scoreboard

2. **Scoreboard** (`/team/:teamId`)
   - View team MVP points leaderboard
   - Filter by match
   - See event breakdown per player

3. **Login** (`/login`)
   - Simple login form (dummy for prototype)

### Admin Pages
1. **Administration** (`/admin`)
   - Team Setup: Manage team info and players
   - Match Schedule: Manage seasons and matches
   - Point Model: Configure points per event per position

2. **Match Setup and Results** (`/admin/matches`)
   - Assign players to positions using drag and drop
   - Record events per player
   - Mark matches as completed

## Data Models
- **Team**: Basic team information (name, logo)
- **Player**: Player information (name, number)
- **Season**: Group of matches (name, date range)
- **Match**: Individual match details (opponent, date, score)
- **PlayerPosition**: Player position assignment for a match
- **PlayerEvent**: Events recorded for a player in a match
- **PointModel**: Points configuration for events by position

## State Management
The application uses React Context for state management with the following providers:
- **TeamProvider**: Manages team data
- **PlayersProvider**: Manages player data
- **SeasonsProvider**: Manages season data
- **MatchesProvider**: Manages match data
- **PlayerPositionsProvider**: Manages player position assignments
- **PlayerEventsProvider**: Manages player events
- **PointModelProvider**: Manages point model configuration
- **AuthProvider**: Manages authentication state (dummy for prototype)

## Data Persistence
All data is stored in the browser's localStorage. The application includes utilities for saving and loading data from localStorage, with automatic initialization of mock data on first load.

## MVP Point Calculation
Points are calculated based on:
1. Player's position in a match
2. Events recorded for the player
3. Point values configured in the point model

The calculation takes into account position-specific events and shared events that apply to all positions.

## Running the Application Locally

### Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

### Development
Run the development server:
```
npm run dev
```
The application will be available at http://localhost:5173

### Building for Production
Build the application:
```
npm run build
```
The built files will be in the `dist` directory.

### Running Tests
Run the unit tests:
```
npm test
```

## Future Enhancements
- Backend API integration for data persistence
- User authentication and authorization
- Multiple team management
- Advanced statistics and visualizations
- Export/import functionality
- Mobile application

## Running in Windows WSL
1. Ensure WSL is installed and configured
2. Install Node.js and npm in your WSL environment
3. Clone the repository to your WSL filesystem
4. Follow the installation and development steps above
5. Access the application through your Windows browser at http://localhost:5173
