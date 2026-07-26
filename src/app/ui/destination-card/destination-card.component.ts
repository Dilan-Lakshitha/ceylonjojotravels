import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface DestinationHighlight {
  icon: string;
  label: string;
}

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './destination-card.component.html',
  styleUrl: './destination-card.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DestinationCardComponent {
  @Input() image = '';
  /** Optional responsive srcset, e.g. "img-480.jpg 480w, img-960.jpg 960w" */
  @Input() srcset = '';
  /** Card images render ~350px wide — keep sizes honest so 360w is selected. */
  @Input() sizes = '350px';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() badge = '';
  @Input() alt = '';
  @Input() ctaLabel = 'Explore Tours';
  @Input() featured = false;
  @Input() featuredLabel = 'Featured';
  @Input() wishlistLabel = 'Save destination';
  /** @deprecated unused — stats row removed */
  @Input() rating = '';
  /** @deprecated unused — stats row removed */
  @Input() tourCount = '';
  /** @deprecated unused — stats row removed */
  @Input() duration = '';
  @Input() highlights: DestinationHighlight[] = [];
  @Input() routerLink: any;
  /** @deprecated kept for backward compatibility — unused in premium card */
  @Input() description = '';
  /** @deprecated */
  @Input() includedLabel = '';
  /** @deprecated */
  @Input() packages = '';

  @Output() activate = new EventEmitter<void>();
  @Output() wishlist = new EventEmitter<MouseEvent>();

  wishlisted = false;

  /** Base path without extension when image is a destination-*.jpg asset. */
  private get imageBase(): string | null {
    const match = this.image.match(/^(assets\/img\/destination-\d+)\.(jpe?g|png|webp)$/i);
    return match ? match[1] : null;
  }

  get resolvedJpgSrc(): string {
    const base = this.imageBase;
    return base ? `${base}-360.jpg` : this.image;
  }

  get resolvedJpgSrcset(): string | null {
    if (this.srcset) {
      return this.srcset;
    }
    const base = this.imageBase;
    // Match ~350 CSS px card width — avoid shipping 540w that Lighthouse flags as oversized.
    return base ? `${base}-360.jpg 360w` : null;
  }

  get resolvedWebpSrcset(): string | null {
    const base = this.imageBase;
    return base ? `${base}-360.webp 360w` : null;
  }

  onCardActivate(event?: Event): void {
    if (event) {
      const target = event.target as HTMLElement | null;
      if (target?.closest('.pdc__wish')) {
        return;
      }
    }
    this.activate.emit();
  }

  onWishlist(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlisted = !this.wishlisted;
    this.wishlist.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onCardActivate();
    }
  }
}
