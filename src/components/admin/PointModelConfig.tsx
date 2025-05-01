import React from 'react';
import { 
  Tabs, 
  Tab, 
  Tile,
  Button,
  Form,
  TextInput,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  InlineNotification,
  NumberInput,
  Select,
  SelectItem
} from '@carbon/react';
import { TrashCan, Edit, Add } from '@carbon/icons-react';
import { Position, EventType, PointModelEntry } from '../../types';
import { usePointModel } from '../../context';

const PointModelConfig: React.FC = () => {
  const { pointModel, updatePointModel } = usePointModel();
  
  const [position, setPosition] = React.useState<Position>(Position.GOALKEEPER);
  const [eventType, setEventType] = React.useState<EventType>(EventType.CLEAN_SHEET);
  const [points, setPoints] = React.useState<number>(0);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [success, setSuccess] = React.useState('');
  
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (points === undefined) {
      setErrors(['Points value is required']);
      return;
    }
    
    // Check if entry already exists
    const existingIndex = pointModel.findIndex(
      entry => entry.position === position && entry.eventType === eventType
    );
    
    // Create a copy of the current point model
    const updatedPointModel = [...pointModel];
    
    if (editingIndex !== null) {
      // Update existing entry
      updatedPointModel[editingIndex] = {
        position,
        eventType,
        points
      };
    } else if (existingIndex !== -1) {
      // Update existing entry if found
      updatedPointModel[existingIndex] = {
        position,
        eventType,
        points
      };
    } else {
      // Add new entry
      updatedPointModel.push({
        position,
        eventType,
        points
      });
    }
    
    // Update point model
    updatePointModel(updatedPointModel);
    
    // Reset form
    setPosition(Position.GOALKEEPER);
    setEventType(EventType.CLEAN_SHEET);
    setPoints(0);
    setEditingIndex(null);
    setErrors([]);
    setSuccess('Point model updated successfully!');
    setIsModalOpen(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Handle edit entry
  const handleEdit = (index: number) => {
    const entry = pointModel[index];
    
    setPosition(entry.position);
    setEventType(entry.eventType);
    setPoints(entry.points);
    setEditingIndex(index);
    setIsModalOpen(true);
  };
  
  // Handle delete entry
  const handleDelete = (index: number) => {
    const updatedPointModel = [...pointModel];
    updatedPointModel.splice(index, 1);
    
    updatePointModel(updatedPointModel);
    setSuccess('Point model entry deleted successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  
  // Open modal for new entry
  const handleAddEntry = () => {
    setPosition(Position.GOALKEEPER);
    setEventType(EventType.CLEAN_SHEET);
    setPoints(0);
    setEditingIndex(null);
    setIsModalOpen(true);
  };
  
  // Get position display name
  const getPositionDisplay = (position: Position) => {
    return position;
  };
  
  // Get event type display name
  const getEventTypeDisplay = (eventType: EventType) => {
    return eventType;
  };
  
  return (
    <div className="point-model-config">
      <Tile>
        <h2>Point Model Configuration</h2>
        
        <div className="section-header">
          <h3>Points per Event per Position</h3>
          <Button 
            kind="primary" 
            renderIcon={Add} 
            onClick={handleAddEntry}
          >
            Add Entry
          </Button>
        </div>
        
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
        
        {/* Point Model Table */}
        <DataTable rows={pointModel.map((entry, index) => ({
          id: `${index}`,
          position: entry.position,
          eventType: entry.eventType,
          points: entry.points
        }))} headers={[
          { header: 'Position', key: 'position' },
          { header: 'Event', key: 'eventType' },
          { header: 'Points', key: 'points' },
          { header: 'Actions', key: 'actions' }
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
                  const index = parseInt(row.id);
                  const entry = pointModel[index];
                  
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{getPositionDisplay(entry.position)}</TableCell>
                      <TableCell>{getEventTypeDisplay(entry.eventType)}</TableCell>
                      <TableCell>{entry.points}</TableCell>
                      <TableCell>
                        <Button
                          kind="ghost"
                          renderIcon={Edit}
                          iconDescription="Edit"
                          hasIconOnly
                          onClick={() => handleEdit(index)}
                        />
                        <Button
                          kind="danger--ghost"
                          renderIcon={TrashCan}
                          iconDescription="Delete"
                          hasIconOnly
                          onClick={() => handleDelete(index)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DataTable>
        
        {/* Entry Modal */}
        <Modal
          open={isModalOpen}
          modalHeading={editingIndex !== null ? "Edit Point Model Entry" : "Add Point Model Entry"}
          primaryButtonText="Save"
          secondaryButtonText="Cancel"
          onRequestSubmit={handleSubmit}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <Form>
            <div className="form-row">
              <Select
                id="position"
                labelText="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
              >
                <SelectItem value={Position.GOALKEEPER} text="Goalkeeper" />
                <SelectItem value={Position.DEFENDER} text="Defender" />
                <SelectItem value={Position.MIDFIELDER} text="Midfielder" />
                <SelectItem value={Position.ATTACKER} text="Attacker" />
                <SelectItem value={Position.ALL} text="All Positions" />
              </Select>
            </div>
            
            <div className="form-row">
              <Select
                id="event-type"
                labelText="Event Type"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
              >
                <SelectItem value={EventType.CLEAN_SHEET} text="Clean Sheet" />
                <SelectItem value={EventType.CONCEDE_1_GOAL} text="Concede 1 Goal" />
                <SelectItem value={EventType.CONCEDE_2_GOALS} text="Concede 2 Goals" />
                <SelectItem value={EventType.PENALTY_SAVE} text="Penalty Save" />
                <SelectItem value={EventType.ASSIST} text="Assist" />
                <SelectItem value={EventType.GOAL_SCORED} text="Goal Scored" />
                <SelectItem value={EventType.MATCH_WIN} text="Match Win" />
                <SelectItem value={EventType.WINNING_PENALTY} text="Winning a Penalty" />
                <SelectItem value={EventType.YELLOW_CARD} text="Yellow Card" />
                <SelectItem value={EventType.RED_CARD} text="Red Card" />
                <SelectItem value={EventType.OWN_GOAL} text="Own Goal" />
              </Select>
            </div>
            
            <div className="form-row">
              <NumberInput
                id="points"
                label="Points"
                value={points}
                onChange={(e, { value }) => setPoints(value)}
                step={1}
                min={-10}
                max={20}
              />
            </div>
          </Form>
        </Modal>
      </Tile>
    </div>
  );
};

export default PointModelConfig;
