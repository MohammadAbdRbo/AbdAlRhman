#!/bin/bash

API="http://127.0.0.1:5000/api"

declare -A tests=(
  ["🔍 General Chat"]='{"username": "test_user", "task_data": {"prompt": "What is the capital of France?"}}'
  ["🧠 Reasoning Test"]='{"username": "test_user", "task_data": {"prompt": "If Alice is taller than Bob and Bob is taller than Charlie, who is the tallest?"}}'
  ["💻 Code Generation"]='{"username": "test_user", "task_data": {"prompt": "Write a Python function to calculate factorial."}}'
  ["🌐 Web Summarizer"]='{"url": "https://en.wikipedia.org/wiki/Artificial_intelligence"}'
  ["🕓 Time Context"]='{"username": "test_user", "task_data": {"prompt": "Remind me to call mom next Friday at 8pm."}}'
  ["🧠 Memory Recall"]='{"username": "test_user", "task_data": {"prompt": "What did I say earlier about Paris?"}}'
  ["🤖 Intent Detection"]='{"username": "test_user", "task_data": {"prompt": "Open YouTube please"}}'
  ["🎙️ TTS"]='{"username": "test_user", "task_data": {"prompt": "Hello, how are you?"}}'
)

declare -A endpoints=(
  ["🔍 General Chat"]="/station/ai"
  ["🧠 Reasoning Test"]="/station/ai"
  ["💻 Code Generation"]="/station/ai"
  ["🌐 Web Summarizer"]="/station/summarizer"
  ["🕓 Time Context"]="/station/time"
  ["🧠 Memory Recall"]="/station/memory"
  ["🤖 Intent Detection"]="/station/intent"
  ["🎙️ TTS"]="/station/tts"
)

echo "🧪 Starting test for Abd AlRhman Assistant..."
echo "--------------------------------------------"

for name in "${!tests[@]}"; do
  endpoint="${endpoints[$name]}"
  data="${tests[$name]}"
  echo -n "⏳ $name ... "
  response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$API$endpoint")
  if [[ $? -eq 0 ]]; then
    echo "✅ Success"
    echo "↪️  Response: $(echo $response | jq -r '.response // .summary // .status // .message // .error // .result // .output // .text')"
  else
    echo "❌ Failed"
  fi
  echo ""
done

echo "✅ Test complete."

