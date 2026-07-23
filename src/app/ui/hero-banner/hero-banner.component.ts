import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-banner">
      <img
        class="hero-banner__img"
        [src]="image"
        [alt]="alt || title"
        [attr.width]="width"
        [attr.height]="height"
        [attr.fetchpriority]="eager ? 'high' : null"
        [attr.loading]="eager ? 'eager' : 'lazy'"
      />
      <div class="hero-banner__caption">
        <div class="hero-banner__copy">
          <h1 class="hero-slot__title display-3 text-white mb-md-4" *ngIf="title">{{ title }}</h1>
          <p class="hero-slot__sub text-white mb-3" *ngIf="subtitle">{{ subtitle }}</p>
          <div class="hero-slot__cta">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .hero-banner {
        position: relative;
        width: 100%;
      }
      .hero-banner__img {
        width: 100%;
        height: auto;
        display: block;
        object-fit: cover;
        max-height: 100vh;
      }
      .hero-banner__caption {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: rgba(0, 0, 0, 0.35);
        padding: 1rem;
      }
      .hero-banner__copy {
        max-width: 900px;
      }
    `,
  ],
})
export class HeroBannerComponent {
  @Input() image = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Input() alt = '';
  @Input() eager = false;
  @Input() width = 1920;
  @Input() height = 1080;
}
