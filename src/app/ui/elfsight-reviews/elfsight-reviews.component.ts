import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ElfsightLoaderService } from '../../Services/elfsight-loader.service';

const DEFAULT_WIDGET_ID = '0b6d4072-a733-446b-8aaa-c737f5a83c4a';

/**
 * Lazy Elfsight reviews: mounts only when near the viewport, and only after
 * hydration is stable — so it does not hurt LCP or throw styled-components errors.
 */
@Component({
  selector: 'app-elfsight-reviews',
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.elfsight-reviews--flush]': 'flush',
  },
  template: `
    <section class="elfsight-reviews" [attr.aria-labelledby]="heading ? headingId : null">
      <h2 *ngIf="heading" [id]="headingId" class="elfsight-reviews__title">{{ heading }}</h2>
      <div #mount class="elfsight-reviews__mount" aria-busy="true"></div>
    </section>
  `,
  styles: [
    `
      .elfsight-reviews {
        margin-top: 2.75rem;
        padding: 1.75rem 0 2.5rem;
        border-top: 1px solid #e6ece9;
      }
      :host.elfsight-reviews--flush .elfsight-reviews {
        margin-top: 0;
        padding: 0;
        border-top: 0;
      }
      .elfsight-reviews__title {
        margin: 0 0 1.25rem;
        font-size: 1.35rem;
        font-weight: 800;
        text-align: center;
      }
      .elfsight-reviews__mount {
        min-height: 80px;
      }
    `,
  ],
})
export class ElfsightReviewsComponent implements AfterViewInit, OnDestroy {
  @Input() heading = '';
  @Input() widgetId = DEFAULT_WIDGET_ID;
  /** Extra top spacing off (e.g. home / testimonials already have section padding). */
  @Input() flush = false;

  @ViewChild('mount', { static: true }) mount?: ElementRef<HTMLElement>;

  readonly headingId = `elfsight-reviews-${Math.random().toString(36).slice(2, 9)}`;

  private readonly loader = inject(ElfsightLoaderService);
  private readonly ngZone = inject(NgZone);
  private observer?: IntersectionObserver;
  private activated = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const host = this.mount?.nativeElement;
    if (!host) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      if (typeof IntersectionObserver === 'undefined') {
        void this.activate();
        return;
      }
      this.observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) {
            return;
          }
          this.observer?.disconnect();
          this.observer = undefined;
          void this.activate();
        },
        { rootMargin: '180px 0px' },
      );
      this.observer.observe(host);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private async activate(): Promise<void> {
    if (this.activated) {
      return;
    }
    this.activated = true;

    const host = this.mount?.nativeElement;
    if (!host || host.querySelector(`[class^="elfsight-app-"]`)) {
      await this.loader.ensurePlatform();
      return;
    }

    // Mount once — remounting causes Elfsight styled-components error #17.
    const widget = document.createElement('div');
    widget.className = `elfsight-app-${this.widgetId}`;
    widget.setAttribute('data-elfsight-app-lazy', '');
    host.appendChild(widget);
    host.removeAttribute('aria-busy');

    await this.loader.ensurePlatform();
  }
}
