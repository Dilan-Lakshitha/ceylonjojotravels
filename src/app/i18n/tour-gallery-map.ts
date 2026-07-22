import gallery from './tour-gallery-map.json';
import { TourId } from './tour-slug-map';

export const TOUR_GALLERY_MAP: Record<TourId, string[]> = gallery as Record<TourId, string[]>;

export function galleryForTour(tourId: TourId): string[] {
  return TOUR_GALLERY_MAP[tourId] ?? [];
}
