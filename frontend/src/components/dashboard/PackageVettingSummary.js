import React, { useState, useEffect } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const PackageVettingSummary = () => {
  const [tableData, setTableData] = useState([]);
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/package-vetting/')
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error fetching package vetting data:', error);
      });

    axios.get('http://localhost:8000/api/package-health/')
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.label);
        const values = data.map(item => item.value);

        setPieData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
          ],
        });
      })
      .catch(error => {
        console.error('Error fetching package health data:', error);
      });
  }, []);

  if (!pieData) {
    return <Paper style={{ padding: '16px' }}>Loading...</Paper>;
  }

  return (
    <Paper style={{ padding: '16px' }}>
      <Typography variant="h6">Package Vetting Summary</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Repository</TableCell>
              <TableCell>Vulnerable Packages</TableCell>
              <TableCell>License Violations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row.repository}>
                <TableCell>{row.repository}</TableCell>
                <TableCell>{row.vulnerable_packages}</TableCell>
                <TableCell>{row.license_violations}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ width: '50%', margin: 'auto', marginTop: '16px' }}>
        <Pie data={pieData} />
      </div>
    </Paper>
  );
};

export default PackageVettingSummary;
