import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button } from '@mui/material';

const SlackAlertSummary = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // This is a mock API call, as there is no model for SlackAlerts.
    // In a real application, you would fetch this from a real API endpoint.
    const mockAlerts = [
      { id: 1, text: 'High-risk IAM role detected' },
      { id: 2, text: 'Public S3 bucket detected' },
      { id: 3, text: 'New vulnerable package found' },
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleExport = () => {
    // Mock export functionality
    alert('Exporting alerts...');
  };

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Slack Alert Summary</Typography>
      <List>
        {alerts.map((alert) => (
          <ListItem key={alert.id}>
            <ListItemText primary={alert.text} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleExport}>
        Export
      </Button>
    </Paper>
  );
};

export default SlackAlertSummary;
