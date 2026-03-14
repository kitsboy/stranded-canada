# Stranded Canada — Build Status
> Last updated: 2026-03-10 21:30 UTC

## Status: READY TO INSTALL ON HOST

All source files have been written. Install must run on Umbrel host 
(npm runs on host, not in OpenClaw container).

## Files Written ✅

```
/data/.openclaw/workspace/sites/tools-giveabit-io/stranded/
├── package.json              ✅ (dev/start scripts use port 3003)
├── next.config.js            ✅
├── tailwind.config.ts        ✅
├── tsconfig.json             ✅
├── postcss.config.js         ✅
└── app/
    ├── globals.css           ✅
    ├── layout.tsx            ✅
    ├── page.tsx              ✅ (password gate + map)
    ├── components/
    │   ├── PasswordGate.tsx  ✅ (password: btcg1ves2026)
    │   └── MapComponent.tsx  ✅ (Leaflet map, layers control)
    └── data/
        └── sites.ts          ✅ (25 demo sites: 10 BC, 10 AB, 2 SK, 2 MB, 1 ON)

```

## Host Path

Container path: /data/.openclaw/workspace/sites/tools-giveabit-io/stranded/
Host path:      /home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tools-giveabit-io/stranded/

## Commands to Run on Host (when Cam returns)

```bash
# Navigate to host path
cd /home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tools-giveabit-io/stranded

# Install dependencies
npm install

# Start on port 3003
PORT=3003 npm run dev &
```

## Then add to nginx

```bash
sudo nano /etc/nginx/sites-available/tools-giveabit
```

Add inside server block (before location /):
```nginx
location /stranded {
    proxy_pass http://localhost:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    rewrite ^/stranded(/.*)$ $1 break;
    rewrite ^/stranded$ / break;
}
```

Then: sudo systemctl restart nginx

## Features

- 🔐 Password gate (btcg1ves2026)
- 🗺️ Leaflet map centered on Canada
- 📍 25 demo sites (grey markers, orange border)
- 🔲 Layer controls (OpenStreetMap + Satellite base layers)
- 📋 Click markers for site details panel
- 🌙 Dark theme (midnight #1e293b)
- 📱 Responsive layout
- 🏷️ GiveAbit branding (orange #FF8C00, teal #5BC0BE)

## Password
btcg1ves2026

## What's Left (Phase 2)
- Power grid overlay layer
- Internet coverage overlay
- ROI calculator (simple + complex mode)
- Real data from GHGSat/MethaneSAT
- Contributor form
