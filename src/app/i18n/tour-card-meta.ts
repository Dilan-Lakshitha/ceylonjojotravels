/**
 * Card subtitle facts audited from each itinerary / marketing package.
 * hotelRating is null when the tour has no overnight hotel (day tours).
 * Multi-day packages are 4★ based on titles + Accommodation extras
 * (occasional 3.5★ nights still marketed as 4★ packages).
 */
export type TourTypeKey = 'privateDayTour' | 'privateTour';

export interface TourCardMeta {
  tourTypeKey: TourTypeKey;
  hotelRating: number | null;
  transportIncluded: boolean;
}

export const TOUR_CARD_META: Record<string, TourCardMeta> = {
  'ella-day-tour': {
    tourTypeKey: 'privateDayTour',
    hotelRating: null,
    transportIncluded: true,
  },
  'galle-day-tour': {
    tourTypeKey: 'privateDayTour',
    hotelRating: null,
    transportIncluded: true,
  },
  'kandy-day-tour': {
    tourTypeKey: 'privateDayTour',
    hotelRating: null,
    transportIncluded: true,
  },
  'sigiriya-day-tour': {
    tourTypeKey: 'privateDayTour',
    hotelRating: null,
    transportIncluded: true,
  },
  '2-day-ella-yala-private-tour-sri-lanka': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '2-day-ella-kandy-private-tour-sri-lanka': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '4-day-sri-lanka-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '5-day-sri-lanka-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '6-day-sri-lanka-private-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '7-day-sri-lanka-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '10-day-sri-lanka-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
  '8-day-sri-lanka-private-tour': {
    tourTypeKey: 'privateTour',
    hotelRating: 4,
    transportIncluded: true,
  },
};

export function resolveTourCardMeta(tourId: string): TourCardMeta | null {
  return TOUR_CARD_META[tourId] ?? null;
}
