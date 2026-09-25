/**
 * Align catalog + detail H1 titles with high-intent search queries
 * so Google can rank the tour URL instead of the homepage.
 */
const fs = require('fs');
const path = require('path');

const TITLES = {
  en: {
    'ella-day-tour': 'Ella Day Tour | Private Driver Sri Lanka',
    'galle-day-tour': 'Galle Day Tour | Private Driver Sri Lanka',
    'kandy-day-tour': 'Kandy Day Tour | Temple of the Tooth',
    'sigiriya-day-tour': 'Sigiriya Day Tour | Lion Rock Private Driver',
    '2-day-ella-kandy-private-tour-sri-lanka': '2 Day Ella & Kandy Tour | Private Driver',
    '2-day-ella-yala-private-tour-sri-lanka': '2 Day Ella & Yala Safari | Private Driver',
    '4-day-sri-lanka-tour': '4 Day Sri Lanka Tour | Private Driver & Hotels',
    '5-day-sri-lanka-tour': '5 Day Sri Lanka Tour | Private Driver & Hotels',
    '6-day-sri-lanka-private-tour': '6 Day Sri Lanka Tour | Private Driver & Hotels',
    '7-day-sri-lanka-tour': '7 Day Sri Lanka Tour | Private Driver, Safari & Beach',
    '8-day-sri-lanka-private-tour': '8 Day Sri Lanka Tour | Private Driver, Safari & Beach',
    '10-day-sri-lanka-tour': '10 Day Sri Lanka Tour | Private Driver Island Circuit',
  },
  de: {
    'ella-day-tour': 'Ella Tagesausflug | Privater Fahrer Sri Lanka',
    'galle-day-tour': 'Galle Tagesausflug | Privater Fahrer Sri Lanka',
    'kandy-day-tour': 'Kandy Tagesausflug | Zahntempel',
    'sigiriya-day-tour': 'Sigiriya Tagesausflug | Löwenfelsen privater Fahrer',
    '2-day-ella-kandy-private-tour-sri-lanka': '2 Tage Ella & Kandy | Privater Fahrer',
    '2-day-ella-yala-private-tour-sri-lanka': '2 Tage Ella & Yala Safari | Privater Fahrer',
    '4-day-sri-lanka-tour': '4 Tage Sri Lanka Rundreise | Privater Fahrer',
    '5-day-sri-lanka-tour': '5 Tage Sri Lanka Rundreise | Privater Fahrer',
    '6-day-sri-lanka-private-tour': '6 Tage Sri Lanka Rundreise | Privater Fahrer',
    '7-day-sri-lanka-tour': '7 Tage Sri Lanka Rundreise | Privater Fahrer, Safari & Strand',
    '8-day-sri-lanka-private-tour': '8 Tage Sri Lanka Rundreise | Privater Fahrer',
    '10-day-sri-lanka-tour': '10 Tage Sri Lanka Rundreise | Privater Fahrer',
  },
  fr: {
    'ella-day-tour': 'Excursion Ella 1 jour | Chauffeur privé Sri Lanka',
    'galle-day-tour': 'Excursion Galle 1 jour | Chauffeur privé Sri Lanka',
    'kandy-day-tour': 'Excursion Kandy 1 jour | Temple de la Dent',
    'sigiriya-day-tour': 'Excursion Sigiriya | Rocher du Lion chauffeur privé',
    '2-day-ella-kandy-private-tour-sri-lanka': 'Circuit 2 jours Ella & Kandy | Chauffeur privé',
    '2-day-ella-yala-private-tour-sri-lanka': 'Circuit 2 jours Ella & safari Yala | Chauffeur privé',
    '4-day-sri-lanka-tour': 'Circuit Sri Lanka 4 jours | Chauffeur privé',
    '5-day-sri-lanka-tour': 'Circuit Sri Lanka 5 jours | Chauffeur privé',
    '6-day-sri-lanka-private-tour': 'Circuit Sri Lanka 6 jours | Chauffeur privé',
    '7-day-sri-lanka-tour': 'Circuit Sri Lanka 7 jours | Chauffeur privé, safari et plage',
    '8-day-sri-lanka-private-tour': 'Circuit Sri Lanka 8 jours | Chauffeur privé',
    '10-day-sri-lanka-tour': 'Circuit Sri Lanka 10 jours | Chauffeur privé',
  },
  es: {
    'ella-day-tour': 'Tour 1 día Ella | Chófer privado Sri Lanka',
    'galle-day-tour': 'Tour 1 día Galle | Chófer privado Sri Lanka',
    'kandy-day-tour': 'Tour 1 día Kandy | Templo del Diente',
    'sigiriya-day-tour': 'Tour 1 día Sigiriya | Roca del León chófer privado',
    '2-day-ella-kandy-private-tour-sri-lanka': 'Tour 2 días Ella y Kandy | Chófer privado',
    '2-day-ella-yala-private-tour-sri-lanka': 'Tour 2 días Ella y safari Yala | Chófer privado',
    '4-day-sri-lanka-tour': 'Tour Sri Lanka 4 días | Chófer privado',
    '5-day-sri-lanka-tour': 'Tour Sri Lanka 5 días | Chófer privado',
    '6-day-sri-lanka-private-tour': 'Tour Sri Lanka 6 días | Chófer privado',
    '7-day-sri-lanka-tour': 'Tour Sri Lanka 7 días | Chófer privado, safari y playa',
    '8-day-sri-lanka-private-tour': 'Tour Sri Lanka 8 días | Chófer privado',
    '10-day-sri-lanka-tour': 'Tour Sri Lanka 10 días | Chófer privado',
  },
  it: {
    'ella-day-tour': 'Escursione Ella 1 giorno | Autista privato Sri Lanka',
    'galle-day-tour': 'Escursione Galle 1 giorno | Autista privato Sri Lanka',
    'kandy-day-tour': 'Escursione Kandy 1 giorno | Tempio del Dente',
    'sigiriya-day-tour': 'Escursione Sigiriya | Roccia del Leone autista privato',
    '2-day-ella-kandy-private-tour-sri-lanka': 'Tour 2 giorni Ella e Kandy | Autista privato',
    '2-day-ella-yala-private-tour-sri-lanka': 'Tour 2 giorni Ella e safari Yala | Autista privato',
    '4-day-sri-lanka-tour': 'Tour Sri Lanka 4 giorni | Autista privato',
    '5-day-sri-lanka-tour': 'Tour Sri Lanka 5 giorni | Autista privato',
    '6-day-sri-lanka-private-tour': 'Tour Sri Lanka 6 giorni | Autista privato',
    '7-day-sri-lanka-tour': 'Tour Sri Lanka 7 giorni | Autista privato, safari e spiaggia',
    '8-day-sri-lanka-private-tour': 'Tour Sri Lanka 8 giorni | Autista privato',
    '10-day-sri-lanka-tour': 'Tour Sri Lanka 10 giorni | Autista privato',
  },
  pl: {
    'ella-day-tour': 'Wycieczka 1 dzień Ella | Prywatny kierowca Sri Lanka',
    'galle-day-tour': 'Wycieczka 1 dzień Galle | Prywatny kierowca Sri Lanka',
    'kandy-day-tour': 'Wycieczka 1 dzień Kandy | Świątynia Zęba',
    'sigiriya-day-tour': 'Wycieczka Sigiriya | Lwia Skała prywatny kierowca',
    '2-day-ella-kandy-private-tour-sri-lanka': '2 dni Ella i Kandy | Prywatny kierowca',
    '2-day-ella-yala-private-tour-sri-lanka': '2 dni Ella i safari Yala | Prywatny kierowca',
    '4-day-sri-lanka-tour': 'Wycieczka 4 dni Sri Lanka | Prywatny kierowca',
    '5-day-sri-lanka-tour': 'Wycieczka 5 dni Sri Lanka | Prywatny kierowca',
    '6-day-sri-lanka-private-tour': 'Wycieczka 6 dni Sri Lanka | Prywatny kierowca',
    '7-day-sri-lanka-tour': 'Wycieczka 7 dni Sri Lanka | Prywatny kierowca, safari i plaża',
    '8-day-sri-lanka-private-tour': 'Wycieczka 8 dni Sri Lanka | Prywatny kierowca',
    '10-day-sri-lanka-tour': 'Wycieczka 10 dni Sri Lanka | Prywatny kierowca',
  },
  ru: {
    'ella-day-tour': 'Однодневный тур в Эллу | Частный водитель Шри-Ланка',
    'galle-day-tour': 'Однодневный тур в Галле | Частный водитель Шри-Ланка',
    'kandy-day-tour': 'Однодневный тур в Канди | Храм Зуба',
    'sigiriya-day-tour': 'Тур в Сигирию | Львиная скала частный водитель',
    '2-day-ella-kandy-private-tour-sri-lanka': '2 дня Элла и Канди | Частный водитель',
    '2-day-ella-yala-private-tour-sri-lanka': '2 дня Элла и сафари Яла | Частный водитель',
    '4-day-sri-lanka-tour': 'Тур 4 дня Шри-Ланка | Частный водитель',
    '5-day-sri-lanka-tour': 'Тур 5 дней Шри-Ланка | Частный водитель',
    '6-day-sri-lanka-private-tour': 'Тур 6 дней Шри-Ланка | Частный водитель',
    '7-day-sri-lanka-tour': 'Тур 7 дней Шри-Ланка | Частный водитель, сафари и пляж',
    '8-day-sri-lanka-private-tour': 'Тур 8 дней Шри-Ланка | Частный водитель',
    '10-day-sri-lanka-tour': 'Тур 10 дней Шри-Ланка | Частный водитель',
  },
};

const root = path.join(__dirname, '..', 'src', 'assets', 'i18n');

for (const [lang, map] of Object.entries(TITLES)) {
  const toursPath = path.join(root, lang, 'tours.json');
  const seoPath = path.join(root, lang, 'seo.json');
  const tours = JSON.parse(fs.readFileSync(toursPath, 'utf8'));
  const seo = JSON.parse(fs.readFileSync(seoPath, 'utf8'));

  for (const list of [tours.catalog?.dayTours, tours.catalog?.multiDayTours]) {
    for (const item of list || []) {
      const id = item.id || item.filecode;
      if (map[id]) item.title = map[id];
    }
  }

  for (const [id, title] of Object.entries(map)) {
    if (tours.details?.[id]) {
      tours.details[id].title = title;
    }
    seo[`tour.${id}.title`] = title;
  }

  fs.writeFileSync(toursPath, JSON.stringify(tours, null, 2) + '\n');
  fs.writeFileSync(seoPath, JSON.stringify(seo, null, 2) + '\n');
  console.log(lang, 'updated', Object.keys(map).length, 'tours');
}
