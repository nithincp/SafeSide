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
  const [suggestedVersion, setSuggestedVersion] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCves([]);
    setSuggestedVersion('');
    setMessage('');

    try {
      // Connect to Django backend API
      const response = await fetch('http://localhost:8000/api/check_cve/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          library: library,
          version: version,
          ecosystem: ecosystem
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.cves) {
        setCves(data.cves);
        setSuggestedVersion(data.suggested_non_vulnerable_version || '');
        setMessage(data.message || '');
      } else if (data.message) {
        setMessage(data.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please check if the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (cveId) => {
    // You can implement severity detection based on CVE ID or other criteria
    // For now, using a simple color scheme
    return '#dc3545'; // Red for all CVEs
  };

  const formatReferences = (references) => {
    if (!references || !Array.isArray(references)) return [];
    
    return references.map((ref, index) => ({
      id: index,
      type: ref.type || 'WEB',
      url: ref.url,
      displayName: ref.type === 'ADVISORY' ? 'Security Advisory' : 
                   ref.type === 'WEB' ? 'Web Reference' :
                   ref.type === 'PACKAGE' ? 'Package Repository' : ref.type
    }));
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
        {message && (
          <div className="pv-message">
            <h3>{message}</h3>
            {suggestedVersion && (
              <div className="pv-suggested-version">
                <strong>Recommended Action:</strong> Upgrade to version {suggestedVersion} or later
              </div>
            )}
          </div>
        )}
        
        {cves.length > 0 && (
          <div>
            <h2 className="pv-results-title">Found {cves.length} CVE{cves.length !== 1 ? 's' : ''}</h2>
            <ul className="pv-cve-list">
              {cves.map((cve, idx) => (
                <li className="pv-cve-card" key={cve.id || idx}>
                  <div className="pv-cve-header">
                    <span className="pv-cve-id">{cve.id}</span>
                    <span
                      className="pv-cve-severity"
                      style={{ backgroundColor: getSeverityColor(cve.id) }}
                    >
                      VULNERABLE
                    </span>
                  </div>
                  
                  <div className="pv-cve-summary">{cve.summary}</div>
                  
                  {cve.details && (
                    <div className="pv-cve-details">
                      <strong>Details:</strong>
                      <div className="pv-cve-details-content">
                        {cve.details.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cve.references && cve.references.length > 0 && (
                    <div className="pv-cve-refs">
                      <strong>References:</strong>
                      <ul className="pv-refs-list">
                        {formatReferences(cve.references).map((ref) => (
                          <li key={ref.id} className="pv-ref-item">
                            <span className="pv-ref-type">{ref.displayName}:</span>
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="pv-ref-link"
                            >
                              {ref.url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {cves.length === 0 && !loading && !error && message && (
          <div className="pv-no-cves">
            <div className="pv-success-icon">✅</div>
            <h3>No vulnerabilities found!</h3>
            <p>{message}</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default PackageVetting;
