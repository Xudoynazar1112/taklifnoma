/**
 * Telegram Bot Connection Tester
 */
export async function testTelegramBot({ token, chatId, groomName, brideName, weddingDateDisplay }) {
  if (!token?.trim() || !chatId?.trim()) {
    throw new Error("Bot Token va Chat ID kiritilishi shart!");
  }

  const messageText = 
`🔔 <b>Taklifnoma Studio — Telegram Bot Muvaffaqiyatli Ulandi!</b>
━━━━━━━━━━━━━━━━━━━━
🎉 <b>Tabriklaymiz!</b> Sizning Telegram botingiz to'y taklifnomasi saytiga muvaffaqiyatli ulandi.

💍 <b>To'y:</b> ${groomName || 'Kuyov'} &amp; ${brideName || 'Kelin'}
📅 <b>Sana:</b> ${weddingDateDisplay || '2-Oktabr 2026, 18:00'}

Endi mehmonlarning barcha ezgu tilaklari va ishtirok tasdiqlari (RSVP) shu bot orqali to'g'ridan-to'g'ri sizga kelib turadi! 🥂✨
━━━━━━━━━━━━━━━━━━━━
⏰ <i>${new Date().toLocaleString('uz-UZ')}</i>`;

  const url = `https://api.telegram.org/bot${token.trim()}/sendMessage`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId.trim(),
      text: messageText,
      parse_mode: 'HTML'
    })
  });

  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || "Bot token yoki Chat ID noto'g'ri. Botga kirib /start bosganingizga ishonch hosil qiling.");
  }

  return true;
}
