import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  useTheme,
  Skeleton,
  Chip,
  Grid,
} from "@mui/material";
import {
  Key,
  Security,
  TrendingDown,
  TrendingUp,
  Warning,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SecretsHygieneTracker = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/secrets-hygiene/")
      .then((response) => {
        const data = response.data;
        const labels = data.map((item) => item.date);
        const secretsFound = data.map((item) => item.secrets_found);
        const secretsRotated = data.map((item) => item.secrets_rotated);

        // Calculate summary statistics
        const totalFound = secretsFound.reduce((sum, val) => sum + val, 0);
        const totalRotated = secretsRotated.reduce((sum, val) => sum + val, 0);
        const avgFound = totalFound / secretsFound.length;
        const avgRotated = totalRotated / secretsRotated.length;

        setSummary({
          totalFound,
          totalRotated,
          avgFound: avgFound.toFixed(1),
          avgRotated: avgRotated.toFixed(1),
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Secrets Found",
              data: secretsFound,
              borderColor: theme.palette.error.main,
              backgroundColor: theme.palette.error.light + "20",
              borderWidth: 3,
              pointBackgroundColor: theme.palette.error.main,
              pointBorderColor: theme.palette.background.paper,
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
            },
            {
              label: "Secrets Rotated",
              data: secretsRotated,
              borderColor: theme.palette.success.main,
              backgroundColor: theme.palette.success.light + "20",
              borderWidth: 3,
              pointBackgroundColor: theme.palette.success.main,
              pointBorderColor: theme.palette.background.paper,
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
            },
          ],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching secrets hygiene data:", error);
        setLoading(false);
      });
  }, [theme.palette]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
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
      title: {
        display: false,
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
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Key sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Secrets Hygiene Tracker
          </Typography>
        </Box>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (!chartData) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
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

  const hygieneScore =
    summary.totalFound > 0
      ? Math.round((summary.totalRotated / summary.totalFound) * 100)
      : 100;

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
          <Key
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Secrets Hygiene Tracker
          </Typography>
        </Box>
        <Chip
          icon={hygieneScore > 80 ? <TrendingUp /> : <Warning />}
          label={`${hygieneScore}% Score`}
          color={hygieneScore > 80 ? "success" : "warning"}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.error.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.light}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Warning
                sx={{ mr: 1, color: theme.palette.error.main, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Total Found
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="error.main">
              {summary.totalFound}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg: {summary.avgFound}/day
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.success.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Security
                sx={{ mr: 1, color: theme.palette.success.main, fontSize: 20 }}
              />
              <Typography variant="body2" color="text.secondary">
                Total Rotated
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {summary.totalRotated}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Avg: {summary.avgRotated}/day
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Secrets Activity Over Time
        </Typography>
        <Box sx={{ height: 250, position: "relative" }}>
          <Line data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
};

export default SecretsHygieneTracker;
