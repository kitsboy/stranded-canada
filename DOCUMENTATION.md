# Stranded Canada Site - Documentation
> Last updated: March 12, 2026

## What This Is
Interactive map showing 2,611 real methane leak sites across Canada from Environment Canada data.
URL: https://tools.giveabit.io/stranded/
Password: `btcg1ves2026`

## File Locations

**Source Code:**
```
/home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tools-giveabit-io/stranded/
├── app/
│   ├── page.tsx              # Main page with password gate
│   ├── components/
│   │   ├── MapComponent.tsx  # Leaflet map display
│   │   ├── PasswordGate.tsx  # Login screen
│   │   └── SiteDetailsPanel.tsx
│   └── data/
│       ├── sites.ts          # TypeScript interface (small)
│       └── sites.json        # 2,611 sites data (1MB)
├── next.config.js            # Next.js config
└── package.json
```

**Data Source:**
- Original: `/research/methane-sites-all-provinces.geojson` (2,611 ECCC sites)
- Converted to: `app/data/sites.json` (1.1MB)

**Running Service:**
- Systemd service: `stranded.service`
- Port: 3003
- Process: `npm run dev` (Next.js dev server)
- Auto-restart: Yes (if crashes, systemd restarts it)

## How to Update Data (Future)

**If you get new methane data:**

1. Replace the data file:
```bash
# SSH to Umbrel, then:
cd /home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tools-giveabit-io/stranded

# Backup old data
cp app/data/sites.json app/data/sites.json.backup.$(date +%Y%m%d)

# Copy new data (must be same format)
cp /path/to/new/sites.json app/data/sites.json
```

2. Restart the service:
```bash
sudo systemctl restart stranded
```

3. Wait 30 seconds, refresh browser.

## Common Commands

**Check if site is running:**
```bash
sudo systemctl status stranded
```
Should show: `Active: active (running)` in green

**View logs (if broken):**
```bash
sudo journalctl -u stranded -f
```
Press Ctrl+C to exit

**Restart manually:**
```bash
sudo systemctl restart stranded
```

**Stop completely:**
```bash
sudo systemctl stop stranded
```

**Start on boot (already enabled):**
```bash
sudo systemctl enable stranded
```

## Troubleshooting

**Error: "Bad Gateway 502"**
- Service stopped. Fix: `sudo systemctl restart stranded`

**Error: "Port already in use"**
- Old process stuck. Fix: 
```bash
sudo fuser -k 3003/tcp
sudo systemctl restart stranded
```

**Data not updating after restart**
- Browser cache. Fix: Ctrl+Shift+R (hard refresh) or open incognito

**Site shows old "Demo" label**
- UI wasn't updated. Check `app/components/MapComponent.tsx` has "ECCC Verified Data" not "Demo Site"

## How It Works (Simple)

1. **nginx** (on your Umbrel) receives request at `tools.giveabit.io/stranded/`
2. **nginx** forwards to `localhost:3003` (the Next.js server)
3. **Next.js** serves the React app with Leaflet map
4. **Browser** loads `sites.json` (2,611 points) and displays markers
5. **Click marker** → shows popup with site details

## Cloudflare Tunnel

The site is exposed via Cloudflare tunnel (ID: 8ee77271-b9a6-4f44-a669-3db3f6a5251f)
- Tunnel config is on your Umbrel host
- nginx runs on port :8888
- Routes: `/stranded` → `localhost:3003`

If tunnel breaks:
```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
```

## Data Format (sites.json)

Each site looks like:
```json
{
  "id": "ec-0001",
  "name": "Keele Valley Landfill",
  "province": "ON",
  "region": "Maple",
  "lat": 43.8683,
  "lon": -79.4984,
  "emission_rate_kg_day": 56013,
  "co2e_tons_year": 572461,
  "source_type": "landfill",
  "status": "active",
  "data_quality": "regulatory",
  "distance_to_grid_km": 5.2,
  "internet_type": "fiber",
  "complexity_score": "hard",
  "recommended_approach": "Containerized miner setup",
  "funding_btc": 3.2,
  "confidence": "high"
}
```

**Fields:**
- `source_type`: landfill, wellhead, pipeline, industrial
- `data_quality`: regulatory (ECCC data), demo, satellite, field_verified
- `complexity_score`: easy, moderate, hard
- `internet_type`: fiber, cable, starlink, lte, none

## Remember

- Site auto-starts on boot ✓
- Site auto-restarts if crashes ✓
- Data file is 1.1MB with 2,611 sites
- Password: `btcg1ves2026`
- Last updated: March 12, 2026

**If all else fails:**
```bash
sudo systemctl restart stranded && sleep 5 && curl -s http://localhost:3003/ | head -1
```
