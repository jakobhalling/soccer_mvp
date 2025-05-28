import React from 'react';
import { Team, Player, Match, Season, PlayerPosition, PlayerEvent, PointModelEntry } from '../types';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from '../utils/localStorage';
import { generateMockData } from '../utils/mockData';
import { 
  teamService, 
  playerService, 
  seasonService, 
  matchService, 
  playerPositionService, 
  playerEventService, 
  pointModelService 
} from '../api/services';

// Define context types
interface TeamContextType {
  team: Team | null;
  setTeam: (team: Team) => void;
  updateTeam: (updates: Partial<Team>) => void;
}

interface PlayersContextType {
  players: Player[];
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
}

interface SeasonsContextType {
  seasons: Season[];
  addSeason: (season: Season) => void;
  updateSeason: (id: string, updates: Partial<Season>) => void;
  deleteSeason: (id: string) => void;
}

interface MatchesContextType {
  matches: Match[];
  addMatch: (match: Match) => void;
  updateMatch: (id: string, updates: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
}

interface PlayerPositionsContextType {
  playerPositions: PlayerPosition[];
  addPlayerPosition: (playerPosition: PlayerPosition) => void;
  updatePlayerPosition: (playerId: string, matchId: string, updates: Partial<PlayerPosition>) => void;
  deletePlayerPosition: (playerId: string, matchId: string) => void;
  getPlayerPositionsByMatch: (matchId: string) => PlayerPosition[];
}

interface PlayerEventsContextType {
  playerEvents: PlayerEvent[];
  addPlayerEvent: (playerEvent: PlayerEvent) => void;
  updatePlayerEvent: (playerId: string, matchId: string, eventType: string, updates: Partial<PlayerEvent>) => void;
  deletePlayerEvent: (playerId: string, matchId: string, eventType: string) => void;
  getPlayerEventsByMatch: (matchId: string) => PlayerEvent[];
}

interface PointModelContextType {
  pointModel: PointModelEntry[];
  updatePointModel: (pointModel: PointModelEntry[]) => void;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => void;
  logout: () => void;
}

// Create contexts
export const TeamContext = React.createContext<TeamContextType | undefined>(undefined);
export const PlayersContext = React.createContext<PlayersContextType | undefined>(undefined);
export const SeasonsContext = React.createContext<SeasonsContextType | undefined>(undefined);
export const MatchesContext = React.createContext<MatchesContextType | undefined>(undefined);
export const PlayerPositionsContext = React.createContext<PlayerPositionsContextType | undefined>(undefined);
export const PlayerEventsContext = React.createContext<PlayerEventsContextType | undefined>(undefined);
export const PointModelContext = React.createContext<PointModelContextType | undefined>(undefined);
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  TEAM: 'soccer_mvp_team',
  PLAYERS: 'soccer_mvp_players',
  SEASONS: 'soccer_mvp_seasons',
  MATCHES: 'soccer_mvp_matches',
  PLAYER_POSITIONS: 'soccer_mvp_player_positions',
  PLAYER_EVENTS: 'soccer_mvp_player_events',
  POINT_MODEL: 'soccer_mvp_point_model',
  AUTH: 'soccer_mvp_auth'
};

// Provider components
export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [team, setTeamState] = React.useState<Team | null>(
    loadFromLocalStorage<Team | null>(STORAGE_KEYS.TEAM, null)
  );

  const setTeam = (team: Team) => {
    // Call API service
    teamService.createTeam({
      name: team.name,
      logo: team.logo
    }).then(apiTeam => {
      console.info('[API Response] Create Team:', apiTeam);
    });
    
    // Update local state
    setTeamState(team);
    saveToLocalStorage(STORAGE_KEYS.TEAM, team);
  };

  const updateTeam = (updates: Partial<Team>) => {
    if (!team) return;
    
    // Call API service
    teamService.updateTeam(team.id, {
      name: updates.name,
      logo: updates.logo
    }).then(apiTeam => {
      console.info('[API Response] Update Team:', apiTeam);
    });
    
    // Update local state
    const updatedTeam = { ...team, ...updates, updatedAt: new Date() };
    setTeamState(updatedTeam);
    saveToLocalStorage(STORAGE_KEYS.TEAM, updatedTeam);
  };

  return (
    <TeamContext.Provider value={{ team, setTeam, updateTeam }}>
      {children}
    </TeamContext.Provider>
  );
};

