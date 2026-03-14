'use client';

import { useState, useEffect } from 'react';
import { MethaneSite } from '../data/sites';

interface ROICalculatorProps {
  site: MethaneSite;
}

// Hardware database
const HARDWARE_OPTIONS = [
  { id: 's21-pro', name: 'Bitmain S21 Pro', efficiency: 30, power: 3500, cost: 4200, hashrate: 234 },
  { id: 's21', name: 'Bitmain S21', efficiency: 35, power: 3150, cost: 3800, hashrate: 200 },
  { id: 's19-xp', name: 'Bitmain S19 XP', efficiency: 50, power: 3000, cost: 2500, hashrate: 140 },
  { id: 's19j-pro', name: 'Bitmain S19j Pro', efficiency: 100, power: 3000, cost: 1800, hashrate: 104 },
  { id: 'm60s', name: 'MicroBT M60S', efficiency: 30, power: 3300, cost: 4100, hashrate: 186 },
  { id: 'm50s', name: 'MicroBT M50S', efficiency: 40, power: 2900, cost: 3200, hashrate: 126 },
  { id: 'custom', name: 'Custom Hardware', efficiency: 50, power: 3000, cost: 2000, hashrate: 100 },
];

// Cost model options
const COST_MODELS = [
  { id: 'easy', name: 'Easy (Grid <10km)', costPerKw: 800, description: 'On-grid, plug-and-play' },
  { id: 'moderate', name: 'Moderate (Grid 10-50km)', costPerKw: 1200, description: 'Off-grid, generator needed' },
  { id: 'hard', name: 'Hard (Grid >50km)', costPerKw: 1800, description: 'Remote, complex logistics' },
];

