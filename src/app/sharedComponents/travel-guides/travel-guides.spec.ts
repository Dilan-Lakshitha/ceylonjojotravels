import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { TravelGuides } from './travel-guides';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

describe('TravelGuides', () => {
  let component: TravelGuides;
  let fixture: ComponentFixture<TravelGuides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelGuides],
      providers: [
        provideRouter([]),
        {
          provide: TranslocoService,
          useValue: {
            load: () => of({}),
            translate: (key: string) => key,
            getActiveLang: () => 'en',
          },
        },
        {
          provide: SeoService,
          useValue: { applyPageSeo: () => Promise.resolve() },
        },
        {
          provide: LocalizedRouterService,
          useValue: {
            currentLang: () => 'en',
            commandsFor: (routeId: string) =>
              routeId === 'home' ? ['/', 'en'] : ['/', 'en', routeId],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TravelGuides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
