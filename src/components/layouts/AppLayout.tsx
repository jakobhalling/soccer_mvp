import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction } from '@carbon/react';
import { User } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  // Add props if needed
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const navigate = useNavigate();
  // Dummy authentication state for prototype
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  React.useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="app-container">
      <Header aria-label="Soccer MVP Tracker" className="app-header">
        <HeaderName href="/" prefix="">
          Soccer MVP Tracker
        </HeaderName>
        
        {isAuthenticated && (
          <HeaderNavigation aria-label="Admin Navigation" className="header-navigation">
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
