import JSZip from 'jszip';

/**
 * Creates a lightweight zip bundle of the template with dynamic config and deploys to Netlify
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

  // Fetch base template files
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

    const [htmlContent, cssContent, jsContent, musicBlob, cardBlob, calBlob] = await Promise.all([
      fetchSafeText('/template/index.html'),
      fetchSafeText('/template/style.css'),
      fetchSafeText('/template/script.js'),
      fetchSafeBlob('/template/assets/music.mp3'),
      fetchSafeBlob('/template/assets/invitation_card.jpg'),
      fetchSafeBlob('/template/assets/calendar_preview.jpg')
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

  } catch (err) {
    console.error("Shablon fayllarini yig'ishda xatolik:", err);
    throw new Error(`Shablon fayllarini yig'ishda xatolik: ${err.message}`);
  }

  // 2. Progress: Generating ZIP (Lightweight ~500KB)
  onProgress?.({ step: 2, text: "Yengil ZIP arxiv paketlanmoqda (~500 KB)..." });
  const zipBlob = await zip.generateAsync({ type: 'blob' });

  // 3. Progress: Uploading to Netlify
  onProgress?.({ step: 3, text: "Netlify serveriga yuklanmoqda va domen ulanmoqda..." });

  const cleanSiteName = siteName ? siteName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';

  // Use Serverless Function (100% CORS-free and robust)
  try {
    const fnUrl = `/api/deploy?siteName=${encodeURIComponent(cleanSiteName)}`;
    const fnRes = await fetch(fnUrl, {
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
    } else {
      const errData = await fnRes.json().catch(() => ({}));
      throw new Error(errData.error || `Deploy xatoligi (${fnRes.status})`);
    }
  } catch (fnErr) {
    console.error("Serverless deploy error:", fnErr);
    throw new Error(fnErr.message || "Netlify serveriga ulanishda xatolik yuz berdi.");
  }
}
