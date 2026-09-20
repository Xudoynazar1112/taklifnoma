import React, { useEffect, useRef } from 'react';

export default function DevicePreview({ viewMode, config }) {
  const iframeRef = useRef(null);

  // Sync config into iframe in real time
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const syncConfig = () => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.WEDDING_CONFIG = config;
          const iDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iDoc) {
            // Names & Monograms
            iDoc.querySelectorAll('.envelope-names').forEach(el => {
              el.innerHTML = `${config.groomName} &amp; ${config.brideName}`;
            });
            iDoc.querySelectorAll('.groom-name').forEach(el => el.textContent = config.groomName);
            iDoc.querySelectorAll('.bride-name').forEach(el => el.textContent = config.brideName);
            iDoc.querySelectorAll('.footer-monogram').forEach(el => {
              el.innerHTML = `${config.groomName} &amp; ${config.brideName}`;
            });
            iDoc.querySelectorAll('.monogram-badge .gold-text').forEach(el => {
              el.textContent = `${config.monogramGroom} & ${config.monogramBride}`;
            });
            iDoc.querySelectorAll('.monogram-letters').forEach(el => {
              el.innerHTML = `<span class="letter">${config.monogramGroom}</span><span class="ampersand">&amp;</span><span class="letter">${config.monogramBride}</span>`;
            });

            // Texts & Host
            iDoc.querySelectorAll('.main-invitation-text').forEach(el => el.textContent = config.invitationText);
            iDoc.querySelectorAll('.host-name').forEach(el => el.textContent = config.familyHost);

            // Locations
            const hallTitle = iDoc.querySelector('.featured-location .location-title');
            if (hallTitle) hallTitle.textContent = config.locations?.hall?.name || '"Fayz" To\'yxonasi';
            const hallAddr = iDoc.querySelector('.featured-location .location-address-box span');
            if (hallAddr) hallAddr.textContent = config.locations?.hall?.address || '';
          }
        }
      } catch (err) {
        // Cross-origin or loading
      }
    };

    if (iframe.contentWindow?.document?.readyState === 'complete') {
      syncConfig();
    } else {
      iframe.addEventListener('load', syncConfig);
    }
  }, [config]);

  return (
    <main className="flex-1 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#080d1a] flex items-center justify-center p-6 overflow-hidden relative">
      <div className={`transition-all duration-300 flex items-center justify-center h-full w-full ${
        viewMode === 'desktop' ? 'max-w-4xl' : 'max-w-md'
      }`}>
        
        {/* Smartphone / Tablet Mockup Container */}
        <div className={`w-full h-full max-h-[92vh] bg-slate-950 border-[8px] border-slate-800 shadow-2xl shadow-black/80 rounded-[42px] flex flex-col overflow-hidden relative transition-all ${
          viewMode === 'desktop' ? 'rounded-2xl border-4 max-w-full' : 'max-w-[400px]'
        }`}>
          
          {/* Top Notch / Camera Bar (Mobile Only) */}
          {viewMode === 'phone' && (
            <div className="h-7 bg-slate-950 flex items-center justify-center shrink-0 z-30">
              <div className="w-28 h-4 bg-black rounded-full flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-8 h-1 rounded-full bg-slate-800"></div>
              </div>
            </div>
          )}

          {/* Iframe Viewport */}
          <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
            <iframe 
              ref={iframeRef}
              src="/template/index.html" 
              title="To'y Taklifnomasi Jonli Ko'rinishi"
              className="w-full h-full border-none block"
            />
          </div>

          {/* Home Bar Indicator (Mobile Only) */}
          {viewMode === 'phone' && (
            <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0 z-30">
              <div className="w-24 h-1 bg-slate-700 rounded-full"></div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
