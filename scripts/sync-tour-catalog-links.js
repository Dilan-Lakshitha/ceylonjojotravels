/**
 * Sync catalog routerLink + slug fields from TOUR_SLUG_MAP so listings never
 * emit bare root slugs like /circuit-2-jours-ella-kandy.
 */
const fs = require('fs');
const path = require('path');

const ROUTE_MAP = {
  tours: { en: 'tours', de: 'touren', fr: 'circuits', it: 'tour', es: 'tours', pl: 'wycieczki', ru: 'tury' },
};

const TOUR_SLUG_MAP = {
  'ella-day-tour': {
    en: 'ella-day-tour',
    de: 'ella-tagesausflug',
    fr: 'excursion-ella',
    it: 'escursione-ella',
    es: 'excursion-ella',
    pl: 'wycieczka-ella',
    ru: 'odnodnevnyy-tur-ella',
  },
  'galle-day-tour': {
    en: 'galle-day-tour',
    de: 'galle-tagesausflug',
    fr: 'excursion-galle',
    it: 'escursione-galle',
    es: 'excursion-galle',
    pl: 'wycieczka-galle',
    ru: 'odnodnevnyy-tur-galle',
  },
  'kandy-day-tour': {
    en: 'kandy-day-tour',
    de: 'kandy-tagesausflug',
    fr: 'excursion-kandy',
    it: 'escursione-kandy',
    es: 'excursion-kandy',
    pl: 'wycieczka-kandy',
    ru: 'odnodnevnyy-tur-kandy',
  },
  'sigiriya-day-tour': {
    en: 'sigiriya-day-tour',
    de: 'sigiriya-tagesausflug',
    fr: 'excursion-sigiriya',
    it: 'escursione-sigiriya',
    es: 'excursion-sigiriya',
    pl: 'wycieczka-sigiriya',
    ru: 'odnodnevnyy-tur-sigiriya',
  },
  '2-day-ella-kandy-private-tour-sri-lanka': {
    en: '2-day-ella-kandy-private-tour',
    de: '2-tage-ella-kandy-privattour',
    fr: 'circuit-2-jours-ella-kandy',
    it: 'tour-2-giorni-ella-kandy',
    es: 'tour-2-dias-ella-kandy',
    pl: '2-dni-ella-kandy',
    ru: '2-dnya-ella-kandy',
  },
  '2-day-ella-yala-private-tour-sri-lanka': {
    en: '2-day-ella-yala-safari',
    de: '2-tage-ella-yala-safari',
    fr: 'circuit-2-jours-ella-yala',
    it: 'tour-2-giorni-ella-yala',
    es: 'tour-2-dias-ella-yala',
    pl: '2-dni-ella-yala',
    ru: '2-dnya-ella-yala',
  },
  '4-day-sri-lanka-tour': {
    en: '4-day-sri-lanka-tour',
    de: '4-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-4-jours',
    it: 'tour-sri-lanka-4-giorni',
    es: 'tour-sri-lanka-4-dias',
    pl: '4-dni-sri-lanka',
    ru: '4-dnya-shri-lanka',
  },
  '5-day-sri-lanka-tour': {
    en: '5-day-sri-lanka-tour',
    de: '5-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-5-jours',
    it: 'tour-sri-lanka-5-giorni',
    es: 'tour-sri-lanka-5-dias',
    pl: '5-dni-sri-lanka',
    ru: '5-dney-shri-lanka',
  },
  '6-day-sri-lanka-private-tour': {
    en: '6-day-sri-lanka-private-tour',
    de: '6-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-6-jours',
    it: 'tour-privato-sri-lanka-6-giorni',
    es: 'tour-privado-sri-lanka-6-dias',
    pl: '6-dni-prywatny-sri-lanka',
    ru: '6-dney-shri-lanka',
  },
  '7-day-sri-lanka-tour': {
    en: '7-day-sri-lanka-tour',
    de: '7-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-7-jours',
    it: 'tour-sri-lanka-7-giorni',
    es: 'tour-sri-lanka-7-dias',
    pl: '7-dni-sri-lanka',
    ru: '7-dney-shri-lanka',
  },
  '8-day-sri-lanka-private-tour': {
    en: '8-day-sri-lanka-private-tour',
    de: '8-tage-sri-lanka-privattour',
    fr: 'circuit-prive-sri-lanka-8-jours',
    it: 'tour-privato-sri-lanka-8-giorni',
    es: 'tour-privado-sri-lanka-8-dias',
    pl: '8-dni-prywatny-sri-lanka',
    ru: '8-dney-shri-lanka',
  },
  '10-day-sri-lanka-tour': {
    en: '10-day-sri-lanka-tour',
    de: '10-tage-sri-lanka-rundreise',
    fr: 'circuit-sri-lanka-10-jours',
    it: 'tour-sri-lanka-10-giorni',
    es: 'tour-sri-lanka-10-dias',
    pl: '10-dni-sri-lanka',
    ru: '10-dney-shri-lanka',
  },
};

const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];
const root = path.join(__dirname, '..', 'src', 'assets', 'i18n');

function resolveTourId(item) {
  const key = item.filecode || item.id;
  if (TOUR_SLUG_MAP[key]) return key;
  for (const [id, slugs] of Object.entries(TOUR_SLUG_MAP)) {
    if (Object.values(slugs).includes(item.slug) || Object.values(slugs).includes(key)) {
      return id;
    }
  }
  return null;
}

for (const lang of langs) {
  const file = path.join(root, lang, 'tours.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const segment = ROUTE_MAP.tours[lang];
  let n = 0;

  const patchItem = (item) => {
    const tourId = resolveTourId(item);
    if (!tourId) return item;
    const slug = TOUR_SLUG_MAP[tourId][lang];
    n += 1;
    return {
      ...item,
      id: tourId,
      filecode: tourId,
      slug,
      routerLink: `/${lang}/${segment}/${slug}`,
    };
  };

  if (data.catalog) {
    for (const group of ['dayTours', 'multiDayTours']) {
      if (Array.isArray(data.catalog[group])) {
        data.catalog[group] = data.catalog[group].map(patchItem);
      }
    }
  }

  if (data.details) {
    for (const [id, detail] of Object.entries(data.details)) {
      const tourId = TOUR_SLUG_MAP[id] ? id : resolveTourId(detail);
      if (!tourId || !TOUR_SLUG_MAP[tourId]) continue;
      const slug = TOUR_SLUG_MAP[tourId][lang];
      data.details[id] = {
        ...detail,
        id: tourId,
        filecode: tourId,
        slug,
      };
      n += 1;
    }
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`[sync-tour-catalog-links] ${lang}: updated ${n} entries`);
}
