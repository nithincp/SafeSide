import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const ShadowItDetector = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/shadow-it/')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching shadow IT data:', error);
      });
  }, []);

  if (items.length === 0) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Shadow IT Detector</Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.item}>
            <ListItemText primary={`${item.item} (Detected on: ${item.detected_on})`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ShadowItDetector;
