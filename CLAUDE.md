# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app (served on port 8501)
streamlit run streamlit_app.py

# Format code
black .

# Lint
pylint modules/

# Type check
mypy .

# Run tests
pytest

# Run a single test
pytest tests/path/to/test_file.py::test_function_name
```

## Architecture

This is a [Streamlit](https://docs.streamlit.io/) application. The entry point is `streamlit_app.py`. As the app grows, the intended structure is:

- `streamlit_app.py` — main entry point
- `pages/` — additional pages for a multi-page Streamlit app
- `modules/` — reusable business logic, kept separate from UI code
- `tests/` — pytest test suite

## Code Style

- **Formatter**: Black (88-char line length)
- **Linter**: pylint
- **Type checker**: mypy
- **Python**: 3.8+, with type hints on function signatures

Import order: standard library → third-party → local.

## Streamlit Patterns

- Use `@st.cache_data` for expensive computations
- Keep state management simple; prefer `st.session_state` for cross-rerun state
- Separate UI rendering from business logic (UI in `streamlit_app.py`/`pages/`, logic in `modules/`)
- Use containers and columns for layout organization
