import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  useTheme,
  Skeleton,
  Chip,
  Alert,
} from "@mui/material";
import {
  Inventory,
  Security,
  Warning,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

const PackageVettingSummary = () => {
  const [tableData, setTableData] = useState([]);
  const [pieData, setPieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/api/package-vetting/"),
      axios.get("http://localhost:8000/api/package-health/"),
    ])
      .then(([vettingResponse, healthResponse]) => {
        setTableData(vettingResponse.data);

        const data = healthResponse.data;
        const labels = data.map((item) => item.label);
        const values = data.map((item) => item.value);

        setPieData({
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ],
              borderColor: [
                theme.palette.success.dark,
                theme.palette.warning.dark,
                theme.palette.error.dark,
              ],
              borderWidth: 2,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching package data:", error);
        setLoading(false);
      });
  }, [theme.palette]);

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          background: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Inventory sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Package Vetting Summary
          </Typography>
        </Box>
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ mb: 2, borderRadius: 1 }}
        />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (!pieData || tableData.length === 0) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          background: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography color="text.secondary">No data available</Typography>
      </Paper>
    );
  }

  const totalVulnerable = tableData.reduce(
    (sum, row) => sum + row.vulnerable_packages,
    0
  );
  const totalViolations = tableData.reduce(
    (sum, row) => sum + row.license_violations,
    0
  );

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "500",
          },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          size: 14,
          weight: "600",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        background: theme.palette.background.paper,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Inventory
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Package Vetting Summary
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            icon={<Warning />}
            label={`${totalVulnerable} Vulnerable`}
            color="warning"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Error />}
            label={`${totalViolations} Violations`}
            color="error"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Summary Alert */}
      {(totalVulnerable > 0 || totalViolations > 0) && (
        <Alert
          severity={totalVulnerable > 10 ? "error" : "warning"}
          sx={{ mb: 3 }}
          icon={totalVulnerable > 10 ? <Error /> : <Warning />}
        >
          {totalVulnerable > 10
            ? "Critical: High number of vulnerable packages detected"
            : "Warning: Some packages require attention"}
        </Alert>
      )}

      {/* Table */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Repository Analysis
        </Typography>
        <TableContainer
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[800]
                      : theme.palette.grey[50],
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>Repository</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Vulnerable
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  License Issues
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow
                  key={row.repository}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>
                    {row.repository}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.vulnerable_packages}
                      color={row.vulnerable_packages > 5 ? "error" : "warning"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.license_violations}
                      color={row.license_violations > 0 ? "error" : "success"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pie Chart */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Package Health Distribution
        </Typography>
        <Box sx={{ height: 200, position: "relative" }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </Box>
    </Paper>
  );
};

export default PackageVettingSummary;
