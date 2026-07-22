import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, UrlTree } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { AppLang, DEFAULT_LANG, isAppLang } from './language.constants';
import { RouteId, ROUTE_MAP, resolveRouteIdFromSegment, segmentFor } from './route-map';
import { resolveTourIdFromSlug, slugForTour, TourId, TOUR_SLUG_MAP } from './tour-slug-map';

export interface ResolvedLocation {
  lang: AppLang;
  routeId: RouteId;
  tourId?: TourId;
  filecode?: string;
}

@Injectable({ providedIn: 'root' })
export class LocalizedRouterService {
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly platformId = inject(PLATFORM_ID);

  currentLang(): AppLang {
    const lang = this.transloco.getActiveLang();
    return isAppLang(lang) ? lang : DEFAULT_LANG;
  }

  /** Build router commands for a stable route (optionally with tour / booking params). */
  commandsFor(
    routeId: RouteId,
    options?: { lang?: AppLang; tourId?: TourId; filecode?: string },
  ): any[] {
    const lang = options?.lang ?? this.currentLang();
    const segment = segmentFor(routeId, lang);

    if (routeId === 'home') {
      return ['/', lang];
    }

    if (routeId === 'tours' && options?.tourId) {
      return ['/', lang, segment, slugForTour(options.tourId, lang)];
    }

    if (routeId === 'booking' && options?.filecode) {
      return ['/', lang, segment, options.filecode];
    }

    return ['/', lang, segment];
  }

  urlFor(
    routeId: RouteId,
    options?: { lang?: AppLang; tourId?: TourId; filecode?: string },
  ): string {
    const commands = this.commandsFor(routeId, options);
    return commands.join('/').replace(/\/+/g, '/').replace(':/', '://') || '/';
  }

  absoluteUrlFor(
    routeId: RouteId,
    options?: { lang?: AppLang; tourId?: TourId; filecode?: string },
  ): string {
    const path = this.router.serializeUrl(this.router.createUrlTree(this.commandsFor(routeId, options)));
    return `https://ceylonjojotravels.com${path}`;
  }

  navigateTo(
    routeId: RouteId,
    options?: { lang?: AppLang; tourId?: TourId; filecode?: string; state?: unknown },
  ): Promise<boolean> {
    return this.router.navigate(this.commandsFor(routeId, options), {
      state: options?.state as any,
    });
  }

  /** Switch language while preserving current stable route + entity. */
  switchLanguage(targetLang: AppLang): Promise<boolean> {
    const resolved = this.resolveFromUrl(this.router.url);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('preferred_lang', targetLang);
    }
    this.transloco.setActiveLang(targetLang);

    if (!resolved) {
      return this.router.navigate(['/', targetLang]);
    }

    return this.navigateTo(resolved.routeId, {
      lang: targetLang,
      tourId: resolved.tourId,
      filecode: resolved.filecode,
    });
  }

  resolveFromUrl(url: string): ResolvedLocation | null {
    const tree = this.router.parseUrl(url);
    const primary = tree.root.children['primary'];
    if (!primary) {
      return null;
    }

    const segments = primary.segments.map((s) => s.path);
    if (segments.length === 0) {
      return null;
    }

    const langSeg = segments[0];
    if (!isAppLang(langSeg)) {
      return null;
    }

    if (segments.length === 1) {
      return { lang: langSeg, routeId: 'home' };
    }

    const pageSeg = segments[1];
    const routeId = resolveRouteIdFromSegment(pageSeg);
    if (!routeId) {
      return { lang: langSeg, routeId: 'home' };
    }

    if (routeId === 'tours' && segments[2]) {
      const tourId = resolveTourIdFromSlug(segments[2]);
      return { lang: langSeg, routeId, tourId: tourId ?? undefined };
    }

    if (routeId === 'booking' && segments[2]) {
      return { lang: langSeg, routeId, filecode: segments[2] };
    }

    return { lang: langSeg, routeId };
  }

  /** All alternate language URLs for the current location (hreflang). */
  alternateUrls(url: string = this.router.url): { lang: AppLang; url: string }[] {
    const resolved = this.resolveFromUrl(url);
    if (!resolved) {
      return (Object.keys(ROUTE_MAP.home) as AppLang[]).map((lang) => ({
        lang,
        url: this.absoluteUrlFor('home', { lang }),
      }));
    }

    return (Object.keys(ROUTE_MAP.home) as AppLang[]).map((lang) => ({
      lang,
      url: this.absoluteUrlFor(resolved.routeId, {
        lang,
        tourId: resolved.tourId,
        filecode: resolved.filecode,
      }),
    }));
  }

  tourLinkCommands(tourId: TourId, lang?: AppLang): any[] {
    return this.commandsFor('tours', { tourId, lang });
  }

  /** True if slug is valid for any language. */
  isKnownTourSlug(slug: string): boolean {
    return resolveTourIdFromSlug(slug) !== null;
  }

  createUrlTreeFor(
    routeId: RouteId,
    options?: { lang?: AppLang; tourId?: TourId; filecode?: string },
  ): UrlTree {
    return this.router.createUrlTree(this.commandsFor(routeId, options));
  }
}
