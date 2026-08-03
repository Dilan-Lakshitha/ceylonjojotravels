import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SeoService } from '../../i18n/seo.service';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly localizedRouter = inject(LocalizedRouterService);

  homeLink: any[] = ['/', 'en'];

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    void this.seo.applyNotFoundSeo();
  }
}
