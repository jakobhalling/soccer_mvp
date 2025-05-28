// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Base entity types for API
export interface ApiTeam {
  id: string;
  name: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPlayer {
  id: string;
  teamId: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSeason {
  id: string;
  teamId: string;
  name: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMatch {
  id: string;
  teamId: string;
  seasonId: string;
  opponent: string;
  date: string;
  location: string;
  isHomeMatch: boolean;
  formation: string;
  homeScore?: number;
  awayScore?: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPlayerPosition {
  id: string;
  playerId: string;
  matchId: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPlayerEvent {
  id: string;
  playerId: string;
  matchId: string;
  eventType: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPointModelEntry {
  id: string;
  position: string;
  eventType: string;
  points: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateTeamRequest {
  name: string;
  logo?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  logo?: string;
}

export interface CreatePlayerRequest {
  teamId: string;
  name: string;
  number: number;
}

export interface UpdatePlayerRequest {
  name?: string;
  number?: number;
}

export interface CreateSeasonRequest {
  teamId: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSeasonRequest {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateMatchRequest {
  teamId: string;
  seasonId: string;
  opponent: string;
  date: string;
  location: string;
  isHomeMatch: boolean;
  formation: string;
}

export interface UpdateMatchRequest {
  opponent?: string;
  date?: string;
  location?: string;
  isHomeMatch?: boolean;
  formation?: string;
  homeScore?: number;
  awayScore?: number;
  isCompleted?: boolean;
}

export interface CreatePlayerPositionRequest {
  playerId: string;
  matchId: string;
  position: string;
}

export interface UpdatePlayerPositionRequest {
  position?: string;
}

export interface CreatePlayerEventRequest {
  playerId: string;
  matchId: string;
  eventType: string;
  count: number;
}

export interface UpdatePlayerEventRequest {
  count?: number;
}

export interface UpdatePointModelRequest {
  entries: {
    position: string;
    eventType: string;
    points: number;
  }[];
}
