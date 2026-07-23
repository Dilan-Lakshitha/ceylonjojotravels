const fs = require('fs');

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];

const dayMap = {
  en: {
    '1 day': '1 day',
    '2 days': '2 days',
    '4 days': '4 days',
    '5 days': '5 days',
    '6 days': '6 days',
    '7 days': '7 days',
    '8 days': '8 days',
    '8 Days': '8 days',
    '10 days': '10 days',
  },
  de: {
    '1 day': '1 Tag',
    '2 days': '2 Tage',
    '4 days': '4 Tage',
    '5 days': '5 Tage',
    '6 days': '6 Tage',
    '7 days': '7 Tage',
    '8 days': '8 Tage',
    '8 Days': '8 Tage',
    '10 days': '10 Tage',
  },
  fr: {
    '1 day': '1 jour',
    '2 days': '2 jours',
    '4 days': '4 jours',
    '5 days': '5 jours',
    '6 days': '6 jours',
    '7 days': '7 jours',
    '8 days': '8 jours',
    '8 Days': '8 jours',
    '8 jours': '8 jours',
    '10 days': '10 jours',
  },
  it: {
    '1 day': '1 giorno',
    '2 days': '2 giorni',
    '4 days': '4 giorni',
    '5 days': '5 giorni',
    '6 days': '6 giorni',
    '7 days': '7 giorni',
    '8 days': '8 giorni',
    '8 Days': '8 giorni',
    '8 giorni': '8 giorni',
    '10 days': '10 giorni',
  },
  es: {
    '1 day': '1 día',
    '2 days': '2 días',
    '4 days': '4 días',
    '5 days': '5 días',
    '6 days': '6 días',
    '7 days': '7 días',
    '8 days': '8 días',
    '8 Days': '8 días',
    '8 días': '8 días',
    '10 days': '10 días',
  },
  pl: {
    '1 day': '1 dzień',
    '2 days': '2 dni',
    '4 days': '4 dni',
    '5 days': '5 dni',
    '6 days': '6 dni',
    '7 days': '7 dni',
    '8 days': '8 dni',
    '8 Days': '8 dni',
    '8 dni': '8 dni',
    '10 days': '10 dni',
  },
  ru: {
    '1 day': '1 день',
    '2 days': '2 дня',
    '4 days': '4 дня',
    '5 days': '5 дней',
    '6 days': '6 дней',
    '7 days': '7 дней',
    '8 days': '8 дней',
    '8 Days': '8 дней',
    '8 дней': '8 дней',
    '10 days': '10 дней',
  },
};

const personsMap = {
  en: '1-20 Persons',
  de: '1–20 Personen',
  fr: '1-20 personnes',
  it: '1-20 persone',
  es: '1-20 personas',
  pl: '1-20 osób',
  ru: '1–20 человек',
};

const durationFromFilecode = {
  'ella-day-tour': '1 day',
  'galle-day-tour': '1 day',
  'kandy-day-tour': '1 day',
  'sigiriya-day-tour': '1 day',
  '2-day-ella-kandy-private-tour-sri-lanka': '2 days',
  '2-day-ella-yala-private-tour-sri-lanka': '2 days',
  '4-day-sri-lanka-tour': '4 days',
  '5-day-sri-lanka-tour': '5 days',
  '6-day-sri-lanka-private-tour': '6 days',
  '7-day-sri-lanka-tour': '7 days',
  '8-day-sri-lanka-private-tour': '8 days',
  '10-day-sri-lanka-tour': '10 days',
};

function normalizeDays(raw, filecode, lang) {
  const map = dayMap[lang];
  if (raw && map[raw]) return map[raw];
  // broken API warning or unknown → derive from filecode
  const enKey = durationFromFilecode[filecode] || '1 day';
  return map[enKey] || enKey;
}

