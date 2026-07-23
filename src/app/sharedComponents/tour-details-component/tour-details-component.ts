import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { TourStatsComponent } from '../../ui/tour-stats/tour-stats.component';
import { AccordionPanelComponent } from '../../ui/accordion-panel/accordion-panel.component';

export interface Activity {
  type: string;
  title: title;
  description?: string;
  icon?: string;
  image?: string;
  extra?: string[];
}

export interface title {
  title?: string;
  icon?: string;
  color?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: Activity[];
}

export interface TourDetails {
  title: string;
  description: string;
  duration: string;
  persons: string;
  price: number;
  tourType?: string;
  overview?: string;
  itinerary?: ItineraryDay[];
  includes?: string[];
  excludes?: string[];
}

@Component({
  selector: 'app-tour-details-component',
  standalone: true,
  imports: [CommonModule, TranslocoModule, TourStatsComponent, AccordionPanelComponent],
  templateUrl: './tour-details-component.html',
  styleUrl: './tour-details-component.css',
})
export class TourDetailsComponent {
  @Input() tour!: TourDetails;

  expandedDays: { [key: number]: boolean } = {};
  selectedImage: string | null = null;

  toggleDay(day: number) {
    const isAlreadyOpen = this.expandedDays[day];
    this.expandedDays = {};
    if (!isAlreadyOpen) {
      this.expandedDays[day] = true;
    }
  }

  openImage(img: string) {
    this.selectedImage = img;
  }

  closeImage() {
    this.selectedImage = null;
  }
}
