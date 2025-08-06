import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const ComplianceReadinessScore = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/compliance-score/')
      .then(response => {
        setScores(response.data);
      })
      .catch(error => {
        console.error('Error fetching compliance score data:', error);
      });
  }, []);

  if (scores.length === 0) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Compliance Readiness Score</Typography>
      <List>
        {scores.map((score) => (
          <ListItem key={score.owner}>
            <ListItemText primary={`${score.owner}: ${score.score}%`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ComplianceReadinessScore;