for (const lang of langs) {
  const path = `src/assets/i18n/${lang}/tours.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  for (const list of [data.catalog.dayTours, data.catalog.multiDayTours]) {
    for (const tour of list) {
      tour.days = normalizeDays(tour.days, tour.filecode || tour.id, lang);
      tour.persons = personsMap[lang];
    }
  }
  // also fix details.duration / persons if still English-ish
  for (const [id, detail] of Object.entries(data.details || {})) {
    if (detail) {
      const enKey = durationFromFilecode[id];
      if (enKey && dayMap[lang][enKey]) {
        // only replace if looks English or broken
        const d = String(detail.duration || '');
        if (
          /day/i.test(d) ||
          /MYMEMORY/i.test(d) ||
          !d.trim()
        ) {
          detail.duration = dayMap[lang][enKey];
        }
      }
      if (detail.persons && /Persons/i.test(detail.persons)) {
        detail.persons = personsMap[lang];
      }
    }
  }
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log('fixed catalog', lang);
}

// Improve common.json labels for non-en
const commonFixes = {
  de: {
    'badge.bestseller': 'Beliebteste',
    'card.perPerson': 'pro Person',
    'packages.homeTitle': 'Entdecken Sie unsere besten Touren',
    'packages.homeSubtitle':
      'Wählen Sie aus unseren beliebtesten Sri-Lanka-Tourpaketen oder gestalten Sie Ihre private Tour mit Fahrer.',
    'packages.trusted': 'Von Reisenden weltweit geschätzt',
    'packages.trustedSub': '5,0 Bewertung auf TripAdvisor • über 1000 zufriedene Gäste',
  },
  fr: {
    'badge.bestseller': 'Best-seller',
    'card.perPerson': 'par personne',
    'packages.homeTitle': 'Découvrez nos meilleures circuits',
    'packages.homeSubtitle':
      'Choisissez parmi nos circuits Sri Lanka les plus populaires ou personnalisez votre voyage privé avec chauffeur.',
    'packages.trusted': 'La confiance des voyageurs du monde entier',
    'packages.trustedSub': 'Note 5,0 sur TripAdvisor • plus de 1000 clients satisfaits',
  },
  it: {
    'badge.bestseller': 'Più venduto',
    'card.perPerson': 'a persona',
    'packages.homeTitle': 'Scopri i nostri tour migliori',
    'packages.homeSubtitle':
      'Scegli tra i nostri pacchetti più richiesti dello Sri Lanka o personalizza un tour privato con autista.',
    'packages.trusted': 'Scelto dai viaggiatori di tutto il mondo',
    'packages.trustedSub': 'Valutazione 5,0 su TripAdvisor • oltre 1000 clienti soddisfatti',
  },
  es: {
    'badge.bestseller': 'Más vendido',
    'card.perPerson': 'por persona',
    'packages.homeTitle': 'Explora nuestros mejores tours',
    'packages.homeSubtitle':
      'Elige entre nuestros paquetes más populares de Sri Lanka o personaliza tu tour privado con conductor.',
    'packages.trusted': 'La confianza de viajeros de todo el mundo',
    'packages.trustedSub': 'Valoración 5,0 en TripAdvisor • más de 1000 clientes felices',
  },
  pl: {
    'badge.bestseller': 'Bestseller',
    'card.perPerson': 'za osobę',
    'packages.homeTitle': 'Odkryj nasze najlepsze wycieczki',
    'packages.homeSubtitle':
      'Wybierz spośród najpopularniejszych pakietów Sri Lanki lub stwórz prywatną wycieczkę z kierowcą.',
    'packages.trusted': 'Zaufanie podróżnych z całego świata',
    'packages.trustedSub': 'Ocena 5,0 na TripAdvisor • ponad 1000 zadowolonych gości',
  },
  ru: {
    'badge.bestseller': 'Хит продаж',
    'card.perPerson': 'с человека',
    'packages.homeTitle': 'Откройте наши лучшие туры',
    'packages.homeSubtitle':
      'Выберите популярные пакеты по Шри-Ланке или составьте частный тур с водителем.',
    'packages.trusted': 'Нам доверяют путешественники по всему миру',
    'packages.trustedSub': 'Оценка 5,0 на TripAdvisor • более 1000 довольных гостей',
  },
  en: {
    'packages.homeTitle': 'Explore Our Best Tours',
    'packages.homeSubtitle':
      'Choose from our best-selling Sri Lanka tour packages or customize your own private tour with a driver guide.',
    'packages.trusted': 'Trusted by Travelers Worldwide',
    'packages.trustedSub': '5.0 rating on TripAdvisor • 1000+ happy customers',
    'card.perPerson': 'per person',
  },
};

for (const lang of langs) {
  const path = `src/assets/i18n/${lang}/common.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  Object.assign(data, commonFixes[lang]);
  fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
  console.log('fixed common', lang);
}

console.log('done');
