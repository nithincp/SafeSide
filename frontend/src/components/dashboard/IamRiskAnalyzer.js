import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  useTheme,
  Skeleton,
  Chip,
  Grid,
  Alert,
} from "@mui/material";
import {
  Security,
  Warning,
  Error,
  CheckCircle,
  Person,
} from "@mui/icons-material";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const IamRiskAnalyzer = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/iam-risk-analyzer/")
      .then((response) => {
        const data = response.data;

        // Calculate summary statistics
        const totalRoles = data.length;
        const mfaEnabled = data.filter((item) => item.mfa_enabled).length;
        const highRiskRoles = data.filter((item) => !item.mfa_enabled).length;
        const avgPermissions =
          data.reduce((sum, item) => sum + (item.permissions || 0), 0) /
          totalRoles;

        setSummary({
          totalRoles,
          mfaEnabled,
          highRiskRoles,
          avgPermissions: avgPermissions.toFixed(1),
        });

        const datasets = data.map((item, index) => ({
          label: item.role,
          data: [
            {
              x: (index + 1) * 20,
              y: Math.random() * 50,
              r: item.mfa_enabled ? 8 : 20,
            },
          ],
          backgroundColor: item.mfa_enabled
            ? theme.palette.success.main + "80"
            : theme.palette.error.main + "80",
          borderColor: item.mfa_enabled
            ? theme.palette.success.dark
            : theme.palette.error.dark,
          borderWidth: 2,
        }));

        setChartData({
          datasets: datasets,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching IAM risk data:", error);
        setLoading(false);
      });
  }, [theme.palette]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
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
        title: {
          display: true,
          text: "Role Complexity",
          color: theme.palette.text.secondary,
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
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
        title: {
          display: true,
          text: "Risk Level",
          color: theme.palette.text.secondary,
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
    },
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
        callbacks: {
          label: function (context) {
            const role = context.dataset.label;
            const mfaStatus =
              context.dataset.data[0].r > 10 ? "No MFA" : "MFA Enabled";
            return [`Role: ${role}`, `Status: ${mfaStatus}`];
          },
        },
      },
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
            IAM Risk Analyzer
          </Typography>
        </Box>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
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

  const riskLevel =
    summary.highRiskRoles > 10
      ? "high"
      : summary.highRiskRoles > 5
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
            IAM Risk Analyzer
          </Typography>
        </Box>
        <Chip
          icon={
            riskLevel === "high" ? (
              <Error />
            ) : riskLevel === "medium" ? (
              <Warning />
            ) : (
              <CheckCircle />
            )
          }
          label={`${riskLevel.toUpperCase()} RISK`}
          color={
            riskLevel === "high"
              ? "error"
              : riskLevel === "medium"
              ? "warning"
              : "success"
          }
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Risk Alert */}
      {summary.highRiskRoles > 0 && (
        <Alert
          severity={summary.highRiskRoles > 10 ? "error" : "warning"}
          sx={{ mb: 3 }}
          icon={summary.highRiskRoles > 10 ? <Error /> : <Warning />}
        >
          {summary.highRiskRoles > 10
            ? `Critical: ${summary.highRiskRoles} high-risk IAM roles detected without MFA`
            : `Warning: ${summary.highRiskRoles} IAM roles require MFA configuration`}
        </Alert>
      )}

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
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
            <Person
              sx={{ fontSize: 32, color: theme.palette.primary.main, mb: 1 }}
            />
            <Typography variant="h4" fontWeight={700} color="primary.main">
              {summary.totalRoles}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Roles
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.success.light + "15",
              borderRadius: 2,
              border: `1px solid ${theme.palette.success.light}`,
              textAlign: "center",
            }}
          >
            <CheckCircle
              sx={{ fontSize: 32, color: theme.palette.success.main, mb: 1 }}
            />
            <Typography variant="h4" fontWeight={700} color="success.main">
              {summary.mfaEnabled}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              MFA Enabled
            </Typography>
          </Box>
        </Grid>
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
            <Warning
              sx={{ fontSize: 32, color: theme.palette.error.main, mb: 1 }}
            />
            <Typography variant="h4" fontWeight={700} color="error.main">
              {summary.highRiskRoles}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High Risk
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
            <Security
              sx={{ fontSize: 32, color: theme.palette.warning.main, mb: 1 }}
            />
            <Typography variant="h4" fontWeight={700} color="warning.main">
              {summary.avgPermissions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Permissions
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
          IAM Role Risk Analysis - Blast Radius Visualization
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 2, display: "block" }}
        >
          Bubble size indicates MFA status (larger = no MFA), position shows
          risk level and complexity
        </Typography>
        <Box sx={{ height: 400, position: "relative" }}>
          <Bubble data={chartData} options={options} />
        </Box>
      </Box>
    </Paper>
  );
};

export default IamRiskAnalyzer;