export default function ROICalculator({ site }: ROICalculatorProps) {
  const [mode, setMode] = useState<'simple' | 'complex'>('simple');
  const [btcPrice, setBtcPrice] = useState(85000);
  const [selectedHardware, setSelectedHardware] = useState(HARDWARE_OPTIONS[0]);
  const [costModel, setCostModel] = useState(COST_MODELS.find(c => c.id === site.complexity_score) || COST_MODELS[1]);
  const [numMiners, setNumMiners] = useState(10);
  
  // Complex mode states
  const [customEfficiency, setCustomEfficiency] = useState(30);
  const [customPower, setCustomPower] = useState(3500);
  const [customCost, setCustomCost] = useState(4200);
  const [customCostPerKw, setCustomCostPerKw] = useState(1000);
  const [generatorEfficiency, setGeneratorEfficiency] = useState(35);
  const [methaneEnergy, setMethaneEnergy] = useState(13.9); // kWh/kg
  const [electricityCost, setElectricityCost] = useState(0.05); // $/kWh
  const [maintenancePercent, setMaintenancePercent] = useState(5);

  // Calculated values
  const [results, setResults] = useState({
    totalPower: 0,
    totalHashrate: 0,
    capitalCost: 0,
    dailyRevenue: 0,
    dailyPowerCost: 0,
    dailyMethaneUsed: 0,
    netDailyRevenue: 0,
    roiDays: 0,
    annualRevenue: 0,
    annualCo2Captured: 0,
  });

  useEffect(() => {
    calculateROI();
  }, [mode, selectedHardware, costModel, numMiners, btcPrice, customEfficiency, customPower, customCost, 
      customCostPerKw, generatorEfficiency, methaneEnergy, electricityCost, maintenancePercent]);

  const calculateROI = () => {
    const hardware = mode === 'simple' ? selectedHardware : {
      ...selectedHardware,
      efficiency: customEfficiency,
      power: customPower,
      cost: customCost,
    };

    const costPerKw = mode === 'simple' ? costModel.costPerKw : customCostPerKw;
    
    const totalPower = hardware.power * numMiners; // Watts
    const totalPowerKw = totalPower / 1000; // kW
    const totalHashrate = hardware.hashrate * numMiners; // TH/s
    
    // Capital costs
    const hardwareCost = hardware.cost * numMiners;
    const infrastructureCost = totalPowerKw * costPerKw;
    const totalCapitalCost = hardwareCost + infrastructureCost;
    
    // Daily calculations
    const dailyPowerKwh = totalPowerKw * 24;
    const dailyPowerCost = dailyPowerKwh * electricityCost;
    const dailyMaintenance = (totalCapitalCost * (maintenancePercent / 100)) / 365;
    const dailyOperationalCost = dailyPowerCost + dailyMaintenance;
    
    // Methane consumption
    const dailyMethaneUsed = dailyPowerKwh / methaneEnergy; // kg
    const annualCo2Captured = dailyMethaneUsed * 365 * 25; // CO2e (methane is 25x CO2)
    
    // Revenue (simplified BTC mining calc)
    // Approx: 1 TH/s generates ~0.00005 BTC/day at current difficulty
    const btcPerThPerDay = 0.00005;
    const dailyRevenueBtc = totalHashrate * btcPerThPerDay;
    const dailyRevenue = dailyRevenueBtc * btcPrice;
    
    const netDailyRevenue = dailyRevenue - dailyOperationalCost;
    const roiDays = netDailyRevenue > 0 ? totalCapitalCost / netDailyRevenue : 0;
    
    setResults({
      totalPower: totalPowerKw,
      totalHashrate,
      capitalCost: totalCapitalCost,
      dailyRevenue,
      dailyPowerCost,
      dailyMethaneUsed,
      netDailyRevenue,
      roiDays,
      annualRevenue: netDailyRevenue * 365,
      annualCo2Captured,
    });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val);

  const formatBTC = (val: number) => `₿ ${val.toFixed(4)}`;

  return (
    <div className="p-4">
      {/* Mode Toggle */}
      <div className="flex bg-slate-700 rounded p-1 mb-4">
        <button
          onClick={() => setMode('simple')}
          className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
            mode === 'simple' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Simple
        </button>
        <button
          onClick={() => setMode('complex')}
          className={`flex-1 py-1 px-2 rounded text-sm font-medium transition-colors ${
            mode === 'complex' ? 'bg-orange-500 text-white' : 'text-slate-300 hover:text-white'
          }`}
        >
          Complex
        </button>
      </div>

      {/* BTC Price */}
      <div className="mb-4">
        <label className="block text-xs text-slate-400 mb-1">BTC Price</label>
        <input
          type="number"
          value={btcPrice}
          onChange={(e) => setBtcPrice(Number(e.target.value))}
          className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
        />
      </div>

      {mode === 'simple' ? (
        <>
          {/* Simple Mode */}
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Hardware</label>
            <select
              value={selectedHardware.id}
              onChange={(e) => setSelectedHardware(HARDWARE_OPTIONS.find(h => h.id === e.target.value) || HARDWARE_OPTIONS[0])}
              className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            >
              {HARDWARE_OPTIONS.map(hw => (
                <option key={hw.id} value={hw.id}>
                  {hw.name} ({hw.efficiency} J/TH)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Cost Model</label>
            <select
              value={costModel.id}
              onChange={(e) => setCostModel(COST_MODELS.find(c => c.id === e.target.value) || COST_MODELS[1])}
              className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
            >
              {COST_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">{costModel.description}</p>
          </div>
        </>
      ) : (
        <>
          {/* Complex Mode */}
          <div className="mb-4">
            <label className="block text-xs text-slate-400 mb-1">Hardware Model</label>
            <select
              value={selectedHardware.id}
              onChange={(e) => setSelectedHardware(HARDWARE_OPTIONS.find(h => h.id === e.target.value) || HARDWARE_OPTIONS[0])}
              className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm mb-2"
            >
              {HARDWARE_OPTIONS.map(hw => (
                <option key={hw.id} value={hw.id}>{hw.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Efficiency (J/TH)</label>
              <input
                type="number"
                value={customEfficiency}
                onChange={(e) => setCustomEfficiency(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Power (W)</label>
              <input
                type="number"
                value={customPower}
                onChange={(e) => setCustomPower(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Hardware Cost ($)</label>
              <input
                type="number"
                value={customCost}
                onChange={(e) => setCustomCost(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Infrastructure ($/kW)</label>
              <input
                type="number"
                value={customCostPerKw}
                onChange={(e) => setCustomCostPerKw(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Generator Efficiency (%)</label>
              <input
                type="number"
                value={generatorEfficiency}
                onChange={(e) => setGeneratorEfficiency(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Methane Energy (kWh/kg)</label>
              <input
                type="number"
                step="0.1"
                value={methaneEnergy}
                onChange={(e) => setMethaneEnergy(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Electricity Cost ($/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={electricityCost}
                onChange={(e) => setElectricityCost(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Maintenance (%/yr)</label>
              <input
                type="number"
                value={maintenancePercent}
                onChange={(e) => setMaintenancePercent(Number(e.target.value))}
                className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-sm"
              />
            </div>
          </div>
        </>
      )}

      {/* Number of Miners */}
      <div className="mb-4">
        <label className="block text-xs text-slate-400 mb-1">Number of Miners: {numMiners}</label>
        <input
          type="range"
          min="1"
          max="100"
          value={numMiners}
          onChange={(e) => setNumMiners(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Results */}
      <div className="bg-slate-700/50 rounded p-3 space-y-2">
        <h4 className="text-sm font-semibold text-white mb-2">Projected Results</h4>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total Power</span>
          <span className="text-white">{results.totalPower.toFixed(1)} kW</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Total Hashrate</span>
          <span className="text-white">{results.totalHashrate} TH/s</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Capital Cost</span>
          <span className="text-orange-400 font-medium">{formatCurrency(results.capitalCost)}</span>
        </div>
        
        <div className="border-t border-slate-600 pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Daily Revenue</span>
            <span className="text-green-400">{formatCurrency(results.dailyRevenue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Daily Costs</span>
            <span className="text-red-400">{formatCurrency(results.dailyPowerCost + (results.capitalCost * (maintenancePercent/100) / 365))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Net Daily</span>
            <span className={results.netDailyRevenue > 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
              {formatCurrency(results.netDailyRevenue)}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">ROI Period</span>
            <span className={results.roiDays < 365 ? 'text-green-400 font-bold' : results.roiDays < 730 ? 'text-yellow-400 font-bold' : 'text-red-400 font-bold'}>
              {results.roiDays > 0 ? `${Math.round(results.roiDays)} days` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Annual Revenue</span>
            <span className="text-green-400 font-medium">{formatCurrency(results.annualRevenue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">CO₂ Captured/yr</span>
            <span className="text-teal-400 font-medium">{results.annualCo2Captured.toFixed(0)} tons</span>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-2 mt-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Daily Methane Use</span>
            <span className="text-orange-400">{results.dailyMethaneUsed.toFixed(1)} kg</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 mt-3">
        *Estimates based on current BTC difficulty and prices. Actual results may vary.
      </p>
    </div>
  );
}