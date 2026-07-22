import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

@Component({
  selector: 'app-service-component',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: './service-component.html',
  styleUrl: './service-component.css',
})
export class ServiceComponent implements OnInit {
  homeLink: any[] = ['/', 'en'];
  private readonly localizedRouter = inject(LocalizedRouterService);

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
  }
}
