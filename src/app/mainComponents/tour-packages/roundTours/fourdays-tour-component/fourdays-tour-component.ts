import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TourDetails, TourDetailsComponent } from '../../../../sharedComponents/tour-details-component/tour-details-component';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';
import toursData from '../../../../databaseJson/tours.json';

@Component({
  selector: 'app-fourdays-tour-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './fourdays-tour-component.html',
  styleUrl: './fourdays-tour-component.css'
})
export class FourdaysTourComponent {
images: string[] = [
    'assets/img/5daysTours/fifyrnqt5tvouhpgh6kk.jpg',
    'assets/img/5daysTours/fozjxf01vl9yehvucwn2.jpg',
    'assets/img/5daysTours/c8dyxgodivrwf4hxzziq.jpg',
    'assets/img/5daysTours/dp8fjrahvepdlhdudxj0.jpg',
    'assets/img/5daysTours/slqwoimy5yhfgcicn8ob.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;


tour = {
  title: '4 Day Sri Lanka Private Tour | Kandy, Ella, Yala & South Coast',
  description:
    'Explore Sri Lanka in 4 unforgettable days including Kandy cultural heritage, Ella hill country, Yala safari adventure and the stunning southern coastline.',
  duration: '4 Days',
  persons: '1-20 Persons',
  filecode: '4-day-sri-lanka-tour',
  overview: `Discover Sri Lanka’s perfect combination of culture, scenic beauty, wildlife and coastal charm in this 4-day private tour. Visit the sacred city of Kandy, experience the breathtaking hill country of Ella, enjoy a thrilling safari in Yala National Park and explore the historic Galle Fort before your airport drop.`,

  tourType: 'Round Tour',

  itinerary: [

    // DAY 1
    {
      day: 1,
      title: 'Airport / Hotel – Kandy Cultural Experience',
      activities: [
        {
          type: 'Wildlife Experience',
          title: { title: 'Pinnawala Elephant Orphanage', icon: 'fa-paw', color: '#27ae60' },
          description:
            'Visit the famous Pinnawala Elephant Orphanage where rescued elephants are cared for and protected. Observe elephants bathing in the river and learn about conservation efforts.',
          image: 'assets/img/5daysTours/7.jpg',
        },
        {
          type: 'Cultural Visit',
          title: { title: 'Temple of the Sacred Tooth Relic', icon: 'fa-place-of-worship', color: '#2980b9' },
          description:
            'Explore Sri Dalada Maligawa, one of the most sacred Buddhist temples in the world, home to the sacred tooth relic of Lord Buddha.',
          image: 'assets/img/5daysTours/14.jpg',
        },
        {
          type: 'Cultural Experience',
          title: { title: 'Kandy Cultural Dance Show', icon: 'fa-theater-masks', color: '#e74c3c' },
          description:
            'Enjoy a traditional Kandyan dance performance featuring fire walking, drumming and vibrant cultural costumes.',
          image: 'assets/img/5daysTours/fifyrnqt5tvouhpgh6kk.jpg',
        },
        {
          type: 'Scenic View',
          title: { title: 'Kandy View Point', icon: 'fa-mountain', color: '#8e44ad' },
          description:
            'Stop at Kandy View Point for panoramic views of Kandy city, the lake and surrounding hills.',
          image: 'assets/img/5daysTours/476465443_947365727374414_5703532547629723678_n.jpg',
        },
        {
          type: 'Accommodation',
          title: { title: 'Overnight Stay Topez Hotel in Kandy', icon: 'fa-hotel', color: '#16a085' },
          description: 'Stay overnight in a comfortable star-class hotel in Kandy on a Half Board basis.',
          extra: ['Dinner Included', 'Private Room'],
        },
      ],
    },

    // DAY 2
    {
      day: 2,
      title: 'Kandy – Ella Hill Country Journey',
      activities: [
        {
          type: 'Nature',
          title: { title: 'Royal Botanic Gardens Peradeniya', icon: 'fa-tree', color: '#2ecc71' },
          description:
            'Walk through one of Asia’s most beautiful botanical gardens featuring orchids, palms, bamboo and tropical plants.',
          image: 'assets/img/5daysTours/himbgjcj6zckm6de1mhe.jpg',
        },
        {
          type: 'Tea Experience',
          title: { title: 'Glenloch Tea Factory Visit', icon: 'fa-mug-hot', color: '#8B4513' },
          description:
            'Discover how world-famous Ceylon tea is produced and enjoy a fresh cup while overlooking scenic tea plantations.',
          image: 'assets/img/5daysTours/17.jpg',
        },
        {
          type: 'Scenic Visit',
          title: { title: 'Nine Arch Bridge', icon: 'fa-bridge', color: '#A9A9A9' },
          description:
            'Visit the iconic colonial-era Nine Arch Bridge surrounded by lush greenery and rolling hills.',
          image: 'assets/img/5daysTours/5.jpg',
        },
        {
          type: 'Hiking',
          title: { title: "Little Adam's Peak", icon: 'fa-mountain', color: '#f39c12' },
          description:
            'Enjoy a gentle hike offering panoramic views over Ella Gap and the surrounding mountain range.',
          image: 'assets/img/5daysTours/9.jpg',
        },
        {
          type: 'Accommodation',
          title: { title: 'Overnight Stay Oak Ray Ella Gap Hotel or similar - HB Basis in Ella', icon: 'fa-hotel', color: '#16a085' },
          description: 'Overnight stay in a scenic hill country hotel on Half Board basis.',
          extra: ['Breakfast & Dinner Included', 'Private Room'],
        },
      ],
    },

    // DAY 3
    {
      day: 3,
      title: 'Ella – Yala Wildlife Safari',
      activities: [
        {
          type: 'Waterfall',
          title: { title: 'Ravana Falls', icon: 'fa-water', color: '#3498db' },
          description:
            'Stop at Ravana Falls, one of Sri Lanka’s most picturesque waterfalls located along the Ella–Wellawaya road.',
          image: 'assets/img/5daysTours/n0oxsxmicxgleixkq2rx.jpg',
        },
        {
          type: 'Historical Site',
          title: { title: 'Buduruwagala Temple', icon: 'fa-landmark', color: '#e67e22' },
          description:
            'Visit this ancient rock temple complex featuring impressive carved Buddha statues.',
          image: 'assets/img/5daysTours/18.jpg',
        },
        {
          type: 'Safari',
          title: { title: 'Yala National Park Safari', icon: 'fa-paw', color: '#27ae60' },
          description:
            'Experience a thrilling jeep safari in Yala National Park, home to leopards, elephants, crocodiles and diverse wildlife.',
          image: 'assets/img/5daysTours/xj7qybc2bk5bwnxdkubp.jpg',
        },
        {
          type: 'Accommodation',
          title: { title: 'Overnight Stay in Yala', icon: 'fa-hotel', color: '#16a085' },
          description: 'Overnight stay in a comfortable safari-area hotel with Half Board.',
          extra: ['Breakfast & Dinner Included'],
        },
      ],
    },

    // DAY 4
    {
      day: 4,
      title: 'Yala – Galle – Bentota – Airport',
      activities: [
        {
          type: 'Beach Visit',
          title: { title: 'Mirissa Beach', icon: 'fa-umbrella-beach', color: '#f39c12' },
          description:
            'Relax at Mirissa Beach or enjoy optional whale watching and coastal views.',
          image: 'assets/img/5daysTours/21.jpg',
        },
        {
          type: 'Heritage',
          title: { title: 'Galle Dutch Fort', icon: 'fa-landmark', color: '#8e44ad' },
          description:
            'Explore the UNESCO-listed Galle Fort with colonial architecture, ramparts and ocean views.',
          image: 'assets/img/5daysTours/22.jpg',
        },
        {
          type: 'Boat Safari',
          title: { title: 'Madu River Safari', icon: 'fa-ship', color: '#3498db' },
          description:
            'Enjoy a peaceful boat ride through mangroves and small islands in one of Sri Lanka’s richest wetland ecosystems.',
          image: 'assets/img/5daysTours/23.jpg',
        }
      ],
    },
  ],

  includes: [
    'Air-Conditioned Private Vehicle',
    'English Speaking Professional Driver',
    'Half Board Accommodation',
    'Airport Pickup & Drop Off',
    'Fuel & Parking Fees',
  ],

  excludes: [
    'Entrance Fees',
    'Lunch & Drinks',
    'Personal Expenses',
  ],
};

  constructor(
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  get currentImage() {
    return this.images[this.currentIndex];
  }

  get nextImages() {
    return Array.from({ length: 4 }, (_, i) => {
      const index = (this.currentIndex + i + 1) % this.images.length;
      return { src: this.images[index], index };
    });
  }

  get tourForDetails(): TourDetails {
    return {
      title: this.tour.title,
      description: this.tour.description,
      duration: this.tour.duration,
      persons: this.tour.persons,
      price: this.price,
      tourType: this.tour.tourType,
      overview: this.tour.overview,
      itinerary: this.tour.itinerary,
      includes: this.tour.includes,
      excludes: this.tour.excludes,
    };
  }
  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToImage(index: number) {
    this.currentIndex = index;
  }

  goToImageFromThumb(index: number) {
    this.currentIndex = index;
  }

  async ngOnInit() {
    const isBrowser = isPlatformBrowser(this.platformId);
    if (!isBrowser) {
      this.userCountry = 'US';
      this.price = 0;
      this.multiDayTours = toursData.multiDayTours.slice(0, 3);
      this.selectedTours = this.multiDayTours;
      return;
    }
    
    try {
      this.userCountry = await this.countryService.detectCountry();
      this.price = await this.loadPrice(this.tour.filecode);
      this.multiDayTours = await this.loadToursWithPrices(toursData.multiDayTours);
      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } catch (error) {
      console.error('Browser data load failed:', error);
    }
  }

    async loadToursWithPrices(tours: any[]) {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return { ...tour, price };
      })
    );
  }

  loadPrice(filecode: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(0);
    }

    const countryFile = `assets/data/${this.userCountry}${filecode}.json`;
    const defaultFile = `assets/data/US${filecode}.json`;

    console.log(countryFile,defaultFile);
    return new Promise((resolve) => {
      this.http.get(countryFile).subscribe({
        next: (data: any) => resolve(data?.price?.['2'] ?? 0),
        error: () => {
          this.http.get(defaultFile).subscribe({
            next: (data: any) => resolve(data?.price?.['2'] ?? 0),
            error: () => resolve(0)
          });
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  bookNow() {
    if (isPlatformBrowser(this.platformId)) {
      const barcode = '4-day-sri-lanka-tour';
      localStorage.setItem('tour', JSON.stringify(this.tour));
      localStorage.setItem('filecode', barcode);
      localStorage.setItem('image', this.images[0]);

      this.router.navigate(['/booking', barcode], {
        state: {
          tour: this.tour,
          barcode: barcode,
          Image: this.images[0],
        },
      });
    }
  }
}
