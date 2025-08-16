import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CloudMisconfigurationHeatmap = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/cloud-misconfigurations/')
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.category);
        const values = data.map(item => item.value);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Misconfigurations',
              data: values,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching cloud misconfiguration data:', error);
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
        text: 'Cloud Misconfiguration Heatmap',
      },
    },
  };

  if (!chartData) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Cloud Misconfiguration Heatmap</Typography>
      <Bar data={chartData} options={options} />
    </Paper>
  );
};

export default CloudMisconfigurationHeatmap;
