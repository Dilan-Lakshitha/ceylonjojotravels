import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { filter, Subscription } from 'rxjs';
import { ScrollToToComponent } from '../../sharedComponents/scroll-to-to-component/scroll-to-to-component';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { AVAILABLE_LANGS, AppLang, isAppLang } from '../../i18n/language.constants';

@Component({
  selector: 'app-layout-component',
  standalone: true,
  imports: [CommonModule, ScrollToToComponent, RouterModule, TranslocoModule],
  templateUrl: './layout-component.html',
  styleUrl: './layout-component.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  activeLang: AppLang = 'en';
  readonly langs = AVAILABLE_LANGS;
  navOpen = false;
  langMenuOpen = false;

  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly subs = new Subscription();

  homeLink: any[] = ['/', 'en'];
  toursLink: any[] = ['/', 'en', 'tours'];
  servicesLink: any[] = ['/', 'en', 'our-services'];
  aboutLink: any[] = ['/', 'en', 'about-us'];
  contactLink: any[] = ['/', 'en', 'contact'];
  destinationsLink: any[] = ['/', 'en', 'destinations'];
  guidesLink: any[] = ['/', 'en', 'travel-guides'];
  testimonialsLink: any[] = ['/', 'en', 'customer-testimonials'];
  /** Crawlable alternate URLs for the current page (one per language). */
  langLinks: Record<AppLang, any[]> = {
    en: ['/', 'en'],
    de: ['/', 'de'],
    fr: ['/', 'fr'],
    it: ['/', 'it'],
    es: ['/', 'es'],
    pl: ['/', 'pl'],
    ru: ['/', 'ru'],
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.activeLang = this.localizedRouter.currentLang();
    this.refreshLinks();
    this.subs.add(
      this.transloco.langChanges$.subscribe((lang) => {
        if (isAppLang(lang)) {
          this.activeLang = lang;
          this.refreshLinks();
        }
      }),
    );
    this.subs.add(
      this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
        this.refreshLangLinks();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  toggleNav(): void {
    this.navOpen = !this.navOpen;
    if (this.navOpen) {
      this.langMenuOpen = false;
    }
  }

  closeNav(): void {
    this.navOpen = false;
  }

  toggleLangMenu(): void {
    this.langMenuOpen = !this.langMenuOpen;
  }

  /** Persist preference when following a crawlable lang <a href>. */
  onLangNavigate(lang: AppLang): void {
    this.langMenuOpen = false;
    this.closeNav();
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferred_lang', lang);
    }
  }

  private refreshLinks(): void {
    const lang = this.activeLang;
    this.homeLink = this.localizedRouter.commandsFor('home', { lang });
    this.toursLink = this.localizedRouter.commandsFor('tours', { lang });
    this.servicesLink = this.localizedRouter.commandsFor('services', { lang });
    this.aboutLink = this.localizedRouter.commandsFor('about', { lang });
    this.contactLink = this.localizedRouter.commandsFor('contact', { lang });
    this.destinationsLink = this.localizedRouter.commandsFor('destinations', { lang });
    this.guidesLink = this.localizedRouter.commandsFor('guides', { lang });
    this.testimonialsLink = this.localizedRouter.commandsFor('testimonials', { lang });
    this.refreshLangLinks();
  }

  private refreshLangLinks(): void {
    const resolved = this.localizedRouter.resolveFromUrl(this.router.url);
    for (const lang of AVAILABLE_LANGS) {
      this.langLinks[lang] = resolved
        ? this.localizedRouter.commandsFor(resolved.routeId, {
            lang,
            tourId: resolved.tourId,
            filecode: resolved.filecode,
          })
        : ['/', lang];
    }
  }

  flagCode(lang: AppLang): string {
    return lang === 'en' ? 'us' : lang;
  }

  langTitle(lang: AppLang): string {
    const titles: Record<AppLang, string> = {
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      it: 'Italiano',
      es: 'Español',
      pl: 'Polski',
      ru: 'Русский',
    };
    return titles[lang];
  }
}
