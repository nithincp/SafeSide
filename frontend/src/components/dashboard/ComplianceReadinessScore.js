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
  LinearProgress,
  Grid,
  Alert,
} from "@mui/material";
import {
  Assessment,
  CheckCircle,
  Warning,
  Error,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import axios from "axios";

const ComplianceReadinessScore = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/compliance-score/")
      .then((response) => {
        setScores(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching compliance score data:", error);
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
          <Assessment sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight={600}>
            Compliance Readiness Score
          </Typography>
        </Box>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  if (scores.length === 0) {
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

  // Calculate summary statistics
  const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
  const averageScore = totalScore / scores.length;
  const compliantTeams = scores.filter((score) => score.score >= 80).length;
  const atRiskTeams = scores.filter((score) => score.score < 60).length;
  const improvingTeams = scores.filter((score) => score.trend === "up").length;

  const getScoreColor = (score) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle />;
    if (score >= 60) return <Warning />;
    return <Error />;
  };

  const getOverallStatus = () => {
    if (averageScore >= 80) return "excellent";
    if (averageScore >= 60) return "good";
    return "poor";
  };

  const overallStatus = getOverallStatus();

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
          <Assessment
            sx={{ mr: 1.5, color: theme.palette.primary.main, fontSize: 28 }}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Compliance Readiness Score
          </Typography>
        </Box>
        <Chip
          icon={
            overallStatus === "excellent" ? (
              <CheckCircle />
            ) : overallStatus === "good" ? (
              <Warning />
            ) : (
              <Error />
            )
          }
          label={`${overallStatus.toUpperCase()} STATUS`}
          color={
            overallStatus === "excellent"
              ? "success"
              : overallStatus === "good"
              ? "warning"
              : "error"
          }
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Overall Score */}
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
            Overall Compliance Score
          </Typography>
          <Typography variant="h6" fontWeight={600} color="primary.main">
            {averageScore.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={averageScore}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.palette.grey[200],
            "& .MuiLinearProgress-bar": {
              borderRadius: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          }}
        />
      </Box>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
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
              sx={{ fontSize: 24, color: theme.palette.success.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="success.main">
              {compliantTeams}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Compliant Teams
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
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
              sx={{ fontSize: 24, color: theme.palette.error.main, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700} color="error.main">
              {atRiskTeams}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              At Risk
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Risk Alert */}
      {atRiskTeams > 0 && (
        <Alert
          severity={atRiskTeams > 3 ? "error" : "warning"}
          sx={{ mb: 3 }}
          icon={atRiskTeams > 3 ? <Error /> : <Warning />}
        >
          {atRiskTeams > 3
            ? `Critical: ${atRiskTeams} teams have compliance scores below 60%`
            : `Warning: ${atRiskTeams} team(s) require immediate attention`}
        </Alert>
      )}

      {/* Team Scores */}
      <Box>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Team Compliance Scores
        </Typography>
        <List
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            p: 0,
          }}
        >
          {scores.map((score, index) => (
            <Box key={score.owner}>
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
                  <Box sx={{ mr: 2 }}>{getScoreIcon(score.score)}</Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                    >
                      {score.owner}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <LinearProgress
                        variant="determinate"
                        value={score.score}
                        sx={{
                          flexGrow: 1,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.palette.grey[200],
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ minWidth: 40 }}
                      >
                        {score.score}%
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    icon={
                      score.trend === "up" ? <TrendingUp /> : <TrendingDown />
                    }
                    label={score.trend === "up" ? "Improving" : "Declining"}
                    color={score.trend === "up" ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                    sx={{ height: 24, fontSize: "0.7rem" }}
                  />
                </Box>
              </ListItem>
              {index < scores.length - 1 && (
                <Box
                  sx={{
                    mx: 2,
                    height: 1,
                    backgroundColor: theme.palette.divider,
                  }}
                />
              )}
            </Box>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default ComplianceReadinessScore;
