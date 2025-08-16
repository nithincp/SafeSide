import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  useTheme,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Notifications,
  Download,
  Warning,
  Error,
  Info,
  CheckCircle,
} from "@mui/icons-material";

const SlackAlertSummary = () => {
  const [alerts, setAlerts] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    // This is a mock API call, as there is no model for SlackAlerts.
    // In a real application, you would fetch this from a real API endpoint.
    const mockAlerts = [
      {
        id: 1,
        text: "High-risk IAM role detected",
        severity: "high",
        timestamp: "2 hours ago",
        status: "active",
      },
      {
        id: 2,
        text: "Public S3 bucket detected",
        severity: "medium",
        timestamp: "4 hours ago",
        status: "resolved",
      },
      {
        id: 3,
        text: "New vulnerable package found",
        severity: "low",
        timestamp: "6 hours ago",
        status: "active",
      },
      {
        id: 4,
        text: "Unauthorized access attempt",
        severity: "high",
        timestamp: "8 hours ago",
        status: "investigating",
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleExport = () => {
    // Mock export functionality
    alert("Exporting alerts...");
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <Error sx={{ color: theme.palette.error.main }} />;
      case "medium":
        return <Warning sx={{ color: theme.palette.warning.main }} />;
      case "low":
        return <Info sx={{ color: theme.palette.info.main }} />;
      default:
        return <Info sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "info";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "success";
      case "investigating":
        return "warning";
      case "active":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle />;
      case "investigating":
        return <Warning />;
      case "active":
        return <Error />;
      default:
        return <Info />;
    }
  };

  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter(
    (alert) => alert.status === "active"
  ).length;
  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "resolved"
  ).length;

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
          <Notifications
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Slack Alert Summary
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Export
        </Button>
      </Box>

      {/* Summary Stats */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Chip
          icon={<Error />}
          label={`${activeAlerts} Active`}
          color="error"
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<CheckCircle />}
          label={`${resolvedAlerts} Resolved`}
          color="success"
          variant="outlined"
          size="small"
        />
        <Chip
          icon={<Notifications />}
          label={`${totalAlerts} Total`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Alerts List */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Recent Alerts
        </Typography>
        <List
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 0,
          }}
        >
          {alerts.map((alert, index) => (
            <Box key={alert.id}>
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
                  <Box sx={{ mr: 2 }}>{getSeverityIcon(alert.severity)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {alert.text}
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
                        {alert.timestamp}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(alert.status)}
                        label={alert.status}
                        color={getStatusColor(alert.status)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                  </Box>
                  <Chip
                    label={alert.severity}
                    color={getSeverityColor(alert.severity)}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600 }}
                  />
                </Box>
              </ListItem>
              {index < alerts.length - 1 && <Divider sx={{ mx: 2 }} />}
            </Box>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SlackAlertSummary;
