#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="/app"
PY_DIR="$ROOT_DIR/backend-python"
NODE_DIR="$ROOT_DIR/backend"

cleanup() {
  if [[ -n "${PY_PID:-}" ]] && kill -0 "$PY_PID" 2>/dev/null; then
    kill "$PY_PID"
  fi
}

trap cleanup EXIT INT TERM

echo "Starting FastAPI on :8001..."
cd "$PY_DIR"
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8001 &
PY_PID=$!

echo "Waiting for FastAPI health..."
for i in {1..30}; do
  if curl -fsS "http://127.0.0.1:8001/health" > /dev/null; then
    echo "FastAPI is healthy."
    break
  fi
  sleep 1
  if ! kill -0 "$PY_PID" 2>/dev/null; then
    echo "FastAPI crashed."
    exit 1
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "FastAPI did not become healthy in time."
    exit 1
  fi
done

echo "Starting Node on :${PORT:-8000}..."
cd "$NODE_DIR"
exec node server.js
