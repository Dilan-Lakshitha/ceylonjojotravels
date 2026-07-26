import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { forkJoin, map, of } from 'rxjs';

/**
 * Preload home above-the-fold translation scopes before first render
 * so prerendered HTML includes real copy (not blank keys).
 */
export const homeI18nResolver: ResolveFn<boolean> = () => {
  const transloco = inject(TranslocoService);
  const lang = transloco.getActiveLang() || 'en';

  return forkJoin([
    transloco.load(`common/${lang}`),
    transloco.load(`home/${lang}`),
    transloco.load(`about/${lang}`),
    transloco.load(`destinations/${lang}`),
  ]).pipe(map(() => true));
};

/** Lightweight scope preload for generic marketing pages. */
export const pageI18nResolver = (scopes: string[]): ResolveFn<boolean> => {
  return () => {
    const transloco = inject(TranslocoService);
    const lang = transloco.getActiveLang() || 'en';
    if (!scopes.length) {
      return of(true);
    }
    return forkJoin(scopes.map((scope) => transloco.load(`${scope}/${lang}`))).pipe(
      map(() => true),
    );
  };
};