export const PlayersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = React.useState<Player[]>(
    loadFromLocalStorage<Player[]>(STORAGE_KEYS.PLAYERS, [])
  );

  const addPlayer = (player: Player) => {
    // Call API service
    playerService.createPlayer({
      teamId: player.teamId,
      name: player.name,
      number: player.number
    }).then(apiPlayer => {
      console.info('[API Response] Create Player:', apiPlayer);
    });
    
    // Update local state
    const updatedPlayers = [...players, player];
    setPlayers(updatedPlayers);
    saveToLocalStorage(STORAGE_KEYS.PLAYERS, updatedPlayers);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    // Call API service
    playerService.updatePlayer(id, {
      name: updates.name,
      number: updates.number
    }).then(apiPlayer => {
      console.info('[API Response] Update Player:', apiPlayer);
    });
    
    // Update local state
    const updatedPlayers = players.map(player => 
      player.id === id ? { ...player, ...updates, updatedAt: new Date() } : player
    );
    setPlayers(updatedPlayers);
    saveToLocalStorage(STORAGE_KEYS.PLAYERS, updatedPlayers);
  };

  const deletePlayer = (id: string) => {
    // Call API service
    playerService.deletePlayer(id).then(success => {
      console.info('[API Response] Delete Player:', success);
    });
    
    // Update local state
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers);
    saveToLocalStorage(STORAGE_KEYS.PLAYERS, updatedPlayers);
  };

  return (
    <PlayersContext.Provider value={{ players, addPlayer, updatePlayer, deletePlayer }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const SeasonsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seasons, setSeasons] = React.useState<Season[]>(
    loadFromLocalStorage<Season[]>(STORAGE_KEYS.SEASONS, [])
  );

  const addSeason = (season: Season) => {
    // Call API service
    seasonService.createSeason({
      teamId: season.teamId,
      name: season.name,
      startDate: season.startDate?.toISOString() || new Date().toISOString(),
      endDate: season.endDate?.toISOString() || new Date().toISOString()
    }).then(apiSeason => {
      console.info('[API Response] Create Season:', apiSeason);
    });
    
    // Update local state
    const updatedSeasons = [...seasons, season];
    setSeasons(updatedSeasons);
    saveToLocalStorage(STORAGE_KEYS.SEASONS, updatedSeasons);
  };

  const updateSeason = (id: string, updates: Partial<Season>) => {
    // Call API service
    seasonService.updateSeason(id, {
      name: updates.name,
      startDate: updates.startDate?.toISOString(),
      endDate: updates.endDate?.toISOString()
    }).then(apiSeason => {
      console.info('[API Response] Update Season:', apiSeason);
    });
    
    // Update local state
    const updatedSeasons = seasons.map(season => 
      season.id === id ? { ...season, ...updates, updatedAt: new Date() } : season
    );
    setSeasons(updatedSeasons);
    saveToLocalStorage(STORAGE_KEYS.SEASONS, updatedSeasons);
  };

  const deleteSeason = (id: string) => {
    // Call API service
    seasonService.deleteSeason(id).then(success => {
      console.info('[API Response] Delete Season:', success);
    });
    
    // Update local state
    const updatedSeasons = seasons.filter(season => season.id !== id);
    setSeasons(updatedSeasons);
    saveToLocalStorage(STORAGE_KEYS.SEASONS, updatedSeasons);
  };

  return (
    <SeasonsContext.Provider value={{ seasons, addSeason, updateSeason, deleteSeason }}>
      {children}
    </SeasonsContext.Provider>
  );
};

export const MatchesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = React.useState<Match[]>(
    loadFromLocalStorage<Match[]>(STORAGE_KEYS.MATCHES, [])
  );

  const addMatch = (match: Match) => {
    // Call API service
    matchService.createMatch({
      teamId: match.teamId,
      seasonId: match.seasonId,
      opponent: match.opponent,
      date: match.date.toISOString(),
      location: match.location || '',
      isHomeMatch: match.isHomeMatch,
      formation: match.formation || 'F_442'
    }).then(apiMatch => {
      console.info('[API Response] Create Match:', apiMatch);
    });
    
    // Update local state
    const updatedMatches = [...matches, match];
    setMatches(updatedMatches);
    saveToLocalStorage(STORAGE_KEYS.MATCHES, updatedMatches);
  };

  const updateMatch = (id: string, updates: Partial<Match>) => {
    // Call API service
    matchService.updateMatch(id, {
      opponent: updates.opponent,
      date: updates.date?.toISOString(),
      location: updates.location,
      isHomeMatch: updates.isHomeMatch,
      formation: updates.formation,
      homeScore: updates.homeScore,
      awayScore: updates.awayScore,
      isCompleted: updates.isCompleted
    }).then(apiMatch => {
      console.info('[API Response] Update Match:', apiMatch);
    });
    
    // Update local state
    const updatedMatches = matches.map(match => 
      match.id === id ? { ...match, ...updates, updatedAt: new Date() } : match
    );
    setMatches(updatedMatches);
    saveToLocalStorage(STORAGE_KEYS.MATCHES, updatedMatches);
  };

  const deleteMatch = (id: string) => {
    // Call API service
    matchService.deleteMatch(id).then(success => {
      console.info('[API Response] Delete Match:', success);
    });
    
    // Update local state
    const updatedMatches = matches.filter(match => match.id !== id);
    setMatches(updatedMatches);
    saveToLocalStorage(STORAGE_KEYS.MATCHES, updatedMatches);
  };

  return (
    <MatchesContext.Provider value={{ matches, addMatch, updateMatch, deleteMatch }}>
      {children}
    </MatchesContext.Provider>
  );
};

