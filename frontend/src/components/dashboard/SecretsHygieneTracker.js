import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SecretsHygieneTracker = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/secrets-hygiene/')
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.date);
        const secretsFound = data.map(item => item.secrets_found);
        const secretsRotated = data.map(item => item.secrets_rotated);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Secrets Found',
              data: secretsFound,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Secrets Rotated',
              data: secretsRotated,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching secrets hygiene data:', error);
      });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Secrets Hygiene Tracker',
      },
    },
  };

  if (!chartData) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Secrets Hygiene Tracker</Typography>
      <Line data={chartData} options={options} />
    </Paper>
  );
};

export default SecretsHygieneTracker;
