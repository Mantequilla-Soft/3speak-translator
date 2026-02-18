FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY api/package.json api/package-lock.json* ./

RUN npm ci --only=production 2>/dev/null || npm install --only=production

COPY api/src/ src/

ENV NODE_ENV=production
ENV API_PORT=3300

EXPOSE 3300

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3300/health || exit 1

CMD ["node", "src/index.js"]
