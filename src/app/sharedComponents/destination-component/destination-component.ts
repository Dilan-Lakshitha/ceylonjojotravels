import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { LocalizedRouterService } from '../../i18n/localized-router.service';
import { DestinationCardComponent } from '../../ui/destination-card/destination-card.component';

@Component({
  selector: 'app-destination-component',
  standalone: true,
  imports: [RouterModule, TranslocoModule, DestinationCardComponent],
  templateUrl: './destination-component.html',
  styleUrl: './destination-component.css',
})
export class DestinationComponent {
  constructor(private readonly localizedRouter: LocalizedRouterService) {}

  get toursLink(): any[] {
    return this.localizedRouter.commandsFor('tours');
  }

  goTours(): void {
    void this.localizedRouter.navigateTo('tours');
  }
}