export const PlayerPositionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerPositions, setPlayerPositions] = React.useState<PlayerPosition[]>(
    loadFromLocalStorage<PlayerPosition[]>(STORAGE_KEYS.PLAYER_POSITIONS, [])
  );

  const addPlayerPosition = (playerPosition: PlayerPosition) => {
    // Call API service
    playerPositionService.createPlayerPosition({
      playerId: playerPosition.playerId,
      matchId: playerPosition.matchId,
      position: playerPosition.position
    }).then(apiPlayerPosition => {
      console.info('[API Response] Create Player Position:', apiPlayerPosition);
    });
    
    // Update local state
    const updatedPositions = [...playerPositions, playerPosition];
    setPlayerPositions(updatedPositions);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_POSITIONS, updatedPositions);
  };

  const updatePlayerPosition = (playerId: string, matchId: string, updates: Partial<PlayerPosition>) => {
    // Call API service
    playerPositionService.updatePlayerPosition(playerId, matchId, {
      position: updates.position
    }).then(apiPlayerPosition => {
      console.info('[API Response] Update Player Position:', apiPlayerPosition);
    });
    
    // Update local state
    const updatedPositions = playerPositions.map(pos => 
      (pos.playerId === playerId && pos.matchId === matchId) ? { ...pos, ...updates } : pos
    );
    setPlayerPositions(updatedPositions);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_POSITIONS, updatedPositions);
  };

  const deletePlayerPosition = (playerId: string, matchId: string) => {
    // Call API service
    playerPositionService.deletePlayerPosition(playerId, matchId).then(success => {
      console.info('[API Response] Delete Player Position:', success);
    });
    
    // Update local state
    const updatedPositions = playerPositions.filter(
      pos => !(pos.playerId === playerId && pos.matchId === matchId)
    );
    setPlayerPositions(updatedPositions);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_POSITIONS, updatedPositions);
  };

  const getPlayerPositionsByMatch = (matchId: string) => {
    return playerPositions.filter(pos => pos.matchId === matchId);
  };

  return (
    <PlayerPositionsContext.Provider value={{ 
      playerPositions, 
      addPlayerPosition, 
      updatePlayerPosition, 
      deletePlayerPosition,
      getPlayerPositionsByMatch
    }}>
      {children}
    </PlayerPositionsContext.Provider>
  );
};

export const PlayerEventsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerEvents, setPlayerEvents] = React.useState<PlayerEvent[]>(
    loadFromLocalStorage<PlayerEvent[]>(STORAGE_KEYS.PLAYER_EVENTS, [])
  );

  const addPlayerEvent = (playerEvent: PlayerEvent) => {
    // Call API service
    playerEventService.createPlayerEvent({
      playerId: playerEvent.playerId,
      matchId: playerEvent.matchId,
      eventType: playerEvent.eventType,
      count: playerEvent.count
    }).then(apiPlayerEvent => {
      console.info('[API Response] Create Player Event:', apiPlayerEvent);
    });
    
    // Update local state
    const updatedEvents = [...playerEvents, playerEvent];
    setPlayerEvents(updatedEvents);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_EVENTS, updatedEvents);
  };

  const updatePlayerEvent = (playerId: string, matchId: string, eventType: string, updates: Partial<PlayerEvent>) => {
    // Call API service
    playerEventService.updatePlayerEvent(playerId, matchId, eventType, {
      count: updates.count
    }).then(apiPlayerEvent => {
      console.info('[API Response] Update Player Event:', apiPlayerEvent);
    });
    
    // Update local state
    const updatedEvents = playerEvents.map(event => 
      (event.playerId === playerId && event.matchId === matchId && event.eventType === eventType) 
        ? { ...event, ...updates } 
        : event
    );
    setPlayerEvents(updatedEvents);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_EVENTS, updatedEvents);
  };

  const deletePlayerEvent = (playerId: string, matchId: string, eventType: string) => {
    // Call API service
    playerEventService.deletePlayerEvent(playerId, matchId, eventType).then(success => {
      console.info('[API Response] Delete Player Event:', success);
    });
    
    // Update local state
    const updatedEvents = playerEvents.filter(
      event => !(event.playerId === playerId && event.matchId === matchId && event.eventType === eventType)
    );
    setPlayerEvents(updatedEvents);
    saveToLocalStorage(STORAGE_KEYS.PLAYER_EVENTS, updatedEvents);
  };

  const getPlayerEventsByMatch = (matchId: string) => {
    return playerEvents.filter(event => event.matchId === matchId);
  };

  return (
    <PlayerEventsContext.Provider value={{ 
      playerEvents, 
      addPlayerEvent, 
      updatePlayerEvent, 
      deletePlayerEvent,
      getPlayerEventsByMatch
    }}>
      {children}
    </PlayerEventsContext.Provider>
  );
};

