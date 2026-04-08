'use client'

import { useState, useMemo } from 'react'

const ASIC_MACHINES = [
  { id: 's21xp', name: 'Antminer S21 XP', hashrate_ths: 300, power_w: 4050, efficiency_j_th: 13.5, cost_cad: 8500, manufacturer: 'Bitmain' },
  { id: 's21', name: 'Antminer S21', hashrate_ths: 200, power_w: 3500, efficiency_j_th: 17.5, cost_cad: 5500, manufacturer: 'Bitmain' },
  { id: 's19kpro', name: 'Antminer S19k Pro', hashrate_ths: 136, power_w: 3264, efficiency_j_th: 24.0, cost_cad: 3200, manufacturer: 'Bitmain' },
  { id: 's19xp', name: 'Antminer S19 XP', hashrate_ths: 140, power_w: 3010, efficiency_j_th: 21.5, cost_cad: 3800, manufacturer: 'Bitmain' },
  { id: 'm50s', name: 'WhatsMiner M50S++', hashrate_ths: 150, power_w: 3276, efficiency_j_th: 21.8, cost_cad: 3600, manufacturer: 'MicroBT' },
  { id: 'm60s', name: 'WhatsMiner M60S', hashrate_ths: 186, power_w: 3348, efficiency_j_th: 18.0, cost_cad: 4800, manufacturer: 'MicroBT' },
  { id: 't21', name: 'Antminer T21', hashrate_ths: 190, power_w: 3610, efficiency_j_th: 19.0, cost_cad: 4200, manufacturer: 'Bitmain' },
  { id: 's19apro', name: 'Antminer S19a Pro', hashrate_ths: 110, power_w: 3250, efficiency_j_th: 29.5, cost_cad: 2400, manufacturer: 'Bitmain' },
  { id: 'm30s', name: 'WhatsMiner M30S++', hashrate_ths: 112, power_w: 3472, efficiency_j_th: 31.0, cost_cad: 2200, manufacturer: 'MicroBT' },
  { id: 's19', name: 'Antminer S19', hashrate_ths: 95, power_w: 3250, efficiency_j_th: 34.2, cost_cad: 1800, manufacturer: 'Bitmain' }
]

