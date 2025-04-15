/**
 * Data validation utilities for the Soccer MVP points tracking app
 */
import { 
  Team, 
  Player, 
  Season, 
  Match, 
  PlayerPosition, 
  PlayerEvent, 
  PointModelEntry, 
  Position, 
  EventType 
} from '../types';

/**
 * Validate team data
 * @param team - Team data to validate
 * @returns Object with isValid flag and error messages
 */
export const validateTeam = (team: Partial<Team>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!team.name || team.name.trim() === '') {
    errors.push('Team name is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate player data
 * @param player - Player data to validate
 * @returns Object with isValid flag and error messages
 */
export const validatePlayer = (player: Partial<Player>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!player.name || player.name.trim() === '') {
    errors.push('Player name is required');
  }
  
  if (!player.teamId) {
    errors.push('Team ID is required');
  }
  
  if (player.number !== undefined && (isNaN(player.number) || player.number < 0 || player.number > 99)) {
    errors.push('Player number must be between 0 and 99');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate season data
 * @param season - Season data to validate
 * @returns Object with isValid flag and error messages
 */
export const validateSeason = (season: Partial<Season>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!season.name || season.name.trim() === '') {
    errors.push('Season name is required');
  }
  
  if (!season.teamId) {
    errors.push('Team ID is required');
  }
  
  if (season.startDate && season.endDate && new Date(season.startDate) > new Date(season.endDate)) {
    errors.push('Start date must be before end date');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate match data
 * @param match - Match data to validate
 * @returns Object with isValid flag and error messages
 */
export const validateMatch = (match: Partial<Match>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!match.opponent || match.opponent.trim() === '') {
    errors.push('Opponent name is required');
  }
  
  if (!match.date) {
    errors.push('Match date is required');
  }
  
  if (!match.teamId) {
    errors.push('Team ID is required');
  }
  
  if (!match.seasonId) {
    errors.push('Season ID is required');
  }
  
  if (match.isCompleted) {
    if (match.homeScore === undefined || match.awayScore === undefined) {
      errors.push('Home and away scores are required for completed matches');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate player position assignment
 * @param playerPosition - Player position data to validate
 * @param existingPositions - Existing position assignments for the match
 * @returns Object with isValid flag and error messages
 */
export const validatePlayerPosition = (
  playerPosition: Partial<PlayerPosition>,
  existingPositions: PlayerPosition[] = []
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!playerPosition.playerId) {
    errors.push('Player ID is required');
  }
  
  if (!playerPosition.matchId) {
    errors.push('Match ID is required');
  }
  
  if (!playerPosition.position) {
    errors.push('Position is required');
  }
  
  // Check if player is already assigned to a position in this match
  const playerAlreadyAssigned = existingPositions.some(
    pos => pos.playerId === playerPosition.playerId && pos.matchId === playerPosition.matchId
  );
  
  if (playerAlreadyAssigned) {
    errors.push('Player is already assigned to a position in this match');
  }
  
  // Check if goalkeeper position is already filled
  if (playerPosition.position === Position.GOALKEEPER) {
    const goalkeeperExists = existingPositions.some(
      pos => pos.position === Position.GOALKEEPER && pos.matchId === playerPosition.matchId
    );
    
    if (goalkeeperExists) {
      errors.push('Goalkeeper position is already filled');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate player event data
 * @param playerEvent - Player event data to validate
 * @returns Object with isValid flag and error messages
 */
export const validatePlayerEvent = (playerEvent: Partial<PlayerEvent>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!playerEvent.playerId) {
    errors.push('Player ID is required');
  }
  
  if (!playerEvent.matchId) {
    errors.push('Match ID is required');
  }
  
  if (!playerEvent.eventType) {
    errors.push('Event type is required');
  }
  
  if (playerEvent.count === undefined || playerEvent.count < 0) {
    errors.push('Event count must be a non-negative number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate point model entry
 * @param pointModelEntry - Point model entry to validate
 * @returns Object with isValid flag and error messages
 */
export const validatePointModelEntry = (pointModelEntry: Partial<PointModelEntry>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!pointModelEntry.position) {
    errors.push('Position is required');
  }
  
  if (!pointModelEntry.eventType) {
    errors.push('Event type is required');
  }
  
  if (pointModelEntry.points === undefined) {
    errors.push('Points value is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
