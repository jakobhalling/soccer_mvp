import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction } from '@carbon/react';
import { User } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../context';

interface AppLayoutProps {
  // Add props if needed
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const navigate = useNavigate();
  const { team } = useTeam();
  // Use the correct key for authentication status
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    localStorage.getItem('soccer_mvp_auth') === 'true'
  );

  React.useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('soccer_mvp_auth') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  // Helper: Scoreboard URL (team-specific)
  const scoreboardUrl = team ? `/team/${team.id}` : '/';

  return (
    <div className="app-container">
      <Header aria-label="Soccer MVP Tracker" className="app-header">
        <HeaderName href="/" prefix="">
          Soccer MVP Tracker
        </HeaderName>
        
        {isAuthenticated && (
          <HeaderNavigation aria-label="Main Navigation" className="header-navigation">
            <HeaderMenuItem onClick={() => navigate(scoreboardUrl)} className="header-menu-item">
              Scoreboard
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate('/admin')} className="header-menu-item">
              Administration
            </HeaderMenuItem>
            <HeaderMenuItem onClick={() => navigate('/admin/matches')} className="header-menu-item">
              Match Setup & Results
            </HeaderMenuItem>
          </HeaderNavigation>
        )}
        
        <HeaderGlobalBar>
          <HeaderGlobalAction aria-label="Login" onClick={handleLoginClick} className="header-action">
            <User />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      
      <div className="content-container">
        <div className="centered-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
