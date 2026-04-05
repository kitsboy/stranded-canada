#!/bin/bash
# Run this on: Umbrel terminal (umbrel@umbrel:~$)
# Purpose: Deploy stranded.giveabit.io to Cloudflare Pages
# Risk: safe

set -e

echo "🚀 Deploying stranded.giveabit.io..."
cd /data/.openclaw/workspace/stranded-canada

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "📤 Deploying to Cloudflare Pages..."
wrangler pages deploy ./out --project-name=stranded-canada

echo "✅ Deployed!"
