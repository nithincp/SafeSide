import React from 'react';
import { Container, Grid } from '@mui/material';
import RiskOverviewPanel from './dashboard/RiskOverviewPanel';
import CloudMisconfigurationHeatmap from './dashboard/CloudMisconfigurationHeatmap';
import PackageVettingSummary from './dashboard/PackageVettingSummary';
import SecretsHygieneTracker from './dashboard/SecretsHygieneTracker';
import IamRiskAnalyzer from './dashboard/IamRiskAnalyzer';
import SlackAlertSummary from './dashboard/SlackAlertSummary';
import SecurityEventAnomalyFeed from './dashboard/SecurityEventAnomalyFeed';
import ComplianceReadinessScore from './dashboard/ComplianceReadinessScore';
import ShadowItDetector from './dashboard/ShadowItDetector';

const Dashboard = () => {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RiskOverviewPanel />
        </Grid>
        <Grid item xs={12} md={8}>
          <CloudMisconfigurationHeatmap />
        </Grid>
        <Grid item xs={12} md={6}>
          <PackageVettingSummary />
        </Grid>
        <Grid item xs={12} md={6}>
          <SecretsHygieneTracker />
        </Grid>
        <Grid item xs={12}>
          <IamRiskAnalyzer />
        </Grid>
        <Grid item xs={12} md={6}>
          <SlackAlertSummary />
        </Grid>
        <Grid item xs={12} md={6}>
          <SecurityEventAnomalyFeed />
        </Grid>
        <Grid item xs={12} md={6}>
          <ComplianceReadinessScore />
        </Grid>
        <Grid item xs={12} md={6}>
          <ShadowItDetector />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
