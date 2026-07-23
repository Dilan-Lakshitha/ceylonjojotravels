import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface TourStatItem {
  icon: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-tour-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-stats.component.html',
  styleUrl: './tour-stats.component.css',
})
export class TourStatsComponent {
  @Input() items: TourStatItem[] = [];
}
