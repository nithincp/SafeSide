import React from "react";
import {
  Grid,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import RiskOverviewPanel from "./dashboard/RiskOverviewPanel";
import CloudMisconfigurationHeatmap from "./dashboard/CloudMisconfigurationHeatmap";
import PackageVettingSummary from "./dashboard/PackageVettingSummary";
import SecretsHygieneTracker from "./dashboard/SecretsHygieneTracker";
import IamRiskAnalyzer from "./dashboard/IamRiskAnalyzer";
import SlackAlertSummary from "./dashboard/SlackAlertSummary";
import SecurityEventAnomalyFeed from "./dashboard/SecurityEventAnomalyFeed";
import ComplianceReadinessScore from "./dashboard/ComplianceReadinessScore";
import ShadowItDetector from "./dashboard/ShadowItDetector";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{ width: "100%", maxWidth: "100% !important" }}
      >
        {/* Dashboard Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Security Dashboard
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400 }}
          >
            Comprehensive security monitoring and risk assessment
          </Typography>
        </Box>

        {/* Dashboard Grid */}
        <Grid container spacing={3} sx={{ width: "100%" }}>
          {/* First Row - Risk Overview, Cloud Misconfiguration, and Secrets Hygiene */}
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ minWidth: 0 }}>
            <RiskOverviewPanel />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ minWidth: 0 }}>
            <CloudMisconfigurationHeatmap />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ minWidth: 0 }}>
            <SecretsHygieneTracker />
          </Grid>

          {/* Second Row - Package Vetting Summary (Full Width) */}
          <Grid item xs={12}>
            <PackageVettingSummary />
          </Grid>

          {/* Third Row - IAM Risk Analyzer (Full Width) */}
          <Grid item xs={12}>
            <IamRiskAnalyzer />
          </Grid>

          {/* Fourth Row - Security Event Anomaly Feed and Compliance Readiness Score */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ minWidth: 0 }}>
            <SecurityEventAnomalyFeed />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ minWidth: 0 }}>
            <ComplianceReadinessScore />
          </Grid>

          {/* Fifth Row - Shadow IT Detector and Slack Alert Summary */}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ minWidth: 0 }}>
            <ShadowItDetector />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{ minWidth: 0 }}>
            <SlackAlertSummary />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
