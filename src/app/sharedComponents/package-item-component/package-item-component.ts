import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-package-item-component',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './package-item-component.html',
  styleUrl: './package-item-component.css'
})
export class PackageItemComponent {
  @Input() image!: string;
  @Input() days!: string;
  @Input() persons!: string;
  @Input() rating!: number;
  @Input() price!: number;
  @Input() title!: string;
  @Input() routerLink!: string;
  @Input() isBestseller: boolean = false;
  @Input() isLimited: boolean = false;

  ngOnInit() {
  }
}
