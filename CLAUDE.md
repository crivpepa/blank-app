# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Streamlit blank-app template — a starting point for a Python web app. The entire application currently lives in a single file, `streamlit_app.py`, and `streamlit` is the only runtime dependency (`requirements.txt`).

## Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app (serves on http://localhost:8501)
streamlit run streamlit_app.py
```

The devcontainer (and Codespaces) launches the app with CORS and XSRF protection disabled so the forwarded-port preview works:

```bash
streamlit run streamlit_app.py --server.enableCORS false --server.enableXsrfProtection false
```

### Linting, formatting, and tests

`.claude/rules.md` and `.claude/config.json` define the intended toolchain — Black (88-char line length), pylint, mypy, and pytest — but **none of these are in `requirements.txt`**, so install them before use:

```bash
pip install black pylint mypy pytest

black .                              # format
pylint modules/                      # lint
mypy .                               # type-check
pytest                               # run all tests
pytest tests/test_x.py::test_name    # run a single test
```

## Architecture

Streamlit reruns the script top-to-bottom on every user interaction, so `streamlit_app.py` is simultaneously the entry point and the UI definition. There is no build step.

The structure described in `.claude/rules.md` is a **target layout that does not exist yet** — only `streamlit_app.py` is present. When the codebase grows, follow that convention:

- `pages/` — files placed here are auto-discovered by Streamlit and become navigable pages (the multi-page app convention).
- `modules/` — reusable, importable business logic kept separate from the UI.
- `.streamlit/config.toml` — Streamlit configuration.
- `tests/` — pytest suite.

Key Streamlit practices from the rules: keep UI separate from business logic, wrap expensive computations in `@st.cache_data`, and keep session state simple.
