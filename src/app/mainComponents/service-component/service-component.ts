import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { PageHeaderComponent } from '../../ui/page-header/page-header.component';

@Component({
  selector: 'app-service-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, PageHeaderComponent],
  templateUrl: './service-component.html',
  styleUrl: './service-component.css',
})
export class ServiceComponent implements OnInit {
  homeLink: any[] = ['/', 'en'];
  homeLabel = 'Home';
  private readonly localizedRouter = inject(LocalizedRouterService);
  private readonly transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    const lang = this.transloco.getActiveLang() || 'en';
    this.transloco.load(`services/${lang}`).subscribe();
    this.transloco.load(`common/${lang}`).subscribe(() => {
      this.homeLabel = this.transloco.translate('nav.home', {}, 'common') || 'Home';
    });
  }
}
