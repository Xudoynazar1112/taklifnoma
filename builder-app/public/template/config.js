/**
 * Taklifnoma Konfiguratsiya Fayli (Wedding Configuration)
 * Ushbu fayldagi ma'lumotlarni o'zgartirish orqali butun saytni osongina moslashtirishingiz mumkin.
 */

window.WEDDING_CONFIG = {
  // Kelin va Kuyov ma'lumotlari
  groomName: "Javohir",
  brideName: "Sevinch",
  monogramGroom: "J",
  monogramBride: "S",
  
  // Sana va Vaqt
  weddingDate: "2026-10-02T18:00:00+05:00", // ISO format (Teskari sanoq va taqvim uchun)
  weddingDateDisplay: "2026-yil 2-oktabr, Soat 18:00",
  monthYear: "Oktabr 2026",
  eventDay: 2,
  
  // Taklif matnlari
  bismillahText: "Bismillahir Rohmanir Rohim",
  invitationTagline: "WEDDING INVITATION • TO'Y TAKLIFNOMASI",
  invitationText: "Sizni hayotimizdagi eng baxtiyor kun nikoh to'yimizga bag'ishlangan tantanali kechaning aziz mehmoni bo'lishga taklif qilamiz.",
  familyHost: "G'anisher Beknazarovlar oilasi",
  closingText: "SIZNI KUTIB QOLAMIZ!",

  // Telegram Bot Integratsiyasi (Izoh va RSVP larni to'g'ridan-to'g'ri Telegramingizga yuboradi)
  telegram: {
    botToken: "", // Masalan: "123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
    chatId: "",   // Masalan: "987654321"
    enabled: true // Agar bot token kiritilsa avtomatik faollashadi
  },

  // To'y Manzillari
  locations: {
    hall: {
      name: '"Fayz" To\'yxonasi',
      type: "Asosiy Tantanali Nikoh Oqshomi",
      address: "Qashqadaryo viloyati, Koson tumani, Guvalak shaharchasi, \"Fayz\" to'yxonasi",
      time: "2-Oktabr 2026, 18:00",
      googleMaps: "https://maps.google.com/?q=Koson+tuman+Guvalak+shaharchasi+Fayz+to%27yxonasi",
      yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani+Guvalak+shaharchasi"
    },
    groomHome: {
      name: "Kuyov Xonadoni",
      type: "Javohirning uyi",
      address: "Qashqadaryo viloyati, Koson tumani, Guvalak shaharchasi",
      googleMaps: "https://maps.google.com/?q=Koson+tumani+Guvalak+shaharchasi",
      yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani+Guvalak+shaharchasi"
    },
    brideHome: {
      name: "Kelin Xonadoni",
      type: "Sevinchning uyi",
      address: "Qashqadaryo viloyati, Koson tumani",
      googleMaps: "https://maps.google.com/?q=Koson+tumani",
      yandexMaps: "https://yandex.uz/maps/?text=Koson+tumani"
    }
  },

  // To'y Dasturi / Kun tartibi
  program: [
    {
      time: "17:00",
      title: "Mehmonlarni Kutib Olish",
      desc: "Qutlug' qadamlar, fotosessiya va samimiy uchrashuvlar",
      icon: "fa-camera-retro",
      highlight: false
    },
    {
      time: "18:00",
      title: "Tantanali Marosim",
      desc: "Kelin va Kuyovning to'yxonaga kirib kelishi va nikoh oqshomi boshlanishi",
      icon: "fa-ring",
      highlight: true
    },
    {
      time: "19:00",
      title: "Shodiyona va Tabriklar",
      desc: "Oila a'zolari, qarindoshlar va do'stlarning qutlovlari, kuy-qo'shiqlar",
      icon: "fa-champagne-glasses",
      highlight: false
    },
    {
      time: "20:30",
      title: "Kelin-Kuyov Valsi & To'y Torti",
      desc: "Sevimli musiqa sadosi ostida go'zal raqs va shirin to'y tortini kesish",
      icon: "fa-cake-candles",
      highlight: false
    }
  ],

  // Mavzu (Theme)
  theme: "royal-blue" // royal-blue, emerald-gold, burgundy-gold, pearl-white, velvet-dark
};
