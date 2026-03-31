// Site data
let sitesData = [];
let map;
let markers = [];

// Initialize
async function init() {
  await loadData();
  initMap();
  renderSites(sitesData);
  updateCalculator();
  setupEventListeners();
}

// Load data from JSON
async function loadData() {
  try {
    const response = await fetch('stranded-sites.json');
    const data = await response.json();
    sitesData = data.sites;
    updateStats(data.metadata);
  } catch (error) {
    console.error('Failed to load sites data:', error);
    sitesData = getFallbackData();
    updateStatsFallback();
  }
}

function getFallbackData() {
  return [
    {id: "sc-001", name: "Athabasca Gas Plant", province: "Alberta", latitude: 57.65, longitude: -111.58, type: "gas_processing", complexity: "high", methaneFlow: 1250, powerPotential: 4.2, co2Equivalent: 21800, capex: 8500000, btcPerYear: 52.3, breakEvenPrice: 28500},
    {id: "sc-002", name: "Lloydminster Flare Site", province: "Saskatchewan", latitude: 53.28, longitude: -110.01, type: "oil_battery", complexity: "medium", methaneFlow: 340, powerPotential: 1.1, co2Equivalent: 5900, capex: 2200000, btcPerYear: 13.5, breakEvenPrice: 26200},
    {id: "sc-003", name: "Fort Nelson Processing", province: "British Columbia", latitude: 58.81, longitude: -122.69, type: "gas_processing", complexity: "high", methaneFlow: 2100, powerPotential: 7.0, co2Equivalent: 36600, capex: 14200000, btcPerYear: 87.6, breakEvenPrice: 27200},
    {id: "sc-004", name: "Medicine Hat Vent", province: "Alberta", latitude: 50.04, longitude: -110.68, type: "oil_battery", complexity: "low", methaneFlow: 180, powerPotential: 0.6, co2Equivalent: 3100, capex: 1200000, btcPerYear: 7.5, breakEvenPrice: 28800},
    {id: "sc-005", name: "Grande Prairie Flare", province: "Alberta", latitude: 55.17, longitude: -118.79, type: "gas_flare", complexity: "medium", methaneFlow: 520, powerPotential: 1.7, co2Equivalent: 9000, capex: 3400000, btcPerYear: 21.2, breakEvenPrice: 27000},
    {id: "sc-006", name: "Estevan Oil Battery", province: "Saskatchewan", latitude: 49.14, longitude: -102.99, type: "oil_battery", complexity: "low", methaneFlow: 280, powerPotential: 0.9, co2Equivalent: 4900, capex: 1850000, btcPerYear: 11.4, breakEvenPrice: 26500},
    {id: "sc-007", name: "Dawson Creek Vent", province: "British Columbia", latitude: 55.76, longitude: -120.23, type: "gas_flare", complexity: "medium", methaneFlow: 680, powerPotential: 2.3, co2Equivalent: 11800, capex: 4600000, btcPerYear: 28.5, breakEvenPrice: 26800},
    {id: "sc-008", name: "Red Deer Gas Plant", province: "Alberta", latitude: 52.27, longitude: -113.81, type: "gas_processing", complexity: "high", methaneFlow: 1560, powerPotential: 5.2, co2Equivalent: 27200, capex: 10500000, btcPerYear: 65.2, breakEvenPrice: 27800},
    {id: "sc-009", name: "Kindersley Flare", province: "Saskatchewan", latitude: 51.47, longitude: -109.16, type: "gas_flare", complexity: "medium", methaneFlow: 420, powerPotential: 1.4, co2Equivalent: 7300, capex: 2800000, btcPerYear: 17.5, breakEvenPrice: 26400},
    {id: "sc-010", name: "Fort St John Battery", province: "British Columbia", latitude: 56.25, longitude: -120.85, type: "oil_battery", complexity: "medium", methaneFlow: 380, powerPotential: 1.3, co2Equivalent: 6600, capex: 2600000, btcPerYear: 16.2, breakEvenPrice: 27100},
    {id: "sc-011", name: "Peace River Vent", province: "Alberta", latitude: 56.23, longitude: -117.29, type: "gas_flare", complexity: "medium", methaneFlow: 590, powerPotential: 2.0, co2Equivalent: 10300, capex: 4000000, btcPerYear: 25.2, breakEvenPrice: 26900},
    {id: "sc-012", name: "Swift Current Battery", province: "Saskatchewan", latitude: 50.29, longitude: -107.80, type: "oil_battery", complexity: "low", methaneFlow: 220, powerPotential: 0.7, co2Equivalent: 3800, capex: 1450000, btcPerYear: 8.6, breakEvenPrice: 29000},
    {id: "sc-013", name: "Hinton Processing", province: "Alberta", latitude: 53.40, longitude: -117.58, type: "gas_processing", complexity: "high", methaneFlow: 1890, powerPotential: 6.3, co2Equivalent: 32900, capex: 12800000, btcPerYear: 78.5, breakEvenPrice: 27300},
    {id: "sc-014", name: "Whitecourt Flare", province: "Alberta", latitude: 54.14, longitude: -115.68, type: "gas_flare", complexity: "medium", methaneFlow: 480, powerPotential: 1.6, co2Equivalent: 8300, capex: 3200000, btcPerYear: 20.1, breakEvenPrice: 26600},
    {id: "sc-015", name: "Moose Jaw Vent", province: "Saskatchewan", latitude: 50.39, longitude: -105.55, type: "gas_flare", complexity: "low", methaneFlow: 190, powerPotential: 0.6, co2Equivalent: 3300, capex: 1250000, btcPerYear: 7.8, breakEvenPrice: 29200},
    {id: "sc-016", name: "Slave Lake Battery", province: "Alberta", latitude: 55.28, longitude: -114.77, type: "oil_battery", complexity: "medium", methaneFlow: 410, powerPotential: 1.4, co2Equivalent: 7100, capex: 2900000, btcPerYear: 18.1, breakEvenPrice: 26800},
    {id: "sc-017", name: "Weyburn Oil Field", province: "Saskatchewan", latitude: 49.67, longitude: -103.85, type: "oil_battery", complexity: "medium", methaneFlow: 350, powerPotential: 1.2, co2Equivalent: 6100, capex: 2400000, btcPerYear: 15.8, breakEvenPrice: 26700},
    {id: "sc-018", name: "Chetwynd Gas Site", province: "British Columbia", latitude: 55.70, longitude: -121.63, type: "gas_flare", complexity: "medium", methaneFlow: 540, powerPotential: 1.8, co2Equivalent: 9400, capex: 3600000, btcPerYear: 22.3, breakEvenPrice: 27000},
    {id: "sc-019", name: "Lac La Biche", province: "Alberta", latitude: 54.77, longitude: -111.98, type: "oil_battery", complexity: "low", methaneFlow: 260, powerPotential: 0.9, co2Equivalent: 4500, capex: 1700000, btcPerYear: 10.8, breakEvenPrice: 27200},
    {id: "sc-020", name: "Vermilion Vent", province: "Alberta", latitude: 53.35, longitude: -110.85, type: "gas_flare", complexity: "low", methaneFlow: 210, powerPotential: 0.7, co2Equivalent: 3600, capex: 1400000, btcPerYear: 8.9, breakEvenPrice: 27400},
    {id: "sc-021", name: "Melville Battery", province: "Saskatchewan", latitude: 50.93, longitude: -102.80, type: "oil_battery", complexity: "low", methaneFlow: 175, powerPotential: 0.6, co2Equivalent: 3000, capex: 1150000, btcPerYear: 7.2, breakEvenPrice: 28900},
    {id: "sc-022", name: "Tumbler Ridge", province: "British Columbia", latitude: 55.13, longitude: -120.99, type: "gas_flare", complexity: "high", methaneFlow: 780, powerPotential: 2.6, co2Equivalent: 13600, capex: 5200000, btcPerYear: 32.4, breakEvenPrice: 26900},
    {id: "sc-023", name: "Stettler Processing", province: "Alberta", latitude: 52.32, longitude: -112.72, type: "gas_processing", complexity: "high", methaneFlow: 1120, powerPotential: 3.7, co2Equivalent: 19500, capex: 7200000, btcPerYear: 45.8, breakEvenPrice: 27600},
    {id: "sc-024", name: "Humboldt Flare", province: "Saskatchewan", latitude: 52.20, longitude: -105.12, type: "gas_flare", complexity: "medium", methaneFlow: 390, powerPotential: 1.3, co2Equivalent: 6800, capex: 2550000, btcPerYear: 15.3, breakEvenPrice: 27100},
    {id: "sc-025", name: "Fort McMurray", province: "Alberta", latitude: 56.73, longitude: -111.38, type: "gas_processing", complexity: "high", methaneFlow: 2450, powerPotential: 8.2, co2Equivalent: 42700, capex: 16800000, btcPerYear: 102.4, breakEvenPrice: 27500},
    {id: "sc-026", name: "Kamloops Vent", province: "British Columbia", latitude: 50.67, longitude: -120.33, type: "oil_battery", complexity: "low", methaneFlow: 195, powerPotential: 0.65, co2Equivalent: 3400, capex: 1300000, btcPerYear: 8.1, breakEvenPrice: 28700}
  ];
}

