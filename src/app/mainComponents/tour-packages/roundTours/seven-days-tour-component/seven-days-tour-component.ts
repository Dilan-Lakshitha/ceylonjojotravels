import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  TourDetails,
  TourDetailsComponent,
} from '../../../../sharedComponents/tour-details-component/tour-details-component';
import toursData from '../../../../databaseJson/tours.json';
import { PackageItemComponent } from '../../../../sharedComponents/package-item-component/package-item-component';
import { HttpClient } from '@angular/common/http';
import { CountryService } from '../../../../Services/country.service';

@Component({
  selector: 'app-seven-days-tour-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TourDetailsComponent,
    PackageItemComponent,
  ],
  templateUrl: './seven-days-tour-component.html',
  styleUrls: ['./seven-days-tour-component.css'],
})
export class SevenDaysTourComponent implements OnInit, OnDestroy {
  images: string[] = [
    'assets/img/5daysTours/1.jpeg',
    'assets/img/5daysTours/18.jpg',
    'assets/img/5daysTours/28.png',
    'assets/img/5daysTours/24.jpg',
    'assets/img/5daysTours/34.jpg',
  ];

  currentIndex = 0;
  intervalId: any;
  multiDayTours: any[] = [];
  selectedTours: any[] = [];
  userCountry = 'US';
  price = 0;

