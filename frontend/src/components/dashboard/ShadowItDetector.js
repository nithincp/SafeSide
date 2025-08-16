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
  Divider,
} from "@mui/material";
import {
  Visibility,
  Warning,
  Error,
  Info,
  Security,
  TrendingUp,
  Block,
} from "@mui/icons-material";
import axios from "axios";

const ShadowItDetector = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/shadow-it/")
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shadow IT data:", error);
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
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Visibility sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Shadow IT Detector
          </Typography>
        </Box>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (items.length === 0) {
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
        <Typography color="text.secondary">
          No shadow IT items detected
        </Typography>
      </Paper>
    );
  }

  // Calculate summary statistics
  const totalItems = items.length;
  const recentItems = items.filter((item) => {
    const detectedDate = new Date(item.detected_on);
    const daysAgo =
      (Date.now() - detectedDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 7;
  }).length;
  const highRiskItems = items.filter(
    (item) => item.risk_level === "high" || item.category === "unauthorized"
  ).length;
  const cloudServices = items.filter(
    (item) => item.category === "cloud" || item.type === "saas"
  ).length;

  const getRiskLevel = () => {
    if (highRiskItems > 5) return "high";
    if (highRiskItems > 2) return "medium";
    return "low";
  };

  const riskLevel = getRiskLevel();

  const getCategoryIcon = (category) => {
    switch (category) {
      case "cloud":
        return <Security />;
      case "software":
        return <Info />;
      case "hardware":
        return <Warning />;
      case "unauthorized":
        return <Block />;
      default:
        return <Info />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "cloud":
        return "primary";
      case "software":
        return "info";
      case "hardware":
        return "warning";
      case "unauthorized":
        return "error";
      default:
        return "default";
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
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
          <Visibility
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Shadow IT Detector
          </Typography>
        </Box>
        <Chip
          icon={<Security />}
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
      {highRiskItems > 0 && (
        <Alert
          severity={highRiskItems > 5 ? "error" : "warning"}
          sx={{ mb: 3 }}
          icon={highRiskItems > 5 ? <Error /> : <Warning />}
        >
          {highRiskItems > 5
            ? `Critical: ${highRiskItems} high-risk shadow IT items detected`
            : `Warning: ${highRiskItems} shadow IT items require attention`}
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
            <Visibility
              sx={{ fontSize: 24, color: theme.palette.primary.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {totalItems}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total Items
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
              {recentItems}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Recent (7 days)
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
            <Error
              sx={{ fontSize: 24, color: theme.palette.error.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="error.main">
              {highRiskItems}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              High Risk
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
            <Security
              sx={{ fontSize: 24, color: theme.palette.info.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="info.main">
              {cloudServices}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cloud Services
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Detected Items */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Detected Shadow IT Items
        </Typography>
        <List
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 0,
          }}
        >
          {items.map((item, index) => (
            <Box key={item.item}>
              <ListItem
                sx={{
                  py: 2,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 1,
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box sx={{ mr: 2 }}>{getCategoryIcon(item.category)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {item.item}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Detected:{" "}
                        {new Date(item.detected_on).toLocaleDateString()}
                      </Typography>
                      {item.user && (
                        <Typography variant="caption" color="text.secondary">
                          • User: {item.user}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={item.category || "Unknown"}
                      color={getCategoryColor(item.category)}
                      size="small"
                      variant="outlined"
                      sx={{ height: 24, fontSize: "0.7rem" }}
                    />
                    {item.risk_level && (
                      <Chip
                        label={item.risk_level}
                        color={getRiskColor(item.risk_level)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 24, fontSize: "0.7rem", fontWeight: 600 }}
                      />
                    )}
                  </Box>
                </Box>
              </ListItem>
              {index < items.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ShadowItDetector;
