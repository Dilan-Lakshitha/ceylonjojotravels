import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="ui-chip" [class.ui-chip--accent]="accent" [class.ui-chip--muted]="muted">
      <i *ngIf="icon" class="fas" [ngClass]="icon" aria-hidden="true"></i>
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      .ui-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        max-width: 100%;
        padding: 0.3rem 0.65rem;
        border-radius: 999px;
        background: #f1f5f9;
        color: #023a2c;
        font-size: 0.75rem;
        font-weight: 600;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ui-chip--accent {
        background: #023a2c;
        color: #fff;
      }
      .ui-chip--muted {
        background: #ada878;
        color: #fff;
      }
      .ui-chip i {
        flex-shrink: 0;
        font-size: 0.7rem;
      }
    `,
  ],
})
export class ChipComponent {
  @Input() icon = '';
  @Input() accent = false;
  @Input() muted = false;
}
