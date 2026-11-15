/**
 * Static USD party price maps mirrored from src/assets/data/US*.json.
 * Used for SSR / first paint. Never invent values — regenerate via
 * `node scripts/gen-tour-prices-static.mjs` when JSON changes.
 * Key "2" is the party-of-2 total (same field TourPriceService returns).
 */
export const US_TOUR_PRICE_MAPS: Readonly<
  Record<string, Readonly<Record<string, number>>>
> = {
  "10-day-sri-lanka-tour": {
    "1": 1700,
    "2": 2200,
    "3": 2800,
    "4": 3500,
    "5": 4100,
    "6": 5900
  },
  "2-day-ella-kandy-private-tour-sri-lanka": {
    "1": 420,
    "2": 570,
    "3": 650,
    "4": 750,
    "5": 900,
    "6": 1020
  },
  "2-day-ella-yala-private-tour-sri-lanka": {
    "1": 400,
    "2": 550,
    "3": 640,
    "4": 750,
    "5": 880,
    "6": 990
  },
  "4-day-sri-lanka-tour": {
    "1": 790,
    "2": 1300,
    "3": 1790,
    "4": 1980,
    "5": 2230,
    "6": 2530
  },
  "5-day-sri-lanka-tour": {
    "1": 990,
    "2": 1400,
    "3": 1700,
    "4": 2100,
    "5": 2400,
    "6": 2700
  },
  "6-day-sri-lanka-private-tour": {
    "1": 1190,
    "2": 1700,
    "3": 1890,
    "4": 2100,
    "5": 2400.5,
    "6": 2700
  },
  "7-day-sri-lanka-tour": {
    "1": 1387.5,
    "2": 1875,
    "3": 2625,
    "4": 3250,
    "5": 3750,
    "6": 4500,
    "7": 5250,
    "8": 6000,
    "9": 6750,
    "10": 7500,
    "11": 8250,
    "12": 9000,
    "13": 9750,
    "14": 10500,
    "15": 11250,
    "16": 12000,
    "17": 12750,
    "18": 13500,
    "19": 14250,
    "20": 15000
  },
  "8-day-sri-lanka-private-tour": {
    "1": 1490,
    "2": 1990,
    "3": 2400,
    "4": 3200,
    "5": 3650,
    "6": 4200
  },
  "ella-day-tour": {
    "1": 266,
    "2": 350,
    "3": 420,
    "4": 580,
    "5": 633,
    "6": 750
  },
  "galle-day-tour": {
    "1": 150,
    "2": 190,
    "3": 230,
    "4": 260,
    "5": 290,
    "6": 320,
    "7": 350,
    "8": 390,
    "9": 420,
    "10": 450,
    "11": 480,
    "12": 510,
    "13": 530,
    "14": 570,
    "15": 610,
    "16": 640,
    "17": 680,
    "18": 710,
    "19": 740,
    "20": 780
  },
  "kandy-day-tour": {
    "1": 200,
    "2": 250,
    "3": 300,
    "4": 350,
    "5": 400,
    "6": 450,
    "7": 500,
    "8": 390,
    "9": 420,
    "10": 450,
    "11": 480,
    "12": 510,
    "13": 530,
    "14": 570,
    "15": 610,
    "16": 640,
    "17": 680,
    "18": 710,
    "19": 740,
    "20": 780
  },
  "sigiriya-day-tour": {
    "1": 240,
    "2": 266,
    "3": 340,
    "4": 410,
    "5": 470,
    "6": 520
  }
} as const;

/** Party-of-2 totals from US*.json price["2"]. */
export const US_TOUR_PARTY2_TOTALS: Readonly<Record<string, number>> = {
  "10-day-sri-lanka-tour": 2200,
  "2-day-ella-kandy-private-tour-sri-lanka": 570,
  "2-day-ella-yala-private-tour-sri-lanka": 550,
  "4-day-sri-lanka-tour": 1300,
  "5-day-sri-lanka-tour": 1400,
  "6-day-sri-lanka-private-tour": 1700,
  "7-day-sri-lanka-tour": 1875,
  "8-day-sri-lanka-private-tour": 1990,
  "ella-day-tour": 350,
  "galle-day-tour": 190,
  "kandy-day-tour": 250,
  "sigiriya-day-tour": 266
} as const;

export function getStaticUsPriceMap(filecode: string): Record<string, number> {
  const map = US_TOUR_PRICE_MAPS[filecode];
  return map ? { ...map } : {};
}

export function getStaticUsParty2Total(filecode: string): number {
  return US_TOUR_PARTY2_TOTALS[filecode] ?? 0;
}
