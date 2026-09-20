import React from 'react';
import { Smartphone, Monitor, Download, Rocket, Sparkles, ExternalLink } from 'lucide-react';

export default function Header({ 
  viewMode, 
  setViewMode, 
  onDownloadZip, 
  onOpenDeployModal 
}) {
  return (
    <header className="h-16 bg-[#111827]/90 border-b border-[#d4af37]/20 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#99741b] text-slate-950 flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-[#d4af37] via-[#fef3bd] to-[#b8932c] bg-clip-text text-transparent font-serif">
            Taklifnoma Studio Pro
          </h1>
          <p className="text-xs text-slate-400">React Constructor &amp; 1-Click Netlify Deployer</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Device Viewport Selector */}
        <div className="flex bg-[#0b1120] border border-slate-800 rounded-full p-1">
          <button 
            onClick={() => setViewMode('phone')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'phone' 
                ? 'bg-slate-800 text-[#fbeea4] shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobil</span>
          </button>
          <button 
            onClick={() => setViewMode('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'desktop' 
                ? 'bg-slate-800 text-[#fbeea4] shadow' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Ekran</span>
          </button>
        </div>

        {/* View Template Button */}
        <a 
          href="/template/index.html" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Saytni Ko'rish</span>
        </a>

        {/* ZIP Download Backup */}
        <button 
          onClick={onDownloadZip}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>ZIP Yuklab Olish</span>
        </button>

        {/* 1-Click Netlify Deploy Primary Button */}
        <button 
          onClick={onOpenDeployModal}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-[#d4af37] via-[#e5c07b] to-[#b8932c] text-slate-950 shadow-lg shadow-[#d4af37]/25 hover:shadow-[#d4af37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Rocket className="w-4 h-4 fill-slate-950" />
          <span>Netlify-ga Deploy Qilish</span>
        </button>
      </div>
    </header>
  );
}
