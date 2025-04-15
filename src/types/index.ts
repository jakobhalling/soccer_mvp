/**
 * Core data models and interfaces for the Soccer MVP points tracking app
 */

// Position types
export enum Position {
  GOALKEEPER = 'Goalkeeper',
  DEFENDER = 'Defender',
  MIDFIELDER = 'Midfielder',
  ATTACKER = 'Attacker',
  ALL = 'All'
}

// Event types
export enum EventType {
  CLEAN_SHEET = 'Clean Sheet',
  CONCEDE_1_GOAL = 'Concede 1 Goal',
  CONCEDE_2_GOALS = 'Concede 2 Goals',
  PENALTY_SAVE = 'Penalty Save',
  ASSIST = 'Assist',
  GOAL_SCORED = 'Goal Scored',
  MATCH_WIN = 'Match Win',
  WINNING_PENALTY = 'Winning a Penalty',
  YELLOW_CARD = 'Yellow Card',
  RED_CARD = 'Red Card',
  OWN_GOAL = 'Own Goal'
}

// Formation types
export enum Formation {
  F_442 = '4-4-2',
  F_451 = '4-5-1',
  F_433 = '4-3-3',
  F_541 = '5-4-1',
  F_352 = '3-5-2',
  F_532 = '5-3-2'
}

// Team interface
export interface Team {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Player interface
export interface Player {
  id: string;
  teamId: string;
  name: string;
  number?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Season/Tournament interface
export interface Season {
  id: string;
  teamId: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Match interface
export interface Match {
  id: string;
  teamId: string;
  seasonId: string;
  opponent: string;
  date: Date;
  location?: string;
  isCompleted: boolean;
  homeScore?: number;
  awayScore?: number;
  isHomeMatch: boolean;
  formation?: Formation;
  createdAt: Date;
  updatedAt: Date;
}

// Player Position Assignment interface
export interface PlayerPosition {
  playerId: string;
  matchId: string;
  position: Position;
}

// Player Event interface
export interface PlayerEvent {
  playerId: string;
  matchId: string;
  eventType: EventType;
  count: number;
}

// Point Model interface
export interface PointModelEntry {
  position: Position;
  eventType: EventType;
  points: number;
}

// Authentication State interface (dummy for prototype)
export interface AuthState {
  isAuthenticated: boolean;
  username?: string;
}
