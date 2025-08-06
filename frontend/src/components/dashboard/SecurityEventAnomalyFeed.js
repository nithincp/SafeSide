import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SecurityEventAnomalyFeed = () => {
  const [lineData, setLineData] = useState(null);
  const [anomalyTypes, setAnomalyTypes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/security-anomalies/')
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.date);
        const counts = data.map(item => item.count);
        const types = [...new Set(data.map(item => item.anomaly_type))];

        setLineData({
          labels: labels,
          datasets: [
            {
              label: 'Anomalies',
              data: counts,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
        setAnomalyTypes(types);
      })
      .catch(error => {
        console.error('Error fetching security anomaly data:', error);
      });
  }, []);

  if (!lineData) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Security Event Anomaly Feed</Typography>
      <Line data={lineData} />
      <Typography variant="subtitle1" style={{ marginTop: '16px' }}>
        Anomaly Types
      </Typography>
      <List>
        {anomalyTypes.map((type) => (
          <ListItem key={type}>
            <ListItemText primary={type} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SecurityEventAnomalyFeed;
