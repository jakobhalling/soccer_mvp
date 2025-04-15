import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AppLayout from './components/layouts/AppLayout';
import FrontPage from './pages/public/FrontPage';
import Scoreboard from './pages/public/Scoreboard';
import Login from './pages/public/Login';
import Administration from './pages/admin/Administration';
import MatchSetupResults from './pages/admin/MatchSetupResults';
import './App.css';

// Import Carbon Design System styles
import '@carbon/styles/css/styles.css';

function App() {
  // Define router configuration
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <FrontPage />
        },
        {
          path: 'team/:teamId',
          element: <Scoreboard />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'admin',
          element: <Administration />
        },
        {
          path: 'admin/matches',
          element: <MatchSetupResults />
        }
      ]
    }
  ]);

  return (
    <DndProvider backend={HTML5Backend}>
      <RouterProvider router={router} />
    </DndProvider>
  );
}

export default App;
