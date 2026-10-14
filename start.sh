#!/usr/bin/env bash
cd "$(dirname "$0")"
echo "================================================"
echo "  🫧 KanaPop - Hiragana & Katakana Web App"
echo "================================================"
echo "Starting local server at: http://localhost:8000"
echo "Opening your default browser..."
(sleep 1 && open "http://localhost:8000") &
python3 -m http.server 8000
