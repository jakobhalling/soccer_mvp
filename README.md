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
│   ├── api/            # API client and services
│   │   ├── client.ts   # API client implementation
│   │   ├── index.ts    # API exports
│   │   ├── services.ts # Service wrappers for API
│   │   └── types.ts    # API types and interfaces
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

The application is also prepared for backend integration with a complete API layer that currently logs actions instead of making real HTTP requests.

## Backend API Specification

The frontend is designed to work with a RESTful backend API. The API structure is defined in the `src/api` directory and follows these conventions:

### Base URL
The API base URL is configured in `src/api/client.ts` and should be updated to point to your backend server:
```typescript
const API_BASE_URL = 'https://api.soccer-mvp.example.com';
```

### Authentication
The API is designed to work with token-based authentication. When implementing the backend, you should:
1. Create login/logout endpoints
2. Return JWT tokens or similar authentication tokens
3. Include the token in the Authorization header for all API requests

### API Endpoints

#### Team Endpoints
- `GET /teams/:teamId` - Get team by ID
- `POST /teams` - Create a new team
- `PUT /teams/:teamId` - Update an existing team
- `DELETE /teams/:teamId` - Delete a team

#### Player Endpoints
- `GET /teams/:teamId/players` - Get all players for a team
- `GET /players/:playerId` - Get player by ID
- `POST /players` - Create a new player
- `PUT /players/:playerId` - Update an existing player
- `DELETE /players/:playerId` - Delete a player

#### Season Endpoints
- `GET /teams/:teamId/seasons` - Get all seasons for a team
- `GET /seasons/:seasonId` - Get season by ID
- `POST /seasons` - Create a new season
- `PUT /seasons/:seasonId` - Update an existing season
- `DELETE /seasons/:seasonId` - Delete a season

#### Match Endpoints
- `GET /seasons/:seasonId/matches` - Get all matches for a season
- `GET /matches/:matchId` - Get match by ID
- `POST /matches` - Create a new match
- `PUT /matches/:matchId` - Update an existing match
- `DELETE /matches/:matchId` - Delete a match

#### Player Position Endpoints
- `GET /matches/:matchId/positions` - Get all player positions for a match
- `POST /player-positions` - Create a new player position
- `PUT /player-positions/:playerId/:matchId` - Update an existing player position
- `DELETE /player-positions/:playerId/:matchId` - Delete a player position

#### Player Event Endpoints
- `GET /matches/:matchId/events` - Get all player events for a match
- `POST /player-events` - Create a new player event
- `PUT /player-events/:playerId/:matchId/:eventType` - Update an existing player event
- `DELETE /player-events/:playerId/:matchId/:eventType` - Delete a player event

#### Point Model Endpoints
- `GET /point-model` - Get the point model
- `PUT /point-model` - Update the point model

### Request and Response Formats

All API requests and responses use JSON format. The detailed type definitions can be found in `src/api/types.ts`.

#### Example Request/Response

**Create Player Request:**
```json
POST /players
{
  "teamId": "team-123",
  "name": "John Doe",
  "number": 10
}
```

**Create Player Response:**
```json
{
  "success": true,
  "data": {
    "id": "player-456",
    "teamId": "team-123",
    "name": "John Doe",
    "number": 10,
    "createdAt": "2025-05-28T10:30:00.000Z",
    "updatedAt": "2025-05-28T10:30:00.000Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Player with this number already exists"
}
```

### Integration with Frontend

The frontend is already set up to work with this API structure. The integration is handled in the following files:

1. `src/api/client.ts` - Contains the API client with methods for all endpoints
2. `src/api/services.ts` - Contains service wrappers that handle API responses and errors
3. `src/context/index.tsx` - Context providers that call the API services

To connect the frontend to your backend:

1. Update the `API_BASE_URL` in `src/api/client.ts`
2. Modify the `apiRequest` function in `src/api/client.ts` to make real HTTP requests instead of logging
3. Implement authentication token handling

Example implementation of `apiRequest` with real HTTP requests:

```typescript
const apiRequest = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<ApiResponse<T>> => {
  try {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
    
    const options: RequestInit = {
      method,
      headers,
      credentials: 'include'
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(endpoint, options);
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
```

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
