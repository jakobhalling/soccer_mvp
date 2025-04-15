import React from 'react';
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
  Tabs,
  Tab,
  Button,
  InlineNotification,
  NumberInput,
  Select,
  SelectItem,
  Form
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
    
    setIsModalOpen(true);
  };
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
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
    setSuccess('Match marked as completed!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
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
  
  return (
    <div className="match-setup-results-page">
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
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
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
                      <TableCell>{match?.isCompleted ? 'Completed' : 'Pending'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </Tile>
      
      {/* Match Modal */}
      <Modal
        open={isModalOpen}
        modalHeading={`Match: ${selectedMatch?.opponent} (${formatDate(selectedMatch?.date)})`}
        primaryButtonText="Close"
        onRequestClose={() => setIsModalOpen(false)}
        size="lg"
        passiveModal
      >
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
        
        <Tabs selected={activeTab === 'setup' ? 0 : 1} onChange={({ selectedIndex }) => handleTabChange(selectedIndex === 0 ? 'setup' : 'results')}>
          <Tab id="setup" label="Match Setup">
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
          </Tab>
          
          <Tab id="results" label="Match Results">
            <div className="match-results-tab">
              <h3>Match Score</h3>
              
              <div className="score-inputs">
                <Form>
                  <div className="form-row score-row">
                    <NumberInput
                      id="home-score"
                      label={`${selectedMatch?.isHomeMatch ? 'Your Team' : selectedMatch?.opponent}`}
                      value={homeScore}
                      onChange={(e, { value }) => setHomeScore(value)}
                      min={0}
                      max={20}
                    />
                    
                    <span className="score-separator">-</span>
                    
                    <NumberInput
                      id="away-score"
                      label={`${selectedMatch?.isHomeMatch ? selectedMatch?.opponent : 'Your Team'}`}
                      value={awayScore}
                      onChange={(e, { value }) => setAwayScore(value)}
                      min={0}
                      max={20}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <Button onClick={handleMatchUpdate}>
                      Update Score
                    </Button>
                    
                    {!isMatchCompleted && (
                      <Button kind="primary" onClick={handleMatchComplete}>
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
              
              <h3>Player Events</h3>
              
              {/* Player Events Table */}
              <DataTable rows={matchPlayerPositions.map(pos => {
                const player = players.find(p => p.id === pos.playerId);
                return {
                  id: pos.playerId,
                  name: player?.name,
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
                        {headers.map((header) => (
                          <TableHeader {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        const playerPosition = matchPlayerPositions.find(pos => pos.playerId === row.id);
                        const position = playerPosition?.position;
                        const events = position ? getEventsForPosition(position) : [];
                        
                        return (
                          <TableRow key={row.id}>
                            <TableCell>{row.cells[0].value}</TableCell>
                            <TableCell>{position}</TableCell>
                            <TableCell>
                              <div className="event-inputs">
                                {events.map(eventType => (
                                  <div key={eventType} className="event-input">
                                    <NumberInput
                                      id={`event-${row.id}-${eventType}`}
                                      label={eventType}
                                      value={getPlayerEventCount(row.id, eventType)}
                                      onChange={(e, { value }) => handlePlayerEventUpdate(row.id, eventType, value)}
                                      min={0}
                                      max={10}
                                      size="sm"
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
            </div>
          </Tab>
        </Tabs>
      </Modal>
    </div>
  );
};

export default MatchSetupResults;
