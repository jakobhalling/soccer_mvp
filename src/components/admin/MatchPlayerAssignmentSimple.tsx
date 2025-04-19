import React from 'react';
import { Player, Position } from '../../types';
import { Tag, Button } from '@carbon/react';

interface MatchPlayerAssignmentSimpleProps {
  players: Player[];
  assigned: Record<Position, Player[]>;
  onAssign: (playerId: string, position: Position) => void;
  onUnassign: (playerId: string) => void;
}

const positionLabels = {
  [Position.GOALKEEPER]: 'Goalkeeper',
  [Position.DEFENDER]: 'Defenders',
  [Position.MIDFIELDER]: 'Midfielders',
  [Position.ATTACKER]: 'Attackers',
};

const MatchPlayerAssignmentSimple: React.FC<MatchPlayerAssignmentSimpleProps> = ({
  players,
  assigned,
  onAssign,
  onUnassign,
}) => {
  // Unassigned players
  const assignedIds = Object.values(assigned).flat().map(p => p.id);
  const unassigned = players.filter(p => !assignedIds.includes(p.id));

  // Drag state
  const [draggedId, setDraggedId] = React.useState<string | null>(null);

  // Drag handlers
  const handleDragStart = (id: string) => setDraggedId(id);
  const handleDragEnd = () => setDraggedId(null);
  const handleDrop = (position: Position) => {
    if (draggedId) {
      onAssign(draggedId, position);
      setDraggedId(null);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Unassigned list */}
      <div style={{ flex: 1 }}>
        <h4>Unassigned Players</h4>
        <div style={{ minHeight: 120, background: '#f4f4f4', borderRadius: 4, padding: 8 }}>
          {unassigned.length === 0 && <span style={{ color: '#999' }}>All players assigned</span>}
          {unassigned.map(player => (
            <div
              key={player.id}
              draggable
              onDragStart={() => handleDragStart(player.id)}
              onDragEnd={handleDragEnd}
              style={{
                background: draggedId === player.id ? '#e0e0e0' : '#fff',
                border: '1px solid #ddd',
                borderRadius: 4,
                margin: '4px 0',
                padding: 8,
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span className="player-number" style={{ marginRight: 8 }}>{player.number}</span>
              <span>{player.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Assignment areas */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Goalie (single slot) */}
        <div>
          <h4>{positionLabels[Position.GOALKEEPER]}</h4>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(Position.GOALKEEPER)}
            style={{
              minHeight: 48,
              background: '#f4f4f4',
              borderRadius: 4,
              padding: 8,
              border: '2px dashed #0f62fe',
              marginBottom: 8,
            }}
          >
            {assigned[Position.GOALKEEPER] && assigned[Position.GOALKEEPER].length > 0 ? (
              assigned[Position.GOALKEEPER].map(player => (
                <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <Tag type="green">{player.name} #{player.number}</Tag>
                  <Button kind="ghost" size="sm" onClick={() => onUnassign(player.id)} style={{ marginLeft: 8 }}>Remove</Button>
                </div>
              ))
            ) : (
              <span style={{ color: '#999' }}>Drag a player here (1 max)</span>
            )}
          </div>
        </div>
        {/* Defenders, Midfielders, Attackers */}
        {[Position.DEFENDER, Position.MIDFIELDER, Position.ATTACKER].map(pos => (
          <div key={pos}>
            <h4>{positionLabels[pos]}</h4>
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(pos)}
              style={{
                minHeight: 48,
                background: '#f4f4f4',
                borderRadius: 4,
                padding: 8,
                border: '2px dashed #0f62fe',
                marginBottom: 8,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
              }}
            >
              {assigned[pos] && assigned[pos].length > 0 ? (
                assigned[pos].map(player => (
                  <div key={player.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <Tag type="blue">{player.name} #{player.number}</Tag>
                    <Button kind="ghost" size="sm" onClick={() => onUnassign(player.id)} style={{ marginLeft: 8 }}>Remove</Button>
                  </div>
                ))
              ) : (
                <span style={{ color: '#999' }}>Drag players here</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchPlayerAssignmentSimple;
