# SafeSide - Frontend-Backend Connection Setup

This guide will help you connect the React frontend to the Django backend for the Package Vetting feature.

## Prerequisites

- Python 3.8+ installed
- Node.js 14+ and npm installed
- Git (for version control)

## Quick Setup

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
python start_dev.py
```

This script will:
- Check dependencies
- Set up virtual environment
- Install Python and npm dependencies
- Start both servers

### Option 2: Manual Setup

#### 1. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

The Django backend will run on `http://localhost:8000`

#### 2. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The React frontend will run on `http://localhost:3000`

## API Endpoints

### CVE Lookup
- **URL**: `http://localhost:8000/api/cves/`
- **Method**: GET
- **Parameters**:
  - `library`: Library name (e.g., "lodash")
  - `version`: Version number (e.g., "4.17.21")
  - `ecosystem`: Package ecosystem (e.g., "npm", "pypi", "maven", "nuget")

### Health Check
- **URL**: `http://localhost:8000/api/health/`
- **Method**: GET

## Testing the Connection

1. Start both servers (backend on port 8000, frontend on port 3000)
2. Open `http://localhost:3000` in your browser
3. Navigate to the Package Vetting page
4. Enter a library name (try "lodash", "express", "react", or "requests")
5. Enter a version (any version will work with mock data)
6. Select an ecosystem
7. Click "Check CVEs"

## Mock Data

The backend currently returns mock CVE data for demonstration purposes. The following libraries have mock vulnerabilities:

- **lodash**: CVE-2021-23337 (High severity)
- **express**: CVE-2022-24999 (Medium severity)
- **react**: CVE-2022-21668 (High severity)
- **requests**: CVE-2021-33503 (Medium severity)

## Production Integration

To integrate with real CVE databases, replace the mock data in `backend/api/views.py` with calls to:

- **NVD (National Vulnerability Database)**: https://nvd.nist.gov/developers/vulnerabilities
- **OSS Index**: https://ossindex.sonatype.org/
- **GitHub Security Advisories**: https://docs.github.com/en/rest/security-advisories
- **Snyk Vulnerability Database**: https://snyk.io/vuln

## Troubleshooting

### CORS Issues
If you see CORS errors, ensure:
- Django CORS headers are properly configured in `backend/core/settings.py`
- The frontend is running on `http://localhost:3000`

### Connection Refused
If the frontend can't connect to the backend:
- Ensure Django server is running on port 8000
- Check that the API endpoint URL in `frontend/src/modules/PackageVetting.js` is correct
- Verify the backend is accessible at `http://localhost:8000/api/health/`

### Module Not Found Errors
If you see "No module named 'django'" or similar:
- Ensure you're in the virtual environment
- Run `pip install -r requirements.txt` again
- Check that all dependencies are installed

## Development Workflow

1. **Backend Changes**: Edit files in `backend/` directory
2. **Frontend Changes**: Edit files in `frontend/` directory
3. **API Changes**: Modify `backend/api/views.py` and `backend/api/urls.py`
4. **Database Changes**: Create migrations with `python manage.py makemigrations`

## File Structure

```
SafeSide/
├── backend/
│   ├── api/                 # API app
│   │   ├── views.py        # API endpoints
│   │   └── urls.py         # API URL routing
│   ├── core/               # Django project settings
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management
├── frontend/
│   ├── src/
│   │   └── modules/
│   │       ├── PackageVetting.js   # Main component
│   │       └── PackageVetting.css  # Styling
│   └── package.json       # Node.js dependencies
└── start_dev.py           # Automated setup script
``` 