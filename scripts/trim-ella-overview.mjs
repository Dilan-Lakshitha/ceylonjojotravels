import fs from 'node:fs';

const path = 'src/assets/i18n/en/tours.json';
const j = JSON.parse(fs.readFileSync(path, 'utf8'));

const overview = `Ella sits in Sri Lanka’s southern hill country. This private day covers the Nine Arch Bridge between Ella and Demodara, a scenic train sector through tea country (when seats allow), the hike to Little Adam’s Peak, Ravana Falls, and the Udawalawe elephant orphanage where rescued young elephants are fed.

Pickup is from your hotel or the airport in an air-conditioned private vehicle with an English-speaking chauffeur guide. At the bridge you can watch for trains on the early-20th-century viaduct. The train sector, when available, looks out over tea estates and valleys. Little Adam’s Peak is about 1,141 m; from the trailhead the walk usually takes 30–45 minutes with 360° views. Ravana Falls is one of the wider falls in the country, with rocky viewpoints beside the road. At Udawalawe you may see roughly 20–30 juvenile and teenage elephants during a feeding session.

Who this tour suits: travellers on the south coast or in the hills who want Ella’s classics in one day. It fits couples and small groups comfortable with a moderate walk and flexible timing around trains.

Practical tips: wear shoes with grip; bring a light layer for cooler hill air; entrance and activity fees are excluded (see Excludes). Food and drinks are your own. Payment later (pay at destination) is available after confirmation.`;

const words = overview.trim().split(/\s+/).filter(Boolean).length;
console.log('Ella overview words:', words);

j.details['ella-day-tour'].overview = overview;
j.details['ella-day-tour'].description =
  'A private Ella day from your hotel: Nine Arch Bridge, scenic train sector, Little Adam’s Peak, Ravana Falls and the Udawalawe elephant orphanage.';

fs.writeFileSync(path, JSON.stringify(j, null, 2) + '\n');
