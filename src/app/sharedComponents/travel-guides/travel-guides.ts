import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { AppLang, isAppLang } from '../../i18n/language.constants';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';

type GuideId = 'danula' | 'dilan' | 'samith' | 'yohan';

@Component({
  selector: 'app-travel-guides',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, PageHeaderComponent],
  templateUrl: './travel-guides.html',
  styleUrl: './travel-guides.css',
})
export class TravelGuides implements OnInit {
  private readonly transloco = inject(TranslocoService);
  private readonly seo = inject(SeoService);
  private readonly localizedRouter = inject(LocalizedRouterService);

  homeLink: any[] = ['/', 'en'];
  toursLink: any[] = ['/', 'en', 'tours'];
  contactLink: any[] = ['/', 'en', 'contact'];
  homeLabel = 'Home';

  readonly guideIds: GuideId[] = ['danula', 'dilan', 'samith', 'yohan'];
  readonly whyIds = [1, 2, 3, 4] as const;
  readonly tipIds = [1, 2, 3, 4] as const;

  readonly guideImages: Record<GuideId, string> = {
    danula: 'assets/img/Team/1.jpg',
    dilan: 'assets/img/Team/2.jpg',
    samith: 'assets/img/Team/3.jpg',
    yohan: 'assets/img/Team/4.jpg',
  };

  ngOnInit(): void {
    const lang = this.localizedRouter.currentLang();
    const safeLang: AppLang = isAppLang(lang) ? lang : 'en';

    this.homeLink = this.localizedRouter.commandsFor('home');
    this.toursLink = this.localizedRouter.commandsFor('tours');
    this.contactLink = this.localizedRouter.commandsFor('contact');

    this.transloco.load(`common/${safeLang}`).subscribe(() => {
      this.homeLabel = this.transloco.translate('nav.home', {}, 'common') || 'Home';
    });
    this.transloco.load(`guides/${safeLang}`).subscribe();
    void this.seo.applyPageSeo({ routeId: 'guides', lang: safeLang });
  }
}
