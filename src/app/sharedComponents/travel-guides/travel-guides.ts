import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { AppLang, isAppLang } from '../../i18n/language.constants';

@Component({
  selector: 'app-travel-guides',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './travel-guides.html',
  styleUrl: './travel-guides.css',
})
export class TravelGuides implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);
  private readonly localizedRouter = inject(LocalizedRouterService);

  guides = [
    { name: 'Danula Nimneth', country: 'United Kingdom', image: 'assets/img/Team/1.jpg' },
    { name: 'Dilan Lakshitha', country: 'Sri Lanka', image: 'assets/img/Team/2.png' },
    { name: 'Samith Suranga', country: 'Italy', image: 'assets/img/Team/3.jpg' },
    { name: 'Yohan Malshika', country: 'Malaysia', image: 'assets/img/Team/4.jpg' },
  ];

  ngOnInit(): void {
    const lang = this.localizedRouter.currentLang();
    this.transloco.load(`common/${lang}`).subscribe();
    const safeLang: AppLang = isAppLang(lang) ? lang : 'en';
    void this.seo.applyPageSeo({ routeId: 'guides', lang: safeLang });
  }
}
