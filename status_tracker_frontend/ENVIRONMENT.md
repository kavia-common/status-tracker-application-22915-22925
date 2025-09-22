Environment variables

- FRONTEND_API_BASE_URL: Base URL for backend API (e.g. http://localhost:3001). The deployment orchestrator should expose this into window.__APP_API_BASE_URL__ at runtime or configure a proxy.

Notes
- Do not hardcode secrets or URLs; use environment setup provided by the orchestrator.
- The Angular app uses HttpClient and an auth interceptor to send Bearer token.
