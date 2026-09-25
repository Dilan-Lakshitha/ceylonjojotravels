import { Activity } from '../sharedComponents/tour-details-component/tour-details-component';

export type ItineraryPeriod = 'morning' | 'afternoon' | 'evening' | 'overnight';

export interface PeriodGroup {
  period: ItineraryPeriod;
  activities: Activity[];
}

function isOvernight(activity: Activity): boolean {
  const type = (activity.type || '').toLowerCase();
  const title = (activity.title?.title || '').toLowerCase();
  const desc = (activity.description || '').toLowerCase();
  return (
    type === 'accommodation' ||
    title.includes('overnight') ||
    desc.includes('overnight stay') ||
    desc.includes('overnight at')
  );
}

/**
 * Groups flat itinerary activities into Morning / Afternoon / Evening / Overnight.
 * Overnight = Accommodation (or overnight wording). Remaining activities split by order.
 */
export function groupActivitiesByPeriod(activities: Activity[] | undefined | null): PeriodGroup[] {
  const list = activities || [];
  const overnight = list.filter(isOvernight);
  const dayActs = list.filter((a) => !isOvernight(a));

  const groups: PeriodGroup[] = [];
  if (!dayActs.length) {
    if (overnight.length) {
      groups.push({ period: 'overnight', activities: overnight });
    }
    return groups;
  }

  if (dayActs.length === 1) {
    groups.push({ period: 'morning', activities: dayActs });
  } else if (dayActs.length === 2) {
    groups.push({ period: 'morning', activities: [dayActs[0]] });
    groups.push({ period: 'afternoon', activities: [dayActs[1]] });
  } else {
    const n = dayActs.length;
    const mEnd = Math.ceil(n / 3);
    const aEnd = Math.ceil((2 * n) / 3);
    groups.push({ period: 'morning', activities: dayActs.slice(0, mEnd) });
    groups.push({ period: 'afternoon', activities: dayActs.slice(mEnd, aEnd) });
    groups.push({ period: 'evening', activities: dayActs.slice(aEnd) });
  }

  if (overnight.length) {
    groups.push({ period: 'overnight', activities: overnight });
  }

  return groups.filter((g) => g.activities.length > 0);
}

export function deriveHighlights(
  itinerary: Array<{ activities?: Activity[] }> | undefined,
  limit = 6,
): string[] {
  const titles: string[] = [];
  for (const day of itinerary || []) {
    for (const act of day.activities || []) {
      if (isOvernight(act)) continue;
      const t = act.title?.title?.trim();
      if (t && !titles.includes(t)) {
        titles.push(t);
      }
      if (titles.length >= limit) {
        return titles;
      }
    }
  }
  return titles;
}

export function deriveAccommodationSummary(
  itinerary: Array<{ activities?: Activity[] }> | undefined,
): string[] {
  const stays: string[] = [];
  for (const day of itinerary || []) {
    for (const act of day.activities || []) {
      if (!isOvernight(act)) continue;
      const label =
        act.title?.title?.trim() ||
        act.description?.trim() ||
        (act.extra || []).join(', ');
      if (label && !stays.includes(label)) {
        stays.push(label);
      }
    }
  }
  return stays;
}

export function defaultTourFaqs(
  tour: {
    title?: string;
    duration?: string;
    tourType?: string;
    price?: number;
  },
  translate: (key: string, params?: Record<string, string>) => string,
): Array<{ question: string; answer: string }> {
  const name = tour.title || 'Sri Lanka';
  const duration = tour.duration || '';
  const type = tour.tourType || '';
  const price =
    typeof tour.price === 'number' && tour.price > 0
      ? translate('faq.price.from', { amount: String(Math.round(tour.price / 2)) })
      : translate('faq.price.fallback');

  return [
    {
      question: translate('faq.included.q', { name }),
      answer: translate('faq.included.a', { type, duration, name }),
    },
    {
      question: translate('faq.private.q'),
      answer: translate('faq.private.a'),
    },
    {
      question: translate('faq.price.q'),
      answer: translate('faq.price.a', { price }),
    },
    {
      question: translate('faq.custom.q'),
      answer: translate('faq.custom.a'),
    },
    {
      question: translate('faq.book.q'),
      answer: translate('faq.book.a'),
    },
  ];
}
