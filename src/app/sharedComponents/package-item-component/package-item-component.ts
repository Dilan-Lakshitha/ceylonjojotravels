import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TourTypeKey } from '../../i18n/tour-card-meta';
import { TourCardComponent } from '../../ui/tour-card/tour-card.component';

/**
 * Backward-compatible alias for legacy templates.
 * New code should use app-tour-card directly.
 */
@Component({
  selector: 'app-package-item-component',
  standalone: true,
  imports: [CommonModule, TourCardComponent],
  template: `
    <app-tour-card
      [image]="image"
      [days]="days"
      [persons]="persons"
      [rating]="rating"
      [price]="price"
      [title]="title"
      [tourId]="tourId || filecode"
      [filecode]="filecode || tourId"
      [tourType]="tourType"
      [tourTypeKey]="tourTypeKey"
      [hotelRating]="hotelRating"
      [transportIncluded]="transportIncluded"
      [routerLink]="routerLink"
      [isBestseller]="isBestseller"
      [isLimited]="isLimited"
    />
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
})
export class PackageItemComponent {
  @Input() image!: string;
  @Input() days!: string;
  @Input() persons!: string;
  @Input() rating!: number;
  @Input() price!: number;
  @Input() title!: string;
  @Input() tourId = '';
  @Input() filecode = '';
  @Input() tourType = '';
  @Input() tourTypeKey: TourTypeKey | '' = '';
  @Input() hotelRating: number | null | undefined = undefined;
  @Input() transportIncluded: boolean | undefined = undefined;
  @Input() routerLink: any;
  @Input() isBestseller = false;
  @Input() isLimited = false;
}
