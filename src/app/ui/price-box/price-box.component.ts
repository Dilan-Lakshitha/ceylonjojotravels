import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-price-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-box.component.html',
  styleUrl: './price-box.component.css',
})
export class PriceBoxComponent {
  @Input() amount = '';
  @Input() note = '';
}
