import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  DataTable, 
  Table, 
  TableHead, 
  TableRow, 
  TableHeader, 
  TableBody, 
  TableCell,
  Pagination,
  Tile
} from '@carbon/react';
import { useTeam } from '../../context';

const FrontPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<{ id: string; name: string }[]>([]);
  
  // For prototype, we'll use a single team from context
  const { team } = useTeam();
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // For prototype, just filter the single team
    if (team && term.length > 0) {
      if (team.name.toLowerCase().includes(term.toLowerCase())) {
        setSearchResults([{ id: team.id, name: team.name }]);
      } else {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };
  
  // Handle team selection
  const handleTeamSelect = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };
  
  return (
    <div className="front-page">
      <Tile className="search-container">
        <h1>Soccer MVP Points Tracker</h1>
        <p>Find your team to view the MVP scoreboard</p>
        
        <div className="search-box">
          <Search
            labelText="Find your team"
            placeholder="Enter team name"
            value={searchTerm}
            onChange={handleSearchChange}
            size="lg"
          />
        </div>
        
        {searchResults.length > 0 && (
          <div className="search-results">
            <DataTable rows={searchResults} headers={[{ header: 'Team Name', key: 'name' }]}>
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
                    {rows.map((row) => (
                      <TableRow 
                        key={row.id} 
                        onClick={() => handleTeamSelect(row.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{row.cells[0].value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </div>
        )}
      </Tile>
    </div>
  );
};

export default FrontPage;
