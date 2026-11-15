/**
 * Rewrites home + tour SEO titles/descriptions for CTR.
 * Constraints: title ≤60 graphemes, description 140–155, unique per key,
 * no invented prices/ratings. Native search phrases per locale.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const len = (s) => [...s].length;

const PATCHES = {
  en: {
    'home.title': 'Private Driver Sri Lanka | Day Tours & Packages',
    'home.description':
      'Hire a private chauffeur guide in Sri Lanka. Book Galle, Kandy, Ella or Sigiriya day tours, or a multi-day private itinerary with hotels. WhatsApp to plan.',
    'tour.ella-day-tour.title': 'Ella Day Tour | Nine Arch & Private Driver',
    'tour.ella-day-tour.description':
      'Private Ella day tour with hotel pickup: Nine Arch Bridge, Little Adam’s Peak, Ravana Falls and optional Udawalawe safari. Chauffeur guide. WhatsApp booking.',
    'tour.galle-day-tour.title': 'Galle Day Tour | Dutch Fort & Private Driver',
    'tour.galle-day-tour.description':
      'Private Galle day tour from Colombo or your hotel: Dutch Fort, Bentota boat ride, tsunami memorial and moonstone mine. Local chauffeur guide. WhatsApp.',
    'tour.kandy-day-tour.title': 'Kandy Day Tour | Temple of the Tooth',
    'tour.kandy-day-tour.description':
      'Private Kandy day tour: Temple of the Tooth, Peradeniya Botanical Garden, tea country stops and city highlights with a chauffeur guide. Hotel pickup. WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Sigiriya Day Tour | Lion Rock Private Driver',
    'tour.sigiriya-day-tour.description':
      'Private Sigiriya day tour: climb Lion Rock or Pidurangala, visit Dambulla Cave Temple and optional Minneriya elephant safari. Chauffeur guide. WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': '2 Day Ella & Kandy | Private Driver Tour',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Two-day private tour of Ella and Kandy with hotels, chauffeur guide, Nine Arch Bridge and Temple of the Tooth. Optional hill-country train. WhatsApp to book.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': '2 Day Ella & Yala Safari | Private Driver',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      'Ella highlights plus a Yala jeep safari on a 2-day private tour with hotels and a chauffeur guide. Nine Arch Bridge, Little Adam’s Peak. WhatsApp booking.',
    'tour.4-day-sri-lanka-tour.title': '4 Day Sri Lanka Tour | Private Driver & Hotels',
    'tour.4-day-sri-lanka-tour.description':
      '4-day private Sri Lanka itinerary with chauffeur guide: Kandy, Ella, wildlife safari option and southern coast. Hotels included. Airport or hotel pickup. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': '5 Day Sri Lanka Tour | Rundreise-Style Private',
    'tour.5-day-sri-lanka-tour.description':
      '5-day private tour: Sigiriya, Kandy, Ella, safari and beach time with hotels and a local chauffeur guide. Flexible pacing for couples and families. WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': '6 Day Sri Lanka Tour | Private Driver & Hotels',
    'tour.6-day-sri-lanka-private-tour.description':
      'Six-day private Sri Lanka round tour with chauffeur guide, 4-star hotels, Yala safari and flexible beach time. Cultural sites plus hill country. WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': '7 Day Sri Lanka Tour | Safari, Hills & Beach',
    'tour.7-day-sri-lanka-tour.description':
      '7-day Sri Lanka tour with private driver: Wilpattu safari, Sigiriya, Kandy, Ella, Galle and beach. Hotels included. WhatsApp to reserve your dates.',
    'tour.8-day-sri-lanka-private-tour.title': '8 Day Sri Lanka Tour | Safari & South Coast',
    'tour.8-day-sri-lanka-private-tour.description':
      'Eight-day private round tour with a chauffeur guide: wildlife safari, Ella hill country and south-coast beaches. Hotels included. Flexible beach nights. WhatsApp.',
    'tour.10-day-sri-lanka-tour.title': '10 Day Sri Lanka Tour | Full Island Circuit',
    'tour.10-day-sri-lanka-tour.description':
      '10-day private Sri Lanka circuit: cultural triangle, Kandy, Ella, safari and beaches with a driver guide and hotels. Ideal island overview. WhatsApp to plan.',
  },
  de: {
    'home.title': 'Privater Fahrer Sri Lanka | Rundreise mit Fahrer',
    'home.description':
      'Privaten Chauffeur in Sri Lanka buchen. Tagesausflüge oder Rundreise mit Fahrer und Hotels. Deutschsprachig möglich. Anfrage per WhatsApp.',
    'tour.ella-day-tour.title': 'Ella Tagesausflug | Nine Arch & privater Fahrer',
    'tour.ella-day-tour.description':
      'Privater Ella-Tag ab Hotel: Nine Arch Bridge, Little Adam’s Peak, Ravana Falls und optionale Udawalawe-Safari. Chauffeur Guide. Buchung per WhatsApp.',
    'tour.galle-day-tour.title': 'Galle Tagesausflug | Fort & privater Fahrer',
    'tour.galle-day-tour.description':
      'Privater Galle-Tag ab Colombo oder Hotel: niederländisches Fort, Bentota-Boot, Tsunami-Mahnmal und Moonstone-Mine. Chauffeur Guide. WhatsApp-Anfrage.',
    'tour.kandy-day-tour.title': 'Kandy Tagesausflug | Zahntempel & Fahrer',
    'tour.kandy-day-tour.description':
      'Privater Kandy-Tag: Zahntempel, Botanischer Garten Peradeniya, Tee-Stopps und Stadt mit Chauffeur Guide. Abholung am Hotel. Anfrage per WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Sigiriya Tagesausflug | Löwenfelsen privat',
    'tour.sigiriya-day-tour.description':
      'Privater Sigiriya-Tag: Löwenfelsen oder Pidurangala, Höhlentempel Dambulla und optionale Minneriya-Safari. Chauffeur Guide. Buchung per WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': '2 Tage Ella & Kandy | Rundreise mit Fahrer',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Zweitages-Privattour Ella und Kandy mit Hotels, Chauffeur Guide, Nine Arch Bridge und Zahntempel. Optionale Zugfahrt im Hochland. WhatsApp-Buchung.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': '2 Tage Ella & Yala | Safari mit Fahrer',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      '2 Tage Ella und Yala-Safari privat: Nine Arch Bridge, Little Adam’s Peak, Jeep-Safari und Hotels mit Chauffeur Guide. Anfrage per WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': '4 Tage Rundreise mit Fahrer | Sri Lanka',
    'tour.4-day-sri-lanka-tour.description':
      'Private 4-Tage-Rundreise mit Chauffeur Guide: Kandy, Ella, Safari-Option und Südküste. Hotels inklusive. Abholung Flughafen oder Hotel. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': '5 Tage Rundreise mit Fahrer | Sri Lanka',
    'tour.5-day-sri-lanka-tour.description':
      '5-Tage-Paket: Sigiriya, Kandy, Ella, Safari und Strand mit Chauffeur und Hotels. Ideal für Paare und Familien. Jetzt per WhatsApp anfragen.',
    'tour.6-day-sri-lanka-private-tour.title': '6 Tage Rundreise mit Fahrer | Sri Lanka',
    'tour.6-day-sri-lanka-private-tour.description':
      'Sechstage-Rundreise mit Chauffeur Guide, 4-Sterne-Hotels, Safari und flexiblem Strand. Kultur, Hochland und Wildlife. Anfrage per WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': '7 Tage Rundreise mit Fahrer | Safari & Strand',
    'tour.7-day-sri-lanka-tour.description':
      '7 Tage Sri Lanka mit privatem Fahrer: Wilpattu-Safari, Sigiriya, Kandy, Ella, Galle und Strand. Hotels inklusive. Jetzt per WhatsApp buchen.',
    'tour.8-day-sri-lanka-private-tour.title': '8 Tage Rundreise mit Fahrer | Safari & Küste',
    'tour.8-day-sri-lanka-private-tour.description':
      'Achttage-Rundreise mit Chauffeur: Safari, Ella-Hochland und Südküste. Hotels inklusive, flexible Strandnächte. Anfrage per WhatsApp.',
    'tour.10-day-sri-lanka-tour.title': '10 Tage Rundreise mit Fahrer | Inselrundreise',
    'tour.10-day-sri-lanka-tour.description':
      '10-Tage-Paket: Kulturdreieck, Kandy, Ella, Safari und Strände mit Fahrer und Hotels. Die große Inselübersicht. Jetzt per WhatsApp planen.',
  },
  fr: {
    'home.title': 'Chauffeur privé Sri Lanka | Circuit avec chauffeur',
    'home.description':
      'Réservez un circuit privé avec chauffeur au Sri Lanka. Excursions d’une journée ou circuit multi-jours avec hôtels. Guide francophone possible. WhatsApp.',
    'tour.ella-day-tour.title': 'Excursion Ella | Nine Arch & chauffeur privé',
    'tour.ella-day-tour.description':
      'Journée privée à Ella avec prise en charge: Nine Arch Bridge, Little Adam’s Peak, cascade Ravana et safari Udawalawe en option. Chauffeur guide. WhatsApp.',
    'tour.galle-day-tour.title': 'Excursion Galle | Fort hollandais & chauffeur',
    'tour.galle-day-tour.description':
      'Journée privée à Galle depuis Colombo ou l’hôtel: Fort hollandais, bateau à Bentota, mémorial du tsunami et mine de moonstone. Chauffeur guide. WhatsApp.',
    'tour.kandy-day-tour.title': 'Excursion Kandy | Temple de la Dent',
    'tour.kandy-day-tour.description':
      'Journée privée à Kandy: Temple de la Dent, jardin de Peradeniya, étapes thé et ville avec chauffeur guide. Prise en charge hôtel. Réservation WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Excursion Sigiriya | Rocher du Lion privé',
    'tour.sigiriya-day-tour.description':
      'Journée privée à Sigiriya: Rocher du Lion ou Pidurangala, temples de Dambulla et safari éléphants à Minneriya en option. Chauffeur guide. WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': 'Circuit 2 jours Ella & Kandy | Chauffeur',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Circuit privé 2 jours Ella et Kandy avec hôtels, chauffeur guide, Nine Arch Bridge et Temple de la Dent. Option train en hill country. WhatsApp.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': 'Circuit 2 jours Ella & safari Yala',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      'Ella et safari en jeep à Yala en 2 jours, avec hôtels et chauffeur guide. Nine Arch Bridge, Little Adam’s Peak. Réservation WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': 'Circuit privé 4 jours | Chauffeur Sri Lanka',
    'tour.4-day-sri-lanka-tour.description':
      'Circuit privé 4 jours avec chauffeur guide: Kandy, Ella, safari optionnel et côte sud. Hôtels inclus. Prise en charge aéroport ou hôtel. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': 'Circuit privé 5 jours | Chauffeur Sri Lanka',
    'tour.5-day-sri-lanka-tour.description':
      'Forfait 5 jours: Sigiriya, Kandy, Ella, safari et plage avec chauffeur et hôtels. Rythme souple pour couples et familles. Demande WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': 'Circuit privé 6 jours | Chauffeur Sri Lanka',
    'tour.6-day-sri-lanka-private-tour.description':
      'Circuit de 6 jours avec chauffeur guide, hôtels 4 étoiles, safari et plage flexible. Culture, collines et wildlife. Réservation WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': 'Circuit 7 jours | Chauffeur, safari et plage',
    'tour.7-day-sri-lanka-tour.description':
      'Circuit Sri Lanka 7 jours avec chauffeur privé: safari Wilpattu, Sigiriya, Kandy, Ella, Galle et plage. Hôtels inclus. Réservez sur WhatsApp.',
    'tour.8-day-sri-lanka-private-tour.title': 'Circuit privé 8 jours | Safari et côte sud',
    'tour.8-day-sri-lanka-private-tour.description':
      'Circuit de 8 jours avec chauffeur: safari, Ella et côte sud. Hôtels inclus, nuits plage flexibles. Demande WhatsApp pour vos dates.',
    'tour.10-day-sri-lanka-tour.title': 'Circuit privé 10 jours | Tour de l’île',
    'tour.10-day-sri-lanka-tour.description':
      'Circuit privé 10 jours: triangle culturel, Kandy, Ella, safari et plages avec chauffeur guide et hôtels. Vue d’ensemble de l’île. WhatsApp.',
  },
  it: {
    'home.title': 'Autista privato Sri Lanka | Tour con autista',
    'home.description':
      'Prenota un tour privato con autista in Sri Lanka. Escursioni di un giorno o circuito multi-giorno con hotel. Guida in italiano possibile. WhatsApp.',
    'tour.ella-day-tour.title': 'Escursione Ella | Nine Arch e autista privato',
    'tour.ella-day-tour.description':
      'Giornata privata a Ella con ritiro in hotel: Nine Arch Bridge, Little Adam’s Peak, cascata Ravana e safari Udawalawe opzionale. Autista guida. WhatsApp.',
    'tour.galle-day-tour.title': 'Escursione Galle | Forte olandese e autista',
    'tour.galle-day-tour.description':
      'Giornata privata a Galle da Colombo o hotel: Forte olandese, barca a Bentota, memoriale tsunami e miniera di moonstone. Autista guida. WhatsApp.',
    'tour.kandy-day-tour.title': 'Escursione Kandy | Tempio del Dente',
    'tour.kandy-day-tour.description':
      'Giornata privata a Kandy: Tempio del Dente, giardino di Peradeniya, tappe del tè e città con autista guida. Ritiro in hotel. Prenotazione WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Escursione Sigiriya | Roccia del Leone privata',
    'tour.sigiriya-day-tour.description':
      'Giornata privata a Sigiriya: Roccia del Leone o Pidurangala, Dambulla e safari elefanti a Minneriya opzionale. Autista guida. Prenota su WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': 'Tour 2 giorni Ella e Kandy | Autista',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Tour privato 2 giorni Ella e Kandy con hotel, autista guida, Nine Arch Bridge e Tempio del Dente. Opzione treno in montagna. WhatsApp.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': 'Tour 2 giorni Ella e safari Yala',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      'Ella e safari in jeep a Yala in 2 giorni, con hotel e autista guida. Nine Arch Bridge, Little Adam’s Peak. Prenotazione WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': 'Tour privato 4 giorni | Autista Sri Lanka',
    'tour.4-day-sri-lanka-tour.description':
      'Tour privato 4 giorni con autista guida: Kandy, Ella, safari opzionale e costa sud. Hotel inclusi. Ritiro aeroporto o hotel. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': 'Tour privato 5 giorni | Autista Sri Lanka',
    'tour.5-day-sri-lanka-tour.description':
      'Pacchetto 5 giorni: Sigiriya, Kandy, Ella, safari e spiaggia con autista e hotel. Ritmo flessibile per coppie e famiglie. Richiesta WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': 'Tour privato 6 giorni | Autista Sri Lanka',
    'tour.6-day-sri-lanka-private-tour.description':
      'Circuito di 6 giorni con autista guida, hotel 4 stelle, safari e spiaggia flessibile. Cultura, colline e wildlife. Prenotazione WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': 'Tour 7 giorni | Autista, safari e spiaggia',
    'tour.7-day-sri-lanka-tour.description':
      'Tour Sri Lanka 7 giorni con autista privato: safari Wilpattu, Sigiriya, Kandy, Ella, Galle e spiaggia. Hotel inclusi. Prenota su WhatsApp.',
    'tour.8-day-sri-lanka-private-tour.title': 'Tour privato 8 giorni | Safari e costa sud',
    'tour.8-day-sri-lanka-private-tour.description':
      'Circuito di 8 giorni con autista: safari, Ella e costa sud. Hotel inclusi, notti spiaggia flessibili. Richiesta WhatsApp per le date.',
    'tour.10-day-sri-lanka-tour.title': 'Tour privato 10 giorni | Giro dell’isola',
    'tour.10-day-sri-lanka-tour.description':
      'Tour privato 10 giorni: triangolo culturale, Kandy, Ella, safari e spiagge con autista guida e hotel. Panoramica dell’isola. WhatsApp.',
  },
  es: {
    'home.title': 'Chófer privado Sri Lanka | Circuito con chófer',
    'home.description':
      'Reserva un circuito privado con chófer en Sri Lanka. Excursiones de un día o ruta de varios días con hoteles. Guía en español posible. WhatsApp.',
    'tour.ella-day-tour.title': 'Tour 1 día Ella | Nine Arch y chófer privado',
    'tour.ella-day-tour.description':
      'Excursión privada a Ella con recogida en hotel: Nine Arch Bridge, Little Adam’s Peak, cascada Ravana y safari Udawalawe opcional. Chófer guía. WhatsApp.',
    'tour.galle-day-tour.title': 'Tour 1 día Galle | Fuerte holandés y chófer',
    'tour.galle-day-tour.description':
      'Tour privado a Galle desde Colombo o el hotel: Fuerte holandés, bote en Bentota, memorial del tsunami y mina de moonstone. Chófer guía. WhatsApp.',
    'tour.kandy-day-tour.title': 'Tour 1 día Kandy | Templo del Diente',
    'tour.kandy-day-tour.description':
      'Tour privado a Kandy: Templo del Diente, jardín de Peradeniya, paradas de té y ciudad con chófer guía. Recogida en hotel. Reserva por WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Tour 1 día Sigiriya | Roca del León privada',
    'tour.sigiriya-day-tour.description':
      'Tour privado a Sigiriya: Roca del León o Pidurangala, Dambulla y safari de elefantes en Minneriya opcional. Chófer guía. Reserva por WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': 'Tour 2 días Ella y Kandy | Chófer',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Circuito privado 2 días Ella y Kandy con hoteles, chófer guía, Nine Arch Bridge y Templo del Diente. Opción de tren de montaña. WhatsApp.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': 'Tour 2 días Ella y safari Yala',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      'Ella y safari en jeep en Yala en 2 días, con hoteles y chófer guía. Nine Arch Bridge, Little Adam’s Peak. Reserva por WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': 'Tour privado 4 días | Chófer Sri Lanka',
    'tour.4-day-sri-lanka-tour.description':
      'Tour privado 4 días con chófer guía: Kandy, Ella, safari opcional y costa sur. Hoteles incluidos. Recogida aeropuerto u hotel. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': 'Tour privado 5 días | Chófer Sri Lanka',
    'tour.5-day-sri-lanka-tour.description':
      'Paquete de 5 días: Sigiriya, Kandy, Ella, safari y playa con chófer y hoteles. Ritmo flexible para parejas y familias. Consulta por WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': 'Tour privado 6 días | Chófer Sri Lanka',
    'tour.6-day-sri-lanka-private-tour.description':
      'Circuito de 6 días con chófer guía, hoteles 4 estrellas, safari y playa flexible. Cultura, colinas y fauna. Reserva por WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': 'Tour 7 días | Chófer, safari y playa',
    'tour.7-day-sri-lanka-tour.description':
      'Tour privado 7 días por Sri Lanka con chófer guía: Wilpattu, Sigiriya, Kandy, Ella, Galle y playa. Hoteles incluidos. Reserva por WhatsApp.',
    'tour.8-day-sri-lanka-private-tour.title': 'Tour privado 8 días | Safari y costa sur',
    'tour.8-day-sri-lanka-private-tour.description':
      'Circuito de 8 días con chófer: safari, Ella y costa sur. Hoteles incluidos, noches de playa flexibles. Consulta fechas por WhatsApp.',
    'tour.10-day-sri-lanka-tour.title': 'Tour privado 10 días | Circuito de la isla',
    'tour.10-day-sri-lanka-tour.description':
      'Paquete de 10 días: triángulo cultural, Kandy, Ella, safari y playas con conductor guía y hoteles. Visión completa de la isla. WhatsApp.',
  },
  pl: {
    'home.title': 'Prywatny kierowca Sri Lanka | Wycieczka z kierowcą',
    'home.description':
      'Zarezerwuj prywatną wycieczkę z kierowcą na Sri Lance. Dzień lub kilka dni z hotelami. Przewodnik po polsku możliwy. Zapytanie WhatsApp.',
    'tour.ella-day-tour.title': 'Wycieczka Ella | Nine Arch i prywatny kierowca',
    'tour.ella-day-tour.description':
      'Prywatny dzień w Ella z odbiorem z hotelu: Nine Arch Bridge, Little Adam’s Peak, wodospad Ravana i opcjonalne safari Udawalawe. Kierowca przewodnik. WhatsApp.',
    'tour.galle-day-tour.title': 'Wycieczka Galle | Fort i prywatny kierowca',
    'tour.galle-day-tour.description':
      'Prywatny dzień w Galle z Colombo lub hotelu: fort holenderski, łódź w Bentota, pomnik tsunami i kopalnia moonstone. Kierowca przewodnik. WhatsApp.',
    'tour.kandy-day-tour.title': 'Wycieczka Kandy | Świątynia Zęba',
    'tour.kandy-day-tour.description':
      'Prywatny dzień w Kandy: Świątynia Zęba, ogród Peradeniya, herbata i miasto z kierowcą przewodnikiem. Odbiór z hotelu. Rezerwacja WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Wycieczka Sigiriya | Lwia Skała prywatnie',
    'tour.sigiriya-day-tour.description':
      'Prywatny dzień w Sigiriya: Lwia Skała lub Pidurangala, Dambulla i opcjonalne safari słoni w Minneriya. Kierowca przewodnik. WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': '2 dni Ella i Kandy | Prywatny kierowca',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Prywatna wycieczka 2-dniowa Ella i Kandy z hotelami, kierowcą, Nine Arch Bridge i Świątynią Zęba. Opcja pociągu w górach. WhatsApp.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': '2 dni Ella i safari Yala | Kierowca',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      '2 dni Ella i safari Yala prywatnie: Nine Arch Bridge, Little Adam’s Peak, jeep safari i hotele z kierowcą przewodnikiem. Rezerwacja WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': 'Wycieczka 4 dni | Prywatny kierowca Sri Lanka',
    'tour.4-day-sri-lanka-tour.description':
      'Prywatna wycieczka 4 dni z kierowcą przewodnikiem: Kandy, Ella, opcja safari i południowe wybrzeże. Hotele w cenie. Odbiór lotnisko/hotel. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': 'Wycieczka 5 dni | Prywatny kierowca Sri Lanka',
    'tour.5-day-sri-lanka-tour.description':
      'Pakiet 5 dni: Sigiriya, Kandy, Ella, safari i plaża z kierowcą i hotelami. Elastyczne tempo dla par i rodzin. Zapytanie WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': 'Wycieczka 6 dni | Prywatny kierowca Sri Lanka',
    'tour.6-day-sri-lanka-private-tour.description':
      'Objazd 6 dni z kierowcą przewodnikiem, hotelami 4*, safari i elastyczną plażą. Kultura, góry i przyroda. Rezerwacja WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': 'Wycieczka 7 dni | Kierowca, safari i plaża',
    'tour.7-day-sri-lanka-tour.description':
      '7-dniowa wycieczka z prywatnym kierowcą: safari Wilpattu, Sigiriya, Kandy, Ella, Galle i plaża. Hotele w cenie. Rezerwacja WhatsApp.',
    'tour.8-day-sri-lanka-private-tour.title': 'Wycieczka 8 dni | Safari i południowe wybrzeże',
    'tour.8-day-sri-lanka-private-tour.description':
      'Objazd 8 dni z kierowcą: safari, Ella i południowe wybrzeże. Hotele w cenie, elastyczne noce na plaży. Terminy przez WhatsApp.',
    'tour.10-day-sri-lanka-tour.title': 'Wycieczka 10 dni | Objazd wyspy z kierowcą',
    'tour.10-day-sri-lanka-tour.description':
      'Pakiet 10 dni: trójkąt kulturowy, Kandy, Ella, safari i plaże z kierowcą przewodnikiem i hotelami. Pełny przegląd wyspy. WhatsApp.',
  },
  ru: {
    'home.title': 'Частный водитель Шри-Ланка | Тур с водителем',
    'home.description':
      'Закажите частный тур с водителем на Шри-Ланке. Однодневные туры или многодневный маршрут с отелями. Русскоязычный гид возможен. WhatsApp.',
    'tour.ella-day-tour.title': 'Тур в Эллу на 1 день | Nine Arch и водитель',
    'tour.ella-day-tour.description':
      'Частный день в Элле с трансфером из отеля: Nine Arch Bridge, Little Adam’s Peak, водопад Равана и сафари Удавалаве по желанию. Гид-водитель. WhatsApp.',
    'tour.galle-day-tour.title': 'Тур в Галле на 1 день | Форт и водитель',
    'tour.galle-day-tour.description':
      'Частный день в Галле из Коломбо или отеля: голландский форт, лодка в Бентоте, мемориал цунами и шахта лунного камня. Гид-водитель. WhatsApp.',
    'tour.kandy-day-tour.title': 'Тур в Канди на 1 день | Храм Зуба',
    'tour.kandy-day-tour.description':
      'Частный день в Канди: Храм Зуба, сад Перадения, чайные остановки и город с гидом-водителем. Трансфер из отеля. Бронь в WhatsApp.',
    'tour.sigiriya-day-tour.title': 'Тур в Сигирию | Львиная скала частно',
    'tour.sigiriya-day-tour.description':
      'Частный день в Сигирии: Львиная скала или Пидурангала, Дамбулла и сафари слонов в Миннерии по желанию. Гид-водитель. Бронь в WhatsApp.',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.title': '2 дня Элла и Канди | Частный водитель',
    'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
      'Частный тур 2 дня Элла и Канди с отелями, гидом-водителем, Nine Arch Bridge и Храмом Зуба. Опция поезда в горах. WhatsApp.',
    'tour.2-day-ella-yala-private-tour-sri-lanka.title': '2 дня Элла и сафари Яла | Водитель',
    'tour.2-day-ella-yala-private-tour-sri-lanka.description':
      '2 дня Элла и сафари Яла: Nine Arch Bridge, Little Adam’s Peak, джип-сафари и отели с частным гидом-водителем. Бронь в WhatsApp.',
    'tour.4-day-sri-lanka-tour.title': 'Тур 4 дня | Частный водитель Шри-Ланка',
    'tour.4-day-sri-lanka-tour.description':
      'Частный тур 4 дня с гидом-водителем: Канди, Элла, опция сафари и южное побережье. Отели включены. Подача из аэропорта или отеля. WhatsApp.',
    'tour.5-day-sri-lanka-tour.title': 'Тур 5 дней | Частный водитель Шри-Ланка',
    'tour.5-day-sri-lanka-tour.description':
      'Пакет 5 дней: Сигирия, Канди, Элла, сафари и пляж с водителем и отелями. Гибкий темп для пар и семей. Запрос в WhatsApp.',
    'tour.6-day-sri-lanka-private-tour.title': 'Тур 6 дней | Частный водитель Шри-Ланка',
    'tour.6-day-sri-lanka-private-tour.description':
      'Кольцевой тур 6 дней с гидом-водителем, отелями 4*, сафари и гибким пляжем. Культура, холмы и природа. Бронь в WhatsApp.',
    'tour.7-day-sri-lanka-tour.title': 'Тур 7 дней | Водитель, сафари и пляж',
    'tour.7-day-sri-lanka-tour.description':
      '7-дневный тур с частным водителем: сафари Вилпатту, Сигирия, Канди, Элла, Галле и пляж. Отели включены. Бронь в WhatsApp.',
    'tour.8-day-sri-lanka-private-tour.title': 'Тур 8 дней | Сафари и южное побережье',
    'tour.8-day-sri-lanka-private-tour.description':
      'Частный тур 8 дней с водителем: сафари, Элла и южное побережье. Отели включены, гибкие пляжные ночи. Даты в WhatsApp.',
    'tour.10-day-sri-lanka-tour.title': 'Тур 10 дней | Круговой тур по острову',
    'tour.10-day-sri-lanka-tour.description':
      'Частный тур 10 дней: культурный треугольник, Канди, Элла, сафари и пляжи с гидом-водителем и отелями. Обзор острова. WhatsApp.',
  },
};

// Fix EN 5-day title — remove accidental German word
PATCHES.en['tour.5-day-sri-lanka-tour.title'] = '5 Day Sri Lanka Tour | Private Driver & Hotels';

let failures = 0;
for (const [lang, patch] of Object.entries(PATCHES)) {
  const file = path.join(root, 'src', 'assets', 'i18n', lang, 'seo.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [key, value] of Object.entries(patch)) {
    const n = len(value);
    const isTitle = key.endsWith('.title');
    if (isTitle && n > 60) {
      console.error(`FAIL ${lang} ${key} title len=${n}: ${value}`);
      failures++;
    }
    if (!isTitle && (n < 140 || n > 155)) {
      console.error(`FAIL ${lang} ${key} desc len=${n}: ${value}`);
      failures++;
    }
    data[key] = value;
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`updated ${lang}`);
}

if (failures) {
  console.error(`\n${failures} length failures — fix before deploy`);
  process.exit(1);
}
console.log('OK');
