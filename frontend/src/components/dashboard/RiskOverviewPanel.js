import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  Security,
  Warning,
  ErrorOutline,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import axios from "axios";

const RiskOverviewPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/risk-overview/")
      .then((response) => {
        setData(response.data[0]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching risk overview data:", error);
        setLoading(false);
      });
  }, []);

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
          <Security sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Risk Overview
          </Typography>
        </Box>
        <Skeleton
          variant="rectangular"
          height={60}
          sx={{ mb: 2, borderRadius: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ mb: 1, borderRadius: 1 }}
        />
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ mb: 1, borderRadius: 1 }}
        />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (!data) {
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

  const getRiskLevel = (issues) => {
    if (issues > 50) return "high";
    if (issues > 20) return "medium";
    return "low";
  };

  const riskLevel = getRiskLevel(data.total_issues);

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
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Security
          sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
        />
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Risk Overview
        </Typography>
      </Box>

      {/* Risk Level Indicator */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Risk Level
          </Typography>
          <Chip
            label={riskLevel.toUpperCase()}
            color={
              riskLevel === "high"
                ? "error"
                : riskLevel === "medium"
                ? "warning"
                : "success"
            }
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={riskLevel === "high" ? 90 : riskLevel === "medium" ? 60 : 30}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.palette.grey[200],
            "& .MuiLinearProgress-bar": {
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Metrics */}
      <Box sx={{ space: 2 }}>
        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Security Issues
            </Typography>
            <ErrorOutline
              sx={{ color: theme.palette.error.main, fontSize: 20 }}
            />
          </Box>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {data.total_issues}
          </Typography>
        </Box>

        <Box sx={{ mb: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              High-Risk IAM Roles
            </Typography>
            <Warning sx={{ color: theme.palette.warning.main, fontSize: 20 }} />
          </Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {data.high_risk_roles}
          </Typography>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Exposed Secrets
            </Typography>
            <TrendingUp
              sx={{ color: theme.palette.error.main, fontSize: 20 }}
            />
          </Box>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {data.exposed_secrets}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default RiskOverviewPanel;