export default function SiteDetailsPanel({ site, onClose }: any) {
  if (!site) return null
  const p = site.properties || {}
  const [currency, setCurrency] = useState('CAD')
  const [selectedASIC, setSelectedASIC] = useState(ASIC_MACHINES[0])
  const [machineCount, setMachineCount] = useState(100)
  const [overclockPercent, setOverclockPercent] = useState(0)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [btcPrice, setBtcPrice] = useState(85000)
  const [uptimePercent, setUptimePercent] = useState(95)
  const exchangeRate = 1.35
  const currencySymbol = currency === 'CAD' ? 'C$' : '$'

  const calculations = useMemo(() => {
    const overclockMultiplier = 1 + (overclockPercent / 100)
    const adjustedHashrate = selectedASIC.hashrate_ths * overclockMultiplier
    const adjustedPower = selectedASIC.power_w * overclockMultiplier * (1 + overclockPercent / 200)
    const totalPowerKw = (adjustedPower * machineCount) / 1000
    const dailyBtc = (adjustedHashrate * machineCount * 0.000001)
    const effectiveDailyBtc = dailyBtc * (uptimePercent / 100)
    const rate = currency === 'CAD' ? exchangeRate : 1
    const dailyRevenue = effectiveDailyBtc * btcPrice * rate
    const dailyPowerCost = totalPowerKw * 24 * 0.04 * rate
    const dailyProfit = dailyRevenue - dailyPowerCost
    const hardwareCost = selectedASIC.cost_cad * machineCount * rate
    
    return { 
      effectiveDailyBtc: effectiveDailyBtc || 0, 
      dailyRevenue: dailyRevenue || 0,
      dailyPowerCost: dailyPowerCost || 0,
      dailyProfit: dailyProfit || 0,
      monthlyProfit: (dailyProfit * 30) || 0,
      hardwareCost: hardwareCost || 0,
      paybackDays: dailyProfit > 0 ? hardwareCost / dailyProfit : Infinity,
      totalPowerKw: totalPowerKw || 0
    }
  }, [selectedASIC, machineCount, overclockPercent, btcPrice, uptimePercent, currency])

  const fmt = (val: number) => {
    if (!isFinite(val) || isNaN(val)) return currencySymbol + '0.00'
    if (val >= 1e6) return currencySymbol + (val/1e6).toFixed(2) + 'M'
if (val >= 1e3) return currencySymbol + (val/1e3).toFixed(1) + 'K'
    return currencySymbol + val.toFixed(2)
  }
return
(
    <div className="absolute top-20 right-4 z-50 bg-[#1e293b]/95 backdrop-blur border border-[#5BC0BE]/30 rounded-xl p-6 shadow-xl max-w-md max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{p.name || 'Unknown'}</h2>
          <p className="text-sm text-gray-400">{p.city || 'Unknown'}, {p.province || ''}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="flex justify-end mb-4">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button onClick={() => setCurrency('CAD')} className={`px-3 py-1 rounded text-sm ${currency === 'CAD' ? 'bg-[#5BC0BE] text-slate-900' : 'text-gray-400'}`}>CAD</button>
          <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded text-sm ${currency === 'USD' ? 'bg-[#5BC0BE] text-slate-900' : 'text-gray-400'}`}>USD</button>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4 p-3 bg-slate-800/50 rounded-lg">
        <div className="flex justify-between"><span className="text-gray-400">Total Power</span><span className="text-[#5BC0BE]">{calculations.totalPowerKw.toFixed(1)} kW</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Hardware Cost</span><span className="text-white">{fmt(calculations.hardwareCost)}</span></div>
      </div>
      <div className="mb-4">
        <label className="text-sm font-semibold text-[#5BC0BE]">ASIC Model</label>
        <select value={selectedASIC.id} onChange={(e) => setSelectedASIC(ASIC_MACHINES.find(m => m.id === e.target.value) || ASIC_MACHINES[0])} className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm">
          {ASIC_MACHINES.map(m => <option key={m.id} value={m.id}>{m.name} - {m.hashrate_ths} TH/s @ {m.power_w}W</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="text-sm font-semibold text-[#5BC0BE]">Machines: {machineCount.toLocaleString()}</label>
        <input type="range" min="1" max="10000" value={machineCount} onChange={(e) => setMachineCount(Number(e.target.value))} className="w-full mt-2 accent-[#5BC0BE]" />
      </div>
      <div className="bg-[#5BC0BE]/10 border border-[#5BC0BE]/30 rounded-lg p-4 mb-4">
        <h3 className="text-[#5BC0BE] font-bold mb-2">ROI Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Daily BTC</span><span className="text-white">{calculations.effectiveDailyBtc.toFixed(6)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Daily Revenue</span><span className="text-green-400 font-semibold">{fmt(calculations.dailyRevenue)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Power Cost</span><span className="text-red-400">{fmt(calculations.dailyPowerCost)}</span></div>
          <div className="flex justify-between border-t border-slate-600 pt-2"><span className="text-gray-400">Daily Profit</span><span className={`font-bold ${calculations.dailyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(calculations.dailyProfit)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Monthly Profit</span><span className={`font-bold ${calculations.monthlyProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt(calculations.monthlyProfit)}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Payback</span><span className={calculations.paybackDays < 365 ? 'text-green-400' : 'text-yellow-400'}>{isFinite(calculations.paybackDays) ? Math.round(calculations.paybackDays) + ' days' : 'N/A'}</span></div>
        </div>
      </div>
      <button onClick={() => setAdvancedMode(!advancedMode)} className="w-full
py-2 mb-4 text-[#5BC0BE] text-sm border border-[#5BC0BE]/30 rounded-lg hover:bg-[#5BC0BE]/10 transition-colors">{advancedMode ? 'Hide Advanced' : 'Show Advanced'}</button>
      {advancedMode && (
        <div className="space-y-3 mb-4 p-4 bg-slate-800/30 rounded-lg text-sm">
          <div>
            <label className="text-xs text-gray-400">BTC Price ({currencySymbol})</label>
            <input type="number" value={Math.round(btcPrice * (currency === 'CAD' ? exchangeRate : 1))} onChange={(e) => setBtcPrice(Number(e.target.value) / (currency === 'CAD' ? exchangeRate : 1))} className="w-full mt-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Overclock %</label>
            <input type="range" min="0" max="50" value={overclockPercent} onChange={(e) => setOverclockPercent(Number(e.target.value))} className="w-full mt-1 accent-[#FF8C00]" />
            <div className="text-right text-xs text-gray-400">+{overclockPercent}%</div>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-500 text-center">v0.3.0 - GiveAbit Intelligence</p>
    </div>
  )
}
