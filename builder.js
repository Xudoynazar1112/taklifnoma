/* ==========================================================================
   Taklifnoma Studio | Constructor JavaScript & 1-Click Netlify Deploy
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  const btnPhoneView = document.getElementById('btnPhoneView');
  const btnDesktopView = document.getElementById('btnDesktopView');
  const deviceContainer = document.getElementById('deviceContainer');
  const previewIframe = document.getElementById('previewIframe');
  const btnTestTelegram = document.getElementById('btnTestTelegram');
  const tgTestResult = document.getElementById('tgTestResult');
  const btnDownloadZip = document.getElementById('btnDownloadZip');
  const btnDownloadZip2 = document.getElementById('btnDownloadZip2');
  const btnOpenDeployModal = document.getElementById('btnOpenDeployModal');
  const btnTriggerDeploy = document.getElementById('btnTriggerDeploy');
  const deployModal = document.getElementById('deployModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const deployLoadingState = document.getElementById('deployLoadingState');
  const deploySuccessState = document.getElementById('deploySuccessState');
  const deployErrorState = document.getElementById('deployErrorState');
  const deployStatusTitle = document.getElementById('deployStatusTitle');
  const deployStatusText = document.getElementById('deployStatusText');
  const deployProgressBar = document.getElementById('deployProgressBar');
  const liveSiteLink = document.getElementById('liveSiteLink');
  const btnCopyLiveUrl = document.getElementById('btnCopyLiveUrl');
  const copyBtnText = document.getElementById('copyBtnText');
  const btnOpenLiveSite = document.getElementById('btnOpenLiveSite');
  const btnShareTelegramLive = document.getElementById('btnShareTelegramLive');
  const btnToggleQr = document.getElementById('btnToggleQr');
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const qrcodeCanvas = document.getElementById('qrcodeCanvas');
  const btnRetryDeploy = document.getElementById('btnRetryDeploy');
  const cfgNetlifyToken = document.getElementById('cfgNetlifyToken');
  const cfgNetlifySubdomain = document.getElementById('cfgNetlifySubdomain');
  const studioToast = document.getElementById('studioToast');
  const studioToastMsg = document.getElementById('studioToastMsg');
  const programItemsList = document.getElementById('programItemsList');

  // Load saved token from localStorage
  if (cfgNetlifyToken) {
    cfgNetlifyToken.value = localStorage.getItem('netlify_access_token') || '';
    cfgNetlifyToken.addEventListener('input', (e) => {
      localStorage.setItem('netlify_access_token', e.target.value.trim());
    });
  }

  // Active Wedding Configuration State
  let config = {
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
  };

  // 1. Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // 2. Viewport Switcher
  btnPhoneView.addEventListener('click', () => {
    btnPhoneView.classList.add('active');
    btnDesktopView.classList.remove('active');
    deviceContainer.classList.remove('desktop-mode');
  });

  btnDesktopView.addEventListener('click', () => {
    btnDesktopView.classList.add('active');
    btnPhoneView.classList.remove('active');
    deviceContainer.classList.add('desktop-mode');
  });

  // 3. Render Program Items
  function renderProgramList() {
    if (!programItemsList) return;
    programItemsList.innerHTML = '';

    config.program.forEach((item, index) => {
      const box = document.createElement('div');
      box.className = 'location-group-box';
      box.innerHTML = `
        <div class="group-title"><i class="fa-regular fa-clock"></i> ${index + 1}-Bosqich</div>
        <div class="form-grid-2">
          <div class="field-box">
            <label>Vaqti</label>
            <input type="text" class="prog-time" data-idx="${index}" value="${item.time}">
          </div>
          <div class="field-box">
            <label>Sarlavhasi</label>
            <input type="text" class="prog-title" data-idx="${index}" value="${item.title}">
          </div>
        </div>
        <div class="field-box">
          <label>Tavsifi</label>
          <input type="text" class="prog-desc" data-idx="${index}" value="${item.desc}">
        </div>
      `;
      programItemsList.appendChild(box);
    });

    programItemsList.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = e.target.getAttribute('data-idx');
        if (e.target.classList.contains('prog-time')) config.program[idx].time = e.target.value;
        if (e.target.classList.contains('prog-title')) config.program[idx].title = e.target.value;
        if (e.target.classList.contains('prog-desc')) config.program[idx].desc = e.target.value;
        syncToIframe();
      });
    });
  }
  renderProgramList();

  // 4. Input Sync Listeners
  const inputMap = {
    cfgGroomName: (v) => { 
      config.groomName = v; 
      config.monogramGroom = v.charAt(0).toUpperCase(); 
      document.getElementById('cfgMonoGroom').value = config.monogramGroom;
      updateSubdomainAuto();
    },
    cfgBrideName: (v) => { 
      config.brideName = v; 
      config.monogramBride = v.charAt(0).toUpperCase(); 
      document.getElementById('cfgMonoBride').value = config.monogramBride;
      updateSubdomainAuto();
    },
    cfgMonoGroom: (v) => { config.monogramGroom = v; },
    cfgMonoBride: (v) => { config.monogramBride = v; },
    cfgWeddingDate: (v) => updateWeddingDateTime(),
    cfgWeddingTime: (v) => updateWeddingDateTime(),
    cfgFamilyHost: (v) => { config.familyHost = v; },
    cfgInvitationText: (v) => { config.invitationText = v; },
    cfgBotToken: (v) => { config.telegram.botToken = v.trim(); },
    cfgChatId: (v) => { config.telegram.chatId = v.trim(); },
    cfgHallName: (v) => { config.locations.hall.name = v; },
    cfgHallAddress: (v) => { config.locations.hall.address = v; },
    cfgHallGoogle: (v) => { config.locations.hall.googleMaps = v; },
    cfgHallYandex: (v) => { config.locations.hall.yandexMaps = v; },
    cfgGroomAddress: (v) => { config.locations.groomHome.address = v; },
    cfgGroomGoogle: (v) => { config.locations.groomHome.googleMaps = v; },
    cfgGroomYandex: (v) => { config.locations.groomHome.yandexMaps = v; },
    cfgBrideAddress: (v) => { config.locations.brideHome.address = v; },
    cfgBrideGoogle: (v) => { config.locations.brideHome.googleMaps = v; },
    cfgBrideYandex: (v) => { config.locations.brideHome.yandexMaps = v; }
  };

  function updateSubdomainAuto() {
    if (cfgNetlifySubdomain && config.groomName && config.brideName) {
      const g = config.groomName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const b = config.brideName.toLowerCase().replace(/[^a-z0-9]/g, '');
      cfgNetlifySubdomain.value = `${g}-${b}-toyi`;
    }
  }

  function updateWeddingDateTime() {
    const d = document.getElementById('cfgWeddingDate').value;
    const t = document.getElementById('cfgWeddingTime').value;
    if (d && t) {
      config.weddingDate = `${d}T${t}:00+05:00`;
      const dateObj = new Date(config.weddingDate);
      config.weddingDateDisplay = `${dateObj.getFullYear()}-yil ${dateObj.getDate()}-oktabr, Soat ${t}`;
    }
  }

  Object.keys(inputMap).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        inputMap[id](e.target.value);
        syncToIframe();
      });
    }
  });

  // 5. Theme Selection
  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      config.theme = card.getAttribute('data-theme');
      syncToIframe();
      showStudioToast(`Mavzu: ${card.querySelector('.theme-name').textContent}`);
    });
  });

  // 6. Real-Time Sync to Iframe Preview
  function syncToIframe() {
    try {
      if (previewIframe && previewIframe.contentWindow) {
        previewIframe.contentWindow.WEDDING_CONFIG = config;
        const iDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        if (iDoc) {
          iDoc.querySelectorAll('.envelope-names').forEach(el => el.innerHTML = `${config.groomName} &amp; ${config.brideName}`);
          iDoc.querySelectorAll('.groom-name').forEach(el => el.textContent = config.groomName);
          iDoc.querySelectorAll('.bride-name').forEach(el => el.textContent = config.brideName);
          iDoc.querySelectorAll('.footer-monogram').forEach(el => el.innerHTML = `${config.groomName} &amp; ${config.brideName}`);
          iDoc.querySelectorAll('.monogram-badge .gold-text').forEach(el => el.textContent = `${config.monogramGroom} & ${config.monogramBride}`);
          iDoc.querySelectorAll('.monogram-letters').forEach(el => el.innerHTML = `<span class="letter">${config.monogramGroom}</span><span class="ampersand">&amp;</span><span class="letter">${config.monogramBride}</span>`);
          iDoc.querySelectorAll('.main-invitation-text').forEach(el => el.textContent = config.invitationText);
          iDoc.querySelectorAll('.host-name').forEach(el => el.textContent = config.familyHost);
          iDoc.querySelectorAll('.countdown-target-date').forEach(el => el.innerHTML = `<i class="fa-regular fa-clock"></i> ${config.weddingDateDisplay}`);

          const hallTitle = iDoc.querySelector('.featured-location .location-title');
          if (hallTitle) hallTitle.textContent = config.locations.hall.name;
          const hallAddr = iDoc.querySelector('.featured-location .location-address-box span');
          if (hallAddr) hallAddr.textContent = config.locations.hall.address;
        }
      }
    } catch (e) {
      console.log('Iframe sync notice:', e);
    }
  }

  // 7. Test Telegram Bot Connection
  if (btnTestTelegram) {
    btnTestTelegram.addEventListener('click', async () => {
      const token = document.getElementById('cfgBotToken').value.trim();
      const chatId = document.getElementById('cfgChatId').value.trim();

      if (!token || !chatId) {
        showTgResult('error', 'Iltimos, Bot Token va Chat ID maydonlarini to\'ldiring!');
        return;
      }

      btnTestTelegram.disabled = true;
      btnTestTelegram.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>Yuborilmoqda...</span>`;

      const testMsg = 
`🔔 <b>Taklifnoma Studio — Telegram Bot Muvaffaqiyatli Ulandi!</b>
━━━━━━━━━━━━━━━━━━━━
🎉 <b>Tabriklaymiz!</b> Sizning Telegram botingiz to'y taklifnomasi saytiga muvaffaqiyatli ulandi.

💍 <b>To'y:</b> ${config.groomName} &amp; ${config.brideName}
📅 <b>Sana:</b> ${config.weddingDateDisplay}

Endi mehmonlarning barcha ezgu tilaklari va ishtirok tasdiqlari (RSVP) shu bot orqali to'g'ridan-to'g'ri sizga kelib turadi! 🥂✨
━━━━━━━━━━━━━━━━━━━━
⏰ <i>${new Date().toLocaleString('uz-UZ')}</i>`;

      try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: testMsg,
            parse_mode: 'HTML'
          })
        });

        const data = await response.json();

        if (data.ok) {
          showTgResult('success', '✅ Sinov xabari Telegramingizga yuborildi! Bot muvaffaqiyatli ishlayapti!');
          showStudioToast('Telegram bot ulandi! 🚀');
        } else {
          showTgResult('error', `❌ Xatolik: ${data.description || 'Bot token yoki Chat ID xato'}. Botga kirib /start bosganingizni tekshiring.`);
        }
      } catch (err) {
        showTgResult('error', `❌ Tarmoq xatoligi: ${err.message}.`);
      } finally {
        btnTestTelegram.disabled = false;
        btnTestTelegram.innerHTML = `<i class="fa-paper-plane fa-solid"></i> <span>Telegramga Sinov Xabari Yuborish</span>`;
      }
    });
  }

  function showTgResult(type, msg) {
    if (!tgTestResult) return;
    tgTestResult.className = `test-result-box ${type}`;
    tgTestResult.innerHTML = msg;
    tgTestResult.style.display = 'block';
  }

  // 8. Offline ZIP Generator
  async function generateZipBlob() {
    const zip = new JSZip();
    const configJsContent = `/**
 * Taklifnoma Konfiguratsiyasi (Taklifnoma Studio Pro)
 */
