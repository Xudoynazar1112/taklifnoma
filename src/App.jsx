import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DevicePreview from './components/DevicePreview';
import DeployModal from './components/DeployModal';
import { deployToNetlify } from './services/netlifyDeployer';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function App() {
  const [viewMode, setViewMode] = useState('phone');

  // Main Wedding Configuration State
  const [config, setConfig] = useState({
    groomName: "Javohir",
    brideName: "Sevinch",
    monogramGroom: "J",
    monogramBride: "S",
    weddingDate: "2026-10-02T18:00:00+05:00",
    weddingDateDisplay: "2026-yil 2-oktabr, Soat 18:00",
    familyHost: "G'anisher Beknazarovlar oilasi",
    invitationText: "Sizni hayotimizdagi eng baxtiyor kun nikoh to'yimizga bag'ishlangan tantanali kechaning aziz mehmoni bo'lishga taklif qilamiz.",
    telegram: {
      botToken: "",
      chatId: "",
      enabled: true
    },
    locations: {
      hall: {
        name: '"Fayz" To\'yxonasi',
        address: 'Qashqadaryo viloyati, Koson tumani, Guvalak shaharchasi, "Fayz" to\'yxonasi',
        googleMaps: "https://maps.google.com/?q=Koson+tuman+Guvalak+shaharchasi+Fayz+to%27yxonasi",
        yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani+Guvalak+shaharchasi"
      },
      groomHome: {
        name: "Kuyov Xonadoni",
        address: "Qashqadaryo viloyati, Koson tumani, Guvalak shaharchasi",
        googleMaps: "https://maps.google.com/?q=Koson+tumani+Guvalak+shaharchasi",
        yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani+Guvalak+shaharchasi"
      },
      brideHome: {
        name: "Kelin Xonadoni",
        address: "Qashqadaryo viloyati, Koson tumani",
        googleMaps: "https://maps.google.com/?q=Koson+tumani",
        yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani"
      }
    },
    program: [
      { time: "17:00", title: "Mehmonlarni Kutib Olish", desc: "Qutlug' qadamlar, fotosessiya va samimiy uchrashuvlar" },
      { time: "18:00", title: "Tantanali Marosim", desc: "Kelin va Kuyovning to'yxonaga kirib kelishi va nikoh oqshomi boshlanishi" },
      { time: "19:00", title: "Shodiyona va Tabriklar", desc: "Oila a'zolari, qarindoshlar va do'stlarning qutlovlari, kuy-qo'shiqlar" },
      { time: "20:30", title: "Kelin-Kuyov Valsi & To'y Torti", desc: "Sevimli musiqa sadosi ostida go'zal raqs va shirin to'y tortini kesish" }
    ],
    theme: "royal-blue"
  });

  // Netlify Settings
  const [netlifySettings, setNetlifySettings] = useState({
    token: localStorage.getItem('netlify_access_token') || '',
    siteName: 'javohir-sevinch-toyi'
  });

  // Deploy Modal & Status
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [deployStatus, setDeployStatus] = useState(null);
  const [deployResult, setDeployResult] = useState(null);
  const [deployError, setDeployError] = useState(null);

  // Auto-generate siteName when names change if default
  useEffect(() => {
    if (config.groomName && config.brideName) {
      const g = config.groomName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const b = config.brideName.toLowerCase().replace(/[^a-z0-9]/g, '');
      setNetlifySettings(prev => ({
        ...prev,
        siteName: `${g}-${b}-toyi`
      }));
    }
  }, [config.groomName, config.brideName]);

  // Handle ZIP Download
  const handleDownloadZip = async () => {
    const zip = new JSZip();

    const configContent = `/**
 * Taklifnoma Konfiguratsiyasi (Taklifnoma Studio Pro)
 */
window.WEDDING_CONFIG = ${JSON.stringify(config, null, 2)};
`;
    zip.file('config.js', configContent);

    try {
      const [htmlRes, cssRes, jsRes, musicRes, cardRes, calRes, videoRes] = await Promise.all([
        fetch('/template/index.html').then(r => r.text()),
        fetch('/template/style.css').then(r => r.text()),
        fetch('/template/script.js').then(r => r.text()),
        fetch('/template/assets/music.mp3').then(r => r.blob()).catch(() => null),
        fetch('/template/assets/invitation_card.jpg').then(r => r.blob()).catch(() => null),
        fetch('/template/assets/calendar_preview.jpg').then(r => r.blob()).catch(() => null),
        fetch('/template/taklifnoma_video.mp4').then(r => r.blob()).catch(() => null)
      ]);

      zip.file('index.html', htmlRes);
      zip.file('style.css', cssRes);
      zip.file('script.js', jsRes);

      const assetsFolder = zip.folder('assets');
      if (musicRes) assetsFolder.file('music.mp3', musicRes);
      if (cardRes) assetsFolder.file('invitation_card.jpg', cardRes);
      if (calRes) assetsFolder.file('calendar_preview.jpg', calRes);
      if (videoRes) zip.file('taklifnoma_video.mp4', videoRes);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `taklifnoma_${config.groomName.toLowerCase()}_${config.brideName.toLowerCase()}.zip`);
    } catch (err) {
      alert("ZIP yaratishda xatolik: " + err.message);
    }
  };

  // Handle 1-Click Netlify Deploy
  const handleDeploy = async () => {
    setDeployModalOpen(true);
    setDeployStatus({ step: 1, text: "Tayyorlanmoqda..." });
    setDeployResult(null);
    setDeployError(null);

    try {
      const result = await deployToNetlify({
        token: netlifySettings.token,
        siteName: netlifySettings.siteName,
        config: config,
        onProgress: (status) => setDeployStatus(status)
      });
      setDeployResult(result);
    } catch (err) {
      setDeployError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d131f] text-slate-100 font-sans select-none">
      {/* Top Header */}
      <Header 
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDownloadZip={handleDownloadZip}
        onOpenDeployModal={handleDeploy}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Form Sidebar */}
        <Sidebar 
          config={config}
          setConfig={setConfig}
          netlifySettings={netlifySettings}
          setNetlifySettings={setNetlifySettings}
          onDeploy={handleDeploy}
        />

        {/* Right Live Device Mockup */}
        <DevicePreview 
          viewMode={viewMode}
          config={config}
        />
      </div>

      {/* Netlify Deploy Progress & Result Modal */}
      <DeployModal 
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
        deployStatus={deployStatus}
        deployResult={deployResult}
        deployError={deployError}
        onRetry={handleDeploy}
      />
    </div>
  );
}
