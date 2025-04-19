import React from 'react';
import { 
  Tile, 
  Button,
  Tag
} from '@carbon/react';
import { useDrag, useDrop } from 'react-dnd';
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
  assigned: boolean;
  onDrag: (playerId: string) => void;
}> = ({ player, assigned, onDrag }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',
    canDrag: !assigned,
    item: () => {
      if (!assigned) onDrag(player.id);
      return { id: player.id };
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [assigned]);

  return (
    <div
      ref={!assigned ? drag : undefined}
      className={`player-item${isDragging ? ' dragging' : ''}${assigned ? ' assigned' : ''}`}
      style={{
        opacity: assigned ? 0.4 : isDragging ? 0.5 : 1,
        background: assigned ? '#e0e0e0' : '#fff',
        cursor: assigned ? 'not-allowed' : 'grab',
        pointerEvents: assigned ? 'none' : 'auto',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
      title={assigned ? 'Already assigned to a position' : 'Drag to assign'}
    >
      <span className="player-number" style={{ marginRight: 8 }}>{player.number}</span>
      <span className="player-name">{player.name}</span>
      {assigned && (
        <span style={{
          marginLeft: 8,
          color: '#888',
          fontSize: 12,
          fontStyle: 'italic',
        }}>
          (assigned)
        </span>
      )}
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
    drop: (item, monitor) => {
      console.info('DROP event:', { item, position });
      onDrop(position);
      return { position };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
    canDrop: (item, monitor) => {
      const allowed = !(position === Position.GOALKEEPER && assignedPlayers.length > 0);
      console.info('canDrop called', { item, position, allowed });
      return allowed;
    }
  }));

  return (
    <div
      ref={drop}
      className={`position-drop-zone ${position.toLowerCase()} ${isOver ? 'over' : ''} ${canDrop ? 'can-drop' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: canDrop ? 'rgba(0,255,0,0.1)' : undefined,
        border: canDrop ? '2px solid #0f0' : undefined,
        zIndex: isOver ? 2 : 1,
      }}
    >
      <div className="position-marker" style={{
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: assignedPlayers.length > 0 ? '#1976d2' : 'rgba(255,255,255,0.8)',
  color: assignedPlayers.length > 0 ? '#fff' : '#333',
  border: assignedPlayers.length > 0 ? '3px solid #1565c0' : '2px dashed #bbb',
  boxShadow: assignedPlayers.length > 0 ? '0 0 12px 2px #1976d2' : 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 16,
  margin: '0 auto',
  position: 'relative',
  zIndex: 3
}}>
  {assignedPlayers.length > 0
    ? assignedPlayers.map(player => (
      <span key={player.id} style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>
        {player.number}
      </span>
    ))
    : (position === Position.GOALKEEPER ? 'GK' :
       position === Position.DEFENDER ? 'DEF' :
       position === Position.MIDFIELDER ? 'MID' : 'ATT')}
</div>
{assignedPlayers.length > 0 && (
  <div className="assigned-players" style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', marginTop: 2 }}>
    {assignedPlayers.map(player => (
      <div
        key={player.id}
        className="assigned-player-badge"
        style={{
          background: '#1976d2',
          color: '#fff',
          border: '2px solid #1565c0',
          borderRadius: 16,
          padding: '2px 10px',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(0,0,0,0.10)',
          minWidth: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
        }}
        title={player.name}
      >
        <span style={{ marginRight: 6, fontWeight: 700 }}>{player.number}</span>
        <span>{player.name}</span>
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
      console.info(`Player dropped:`, { playerId: draggedPlayerId, position });
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
    {players.map(player => {
  // Check if player is assigned
  const assigned = playerPositions.some(pp => pp.playerId === player.id);
  return (
    <PlayerItem
      key={player.id}
      player={player}
      assigned={assigned}
      onDrag={handlePlayerDrag}
    />
  );
})}
  </div>

  <h4>Assigned Players</h4>
  <div className="position-summary">
    {Object.values(Position).filter(p => p !== Position.ALL).map(position => {
  const count = playerPositions.filter(pp => pp.position === position).length;
  return (
    <div key={position} className="position-group">
      <Tag type="blue">{position}: {count}</Tag>
    </div>
  );
})}
  </div>
</div>
    </div>
  );
};

export default FootballPitch;
