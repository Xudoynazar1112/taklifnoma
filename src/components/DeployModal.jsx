import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Rocket, 
  ExternalLink, 
  Copy, 
  Check, 
  Send, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function DeployModal({ 
  isOpen, 
  onClose, 
  deployStatus, 
  deployResult, 
  deployError, 
  onRetry 
}) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const qrCanvasRef = useRef(null);

  // Trigger confetti on success
  useEffect(() => {
    if (deployResult?.url) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [deployResult]);

  // Generate QR code when toggled
  useEffect(() => {
    if (showQr && deployResult?.url && qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, deployResult.url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#0e2042',
          light: '#ffffff'
        }
      });
    }
  }, [showQr, deployResult]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!deployResult?.url) return;
    navigator.clipboard.writeText(deployResult.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const telegramShareUrl = deployResult?.url 
    ? `https://t.me/share/url?url=${encodeURIComponent(deployResult.url)}&text=${encodeURIComponent("Javohir & Sevinch nikoh to'yiga taklifnoma! Sizni kutib qolamiz! 💍✨")}`
    : '#';

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#111827] border border-[#d4af37]/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-bold text-white text-sm">Netlify Avtomatik Deploy</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* 1. LOADING STATE */}
          {deployStatus && !deployResult && !deployError && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
                <div className="absolute inset-0 rounded-full border border-[#d4af37]/20 animate-ping"></div>
              </div>
              <div>
                <h4 className="font-bold text-white text-base">Netlify-ga Yuklanmoqda...</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">{deployStatus.text}</p>
              </div>
              <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#d4af37] to-[#fef3bd] h-full transition-all duration-500"
                  style={{ width: `${(deployStatus.step / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* 2. SUCCESS STATE */}
          {deployResult && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-300 text-sm">Taklifnoma Netlify-da Jonli Ishga Tushdi! 🎉</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Saytingiz internetga to'liq joylashtirildi. Endi havolani barcha mehmonlarga ulashing!
                  </p>
                </div>
              </div>

              {/* Live URL Box */}
              <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between gap-3">
                <a 
                  href={deployResult.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-mono font-bold text-[#5bc4f5] hover:underline truncate"
                >
                  {deployResult.url}
                </a>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#d4af37]" />}
                  <span>{copied ? 'Nusxalandi!' : 'Nusxalash'}</span>
                </button>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={deployResult.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8932c] text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.02]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ochish</span>
                </a>

                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#229ed9] hover:bg-[#1d8ebd] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>

                <button
                  onClick={() => setShowQr(!showQr)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>QR-Kod</span>
                </button>
              </div>

              {/* QR Code Container */}
              {showQr && (
                <div className="p-4 bg-white rounded-xl flex flex-col items-center justify-center animate-fadeIn text-slate-900 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-800">Telefonda skaner qilish uchun QR-Kod:</p>
                  <canvas ref={qrCanvasRef} className="rounded-lg shadow-sm"></canvas>
                  <p className="text-[10px] text-slate-500 font-mono">{deployResult.url}</p>
                </div>
              )}
            </div>
          )}

          {/* 3. ERROR STATE */}
          {deployError && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-rose-300 text-sm">Deploy Qilishda Xatolik Yuz Berdi</h4>
                  <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">{deployError}</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-300">Tavsiyalar:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Netlify Tokeningiz to'g'ri kiritilganiga ishonch hosil qiling.</li>
                  <li>Tanlangan domen nomi (subdomain) band bo'lishi mumkin, boshqa nom yozib ko'ring.</li>
                </ul>
              </div>

              <button
                onClick={onRetry}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
              >
                <span>Qayta Urinish</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
