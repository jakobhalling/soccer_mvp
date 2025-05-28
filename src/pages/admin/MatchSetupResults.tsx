import React, { useEffect } from 'react';
import { 
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  Button,
  InlineNotification,
  NumberInput,
  Form,
  Tag
} from '@carbon/react';
import { 
  useMatches, 
  usePlayers, 
  usePlayerPositions, 
  usePlayerEvents, 
  usePointModel 
} from '../../context';
import { Position, EventType, PlayerPosition, PlayerEvent, Formation } from '../../types';
import FootballPitch from '../../components/football/FootballPitch';

const MatchSetupResults: React.FC = () => {
  const { matches, updateMatch } = useMatches();
  const { players } = usePlayers();
  const { 
    playerPositions, 
    addPlayerPosition, 
    deletePlayerPosition, 
    getPlayerPositionsByMatch 
  } = usePlayerPositions();
  const { 
    playerEvents, 
    addPlayerEvent, 
    updatePlayerEvent, 
    getPlayerEventsByMatch 
  } = usePlayerEvents();
  const { pointModel } = usePointModel();
  
  const [selectedMatchId, setSelectedMatchId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('setup');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [success, setSuccess] = React.useState('');
  
  // Match results state
  const [homeScore, setHomeScore] = React.useState<number>(0);
  const [awayScore, setAwayScore] = React.useState<number>(0);
  const [isMatchCompleted, setIsMatchCompleted] = React.useState(false);
  
  // Get selected match
  const selectedMatch = selectedMatchId 
    ? matches.find(match => match.id === selectedMatchId) 
    : null;
  
  // Get player positions for selected match
  const matchPlayerPositions = selectedMatchId 
    ? getPlayerPositionsByMatch(selectedMatchId)
    : [];
  
  // Get player events for selected match
  const matchPlayerEvents = selectedMatchId 
    ? getPlayerEventsByMatch(selectedMatchId)
    : [];
  
  // Handle match selection
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatchId(matchId);
    
    const match = matches.find(m => m.id === matchId);
    if (match) {
      setHomeScore(match.homeScore || 0);
      setAwayScore(match.awayScore || 0);
      setIsMatchCompleted(match.isCompleted);
    }
    
    // Reset to default tab (Player Positions)
    setActiveTab('setup');
    setIsModalOpen(true);
  };
  
  // Handle player position assignment
  const handlePlayerPositionAssign = (playerId: string, position: Position) => {
    if (!selectedMatchId) return;
    
    // Check if player is already assigned to a position in this match
    const existingPosition = matchPlayerPositions.find(
      pos => pos.playerId === playerId
    );
    
    if (existingPosition) {
      // Remove existing position
      deletePlayerPosition(playerId, selectedMatchId);
    }
    
    // Add new position
    addPlayerPosition({
      playerId,
      matchId: selectedMatchId,
      position
    });
    
    setSuccess('Player position updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Handle player event update
  const handlePlayerEventUpdate = (
    playerId: string, 
    eventType: EventType, 
    count: number
  ) => {
    if (!selectedMatchId) return;
    
    // Find existing event
    const existingEvent = matchPlayerEvents.find(
      event => event.playerId === playerId && event.eventType === eventType
    );
    
    if (existingEvent) {
      // Update existing event
      updatePlayerEvent(playerId, selectedMatchId, eventType, { count });
    } else if (count > 0) {
      // Add new event
      addPlayerEvent({
        playerId,
        matchId: selectedMatchId,
        eventType,
        count
      });
    }
    
    setSuccess('Player event updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Handle match completion
  const handleMatchComplete = () => {
    if (!selectedMatchId) return;
    
    // Update match with scores and completion status
    updateMatch(selectedMatchId, {
      homeScore,
      awayScore,
      isCompleted: true
    });
    
    setIsMatchCompleted(true);
    
    // Apply automatic events based on match result
    applyAutomaticEvents();
    
    setSuccess('Match marked as completed!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Apply automatic events based on match result
  const applyAutomaticEvents = () => {
    if (!selectedMatchId || !selectedMatch) return;
    
    const isHomeTeam = selectedMatch.isHomeMatch;
    const teamScore = isHomeTeam ? homeScore : awayScore;
    const opponentScore = isHomeTeam ? awayScore : homeScore;
    
    // Determine match result
    const isWin = teamScore > opponentScore;
    const isDraw = teamScore === opponentScore;
    const isCleanSheet = opponentScore === 0;
    
    // Get all players assigned to this match
    const assignedPlayers = matchPlayerPositions;
    
    // Apply match win/draw points to all players
    if (isWin) {
      assignedPlayers.forEach(playerPos => {
        handlePlayerEventUpdate(playerPos.playerId, EventType.MATCH_WIN, 1);
      });
    } else if (isDraw) {
      assignedPlayers.forEach(playerPos => {
        handlePlayerEventUpdate(playerPos.playerId, EventType.MATCH_DRAW, 1);
      });
    }
    
    // Apply clean sheet points to goalkeeper and defenders
    if (isCleanSheet) {
      // For goalkeeper
      const goalkeepers = assignedPlayers.filter(
        pos => pos.position === Position.GOALKEEPER
      );
      goalkeepers.forEach(gk => {
        handlePlayerEventUpdate(gk.playerId, EventType.CLEAN_SHEET, 1);
      });
      
      // For defenders
      const defenders = assignedPlayers.filter(
        pos => pos.position === Position.DEFENDER
      );
      defenders.forEach(def => {
        handlePlayerEventUpdate(def.playerId, EventType.CLEAN_SHEET, 1);
      });
    }
  };
  
  // Handle match update
  const handleMatchUpdate = () => {
    if (!selectedMatchId) return;
    
    // Update match with scores
    updateMatch(selectedMatchId, {
      homeScore,
      awayScore,
      isCompleted
    });
    
    setSuccess('Match updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Get available events for a position
  const getEventsForPosition = (position: Position): EventType[] => {
    const positionEvents = pointModel
      .filter(entry => entry.position === position || entry.position === Position.ALL)
      .map(entry => entry.eventType);
    
    // Remove duplicates
    return [...new Set(positionEvents)];
  };
  
  // Get event count for a player
  const getPlayerEventCount = (playerId: string, eventType: EventType): number => {
    const event = matchPlayerEvents.find(
      event => event.playerId === playerId && event.eventType === eventType
    );
    
    return event ? event.count : 0;
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  // Get position label
  const getPositionLabel = (position: Position): string => {
    switch (position) {
      case Position.GOALKEEPER: return 'Goalkeeper';
      case Position.DEFENDER: return 'Defender';
      case Position.MIDFIELDER: return 'Midfielder';
      case Position.ATTACKER: return 'Attacker';
      default: return position;
    }
  };
  
  return (
    <div>
      <Tile>
        <h2>Match Setup and Results</h2>
        {/* Match List */}
        <DataTable rows={matches} headers={[
          { header: 'Date', key: 'date' },
          { header: 'Opponent', key: 'opponent' },
          { header: 'Location', key: 'location' },
          { header: 'Home/Away', key: 'isHomeMatch' },
          { header: 'Status', key: 'isCompleted' }
        ]}>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => {
                    const headerProps = getHeaderProps({ header });
                    const { key, ...rest } = headerProps;
                    return (
                      <TableHeader key={key} {...rest}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const match = matches.find(m => m.id === row.id);
                  return (
                    <TableRow 
                      key={row.id}
                      onClick={() => handleMatchSelect(row.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>{formatDate(match?.date)}</TableCell>
                      <TableCell>{match?.opponent}</TableCell>
                      <TableCell>{match?.location}</TableCell>
                      <TableCell>{match?.isHomeMatch ? 'Home' : 'Away'}</TableCell>
                      <TableCell>
                        {match?.isCompleted ? 
                          <Tag type="green">Completed</Tag> : 
                          <Tag type="blue">Pending</Tag>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </Tile>
      <Modal
        open={isModalOpen}
        modalHeading={`Match: ${selectedMatch?.opponent} (${formatDate(selectedMatch?.date)})`}
        primaryButtonText="Close"
        onRequestClose={() => setIsModalOpen(false)}
        size="lg"
        passiveModal
      >
        <div>
          {errors.length > 0 && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={errors.join(', ')}
              hideCloseButton
            />
          )}
          {success && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle={success}
              hideCloseButton
            />
          )}
          
          {/* Custom Tab Navigation */}
          <div className="custom-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0' }}>
            <div className="tab-list" style={{ display: 'flex', gap: '2px' }}>
              <button 
                className={`tab-button ${activeTab === 'setup' ? 'active' : ''}`}
                onClick={() => setActiveTab('setup')}
                style={{
                  padding: '10px 16px',
                  background: activeTab === 'setup' ? '#0f62fe' : '#f4f4f4',
                  color: activeTab === 'setup' ? 'white' : '#161616',
                  border: 'none',
                  borderBottom: activeTab === 'setup' ? '3px solid #0f62fe' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'setup' ? 'bold' : 'normal',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  marginBottom: '-1px'
                }}
              >
                Player Positions
              </button>
              <button 
                className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
                style={{
                  padding: '10px 16px',
                  background: activeTab === 'results' ? '#0f62fe' : '#f4f4f4',
                  color: activeTab === 'results' ? 'white' : '#161616',
                  border: 'none',
                  borderBottom: activeTab === 'results' ? '3px solid #0f62fe' : 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'results' ? 'bold' : 'normal',
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  marginBottom: '-1px'
                }}
              >
                Match Results
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="tab-content" style={{ padding: '16px 0' }}>
            {activeTab === 'setup' && (
              <div className="match-setup-tab">
                <h3>Player Positions</h3>
                {selectedMatch && (
                  <FootballPitch
                    formation={selectedMatch.formation || Formation.F_442}
                    players={players}
                    playerPositions={matchPlayerPositions}
                    onPlayerAssign={handlePlayerPositionAssign}
                  />
                )}
              </div>
            )}
            
            {activeTab === 'results' && (
              <div className="match-results-tab">
                <h3>Match Score</h3>
                <div className="score-inputs" style={{ marginBottom: '24px' }}>
                  <Form>
                    <div className="form-row score-row" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <NumberInput
                        id="home-score"
                        label={`${selectedMatch?.isHomeMatch ? 'Your Team' : selectedMatch?.opponent}`}
                        value={homeScore}
                        onChange={(e, { value }) => setHomeScore(Number(value))}
                        min={0}
                        max={20}
                        style={{ width: '120px' }}
                      />
                      <span className="score-separator" style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 8px' }}>-</span>
                      <NumberInput
                        id="away-score"
                        label={`${selectedMatch?.isHomeMatch ? selectedMatch?.opponent : 'Your Team'}`}
                        value={awayScore}
                        onChange={(e, { value }) => setAwayScore(Number(value))}
                        min={0}
                        max={20}
                        style={{ width: '120px' }}
                      />
                    </div>
                  </Form>
                  <div className="form-actions" style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                    <Button onClick={handleMatchUpdate}>
                      Update Score
                    </Button>
                    {!isMatchCompleted ? (
                      <Button kind="primary" onClick={handleMatchComplete}>
                        Mark as Completed
                      </Button>
                    ) : (
                      <Tag type="green">Match Completed</Tag>
                    )}
                  </div>
                </div>
                
                <h3>Player Events</h3>
                <p style={{ marginBottom: '16px' }}>
                  Record events for each player based on their position. When marking a match as completed, 
                  automatic events will be applied according to the match result.
                </p>
                
                {matchPlayerPositions.length === 0 ? (
                  <InlineNotification
                    kind="info"
                    title="No Players Assigned"
                    subtitle="Please assign players to positions in the Player Positions tab first."
                    hideCloseButton
                  />
                ) : (
                  <DataTable rows={matchPlayerPositions.map(pos => {
                    const player = players.find(p => p.id === pos.playerId);
                    return {
                      id: pos.playerId,
                      name: player?.name,
                      number: player?.number,
                      position: pos.position
                    };
                  })} headers={[
                    { header: 'Player', key: 'name' },
                    { header: 'Position', key: 'position' },
                    { header: 'Events', key: 'events' }
                  ]}>
                    {({ rows, headers, getHeaderProps, getTableProps }) => (
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header, index) => {
                              const headerProps = getHeaderProps({ header });
                              const { key, ...rest } = headerProps;
                              return (
                                <TableHeader key={index} {...rest}>
                                  {header.header}
                                </TableHeader>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => {
                            const playerPosition = matchPlayerPositions.find(pos => pos.playerId === row.id);
                            const position = playerPosition?.position;
                            const events = position ? getEventsForPosition(position) : [];
                            
                            return (
                              <TableRow key={row.id}>
                                <TableCell>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ 
                                      display: 'inline-block', 
                                      width: '24px', 
                                      height: '24px', 
                                      borderRadius: '50%', 
                                      background: '#1062fe', 
                                      color: 'white', 
                                      textAlign: 'center', 
                                      lineHeight: '24px',
                                      marginRight: '8px',
                                      fontWeight: 'bold'
                                    }}>
                                      {row.cells.find(c => c.id.includes('number'))?.value}
                                    </span>
                                    {row.cells.find(c => c.id.includes('name'))?.value}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Tag type={
                                    position === Position.GOALKEEPER ? 'red' :
                                    position === Position.DEFENDER ? 'magenta' :
                                    position === Position.MIDFIELDER ? 'purple' :
                                    'blue'
                                  }>
                                    {getPositionLabel(position as Position)}
                                  </Tag>
                                </TableCell>
                                <TableCell>
                                  <div className="event-inputs" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                                    {events.map(eventType => (
                                      <div key={eventType} className="event-input">
                                        <NumberInput
                                          id={`event-${row.id}-${eventType}`}
                                          label={eventType}
                                          value={getPlayerEventCount(row.id, eventType)}
                                          onChange={(e, { value }) => handlePlayerEventUpdate(row.id, eventType, Number(value))}
                                          min={0}
                                          max={10}
                                          size="sm"
                                          style={{ width: '120px' }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </DataTable>
                )}
                
                <div style={{ marginTop: '24px' }}>
                  <h4>Automatic Events</h4>
                  <p>The following events are automatically applied when a match is marked as completed:</p>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>All players receive points for match win (if your team wins)</li>
                    <li>All players receive points for match draw (if the match ends in a draw)</li>
                    <li>Goalkeepers receive clean sheet points if no goals are conceded</li>
                    <li>Defenders receive clean sheet points if no goals are conceded</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MatchSetupResults;
