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

export function defaultTourFaqs(tour: {
  title?: string;
  duration?: string;
  tourType?: string;
  price?: number;
}): Array<{ question: string; answer: string }> {
  const name = tour.title || 'this Sri Lanka tour';
  const duration = tour.duration || 'your selected dates';
  const type = tour.tourType || 'private tour';
  const price =
    typeof tour.price === 'number' && tour.price > 0
      ? `From $${Math.round(tour.price / 2)} per person (based on 2 travelers)`
      : 'Pricing depends on group size';

  return [
    {
      question: `What is included in ${name}?`,
      answer: `This ${type} typically includes private air-conditioned transport, an experienced chauffeur guide, and the sightseeing outlined in the itinerary for ${duration}. Hotel category and meal plan (when applicable) are listed under Accommodation and Included.`,
    },
    {
      question: 'Is this a private tour?',
      answer: `Yes. Ceylon JOJO Travels operates private Sri Lanka tours for couples, families and small groups — you travel in your own vehicle on your schedule.`,
    },
    {
      question: 'How much does this tour cost?',
      answer: `${price}. Final price updates automatically when you select the number of travelers in the booking form.`,
    },
    {
      question: 'Can I customize the itinerary?',
      answer:
        'Yes. Tell us your hotel pick-up point, preferred pace, or must-see stops in Special Requests and we will tailor the plan before you travel.',
    },
    {
      question: 'How do I book and pay?',
      answer:
        'Complete the booking form on this page. Payment later (pay at destination) is available. You will receive a confirmation after submitting.',
    },
  ];
}
