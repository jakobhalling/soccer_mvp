import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  DataTable, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell,
  Dropdown,
  Tile,
  Tag,
  Loading
} from '@carbon/react';
import { 
  useTeam, 
  usePlayers, 
  useMatches, 
  usePlayerPositions, 
  usePlayerEvents, 
  usePointModel 
} from '../../context';
import { calculateAllPlayerPoints, calculateMatchPlayerPoints, getPlayerEventBreakdown } from '../../utils/pointCalculation';

const Scoreboard: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { team } = useTeam();
  const { players } = usePlayers();
  const { matches } = useMatches();
  const { playerPositions } = usePlayerPositions();
  const { playerEvents } = usePlayerEvents();
  const { pointModel } = usePointModel();
  
  const [selectedMatchId, setSelectedMatchId] = React.useState<string>('all');
  const [loading, setLoading] = React.useState<boolean>(true);
  const [playerScores, setPlayerScores] = React.useState<any[]>([]);
  
  // Calculate player scores
  React.useEffect(() => {
    if (!team || !players.length || !pointModel.length) {
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      let scores;
      
      if (selectedMatchId === 'all') {
        // Calculate total scores across all matches
        scores = calculateAllPlayerPoints(
          players,
          matches,
          playerPositions,
          playerEvents,
          pointModel
        );
      } else {
        // Calculate scores for selected match
        scores = calculateMatchPlayerPoints(
          selectedMatchId,
          players,
          playerPositions,
          playerEvents,
          pointModel
        );
      }
      
      // Map scores to player data and sort by points (descending)
      const playerScoresData = scores
        .map(score => {
          const player = players.find(p => p.id === score.playerId);
          if (!player) return null;
          
          const eventBreakdown = getPlayerEventBreakdown(
            player.id,
            selectedMatchId === 'all' ? matches : matches.filter(m => m.id === selectedMatchId),
            playerPositions,
            playerEvents
          );
          
          return {
            id: player.id,
            name: player.name,
            number: player.number,
            points: score.points,
            eventBreakdown
          };
        })
        .filter(Boolean)
        .sort((a, b) => b!.points - a!.points);
      
      setPlayerScores(playerScoresData as any[]);
      setLoading(false);
    }, 500); // Simulate calculation time
  }, [team, players, matches, playerPositions, playerEvents, pointModel, selectedMatchId]);
  
  // Get completed matches for dropdown
  const completedMatches = matches.filter(match => match.isCompleted);
  
  // Prepare match items for dropdown
  const matchItems = [
    { id: 'all', text: 'All Matches' },
    ...completedMatches.map(match => ({
      id: match.id,
      text: `${match.isHomeMatch ? 'Home vs' : 'Away vs'} ${match.opponent} (${new Date(match.date).toLocaleDateString()})`
    }))
  ];
  
  return (
    <div className="scoreboard-page">
      {loading && <Loading />}
      
      <Tile className="team-header">
        <div className="team-info">
          <h1>{team?.name || 'Team'} MVP Scoreboard</h1>
          {team?.logo && (
            <img 
              src={team.logo} 
              alt={`${team.name} logo`} 
              className="team-logo" 
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
          )}
        </div>
        
        <div className="match-filter">
          <Dropdown
            id="match-filter"
            titleText="Filter by Match"
            label="All Matches"
            items={matchItems}
            itemToString={(item) => (item ? item.text : '')}
            onChange={({ selectedItem }) => setSelectedMatchId(selectedItem?.id || 'all')}
          />
        </div>
      </Tile>
      
      <div className="scoreboard-table">
        <DataTable rows={playerScores} headers={[
          { header: 'Player', key: 'name' },
          { header: 'Number', key: 'number' },
          { header: 'MVP Points', key: 'points' },
          { header: 'Events', key: 'events' }
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
                  const player = playerScores.find(p => p.id === row.id);
                  
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{player?.name}</TableCell>
                      <TableCell>{player?.number}</TableCell>
                      <TableCell>{player?.points}</TableCell>
                      <TableCell>
                        <div className="event-tags">
                          {player && Object.entries(player.eventBreakdown).map(([event, count]) => (
                            <Tag key={event} type="blue">
                              {event}: {count}
                            </Tag>
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
    </div>
  );
};

export default Scoreboard;
