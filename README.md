# 3Speak Translator

Local translation service for 3speak.tv comments, powered by [LibreTranslate](https://libretranslate.com/).

## Overview

Runs LibreTranslate in Docker to provide free, self-hosted translation for comment sections across the 3speak.tv frontend (watch page, shorts, reaction panel). Supports 34 languages with automatic source language detection.

## Requirements

- Docker & Docker Compose
- ~5 GB RAM (for language models)
- ~3 GB disk (models are downloaded on first start and persisted in a Docker volume)

## Quick Start

```bash
docker compose up -d
```

First startup takes a few minutes while language models download. Subsequent starts are instant.

## Test

```bash
curl -X POST https://3speak-translator.okinoko.io/translate \
  -H 'Content-Type: application/json' \
  -d '{"q":"Hello world","source":"en","target":"de","format":"text"}'
```

## Supported Languages

English, Chinese, Hindi, Spanish, French, Arabic, Bengali, Portuguese, Russian, Japanese, German, Korean, Italian, Dutch, Polish, Turkish, Vietnamese, Thai, Indonesian, Ukrainian, Swedish, Czech, Greek, Hungarian, Finnish, Danish, Romanian, Hebrew, Persian, Tagalog, Malay, Bulgarian, Norwegian, Urdu

## API

LibreTranslate exposes a REST API on port 5000:

- `POST /translate` - Translate text
- `GET /languages` - List available languages
- `POST /detect` - Detect language of text

See [LibreTranslate API docs](https://libretranslate.com/docs/) for full reference.

## Configuration

| Variable | Default | Description |
|---|---|---|
| `LT_LOAD_ONLY` | 34 languages | Comma-separated language codes to load |
| `LT_API_KEYS` | `false` | Require API keys (disabled for local use) |

## Production

Exposed via nginx reverse proxy at `https://3speak-translator.okinoko.io` with Let's Encrypt SSL.

The 3speak.tv frontend connects via the `VITE_TRANSLATE_API_URL` environment variable.

## Monitoring

```bash
docker stats 3speak-translate
docker logs -f 3speak-translate
```