function updateStats(metadata) {
  document.getElementById('stat-sites').textContent = metadata.totalSites;
  document.getElementById('stat-methane').textContent = (metadata.totalMethaneFlow / 1000).toFixed(1) + 'K';
  document.getElementById('stat-power').textContent = metadata.totalPowerPotential.toFixed(1);
  document.getElementById('stat-co2').textContent = (metadata.totalCo2Equivalent / 1000).toFixed(0) + 'K';
  document.getElementById('stat-btc').textContent = Math.round(metadata.totalBtcPerYear);
}

function updateStatsFallback() {
  const totalMethane = sitesData.reduce((sum, s) => sum + s.methaneFlow, 0);
  const totalPower = sitesData.reduce((sum, s) => sum + s.powerPotential, 0);
  const totalCo2 = sitesData.reduce((sum, s) => sum + s.co2Equivalent, 0);
  const totalBtc = sitesData.reduce((sum, s) => sum + s.btcPerYear, 0);
  
  document.getElementById('stat-sites').textContent = sitesData.length;
  document.getElementById('stat-methane').textContent = (totalMethane / 1000).toFixed(1) + 'K';
  document.getElementById('stat-power').textContent = totalPower.toFixed(1);
  document.getElementById('stat-co2').textContent = (totalCo2 / 1000).toFixed(0) + 'K';
  document.getElementById('stat-btc').textContent = Math.round(totalBtc);
}

