# Agents Directory Structure

```
agents/
├── assistants/       # Agent implementations
│   ├── __init__.py
│   └── agent.py      # Assistant agent class
├── config/           # Configuration settings
│   ├── __init__.py
│   └── settings.py   # Configuration class
├── services/         # Business logic services
│   └── __init__.py
├── tests/            # Test files
│   └── __init__.py
├── utils/            # Utility functions
│   └── __init__.py
├── server.py         # LiveKit server entry point
├── Dockerfile        # Docker configuration
└── pyproject.toml    # Project configuration
```

## Organization

- **assistants/**: Agent class implementations
- **config/**: Configuration and settings
- **services/**: Business logic and service layer
- **tests/**: Unit and integration tests
- **utils/**: Helper functions and utilities

