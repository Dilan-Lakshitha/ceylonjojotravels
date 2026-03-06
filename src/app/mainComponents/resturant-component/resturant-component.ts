import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from "@angular/router";
register();

@Component({
  selector: 'app-resturant-component',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './resturant-component.html',
  styleUrl: './resturant-component.css',
})
export class ResturantComponent {
  packages: any[] = [];

  constructor(
    private title: Title,
    private meta: Meta,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      register();
    }
    this.title.setTitle('Luxury Restaurant in Sri Lanka | Sundown Tours');

    this.meta.updateTag({
      name: 'description',
      content:
        'Enjoy authentic Sri Lankan cuisine, fresh seafood, and private dining experiences at our luxury restaurant in Sri Lanka.',
    });
    this.loadPackages();
    this.addStructuredData();
  }

  loadPackages() {
    this.http
      .get<any[]>('assets/data/event-packages.json')
      .subscribe((data) => {
        this.packages = data;
      });
  }

  addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: 'Private Event Packages - Sundown Tours',
        location: {
          '@type': 'Place',
          name: 'Sri Lanka',
        },
      });

      document.head.appendChild(script);
    }
  }

  selectedCategory = 'starters';

  menuItems = [
    {
      category: 'starters',
      name: 'Sri Lankan Devilled Chicken',
      description:
        'Spicy traditional chicken with peppers and Sri Lankan spices.',
      price: 5.95,
      image: 'assets/menu/starter1.jpg',
    },
    {
      category: 'starters',
      name: 'Fresh Vegetable Spring Rolls',
      description: 'Crispy rolls served with sweet chili sauce.',
      price: 8.95,
      image: 'assets/menu/starter2.jpg',
    },
    {
      category: 'breakfast',
      name: 'Sri Lankan String Hoppers',
      description: 'Served with coconut sambol and dhal curry.',
      price: 6.95,
      image: 'assets/menu/breakfast1.jpg',
    },
    {
      category: 'lunch',
      name: 'Traditional Rice & Curry',
      description:
        'Authentic Sri Lankan rice and curry with multiple side dishes.',
      price: 12.95,
      image: 'assets/menu/lunch1.jpg',
    },
    {
      category: 'dinner',
      name: 'Seafood Special Platter',
      description: 'Fresh Sri Lankan seafood grilled to perfection.',
      price: 14.95,
      image: 'assets/menu/dinner1.jpg',
    },
  ];

  get filteredMenu() {
    return this.menuItems.filter(
      (item) => item.category === this.selectedCategory,
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  chefs = [
  {
    name: 'Walter Perera',
    role: 'Master Chef',
    image: 'assets/chefs/chef1.jpg',
    description: 'Specialist in authentic Sri Lankan cuisine with over 15 years of experience in luxury hospitality and international dining.'
  },
  {
    name: 'Sarah Fernando',
    role: 'Pastry Chef',
    image: 'assets/chefs/chef2.jpg',
    description: 'Expert in handcrafted desserts and European-style pastries, blending traditional flavors with modern creativity.'
  },
  {
    name: 'William Silva',
    role: 'Executive Chef',
    image: 'assets/chefs/chef3.jpg',
    description: 'Passionate about seafood specialties and premium culinary experiences tailored for international guests.'
  }
];
}
