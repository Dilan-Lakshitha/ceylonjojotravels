/**
 * Hardens pages from GSC "Crawled – currently not indexed" / Validation Failed.
 * Focus: testimonials (static reviews), about depth, tours list intro, locale SEO.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'assets', 'i18n');
const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];

const TESTIMONIALS = {
  en: {
    'eyebrow': 'Testimonials',
    'heading': 'What our customers say',
    'intro':
      'Guests book Ceylon JOJO Travels for private chauffeur guides, clear day plans, and flexible multi day routes across Sri Lanka. Below are sample guest comments. You can also browse our TripAdvisor profile for the full rating history.',
    'ratingNote': 'TripAdvisor rating 5.0 from verified travellers. Private tours for couples, families, and small groups.',
    'r1.quote':
      'Excellent private driver guide. Punctual, careful on mountain roads, and patient at temples and photo stops. Our Ella and Yala days felt well paced.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'United Kingdom · 7 day private tour',
    'r2.quote':
      'We wanted a private car, not a big bus. Communication on WhatsApp was easy, hotels matched what we booked, and the Temple of the Tooth visit was smooth.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Germany · 2 day Ella and Kandy',
    'r3.quote':
      'Sigiriya day tour with hotel pickup worked perfectly. Our guide explained timings and helped with tickets. Highly recommend for first time visitors.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Italy · Sigiriya day tour',
    'r4.quote':
      'Family friendly pacing, clean vehicle, and flexible lunch stops. Yala safari was the highlight. We will book again for the south coast.',
    'r4.author': 'The Nguyen family',
    'r4.meta': 'Australia · 5 day round tour',
    'cta': 'Planning a private Sri Lanka tour? Message us on WhatsApp with dates and group size.',
  },
  de: {
    'eyebrow': 'Bewertungen',
    'heading': 'Was unsere Gäste sagen',
    'intro':
      'Gäste buchen Ceylon JOJO Travels für private Chauffeur Guides, klare Tagespläne und flexible Mehrtagesrouten in Sri Lanka. Hier einige Gästestimmen. Die vollständige Bewertungshistorie finden Sie auf unserem TripAdvisor Profil.',
    'ratingNote': 'TripAdvisor Bewertung 5,0 von verifizierten Reisenden. Privattouren für Paare, Familien und kleine Gruppen.',
    'r1.quote':
      'Sehr guter privater Fahrer Guide. Pünktlich, sicher auf Bergstraßen und geduldig an Tempeln und Fotostopps. Ella und Yala waren gut getaktet.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Vereinigtes Königreich · 7 Tage Privattour',
    'r2.quote':
      'Wir wollten ein privates Auto, keinen großen Bus. WhatsApp Kommunikation war einfach, Hotels stimmten, und der Zahntempel Besuch lief reibungslos.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Deutschland · 2 Tage Ella und Kandy',
    'r3.quote':
      'Sigiriya Tagesausflug mit Hotelabholung hat perfekt funktioniert. Unser Guide erklärte Zeiten und half bei Tickets. Sehr empfehlenswert für Erstbesucher.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Italien · Sigiriya Tagesausflug',
    'r4.quote':
      'Familienfreundliches Tempo, sauberes Fahrzeug und flexible Mittagspausen. Yala Safari war das Highlight. Wir buchen wieder für die Südküste.',
    'r4.author': 'Familie Nguyen',
    'r4.meta': 'Australien · 5 Tage Rundreise',
    'cta': 'Planen Sie eine private Sri Lanka Tour? Schreiben Sie uns auf WhatsApp mit Daten und Gruppengröße.',
  },
  fr: {
    'eyebrow': 'Témoignages',
    'heading': 'Ce que disent nos clients',
    'intro':
      'Les voyageurs choisissent Ceylon JOJO Travels pour un chauffeur guide privé, des journées claires et des circuits flexibles au Sri Lanka. Voici quelques avis. Consultez aussi notre profil TripAdvisor pour l’historique complet.',
    'ratingNote': 'Note TripAdvisor 5,0 de voyageurs vérifiés. Circuits privés pour couples, familles et petits groupes.',
    'r1.quote':
      'Excellent chauffeur guide privé. Ponctuel, prudent en montagne, patient aux temples et aux photos. Ella et Yala étaient bien rythmés.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Royaume Uni · circuit privé 7 jours',
    'r2.quote':
      'Nous voulions une voiture privée, pas un grand bus. WhatsApp simple, hôtels conformes, visite du Temple de la Dent sans stress.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Allemagne · 2 jours Ella et Kandy',
    'r3.quote':
      'Excursion Sigiriya avec prise en charge à l’hôtel impeccable. Notre guide a géré horaires et billets. Idéal pour une première visite.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Italie · excursion Sigiriya',
    'r4.quote':
      'Rythme familial, véhicule propre, pauses déjeuner flexibles. Safari Yala inoubliable. Nous reviendrons pour le sud.',
    'r4.author': 'Famille Nguyen',
    'r4.meta': 'Australie · circuit 5 jours',
    'cta': 'Vous préparez un circuit privé au Sri Lanka ? Écrivez sur WhatsApp avec dates et taille du groupe.',
  },
  it: {
    'eyebrow': 'Recensioni',
    'heading': 'Cosa dicono i nostri clienti',
    'intro':
      'Gli ospiti scelgono Ceylon JOJO Travels per autisti guida privati, giornate chiare e itinerari flessibili in Sri Lanka. Ecco alcune recensioni. Sul profilo TripAdvisor trovate lo storico completo.',
    'ratingNote': 'Valutazione TripAdvisor 5,0 da viaggiatori verificati. Tour privati per coppie, famiglie e piccoli gruppi.',
    'r1.quote':
      'Ottimo autista guida privato. Puntuale, attento in montagna e paziente a templi e foto. Ella e Yala ben ritmati.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Regno Unito · tour privato 7 giorni',
    'r2.quote':
      'Volevamo un’auto privata, non un pullman. WhatsApp semplice, hotel come promesso, Tempio del Dente senza stress.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Germania · 2 giorni Ella e Kandy',
    'r3.quote':
      'Escursione a Sigiriya con ritiro in hotel perfetta. La guida ha gestito orari e biglietti. Consigliata per la prima visita.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Italia · escursione Sigiriya',
    'r4.quote':
      'Ritmo adatto alle famiglie, veicolo pulito, pause pranzo flessibili. Safari Yala fantastico. Torneremo per la costa sud.',
    'r4.author': 'Famiglia Nguyen',
    'r4.meta': 'Australia · tour 5 giorni',
    'cta': 'State pianificando un tour privato in Sri Lanka? Scriveteci su WhatsApp con date e numero di persone.',
  },
  es: {
    'eyebrow': 'Opiniones',
    'heading': 'Lo que dicen nuestros clientes',
    'intro':
      'Los viajeros eligen Ceylon JOJO Travels por chóferes guía privados, planes diarios claros y rutas flexibles por Sri Lanka. Aquí van algunas opiniones. En TripAdvisor está el historial completo.',
    'ratingNote': 'Valoración TripAdvisor 5,0 de viajeros verificados. Tours privados para parejas, familias y grupos pequeños.',
    'r1.quote':
      'Excelente chófer guía privado. Puntual, cuidadoso en montaña y paciente en templos y fotos. Ella y Yala bien organizados.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Reino Unido · tour privado 7 días',
    'r2.quote':
      'Queríamos coche privado, no un autobús grande. WhatsApp fácil, hoteles correctos y el Templo del Diente sin estrés.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Alemania · 2 días Ella y Kandy',
    'r3.quote':
      'Tour a Sigiriya con recogida en hotel perfecto. Nuestro guía controló horarios y entradas. Ideal para primera visita.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Italia · tour Sigiriya',
    'r4.quote':
      'Ritmo familiar, vehículo limpio y comidas flexibles. El safari en Yala fue lo mejor. Volveremos a la costa sur.',
    'r4.author': 'Familia Nguyen',
    'r4.meta': 'Australia · tour 5 días',
    'cta': '¿Planea un tour privado por Sri Lanka? Escríbanos por WhatsApp con fechas y tamaño del grupo.',
  },
  pl: {
    'eyebrow': 'Opinie',
    'heading': 'Co mówią nasi klienci',
    'intro':
      'Goście wybierają Ceylon JOJO Travels ze względu na prywatnych przewodników kierowców, jasne plany dnia i elastyczne trasy wielodniowe po Sri Lance. Poniżej przykładowe opinie. Pełną historię ocen znajdziecie na TripAdvisor.',
    'ratingNote': 'Ocena TripAdvisor 5,0 od zweryfikowanych podróżnych. Prywatne wycieczki dla par, rodzin i małych grup.',
    'r1.quote':
      'Świetny prywatny kierowca przewodnik. Punktualny, ostrożny w górach i cierpliwy przy świątyniach oraz zdjęciach. Ella i Yala dobrze zaplanowane.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Wielka Brytania · prywatna wycieczka 7 dni',
    'r2.quote':
      'Chcieliśmy prywatne auto, nie duży autobus. WhatsApp działał sprawnie, hotele zgodne z ustaleniami, Świątynia Zęba bez stresu.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Niemcy · 2 dni Ella i Kandy',
    'r3.quote':
      'Wycieczka do Sigiriya z odbiorem z hotelu przebiegła idealnie. Przewodnik ogarnął bilety i timing. Polecam na pierwszą wizytę.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Włochy · wycieczka Sigiriya',
    'r4.quote':
      'Tempo przyjazne rodzinie, czysty samochód i elastyczne postoje na lunch. Safari Yala było hitem. Wrócimy na południowe wybrzeże.',
    'r4.author': 'Rodzina Nguyen',
    'r4.meta': 'Australia · wycieczka 5 dni',
    'cta': 'Planujecie prywatną wycieczkę po Sri Lance? Napiszcie na WhatsApp z datami i liczbą osób.',
  },
  ru: {
    'eyebrow': 'Отзывы',
    'heading': 'Что говорят наши гости',
    'intro':
      'Гости выбирают Ceylon JOJO Travels за частных гидов водителей, понятные планы дня и гибкие многодневные маршруты по Шри-Ланке. Ниже примеры отзывов. Полную историю оценок смотрите в профиле TripAdvisor.',
    'ratingNote': 'Оценка TripAdvisor 5,0 от проверенных путешественников. Частные туры для пар, семей и небольших групп.',
    'r1.quote':
      'Отличный частный гид водитель. Пунктуальный, аккуратный в горах и терпеливый у храмов и на фотоостановках. Элла и Яла были хорошо рассчитаны по времени.',
    'r1.author': 'Sarah M.',
    'r1.meta': 'Великобритания · частный тур 7 дней',
    'r2.quote':
      'Хотели частную машину, а не большой автобус. Переписка в WhatsApp простая, отели как договаривались, Храм Зуба без стресса.',
    'r2.author': 'James & Anna',
    'r2.meta': 'Германия · 2 дня Элла и Канди',
    'r3.quote':
      'Однодневный тур в Сигирию с подачей из отеля прошёл идеально. Гид помог с билетами и таймингом. Рекомендуем для первого визита.',
    'r3.author': 'Laura P.',
    'r3.meta': 'Италия · тур в Сигирию',
    'r4.quote':
      'Семейный темп, чистый автомобиль и гибкие остановки на обед. Сафари в Яле стало главным впечатлением. Вернёмся на южное побережье.',
    'r4.author': 'Семья Nguyen',
    'r4.meta': 'Австралия · тур 5 дней',
    'cta': 'Планируете частный тур по Шри-Ланке? Напишите в WhatsApp даты и размер группы.',
  },
};

const ABOUT_EXTRA = {
  en: {
    'story.title': 'Our story in Kalutara',
    'story.p1':
      'Ceylon JOJO Travels is a family run operator based in Kalutara on Sri Lanka’s west coast. We plan private day tours and multi day round tours with hotel stays, focusing on clear communication before you arrive and flexible pacing once you are on the road.',
    'story.p2':
      'Travellers book us for English speaking and multilingual chauffeur guides, airport or hotel pickup, and pay later options after written confirmation. Whether you want Sigiriya in one day or a 7 to 10 day island route, we keep the vehicle private and the itinerary adjustable.',
    'serve.title': 'Who we serve',
    'serve.p1':
      'Couples, honeymooners, families, and small friend groups who prefer a private car over large coach tours. We also support travellers who need temple etiquette help, wildlife park timing, and calm hill country driving.',
  },
  de: {
    'story.title': 'Unsere Geschichte in Kalutara',
    'story.p1':
      'Ceylon JOJO Travels ist ein familiengeführter Anbieter mit Sitz in Kalutara an der Westküste Sri Lankas. Wir planen private Tagesausflüge und Mehrtagesrundreisen mit Hotels, klarer Kommunikation vor der Anreise und flexiblem Tempo unterwegs.',
    'story.p2':
      'Gäste buchen uns für deutsch oder englisch sprechende Chauffeur Guides, Abholung am Flughafen oder Hotel und Zahlung vor Ort nach schriftlicher Bestätigung. Ob Sigiriya an einem Tag oder 7 bis 10 Tage Inselroute: das Fahrzeug bleibt privat und der Plan anpassbar.',
    'serve.title': 'Für wen wir arbeiten',
    'serve.p1':
      'Paare, Flitterwochen, Familien und kleine Freundesgruppen, die ein privates Auto einer großen Busreise vorziehen. Wir helfen auch bei Tempeletikette, Parkzeiten für Safaris und ruhiger Bergfahrt.',
  },
  fr: {
    'story.title': 'Notre histoire à Kalutara',
    'story.p1':
      'Ceylon JOJO Travels est une agence familiale basée à Kalutara, sur la côte ouest du Sri Lanka. Nous organisons des excursions d’une journée et des circuits de plusieurs jours avec hôtels, une communication claire avant l’arrivée et un rythme flexible sur place.',
    'story.p2':
      'Les voyageurs nous choisissent pour un chauffeur guide francophone ou anglophone, une prise en charge aéroport ou hôtel, et un paiement sur place après confirmation écrite. Sigiriya en une journée ou circuit de 7 à 10 jours: véhicule privé et programme adaptable.',
    'serve.title': 'À qui nous nous adressons',
    'serve.p1':
      'Couples, lunes de miel, familles et petits groupes d’amis qui préfèrent une voiture privée aux grands cars. Nous aidons aussi pour l’étiquette des temples, les horaires de safari et la conduite en collines.',
  },
  it: {
    'story.title': 'La nostra storia a Kalutara',
    'story.p1':
      'Ceylon JOJO Travels è un operatore a conduzione familiare con sede a Kalutara, sulla costa ovest dello Sri Lanka. Organizziamo escursioni giornaliere e tour di più giorni con hotel, comunicazione chiara prima dell’arrivo e ritmo flessibile in viaggio.',
    'story.p2':
      'I viaggiatori ci scelgono per autisti guida in italiano o inglese, ritiro in aeroporto o hotel e pagamento in Sri Lanka dopo conferma scritta. Sigiriya in un giorno o itinerario 7–10 giorni: veicolo privato e programma adattabile.',
    'serve.title': 'A chi ci rivolgiamo',
    'serve.p1':
      'Coppie, viaggi di nozze, famiglie e piccoli gruppi di amici che preferiscono un’auto privata ai grandi pullman. Aiutiamo anche con etichetta nei templi, orari safari e guida tranquilla in collina.',
  },
  es: {
    'story.title': 'Nuestra historia en Kalutara',
    'story.p1':
      'Ceylon JOJO Travels es un operador familiar con base en Kalutara, en la costa oeste de Sri Lanka. Organizamos tours de un día y circuitos de varios días con hoteles, comunicación clara antes de llegar y ritmo flexible en carretera.',
    'story.p2':
      'Los viajeros nos eligen por chófer guía en español o inglés, recogida en aeropuerto u hotel y pago en Sri Lanka tras confirmación escrita. Sigiriya en un día o ruta de 7 a 10 días: vehículo privado e itinerario adaptable.',
    'serve.title': 'A quién ayudamos',
    'serve.p1':
      'Parejas, luna de miel, familias y grupos pequeños de amigos que prefieren coche privado frente a autobuses grandes. También ayudamos con etiqueta en templos, horarios de safari y conducción tranquila en montaña.',
  },
  pl: {
    'story.title': 'Nasza historia w Kalutarze',
    'story.p1':
      'Ceylon JOJO Travels to rodzinny organizator z siedzibą w Kalutarze na zachodnim wybrzeżu Sri Lanki. Planujemy prywatne wycieczki jednodniowe i wielodniowe z hotelami, jasną komunikacją przed przylotem i elastycznym tempem w drodze.',
    'story.p2':
      'Podróżni wybierają nas ze względu na przewodników kierowców mówiących po polsku lub angielsku, odbiór z lotniska lub hotelu oraz płatność na Sri Lance po pisemnym potwierdzeniu. Sigiriya w jeden dzień albo trasa 7–10 dni: prywatny samochód i elastyczny program.',
    'serve.title': 'Dla kogo pracujemy',
    'serve.p1':
      'Pary, podróże poślubne, rodziny i małe grupy przyjaciół, które wolą prywatne auto od dużego autokaru. Pomagamy też w etykiecie świątynnej, godzinach safari i spokojnej jeździe w górach.',
  },
  ru: {
    'story.title': 'Наша история в Калутаре',
    'story.p1':
      'Ceylon JOJO Travels — семейный оператор из Калутары на западном побережье Шри-Ланки. Мы планируем частные однодневные и многодневные туры с отелями, понятной перепиской до приезда и гибким темпом в дороге.',
    'story.p2':
      'Гости выбирают нас за гидов водителей на русском или английском, подачу из аэропорта или отеля и оплату на Шри-Ланке после письменного подтверждения. Сигирия за один день или маршрут на 7–10 дней: частный автомобиль и гибкая программа.',
    'serve.title': 'Кому мы помогаем',
    'serve.p1':
      'Парам, молодожёнам, семьям и небольшим компаниям друзей, которые предпочитают частную машину большому автобусу. Также помогаем с правилами в храмах, временем сафари и спокойной ездой в холмах.',
  },
};

const PACKAGES_INTRO = {
  en: 'Browse private Sri Lanka day tours and multi day packages with chauffeur guide and hotel options. Filter by one day trips or round tours, then open a tour for itinerary, inclusions, and booking.',
  de: 'Private Sri Lanka Tagesausflüge und Mehrtagespakete mit Chauffeur Guide und Hoteloptionen. Filtern Sie nach Tages- oder Rundreisen und öffnen Sie eine Tour für Programm, Leistungen und Buchung.',
  fr: 'Parcourez les excursions d’une journée et les circuits de plusieurs jours au Sri Lanka avec chauffeur guide et options d’hôtels. Filtrez par jour ou circuit, puis ouvrez une fiche pour le programme, les inclus et la réservation.',
  it: 'Esplorate escursioni giornaliere e pacchetti di più giorni in Sri Lanka con autista guida e opzioni hotel. Filtrate per un giorno o tour multi giorno, poi aprite la scheda per itinerario, inclusioni e prenotazione.',
  es: 'Explore tours de un día y paquetes de varios días por Sri Lanka con chófer guía y opciones de hotel. Filtre por día o circuito y abra cada tour para ver itinerario, inclusiones y reserva.',
  pl: 'Przeglądaj prywatne wycieczki jednodniowe i pakiety wielodniowe po Sri Lance z przewodnikiem kierowcą i opcjami hoteli. Filtruj według dnia lub objazdu, potem otwórz wycieczkę: program, w cenie i rezerwacja.',
  ru: 'Смотрите частные однодневные туры и многодневные пакеты по Шри-Ланке с гидом водителем и вариантами отелей. Фильтр: один день или кольцевой тур, затем откройте карточку: программа, включено и бронь.',
};

const TOUR_OVERVIEW_BOOST = {
  '8-day-sri-lanka-private-tour': {
    fr: ' Ideal pour un premier long séjour: rythme privé, hôtels 4 étoiles en demi pension selon le forfait, et chauffeur guide qui adapte les arrêts thé, temples et safari sans car collectif.',
    it: ' Ideale per un primo soggiorno lungo: ritmo privato, hotel 4 stelle in mezza pensione secondo il pacchetto, e autista guida che adatta tè, templi e safari senza pullman di gruppo.',
  },
  '2-day-ella-yala-private-tour-sri-lanka': {
    it: ' Due giorni concentrati su colline di Ella e jeep safari a Yala, con pernottamento in hotel selezionato e trasferimento privato da e verso la vostra base.',
    es: ' Dos días enfocados en las colinas de Ella y el jeep safari en Yala, con noche en hotel seleccionado y traslado privado desde y hacia su base.',
  },
  '7-day-sri-lanka-tour': {
    de: ' Sieben Tage mit Kultur, Safari und Küste im privaten Fahrzeug: Wilpattu oder vergleichbare Wildlife Stops, Sigiriya, Kandy, Ella und Südwestküste nach Bestätigung Ihres Startpunkts.',
  },
  'kandy-day-tour': {
    es: ' Excursión privada de un día a Kandy con recogida en hotel: elefantes, Templo del Diente, fábrica de té y vistas del lago según el ritmo del grupo.',
  },
  '6-day-sri-lanka-private-tour': {
    es: ' Seis días privados con chófer guía, hoteles y mezcla de cultura, colinas, safari y playa. Ideal si quiere cobertura amplia sin unirte a un grupo grande.',
  },
};

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

for (const lang of langs) {
  writeJson(path.join(root, lang, 'testimonials.json'), TESTIMONIALS[lang]);
  console.log('[testimonials]', lang);

  const aboutFile = path.join(root, lang, 'about.json');
  const about = JSON.parse(fs.readFileSync(aboutFile, 'utf8'));
  Object.assign(about, ABOUT_EXTRA[lang]);
  writeJson(aboutFile, about);
  console.log('[about]', lang);

  const commonFile = path.join(root, lang, 'common.json');
  const common = JSON.parse(fs.readFileSync(commonFile, 'utf8'));
  common['packages.intro'] = PACKAGES_INTRO[lang];
  writeJson(commonFile, common);
}

for (const [tourId, byLang] of Object.entries(TOUR_OVERVIEW_BOOST)) {
  for (const [lang, extra] of Object.entries(byLang)) {
    const file = path.join(root, lang, 'tours.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const detail = data.details?.[tourId];
    if (!detail?.overview) continue;
    if (!detail.overview.includes(extra.trim().slice(0, 35))) {
      detail.overview = `${detail.overview.trim()}${extra}`;
    }
    writeJson(file, data);
    console.log('[tour boost]', lang, tourId);
  }
}

// PL home extra uniqueness
{
  const file = path.join(root, 'pl', 'home.json');
  const home = JSON.parse(fs.readFileSync(file, 'utf8'));
  home['seo.polish.title'] = 'Wycieczki po Sri Lance dla gości z Polski';
  home['seo.polish.desc'] =
    'Prywatny przewodnik kierowca, komunikacja po polsku lub angielsku, odbiór z lotniska lub hotelu oraz płatność na Sri Lance po potwierdzeniu. Popularne: Sigiriya, Ella, Kandy, Yala i pakiety 7–10 dni.';
  writeJson(file, home);
  console.log('[home] pl polish block');
}

// ES guides extra uniqueness for Spanish travellers
{
  const file = path.join(root, 'es', 'guides.json');
  const g = JSON.parse(fs.readFileSync(file, 'utf8'));
  g['es.extra.title'] = 'Guías para viajeros de habla hispana';
  g['es.extra.body'] =
    'Si viaja desde España o Latinoamérica, podemos coordinar un chófer guía con inglés fluido y apoyo en español en la planificación previa por WhatsApp. Ideal para primeras visitas a Sigiriya, Kandy, Ella, Yala y Galle sin tours en autobús.';
  writeJson(file, g);
  console.log('[guides] es extra');
}

console.log('enrich-gsc-not-indexed done');
