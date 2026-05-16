# Claude Code Rules for blank-app

## Code Style Guidelines

### Python Standards
- **PEP 8 Compliance**: All code must follow PEP 8 style guide
- **Line Length**: Maximum 88 characters (Black formatter standard)
- **Type Hints**: Use type hints for function signatures where possible
- **Docstrings**: Follow Google or NumPy docstring format

### Import Organization
```python
# Standard library imports
import os
import sys
from pathlib import Path

# Third-party imports
import streamlit as st
import pandas as pd

# Local imports
from modules import utils
```

## Project Structure

```
blank-app/
├── streamlit_app.py          # Main application entry point
├── requirements.txt          # Python dependencies
├── .streamlit/
│   └── config.toml          # Streamlit configuration
├── pages/                    # Multi-page app pages
├── modules/                  # Reusable modules
├── tests/                    # Test suite
└── docs/                     # Documentation
```

## Development Best Practices

### Git Workflow
- Use descriptive commit messages
- Create branches for features: `feature/feature-name`
- Create branches for fixes: `fix/issue-description`
- Keep commits atomic and focused

### Code Review
- Keep functions small and focused (< 50 lines)
- Add comments for complex logic
- Test edge cases and error conditions

### Streamlit-Specific
- Use `@st.cache_data` for expensive computations
- Keep state management simple
- Separate UI from business logic
- Use containers for layout organization

## Dependencies

### Required
- streamlit >= 1.0
- python >= 3.8

### Development
- pytest
- black
- pylint
- mypy

## Linting & Formatting

Run before committing:
```bash
# Format code
black .

# Check for style issues
pylint modules/

# Type checking
mypy .

# Run tests
pytest
```
