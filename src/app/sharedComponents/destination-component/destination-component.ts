import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { LocalizedRouterService } from '../../i18n/localized-router.service';

@Component({
  selector: 'app-destination-component',
  imports: [RouterModule, TranslocoModule],
  providers: [provideTranslocoScope('destinations', 'common')],
  templateUrl: './destination-component.html',
  styleUrl: './destination-component.css'
})
export class DestinationComponent {
  constructor(private readonly localizedRouter: LocalizedRouterService) {}

  get toursLink(): any[] {
    return this.localizedRouter.commandsFor('tours');
  }
}
