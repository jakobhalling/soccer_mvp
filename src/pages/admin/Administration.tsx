import React from 'react';
import { 
  Tabs, 
  TabList,
  Tab, 
  TabPanels,
  TabPanel,
  Tile 
} from '@carbon/react';
import TeamSetup from '../../components/admin/TeamSetup';
import MatchSchedule from '../../components/admin/MatchSchedule';
import PointModelConfig from '../../components/admin/PointModelConfig';

const Administration: React.FC = () => {
  return (
    <div className="administration-page">
      <Tabs>
        <TabList aria-label="Administration Tabs">
          <Tab>Team Setup</Tab>
          <Tab>Match Schedule</Tab>
          <Tab>Point Model</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TeamSetup />
          </TabPanel>
          <TabPanel>
            <MatchSchedule />
          </TabPanel>
          <TabPanel>
            <PointModelConfig />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default Administration;
