# RAG Chat Storage Microservice

A production-ready backend microservice for storing and managing chat histories from RAG-based chatbot systems.

## Features

- **Session Management**: Create, rename, favorite, and delete chat sessions
- **Message Storage**: Store messages with sender, content, and optional context
- **Security**: API key authentication and rate limiting
- **Production Ready**: Logging, error handling, health checks
- **Documentation**: Swagger/OpenAPI documentation
- **Containerized**: Docker and Docker Compose setup

## Quick Start

### Using Docker Compose (Recommended)

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. Update the API key in `.env` or `docker-compose.yml`
4. Start the services:
   ```bash
   docker-compose up -d
   ```

The API will be available at `http://localhost:3000`

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up PostgreSQL database and update `.env` file

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Sessions
- `POST /api/sessions` - Create a new chat session
- `PUT /api/sessions/:id` - Update session (rename/favorite)
- `DELETE /api/sessions/:id` - Delete session and all messages

### Messages
- `POST /api/sessions/:sessionId/messages` - Add message to session
- `GET /api/sessions/:sessionId/messages` - Get session messages (with pagination)

### Health & Documentation
- `GET /health` - Health check endpoint
- `GET /api-docs` - Swagger API documentation

## Authentication

All API endpoints require an API key in the `x-api-key` header:

```bash
curl -H "x-api-key: your-secret-api-key-here" http://localhost:3000/api/sessions
```

## Example Usage

### Create a Session
```bash
curl -X POST http://localhost:3000/api/sessions \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-here" \
  -d '{"name": "My Chat Session"}'
```

### Add a Message
```bash
curl -X POST http://localhost:3000/api/sessions/1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key-here" \
  -d '{
    "sender": "user",
    "content": "Hello, how can you help me?",
    "context": {"source": "document.pdf", "page": 1}
  }'
```

### Get Messages
```bash
curl "http://localhost:3000/api/sessions/1/messages?limit=10&offset=0" \
  -H "x-api-key: your-secret-api-key-here"
```

## Database Management

Access Adminer (database management tool) at `http://localhost:8080`:
- Server: `postgres`
- Username: `postgres`
- Password: `password`
- Database: `rag_chat_db`

## Environment Variables

See `.env.example` for all required environment variables.

## Testing

Run tests:
```bash
npm test
```

## Rate Limiting

Default: 100 requests per 15 minutes per IP address. Configure via environment variables.

## Logging

Centralized logging with Winston. Logs include timestamps, request details, and error stack traces.