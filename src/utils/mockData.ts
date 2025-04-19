/**
 * Mock data generators for development
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
  EventType, 
  Formation 
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// Generate a mock team
export const generateMockTeam = (): Team => {
  const now = new Date();
  return {
    id: uuidv4(),
    name: 'FC Example',
    logo: 'https://via.placeholder.com/150',
    createdAt: now,
    updatedAt: now
  };
};

// Generate mock players
export const generateMockPlayers = (teamId: string, count: number = 20): Player[] => {
  const now = new Date();
  const players: Player[] = [];
  
  const sampleNames = [
  'Oliver Smith', 'Noah Johnson', 'Liam Williams', 'Mason Brown', 'Elijah Jones',
  'James Garcia', 'Benjamin Miller', 'Lucas Davis', 'Henry Rodriguez', 'Alexander Martinez',
  'William Hernandez', 'Jack Lopez', 'Daniel Gonzalez', 'Matthew Wilson', 'Sebastian Anderson',
  'Jacob Thomas', 'Logan Taylor', 'Aiden Moore', 'Jackson Martin', 'Samuel Lee'
];
for (let i = 1; i <= count; i++) {
  players.push({
    id: uuidv4(),
    teamId,
    name: sampleNames[(i - 1) % sampleNames.length],
    number: i,
    createdAt: now,
    updatedAt: now
  });
}
  
  return players;
};

// Generate a mock season
export const generateMockSeason = (teamId: string): Season => {
  const now = new Date();
  return {
    id: uuidv4(),
    teamId,
    name: 'Season 2025',
    startDate: new Date(2025, 0, 1), // January 1, 2025
    endDate: new Date(2025, 11, 31), // December 31, 2025
    createdAt: now,
    updatedAt: now
  };
};

// Generate mock matches
export const generateMockMatches = (teamId: string, seasonId: string, count: number = 10): Match[] => {
  const now = new Date();
  const matches: Match[] = [];
  
  for (let i = 1; i <= count; i++) {
    const matchDate = new Date();
    matchDate.setDate(matchDate.getDate() + (i * 7)); // One match per week
    
    matches.push({
      id: uuidv4(),
      teamId,
      seasonId,
      opponent: `Opponent ${i}`,
      date: matchDate,
      location: `Stadium ${i}`,
      isCompleted: i <= 3, // First 3 matches are completed
      homeScore: i <= 3 ? Math.floor(Math.random() * 5) : undefined,
      awayScore: i <= 3 ? Math.floor(Math.random() * 3) : undefined,
      isHomeMatch: i % 2 === 0, // Alternate home and away
      formation: i % 2 === 0 ? Formation.F_442 : Formation.F_433,
      createdAt: now,
      updatedAt: now
    });
  }
  
  return matches;
};

// Generate mock player positions for a match
export const generateMockPlayerPositions = (matchId: string, players: Player[]): PlayerPosition[] => {
  const positions: PlayerPosition[] = [];
  
  // Assign goalkeeper
  positions.push({
    playerId: players[0].id,
    matchId,
    position: Position.GOALKEEPER
  });
  
  // Assign defenders
  for (let i = 1; i <= 4; i++) {
    positions.push({
      playerId: players[i].id,
      matchId,
      position: Position.DEFENDER
    });
  }
  
  // Assign midfielders
  for (let i = 5; i <= 8; i++) {
    positions.push({
      playerId: players[i].id,
      matchId,
      position: Position.MIDFIELDER
    });
  }
  
  // Assign attackers
  for (let i = 9; i <= 10; i++) {
    positions.push({
      playerId: players[i].id,
      matchId,
      position: Position.ATTACKER
    });
  }
  
  return positions;
};

// Generate mock player events for a match
export const generateMockPlayerEvents = (matchId: string, playerPositions: PlayerPosition[]): PlayerEvent[] => {
  const events: PlayerEvent[] = [];
  
  playerPositions.forEach(pp => {
    switch (pp.position) {
      case Position.GOALKEEPER:
        // Clean sheet or conceded goals
        events.push({
          playerId: pp.playerId,
          matchId,
          eventType: Math.random() > 0.5 ? EventType.CLEAN_SHEET : EventType.CONCEDE_1_GOAL,
          count: 1
        });
        
        // Occasional penalty save
        if (Math.random() > 0.8) {
          events.push({
            playerId: pp.playerId,
            matchId,
            eventType: EventType.PENALTY_SAVE,
            count: 1
          });
        }
        break;
        
      case Position.DEFENDER:
        // Clean sheet or conceded goals
        events.push({
          playerId: pp.playerId,
          matchId,
          eventType: Math.random() > 0.5 ? EventType.CLEAN_SHEET : EventType.CONCEDE_1_GOAL,
          count: 1
        });
        
        // Occasional goal or assist
        if (Math.random() > 0.7) {
          events.push({
            playerId: pp.playerId,
            matchId,
            eventType: Math.random() > 0.5 ? EventType.GOAL_SCORED : EventType.ASSIST,
            count: 1
          });
        }
        break;
        
      case Position.MIDFIELDER:
        // Goals and assists
        if (Math.random() > 0.3) {
          events.push({
            playerId: pp.playerId,
            matchId,
            eventType: Math.random() > 0.5 ? EventType.GOAL_SCORED : EventType.ASSIST,
            count: Math.floor(Math.random() * 2) + 1
          });
        }
        break;
        
      case Position.ATTACKER:
        // Goals and assists
        events.push({
          playerId: pp.playerId,
          matchId,
          eventType: EventType.GOAL_SCORED,
          count: Math.floor(Math.random() * 3) + 1
        });
        
        if (Math.random() > 0.5) {
          events.push({
            playerId: pp.playerId,
            matchId,
            eventType: EventType.ASSIST,
            count: Math.floor(Math.random() * 2) + 1
          });
        }
        
        // Occasional winning penalty
        if (Math.random() > 0.8) {
          events.push({
            playerId: pp.playerId,
            matchId,
            eventType: EventType.WINNING_PENALTY,
            count: 1
          });
        }
        break;
    }
    
    // Random cards for any position
    if (Math.random() > 0.8) {
      events.push({
        playerId: pp.playerId,
        matchId,
        eventType: Math.random() > 0.3 ? EventType.YELLOW_CARD : EventType.RED_CARD,
        count: 1
      });
    }
    
    // Very rare own goal
    if (Math.random() > 0.95) {
      events.push({
        playerId: pp.playerId,
        matchId,
        eventType: EventType.OWN_GOAL,
        count: 1
      });
    }
    
    // Match win for all players
    events.push({
      playerId: pp.playerId,
      matchId,
      eventType: EventType.MATCH_WIN,
      count: 1
    });
  });
  
  return events;
};

// Generate default point model based on the Excel file
export const generateDefaultPointModel = (): PointModelEntry[] => {
  return [
    { position: Position.GOALKEEPER, eventType: EventType.CLEAN_SHEET, points: 8 },
    { position: Position.GOALKEEPER, eventType: EventType.CONCEDE_1_GOAL, points: 4 },
    { position: Position.GOALKEEPER, eventType: EventType.CONCEDE_2_GOALS, points: 2 },
    { position: Position.GOALKEEPER, eventType: EventType.PENALTY_SAVE, points: 7 },
    { position: Position.GOALKEEPER, eventType: EventType.ASSIST, points: 8 },
    { position: Position.GOALKEEPER, eventType: EventType.GOAL_SCORED, points: 15 },
    { position: Position.GOALKEEPER, eventType: EventType.MATCH_WIN, points: 2 },
    
    { position: Position.DEFENDER, eventType: EventType.CLEAN_SHEET, points: 6 },
    { position: Position.DEFENDER, eventType: EventType.CONCEDE_1_GOAL, points: 4 },
    { position: Position.DEFENDER, eventType: EventType.CONCEDE_2_GOALS, points: 2 },
    { position: Position.DEFENDER, eventType: EventType.ASSIST, points: 9 },
    { position: Position.DEFENDER, eventType: EventType.GOAL_SCORED, points: 12 },
    { position: Position.DEFENDER, eventType: EventType.MATCH_WIN, points: 2 },
    
    { position: Position.MIDFIELDER, eventType: EventType.GOAL_SCORED, points: 7 },
    { position: Position.MIDFIELDER, eventType: EventType.ASSIST, points: 7 },
    { position: Position.MIDFIELDER, eventType: EventType.MATCH_WIN, points: 2 },
    { position: Position.MIDFIELDER, eventType: EventType.CLEAN_SHEET, points: 2 },
    { position: Position.MIDFIELDER, eventType: EventType.CONCEDE_1_GOAL, points: 1 },
    
    { position: Position.ATTACKER, eventType: EventType.GOAL_SCORED, points: 6 },
    { position: Position.ATTACKER, eventType: EventType.ASSIST, points: 6 },
    { position: Position.ATTACKER, eventType: EventType.MATCH_WIN, points: 2 },
    { position: Position.ATTACKER, eventType: EventType.WINNING_PENALTY, points: 2 },
    
    { position: Position.ALL, eventType: EventType.YELLOW_CARD, points: -1 },
    { position: Position.ALL, eventType: EventType.RED_CARD, points: -3 },
    { position: Position.ALL, eventType: EventType.OWN_GOAL, points: -2 }
  ];
};

// Generate complete mock data set
export const generateMockData = () => {
  const team = generateMockTeam();
  const players = generateMockPlayers(team.id);
  const season = generateMockSeason(team.id);
  const matches = generateMockMatches(team.id, season.id);
  
  const playerPositions: PlayerPosition[] = [];
  const playerEvents: PlayerEvent[] = [];
  
  // Generate positions and events for completed matches
  matches.filter(m => m.isCompleted).forEach(match => {
    const positions = generateMockPlayerPositions(match.id, players);
    playerPositions.push(...positions);
    
    const events = generateMockPlayerEvents(match.id, positions);
    playerEvents.push(...events);
  });
  
  const pointModel = generateDefaultPointModel();
  
  return {
    team,
    players,
    season,
    matches,
    playerPositions,
    playerEvents,
    pointModel
  };
};