export const PointModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pointModel, setPointModel] = React.useState<PointModelEntry[]>(
    loadFromLocalStorage<PointModelEntry[]>(STORAGE_KEYS.POINT_MODEL, [])
  );

  const updatePointModel = (newPointModel: PointModelEntry[]) => {
    // Call API service
    pointModelService.updatePointModel({
      entries: newPointModel.map(entry => ({
        position: entry.position,
        eventType: entry.eventType,
        points: entry.points
      }))
    }).then(apiPointModel => {
      console.info('[API Response] Update Point Model:', apiPointModel);
    });
    
    // Update local state
    setPointModel(newPointModel);
    saveToLocalStorage(STORAGE_KEYS.POINT_MODEL, newPointModel);
  };

  return (
    <PointModelContext.Provider value={{ pointModel, updatePointModel }}>
      {children}
    </PointModelContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    loadFromLocalStorage<boolean>(STORAGE_KEYS.AUTH, false)
  );

  const login = (username: string, password: string) => {
    // For prototype, just log the API call that would happen
    console.info('[API Call] Login:', { username, password: '********' });
    
    // Update local state
    setIsAuthenticated(true);
    saveToLocalStorage(STORAGE_KEYS.AUTH, true);
  };

  const logout = () => {
    // For prototype, just log the API call that would happen
    console.info('[API Call] Logout');
    
    // Update local state
    setIsAuthenticated(false);
    saveToLocalStorage(STORAGE_KEYS.AUTH, false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Combined provider for all contexts
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize mock data if storage is empty
  React.useEffect(() => {
    const team = loadFromLocalStorage<Team | null>(STORAGE_KEYS.TEAM, null);
    if (!team) {
      const mockData = generateMockData();
      saveToLocalStorage(STORAGE_KEYS.TEAM, mockData.team);
      saveToLocalStorage(STORAGE_KEYS.PLAYERS, mockData.players);
      saveToLocalStorage(STORAGE_KEYS.SEASONS, [mockData.season]);
      saveToLocalStorage(STORAGE_KEYS.MATCHES, mockData.matches);
      saveToLocalStorage(STORAGE_KEYS.PLAYER_POSITIONS, mockData.playerPositions);
      saveToLocalStorage(STORAGE_KEYS.PLAYER_EVENTS, mockData.playerEvents);
      saveToLocalStorage(STORAGE_KEYS.POINT_MODEL, mockData.pointModel);
    }
  }, []);

  return (
    <AuthProvider>
      <TeamProvider>
        <PlayersProvider>
          <SeasonsProvider>
            <MatchesProvider>
              <PlayerPositionsProvider>
                <PlayerEventsProvider>
                  <PointModelProvider>
                    {children}
                  </PointModelProvider>
                </PlayerEventsProvider>
              </PlayerPositionsProvider>
            </MatchesProvider>
          </SeasonsProvider>
        </PlayersProvider>
      </TeamProvider>
    </AuthProvider>
  );
};

// Custom hooks for using contexts
export const useTeam = () => {
  const context = React.useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const usePlayers = () => {
  const context = React.useContext(PlayersContext);
  if (context === undefined) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

export const useSeasons = () => {
  const context = React.useContext(SeasonsContext);
  if (context === undefined) {
    throw new Error('useSeasons must be used within a SeasonsProvider');
  }
  return context;
};

export const useMatches = () => {
  const context = React.useContext(MatchesContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchesProvider');
  }
  return context;
};

export const usePlayerPositions = () => {
  const context = React.useContext(PlayerPositionsContext);
  if (context === undefined) {
    throw new Error('usePlayerPositions must be used within a PlayerPositionsProvider');
  }
  return context;
};

export const usePlayerEvents = () => {
  const context = React.useContext(PlayerEventsContext);
  if (context === undefined) {
    throw new Error('usePlayerEvents must be used within a PlayerEventsProvider');
  }
  return context;
};

export const usePointModel = () => {
  const context = React.useContext(PointModelContext);
  if (context === undefined) {
    throw new Error('usePointModel must be used within a PointModelProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