window.WEDDING_CONFIG = ${JSON.stringify(config, null, 2)};
`;
    zip.file('config.js', configJsContent);

    const [htmlRes, cssRes, jsRes, musicRes, cardRes, calRes, videoRes] = await Promise.all([
      fetch('index.html').then(r => r.text()),
      fetch('style.css').then(r => r.text()),
      fetch('script.js').then(r => r.text()),
      fetch('assets/music.mp3').then(r => r.blob()).catch(() => null),
      fetch('assets/invitation_card.jpg').then(r => r.blob()).catch(() => null),
      fetch('assets/calendar_preview.jpg').then(r => r.blob()).catch(() => null),
      fetch('taklifnoma_video.mp4').then(r => r.blob()).catch(() => null)
    ]);

    zip.file('index.html', htmlRes);
    zip.file('style.css', cssRes);
    zip.file('script.js', jsRes);

    const assetsFolder = zip.folder('assets');
    if (musicRes) assetsFolder.file('music.mp3', musicRes);
    if (cardRes) assetsFolder.file('invitation_card.jpg', cardRes);
    if (calRes) assetsFolder.file('calendar_preview.jpg', calRes);
    if (videoRes) zip.file('taklifnoma_video.mp4', videoRes);

    return await zip.generateAsync({ type: 'blob' });
  }

  async function handleDownloadZip() {
    showStudioToast('ZIP arxiv tayyorlanmoqda... ⏳');
    try {
      const zipBlob = await generateZipBlob();
      saveAs(zipBlob, `taklifnoma_${config.groomName.toLowerCase()}_${config.brideName.toLowerCase()}.zip`);
      showStudioToast('ZIP arxiv yuklab olindi! 🎉');
    } catch (err) {
      alert('Xatolik: ' + err.message);
    }
  }

  if (btnDownloadZip) btnDownloadZip.addEventListener('click', handleDownloadZip);
  if (btnDownloadZip2) btnDownloadZip2.addEventListener('click', handleDownloadZip);

  // 9. 1-CLICK AUTOMATED NETLIFY DEPLOY VIA REST API
  async function startNetlifyDeploy() {
    const token = (cfgNetlifyToken ? cfgNetlifyToken.value.trim() : '') || localStorage.getItem('netlify_access_token');
    const subdomain = (cfgNetlifySubdomain ? cfgNetlifySubdomain.value.trim() : 'javohir-sevinch-toyi').toLowerCase().replace(/[^a-z0-9-]/g, '-');

    if (!token) {
      // Switch to export tab and focus token
      const exportTab = document.querySelector('[data-tab="tab-export"]');
      if (exportTab) exportTab.click();
      if (cfgNetlifyToken) cfgNetlifyToken.focus();
      showStudioToast('Iltimos, avval Netlify Tokeningizni kiriting!');
      return;
    }

    // Open Modal
    deployModal.classList.add('open');
    deployLoadingState.style.display = 'flex';
    deploySuccessState.style.display = 'none';
    deployErrorState.style.display = 'none';
    deployProgressBar.style.width = '20%';
    deployStatusTitle.textContent = "Sayt fayllari tayyorlanmoqda...";
    deployStatusText.textContent = "HTML, CSS, JS, musiqa va rasmlar yig'ilmoqda...";

    try {
      // Step 1: Generate ZIP
      const zipBlob = await generateZipBlob();
      deployProgressBar.style.width = '55%';
      deployStatusTitle.textContent = "Netlify-ga yuklanmoqda...";
      deployStatusText.textContent = "Sayt Netlify serverlariga jo'natilmoqda va domen ulanmoqda...";

      // Step 2: Try creating named site or direct deploy
      let targetSiteId = null;
      let siteUrl = null;

      if (subdomain) {
        try {
          const createSiteRes = await fetch('https://api.netlify.com/api/v1/sites', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: subdomain })
          });

          if (createSiteRes.ok) {
            const siteData = await createSiteRes.json();
            targetSiteId = siteData.id;
            siteUrl = siteData.ssl_url || siteData.url;
          }
        } catch (e) {
          console.log('Create site notice:', e);
        }
      }

      // Step 3: Deploy ZIP binary
      let deployEndpoint = 'https://api.netlify.com/api/v1/sites';
      if (targetSiteId) {
        deployEndpoint = `https://api.netlify.com/api/v1/sites/${targetSiteId}/deploys`;
      }

      const deployRes = await fetch(deployEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/zip'
        },
        body: zipBlob
      });

      if (!deployRes.ok) {
        const errData = await deployRes.json().catch(() => ({}));
        throw new Error(errData.message || `Netlify API xatosi (${deployRes.status})`);
      }

      const deployData = await deployRes.json();
      const finalLiveUrl = deployData.ssl_url || deployData.url || (siteUrl ? siteUrl : `https://${deployData.name || deployData.subdomain}.netlify.app`);

      deployProgressBar.style.width = '100%';

      // Step 4: Show Success
      setTimeout(() => {
        deployLoadingState.style.display = 'none';
        deploySuccessState.style.display = 'flex';

        liveSiteLink.textContent = finalLiveUrl;
        liveSiteLink.href = finalLiveUrl;
        btnOpenLiveSite.href = finalLiveUrl;
        btnShareTelegramLive.href = `https://t.me/share/url?url=${encodeURIComponent(finalLiveUrl)}&text=${encodeURIComponent(`${config.groomName} & ${config.brideName} nikoh to'yiga taklifnoma! Sizni kutib qolamiz! 💍✨`)}`;

        // Generate QR code
        if (qrcodeCanvas && typeof QRCode !== 'undefined') {
          qrcodeCanvas.innerHTML = '';
          new QRCode(qrcodeCanvas, {
            text: finalLiveUrl,
            width: 180,
            height: 180,
            colorDark: "#0e2042",
            colorLight: "#ffffff"
          });
        }

        // Confetti celebration!
        if (typeof confetti !== 'undefined') {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 }
          });
        }

        showStudioToast('Saytingiz Netlify-da jonli ishga tushdi! 🎉');
      }, 500);

    } catch (err) {
      console.error('Netlify deploy error:', err);
      deployLoadingState.style.display = 'none';
      deployErrorState.style.display = 'flex';
      document.getElementById('deployErrorText').textContent = err.message || 'Domen band bo\'lishi yoki token xato bo\'lishi mumkin.';
    }
  }

  if (btnOpenDeployModal) btnOpenDeployModal.addEventListener('click', startNetlifyDeploy);
  if (btnTriggerDeploy) btnTriggerDeploy.addEventListener('click', startNetlifyDeploy);
  if (btnRetryDeploy) btnRetryDeploy.addEventListener('click', startNetlifyDeploy);

  // Close Modal
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      deployModal.classList.remove('open');
    });
  }

  // Copy Live URL
  if (btnCopyLiveUrl) {
    btnCopyLiveUrl.addEventListener('click', () => {
      const url = liveSiteLink.textContent;
      navigator.clipboard.writeText(url).then(() => {
        copyBtnText.textContent = 'Nusxalandi!';
        setTimeout(() => { copyBtnText.textContent = 'Nusxalash'; }, 2200);
        showStudioToast('Havola nusxalandi! 📋✨');
      });
    });
  }

  // Toggle QR Code
  if (btnToggleQr) {
    btnToggleQr.addEventListener('click', () => {
      if (qrCodeContainer.style.display === 'none') {
        qrCodeContainer.style.display = 'flex';
      } else {
        qrCodeContainer.style.display = 'none';
      }
    });
  }

  // Studio Toast Helper
  function showStudioToast(msg) {
    if (!studioToast || !studioToastMsg) return;
    studioToastMsg.textContent = msg;
    studioToast.classList.add('show');
    setTimeout(() => {
      studioToast.classList.remove('show');
    }, 3200);
  }
});