  tour = {
    title: 'Sri Lanka Seven Days Tour',
    description:
      'Experience the beauty of Sri Lanka with 7 days full of adventure, culture, and relaxation.',
    duration: '7 Days',
    persons: '20 Persons',
    filecode: '7-day-sri-lanka-tour',
    overview: `We are here for you to organize the perfect holiday you always dreamed of in 'Paradise Island', Sri Lanka.
    Our 7days(6 nights) travel package is scheduled in a way that you'll cover not only all the famous attractions but also some of the rare experiences that are very unique to CEYLON JOJO TRAVElS while accomadating our guests in Sri Lanka's finest 4 star category hotels on half board basis.
    Yala Safari, Sigiriya, Ella Nine Arches Bridge, Ella train journey, Kandy Sacred Tooth Relic Temple, Ramboda watefall, Little Adam's Peak hike, Nuwara Eliya, Galle Fort, Bentota River tour are just to name a few main attractions that you'll cover during the journey.
    Altogether you'll be visiting 28 attractions in total covering 10 districts of Sri Lanka while enjoing private trasportation.`,
    tourType: 'Round Tour',

    itinerary: [
      {
        day: 1,
        title: 'Arrival  & Pidurangala Rock',
        activities: [
          {
            type: 'Arrival ',
            title: { title: 'Arrival ', icon: 'fa-plane', color: '#2c3e50' },
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Pidurangala Rock',
              icon: 'fa-hiking',
              color: '#f39c12',
            },
            description:
              'Little hike to Pidurangala Rock and enjoy the scenery.',
            image: 'assets/img/5daysTours/c8dyxgodivrwf4hxzziq.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Fresco Water Villa',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description:
              'Accommodation in Hotel Fresco Water Villa or Similar Hotel - HB Basis',
            image: 'assets/img/7dayschange/f4yqlbw3bjsz3szp3hbq.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom', 'Dinner'],
          },
        ],
      },
      {
        day: 2,
        title: 'Sigiriya & Dambulla',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Sigiriya Lion Rock',
              icon: 'fa-mountain',
              color: '#e74c3c',
            },
            description:
              'To kick off day two s proceedings, you ll be visiting an UNESCO World Heritage site - Sigiriya rock fortress.',
            image: 'assets/img/7dayschange/ihyw8fdom33yg8zqkmfi.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Hiriwadunna Village & Lake Adventure',
              icon: 'fa-leaf',
              color: '#8e44ad',
            },
            description:
              "Let's get some traditional Sri Lankan village experience!!! A visit to the hamlet of Hiriwadunna in Sri Lanka showcases the laid-back rhythms of small village life.",
            image: 'assets/img/5daysTours/36.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Dambulla Cave Temple',
              icon: 'fa-place-of-worship',
              color: '#2980b9',
            },
            description:
              'After refreshing at Hiriwadunna Village, next up you ll be heading to Dambulla Royal Cave Temple A sacred pilgrimage site for 22 centuries.',
            image: 'assets/img/7dayschange/d2ap1r8hoijw6wsm5xgy.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Dambulla Dedicated Economic Center',
              icon: 'fa-shopping-basket',
              color: '#16a085',
            },
            description:
              'Enjoy fresh fruits and vegetables at Dambulla market.',
            image: 'assets/img/7dayschange/v54wmh9aukt4toblznpu.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Fresco Water Villa',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description: 'Stay overnight with HB basis',
            image: 'assets/img/7dayschange/f4yqlbw3bjsz3szp3hbq.jpg',
            extra: ['Breakfast', 'Dinner'],
          },
        ],
      },
      {
        day: 3,
        title: 'Kandy City Tour',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Sri Dalada Maligawa',
              icon: 'fa-place-of-worship',
              color: '#2980b9',
            },
            description:
              'You ll be finally visiting the temple which houses the Sacred Tooth Relic of the Buddha is one of the holiest shrines in the entire Buddhist world!!!',
            image: 'assets/img/7dayschange/f3pqyx8y4gpwmqhzleh0.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Kandy Lake Club - Cultural Dance Show',
              icon: 'fa-theater-masks',
              color: '#8e44ad',
            },
            description:
              'The Kandy Lake Club Cultural Dance Show is a stimulating Sri Lankan Arts, Dance & Cultural Heritage Show that is a must see for any visitor who visits the historic city of Kandy.',
            image: 'assets/img/7dayschange/upxn0ge9htdg20ycpgp6.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Sri Muthumariamman Temple',
              icon: 'fa-place-of-worship',
              color: '#2980b9',
            },
            description:
              'Sri Muthumariamman Hindu Temple is one of the great examples to prove Sri Lanka has been a multi cultural country through out all these years.',
            image: 'assets/img/7dayschange/gt14exwu7ogp3rz9aun9.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Nalanda Gedige',
              icon: 'fa-landmark',
              color: '#16a085',
            },
            description:
              'An ancient and mysterious edifice near Matale that has confounded researchers with its strange mix of Hindu and Buddhist architecture. Believed to be at least a thousand years old the structure',
            image: 'assets/img/7dayschange/u9901tv9mcxlz9rd9mgw.jpg',
          },
          {
            type: 'Accommodation',
            title: { title: 'Hotel Topaz', icon: 'fa-hotel', color: '#27ae60' },
            description: 'Accommodation in Hotel Topaz or similar - HB Basis',
            image: 'assets/img/7dayschange/sxapeujg7mpergbd5nic.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 4,
        title: 'Nuwara Eliya via Ramboda Falls',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Royal Botanical Garden',
              icon: 'fa-leaf',
              color: '#2ecc71',
            },
            description:
              'The gardens display over 4 000 different species of plants, regarded amongst the most superior in Asia.',
            image: 'assets/img/7dayschange/asojmlldivxq8vforwxt.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Ambuluwawa Tower',
              icon: 'fa-mountain',
              color: '#e67e22',
            },
            description:
              'Next up.. an easy hike to do which gives you 360 degree views of the surrounding mountains, forests, rivers and towns in Kandy!',
            image: 'assets/img/7dayschange/w3a48osbcocecoaaq9hd.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Bluefield Tea Factory',
              icon: 'fa-coffee',
              color: '#8e44ad',
            },
            description:
              'As a land of tea, Nuwara Eliya has quite a large number of tea factories, tea houses and tea fields. Bluefield Tea Factory in Nuwara Eliya is one of the most popular tea factories in Sri Lanka.',
            image: 'assets/img/7dayschange/tijr5ztiozgdesbxotm4.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Ramboda Falls View Point',
              icon: 'fa-water',
              color: '#3498db',
            },
            description:
              'Ramboda falls lies in the Pussellawa district, in the city of Kandy. The area is known for marvelous landscapes comprising of highlands, ridges, plains, streams and hilly mountains.',
            image: 'assets/img/7dayschange/ovdxsgglrdreodbe1tmv.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Ramboda Falls Hotel',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description:
              'Accommodation in Ramboda Falls Hotel or Similar - HB Basis',
            image: 'assets/img/7dayschange/zxla06noouvzn6e0teui.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 5,
        title: 'Ella Adventures',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Nine Arches Bridge',
              icon: 'fa-bridge',
              color: '#c0392b',
            },
            description:
              'The majestic Nine Arch Bridge is one of the many reasons for that. The glorious Nine Arch Bridge between Ella and Demodara station is one of the engineering marvels in the early 20th century.',
            image: 'assets/img/7dayschange/yka3mpx2nahiftrb0lpu.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Lake Gregory',
              icon: 'fa-water',
              color: '#2980b9',
            },
            description:
              'Spanning 225 acres, Lake Gregory is the place to go for water activities in Nuwara Eliya, with the park serving as a great spot for picnics.',
            image: 'assets/img/7dayschange/sd3y8zh2cskrddig22n7.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: "Little Adam's Peak",
              icon: 'fa-mountain',
              color: '#8e44ad',
            },
            description:
              'It is 1141 m in height and from the entrance it takes up to 30-45 min for the hike. Views from the summit are incredible. 360 degrees panoramic views with clouds rolling in, is a treat to watch.',
            image: 'assets/img/7dayschange/e7sgetzhdjoahy2h9wgh.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Oak Ray Ella Gap Hotel',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description:
              'Accommodation in Oak Ray Ella Gap Hotel or Similar - HB Basis',
            image: 'assets/img/7dayschange/nhm6ktdm7nimqwwrgtbm.jpg',
            extra: ['Hotel 4 stars (Premium)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 6,
        title: 'Yala National Park & Ravana Falls',
        activities: [
          {
            type: 'Guided tour',
            title: {
              title: 'Yala National Park',
              icon: 'fa-paw',
              color: '#2ecc71',
            },
            description:
              'Yala is home to 44 varieties of mammal and 215 bird species. Among its more famous residents are the world’s biggest concentration of leopards',
            image: 'assets/img/7dayschange/u1iadnsusjf2h8zdhma5.jpg',
          },
          {
            type: 'Guided tour',
            title: {
              title: 'Ravana Falls',
              icon: 'fa-water',
              color: '#3498db',
            },
            description:
              'Ravana Falls is entrenched in myth and folklore. It is believed that the demon King Ravana, from the epic Ramayan, hid Sita in the cave behind the waterfall after he kidnapped her and brought her back',
            image: 'assets/img/7dayschange/zauxzn86ulp9ddnrzlvw.jpg',
          },
          {
            type: 'Accommodation',
            title: {
              title: 'Grand Tamarind Lake Hotel',
              icon: 'fa-hotel',
              color: '#27ae60',
            },
            description:
              'Accommodation in Grand Tamarind Lake Hotel or Similar - HB Basis',
            image: 'assets/img/7dayschange/ipbxv6o0ovr2tfbc6pge.jpg',
            extra: ['Hotel 5 stars (Luxury)', 'Private bathroom'],
          },
        ],
      },
      {
        day: 7,
        title: 'Mirissa & Departure',
        activities: [
          {
            type: 'Conservation',
            title: {
              title: 'Sea Turtle Conservation Project',
              icon: 'fa-water',
              color: '#2980b9',
            },
            description:
              'Visit a sea turtle conservation center along the south coast and learn about marine wildlife protection, hatchery programs and rehabilitation efforts.',
            image: 'assets/img/5daysTours/31.jpg',
          },
          {
            type: 'Boat Safari',
            title: {
              title: 'Madu River Safari',
              icon: 'fa-ship',
              color: '#3498db',
            },
            description:
              'Enjoy a scenic boat safari through the mangrove forests and small islands of the Madu River. Discover local cinnamon cultivation and diverse wetland wildlife.',
            image: 'assets/img/5daysTours/32.jpg',
          },
          {
            type: 'Departure',
            title: {
              title: 'Departure Transfer',
              icon: 'fa-plane',
              color: '#2c3e50',
            },
          },
        ],
      },
    ],

    includes: [
      'Air-Conditioned Private Vehicle',
      'English Speaking Professional Driver',
      "Driver's Accommodation & Meals",
      'Pickup & Drop Off',
      'Fuel & Parking Fees',
      '24 Hours Service',
      'Unlimited Mileage/Kilometer for entire round tour',
      'Your Accommodation',
    ],
    excludes: ['Food & Drinks', 'Entrance & Activities Fees'],
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private countryService: CountryService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  get currentImage() {
    return this.images[this.currentIndex];
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

  get nextImages() {
    return Array.from({ length: 4 }, (_, i) => {
      const index = (this.currentIndex + i + 1) % this.images.length;
      return { src: this.images[index], index };
    });
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
    if (isPlatformBrowser(this.platformId)) {
      this.userCountry = await this.countryService.detectCountry();
      this.price = await this.loadPrice(this.tour.filecode);
      this.multiDayTours = await this.loadToursWithPrices(
        toursData.multiDayTours,
      );
      this.selectedTours = this.multiDayTours
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      this.intervalId = setInterval(() => this.nextImage(), 3000);
    } else {
      this.userCountry = 'US';
      this.price = 0;
      this.multiDayTours = toursData.multiDayTours.slice(0, 3);
      this.selectedTours = this.multiDayTours;
    }
  }

  async loadToursWithPrices(tours: any[]) {
    return Promise.all(
      tours.map(async (tour) => {
        const price = await this.loadPrice(tour.filecode);
        return { ...tour, price };
      }),
    );
  }

  loadPrice(filecode: string): Promise<number> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve(0);
    }
    const countryFile = `assets/data/${this.userCountry}${filecode}.json`;
    const defaultFile = `assets/data/US${filecode}.json`;

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
      const barcode = '7-day-sri-lanka-tour';
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
