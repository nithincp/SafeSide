import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  Skeleton,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import {
  Security,
  TrendingUp,
  Warning,
  Error,
  Info,
  Timeline,
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

const SecurityEventAnomalyFeed = () => {
  const [lineData, setLineData] = useState(null);
  const [anomalyTypes, setAnomalyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/security-anomalies/")
      .then((response) => {
        const data = response.data;
        const labels = data.map((item) => item.date);
        const counts = data.map((item) => item.count);
        const types = [...new Set(data.map((item) => item.anomaly_type))];

        // Calculate summary statistics
        const totalAnomalies = counts.reduce((sum, count) => sum + count, 0);
        const avgAnomalies = totalAnomalies / counts.length;
        const maxAnomalies = Math.max(...counts);
        const recentTrend = counts
          .slice(-3)
          .reduce((sum, count) => sum + count, 0);

        setSummary({
          totalAnomalies,
          avgAnomalies: avgAnomalies.toFixed(1),
          maxAnomalies,
          recentTrend,
        });

        setLineData({
          labels: labels,
          datasets: [
            {
              label: "Security Anomalies",
              data: counts,
              borderColor: theme.palette.error.main,
              backgroundColor: theme.palette.error.light + "20",
              borderWidth: 3,
              pointBackgroundColor: theme.palette.error.main,
              pointBorderColor: theme.palette.background.paper,
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
              tension: 0.4,
              fill: true,
            },
          ],
        });
        setAnomalyTypes(types);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching security anomaly data:", error);
        setLoading(false);
      });
  }, [theme.palette]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
          <Security sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Security Event Anomaly Feed
          </Typography>
        </Box>
        <Skeleton
          variant="rectangular"
          height={250}
          sx={{ mb: 2, borderRadius: 1 }}
        />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (!lineData) {
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

  const threatLevel =
    summary.recentTrend > 20
      ? "high"
      : summary.recentTrend > 10
      ? "medium"
      : "low";

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
          <Security
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Security Event Anomaly Feed
          </Typography>
        </Box>
        <Chip
          icon={<Timeline />}
          label={`${threatLevel.toUpperCase()} THREAT`}
          color={
            threatLevel === "high"
              ? "error"
              : threatLevel === "medium"
              ? "warning"
              : "success"
          }
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Threat Alert */}
      {summary.recentTrend > 15 && (
        <Alert
          severity={summary.recentTrend > 25 ? "error" : "warning"}
          sx={{ mb: 3 }}
          icon={summary.recentTrend > 25 ? <Error /> : <Warning />}
        >
          {summary.recentTrend > 25
            ? `Critical: High anomaly activity detected in the last 3 days (${summary.recentTrend} events)`
            : `Warning: Elevated anomaly activity detected (${summary.recentTrend} events in 3 days)`}
        </Alert>
      )}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.error.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.error.light}`,
              textAlign: "center",
            }}
          >
            <Error
              sx={{ fontSize: 24, color: theme.palette.error.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="error.main">
              {summary.totalAnomalies}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Events
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.warning.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.warning.light}`,
              textAlign: "center",
            }}
          >
            <TrendingUp
              sx={{ fontSize: 24, color: theme.palette.warning.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="warning.main">
              {summary.avgAnomalies}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Daily Average
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.info.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.info.light}`,
              textAlign: "center",
            }}
          >
            <Warning
              sx={{ fontSize: 24, color: theme.palette.info.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="info.main">
              {summary.maxAnomalies}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Peak Events
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.primary.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.light}`,
              textAlign: "center",
            }}
          >
            <Security
              sx={{ fontSize: 24, color: theme.palette.primary.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {summary.recentTrend}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last 3 Days
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 1.5 }}
        >
          Anomaly Activity Timeline
        </Typography>
        <Box sx={{ height: 250, position: "relative" }}>
          <Line data={lineData} options={options} />
        </Box>
      </Box>

      {/* Anomaly Types */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Detected Anomaly Types
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 2,
          }}
        >
          {anomalyTypes.map((type, index) => (
            <Chip
              key={type}
              label={type}
              color={
                index % 3 === 0
                  ? "primary"
                  : index % 3 === 1
                  ? "secondary"
                  : "default"
              }
              variant="outlined"
              size="small"
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default SecurityEventAnomalyFeed;
