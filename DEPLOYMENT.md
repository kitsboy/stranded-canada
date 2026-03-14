# Stranded Canada — DEPLOYMENT STATUS
> Updated: March 14, 2026

## ✅ CURRENT STATUS: Code Pushed to GitHub

**GitHub Repo:** https://github.com/kitsboy/stranded-canada  
**Branch:** `main`  
**Last Commit:** SiteListPanel with fixed close button positioning

---

## TWO DEPLOYMENT OPTIONS

### Option 1: Cloudflare Pages (RECOMMENDED for auto-deploy)
**URL:** https://stranded-canada.pages.dev (or custom domain)

**Status:** Project exists but needs DNS change

**To activate:**
1. Change DNS: `tools.giveabit.io` CNAME → `stranded-canada.pages.dev`
2. Or: Create new DNS record `stranded.giveabit.io` → `stranded-canada.pages.dev`
3. Cloudflare will auto-build on every `git push`

**Build settings:**
- Framework: Next.js (static export)
- Build command: `npm run build`
- Output directory: `dist`

---

### Option 2: Umbrel Host + Systemd (CURRENT LIVE SETUP)
**URL:** https://tools.giveabit.io/stranded

**Architecture:**
```
Internet → Cloudflare Tunnel → nginx:8888 → localhost:3003
```

**To deploy updates:**
```bash
# On Umbrel host:
sudo systemctl restart stranded-canada
```

**Source location:**
- Container: `/data/.openclaw/workspace/sites/tools-giveabit-io/stranded/`
- Host: `/home/umbrel/umbrel/app-data/openclaw/data/.openclaw/workspace/sites/tools-giveabit-io/stranded/`

---

## FILES CHANGED (March 14, 2026)

### New Files:
- `app/components/SiteListPanel.tsx` — Collapsible site list with proper button spacing
- `.gitignore` — Standard Node.js ignore patterns

### Modified Files:
- `app/components/MapComponent.tsx` — Integrated SiteListPanel
- `package.json` — Added `lucide-react` dependency

---

## THE FIX: Close Button Position

**Problem:** Red X button was hidden behind the down arrow on expanded cards

**Solution:** Separate buttons with gap:
```
[Chevron ▾] [X ✕]
    ↑          ↑
 expand      close
```

**Code location:** `app/components/SiteListPanel.tsx` lines 85-105

---

## NEXT STEPS

### If using Cloudflare Pages:
1. Update DNS CNAME for `tools.giveabit.io`
2. Disable systemd service: `sudo systemctl stop stranded-canada`
3. Future deploys: Just `git push`

### If keeping current setup:
1. SSH to Umbrel
2. Run: `sudo systemctl restart stranded-canada`
3. Hard refresh browser: `Cmd+Shift+R`

---

## REPO INFO

```bash
# Clone
https://github.com/kitsboy/stranded-canada.git

# Branch
main

# Password
btcg1ves2026
```

---

**Note:** Both methods work. Pages = automatic, Host = full control.
