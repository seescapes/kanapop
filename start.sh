#!/usr/bin/env bash
cd "$(dirname "$0")"
URL="http://localhost:8000"
echo "================================================"
echo "  🫧 KanaPop - Hiragana & Katakana Web App"
echo "================================================"

# A server is already running on port 8000 (e.g. from an earlier run): just open it
if curl -s -o /dev/null "$URL"; then
  echo "Already running at: $URL"
  open "$URL"
  exit 0
fi

echo "Starting local server at: $URL"
echo "Opening your default browser... (Ctrl+C to stop)"
(sleep 1 && open "$URL") &
python3 -m http.server 8000
