import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Meta, Title } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    this.title.setTitle(
      'Sundown Beach Restaurant | Seafood & Sri Lankan Food in Waskaduwa',
    );

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

  selectedCategory = 'seafood';

  menuItems = [
    /* Soup */

    {
      category: 'soup',
      name: 'Vegetable Soup',
      description: 'Fresh vegetable soup served with bread',
      price: 800,
      image: 'assets/menu/soup1.jpg',
    },

    {
      category: 'soup',
      name: 'Noodles Soup',
      description: 'Warm noodles soup with vegetables',
      price: 1000,
      image: 'assets/menu/soup2.jpg',
    },

    {
      category: 'soup',
      name: 'Tomato Soup',
      description: 'Classic tomato soup served with bread',
      price: 700,
      image: 'assets/menu/soup3.jpg',
    },

    {
      category: 'soup',
      name: 'Chicken Soup',
      description: 'Chicken soup with herbs and spices',
      price: 1500,
      image: 'assets/menu/soup4.jpg',
    },

    {
      category: 'soup',
      name: 'Prawn Soup',
      description: 'Seafood soup with fresh prawns',
      price: 1600,
      image: 'assets/menu/soup5.jpg',
    },

    {
      category: 'soup',
      name: 'Crab Soup',
      description: 'Rich crab soup served with bread',
      price: 1200,
      image: 'assets/menu/soup6.jpg',
    },

    {
      category: 'soup',
      name: 'Shark Soup',
      description: 'Special shark soup with spices',
      price: 1000,
      image: 'assets/menu/soup7.jpg',
    },

    {
      category: 'soup',
      name: 'Tuna Soup',
      description: 'Fresh tuna soup with vegetables',
      price: 1000,
      image: 'assets/menu/soup8.jpg',
    },

    {
      category: 'soup',
      name: 'Mixed Soup',
      description: 'Mixed seafood soup with bread',
      price: 1700,
      image: 'assets/menu/soup9.jpg',
    },
    /* Rice & Curry */

    {
      category: 'rice',
      name: 'Rice & Curry with Fish',
      description: 'Rice with 3 vegetable curries and fish curry',
      price: 3000,
      image: 'assets/menu/rice1.jpg',
    },

    {
      category: 'rice',
      name: 'Rice & Curry with Egg',
      description: 'Rice with 3 vegetable curries and egg curry',
      price: 2500,
      image: 'assets/menu/rice2.jpg',
    },

    {
      category: 'rice',
      name: 'Rice & Curry with Chicken',
      description: 'Rice with 3 vegetable curries and chicken curry',
      price: 3500,
      image: 'assets/menu/rice3.jpg',
    },

    /* Fried Rice */

    {
      category: 'fried',
      name: 'Vegetable Fried Rice',
      description: 'Sri Lankan style vegetable fried rice',
      price: 1000,
      image: 'assets/menu/fried1.jpg',
    },

    {
      category: 'fried',
      name: 'Egg Fried Rice',
      description: 'Fried rice with egg',
      price: 1100,
      image: 'assets/menu/fried2.jpg',
    },

    {
      category: 'fried',
      name: 'Fish Fried Rice',
      description: 'Fried rice with fish',
      price: 1200,
      image: 'assets/menu/fried3.jpg',
    },

    {
      category: 'fried',
      name: 'Chicken Fried Rice',
      description: 'Fried rice with chicken',
      price: 1500,
      image: 'assets/menu/fried4.jpg',
    },

    {
      category: 'fried',
      name: 'Prawns Fried Rice',
      description: 'Fried rice with prawns',
      price: 1800,
      image: 'assets/menu/fried5.jpg',
    },

    {
      category: 'fried',
      name: 'Seafood Fried Rice',
      description: 'Mixed seafood fried rice',
      price: 1900,
      image: 'assets/menu/fried6.jpg',
    },

    /* Noodles */

    /* Spaghetti */

    {
      category: 'spaghetti',
      name: 'Vegetable Spaghetti',
      description: 'Spaghetti with fresh vegetables',
      price: 1200,
      image: 'assets/menu/spaghetti1.jpg',
    },

    {
      category: 'spaghetti',
      name: 'Vegetable with Egg Spaghetti',
      description: 'Vegetable spaghetti with egg',
      price: 1500,
      image: 'assets/menu/spaghetti2.jpg',
    },

    {
      category: 'spaghetti',
      name: 'Vegetable with Prawns Spaghetti',
      description: 'Spaghetti with prawns and vegetables',
      price: 2000,
      image: 'assets/menu/spaghetti3.jpg',
    },

    {
      category: 'spaghetti',
      name: 'Vegetable with Chicken Spaghetti',
      description: 'Spaghetti with chicken and vegetables',
      price: 1900,
      image: 'assets/menu/spaghetti4.jpg',
    },
    {
      category: 'noodles',
      name: 'Vegetable Noodles',
      description: 'Stir fried noodles with vegetables',
      price: 1000,
      image: 'assets/menu/noodle1.jpg',
    },

    {
      category: 'noodles',
      name: 'Egg Noodles',
      description: 'Vegetable noodles with egg',
      price: 1200,
      image: 'assets/menu/noodle2.jpg',
    },

    {
      category: 'noodles',
      name: 'Prawn Noodles',
      description: 'Noodles with prawns',
      price: 1800,
      image: 'assets/menu/noodle3.jpg',
    },

    {
      category: 'noodles',
      name: 'Chicken Noodles',
      description: 'Noodles with chicken',
      price: 1700,
      image: 'assets/menu/noodle4.jpg',
    },

    /* Devilled & Omelets */

    {
      category: 'devilled',
      name: 'Devilled Fish',
      description: 'Spicy devilled fish served with bread',
      price: 2500,
      image: 'assets/menu/devilled1.jpg',
    },

    {
      category: 'devilled',
      name: 'Devilled Chicken',
      description: 'Sri Lankan style devilled chicken with spices',
      price: 3000,
      image: 'assets/menu/devilled2.jpg',
    },

    {
      category: 'devilled',
      name: 'Grill Chicken',
      description: 'Grilled chicken served with bread',
      price: 3500,
      image: 'assets/menu/devilled3.jpg',
    },

    {
      category: 'devilled',
      name: 'Prawns Devilled',
      description: 'Spicy devilled prawns',
      price: 3500,
      image: 'assets/menu/devilled4.jpg',
    },

    {
      category: 'devilled',
      name: 'Calamari Devilled',
      description: 'Devilled calamari with Sri Lankan spices',
      price: 3000,
      image: 'assets/menu/devilled5.jpg',
    },

    {
      category: 'devilled',
      name: 'Egg Omelet',
      description: 'Fresh egg omelet served with bread',
      price: 1000,
      image: 'assets/menu/omelet1.jpg',
    },

    {
      category: 'devilled',
      name: 'Chicken Sausages',
      description: 'Chicken sausages with garlic sauce & bread',
      price: 1500,
      image: 'assets/menu/sausage1.jpg',
    },

    {
      category: 'devilled',
      name: 'Potato Chips',
      description: 'Crispy potato chips',
      price: 1500,
      image: 'assets/menu/chips1.jpg',
    },
    /* Salads */

    {
      category: 'salads',
      name: 'Vegetable Salad',
      description: 'Fresh vegetable salad with light dressing',
      price: 1200,
      image: 'assets/menu/salad1.jpg',
    },

    {
      category: 'salads',
      name: 'Cucumber Salad',
      description: 'Fresh cucumber salad with herbs',
      price: 1000,
      image: 'assets/menu/salad2.jpg',
    },

    {
      category: 'salads',
      name: 'Tomato with Onion Salad',
      description: 'Tomato and onion salad with Sri Lankan spices',
      price: 800,
      image: 'assets/menu/salad3.jpg',
    },

    {
      category: 'salads',
      name: 'Pineapple Salad',
      description: 'Fresh pineapple salad with sweet and spicy dressing',
      price: 1300,
      image: 'assets/menu/salad4.jpg',
    },

    /* Sandwich */

    {
      category: 'sandwich',
      name: 'Tomato Sandwich',
      description: 'Fresh tomato sandwich with soft bread',
      price: 800,
      image: 'assets/menu/sandwich1.jpg',
    },

    {
      category: 'sandwich',
      name: 'Cheese Sandwich',
      description: 'Classic cheese sandwich',
      price: 1200,
      image: 'assets/menu/sandwich2.jpg',
    },

    {
      category: 'sandwich',
      name: 'Egg Sandwich',
      description: 'Egg sandwich with fresh vegetables',
      price: 1000,
      image: 'assets/menu/sandwich3.jpg',
    },

    {
      category: 'sandwich',
      name: 'Fish Sandwich',
      description: 'Fish sandwich with homemade sauce',
      price: 1000,
      image: 'assets/menu/sandwich4.jpg',
    },

    {
      category: 'sandwich',
      name: 'Chicken Sandwich',
      description: 'Grilled chicken sandwich',
      price: 1300,
      image: 'assets/menu/sandwich5.jpg',
    },
    /* Seafood */

    {
      category: 'seafood',
      name: 'Tuna',
      description:
        'Fresh grilled tuna with garlic sauce, bread, vegetable salad & rice',
      price: 2000,
      image: 'assets/menu/sea1.jpg',
    },

    {
      category: 'seafood',
      name: 'Shark',
      description:
        'Grilled shark steak with garlic sauce, bread, vegetable salad & rice',
      price: 2500,
      image: 'assets/menu/sea2.jpg',
    },

    {
      category: 'seafood',
      name: 'Seer Fish',
      description: 'Fresh seer fish grilled with garlic sauce',
      price: 3000,
      image: 'assets/menu/sea3.jpg',
    },

    {
      category: 'seafood',
      name: 'Calamari',
      description: 'Grilled calamari served with rice and salad',
      price: 3000,
      image: 'assets/menu/sea4.jpg',
    },

    {
      category: 'seafood',
      name: 'Coral Fish',
      description: 'Fresh coral fish grilled with garlic sauce',
      price: 3000,
      image: 'assets/menu/sea5.jpg',
    },

    {
      category: 'seafood',
      name: 'Para Fish',
      description: 'Grilled para fish served with vegetables and rice',
      price: 3000,
      image: 'assets/menu/sea6.jpg',
    },

    {
      category: 'seafood',
      name: 'Prawns',
      description: 'Fresh garlic prawns served with salad and rice',
      price: 3500,
      image: 'assets/menu/sea7.jpg',
    },

    {
      category: 'seafood',
      name: 'Jumbo Prawns',
      description: 'Large grilled jumbo prawns with garlic sauce',
      price: 4500,
      image: 'assets/menu/sea8.jpg',
    },

    {
      category: 'seafood',
      name: 'File Fish',
      description: 'Fresh file fish grilled with vegetables',
      price: 2000,
      image: 'assets/menu/sea9.jpg',
    },

    {
      category: 'seafood',
      name: 'Lobster',
      description: 'Fresh grilled lobster with garlic sauce and salad',
      price: 6000,
      image: 'assets/menu/sea10.jpg',
    },

    {
      category: 'seafood',
      name: 'Manta Fish',
      description: 'Fresh manta fish grilled with Sri Lankan spices',
      price: 2000,
      image: 'assets/menu/sea11.jpg',
    },

    {
      category: 'seafood',
      name: 'Crab',
      description: 'Fresh crab served with garlic sauce and vegetables',
      price: 3500,
      image: 'assets/menu/sea12.jpg',
    },

    {
      category: 'seafood',
      name: 'Red Fish',
      description: 'Grilled red fish served with rice and salad',
      price: 3500,
      image: 'assets/menu/sea13.jpg',
    },

    {
      category: 'seafood',
      name: 'Seafood Mix Plate',
      description:
        'Lobster, prawns, calamari, tuna, crab & shark with garlic sauce, bread, vegetable salad & rice',
      price: 11000,
      image: 'assets/menu/sea14.jpg',
    },

    /* Drinks */

    {
      category: 'drinks',
      name: 'Coffee',
      description: 'Fresh brewed coffee',
      price: 400,
      image: 'assets/menu/drink1.jpg',
    },

    {
      category: 'drinks',
      name: 'Tea',
      description: 'Sri Lankan tea',
      price: 300,
      image: 'assets/menu/drink2.jpg',
    },

    {
      category: 'drinks',
      name: 'King Coconut',
      description: 'Fresh king coconut',
      price: 250,
      image: 'assets/menu/drink3.jpg',
    },

    {
      category: 'drinks',
      name: 'Fresh Mango Juice',
      description: 'Fresh mango juice',
      price: 700,
      image: 'assets/menu/drink4.jpg',
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
      description:
        'Specialist in authentic Sri Lankan cuisine with over 15 years of experience in luxury hospitality and international dining.',
    },
    {
      name: 'Sarah Fernando',
      role: 'Pastry Chef',
      image: 'assets/chefs/chef2.jpg',
      description:
        'Expert in handcrafted desserts and European-style pastries, blending traditional flavors with modern creativity.',
    },
    {
      name: 'William Silva',
      role: 'Executive Chef',
      image: 'assets/chefs/chef3.jpg',
      description:
        'Passionate about seafood specialties and premium culinary experiences tailored for international guests.',
    },
  ];
}
