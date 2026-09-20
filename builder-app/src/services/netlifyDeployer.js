import JSZip from 'jszip';

/**
 * Creates a zip bundle of the template with dynamic config and deploys directly to Netlify REST API
 */
export async function deployToNetlify({ token, siteName, config, onProgress }) {
  if (!token) {
    throw new Error("Netlify Access Token kiritilmagan! Iltimos, Netlify profilingizdan token oling.");
  }

  // 1. Progress: Preparing Files
  onProgress?.({ step: 1, text: "Sayt fayllari va konfiguratsiya tayyorlanmoqda..." });

  const zip = new JSZip();

  // Generate customized config.js
  const configContent = `/**
 * Taklifnoma Konfiguratsiyasi (Avtomatik Netlify Deploy)
 */
window.WEDDING_CONFIG = ${JSON.stringify(config, null, 2)};
`;
  zip.file('config.js', configContent);

  // Fetch base template files
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

  } catch (err) {
    console.error("Shablon fayllarini yuklashda xatolik:", err);
    throw new Error("Shablon fayllarini yig'ishda xatolik yuz berdi.");
  }

  // 2. Progress: Generating ZIP
  onProgress?.({ step: 2, text: "ZIP arxiv paketlanmoqda..." });
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // 3. Progress: Uploading to Netlify
  onProgress?.({ step: 3, text: "Netlify serveriga yuklanmoqda va domen ulanmoqda..." });

  const cleanSiteName = siteName ? siteName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : null;

  try {
    // If custom site name provided, attempt to create named site first or deploy directly
    let targetSiteId = null;
    let siteUrl = null;

    if (cleanSiteName) {
      try {
        const createSiteRes = await fetch('https://api.netlify.com/api/v1/sites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: cleanSiteName })
        });

        if (createSiteRes.ok) {
          const siteData = await createSiteRes.json();
          targetSiteId = siteData.id;
          siteUrl = siteData.ssl_url || siteData.url;
        } else if (createSiteRes.status === 422) {
          // Site name might already exist or be owned by the user, we will deploy with direct zip API
          console.log("Subdomain band yoki mavjud, to'g'ridan-to'g'ri ZIP deploy qilinmoqda...");
        }
      } catch (e) {
        console.log("Site yaratish tekshiruvi:", e);
      }
    }

    // Deploy endpoint
    let deployUrl = 'https://api.netlify.com/api/v1/sites';
    if (targetSiteId) {
      deployUrl = `https://api.netlify.com/api/v1/sites/${targetSiteId}/deploys`;
    }

    const deployRes = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/zip'
      },
      body: zipBlob
    });

    if (!deployRes.ok) {
      const errJson = await deployRes.json().catch(() => ({}));
      throw new Error(errJson.message || `Netlify API xatolik kodi: ${deployRes.status}`);
    }

    const deployData = await deployRes.json();
    const finalUrl = deployData.ssl_url || deployData.url || (siteUrl ? siteUrl : `https://${deployData.name || deployData.subdomain}.netlify.app`);

    onProgress?.({ step: 4, text: "Muvaffaqiyatli yakunlandi! 🚀" });

    return {
      success: true,
      url: finalUrl,
      siteId: deployData.site_id || targetSiteId,
      name: deployData.name,
      adminUrl: `https://app.netlify.com/sites/${deployData.name}/overview`
    };

  } catch (error) {
    console.error("Netlify Deploy Error:", error);
    throw new Error(`Netlify-ga deploy qilishda xatolik: ${error.message}`);
  }
}
