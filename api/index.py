import sys
import os

# Add the root directory and backend directory to sys.path
root_dir = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, root_dir)
sys.path.insert(0, os.path.join(root_dir, 'backend'))

from app.main import app as api_app

# Vercel needs the app object to be named 'app'
app = api_app
