/**
 * Batch 1: rewrite EN Ella day, 5-day, 10-day tour copy.
 * Also surgically fix DE 10-day overview wrong "8 tägigen" duration.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const enPath = path.join(root, 'src/assets/i18n/en/tours.json');
const dePath = path.join(root, 'src/assets/i18n/de/tours.json');

const words = (s) =>
  String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

const BATCH1 = {
  'ella-day-tour': {
    description:
      'A private Ella day from your hotel: Nine Arch Bridge, a scenic train sector, Little Adam’s Peak, Ravana Falls and the Udawalawe elephant orphanage.',
    overview: `Ella sits in Sri Lanka’s southern hill country, where short walks lead to big views. This private day tour is built around the stops already on our Ella itinerary: the Nine Arch Bridge between Ella and Demodara, a scenic train sector through tea country, the hike to Little Adam’s Peak, Ravana Falls, and time at the Udawalawe elephant orphanage to see rescued young elephants at a feeding.

The day starts with hotel or airport pickup in an air-conditioned private vehicle with an English-speaking chauffeur guide. At the Nine Arch Bridge you can watch for trains crossing the early-20th-century viaduct. The Ella train sector is timed when seats allow, so you can look out over tea estates, valleys and hillside villages without rushing the rest of the plan.

Little Adam’s Peak rises to about 1,141 m; from the trailhead the walk is usually 30–45 minutes, with 360° views at the top. Ravana Falls is one of the wider falls in the country, with rocky viewpoints near the roadside. Later, at the Udawalawe orphanage, you may see a lively group of roughly 20–30 juvenile and teenage elephants during one of the day’s feeding sessions.

Who this tour suits: travellers based on the south or in the hills who want Ella’s classics in one day without a multi-day commitment. It works well for couples and small groups who are happy with a moderate walk and flexible timing around train schedules.

Practical tips from the itinerary: wear shoes with grip for the peak path; bring a light layer for cooler hill air; entrance and activity fees are not included, so budget for bridge/train/orphanage tickets as listed under Excludes. Food and drinks are your own. Payment later (pay at destination) is available after we confirm your booking.`,
    itinerary: [
      {
        day: 1,
        title: 'Ella highlights: bridge, train, peak, falls and elephants',
        activities: [
          {
            type: 'Guided tour',
            title: { title: 'Nine Arches Bridge', icon: 'fa-hiking', color: '#f39c12' },
            description:
              'Walk to viewpoints of the Nine Arch Bridge between Ella and Demodara, an early-20th-century railway viaduct. Watch for trains crossing when schedules allow.',
            image: 'assets/img/onedayTour/ella/1.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Ella Train Trips', icon: 'fa-train', color: '#063764ff' },
            description:
              'Ride a scenic Ella train sector through tea plantations, hills and valleys when seats are available. The stretch is short but packed with highland views.',
            image: 'assets/img/onedayTour/ella/3.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Little Adams Peak', icon: 'fa-leaf', color: '#0f6935ff' },
            description:
              'Hike Little Adam’s Peak (about 1,141 m). From the entrance the climb typically takes 30–45 minutes, ending in panoramic 360° views over the Ella Gap.',
            image: 'assets/img/onedayTour/ella/6.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Ravana waterfall', icon: 'fa-water', color: '#8e44ad' },
            description:
              'Stop at Ravana Falls, one of the wider waterfalls in Sri Lanka. Clamber carefully over nearby rocks if you want a closer look at the cascade.',
            image: 'assets/img/onedayTour/ella/2.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'elephant orphanage udawalawa', icon: 'fa-elephant', color: '#8e44ad' },
            description:
              'Visit the Udawalawe elephant orphanage to observe a group of about 20–30 juvenile and teenage elephants. Feeding sessions run several times a day.',
            image: 'assets/img/onedayTour/ella/7.jpg',
          },
        ],
      },
    ],
    highlights: [
      'Nine Arch Bridge viewpoints',
      'Scenic Ella train sector',
      'Little Adam’s Peak hike (30–45 min)',
      'Ravana Falls stop',
      'Udawalawe elephant orphanage feeding',
    ],
    faq: [
      {
        question: 'What stops are on this Ella day tour?',
        answer:
          'The plan covers Nine Arch Bridge, a scenic Ella train sector when seats allow, Little Adam’s Peak, Ravana Falls and the Udawalawe elephant orphanage. Exact order can shift with train timing and road conditions.',
      },
      {
        question: 'How hard is the Little Adam’s Peak walk?',
        answer:
          'From the trailhead it usually takes 30–45 minutes to the top at about 1,141 m. Expect a moderate hill walk with panoramic views; wear shoes with grip.',
      },
      {
        question: 'Are entrance fees and the train ticket included?',
        answer:
          'No. Entrance and activity fees are excluded. Private air-conditioned vehicle, English-speaking driver, fuel, parking and pickup/drop-off are included—see the Included list on this page.',
      },
      {
        question: 'Where do you pick us up?',
        answer:
          'Pickup and drop-off are from your hotel or the airport, as listed under Included. Add your hotel name and preferred start time in Special Requests when you book.',
      },
      {
        question: 'How do I book and pay?',
        answer:
          'Use the booking form on this page. Payment later (pay at destination) is available after confirmation.',
      },
    ],
  },

  '5-day-sri-lanka-tour': {
    description:
      'Five private days from airport pickup through Pinnawala, Minneriya, Sigiriya, Kandy, Nuwara Eliya, Ella and a south-west coast finish with Madu River and a turtle centre.',
    overview: `This five-day private route is for travellers who want culture, hills and a coastal finish without a long island circuit. Day one runs from Bandaranaike International Airport toward the Cultural Triangle with Pinnawala Elephant Orphanage and a 4x4 jeep safari in Minneriya National Park—known for large wild elephant gatherings—before an overnight near Sigiriya.

Day two is heritage-focused: climb UNESCO-listed Sigiriya Rock Fortress (5th-century frescoes, Mirror Wall and summit views), then continue to Kandy for the Temple of the Sacred Tooth Relic and an evening Kandyan cultural dance show. Day three heads into tea country via the Royal Botanical Gardens at Peradeniya, Ramboda Falls and a tea factory visit with tasting, overnighting in Nuwara Eliya.

Day four reaches Ella for the Nine Arch Bridge and the Little Adam’s Peak hike (about 1,141 m; typically 30–45 minutes from the entrance). Day five turns toward the south-west coast for a sea turtle conservation centre and a Madu River boat safari through mangroves and small islands, including local cinnamon-growing areas.

Who this tour suits: first-time visitors with about a week who want Sigiriya and Kandy plus hill country and a soft coastal ending. The Sigiriya climb and Little Adam’s Peak walk need basic fitness; safari and boat legs are vehicle-based.

Practical notes from our data: sample overnight hotels on the itinerary include Fresco Water Villa (or similar) near Sigiriya, Hotel Topaz (or similar) in Kandy, Yara Nuwara Eliya (or similar) and Oak Ray Ella Gap (or similar), often shown with breakfast and dinner. Check Included and Excluded on this page—entrance and activity fees, food and drinks, and accommodation arrangements are listed separately. Private air-conditioned transport, English-speaking driver, airport pickup/drop-off, fuel and parking are in Included. Payment later (pay at destination) is available after confirmation.`,
    itinerary: [
      {
        day: 1,
        title: 'Airport to Sigiriya via Pinnawala and Minneriya safari',
        activities: [
          {
            type: 'Arrival',
            title: { title: 'Airport Pickup', icon: 'fa-plane', color: '#2c3e50' },
            description:
              'Meet your driver guide at Bandaranaike International Airport and travel toward the Cultural Triangle in a private vehicle.',
          },
          {
            type: 'Wildlife Experience',
            title: { title: 'Pinnawala Elephant Orphanage', icon: 'fa-paw', color: '#27ae60' },
            description:
              'Visit Pinnawala Elephant Orphanage, a sanctuary for rescued and orphaned elephants. Depending on timing, you may see elephants bathing in the river.',
            image: 'assets/img/5daysTours/7.jpg',
          },
          {
            type: 'Safari',
            title: { title: 'Minneriya National Park Safari', icon: 'fa-leaf', color: '#8e44ad' },
            description:
              'Take a 4x4 jeep safari in Minneriya National Park, known for “The Gathering” of wild elephants. Look for elephants, deer, buffalo and birdlife.',
            image: 'assets/img/5daysTours/24.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa, Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/5daysTours/c.jpg',
            extra: ['Breakfast & Dinner Included', '3.5 Star Hotel'],
          },
        ],
      },
      {
        day: 2,
        title: 'Sigiriya Rock Fortress to Kandy culture',
        activities: [
          {
            type: 'Guided tour',
            title: { title: 'Sigiriya Rock Fortress', icon: 'fa-mountain', color: '#e74c3c' },
            description:
              'Climb UNESCO-listed Sigiriya Lion Rock, a 5th-century palace site above the plains. See frescoes, the Mirror Wall and summit panoramas.',
            image: 'assets/img/5daysTours/c8dyxgodivrwf4hxzziq.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Temple of the Sacred Tooth Relic', icon: 'fa-place-of-worship', color: '#2980b9' },
            description:
              'Visit Sri Dalada Maligawa in Kandy. Observe temple rituals and Kandyan architecture at one of Sri Lanka’s most sacred Buddhist sites.',
            image: 'assets/img/5daysTours/4.jpg',
          },
          {
            type: 'Cultural Experience',
            title: { title: 'Kandy Cultural Dance Show', icon: 'fa-theater-masks', color: '#e74c3c' },
            description:
              'Watch an evening cultural dance show with Kandyan drumming, fire walking and traditional costumes.',
            image: 'assets/img/5daysTours/fifyrnqt5tvouhpgh6kk.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Topaz, Kandy', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Hotel Topaz (or similar).',
            image: 'assets/img/5daysTours/25.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },
      {
        day: 3,
        title: 'Kandy to Nuwara Eliya through tea country',
        activities: [
          {
            type: 'Nature',
            title: { title: 'Royal Botanical Gardens Peradeniya', icon: 'fa-tree', color: '#16a085' },
            description:
              'Walk the Royal Botanical Gardens at Peradeniya: orchids, palm avenues, medicinal plants and lawns along the Mahaweli River.',
            image: 'assets/img/5daysTours/26.jpg',
          },
          {
            type: 'Nature',
            title: { title: 'Ramboda Waterfall', icon: 'fa-water', color: '#3498db' },
            description:
              'Pause at Ramboda Falls, one of Sri Lanka’s tallest waterfalls, framed by tea estates and cooler mountain air.',
            image: 'assets/img/5daysTours/27.jpg',
          },
          {
            type: 'Tea Experience',
            title: { title: 'Tea Factory & Plantation Visit', icon: 'fa-mug-hot', color: '#8B4513' },
            description:
              'Tour a tea factory and plantation to see Ceylon tea from leaf to cup, then taste a fresh brew in the hills.',
            image: 'assets/img/5daysTours/28.png',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Yara Nuwara Eliya', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Yara Nuwara Eliya (or similar).',
            image: 'assets/img/5daysTours/29.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },
      {
        day: 4,
        title: 'Nuwara Eliya to Ella: bridge and peak',
        activities: [
          {
            type: 'Guided tour',
            title: { title: 'Nine Arches Bridge', icon: 'fa-bridge', color: '#c0392b' },
            description:
              'Visit the Nine Arch Bridge between Ella and Demodara, an early-20th-century railway engineering landmark in the hills.',
            image: 'assets/img/5daysTours/5.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: "Little Adam's Peak", icon: 'fa-mountain', color: '#8e44ad' },
            description:
              'Hike Little Adam’s Peak (about 1,141 m). The walk from the entrance is typically 30–45 minutes, with wide views and cloud movement over the gap.',
            image: 'assets/img/5daysTours/9.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Oak Ray Ella Gap Hotel', icon: 'fa-hotel', color: '#27ae60' },
            description: 'Accommodation in Oak Ray Ella Gap Hotel or Similar - HB Basis',
            image: 'assets/img/5daysTours/30.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 5,
        title: 'South-west coast: turtles and Madu River',
        activities: [
          {
            type: 'Conservation',
            title: { title: 'Sea Turtle Conservation Project', icon: 'fa-water', color: '#2980b9' },
            description:
              'Visit a sea turtle conservation centre on the south coast to learn about hatchery work and rehabilitation of marine turtles.',
            image: 'assets/img/5daysTours/31.jpg',
          },
          {
            type: 'Boat Safari',
            title: { title: 'Madu River Safari', icon: 'fa-ship', color: '#3498db' },
            description:
              'Boat through Madu River mangroves and islets. Look for wetland wildlife and learn about local cinnamon growing along the waterways.',
            image: 'assets/img/5daysTours/32.jpg',
          },
        ],
      },
    ],
    highlights: [
      'Pinnawala Elephant Orphanage',
      'Minneriya National Park jeep safari',
      'Sigiriya Rock Fortress climb',
      'Temple of the Tooth & Kandy dance show',
      'Tea country, Ella bridge & Little Adam’s Peak',
      'Madu River boat safari & turtle centre',
    ],
    faq: [
      {
        question: 'Which safari is on this 5-day itinerary?',
        answer:
          'Day one includes a 4x4 jeep safari in Minneriya National Park, known for large wild elephant gatherings. Entrance and activity fees are excluded.',
      },
      {
        question: 'Does the route include Sigiriya and Ella?',
        answer:
          'Yes. Day two covers Sigiriya Rock Fortress and Kandy (Tooth Temple and cultural show). Day four is Ella for Nine Arch Bridge and Little Adam’s Peak.',
      },
      {
        question: 'Are hotels and meals included?',
        answer:
          'Sample overnight hotels appear in the day-by-day plan (often shown with breakfast and dinner). See Included and Excluded on this page—accommodation can be arranged on request, and entrance fees, food and drinks are listed under Excludes.',
      },
      {
        question: 'Who is this 5-day tour for?',
        answer:
          'Travellers with about five days who want Cultural Triangle highlights, Kandy, tea country, Ella and a south-west coast finish. Expect two moderate climbs (Sigiriya and Little Adam’s Peak).',
      },
      {
        question: 'How do I book and pay?',
        answer:
          'Use the booking form on this page. Payment later (pay at destination) is available after confirmation.',
      },
    ],
  },

  '10-day-sri-lanka-tour': {
    description:
      'A ten-day private Sri Lanka circuit: Wilpattu safari, Anuradhapura, Sigiriya and Pidurangala, Kandy, tea country, Ella, southern beach time, then Colombo before departure.',
    overview: `Ten days gives room for a northern wildlife start, the Cultural Triangle, hill country and several nights on the south coast before Colombo. Day one focuses on a five-hour 4x4 jeep safari in Wilpattu National Park—Sri Lanka’s largest—where you may see leopards, sloth bears, elephants, deer, crocodiles and birdlife, with overnight near Wilpattu on half board.

Day two links Anuradhapura’s Sri Maha Bodhi and Ruwanweli Maha Seya with a Pidurangala Rock sunset near Sigiriya. Day three stays in the Cultural Triangle: Sigiriya Lion Rock Fortress, a Hiriwadunna village experience, a Minneriya jeep safari and an Ayurveda massage, overnighting again near Sigiriya. Day four moves to Kandy via a Matale spice garden, the Temple of the Sacred Tooth Relic and a Kandyan dance show.

Day five crosses tea country (Blue Field Tea Factory and Ramboda Falls) toward Ella. Day six covers Nine Arch Bridge and the Elephant Transit Home before continuing to the south coast. Days seven and eight are beach days at Hikkaduwa with half-board stays listed at Somerset Mirissa Hotel (or similar). Day nine adds the Peraliya Tsunami Memorial, Koggala turtle hatchery and a Madu River boat safari with cinnamon plantation context, overnighting at Kamili Beach Resort (or similar). Day ten is Colombo sightseeing—Independence Memorial Hall, Gangaramaya Temple, Galle Face Green, Pettah Market and the Red Mosque—before departure.

Who this tour suits: travellers who want safari, ancient cities, hills and a real beach block in one private booking. Wilpattu and Minneriya are jeep-based; Sigiriya and Pidurangala need fitness for climbing.

Practical notes: Included lists air-conditioned private vehicle, English-speaking professional driver, half-board accommodation (7 nights), fuel, parking and airport pickup/drop-off. Excluded are entrance and activity fees, lunch and drinks, and personal expenses. Payment later (pay at destination) is available after confirmation.`,
    itinerary: [
      {
        day: 1,
        title: 'Airport / hotel start and Wilpattu safari',
        activities: [
          {
            type: 'Safari',
            title: { title: 'Wilpattu National Park Safari', icon: 'fa-paw', color: '#27ae60' },
            description:
              'Explore Sri Lanka’s largest national park on a five-hour 4x4 jeep safari. Look for leopards, sloth bears, elephants, deer, crocodiles and diverse birdlife.',
            image: 'assets/img/5daysTours/37.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Thimbiri Wewa Resort, Wilpattu', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Thimbiri Wewa Resort Wilpattu (or similar). Half Board basis.',
            image: 'assets/img/5daysTours/38.jpg',
            extra: ['Dinner Included', 'Star Class Hotel'],
          },
        ],
      },
      {
        day: 2,
        title: 'Anuradhapura sacred sites to Sigiriya via Pidurangala',
        activities: [
          {
            type: 'Religious Visit',
            title: { title: 'Sri Maha Bodhi Temple', icon: 'fa-place-of-worship', color: '#8e44ad' },
            description: 'Visit the sacred Sri Maha Bodhi Tree in Anuradhapura.',
            image: 'assets/img/5daysTours/39.jpg',
          },
          {
            type: 'Historical Visit',
            title: { title: 'Ruwanweli Maha Seya', icon: 'fa-landmark', color: '#e67e22' },
            description: 'Explore Ruwanweli Maha Seya, one of Sri Lanka’s most sacred Buddhist monuments.',
            image: 'assets/img/5daysTours/40.jpg',
          },
          {
            type: 'Scenic Hike',
            title: { title: 'Pidurangala Rock Sunset', icon: 'fa-mountain', color: '#e74c3c' },
            description: 'Climb Pidurangala Rock for sunset views toward Sigiriya.',
            image: 'assets/img/5daysTours/41.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa, Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/5daysTours/c.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },
      {
        day: 3,
        title: 'Sigiriya Rock, village tour, Minneriya and Ayurveda',
        activities: [
          {
            type: 'UNESCO Site',
            title: { title: 'Sigiriya Lion Rock Fortress', icon: 'fa-mountain', color: '#c0392b' },
            description: 'Climb the UNESCO-listed Sigiriya Rock Fortress.',
            image: 'assets/img/5daysTours/42.jpg',
          },
          {
            type: 'Village Experience',
            title: { title: 'Hiriwadunna Village Tour', icon: 'fa-leaf', color: '#27ae60' },
            description: 'Experience a rural Sri Lankan village visit at Hiriwadunna.',
            image: 'assets/img/5daysTours/36.jpg',
          },
          {
            type: 'Safari',
            title: { title: 'Minneriya Safari', icon: 'fa-paw', color: '#2ecc71' },
            description: 'Join a 4x4 jeep safari in Minneriya, known for elephant gatherings.',
            image: 'assets/img/5daysTours/37.jpg',
          },
          {
            type: 'Wellness',
            title: { title: 'Ayurveda Massage', icon: 'fa-spa', color: '#9b59b6' },
            description: 'Relax with a traditional herbal oil Ayurveda massage.',
            image: 'assets/img/5daysTours/43.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Fresco Water Villa, Sigiriya', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Fresco Water Villa (or similar).',
            image: 'assets/img/5daysTours/c.jpg',
            extra: ['Breakfast & Dinner Included', '4 Star Hotel'],
          },
        ],
      },
      {
        day: 4,
        title: 'Spice garden to Kandy: Tooth Temple and dance',
        activities: [
          {
            type: 'Cultural Visit',
            title: { title: 'Matale Spice Garden', icon: 'fa-seedling', color: '#32CD32' },
            description: 'Walk a Matale spice garden to see Sri Lankan spices and herbs.',
            image: 'assets/img/5daysTours/44.jpg',
          },
          {
            type: 'UNESCO Site',
            title: { title: 'Temple of the Sacred Tooth Relic', icon: 'fa-place-of-worship', color: '#2980b9' },
            description: 'Visit the Temple of the Sacred Tooth Relic in Kandy.',
            image: 'assets/img/5daysTours/14.jpg',
          },
          {
            type: 'Cultural Show',
            title: { title: 'Kandy Cultural Dance Show', icon: 'fa-theater-masks', color: '#e74c3c' },
            description: 'Watch traditional Kandyan dance performances in the evening.',
            image: 'assets/img/5daysTours/fifyrnqt5tvouhpgh6kk.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Topaz, Kandy', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay at Hotel Topaz (or similar) in Kandy. Half Board basis.',
            image: 'assets/img/5daysTours/25.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom', 'Breakfast', 'Dinner Included'],
          },
        ],
      },
      {
        day: 5,
        title: 'Tea country toward Ella',
        activities: [
          {
            type: 'Tea Experience',
            title: { title: 'Blue Field Tea Factory', icon: 'fa-mug-hot', color: '#8B4513' },
            description: 'Learn how Ceylon tea is produced at Blue Field Tea Factory.',
            image: 'assets/img/5daysTours/28.png',
          },
          {
            type: 'Nature',
            title: { title: 'Ramboda Waterfall', icon: 'fa-water', color: '#3498db' },
            description: 'Stop at Ramboda Falls, one of Sri Lanka’s tallest waterfalls.',
            image: 'assets/img/5daysTours/27.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: ' Oak Ray Ella Gap Hotel (or similar) - HB Basis',
              icon: 'fa-hotel',
              color: '#16a085',
            },
            description: 'Overnight stay in  Oak Ray Ella Gap Hotel (or similar) - HB Basis.',
            image: 'assets/img/5daysTours/xowpqo2nib4z21zdldhp.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom', 'Breakfast', 'Dinner Included'],
          },
        ],
      },
      {
        day: 6,
        title: 'Ella bridge, Elephant Transit Home, south coast',
        activities: [
          {
            type: 'Landmark',
            title: { title: 'Nine Arch Bridge', icon: 'fa-bridge', color: '#A9A9A9' },
            description: 'Visit the colonial-era Nine Arch railway bridge near Ella.',
            image: 'assets/img/5daysTours/3.jpeg',
          },
          {
            type: 'Wildlife',
            title: { title: 'Elephant Transit Home', icon: 'fa-elephant', color: '#2ecc71' },
            description: 'Observe rescued baby elephants at the Elephant Transit Home.',
            image: 'assets/img/5daysTours/7.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Somerset Mirissa Hotel', icon: 'fa-hotel', color: '#16a085' },
            description: 'Accommodation in Somerset Mirissa Hotel or Similar hotel - HB Basis',
            image: 'assets/img/5daysTours/35.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Breakfast', 'Private bathroom', 'Dinner'],
          },
        ],
      },
      {
        day: 7,
        title: 'Hikkaduwa beach day',
        activities: [
          {
            type: 'Beach Relaxation',
            title: { title: 'Hikkaduwa Beach', icon: 'fa-umbrella-beach', color: '#f1c40f' },
            description: 'Relax on Hikkaduwa’s beaches and swim in the Indian Ocean.',
            image: 'assets/img/5daysTours/45.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Somerset Mirissa Hotel', icon: 'fa-hotel', color: '#16a085' },
            description: 'Accommodation in Somerset Mirissa Hotel or Similar hotel - HB Basis',
            image: 'assets/img/5daysTours/35.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Breakfast', 'Private bathroom', 'Dinner'],
          },
        ],
      },
      {
        day: 8,
        title: 'Second Hikkaduwa beach day',
        activities: [
          {
            type: 'Beach Relaxation',
            title: { title: 'Hikkaduwa Beach', icon: 'fa-umbrella-beach', color: '#f1c40f' },
            description: 'Another free beach day at Hikkaduwa for swimming and downtime.',
            image: 'assets/img/5daysTours/45.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Somerset Mirissa Hotel', icon: 'fa-hotel', color: '#16a085' },
            description: 'Accommodation in Somerset Mirissa Hotel or Similar hotel - HB Basis',
            image: 'assets/img/5daysTours/35.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Breakfast', 'Private bathroom', 'Dinner'],
          },
        ],
      },
      {
        day: 9,
        title: 'Tsunami memorial, turtle hatchery and Madu River',
        activities: [
          {
            type: 'Guided tour',
            title: { title: 'Peraliya Tsunami Memorial', icon: 'fa-monument', color: '#FF8C00' },
            description:
              'Visit the Peraliya Tsunami Memorial, with its towering Buddha statue near the site of Sri Lanka’s worst 2004 tsunami disaster.',
            image: 'assets/img/7daystour/lf8xpxoe67nlur3zr3da.jpg',
          },
          {
            type: 'Wildlife Conservation',
            title: { title: 'Koggala Turtle Hatchery Visit', icon: 'fa-water', color: '#27ae60' },
            description:
              'Visit the Koggala Turtle Hatchery and Conservation Center. Learn about marine conservation, see hatchery pools and how rescued turtles are released to the Indian Ocean.',
            image: 'assets/img/5daysTours/31.jpg',
          },
          {
            type: 'Boat Safari',
            title: { title: 'Madu River Boat Safari', icon: 'fa-ship', color: '#16a085' },
            description:
              'Boat through Madu River mangroves and islets, with stops linked to traditional cinnamon cultivation and wetland wildlife.',
            image: 'assets/img/5daysTours/32.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Kamili Beach Resort (or similar) - HB Basis', icon: 'fa-hotel', color: '#16a085' },
            description: 'Overnight stay in  Kamili Beach Resort (or similar) - HB Basis.',
            image: 'assets/img/5daysTours/46.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom', 'Breakfast', 'Dinner Included'],
          },
        ],
      },
      {
        day: 10,
        title: 'Colombo city highlights and departure',
        activities: [
          {
            type: 'Guided tour',
            title: { title: 'Peraliya Tsunami Memorial', icon: 'fa-monument', color: '#FF8C00' },
            description:
              'Peraliya Tsunami Memorial honors the victims of the 2004 tsunami, featuring a towering Buddha statue as a symbol of peace and remembrance near the site of Sri Lanka’s worst tsunami disaster.',
            image: 'assets/img/7daystour/lf8xpxoe67nlur3zr3da.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Independence Memorial Hall', icon: 'fa-landmark', color: '#A9A9A9' },
            description:
              'See Independence Memorial Hall and gardens at Independence Square, built to commemorate Sri Lanka’s independence.',
            image: 'assets/img/7daystour/fsrleaf7977wcxityzu8.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Gangaramaya Temple', icon: 'fa-landmark', color: '#FFD700' },
            description:
              'Visit Gangaramaya Temple, blending Sri Lankan, Thai and Chinese architectural influences beside Beira Lake.',
            image: 'assets/img/7daystour/fn10nlk7fc0dzyawswa5.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Galle Face Green', icon: 'fa-park', color: '#32CD32' },
            description:
              'Walk Galle Face Green, Colombo’s oceanfront promenade for sea views and evening street food.',
            image: 'assets/img/7daystour/qu0e7cjpkcfhfds1zeem.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Pettah Market', icon: 'fa-store', color: '#FF4500' },
            description:
              'Browse Pettah’s busy markets for spices, clothing and local goods in central Colombo.',
            image: 'assets/img/7daystour/vlk48jx8ywhuzyqlvqg8.jpg',
          },
          {
            type: 'Guided tour',
            title: { title: 'Red Mosque (Jami Ul-Alfar Mosque)', icon: 'fa-mosque', color: '#FF0000' },
            description:
              'View Jami Ul-Alfar Mosque (the Red Mosque), known for its red-and-white facade in the Pettah area.',
            image: 'assets/img/7daystour/owzua0jhk0zazg9d8hcn.jpg',
          },
        ],
      },
    ],
    highlights: [
      '5-hour Wilpattu National Park safari',
      'Anuradhapura: Sri Maha Bodhi & Ruwanweli Maha Seya',
      'Sigiriya, Pidurangala and Minneriya',
      'Kandy Tooth Temple & cultural show',
      'Ella Nine Arch Bridge & tea country',
      'Hikkaduwa beach days, turtles, Madu River, Colombo',
    ],
    faq: [
      {
        question: 'What is included on this 10-day tour?',
        answer:
          'Included: air-conditioned private vehicle, English-speaking professional driver, half-board accommodation (7 nights), fuel, parking and airport pickup/drop-off. Entrance and activity fees, lunch, drinks and personal expenses are excluded.',
      },
      {
        question: 'How long is the Wilpattu safari?',
        answer:
          'The itinerary lists a five-hour 4x4 jeep safari in Wilpattu National Park on day one. Park entrance and jeep fees fall under Excludes.',
      },
      {
        question: 'Where are the beach days?',
        answer:
          'Days seven and eight are Hikkaduwa beach days. South-coast overnight stays are listed at Somerset Mirissa Hotel (or similar) on half board, with a later night at Kamili Beach Resort (or similar).',
      },
      {
        question: 'Can we adjust the itinerary?',
        answer:
          'Yes. Add Special Requests when booking for hotel pickup points, pace and must-see stops. Climb days (Sigiriya, Pidurangala) need basic fitness.',
      },
      {
        question: 'How do I book and pay?',
        answer:
          'Use the booking form on this page. Payment later (pay at destination) is available after confirmation.',
      },
    ],
  },
};

function applyTour(detail, patch) {
  const before = {
    description: detail.description,
    overview: detail.overview,
    faq: detail.faq,
    highlights: detail.highlights,
    itineraryDays: (detail.itinerary || []).map((d) => ({
      day: d.day,
      title: d.title,
      activities: (d.activities || []).map((a) => ({
        title: typeof a.title === 'object' ? a.title.title : a.title,
        description: a.description,
      })),
    })),
  };

  detail.description = patch.description;
  detail.overview = patch.overview;
  detail.itinerary = patch.itinerary;
  detail.highlights = patch.highlights;
  detail.faq = patch.faq;

  const after = {
    description: detail.description,
    overview: detail.overview,
    faq: detail.faq,
    highlights: detail.highlights,
    overviewWords: words(detail.overview),
    itineraryDays: (detail.itinerary || []).map((d) => ({
      day: d.day,
      title: d.title,
      activities: (d.activities || []).map((a) => ({
        title: typeof a.title === 'object' ? a.title.title : a.title,
        description: a.description,
      })),
    })),
  };

  return { before, after };
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const diffs = {};

for (const [id, patch] of Object.entries(BATCH1)) {
  if (!en.details[id]) throw new Error('missing ' + id);
  diffs[id] = applyTour(en.details[id], patch);
  console.log(id, 'overview words:', diffs[id].after.overviewWords);
  if (id === 'ella-day-tour' && (diffs[id].after.overviewWords < 200 || diffs[id].after.overviewWords > 280)) {
    console.warn('WARN Ella overview word count outside 200-250 target:', diffs[id].after.overviewWords);
  }
  if (
    (id === '5-day-sri-lanka-tour' || id === '10-day-sri-lanka-tour') &&
    (diffs[id].after.overviewWords < 250 || diffs[id].after.overviewWords > 400)
  ) {
    console.warn('WARN multi overview word count outside 250-400:', diffs[id].after.overviewWords);
  }
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');

// Surgical DE duration fix for 10-day only
const de = JSON.parse(fs.readFileSync(dePath, 'utf8'));
const de10 = de.details['10-day-sri-lanka-tour'];
const deBefore = de10.overview;
de10.overview = de10.overview.replace(/8\s*tägigen\s*Reise/i, '10 tägigen Reise');
fs.writeFileSync(dePath, JSON.stringify(de, null, 2) + '\n');
diffs._de10DurationFix = { before: deBefore.slice(0, 180), after: de10.overview.slice(0, 180) };

fs.writeFileSync(
  path.join(root, 'scripts/batch1-diffs.json'),
  JSON.stringify(diffs, null, 2),
);
console.log('Wrote scripts/batch1-diffs.json');
console.log('DE 10-day duration fix applied:', deBefore !== de10.overview);
