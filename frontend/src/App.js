import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import LandingPage from './components/LandingPage';
import PackageVetting from './modules/PackageVetting';
import SecretsHygiene from './modules/SecretsHygiene';
import CloudMisconfiguration from './modules/CloudMisconfiguration';
import IamAnalyzer from './modules/IamAnalyzer';
import AnomalyDetector from './modules/AnomalyDetector';
import ComplianceDashboard from './modules/ComplianceDashboard';
import ShadowItDetector from './modules/ShadowItDetector';
import SearchBar from './components/SearchBar';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div>
          <NavigationBar />
          <SearchBar />
          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/package-vetting" element={<PackageVetting />} />
              <Route path="/secrets-hygiene" element={<SecretsHygiene />} />
              <Route path="/cloud-misconfiguration" element={<CloudMisconfiguration />} />
              <Route path="/iam-analyzer" element={<IamAnalyzer />} />
              <Route path="/anomaly-detector" element={<AnomalyDetector />} />
              <Route path="/compliance-dashboard" element={<ComplianceDashboard />} />
              <Route path="/shadow-it-detector" element={<ShadowItDetector />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
