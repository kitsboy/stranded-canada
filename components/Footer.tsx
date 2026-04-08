'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function Footer() {
  const [showQR, setShowQR] = useState(false)
  const btcAddress = 'bc1qhm5ndfjhqxdk3cx0pngyps4f5nnwdckulmge6c8keyf2pk0neqtshjn8ad'
  const buildNumber = 'v0.3.1'
  
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 bg-[#1e293b]/95 backdrop-blur border-t border-[#5BC0BE]/30 px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Data: <a href="https://open.canada.ca/data/en/dataset/a8ba14b7-7f23-462a-bdbb-83b0ef629823" target="_blank" rel="noopener noreferrer" className="text-[#5BC0BE] hover:underline">ECCC Verified</a></span>
          <span className="text-gray-600">|</span>
          <span>Updated April 7, 2026</span>
          <span className="text-gray-600">|</span>
          <span className="text-[#FF8C00]">{buildNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="mailto:hello@giveabit.io?subject=Stranded" className="hover:text-[#5BC0BE]">✉️ hello@giveabit.io</a>
          <span className="text-gray-600">|</span>
          <a href="https://twitter.com/give_bit" target="_blank" className="hover:text-[#5BC0BE]">🐦 @give_bit</a>
          <span className="text-gray-600">|</span>
          <a href="nostr:kimi@giveabit.io" className="hover:text-[#5BC0BE]">⚡️ kimi@giveabit.io</a>
        </div>
        <div className="relative">
          <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-2 px-3 py-1.5 bg-[#FF8C00]/10 hover:bg-[#FF8C00]/20 border border-[#FF8C00]/30 rounded-lg">
            <span className="text-[#FF8C00]">₿</span>
            <span className="text-white">Donate</span>
          </button>
          {showQR && (
            <div className="absolute bottom-full right-0 mb-2 p-4 bg-white rounded-lg shadow-2xl">
              <QRCodeSVG value={`bitcoin:${btcAddress}`} size={160} level="M" includeMargin />
              <p className="mt-2 text-center text-[10px] text-gray-600 max-w-[160px] break-all">{btcAddress}</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
