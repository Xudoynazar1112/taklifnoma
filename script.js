/* ==========================================================================
   Taklifnoma | Javohir & Sevinch - Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const openInvitationBtn = document.getElementById('openInvitationBtn');
  const mainContent = document.getElementById('mainContent');
  const weddingAudio = document.getElementById('weddingAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessMsg = document.getElementById('rsvpSuccessMsg');
  const wishesStream = document.getElementById('wishesStream');
  const shareTelegram = document.getElementById('shareTelegram');
  const shareWhatsapp = document.getElementById('shareWhatsapp');
  const copySiteLinkBtn = document.getElementById('copySiteLinkBtn');

  // Wedding Target Date: 2-Oktabr 2026, 18:00:00 (Tashkent UTC+5)
  const weddingDate = new Date('2026-10-02T18:00:00+05:00').getTime();

  // 1. Envelope Opening & Audio Autoplay
  openInvitationBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('hidden');
    mainContent.classList.add('visible');

    // Play wedding background audio
    if (weddingAudio) {
      weddingAudio.volume = 0.8;
      weddingAudio.play().then(() => {
        musicToggleBtn.classList.add('playing');
      }).catch((e) => {
        console.log('Audio autoplay prevented by browser policy:', e);
      });
    }
  });

  // 2. Music Toggle Button
  musicToggleBtn.addEventListener('click', () => {
    if (!weddingAudio) return;

    if (weddingAudio.paused) {
      weddingAudio.play();
      musicToggleBtn.classList.add('playing');
      showToast('Musiqa yoqildi 🎵');
    } else {
      weddingAudio.pause();
      musicToggleBtn.classList.remove('playing');
      showToast('Musiqa to\'xtatildi 🔇');
    }
  });

  // 3. Live Countdown Timer
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (distance < 0) {
      if (daysEl) daysEl.innerText = '00';
      if (hoursEl) hoursEl.innerText = '00';
      if (minutesEl) minutesEl.innerText = '00';
      if (secondsEl) secondsEl.innerText = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.innerText = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 4. Download .ics iCalendar File for Apple / Outlook / Calendar apps
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Javohir & Sevinch//Nikoh Toyi Taklifnomasi//UZ
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-javohir-sevinch-20261002@taklifnoma
DTSTAMP:20261002T130000Z
DTSTART:20261002T130000Z
DTEND:20261002T180000Z
SUMMARY:Javohir & Sevinch Nikoh To'yi
DESCRIPTION:Javohir va Sevinchning nikoh to'yiga bag'ishlangan tantanali kecha. Hurmat ila: G'anisher Beknazarovlar oilasi.
LOCATION:Fayz to'yxonasi, Guvalak shaharchasi, Koson tumani, Qashqadaryo
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Javohir_va_Sevinch_Nikoh_Toyi.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Taqvim fayli (.ics) yuklandi! 📅');
    });
  }

  // 5. Toast Notification Function
  window.showToast = function(message) {
    if (!toastNotification || !toastMessage) return;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  };

  // 6. Copy Address Global Function
  window.copyAddress = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Manzil buferga nusxalandi! 📋✨');
      }).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  };

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Manzil nusxalandi! 📋✨');
    } catch (err) {
      showToast('Nusxalashda xatolik yuz berdi');
    }
    document.body.removeChild(textArea);
  }

  // 7. RSVP Form Submission
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const guestName = document.getElementById('guestName').value.trim();
      const guestPhone = document.getElementById('guestPhone').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Albatta boraman';
      const guestCount = document.getElementById('guestCount').value;
      const guestWish = document.getElementById('guestWish').value.trim();

      // Create new wish bubble if a wish was provided
      if (guestWish) {
        addWishToDOM(guestName, guestWish, 'Hozirgina');
        saveWishToStorage(guestName, guestWish);
      }

      // Hide form and show success message
      rsvpForm.style.display = 'none';
      if (rsvpSuccessMsg) {
        rsvpSuccessMsg.style.display = 'block';
      }

      showToast('Ishtirokingiz muvaffaqiyatli qayd etildi! 🎉');
    });
  }

  // Helper: Add wish to DOM
  function addWishToDOM(author, text, timeStr) {
    if (!wishesStream) return;
    const wishEl = document.createElement('div');
    wishEl.className = 'wish-bubble';
    wishEl.innerHTML = `
      <div class="wish-author"><i class="fa-solid fa-heart"></i> ${escapeHTML(author)}</div>
      <p class="wish-text">${escapeHTML(text)}</p>
      <span class="wish-time">${timeStr}</span>
    `;
    wishesStream.prepend(wishEl);
  }

  function saveWishToStorage(author, text) {
    try {
      const stored = JSON.parse(localStorage.getItem('wedding_wishes_js') || '[]');
      stored.push({ author, text, date: new Date().toISOString() });
      localStorage.setItem('wedding_wishes_js', JSON.stringify(stored));
    } catch (e) {
      console.error(e);
    }
  }

  // Load saved wishes
  try {
    const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes_js') || '[]');
    savedWishes.forEach(item => {
      addWishToDOM(item.author, item.text, 'Yaqinda');
    });
  } catch (e) {
    console.error(e);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // 8. Share Links Setup
  const currentUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent("Javohir & Sevinchning nikoh to'ylariga taklifnoma! Sizni kutib qolamiz! 💍✨");

  if (shareTelegram) {
    shareTelegram.href = `https://t.me/share/url?url=${currentUrl}&text=${shareText}`;
  }
  if (shareWhatsapp) {
    shareWhatsapp.href = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
  }
  if (copySiteLinkBtn) {
    copySiteLinkBtn.addEventListener('click', () => {
      copyAddress(window.location.href);
    });
  }

  // 9. Golden Sparkles & Floating Petals Canvas
  initParticleCanvas();
});

// Canvas Particle Animation
function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(35, Math.floor(width / 15));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? '#d4af37' : '#fef3bd',
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.01
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.swing += p.swingSpeed;
      p.x += p.speedX + Math.sin(p.swing) * 0.4;
      p.y += p.speedY;

      if (p.y > height) {
        p.y = -10;
        p.x = Math.random() * width;
      }
      if (p.x > width) p.x = 0;
      if (p.x < 0) p.x = width;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity * (0.6 + Math.sin(p.swing) * 0.4);
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#d4af37';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
