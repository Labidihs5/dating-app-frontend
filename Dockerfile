FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 python3-pip curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json backend/
RUN cd backend && npm ci --omit=dev

COPY backend-python/requirements.txt backend-python/
RUN pip3 install --no-cache-dir -r backend-python/requirements.txt

COPY backend backend
COPY backend-python backend-python
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV NODE_ENV=production \
  PORT=8000 \
  PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:8000/health || exit 1

CMD ["/app/start.sh"]
