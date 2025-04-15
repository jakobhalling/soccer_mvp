/**
 * MVP Point calculation utilities
 */
import { 
  Player, 
  Match, 
  PlayerPosition, 
  PlayerEvent, 
  PointModelEntry, 
  Position, 
  EventType 
} from '../types';

/**
 * Calculate MVP points for a player in a match
 * @param playerId - Player ID
 * @param matchId - Match ID
 * @param playerPositions - Array of player positions
 * @param playerEvents - Array of player events
 * @param pointModel - Point model configuration
 * @returns Total MVP points for the player in the match
 */
export const calculatePlayerMatchPoints = (
  playerId: string,
  matchId: string,
  playerPositions: PlayerPosition[],
  playerEvents: PlayerEvent[],
  pointModel: PointModelEntry[]
): number => {
  // Find player's position in the match
  const playerPosition = playerPositions.find(
    pos => pos.playerId === playerId && pos.matchId === matchId
  );
  
  if (!playerPosition) {
    return 0; // Player didn't participate in the match
  }
  
  // Get player's events in the match
  const events = playerEvents.filter(
    event => event.playerId === playerId && event.matchId === matchId
  );
  
  let totalPoints = 0;
  
  // Calculate points based on events and position
  events.forEach(event => {
    // Look for position-specific point value
    const pointEntry = pointModel.find(
      entry => entry.position === playerPosition.position && entry.eventType === event.eventType
    );
    
    // If not found, look for "All" positions point value
    const allPositionsEntry = !pointEntry 
      ? pointModel.find(entry => entry.position === Position.ALL && entry.eventType === event.eventType)
      : null;
    
    if (pointEntry) {
      totalPoints += pointEntry.points * event.count;
    } else if (allPositionsEntry) {
      totalPoints += allPositionsEntry.points * event.count;
    }
  });
  
  return totalPoints;
};

/**
 * Calculate total MVP points for a player across all matches
 * @param playerId - Player ID
 * @param matches - Array of matches
 * @param playerPositions - Array of player positions
 * @param playerEvents - Array of player events
 * @param pointModel - Point model configuration
 * @returns Total MVP points for the player across all matches
 */
export const calculatePlayerTotalPoints = (
  playerId: string,
  matches: Match[],
  playerPositions: PlayerPosition[],
  playerEvents: PlayerEvent[],
  pointModel: PointModelEntry[]
): number => {
  // Only consider completed matches
  const completedMatches = matches.filter(match => match.isCompleted);
  
  let totalPoints = 0;
  
  completedMatches.forEach(match => {
    totalPoints += calculatePlayerMatchPoints(
      playerId,
      match.id,
      playerPositions,
      playerEvents,
      pointModel
    );
  });
  
  return totalPoints;
};

/**
 * Calculate MVP points for all players in a match
 * @param matchId - Match ID
 * @param players - Array of players
 * @param playerPositions - Array of player positions
 * @param playerEvents - Array of player events
 * @param pointModel - Point model configuration
 * @returns Array of player IDs and their MVP points for the match
 */
export const calculateMatchPlayerPoints = (
  matchId: string,
  players: Player[],
  playerPositions: PlayerPosition[],
  playerEvents: PlayerEvent[],
  pointModel: PointModelEntry[]
): { playerId: string; points: number }[] => {
  // Get players who participated in the match
  const matchPlayerIds = playerPositions
    .filter(pos => pos.matchId === matchId)
    .map(pos => pos.playerId);
  
  return matchPlayerIds.map(playerId => ({
    playerId,
    points: calculatePlayerMatchPoints(
      playerId,
      matchId,
      playerPositions,
      playerEvents,
      pointModel
    )
  }));
};

/**
 * Calculate MVP points for all players across all matches
 * @param players - Array of players
 * @param matches - Array of matches
 * @param playerPositions - Array of player positions
 * @param playerEvents - Array of player events
 * @param pointModel - Point model configuration
 * @returns Array of player IDs and their total MVP points
 */
export const calculateAllPlayerPoints = (
  players: Player[],
  matches: Match[],
  playerPositions: PlayerPosition[],
  playerEvents: PlayerEvent[],
  pointModel: PointModelEntry[]
): { playerId: string; points: number }[] => {
  return players.map(player => ({
    playerId: player.id,
    points: calculatePlayerTotalPoints(
      player.id,
      matches,
      playerPositions,
      playerEvents,
      pointModel
    )
  }));
};

/**
 * Get event breakdown for a player
 * @param playerId - Player ID
 * @param matches - Array of matches
 * @param playerPositions - Array of player positions
 * @param playerEvents - Array of player events
 * @returns Object with event types as keys and total counts as values
 */
export const getPlayerEventBreakdown = (
  playerId: string,
  matches: Match[],
  playerPositions: PlayerPosition[],
  playerEvents: PlayerEvent[]
): Record<string, number> => {
  // Only consider completed matches
  const completedMatches = matches.filter(match => match.isCompleted);
  const completedMatchIds = completedMatches.map(match => match.id);
  
  // Get player's events in completed matches
  const events = playerEvents.filter(
    event => event.playerId === playerId && completedMatchIds.includes(event.matchId)
  );
  
  // Aggregate event counts
  const eventBreakdown: Record<string, number> = {};
  
  events.forEach(event => {
    if (eventBreakdown[event.eventType]) {
      eventBreakdown[event.eventType] += event.count;
    } else {
      eventBreakdown[event.eventType] = event.count;
    }
  });
  
  return eventBreakdown;
};
