import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { AppLang, isAppLang } from '../../i18n/language.constants';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './testimonial.html',
  styleUrl: './testimonial.css',
})
export class Testimonial implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);
  private readonly localizedRouter = inject(LocalizedRouterService);

  ngOnInit(): void {
    const lang = this.localizedRouter.currentLang();
    this.transloco.load(`common/${lang}`).subscribe();
    const safeLang: AppLang = isAppLang(lang) ? lang : 'en';
    void this.seo.applyPageSeo({ routeId: 'testimonials', lang: safeLang });
  }
}
