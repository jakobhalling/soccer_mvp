import { apiClient } from './client';
import { 
  ApiTeam, 
  ApiPlayer, 
  ApiSeason, 
  ApiMatch, 
  ApiPlayerPosition, 
  ApiPlayerEvent, 
  ApiPointModelEntry,
  CreateTeamRequest,
  UpdateTeamRequest,
  CreatePlayerRequest,
  UpdatePlayerRequest,
  CreateSeasonRequest,
  UpdateSeasonRequest,
  CreateMatchRequest,
  UpdateMatchRequest,
  CreatePlayerPositionRequest,
  UpdatePlayerPositionRequest,
  CreatePlayerEventRequest,
  UpdatePlayerEventRequest,
  UpdatePointModelRequest
} from './types';

// Team API service
export const teamService = {
  getTeam: async (teamId: string): Promise<ApiTeam | null> => {
    try {
      const response = await apiClient.getTeam(teamId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching team:', error);
      return null;
    }
  },
  
  createTeam: async (data: CreateTeamRequest): Promise<ApiTeam | null> => {
    try {
      const response = await apiClient.createTeam(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating team:', error);
      return null;
    }
  },
  
  updateTeam: async (teamId: string, data: UpdateTeamRequest): Promise<ApiTeam | null> => {
    try {
      const response = await apiClient.updateTeam(teamId, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating team:', error);
      return null;
    }
  },
  
  deleteTeam: async (teamId: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteTeam(teamId);
      return response.success;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }
};

// Player API service
export const playerService = {
  getPlayers: async (teamId: string): Promise<ApiPlayer[]> => {
    try {
      const response = await apiClient.getPlayers(teamId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  },
  
  getPlayer: async (playerId: string): Promise<ApiPlayer | null> => {
    try {
      const response = await apiClient.getPlayer(playerId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching player:', error);
      return null;
    }
  },
  
  createPlayer: async (data: CreatePlayerRequest): Promise<ApiPlayer | null> => {
    try {
      const response = await apiClient.createPlayer(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating player:', error);
      return null;
    }
  },
  
  updatePlayer: async (playerId: string, data: UpdatePlayerRequest): Promise<ApiPlayer | null> => {
    try {
      const response = await apiClient.updatePlayer(playerId, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating player:', error);
      return null;
    }
  },
  
  deletePlayer: async (playerId: string): Promise<boolean> => {
    try {
      const response = await apiClient.deletePlayer(playerId);
      return response.success;
    } catch (error) {
      console.error('Error deleting player:', error);
      return false;
    }
  }
};

// Season API service
export const seasonService = {
  getSeasons: async (teamId: string): Promise<ApiSeason[]> => {
    try {
      const response = await apiClient.getSeasons(teamId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching seasons:', error);
      return [];
    }
  },
  
  getSeason: async (seasonId: string): Promise<ApiSeason | null> => {
    try {
      const response = await apiClient.getSeason(seasonId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching season:', error);
      return null;
    }
  },
  
  createSeason: async (data: CreateSeasonRequest): Promise<ApiSeason | null> => {
    try {
      const response = await apiClient.createSeason(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating season:', error);
      return null;
    }
  },
  
  updateSeason: async (seasonId: string, data: UpdateSeasonRequest): Promise<ApiSeason | null> => {
    try {
      const response = await apiClient.updateSeason(seasonId, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating season:', error);
      return null;
    }
  },
  
  deleteSeason: async (seasonId: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteSeason(seasonId);
      return response.success;
    } catch (error) {
      console.error('Error deleting season:', error);
      return false;
    }
  }
};

// Match API service
export const matchService = {
  getMatches: async (seasonId: string): Promise<ApiMatch[]> => {
    try {
      const response = await apiClient.getMatches(seasonId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  },
  
  getMatch: async (matchId: string): Promise<ApiMatch | null> => {
    try {
      const response = await apiClient.getMatch(matchId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching match:', error);
      return null;
    }
  },
  
  createMatch: async (data: CreateMatchRequest): Promise<ApiMatch | null> => {
    try {
      const response = await apiClient.createMatch(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating match:', error);
      return null;
    }
  },
  
  updateMatch: async (matchId: string, data: UpdateMatchRequest): Promise<ApiMatch | null> => {
    try {
      const response = await apiClient.updateMatch(matchId, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating match:', error);
      return null;
    }
  },
  
  deleteMatch: async (matchId: string): Promise<boolean> => {
    try {
      const response = await apiClient.deleteMatch(matchId);
      return response.success;
    } catch (error) {
      console.error('Error deleting match:', error);
      return false;
    }
  }
};

// Player Position API service
export const playerPositionService = {
  getPlayerPositions: async (matchId: string): Promise<ApiPlayerPosition[]> => {
    try {
      const response = await apiClient.getPlayerPositions(matchId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching player positions:', error);
      return [];
    }
  },
  
  createPlayerPosition: async (data: CreatePlayerPositionRequest): Promise<ApiPlayerPosition | null> => {
    try {
      const response = await apiClient.createPlayerPosition(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating player position:', error);
      return null;
    }
  },
  
  updatePlayerPosition: async (
    playerId: string, 
    matchId: string, 
    data: UpdatePlayerPositionRequest
  ): Promise<ApiPlayerPosition | null> => {
    try {
      const response = await apiClient.updatePlayerPosition(playerId, matchId, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating player position:', error);
      return null;
    }
  },
  
  deletePlayerPosition: async (playerId: string, matchId: string): Promise<boolean> => {
    try {
      const response = await apiClient.deletePlayerPosition(playerId, matchId);
      return response.success;
    } catch (error) {
      console.error('Error deleting player position:', error);
      return false;
    }
  }
};

// Player Event API service
export const playerEventService = {
  getPlayerEvents: async (matchId: string): Promise<ApiPlayerEvent[]> => {
    try {
      const response = await apiClient.getPlayerEvents(matchId);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching player events:', error);
      return [];
    }
  },
  
  createPlayerEvent: async (data: CreatePlayerEventRequest): Promise<ApiPlayerEvent | null> => {
    try {
      const response = await apiClient.createPlayerEvent(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error creating player event:', error);
      return null;
    }
  },
  
  updatePlayerEvent: async (
    playerId: string, 
    matchId: string, 
    eventType: string, 
    data: UpdatePlayerEventRequest
  ): Promise<ApiPlayerEvent | null> => {
    try {
      const response = await apiClient.updatePlayerEvent(playerId, matchId, eventType, data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating player event:', error);
      return null;
    }
  },
  
  deletePlayerEvent: async (playerId: string, matchId: string, eventType: string): Promise<boolean> => {
    try {
      const response = await apiClient.deletePlayerEvent(playerId, matchId, eventType);
      return response.success;
    } catch (error) {
      console.error('Error deleting player event:', error);
      return false;
    }
  }
};

// Point Model API service
export const pointModelService = {
  getPointModel: async (): Promise<ApiPointModelEntry[]> => {
    try {
      const response = await apiClient.getPointModel();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching point model:', error);
      return [];
    }
  },
  
  updatePointModel: async (data: UpdatePointModelRequest): Promise<ApiPointModelEntry[] | null> => {
    try {
      const response = await apiClient.updatePointModel(data);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error updating point model:', error);
      return null;
    }
  }
};
