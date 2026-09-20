export async function handler(event, context) {
  // CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Netlify Personal Access Token kiritilmagan!' })
      };
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const siteName = event.queryStringParameters?.siteName;

    // Parse binary zip payload
    let zipBuffer;
    if (event.isBase64Encoded) {
      zipBuffer = Buffer.from(event.body, 'base64');
    } else {
      zipBuffer = Buffer.from(event.body, 'binary');
    }

    if (!zipBuffer || zipBuffer.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'ZIP fayl ma\'lumotlari bo\'sh!' })
      };
    }

    // 1. If siteName is provided, attempt to create site with custom name first
    let targetSiteId = null;
    let siteUrl = null;

    if (siteName) {
      const cleanName = siteName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      try {
        const createRes = await fetch('https://api.netlify.com/api/v1/sites', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: cleanName })
        });

        if (createRes.ok) {
          const siteData = await createRes.json();
          targetSiteId = siteData.id;
          siteUrl = siteData.ssl_url || siteData.url;
        } else if (createRes.status === 422) {
          console.log('Subdomain band yoki foydalanuvchiga tegishli, to\'g\'ridan-to\'g\'ri zip deploy qilinadi.');
        }
      } catch (err) {
        console.log('Site creation error:', err);
      }
    }

    // 2. Deploy ZIP binary
    let deployUrl = 'https://api.netlify.com/api/v1/sites';
    if (targetSiteId) {
      deployUrl = `https://api.netlify.com/api/v1/sites/${targetSiteId}/deploys`;
    }

    const deployRes = await fetch(deployUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/zip'
      },
      body: zipBuffer
    });

    if (!deployRes.ok) {
      const errData = await deployRes.json().catch(() => ({}));
      return {
        statusCode: deployRes.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: errData.message || `Netlify API xatosi (${deployRes.status}): Token yoki domen xato bo'lishi mumkin.` 
        })
      };
    }

    const deployData = await deployRes.json();
    const finalUrl = deployData.ssl_url || deployData.url || siteUrl || `https://${deployData.name || deployData.subdomain}.netlify.app`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        url: finalUrl,
        name: deployData.name,
        siteId: deployData.site_id || targetSiteId
      })
    };

  } catch (error) {
    console.error('Serverless deploy error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: `Server xatosi: ${error.message}` })
    };
  }
}
