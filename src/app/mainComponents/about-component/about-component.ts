import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { ContactUsComponent } from '../../sharedComponents/contact-us-component/contact-us-component';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule, ContactUsComponent, RouterModule, TranslocoModule],
  templateUrl: './about-component.html',
  styleUrl: './about-component.css',
})
export class AboutComponent implements OnInit {
  homecontact = true;
  homeLink: any[] = ['/', 'en'];
  contactLink: any[] = ['/', 'en', 'contact'];

  private readonly localizedRouter = inject(LocalizedRouterService);

  ngOnInit(): void {
    this.homeLink = this.localizedRouter.commandsFor('home');
    this.contactLink = this.localizedRouter.commandsFor('contact');
  }
}
