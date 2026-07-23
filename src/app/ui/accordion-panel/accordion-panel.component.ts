import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion-panel.component.html',
  styleUrl: './accordion-panel.component.css',
})
export class AccordionPanelComponent {
  @Input() title = '';
  @Input() iconClass = 'fa-map-marker-alt';
  @Input() open = false;
  @Output() toggled = new EventEmitter<void>();
}
