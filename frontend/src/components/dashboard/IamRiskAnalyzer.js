import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const IamRiskAnalyzer = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/iam-risk-analyzer/')
      .then(response => {
        const data = response.data;
        const datasets = data.map((item, index) => ({
          label: item.role,
          data: [{ x: (index + 1) * 20, y: Math.random() * 50, r: item.mfa_enabled ? 5 : 15 }],
          backgroundColor: `rgba(${Math.random() * 255}, 99, 132, 0.5)`,
        }));

        setChartData({
          datasets: datasets,
        });
      })
      .catch(error => {
        console.error('Error fetching IAM risk data:', error);
      });
  }, []);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'IAM Risk Analyzer - Blast Radius',
      },
    },
  };

  if (!chartData) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">IAM Risk Analyzer</Typography>
      <Bubble data={chartData} options={options} />
    </Paper>
  );
};

export default IamRiskAnalyzer;
