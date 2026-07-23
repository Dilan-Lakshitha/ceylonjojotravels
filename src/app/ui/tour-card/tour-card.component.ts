import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { resolveTourCardMeta, TourTypeKey } from '../../i18n/tour-card-meta';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TourCardComponent {
  @Input() image = '';
  @Input() days = '';
  @Input() persons = '';
  @Input() rating = 5;
  @Input() price = 0;
  @Input() title = '';
  /** Optional full override — when set, tour facts are ignored */
  @Input() subtitle = '';
  /** Localized tour type label override */
  @Input() tourType = '';
  @Input() tourTypeKey: TourTypeKey | '' = '';
  /** Hotel stars from itinerary. null = no hotel. undefined = resolve from tourId/filecode meta */
  @Input() hotelRating: number | null | undefined = undefined;
  @Input() transportIncluded: boolean | undefined = undefined;
  /** Used to look up audited subtitle facts when inputs are incomplete */
  @Input() tourId = '';
  @Input() filecode = '';
  @Input() routerLink: any;
  @Input() isBestseller = false;
  @Input() isLimited = false;

  get displayPrice(): number {
    return Math.round((this.price || 0) / 2);
  }

  /**
   * Builds subtitle from tour facts:
   * Private Tour • 4★ Hotels • Transport Included
   * or Private Day Tour • Transport Included (no hotel).
   * Never hardcodes hotel stars.
   */
  displaySubtitle(t: (key: string) => string): string {
    if (this.subtitle?.trim()) {
      return this.subtitle.trim();
    }

    const meta =
      resolveTourCardMeta(this.tourId) ??
      resolveTourCardMeta(this.filecode) ??
      null;

    const typeKey = this.tourTypeKey || meta?.tourTypeKey || '';
    const typeLabel =
      this.tourType?.trim() ||
      (typeKey ? t(`card.${typeKey}`) : '');

    const hotel =
      this.hotelRating !== undefined ? this.hotelRating : (meta?.hotelRating ?? null);

    const transport =
      this.transportIncluded !== undefined
        ? this.transportIncluded
        : (meta?.transportIncluded ?? false);

    const parts: string[] = [];

    if (typeLabel) {
      parts.push(typeLabel);
    }

    if (hotel != null && hotel > 0) {
      const stars = Number.isInteger(hotel) ? String(hotel) : String(hotel);
      parts.push(`${stars}★ ${t('card.hotels')}`);
    }

    if (transport) {
      parts.push(t('card.transportIncluded'));
    }

    return parts.join(' • ');
  }
}
