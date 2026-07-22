import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AVAILABLE_LANGS, AppLang } from './language.constants';
import { LocalizedRouterService } from './localized-router.service';
import { RouteId } from './route-map';
import { TourId } from './tour-slug-map';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly transloco = inject(TranslocoService);
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly document = inject(DOCUMENT);

  async applyPageSeo(options: {
    routeId: RouteId;
    lang: AppLang;
    tourTitle?: string;
    tourDescription?: string;
    tourId?: TourId;
    filecode?: string;
  }): Promise<void> {
    const { routeId, lang, tourTitle, tourDescription, tourId, filecode } = options;

    try {
      await firstValueFrom(this.transloco.load(`seo/${lang}`));
    } catch {
      /* ignore missing seo pack */
    }

    const pageTitle =
      tourTitle || this.readSeoKey(routeId, 'title') || 'CEYLON JOJO TRAVElS';
    const pageDescription =
      tourDescription || this.readSeoKey(routeId, 'description') || '';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: pageDescription });

    const canonical = this.localizedRouter.absoluteUrlFor(routeId, {
      lang,
      tourId,
      filecode,
    });

    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: this.ogLocale(lang) });
    this.setCanonical(canonical);
    this.setHtmlLang(lang);
    this.setHreflang(routeId, tourId, filecode);
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }

  private readSeoKey(routeId: string, field: 'title' | 'description'): string {
    const key = `${routeId}.${field}`;
    const scoped = this.transloco.translate(key, {}, 'seo');
    if (scoped && scoped !== key) {
      return scoped;
    }
    const translation = this.transloco.getTranslation(`seo/${this.transloco.getActiveLang()}`);
    return translation?.[key] ? String(translation[key]) : '';
  }

  private setHtmlLang(lang: AppLang): void {
    this.document.documentElement.lang = lang;
    this.meta.updateTag({ httpEquiv: 'content-language', content: lang });
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setHreflang(routeId: RouteId, tourId?: TourId, filecode?: string): void {
    this.document.querySelectorAll("link[rel='alternate'][hreflang]").forEach((el) => el.remove());

    for (const lang of AVAILABLE_LANGS) {
      const href = this.localizedRouter.absoluteUrlFor(routeId, { lang, tourId, filecode });
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', href);
      this.document.head.appendChild(link);
    }

    const xDefault = this.document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute(
      'href',
      this.localizedRouter.absoluteUrlFor(routeId, { lang: 'en', tourId, filecode }),
    );
    this.document.head.appendChild(xDefault);
  }

  private ogLocale(lang: AppLang): string {
    const map: Record<AppLang, string> = {
      en: 'en_US',
      de: 'de_DE',
      fr: 'fr_FR',
      it: 'it_IT',
      es: 'es_ES',
      pl: 'pl_PL',
      ru: 'ru_RU',
    };
    return map[lang];
  }
}
