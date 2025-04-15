import React from 'react';
import { 
  Tile, 
  Button,
  Tag
} from '@carbon/react';
import { DragSource, DropTarget, useDrag, useDrop } from 'react-dnd';
import { Player, Position, PlayerPosition, Formation } from '../../types';

// Define formation positions
const formationPositions = {
  [Formation.F_442]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 20, y: 70 },
      { x: 40, y: 70 },
      { x: 60, y: 70 },
      { x: 80, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 20, y: 50 },
      { x: 40, y: 50 },
      { x: 60, y: 50 },
      { x: 80, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 35, y: 30 },
      { x: 65, y: 30 }
    ]
  },
  [Formation.F_451]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 20, y: 70 },
      { x: 40, y: 70 },
      { x: 60, y: 70 },
      { x: 80, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 20, y: 50 },
      { x: 35, y: 50 },
      { x: 50, y: 50 },
      { x: 65, y: 50 },
      { x: 80, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 50, y: 30 }
    ]
  },
  [Formation.F_433]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 20, y: 70 },
      { x: 40, y: 70 },
      { x: 60, y: 70 },
      { x: 80, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 30, y: 50 },
      { x: 50, y: 50 },
      { x: 70, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 30, y: 30 },
      { x: 50, y: 30 },
      { x: 70, y: 30 }
    ]
  },
  [Formation.F_541]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 10, y: 70 },
      { x: 30, y: 70 },
      { x: 50, y: 70 },
      { x: 70, y: 70 },
      { x: 90, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 20, y: 50 },
      { x: 40, y: 50 },
      { x: 60, y: 50 },
      { x: 80, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 50, y: 30 }
    ]
  },
  [Formation.F_352]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 30, y: 70 },
      { x: 50, y: 70 },
      { x: 70, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 20, y: 50 },
      { x: 35, y: 50 },
      { x: 50, y: 50 },
      { x: 65, y: 50 },
      { x: 80, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 35, y: 30 },
      { x: 65, y: 30 }
    ]
  },
  [Formation.F_532]: {
    [Position.GOALKEEPER]: [{ x: 50, y: 90 }],
    [Position.DEFENDER]: [
      { x: 10, y: 70 },
      { x: 30, y: 70 },
      { x: 50, y: 70 },
      { x: 70, y: 70 },
      { x: 90, y: 70 }
    ],
    [Position.MIDFIELDER]: [
      { x: 30, y: 50 },
      { x: 50, y: 50 },
      { x: 70, y: 50 }
    ],
    [Position.ATTACKER]: [
      { x: 35, y: 30 },
      { x: 65, y: 30 }
    ]
  }
};

// Player item for drag and drop
const PlayerItem: React.FC<{
  player: Player;
  onDrag: (playerId: string) => void;
}> = ({ player, onDrag }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    item: { id: player.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
    begin: () => {
      onDrag(player.id);
      return { id: player.id };
    }
  }));
  
  return (
    <div
      ref={drag}
      className={`player-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="player-number">{player.number}</span>
      <span className="player-name">{player.name}</span>
    </div>
  );
};

// Position drop zone
const PositionDropZone: React.FC<{
  position: Position;
  x: number;
  y: number;
  assignedPlayers: Player[];
  onDrop: (position: Position) => void;
}> = ({ position, x, y, assignedPlayers, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'PLAYER',
    drop: () => {
      onDrop(position);
      return { position };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
    canDrop: () => {
      // Only allow one goalkeeper
      if (position === Position.GOALKEEPER && assignedPlayers.length > 0) {
        return false;
      }
      return true;
    }
  }));
  
  return (
    <div
      ref={drop}
      className={`position-drop-zone ${position.toLowerCase()} ${isOver ? 'over' : ''} ${canDrop ? 'can-drop' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`
      }}
    >
      <div className="position-marker">
        {position === Position.GOALKEEPER ? 'GK' : 
         position === Position.DEFENDER ? 'DEF' : 
         position === Position.MIDFIELDER ? 'MID' : 'ATT'}
      </div>
      
      {assignedPlayers.length > 0 && (
        <div className="assigned-players">
          {assignedPlayers.map(player => (
            <div key={player.id} className="assigned-player">
              <span className="player-number">{player.number}</span>
              <span className="player-name">{player.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface FootballPitchProps {
  formation: Formation;
  players: Player[];
  playerPositions: PlayerPosition[];
  onPlayerAssign: (playerId: string, position: Position) => void;
}

const FootballPitch: React.FC<FootballPitchProps> = ({
  formation,
  players,
  playerPositions,
  onPlayerAssign
}) => {
  const [draggedPlayerId, setDraggedPlayerId] = React.useState<string | null>(null);
  
  // Get positions for the current formation
  const positions = formationPositions[formation];
  
  // Get assigned players for each position
  const getAssignedPlayers = (position: Position) => {
    const positionPlayerIds = playerPositions
      .filter(pp => pp.position === position)
      .map(pp => pp.playerId);
    
    return players.filter(player => positionPlayerIds.includes(player.id));
  };
  
  // Get unassigned players
  const getUnassignedPlayers = () => {
    const assignedPlayerIds = playerPositions.map(pp => pp.playerId);
    return players.filter(player => !assignedPlayerIds.includes(player.id));
  };
  
  // Handle player drag
  const handlePlayerDrag = (playerId: string) => {
    setDraggedPlayerId(playerId);
  };
  
  // Handle position drop
  const handlePositionDrop = (position: Position) => {
    if (draggedPlayerId) {
      onPlayerAssign(draggedPlayerId, position);
      setDraggedPlayerId(null);
    }
  };
  
  return (
    <div className="football-pitch-container">
      <div className="football-pitch">
        {/* Render position drop zones for each position in the formation */}
        {Object.entries(positions).map(([positionKey, positionCoords]) => {
          const position = positionKey as Position;
          
          return positionCoords.map((coord, index) => {
            const assignedPlayers = getAssignedPlayers(position);
            
            return (
              <PositionDropZone
                key={`${position}-${index}`}
                position={position}
                x={coord.x}
                y={coord.y}
                assignedPlayers={assignedPlayers}
                onDrop={handlePositionDrop}
              />
            );
          });
        })}
        
        {/* Field markings */}
        <div className="field-markings">
          <div className="center-circle"></div>
          <div className="center-line"></div>
          <div className="penalty-area top"></div>
          <div className="penalty-area bottom"></div>
          <div className="goal-area top"></div>
          <div className="goal-area bottom"></div>
        </div>
      </div>
      
      <div className="player-list">
        <h4>Available Players</h4>
        <div className="unassigned-players">
          {getUnassignedPlayers().map(player => (
            <PlayerItem
              key={player.id}
              player={player}
              onDrag={handlePlayerDrag}
            />
          ))}
        </div>
        
        <h4>Assigned Players</h4>
        <div className="position-summary">
          {Object.values(Position).filter(p => p !== Position.ALL).map(position => (
            <div key={position} className="position-group">
              <Tag type="blue">{position}: {getAssignedPlayers(position).length}</Tag>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FootballPitch;
