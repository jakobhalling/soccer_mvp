import React from 'react';
import { 
  Tabs, 
  Tab, 
  Tile,
  Button,
  Form,
  TextInput,
  FileUploader,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  InlineNotification,
  CopyButton,
  FileUploaderButton
} from '@carbon/react';
import { TrashCan, Edit, Add } from '@carbon/icons-react';
import { v4 as uuidv4 } from 'uuid';
import { useTeam, usePlayers } from '../../context';
import { validateTeam, validatePlayer } from '../../utils/validation';

const TeamSetup: React.FC = () => {
  const { team, setTeam, updateTeam } = useTeam();
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers();
  
  const [teamName, setTeamName] = React.useState(team?.name || '');
  const [teamLogo, setTeamLogo] = React.useState(team?.logo || '');
  const [teamErrors, setTeamErrors] = React.useState<string[]>([]);
  const [teamSuccess, setTeamSuccess] = React.useState('');
  
  const [playerName, setPlayerName] = React.useState('');
  const [playerNumber, setPlayerNumber] = React.useState('');
  const [playerErrors, setPlayerErrors] = React.useState<string[]>([]);
  const [playerSuccess, setPlayerSuccess] = React.useState('');
  
  const [editingPlayer, setEditingPlayer] = React.useState<string | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = React.useState(false);
  
  // Generate public scoreboard URL
  const scoreboardUrl = team ? `${window.location.origin}/team/${team.id}` : '';
  
  // Handle team form submission
  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const teamData = {
      name: teamName,
      logo: teamLogo
    };
    
    const validation = validateTeam(teamData);
    
    if (!validation.isValid) {
      setTeamErrors(validation.errors);
      setTeamSuccess('');
      return;
    }
    
    if (team) {
      // Update existing team
      updateTeam({
        name: teamName,
        logo: teamLogo
      });
    } else {
      // Create new team
      const newTeam = {
        id: uuidv4(),
        name: teamName,
        logo: teamLogo,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTeam(newTeam);
    }
    
    setTeamErrors([]);
    setTeamSuccess('Team information saved successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setTeamSuccess('');
    }, 3000);
  };
  
  // Handle logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setTeamLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle player form submission
  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) {
      setPlayerErrors(['Please create a team first']);
      return;
    }
    
    const playerData = {
      name: playerName,
      number: playerNumber ? parseInt(playerNumber, 10) : undefined,
      teamId: team.id
    };
    
    const validation = validatePlayer(playerData);
    
    if (!validation.isValid) {
      setPlayerErrors(validation.errors);
      setPlayerSuccess('');
      return;
    }
    
    if (editingPlayer) {
      // Update existing player
      updatePlayer(editingPlayer, {
        name: playerName,
        number: playerNumber ? parseInt(playerNumber, 10) : undefined
      });
    } else {
      // Create new player
      const newPlayer = {
        id: uuidv4(),
        teamId: team.id,
        name: playerName,
        number: playerNumber ? parseInt(playerNumber, 10) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addPlayer(newPlayer);
    }
    
    // Reset form
    setPlayerName('');
    setPlayerNumber('');
    setEditingPlayer(null);
    setPlayerErrors([]);
    setPlayerSuccess('Player saved successfully!');
    setIsPlayerModalOpen(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setPlayerSuccess('');
    }, 3000);
  };
  
  // Handle edit player
  const handleEditPlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    setPlayerName(player.name);
    setPlayerNumber(player.number?.toString() || '');
    setEditingPlayer(player.id);
    setIsPlayerModalOpen(true);
  };
  
  // Handle delete player
  const handleDeletePlayer = (playerId: string) => {
    deletePlayer(playerId);
    setPlayerSuccess('Player deleted successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setPlayerSuccess('');
    }, 3000);
  };
  
  // Open player modal for new player
  const handleAddPlayer = () => {
    setPlayerName('');
    setPlayerNumber('');
    setEditingPlayer(null);
    setIsPlayerModalOpen(true);
  };
  
  return (
    <div className="team-setup">
      <Tile>
        <h2>Team Setup</h2>
        
        {/* Team Information Form */}
        <div className="team-info-form">
          <h3>Team Information</h3>
          
          {teamErrors.length > 0 && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={teamErrors.join(', ')}
              hideCloseButton
            />
          )}
          
          {teamSuccess && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle={teamSuccess}
              hideCloseButton
            />
          )}
          
          <Form onSubmit={handleTeamSubmit}>
            <div className="form-row">
              <TextInput
                id="team-name"
                labelText="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-row">
              {/* Replace FileUploader with custom input to avoid nested buttons */}
              <div className="file-upload-container">
                <label htmlFor="logo-upload" className="file-upload-label">Team Logo</label>
                <p className="file-upload-description">Only .jpg, .png, or .gif files. Max 500KB.</p>
                <input
                  type="file"
                  id="logo-upload"
                  accept=".jpg,.png,.gif"
                  onChange={handleLogoUpload}
                  className="file-upload-input"
                />
                <div className="file-upload-button-container">
                  <Button
                    kind="primary"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    Upload Logo
                  </Button>
                </div>
              </div>
            </div>
            
            {teamLogo && (
              <div className="logo-preview">
                <img 
                  src={teamLogo} 
                  alt="Team Logo Preview" 
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                />
              </div>
            )}
            
            <div className="form-row">
              <Button type="submit">Save Team Information</Button>
            </div>
          </Form>
          
          {team && (
            <div className="public-url">
              <h4>Public Scoreboard URL</h4>
              <div className="url-display">
                <TextInput
                  id="scoreboard-url"
                  value={scoreboardUrl}
                  readOnly
                />
                <CopyButton
                  onClick={() => navigator.clipboard.writeText(scoreboardUrl)}
                  iconDescription="Copy URL"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Player Management */}
        <div className="player-management">
          <div className="section-header">
            <h3>Player Management</h3>
            <Button 
              kind="primary" 
              renderIcon={Add} 
              onClick={handleAddPlayer}
              disabled={!team}
            >
              Add Player
            </Button>
          </div>
          
          {playerErrors.length > 0 && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={playerErrors.join(', ')}
              hideCloseButton
            />
          )}
          
          {playerSuccess && (
            <InlineNotification
              kind="success"
              title="Success"
              subtitle={playerSuccess}
              hideCloseButton
            />
          )}
          
          {/* Player Table */}
          <DataTable rows={players} headers={[
            { header: 'Name', key: 'name' },
            { header: 'Number', key: 'number' },
            { header: 'Actions', key: 'actions' }
          ]}>
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header) => {
                      // Extract key from header props to avoid spreading it
                      const headerProps = getHeaderProps({ header });
                      const key = headerProps.key;
                      delete headerProps.key;
                      
                      return (
                        <TableHeader key={key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.cells[0].value}</TableCell>
                      <TableCell>{row.cells[1].value}</TableCell>
                      <TableCell>
                        <Button
                          kind="ghost"
                          renderIcon={Edit}
                          iconDescription="Edit"
                          hasIconOnly
                          onClick={() => handleEditPlayer(row.id)}
                        />
                        <Button
                          kind="danger--ghost"
                          renderIcon={TrashCan}
                          iconDescription="Delete"
                          hasIconOnly
                          onClick={() => handleDeletePlayer(row.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DataTable>
          
          {/* Player Modal */}
          <Modal
            open={isPlayerModalOpen}
            modalHeading={editingPlayer ? "Edit Player" : "Add Player"}
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            onRequestSubmit={handlePlayerSubmit}
            onRequestClose={() => setIsPlayerModalOpen(false)}
          >
            <Form>
              <div className="form-row">
                <TextInput
                  id="player-name"
                  labelText="Player Name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-row">
                <TextInput
                  id="player-number"
                  labelText="Player Number"
                  type="number"
                  min="0"
                  max="99"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                />
              </div>
            </Form>
          </Modal>
        </div>
      </Tile>
    </div>
  );
};

export default TeamSetup;
