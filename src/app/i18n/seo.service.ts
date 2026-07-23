import { Injectable, inject, DOCUMENT } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AVAILABLE_LANGS, AppLang } from './language.constants';
import { LocalizedRouterService } from './localized-router.service';
import { RouteId } from './route-map';
import { TourId } from './tour-slug-map';

const JSON_LD_ATTR = 'data-cj-jsonld';

export interface TourJsonLdInput {
  title: string;
  description?: string;
  overview?: string;
  price?: number;
  duration?: string;
  image?: string;
  faq?: Array<{ question: string; answer: string }>;
  reviews?: Array<{ author: string; reviewBody: string; ratingValue?: number }>;
  aggregateRating?: { ratingValue: number; reviewCount: number };
}

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
    tourJsonLd?: TourJsonLdInput;
  }): Promise<void> {
    const { routeId, lang, tourTitle, tourDescription, tourId, filecode, tourJsonLd } = options;

    try {
      await firstValueFrom(this.transloco.load(`seo/${lang}`));
      await firstValueFrom(this.transloco.load(`common/${lang}`));
    } catch {
      /* ignore missing packs */
    }

    const pageTitle =
      tourTitle || this.readSeoKey(routeId, 'title') || 'CEYLON JOJO TRAVElS';
    const pageDescription =
      tourDescription || this.readSeoKey(routeId, 'description') || '';

    this.title.setTitle(pageTitle);
    this.meta.updateTag({ name: 'description', content: pageDescription });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: pageDescription });
    this.meta.updateTag({ property: 'og:type', content: tourId ? 'product' : 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: pageDescription });

    const canonical = this.localizedRouter.absoluteUrlFor(routeId, {
      lang,
      tourId,
      filecode,
    });

    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:locale', content: this.ogLocale(lang) });
    const DEFAULT_OG = 'https://ceylonjojotravels.com/assets/img/package-2.jpg';
    const imageSrc = tourJsonLd?.image
      ? tourJsonLd.image.startsWith('http')
        ? tourJsonLd.image
        : `https://ceylonjojotravels.com/${tourJsonLd.image.replace(/^\//, '')}`
      : DEFAULT_OG;
    this.meta.updateTag({ property: 'og:image', content: imageSrc });
    this.meta.updateTag({ name: 'twitter:image', content: imageSrc });

    this.setCanonical(canonical);
    this.setHtmlLang(lang);
    this.setHreflang(routeId, tourId, filecode);
    this.meta.updateTag({
      name: 'robots',
      content: routeId === 'booking' || routeId === 'bookingSuccess' ? 'noindex, nofollow' : 'index, follow',
    });

    this.applyJsonLd({
      routeId,
      lang,
      canonical,
      pageTitle,
      pageDescription,
      tourId,
      tourJsonLd,
    });
  }

  private applyJsonLd(opts: {
    routeId: RouteId;
    lang: AppLang;
    canonical: string;
    pageTitle: string;
    pageDescription: string;
    tourId?: TourId;
    tourJsonLd?: TourJsonLdInput;
  }): void {
    this.clearJsonLd();

    const orgId = 'https://ceylonjojotravels.com/#organization';
    const websiteId = 'https://ceylonjojotravels.com/#website';

    this.upsertJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      '@id': orgId,
      name: 'CEYLON JOJO TRAVElS',
      url: 'https://ceylonjojotravels.com',
      logo: 'https://ceylonjojotravels.com/assets/img/logo.png',
      email: 'ceylonjojotravels@gmail.com',
      telephone: '+447375612946',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'LK',
        addressLocality: 'Kalutara',
        streetAddress: 'No 111/3, Dediyawala Rd, Maha Waskaduwa',
      },
      sameAs: [
        'https://www.facebook.com/',
        'https://www.instagram.com/',
        'https://www.tripadvisor.com/',
      ],
    });

    this.upsertJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      url: 'https://ceylonjojotravels.com',
      name: 'CEYLON JOJO TRAVElS',
      publisher: { '@id': orgId },
      inLanguage: AVAILABLE_LANGS,
    });

    const crumbs = this.buildBreadcrumbs(opts.routeId, opts.lang, opts.tourId, opts.pageTitle);
    this.upsertJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    });

    if (opts.tourId && opts.tourJsonLd) {
      const tour = opts.tourJsonLd;
      const product: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': ['Product', 'TouristTrip'],
        name: tour.title,
        description: tour.description || tour.overview || opts.pageDescription,
        brand: { '@id': orgId },
        url: opts.canonical,
        touristType: 'Leisure travelers',
      };
      if (tour.duration) {
        product['itinerary'] = {
          '@type': 'ItemList',
          name: `${tour.title} itinerary`,
          description: tour.duration,
        };
      }
      if (tour.image) {
        product['image'] = tour.image.startsWith('http')
          ? tour.image
          : `https://ceylonjojotravels.com/${tour.image.replace(/^\//, '')}`;
      }
      if (typeof tour.price === 'number' && tour.price > 0) {
        product['offers'] = {
          '@type': 'Offer',
          priceCurrency: 'USD',
          price: tour.price,
          availability: 'https://schema.org/InStock',
          url: opts.canonical,
        };
      }
      if (tour.aggregateRating) {
        product['aggregateRating'] = {
          '@type': 'AggregateRating',
          ratingValue: tour.aggregateRating.ratingValue,
          reviewCount: tour.aggregateRating.reviewCount,
          bestRating: 5,
          worstRating: 1,
        };
      }
      if (tour.reviews?.length) {
        product['review'] = tour.reviews.map((r) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.author },
          reviewBody: r.reviewBody,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: r.ratingValue ?? 5,
            bestRating: 5,
          },
        }));
      }
      this.upsertJsonLd('tour', product);

      if (tour.faq?.length) {
        this.upsertJsonLd('faq', {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: tour.faq.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        });
      }
    }
  }

  private buildBreadcrumbs(
    routeId: RouteId,
    lang: AppLang,
    tourId: TourId | undefined,
    pageTitle: string,
  ): Array<{ name: string; item: string }> {
    const homeName =
      this.transloco.translate('nav.home', {}, 'common') ||
      this.readCommonFallback('nav.home') ||
      'Home';
    const crumbs: Array<{ name: string; item: string }> = [
      {
        name: homeName,
        item: this.localizedRouter.absoluteUrlFor('home', { lang }),
      },
    ];

    if (routeId === 'home') {
      return crumbs;
    }

    if (tourId) {
      const toursName =
        this.transloco.translate('nav.tours', {}, 'common') ||
        this.readCommonFallback('nav.tours') ||
        'Tours';
      crumbs.push({
        name: toursName,
        item: this.localizedRouter.absoluteUrlFor('tours', { lang }),
      });
      crumbs.push({
        name: pageTitle,
        item: this.localizedRouter.absoluteUrlFor('tours', { lang, tourId }),
      });
      return crumbs;
    }

    crumbs.push({
      name: pageTitle,
      item: this.localizedRouter.absoluteUrlFor(routeId, { lang }),
    });
    return crumbs;
  }

  private readCommonFallback(key: string): string {
    const translation = this.transloco.getTranslation(`common/${this.transloco.getActiveLang()}`);
    return translation?.[key] ? String(translation[key]) : '';
  }

  private clearJsonLd(): void {
    this.document
      .querySelectorAll(`script[${JSON_LD_ATTR}]`)
      .forEach((el) => el.parentNode?.removeChild(el));
  }

  private upsertJsonLd(id: string, data: Record<string, unknown>): void {
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(JSON_LD_ATTR, id);
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
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
