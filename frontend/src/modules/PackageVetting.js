import React, { useState } from 'react';
import './PackageVetting.css';

const ecosystems = [
  { value: 'npm', label: 'npm (JavaScript/Node.js)' },
  { value: 'python', label: 'PyPI (Python)' },
  { value: 'java', label: 'Maven (Java)' },
  { value: 'dotnet', label: 'NuGet (.NET)' },
];

const PackageVetting = () => {
  const [library, setLibrary] = useState('');
  const [version, setVersion] = useState('');
  const [ecosystem, setEcosystem] = useState('npm');
  const [cves, setCves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCves([]);
    try {
      console.log("Sending request to backend");
      console.log(library, version, ecosystem);
      // Connect to Django backend API
      const response = await fetch(`http://localhost:8000/api/check_cve/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          library: library.trim(),
          version: version.trim(),
          ecosystem,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setCves(data.cves || []);
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <main className="pv-container">
      <header className="pv-header">
        <h1>Package Vulnerability Checker</h1>
        <p>Enter a library, version, and ecosystem to check for reported CVEs and explanations.</p>
      </header>
      <section className="pv-form-section">
        <form className="pv-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="pv-form-group">
            <label htmlFor="pv-library">Library Name</label>
            <input
              id="pv-library"
              className="pv-input"
              type="text"
              value={library}
              onChange={e => setLibrary(e.target.value)}
              placeholder="e.g. lodash"
              required
            />
          </div>
          <div className="pv-form-group">
            <label htmlFor="pv-version">Version</label>
            <input
              id="pv-version"
              className="pv-input"
              type="text"
              value={version}
              onChange={e => setVersion(e.target.value)}
              placeholder="e.g. 4.17.21"
              required
            />
          </div>
          <div className="pv-form-group">
            <label htmlFor="pv-ecosystem">Ecosystem</label>
            <select
              id="pv-ecosystem"
              className="pv-select"
              value={ecosystem}
              onChange={e => setEcosystem(e.target.value)}
            >
              {ecosystems.map(ec => (
                <option key={ec.value} value={ec.value}>{ec.label}</option>
              ))}
            </select>
          </div>
          <button className="pv-submit" type="submit" disabled={loading}>
            {loading ? <span className="pv-spinner"></span> : 'Check CVEs'}
          </button>
        </form>
        {error && <div className="pv-error">{error}</div>}
      </section>
      <section className="pv-results">
        {cves.length > 0 && (
          <div>
            <h2 className="pv-results-title">Reported CVEs</h2>
            <ul className="pv-cve-list">
              {cves.map((cve, idx) => (
                <li className="pv-cve-card" key={cve.id || idx}>
                  <div className="pv-cve-header">
                    <span className="pv-cve-id">{cve.id}</span>
                    {cve.severity && (
                      <span
                        className="pv-cve-severity"
                        style={{ backgroundColor: getSeverityColor(cve.severity) }}
                      >
                        {cve.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="pv-cve-summary">{cve.summary}</div>
                  <div className="pv-cve-explanation">
                    <strong>Explanation:</strong>
                    <span>{cve.explanation}</span>
                  </div>
                  {cve.references && cve.references.length > 0 && (
                    <div className="pv-cve-refs">
                      <strong>References:</strong>
                      <ul>
                        {cve.references.map((ref, i) => (
                          <li key={i}><a href={ref} target="_blank" rel="noopener noreferrer">{ref}</a></li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {cves.length === 0 && !loading && !error && (
          <div className="pv-no-cves">No CVEs found for the specified package/version.</div>
        )}
      </section>
    </main>
  );
};

export default PackageVetting;
