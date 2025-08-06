#!/usr/bin/env python3
"""
Development startup script for SafeSide
This script helps you start both the Django backend and React frontend
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_command(command, cwd=None, shell=True):
    """Run a command and return the process"""
    print(f"Running: {command}")
    if cwd:
        print(f"Working directory: {cwd}")
    
    return subprocess.Popen(
        command,
        cwd=cwd,
        shell=shell,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

def check_dependencies():
    """Check if required dependencies are installed"""
    print("Checking dependencies...")
    
    # Check if Python and pip are available
    try:
        subprocess.run([sys.executable, "--version"], check=True, capture_output=True)
        print("✓ Python is available")
    except subprocess.CalledProcessError:
        print("✗ Python is not available")
        return False
    
    # Check if Node.js is available
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        print("✓ Node.js is available")
    except subprocess.CalledProcessError:
        print("✗ Node.js is not available")
        return False
    
    # Check if npm is available
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        print("✓ npm is available")
    except subprocess.CalledProcessError:
        print("✗ npm is not available")
        return False
    
    return True

def setup_backend():
    """Set up the Django backend"""
    print("\n=== Setting up Django Backend ===")
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("✗ Backend directory not found")
        return False
    
    # Check if virtual environment exists
    venv_dir = backend_dir / "venv"
    if not venv_dir.exists():
        print("Creating virtual environment...")
        run_command(f"{sys.executable} -m venv venv", cwd=backend_dir)
    
    # Install dependencies
    print("Installing Python dependencies...")
    if os.name == 'nt':  # Windows
        pip_cmd = "venv\\Scripts\\pip"
    else:  # Unix/Linux/Mac
        pip_cmd = "venv/bin/pip"
    
    run_command(f"{pip_cmd} install -r requirements.txt", cwd=backend_dir)
    
    # Run migrations
    print("Running Django migrations...")
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    run_command(f"{python_cmd} manage.py migrate", cwd=backend_dir)
    
    return True

def setup_frontend():
    """Set up the React frontend"""
    print("\n=== Setting up React Frontend ===")
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("✗ Frontend directory not found")
        return False
    
    # Install npm dependencies
    print("Installing npm dependencies...")
    run_command("npm install", cwd=frontend_dir)
    
    return True

def start_servers():
    """Start both development servers"""
    print("\n=== Starting Development Servers ===")
    
    backend_dir = Path("backend")
    frontend_dir = Path("frontend")
    
    # Start Django backend
    print("Starting Django backend on http://localhost:8000")
    if os.name == 'nt':  # Windows
        python_cmd = "venv\\Scripts\\python"
    else:  # Unix/Linux/Mac
        python_cmd = "venv/bin/python"
    
    backend_process = run_command(f"{python_cmd} manage.py runserver", cwd=backend_dir)
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start React frontend
    print("Starting React frontend on http://localhost:3000")
    frontend_process = run_command("npm start", cwd=frontend_dir)
    
    print("\n=== Development servers are running ===")
    print("Backend: http://localhost:8000")
    print("Frontend: http://localhost:3000")
    print("API Health Check: http://localhost:8000/api/health/")
    print("\nPress Ctrl+C to stop both servers")
    
    try:
        # Wait for both processes
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nStopping servers...")
        backend_process.terminate()
        frontend_process.terminate()
        print("Servers stopped")

def main():
    """Main function"""
    print("SafeSide Development Setup")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        print("\nPlease install the missing dependencies and try again.")
        return
    
    # Set up backend
    if not setup_backend():
        print("\nBackend setup failed. Please check the errors above.")
        return
    
    # Set up frontend
    if not setup_frontend():
        print("\nFrontend setup failed. Please check the errors above.")
        return
    
    # Start servers
    start_servers()

if __name__ == "__main__":
    main() 