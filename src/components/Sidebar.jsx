import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  MapPin, 
  Calendar, 
  Palette, 
  CloudUpload, 
  Sparkles, 
  Building2, 
  Home, 
  Clock, 
  Key, 
  User, 
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { testTelegramBot } from '../services/telegramTester';

export default function Sidebar({ 
  config, 
  setConfig, 
  netlifySettings, 
  setNetlifySettings, 
  onDeploy 
}) {
  const [activeTab, setActiveTab] = useState('couple');
  const [tgTesting, setTgTesting] = useState(false);
  const [tgStatus, setTgStatus] = useState(null);

  // Helper for updating nested config
  const updateField = (path, value) => {
    setConfig(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  // Test Telegram Bot Handler
  const handleTestTelegram = async () => {
    setTgTesting(true);
    setTgStatus(null);
    try {
      await testTelegramBot({
        token: config.telegram.botToken,
        chatId: config.telegram.chatId,
        groomName: config.groomName,
        brideName: config.brideName,
        weddingDateDisplay: config.weddingDateDisplay
      });
      setTgStatus({ type: 'success', msg: "✅ Sinov xabari Telegramingizga yetib bordi! Bot to'g'ri ishlamoqda." });
    } catch (err) {
      setTgStatus({ type: 'error', msg: `❌ Xatolik: ${err.message}` });
    } finally {
      setTgTesting(false);
    }
  };

  const tabs = [
    { id: 'couple', label: 'Kelin-Kuyov', icon: Heart },
    { id: 'telegram', label: 'Telegram Bot', icon: Send },
    { id: 'locations', label: 'Manzillar', icon: MapPin },
    { id: 'program', label: 'Dastur', icon: Calendar },
    { id: 'theme', label: 'Mavzular', icon: Palette },
    { id: 'netlify', label: 'Netlify Deploy', icon: CloudUpload }
  ];

  return (
    <aside className="w-[460px] max-w-[460px] bg-[#111827] border-r border-[#d4af37]/20 flex flex-col shrink-0 z-20 overflow-hidden">
      
      {/* Tab Navigation */}
      <nav className="flex overflow-x-auto bg-[#0b1120] border-b border-[#d4af37]/15 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[76px] py-3.5 px-2 flex flex-col items-center gap-1.5 text-[11px] font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        {/* TAB 1: KELIN & KUYOV */}
        {activeTab === 'couple' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#d4af37]" /> Kelin va Kuyov Ma'lumotlari
              </h3>
              <p className="text-xs text-slate-400 mt-1">To'y qahramonlari ismlari, sana va taklif matni</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kuyov Ismi</label>
                <input 
                  type="text" 
                  value={config.groomName} 
                  onChange={(e) => {
                    updateField('groomName', e.target.value);
                    updateField('monogramGroom', e.target.value.charAt(0).toUpperCase());
                  }}
                  className="input-field" 
                  placeholder="Javohir"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kelin Ismi</label>
                <input 
                  type="text" 
                  value={config.brideName} 
                  onChange={(e) => {
                    updateField('brideName', e.target.value);
                    updateField('monogramBride', e.target.value.charAt(0).toUpperCase());
                  }}
                  className="input-field" 
                  placeholder="Sevinch"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kuyov Monogrammasi</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={config.monogramGroom} 
                  onChange={(e) => updateField('monogramGroom', e.target.value)}
                  className="input-field uppercase font-bold text-center" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Kelin Monogrammasi</label>
                <input 
                  type="text" 
                  maxLength={2}
                  value={config.monogramBride} 
                  onChange={(e) => updateField('monogramBride', e.target.value)}
                  className="input-field uppercase font-bold text-center" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">To'y Sanasi</label>
                <input 
                  type="date" 
                  value={config.weddingDate.split('T')[0] || '2026-10-02'} 
                  onChange={(e) => {
                    const timePart = config.weddingDate.split('T')[1] || '18:00:00+05:00';
                    updateField('weddingDate', `${e.target.value}T${timePart}`);
                  }}
                  className="input-field" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">To'y Vaqti</label>
                <input 
                  type="time" 
                  value="18:00" 
                  onChange={(e) => {
                    const datePart = config.weddingDate.split('T')[0] || '2026-10-02';
                    updateField('weddingDate', `${datePart}T${e.target.value}:00+05:00`);
                  }}
                  className="input-field" 
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Taklif Etuvchilar (Oila)</label>
              <input 
                type="text" 
                value={config.familyHost} 
                onChange={(e) => updateField('familyHost', e.target.value)}
                className="input-field" 
                placeholder="G'anisher Beknazarovlar oilasi"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Asosiy Taklifnoma Matni</label>
              <textarea 
                rows={3}
                value={config.invitationText} 
                onChange={(e) => updateField('invitationText', e.target.value)}
                className="input-field resize-none leading-relaxed" 
              />
            </div>
          </div>
        )}

        {/* TAB 2: TELEGRAM BOT */}
        {activeTab === 'telegram' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#229ed9]" /> Telegram Bot Integratsiyasi
              </h3>
              <p className="text-xs text-slate-400 mt-1">Mehmonlar yozgan barcha tilak va RSVP izohlari to'g'ridan-to'g'ri Telegramingizga keladi</p>
            </div>

            {/* Step-by-step Mini Guide */}
            <div className="bg-[#229ed9]/10 border border-[#229ed9]/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-[#5bc4f5] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" /> Bot ulash yo'riqnomasi (1 daqiqada):
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300">
                <li>Telegramda <a href="https://t.me/botfather" target="_blank" rel="noreferrer" className="text-[#ffd166] underline font-medium">@BotFather</a> ga kiring va <code>/newbot</code> deb yozing.</li>
                <li>Bot nomi va username kiritib, <b>Bot Token</b>ni oling.</li>
                <li>Shaxsiy <b>Chat ID</b> raqamingizni <a href="https://t.me/userinfobot" target="_blank" rel="noreferrer" className="text-[#ffd166] underline font-medium">@userinfobot</a> dan oling.</li>
                <li>Ochgan yangi botingizga kirib <b>/start</b> tugmasini bosing!</li>
              </ol>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#d4af37]" /> Telegram Bot Token
              </label>
              <input 
                type="text" 
                value={config.telegram.botToken} 
                onChange={(e) => updateField('telegram.botToken', e.target.value.trim())}
                placeholder="Masalan: 7123456789:AAFlM-7AbcDeFgHiJkLmNoPQR"
                className="input-field font-mono text-xs" 
              />
              <span className="text-[10px] text-slate-500 mt-1 block">@BotFather bergan maxfiy HTTP API token</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#d4af37]" /> Sizning Telegram Chat ID (User ID)
              </label>
              <input 
                type="text" 
                value={config.telegram.chatId} 
                onChange={(e) => updateField('telegram.chatId', e.target.value.trim())}
                placeholder="Masalan: 123456789"
                className="input-field font-mono text-xs" 
              />
              <span className="text-[10px] text-slate-500 mt-1 block">@userinfobot ko'rsatgan shaxsiy ID raqamingiz</span>
            </div>

            <button
              onClick={handleTestTelegram}
              disabled={tgTesting || !config.telegram.botToken || !config.telegram.chatId}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#229ed9] to-[#167ca8] hover:from-[#2bb0f0] hover:to-[#1c8ec0] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#229ed9]/25 transition-all"
            >
              {tgTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Telegramga Sinov Xabari Yuborish</span>
                </>
              )}
            </button>

            {tgStatus && (
              <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
                tgStatus.type === 'success' 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
              }`}>
                {tgStatus.msg}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANZILLAR */}
        {activeTab === 'locations' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37]" /> To'y Manzillari &amp; Xaritalar
              </h3>
              <p className="text-xs text-slate-400 mt-1">To'yxona, kuyov va kelin xonadonlari havolalari</p>
            </div>

            {/* Location 1: Hall */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-[#fbeea4] flex items-center gap-2 border-b border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-[#d4af37]" /> 1. Tantanali To'yxona
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">To'yxona Nomi</label>
                <input 
                  type="text" 
                  value={config.locations.hall.name} 
                  onChange={(e) => updateField('locations.hall.name', e.target.value)}
                  className="input-field" 
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">To'liq Manzili</label>
                <input 
                  type="text" 
                  value={config.locations.hall.address} 
                  onChange={(e) => updateField('locations.hall.address', e.target.value)}
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Google Xarita Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.hall.googleMaps} 
                    onChange={(e) => updateField('locations.hall.googleMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Yandex Xarita Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.hall.yandexMaps} 
                    onChange={(e) => updateField('locations.hall.yandexMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>
            </div>

            {/* Location 2: Groom */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-[#fbeea4] flex items-center gap-2 border-b border-slate-800 pb-2">
                <Home className="w-4 h-4 text-[#d4af37]" /> 2. Kuyov Xonadoni
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Manzili</label>
                <input 
                  type="text" 
                  value={config.locations.groomHome.address} 
                  onChange={(e) => updateField('locations.groomHome.address', e.target.value)}
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Google Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.groomHome.googleMaps} 
                    onChange={(e) => updateField('locations.groomHome.googleMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Yandex Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.groomHome.yandexMaps} 
                    onChange={(e) => updateField('locations.groomHome.yandexMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>
            </div>

            {/* Location 3: Bride */}
            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-3">
              <div className="text-xs font-bold text-[#fbeea4] flex items-center gap-2 border-b border-slate-800 pb-2">
                <Heart className="w-4 h-4 text-[#d4af37]" /> 3. Kelin Xonadoni
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Manzili</label>
                <input 
                  type="text" 
                  value={config.locations.brideHome.address} 
                  onChange={(e) => updateField('locations.brideHome.address', e.target.value)}
                  className="input-field" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Google Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.brideHome.googleMaps} 
                    onChange={(e) => updateField('locations.brideHome.googleMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Yandex Linki</label>
                  <input 
                    type="text" 
                    value={config.locations.brideHome.yandexMaps} 
                    onChange={(e) => updateField('locations.brideHome.yandexMaps', e.target.value)}
                    className="input-field text-xs" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DASTUR */}
        {activeTab === 'program' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4af37]" /> To'y Dasturi (Kun Tartibi)
              </h3>
              <p className="text-xs text-slate-400 mt-1">Kunning muhim bosqichlari va vaqtlari</p>
            </div>

            <div className="space-y-3">
              {config.program.map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Vaqti</label>
                      <input 
                        type="text" 
                        value={item.time} 
                        onChange={(e) => {
                          const newProg = [...config.program];
                          newProg[idx].time = e.target.value;
                          setConfig(prev => ({ ...prev, program: newProg }));
                        }}
                        className="input-field text-xs" 
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Sarlavhasi</label>
                      <input 
                        type="text" 
                        value={item.title} 
                        onChange={(e) => {
                          const newProg = [...config.program];
                          newProg[idx].title = e.target.value;
                          setConfig(prev => ({ ...prev, program: newProg }));
                        }}
                        className="input-field text-xs" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Tavsifi</label>
                    <input 
                      type="text" 
                      value={item.desc} 
                      onChange={(e) => {
                        const newProg = [...config.program];
                        newProg[idx].desc = e.target.value;
                        setConfig(prev => ({ ...prev, program: newProg }));
                      }}
                      className="input-field text-xs" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MAVZULAR */}
        {activeTab === 'theme' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#d4af37]" /> Dizayn va Ranglar
              </h3>
              <p className="text-xs text-slate-400 mt-1">Hashamatli to'y ranglari palitrasini tanlang</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'royal-blue', name: '👑 Royal Navy & Gold', grad: 'from-[#0e2042] via-[#1a365d] to-[#d4af37]', desc: 'Klassik to\'q ko\'k va tilla' },
                { id: 'emerald-gold', name: '🌿 Emerald & Gold', grad: 'from-[#0d3b2e] via-[#165b47] to-[#e2c068]', desc: 'Zumrad yashil va tilla' },
                { id: 'burgundy-gold', name: '🍷 Burgundy & Rose', grad: 'from-[#4a0e17] via-[#781d28] to-[#e5b974]', desc: 'Hashamatli to\'q qizil' },
                { id: 'velvet-dark', name: '🖤 Velvet & Gold', grad: 'from-[#111111] via-[#222222] to-[#d4af37]', desc: 'Tungi baxmal qora' }
              ].map(theme => (
                <div 
                  key={theme.id}
                  onClick={() => updateField('theme', theme.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    config.theme === theme.id 
                      ? 'border-[#d4af37] bg-slate-900 shadow-lg shadow-[#d4af37]/20 scale-[1.02]' 
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className={`h-10 rounded-lg bg-gradient-to-r ${theme.grad} mb-2 shadow`}></div>
                  <div className="text-xs font-bold text-white">{theme.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{theme.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: NETLIFY DEPLOY */}
        {activeTab === 'netlify' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CloudUpload className="w-4 h-4 text-[#d4af37]" /> Netlify Avtomatik Deploy
              </h3>
              <p className="text-xs text-slate-400 mt-1">1-bosishda saytni Netlify-ga chiqarib jonli havola oling</p>
            </div>

            <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="font-bold text-[#ffd166] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Netlify Token olish (1 daqiqada bepul):
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-slate-300 text-[11px]">
                <li><a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noreferrer" className="text-[#5bc4f5] underline font-medium">app.netlify.com</a> dagi Personal Access Tokens bo'limiga kiring.</li>
                <li><b>"New access token"</b> tugmasini bosing va tokenni nusxalang.</li>
                <li>Tokenni pastdagi maydonga kiriting (brauzeringizda xavfsiz saqlanadi).</li>
              </ol>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Netlify Personal Access Token</label>
              <input 
                type="password" 
                value={netlifySettings.token} 
                onChange={(e) => {
                  setNetlifySettings(prev => ({ ...prev, token: e.target.value.trim() }));
                  localStorage.setItem('netlify_access_token', e.target.value.trim());
                }}
                placeholder="nfp_..."
                className="input-field font-mono text-xs" 
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Xohlagan Sayt Nomi (Subdomain)</label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={netlifySettings.siteName} 
                  onChange={(e) => {
                    const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                    setNetlifySettings(prev => ({ ...prev, siteName: clean }));
                  }}
                  placeholder="javohir-sevinch-toyi"
                  className="input-field rounded-r-none font-mono text-xs" 
                />
                <span className="bg-slate-800 border border-l-0 border-slate-700 px-3 py-2 text-xs text-slate-400 rounded-r-lg font-mono">
                  .netlify.app
                </span>
              </div>
            </div>

            <button
              onClick={onDeploy}
              disabled={!netlifySettings.token}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#fef3bd] to-[#b8932c] hover:opacity-95 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/25 transition-all mt-4"
            >
              <CloudUpload className="w-4 h-4" />
              <span>Netlify-ga Avtomatik Deploy Qilish</span>
            </button>
          </div>
        )}

      </div>
    </aside>
  );
}
