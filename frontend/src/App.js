import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import NavigationBar from "./components/NavigationBar";
import LandingPage from "./components/LandingPage";
import PackageVetting from "./modules/PackageVetting";
import SecretsHygiene from "./modules/SecretsHygiene";
import CloudMisconfiguration from "./modules/CloudMisconfiguration";
import IamAnalyzer from "./modules/IamAnalyzer";
import AnomalyDetector from "./modules/AnomalyDetector";
import ComplianceDashboard from "./modules/ComplianceDashboard";
import ShadowItDetector from "./modules/ShadowItDetector";
import SearchBar from "./components/SearchBar";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

// Material-UI theme component that uses our custom theme context
const MuiThemeWrapper = ({ children }) => {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      background: {
        default: theme === "dark" ? "#0f172a" : "#ffffff",
        paper: theme === "dark" ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: theme === "dark" ? "#f8fafc" : "#1e293b",
        secondary: theme === "dark" ? "#cbd5e1" : "#64748b",
      },
      primary: {
        main: "#667eea",
      },
      secondary: {
        main: "#764ba2",
      },
      divider: theme === "dark" ? "#475569" : "#e2e8f0",
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <Router>
          <div>
            <NavigationBar />
            <SearchBar />
            <Container className="mt-4">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/package-vetting" element={<PackageVetting />} />
                <Route path="/secrets-hygiene" element={<SecretsHygiene />} />
                <Route
                  path="/cloud-misconfiguration"
                  element={<CloudMisconfiguration />}
                />
                <Route path="/iam-analyzer" element={<IamAnalyzer />} />
                <Route path="/anomaly-detector" element={<AnomalyDetector />} />
                <Route
                  path="/compliance-dashboard"
                  element={<ComplianceDashboard />}
                />
                <Route
                  path="/shadow-it-detector"
                  element={<ShadowItDetector />}
                />
              </Routes>
            </Container>
          </div>
        </Router>
      </MuiThemeWrapper>
    </ThemeProvider>
  );
}

export default App;
