import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { Observable } from 'rxjs';

/**
 * Loads scoped JSON from assets/i18n/${lang}/${scope}.json.
 * Transloco scope paths arrive as `${scope}/${lang}` (e.g. common/en).
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);

  getTranslation(langPath: string): Observable<Translation> {
    if (langPath.includes('/')) {
      const [scope, lang] = langPath.split('/');
      return this.http.get<Translation>(`assets/i18n/${lang}/${scope}.json`);
    }

    return this.http.get<Translation>(`assets/i18n/${langPath}/common.json`);
  }
}
