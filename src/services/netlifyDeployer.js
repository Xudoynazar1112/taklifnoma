import JSZip from 'jszip';

/**
 * Creates a zip bundle of the template with dynamic config and deploys to Netlify
 */
export async function deployToNetlify({ token, siteName, config, onProgress }) {
  if (!token?.trim()) {
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

  // Fetch base template files with fallback handling
  try {
    const fetchSafeText = async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.text();
      } catch (e) {}
      return '';
    };

    const fetchSafeBlob = async (url) => {
      try {
        const res = await fetch(url);
        if (res.ok) return await res.blob();
      } catch (e) {}
      return null;
    };

    const [htmlContent, cssContent, jsContent, musicBlob, cardBlob, calBlob, videoBlob] = await Promise.all([
      fetchSafeText('/template/index.html'),
      fetchSafeText('/template/style.css'),
      fetchSafeText('/template/script.js'),
      fetchSafeBlob('/template/assets/music.mp3'),
      fetchSafeBlob('/template/assets/invitation_card.jpg'),
      fetchSafeBlob('/template/assets/calendar_preview.jpg'),
      fetchSafeBlob('/template/taklifnoma_video.mp4')
    ]);

    if (!htmlContent) {
      throw new Error("Shablon fayli (index.html) yuklanmadi. Qayta urinib ko'ring.");
    }

    zip.file('index.html', htmlContent);
    zip.file('style.css', cssContent);
    zip.file('script.js', jsContent);

    const assetsFolder = zip.folder('assets');
    if (musicBlob) assetsFolder.file('music.mp3', musicBlob);
    if (cardBlob) assetsFolder.file('invitation_card.jpg', cardBlob);
    if (calBlob) assetsFolder.file('calendar_preview.jpg', calBlob);
    if (videoBlob) zip.file('taklifnoma_video.mp4', videoBlob);

  } catch (err) {
    console.error("Shablon fayllarini yig'ishda xatolik:", err);
    throw new Error(`Shablon fayllarini yig'ishda xatolik: ${err.message}`);
  }

  // 2. Progress: Generating ZIP
  onProgress?.({ step: 2, text: "ZIP arxiv paketlanmoqda..." });
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // 3. Progress: Uploading to Netlify
  onProgress?.({ step: 3, text: "Netlify serveriga yuklanmoqda va domen ulanmoqda..." });

  const cleanSiteName = siteName ? siteName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';

  // Try Serverless Function first (100% CORS-free and robust on Netlify)
  try {
    const endpoints = [
      `/api/deploy?siteName=${encodeURIComponent(cleanSiteName)}`,
      `/.netlify/functions/deploy?siteName=${encodeURIComponent(cleanSiteName)}`
    ];

    for (const endpoint of endpoints) {
      try {
        const fnRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.trim()}`,
            'Content-Type': 'application/zip'
          },
          body: zipBlob
        });

        if (fnRes.ok) {
          const result = await fnRes.json();
          onProgress?.({ step: 4, text: "Muvaffaqiyatli yakunlandi! 🚀" });
          return result;
        } else if (fnRes.status !== 404) {
          const errData = await fnRes.json().catch(() => ({}));
          throw new Error(errData.error || `Netlify Serverless xatosi (${fnRes.status})`);
        }
      } catch (fnErr) {
        if (!fnErr.message.includes('404')) {
          console.log('Function attempt notice:', fnErr);
        }
      }
    }
  } catch (e) {
    console.log('Serverless attempt fallback to direct API...');
  }

  // Fallback: Direct Netlify API (if running outside Netlify environment)
  try {
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
        }
      } catch (e) {}
    }

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
      throw new Error(errJson.message || `Netlify API xatosi (${deployRes.status})`);
    }

    const deployData = await deployRes.json();
    const finalUrl = deployData.ssl_url || deployData.url || (siteUrl ? siteUrl : `https://${deployData.name || deployData.subdomain}.netlify.app`);

    onProgress?.({ step: 4, text: "Muvaffaqiyatli yakunlandi! 🚀" });

    return {
      success: true,
      url: finalUrl,
      siteId: deployData.site_id || targetSiteId,
      name: deployData.name
    };

  } catch (error) {
    console.error("Netlify Deploy Final Error:", error);
    throw new Error(error.message || "Netlify serveriga ulanishda xatolik yuz berdi.");
  }
}
