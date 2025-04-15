import React from 'react';
import { 
  Tabs, 
  Tab, 
  Tile,
  Button,
  Form,
  TextInput,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  InlineNotification,
  Dropdown
} from '@carbon/react';
import { TrashCan, Edit, Add } from '@carbon/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { useTeam, useSeasons, useMatches } from '../../context';
import { validateSeason, validateMatch } from '../../utils/validation';
import { Formation } from '../../types';

const MatchSchedule: React.FC = () => {
  const { team } = useTeam();
  const { seasons, addSeason, updateSeason, deleteSeason } = useSeasons();
  const { matches, addMatch, updateMatch, deleteMatch } = useMatches();
  
  const [seasonName, setSeasonName] = React.useState('');
  const [seasonStartDate, setSeasonStartDate] = React.useState<Date | null>(null);
  const [seasonEndDate, setSeasonEndDate] = React.useState<Date | null>(null);
  const [seasonErrors, setSeasonErrors] = React.useState<string[]>([]);
  const [seasonSuccess, setSeasonSuccess] = React.useState('');
  
  const [selectedSeasonId, setSelectedSeasonId] = React.useState<string>('');
  
  const [matchOpponent, setMatchOpponent] = React.useState('');
  const [matchDate, setMatchDate] = React.useState<Date | null>(null);
  const [matchLocation, setMatchLocation] = React.useState('');
  const [matchIsHome, setMatchIsHome] = React.useState(true);
  const [matchFormation, setMatchFormation] = React.useState<Formation>(Formation.F_442);
  const [matchErrors, setMatchErrors] = React.useState<string[]>([]);
  const [matchSuccess, setMatchSuccess] = React.useState('');
  
  const [editingSeasonId, setEditingSeasonId] = React.useState<string | null>(null);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = React.useState(false);
  
  const [editingMatchId, setEditingMatchId] = React.useState<string | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = React.useState(false);
  
  // Filter matches by selected season
  const filteredMatches = matches.filter(match => match.seasonId === selectedSeasonId);
  
  // Handle season form submission
  const handleSeasonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) {
      setSeasonErrors(['Please create a team first']);
      return;
    }
    
    const seasonData = {
      name: seasonName,
      startDate: seasonStartDate,
      endDate: seasonEndDate,
      teamId: team.id
    };
    
    const validation = validateSeason(seasonData);
    
    if (!validation.isValid) {
      setSeasonErrors(validation.errors);
      setSeasonSuccess('');
      return;
    }
    
    if (editingSeasonId) {
      // Update existing season
      updateSeason(editingSeasonId, {
        name: seasonName,
        startDate: seasonStartDate,
        endDate: seasonEndDate
      });
    } else {
      // Create new season
      const newSeason = {
        id: uuidv4(),
        teamId: team.id,
        name: seasonName,
        startDate: seasonStartDate,
        endDate: seasonEndDate,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addSeason(newSeason);
      
      // Select the new season
      setSelectedSeasonId(newSeason.id);
    }
    
    // Reset form
    setSeasonName('');
    setSeasonStartDate(null);
    setSeasonEndDate(null);
    setEditingSeasonId(null);
    setSeasonErrors([]);
    setSeasonSuccess('Season saved successfully!');
    setIsSeasonModalOpen(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSeasonSuccess('');
    }, 3000);
  };
  
  // Handle match form submission
  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) {
      setMatchErrors(['Please create a team first']);
      return;
    }
    
    if (!selectedSeasonId) {
      setMatchErrors(['Please select a season first']);
      return;
    }
    
    const matchData = {
      opponent: matchOpponent,
      date: matchDate,
      location: matchLocation,
      isHomeMatch: matchIsHome,
      formation: matchFormation,
      teamId: team.id,
      seasonId: selectedSeasonId
    };
    
    const validation = validateMatch(matchData);
    
    if (!validation.isValid) {
      setMatchErrors(validation.errors);
      setMatchSuccess('');
      return;
    }
    
    if (editingMatchId) {
      // Update existing match
      updateMatch(editingMatchId, {
        opponent: matchOpponent,
        date: matchDate,
        location: matchLocation,
        isHomeMatch: matchIsHome,
        formation: matchFormation
      });
    } else {
      // Create new match
      const newMatch = {
        id: uuidv4(),
        teamId: team.id,
        seasonId: selectedSeasonId,
        opponent: matchOpponent,
        date: matchDate!,
        location: matchLocation,
        isHomeMatch: matchIsHome,
        formation: matchFormation,
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addMatch(newMatch);
    }
    
    // Reset form
    setMatchOpponent('');
    setMatchDate(null);
    setMatchLocation('');
    setMatchIsHome(true);
    setMatchFormation(Formation.F_442);
    setEditingMatchId(null);
    setMatchErrors([]);
    setMatchSuccess('Match saved successfully!');
    setIsMatchModalOpen(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMatchSuccess('');
    }, 3000);
  };
  
  // Handle edit season
  const handleEditSeason = (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;
    
    setSeasonName(season.name);
    setSeasonStartDate(season.startDate || null);
    setSeasonEndDate(season.endDate || null);
    setEditingSeasonId(season.id);
    setIsSeasonModalOpen(true);
  };
  
  // Handle delete season
  const handleDeleteSeason = (seasonId: string) => {
    // Delete all matches in this season first
    matches.filter(m => m.seasonId === seasonId).forEach(match => {
      deleteMatch(match.id);
    });
    
    // Then delete the season
    deleteSeason(seasonId);
    
    // If the deleted season was selected, clear selection
    if (selectedSeasonId === seasonId) {
      setSelectedSeasonId('');
    }
    
    setSeasonSuccess('Season and its matches deleted successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSeasonSuccess('');
    }, 3000);
  };
  
  // Handle edit match
  const handleEditMatch = (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    setMatchOpponent(match.opponent);
    setMatchDate(match.date);
    setMatchLocation(match.location || '');
    setMatchIsHome(match.isHomeMatch);
    setMatchFormation(match.formation || Formation.F_442);
    setEditingMatchId(match.id);
    setIsMatchModalOpen(true);
  };
  
  // Handle delete match
  const handleDeleteMatch = (matchId: string) => {
    deleteMatch(matchId);
    setMatchSuccess('Match deleted successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setMatchSuccess('');
    }, 3000);
  };
  
  // Open season modal for new season
  const handleAddSeason = () => {
    setSeasonName('');
    setSeasonStartDate(null);
    setSeasonEndDate(null);
    setEditingSeasonId(null);
    setIsSeasonModalOpen(true);
  };
  
  // Open match modal for new match
  const handleAddMatch = () => {
    setMatchOpponent('');
    setMatchDate(null);
    setMatchLocation('');
    setMatchIsHome(true);
    setMatchFormation(Formation.F_442);
    setEditingMatchId(null);
    setIsMatchModalOpen(true);
  };
  
  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };
  
  return (
    <div className="match-schedule">
      <Tile>
        <h2>Match Schedule</h2>
        
        {/* Season Management */}
        <div className="season-management">
          <div className="section-header">
            <h3>Seasons</h3>
            <Button 
              kind="primary" 
              renderIcon={Add} 
              onClick={handleAddSeason}
              disabled={!team}
            >
              Add Season
            </Button>
          </div>
          
          {seasonErrors.length > 0 && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={seasonErrors.join(', ')}
              hideCloseButton
            />
          )}
          
          {seasonSuccess && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle={seasonSuccess}
              hideCloseButton
            />
          )}
          
          {/* Season Table */}
          <DataTable rows={seasons} headers={[
            { header: 'Name', key: 'name' },
            { header: 'Start Date', key: 'startDate' },
            { header: 'End Date', key: 'endDate' },
            { header: 'Actions', key: 'actions' }
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
                    const season = seasons.find(s => s.id === row.id);
                    
                    return (
                      <TableRow 
                        key={row.id}
                        onClick={() => setSelectedSeasonId(row.id)}
                        className={selectedSeasonId === row.id ? 'selected-row' : ''}
                      >
                        <TableCell>{season?.name}</TableCell>
                        <TableCell>{formatDate(season?.startDate)}</TableCell>
                        <TableCell>{formatDate(season?.endDate)}</TableCell>
                        <TableCell>
                          <Button
                            kind="ghost"
                            renderIcon={Edit}
                            iconDescription="Edit"
                            hasIconOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSeason(row.id);
                            }}
                          />
                          <Button
                            kind="danger--ghost"
                            renderIcon={TrashCan}
                            iconDescription="Delete"
                            hasIconOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSeason(row.id);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </DataTable>
        </div>
        
        {/* Match Management */}
        <div className="match-management">
          <div className="section-header">
            <h3>Matches</h3>
            <Button 
              kind="primary" 
              renderIcon={Add} 
              onClick={handleAddMatch}
              disabled={!selectedSeasonId}
            >
              Add Match
            </Button>
          </div>
          
          {matchErrors.length > 0 && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={matchErrors.join(', ')}
              hideCloseButton
            />
          )}
          
          {matchSuccess && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle={matchSuccess}
              hideCloseButton
            />
          )}
          
          {!selectedSeasonId && (
            <p>Please select a season to view matches</p>
          )}
          
          {selectedSeasonId && (
            <DataTable rows={filteredMatches} headers={[
              { header: 'Date', key: 'date' },
              { header: 'Opponent', key: 'opponent' },
              { header: 'Location', key: 'location' },
              { header: 'Home/Away', key: 'isHomeMatch' },
              { header: 'Formation', key: 'formation' },
              { header: 'Status', key: 'isCompleted' },
              { header: 'Actions', key: 'actions' }
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
                      const match = filteredMatches.find(m => m.id === row.id);
                      
                      return (
                        <TableRow key={row.id}>
                          <TableCell>{formatDate(match?.date)}</TableCell>
                          <TableCell>{match?.opponent}</TableCell>
                          <TableCell>{match?.location}</TableCell>
                          <TableCell>{match?.isHomeMatch ? 'Home' : 'Away'}</TableCell>
                          <TableCell>{match?.formation}</TableCell>
                          <TableCell>{match?.isCompleted ? 'Completed' : 'Pending'}</TableCell>
                          <TableCell>
                            <Button
                              kind="ghost"
                              renderIcon={Edit}
                              iconDescription="Edit"
                              hasIconOnly
                              onClick={() => handleEditMatch(row.id)}
                            />
                            <Button
                              kind="danger--ghost"
                              renderIcon={TrashCan}
                              iconDescription="Delete"
                              hasIconOnly
                              onClick={() => handleDeleteMatch(row.id)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          )}
        </div>
        
        {/* Season Modal */}
        <Modal
          open={isSeasonModalOpen}
          modalHeading={editingSeasonId ? "Edit Season" : "Add Season"}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestSubmit={handleSeasonSubmit}
          onRequestClose={() => setIsSeasonModalOpen(false)}
        >
          <Form>
            <div className="form-row">
              <TextInput
                id="season-name"
                labelText="Season Name"
                value={seasonName}
                onChange={(e) => setSeasonName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <DatePicker
                datePickerType="single"
                dateFormat="m/d/Y"
                onChange={(dates) => setSeasonStartDate(dates[0])}
                value={seasonStartDate}
              >
                <DatePickerInput
                  id="season-start-date"
                  labelText="Start Date"
                  placeholder="mm/dd/yyyy"
                />
              </DatePicker>
            </div>
            
            <div className="form-row">
              <DatePicker
                datePickerType="single"
                dateFormat="m/d/Y"
                onChange={(dates) => setSeasonEndDate(dates[0])}
                value={seasonEndDate}
                minDate={seasonStartDate}
              >
                <DatePickerInput
                  id="season-end-date"
                  labelText="End Date"
                  placeholder="mm/dd/yyyy"
                />
              </DatePicker>
            </div>
          </Form>
        </Modal>
        
        {/* Match Modal */}
        <Modal
          open={isMatchModalOpen}
          modalHeading={editingMatchId ? "Edit Match" : "Add Match"}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestSubmit={handleMatchSubmit}
          onRequestClose={() => setIsMatchModalOpen(false)}
        >
          <Form>
            <div className="form-row">
              <TextInput
                id="match-opponent"
                labelText="Opponent"
                value={matchOpponent}
                onChange={(e) => setMatchOpponent(e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              <DatePicker
                datePickerType="single"
                dateFormat="m/d/Y"
                onChange={(dates) => setMatchDate(dates[0])}
                value={matchDate}
              >
                <DatePickerInput
                  id="match-date"
                  labelText="Match Date"
                  placeholder="mm/dd/yyyy"
                  required
                />
              </DatePicker>
            </div>
            
            <div className="form-row">
              <TextInput
                id="match-location"
                labelText="Location (optional)"
                value={matchLocation}
                onChange={(e) => setMatchLocation(e.target.value)}
              />
            </div>
            
            <div className="form-row">
              <Select
                id="match-home-away"
                labelText="Home/Away"
                value={matchIsHome ? 'home' : 'away'}
                onChange={(e) => setMatchIsHome(e.target.value === 'home')}
              >
                <SelectItem value="home" text="Home" />
                <SelectItem value="away" text="Away" />
              </Select>
            </div>
            
            <div className="form-row">
              <Select
                id="match-formation"
                labelText="Formation"
                value={matchFormation}
                onChange={(e) => setMatchFormation(e.target.value as Formation)}
              >
                <SelectItem value={Formation.F_442} text="4-4-2" />
                <SelectItem value={Formation.F_451} text="4-5-1" />
                <SelectItem value={Formation.F_433} text="4-3-3" />
                <SelectItem value={Formation.F_541} text="5-4-1" />
                <SelectItem value={Formation.F_352} text="3-5-2" />
                <SelectItem value={Formation.F_532} text="5-3-2" />
              </Select>
            </div>
          </Form>
        </Modal>
      </Tile>
    </div>
  );
};

export default MatchSchedule;
