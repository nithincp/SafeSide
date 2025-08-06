import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import axios from 'axios';

const RiskOverviewPanel = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/risk-overview/')
      .then(response => {
        setData(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching risk overview data:', error);
      });
  }, []);

  if (!data) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Risk Overview</Typography>
      <Typography>Total Open Security Issues: {data.total_issues}</Typography>
      <Typography>High-Risk IAM Roles: {data.high_risk_roles}</Typography>
      <Typography>Exposed Secrets: {data.exposed_secrets}</Typography>
    </Paper>
  );
};

export default RiskOverviewPanel;
