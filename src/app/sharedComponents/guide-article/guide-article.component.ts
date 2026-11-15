import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { AppLang, isAppLang } from '../../i18n/language.constants';
import { GuideId, isGuideReady, resolveGuideIdFromSlug } from '../../i18n/guide-slug-map';
import { GuideArticle, GuideContentService } from '../../i18n/guide-content.service';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';
import { TourId } from '../../i18n/tour-slug-map';

const TOUR_LINK_LABELS: Partial<Record<TourId, string>> = {
  '7-day-sri-lanka-tour': '7 day Sri Lanka private tour',
  '10-day-sri-lanka-tour': '10 day Sri Lanka private tour',
  '2-day-ella-yala-private-tour-sri-lanka': '2 day Ella and Yala safari',
};

@Component({
  selector: 'app-guide-article',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, PageHeaderComponent],
  templateUrl: './guide-article.component.html',
  styleUrl: './guide-article.component.css',
})
export class GuideArticleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly guides = inject(GuideContentService);
  private readonly seo = inject(SeoService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);

  article: GuideArticle | null = null;
  guideId: GuideId | null = null;
  homeLink: any[] = ['/', 'en'];
  guidesLink: any[] = ['/', 'en', 'travel-guides'];
  toursLink: any[] = ['/', 'en', 'tours'];
  contactLink: any[] = ['/', 'en', 'contact'];
  homeLabel = 'Home';
  guidesLabel = 'Travel guides';
  whatsappHref = 'https://wa.me/447375612946';

  ngOnInit(): void {
    const lang = this.localizedRouter.currentLang();
    const safeLang: AppLang = isAppLang(lang) ? lang : 'en';

    this.homeLink = this.localizedRouter.commandsFor('home');
    this.guidesLink = this.localizedRouter.commandsFor('guides');
    this.toursLink = this.localizedRouter.commandsFor('tours');
    this.contactLink = this.localizedRouter.commandsFor('contact');

    this.transloco.load(`common/${safeLang}`).subscribe(() => {
      this.homeLabel = this.transloco.translate('nav.home', {}, 'common') || 'Home';
      this.guidesLabel = this.transloco.translate('nav.guides', {}, 'common') || 'Travel guides';
    });

    const fromData = this.route.snapshot.data['guideId'] as GuideId | undefined;
    const slug = this.route.snapshot.paramMap.get('guideSlug') || '';
    const guideId = fromData || resolveGuideIdFromSlug(slug);

    if (!guideId || !isGuideReady(guideId, safeLang)) {
      void this.seo.applyNotFoundSeo();
      return;
    }

    this.guideId = guideId;
    this.guides.getArticle(guideId, safeLang).subscribe((article) => {
      this.article = article;
      if (!article) {
        void this.seo.applyNotFoundSeo();
        return;
      }
      void this.seo.applyGuideArticleSeo({
        lang: safeLang,
        guideId,
        title: article.seoTitle,
        description: article.seoDescription,
        faq: article.faq,
        lastUpdated: article.lastUpdated,
      });
    });
  }

  tourLink(tourId: TourId): any[] {
    return this.localizedRouter.tourLinkCommands(tourId);
  }

  tourLabel(tourId: TourId): string {
    return TOUR_LINK_LABELS[tourId] || tourId.replace(/-/g, ' ');
  }
}