// Initialize Leaflet map
function initMap() {
  map = L.map('map').setView([54.5, -110.0], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  addMarkers(sitesData);
}

function addMarkers(sites) {
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  sites.forEach(site => {
    const color = getComplexityColor(site.complexity);
    const marker = L.circleMarker([site.latitude, site.longitude], {
      radius: Math.max(6, site.powerPotential * 2),
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map);

    marker.bindPopup(createPopupContent(site));
    markers.push(marker);
  });
}

function getComplexityColor(complexity) {
  switch(complexity) {
    case 'low': return '#22c55e';
    case 'medium': return '#f59e0b';
    case 'high': return '#ef4444';
    default: return '#FF8C00';
  }
}

function createPopupContent(site) {
  return `
    <div class="site-popup">
      <span class="complexity-badge complexity-${site.complexity}">${site.complexity}</span>
      <h3>${site.name}</h3>
      <div class="province">${site.province} • ${site.type.replace('_', ' ')}</div>
      <div class="site-stats">
        <div class="site-stat">
          <div class="site-stat-value">${site.methaneFlow}</div>
          <div class="site-stat-label">m³/day</div>
        </div>
        <div class="site-stat">
          <div class="site-stat-value">${site.powerPotential}</div>
          <div class="site-stat-label">MW</div>
        </div>
        <div class="site-stat">
          <div class="site-stat-value">${(site.co2Equivalent/1000).toFixed(1)}K</div>
          <div class="site-stat-label">t CO₂e</div>
        </div>
        <div class="site-stat">
          <div class="site-stat-value">${site.btcPerYear}</div>
          <div class="site-stat-label">BTC/yr</div>
        </div>
      </div>
      <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #94a3b8;">
        CAPEX: $${(site.capex/1000000).toFixed(1)}M | Break-even: $${site.breakEvenPrice.toLocaleString()}
      </div>
    </div>
  `;
}

// Render site cards
function renderSites(sites) {
  const grid = document.getElementById('sites-grid');
  const count = document.getElementById('sites-count');
  
  grid.innerHTML = '';
  count.textContent = `Showing ${sites.length} sites`;

  sites.forEach(site => {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.innerHTML = `
      <div class="site-card-header">
        <div>
          <span class="complexity-badge complexity-${site.complexity}">${site.complexity}</span>
          <h3>${site.name}</h3>
          <div class="province">${site.province}</div>
        </div>
      </div>
      <div class="site-metrics">
        <div class="metric">
          <div class="metric-value">${site.methaneFlow}</div>
          <div class="metric-label">m³/day CH₄</div>
        </div>
        <div class="metric">
          <div class="metric-value">${site.powerPotential}</div>
          <div class="metric-label">MW Power</div>
        </div>
        <div class="metric">
          <div class="metric-value">${site.btcPerYear}</div>
          <div class="metric-label">BTC/year</div>
        </div>
      </div>
      <div class="site-card-footer">
        <div class="break-even">Break-even: <span>$${site.breakEvenPrice.toLocaleString()}</span></div>
        <div style="color: var(--gray); font-size: 0.875rem;">$${(site.capex/1000000).toFixed(1)}M CAPEX</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter functions
function filterSites() {
  const province = document.getElementById('province-filter').value;
  const complexity = document.getElementById('complexity-filter').value;
  const minPower = parseFloat(document.getElementById('power-filter').value);

  const filtered = sitesData.filter(site => {
    if (province !== 'all' && site.province !== province) return false;
    if (complexity !== 'all' && site.complexity !== complexity) return false;
    if (site.powerPotential < minPower) return false;
    return true;
  });

  addMarkers(filtered);
  renderSites(filtered);
}

function resetFilters() {
  document.getElementById('province-filter').value = 'all';
  document.getElementById('complexity-filter').value = 'all';
  document.getElementById('power-filter').value = 0;
  document.getElementById('power-value').textContent = '0 MW';
  filterSites();
}

// ROI Calculator
function updateCalculator() {
  const power = parseFloat(document.getElementById('calc-power').value);
  const cost = parseFloat(document.getElementById('calc-cost').value);
  const btcPrice = parseFloat(document.getElementById('calc-btc-price').value);
  const difficultyT = parseFloat(document.getElementById('calc-difficulty').value);
  const efficiency = parseFloat(document.getElementById('calc-efficiency').value);
  const capexPerMW = parseFloat(document.getElementById('calc-capex').value) * 1000000;

  const hashrate = (power * 1000000) / efficiency;
  
  // Daily BTC calculation
  // Network hashrate ≈ difficulty * 2^32 / 600 (in hashes)
  // Then convert to TH for comparison
  const networkHashrateTH = (difficultyT * 1e12 * Math.pow(2, 32)) / 600 / 1e12;
  const btcPerDay = (hashrate / 1e12) / networkHashrateTH * 3.125 * 144;
  const btcPerYear = btcPerDay * 365;

  const dailyRevenue = btcPerDay * btcPrice;
  const dailyPowerCost = power * 1000 * 24 * cost;
  const dailyProfit = dailyRevenue - dailyPowerCost;
  const annualProfit = dailyProfit * 365;
  const totalCapex = capexPerMW * power;
  
  const paybackMonths = dailyProfit > 0 ? (totalCapex / dailyProfit / 30.44) : 999;
  const roi5Year = totalCapex > 0 ? ((annualProfit * 5 - totalCapex) / totalCapex * 100) : 0;

  document.getElementById('result-revenue').textContent = '$' + dailyRevenue.toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('result-cost').textContent = '$' + dailyPowerCost.toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('result-profit').textContent = '$' + dailyProfit.toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('result-annual').textContent = '$' + annualProfit.toLocaleString(undefined, {maximumFractionDigits: 0});
  document.getElementById('result-capex').textContent = '$' + (totalCapex / 1e6).toFixed(2) + 'M';
  document.getElementById('result-payback').textContent = paybackMonths < 100 ? paybackMonths.toFixed(1) + ' months' : 'N/A';
  document.getElementById('result-roi').textContent = roi5Year.toFixed(0) + '%';
  document.getElementById('result-btc').textContent = btcPerYear.toFixed(1);
}

// Event listeners
function setupEventListeners() {
  document.getElementById('province-filter').addEventListener('change', filterSites);
  document.getElementById('complexity-filter').addEventListener('change', filterSites);
  document.getElementById('power-filter').addEventListener('input', (e) => {
    document.getElementById('power-value').textContent = e.target.value + ' MW';
    filterSites();
  });

  ['calc-power', 'calc-cost', 'calc-btc-price', 'calc-difficulty', 'calc-efficiency', 'calc-capex'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateCalculator);
  });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);