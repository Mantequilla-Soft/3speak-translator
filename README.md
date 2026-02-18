# 3Speak Translator

Translation and subtitle services for 3speak.tv, powered by [LibreTranslate](https://libretranslate.com/) and a custom subtitle API.

## Overview

Two Docker services:

- **LibreTranslate** (port 5000) — self-hosted translation for comment sections across the 3speak.tv frontend. Supports 34 languages with automatic source language detection.
- **Subtitle API** (port 3300) — lightweight Node.js service that queries MongoDB for available video subtitles by author/permlink.

## Requirements

- Docker & Docker Compose
- ~5 GB RAM (for language models)
- ~3 GB disk (models are downloaded on first start and persisted in a Docker volume)
- MongoDB connection (for subtitle API)

## Quick Start

```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
docker compose up -d
```

First startup takes a few minutes while language models download. Subsequent starts are instant.

## Test

```bash
# Translation
curl -X POST http://localhost:5000/translate \
  -H 'Content-Type: application/json' \
  -d '{"q":"Hello world","source":"en","target":"de","format":"text"}'

# Subtitles
curl http://localhost:3300/subtitles/cryptomorfosis/f353d7b5
```

## Supported Languages

English, Chinese, Hindi, Spanish, French, Arabic, Bengali, Portuguese, Russian, Japanese, German, Korean, Italian, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian, Ukrainian, Swedish, Czech, Greek, Hungarian, Finnish, Danish, Romanian, Hebrew, Persian, Tagalog, Malay, Bulgarian, Norwegian, Urdu

## API

### LibreTranslate (port 5000)

- `POST /translate` - Translate text
- `GET /languages` - List available languages
- `POST /detect` - Detect language of text

See [LibreTranslate API docs](https://libretranslate.com/docs/) for full reference.

### Subtitle API (port 3300)

- `GET /subtitles/:author/:permlink` - Get available subtitles for a video
- `GET /health` - Health check

**Example:**
```bash
curl http://localhost:3300/subtitles/cryptomorfosis/f353d7b5
```

Response:
```json
[
  { "lang": "en", "cid": "QmZw3G6RKvRu2PiKBHErXHmhYiWCYoySBNXFeUojxvzUNh" },
  { "lang": "es", "cid": "Qma4MA9AUDrPsykwGfukWzzohq5pfkagNkFUdbNG8xqz3n" }
]
```

Returns `404` if no subtitles exist for the given author/permlink.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `LT_LOAD_ONLY` | 34 languages | Comma-separated language codes to load |
| `LT_API_KEYS` | `false` | Require API keys (disabled for local use) |
| `MONGODB_URI` | — | MongoDB connection string (required for subtitle API) |
| `DATABASE_NAME` | `threespeak` | MongoDB database name |
| `COLLECTION_NAME` | `subtitles` | MongoDB collection name |
| `API_PORT` | `3300` | Port for the subtitle API |

## Nginx Setup

An example nginx config is provided in [nginx/translator.conf.example](nginx/translator.conf.example).

To set it up on your server:

```bash
# Copy and rename with your domain
sudo cp nginx/translator.conf.example /etc/nginx/sites-available/translator.yourdomain.com

# Edit the file and replace translator.example.com with your domain
sudo nano /etc/nginx/sites-available/translator.yourdomain.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/translator.yourdomain.com /etc/nginx/sites-enabled/

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

# Obtain SSL certificate
sudo certbot --nginx -d translator.yourdomain.com
```

The 3speak.tv frontend connects via the `VITE_TRANSLATE_API_URL` environment variable.

## Monitoring

```bash
docker compose ps
docker logs -f 3speak-translate
docker logs -f 3speak-subtitle-api
```
