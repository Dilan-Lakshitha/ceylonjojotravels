import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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
export class LayoutComponent implements OnInit {
  activeLang: AppLang = 'en';
  readonly langs = AVAILABLE_LANGS;
  navOpen = false;
  langMenuOpen = false;

  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);

  homeLink: any[] = ['/', 'en'];
  toursLink: any[] = ['/', 'en', 'tours'];
  servicesLink: any[] = ['/', 'en', 'our-services'];
  aboutLink: any[] = ['/', 'en', 'about-us'];
  contactLink: any[] = ['/', 'en', 'contact'];
  destinationsLink: any[] = ['/', 'en', 'destinations'];
  guidesLink: any[] = ['/', 'en', 'travel-guides'];
  testimonialsLink: any[] = ['/', 'en', 'customer-testimonials'];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.activeLang = this.localizedRouter.currentLang();
    this.refreshLinks();
    this.transloco.langChanges$.subscribe((lang) => {
      if (isAppLang(lang)) {
        this.activeLang = lang;
        this.refreshLinks();
      }
    });
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

  selectLang(lang: AppLang): void {
    this.langMenuOpen = false;
    this.changeLang(lang);
  }

  changeLang(lang: AppLang): void {
    if (lang === this.activeLang) {
      return;
    }
    this.activeLang = lang;
    this.localizedRouter.switchLanguage(lang);
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
