/**
 * Improves Google "Crawled – currently not indexed" risk by embedding:
 * - Localized FAQ (not EN runtime fallback)
 * - Highlights from itinerary
 * - Unique locale closing paragraphs on overviews
 * - Extra contact page copy for thin /kontakt style URLs
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'assets', 'i18n');
const langs = ['en', 'de', 'fr', 'it', 'es', 'pl', 'ru'];

const FAQ_TEMPLATES = {
  en: {
    included: {
      q: (name) => `What is included in ${name}?`,
      a: (type, duration) =>
        `This ${type} typically includes private air conditioned transport, an experienced chauffeur guide, and the sightseeing in the itinerary for ${duration}. Hotel category and meals (when applicable) are listed under Accommodation and Included.`,
    },
    private: {
      q: 'Is this a private tour?',
      a: 'Yes. Ceylon JOJO Travels runs private Sri Lanka tours for couples, families and small groups. You travel in your own vehicle on your schedule.',
    },
    custom: {
      q: 'Can I customise the itinerary?',
      a: 'Yes. Tell us your hotel pick up, pace or must see stops in Special Requests and we will tailor the plan before you travel.',
    },
    book: {
      q: 'How do I book and pay?',
      a: 'Complete the booking form on this page or message us on WhatsApp. Pay later (pay in Sri Lanka) is available. You will receive a confirmation after submitting.',
    },
    who: {
      q: 'Who is this tour best for?',
      a: 'Couples, families and small groups who want a private chauffeur guide, flexible timing, and a clear day by day plan without joining a large coach group.',
    },
  },
  de: {
    included: {
      q: (name) => `Was ist bei ${name} enthalten?`,
      a: (type, duration) =>
        `Diese ${type} umfasst in der Regel privaten klimatisierten Transport, einen erfahrenen Chauffeur Guide und die Besichtigungen laut Programm für ${duration}. Hotelkategorie und Mahlzeiten stehen unter Unterkunft und Inklusivleistungen.`,
    },
    private: {
      q: 'Ist das eine Privattour?',
      a: 'Ja. Ceylon JOJO Travels führt private Sri Lanka Touren für Paare, Familien und kleine Gruppen. Sie reisen im eigenen Fahrzeug nach Ihrem Zeitplan.',
    },
    custom: {
      q: 'Kann ich die Route anpassen?',
      a: 'Ja. Nennen Sie Abholhotel, Tempo oder Wunschstops unter Sonderwünsche, wir passen den Plan vor der Reise an.',
    },
    book: {
      q: 'Wie buche und zahle ich?',
      a: 'Füllen Sie das Formular auf dieser Seite aus oder schreiben Sie uns auf WhatsApp. Zahlung vor Ort in Sri Lanka ist möglich. Sie erhalten eine Bestätigung nach dem Absenden.',
    },
    who: {
      q: 'Für wen ist diese Tour geeignet?',
      a: 'Für Paare, Familien und kleine Gruppen, die einen privaten Chauffeur Guide, flexible Zeiten und einen klaren Tagesplan ohne große Reisegruppe wünschen.',
    },
  },
  fr: {
    included: {
      q: (name) => `Qu’est-ce qui est inclus dans ${name} ?`,
      a: (type, duration) =>
        `Ce ${type} comprend en général un véhicule climatisé privé, un chauffeur guide expérimenté et les visites du programme pour ${duration}. Catégorie d’hôtel et repas figurent sous Hébergement et Inclus.`,
    },
    private: {
      q: 'Est-ce un circuit privé ?',
      a: 'Oui. Ceylon JOJO Travels propose des circuits privés au Sri Lanka pour couples, familles et petits groupes. Vous voyagez dans votre véhicule, à votre rythme.',
    },
    custom: {
      q: 'Puis-je personnaliser l’itinéraire ?',
      a: 'Oui. Indiquez l’hôtel de prise en charge, le rythme ou les incontournables dans Demandes spéciales : nous adaptons le programme avant le départ.',
    },
    book: {
      q: 'Comment réserver et payer ?',
      a: 'Remplissez le formulaire sur cette page ou écrivez-nous sur WhatsApp. Paiement plus tard (sur place) possible. Vous recevrez une confirmation après envoi.',
    },
    who: {
      q: 'À qui s’adresse ce circuit ?',
      a: 'Aux couples, familles et petits groupes qui veulent un chauffeur guide privé, des horaires flexibles et un programme jour par jour sans grand car collectif.',
    },
  },
  it: {
    included: {
      q: (name) => `Cosa è incluso in ${name}?`,
      a: (type, duration) =>
        `Questo ${type} include di solito trasporto privato climatizzato, autista guida esperto e le visite dell’itinerario per ${duration}. Categoria hotel e pasti sono in Alloggio e Incluso.`,
    },
    private: {
      q: 'È un tour privato?',
      a: 'Sì. Ceylon JOJO Travels organizza tour privati in Sri Lanka per coppie, famiglie e piccoli gruppi. Viaggiate nel vostro veicolo, con i vostri orari.',
    },
    custom: {
      q: 'Posso personalizzare l’itinerario?',
      a: 'Sì. Indicate hotel di ritiro, ritmo o tappe irrinunciabili in Richieste speciali e adattiamo il piano prima della partenza.',
    },
    book: {
      q: 'Come prenoto e pago?',
      a: 'Compilate il modulo in questa pagina o scriveteci su WhatsApp. Pagamento in seguito (in Sri Lanka) disponibile. Riceverete una conferma dopo l’invio.',
    },
    who: {
      q: 'A chi è adatto questo tour?',
      a: 'A coppie, famiglie e piccoli gruppi che vogliono un autista guida privato, orari flessibili e un programma giorno per giorno senza pullman di gruppo.',
    },
  },
  es: {
    included: {
      q: (name) => `¿Qué incluye ${name}?`,
      a: (type, duration) =>
        `Este ${type} suele incluir transporte privado con aire acondicionado, chófer guía experimentado y las visitas del itinerario durante ${duration}. Categoría de hotel y comidas aparecen en Alojamiento e Incluye.`,
    },
    private: {
      q: '¿Es un tour privado?',
      a: 'Sí. Ceylon JOJO Travels opera tours privados en Sri Lanka para parejas, familias y grupos pequeños. Viajáis en vuestro propio vehículo y horario.',
    },
    custom: {
      q: '¿Puedo personalizar el itinerario?',
      a: 'Sí. Indica hotel de recogida, ritmo o paradas imprescindibles en Peticiones especiales y adaptamos el plan antes del viaje.',
    },
    book: {
      q: '¿Cómo reservo y pago?',
      a: 'Completa el formulario de esta página o escríbenos por WhatsApp. Pago posterior (en Sri Lanka) disponible. Recibirás confirmación al enviar.',
    },
    who: {
      q: '¿Para quién es este tour?',
      a: 'Para parejas, familias y grupos pequeños que quieren chófer guía privado, horarios flexibles y un plan día a día sin autobús de grupo.',
    },
  },
  pl: {
    included: {
      q: (name) => `Co jest wliczone w ${name}?`,
      a: (type, duration) =>
        `Ta ${type} zwykle obejmuje prywatny klimatyzowany transport, doświadczonego przewodnika kierowcę i zwiedzanie z programu na ${duration}. Kategoria hotelu i posiłki są w sekcji Noclegi i W cenie.`,
    },
    private: {
      q: 'Czy to prywatna wycieczka?',
      a: 'Tak. Ceylon JOJO Travels organizuje prywatne wycieczki po Sri Lance dla par, rodzin i małych grup. Jedziecie własnym samochodem, we własnym tempie.',
    },
    custom: {
      q: 'Czy mogę dostosować program?',
      a: 'Tak. Podaj hotel odbioru, tempo lub must see w Uwagach specjalnych, dopasujemy plan przed wyjazdem.',
    },
    book: {
      q: 'Jak zarezerwować i zapłacić?',
      a: 'Wypełnij formularz na tej stronie lub napisz na WhatsApp. Płatność później (na Sri Lance) jest możliwa. Po wysłaniu otrzymasz potwierdzenie.',
    },
    who: {
      q: 'Dla kogo jest ta wycieczka?',
      a: 'Dla par, rodzin i małych grup, które chcą prywatnego przewodnika kierowcę, elastyczne godziny i jasny plan dnia bez dużego autokaru.',
    },
  },
  ru: {
    included: {
      q: (name) => `Что входит в ${name}?`,
      a: (type, duration) =>
        `Этот ${type} обычно включает частный кондиционированный транспорт, опытного гида водителя и осмотр по программе на ${duration}. Категория отеля и питание указаны в разделах Проживание и Включено.`,
    },
    private: {
      q: 'Это частный тур?',
      a: 'Да. Ceylon JOJO Travels проводит частные туры по Шри-Ланке для пар, семей и небольших групп. Вы едете на своём автомобиле по своему графику.',
    },
    custom: {
      q: 'Можно ли изменить маршрут?',
      a: 'Да. Укажите отель подачи, темп или обязательные места в особых пожеланиях, мы подстроим план до поездки.',
    },
    book: {
      q: 'Как забронировать и оплатить?',
      a: 'Заполните форму на этой странице или напишите в WhatsApp. Оплата позже (на Шри-Ланке) возможна. После отправки вы получите подтверждение.',
    },
    who: {
      q: 'Кому подойдёт этот тур?',
      a: 'Парам, семьям и небольшим группам, которым нужен частный гид водитель, гибкий график и понятная программа по дням без большого автобуса.',
    },
  },
};

const CLOSING = {
  en: ' Private vehicle from your hotel or airport, English speaking chauffeur guide, and pay later in Sri Lanka after confirmation.',
  de: ' Privates Fahrzeug ab Hotel oder Flughafen, deutsch oder englisch sprechender Chauffeur Guide und Zahlung vor Ort in Sri Lanka nach Bestätigung.',
  fr: ' Véhicule privé depuis votre hôtel ou l’aéroport, chauffeur guide francophone ou anglophone, et paiement sur place au Sri Lanka après confirmation.',
  it: ' Veicolo privato da hotel o aeroporto, autista guida in italiano o inglese, e pagamento in Sri Lanka dopo la conferma.',
  es: ' Vehículo privado desde hotel o aeropuerto, chófer guía en español o inglés, y pago en Sri Lanka tras la confirmación.',
  pl: ' Prywatny samochód z hotelu lub lotniska, przewodnik kierowca po polsku lub angielsku oraz płatność na Sri Lance po potwierdzeniu.',
  ru: ' Частный автомобиль из отеля или аэропорта, гид водитель на русском или английском, оплата на Шри-Ланке после подтверждения.',
};

const DAY_TITLE_MAP = {
  de: {
    'Airport / Hotel, Kandy Cultural Experience': 'Flughafen / Hotel, Kulturerlebnis Kandy',
    'Airport / Hotel – Kandy Cultural Experience': 'Flughafen / Hotel, Kulturerlebnis Kandy',
    'Kandy – Ella Hill Country Journey': 'Kandy – Ella Hill Country Reise',
    'Ella – Yala Wildlife Safari': 'Ella – Yala Wildlife Safari',
    'Yala – Galle – Bentota – Airport': 'Yala – Galle – Bentota – Flughafen',
  },
  fr: {
    'Airport / Hotel, Kandy Cultural Experience': 'Aéroport / hôtel, expérience culturelle à Kandy',
    'Airport / Hotel – Kandy Cultural Experience': 'Aéroport / hôtel, expérience culturelle à Kandy',
    'Kandy – Ella Hill Country Journey': 'Kandy – voyage vers Ella et le hill country',
    'Ella – Yala Wildlife Safari': 'Ella – safari faune à Yala',
    'Yala – Galle – Bentota – Airport': 'Yala – Galle – Bentota – aéroport',
  },
  it: {
    'Airport / Hotel, Kandy Cultural Experience': 'Aeroporto / hotel, esperienza culturale a Kandy',
    'Airport / Hotel – Kandy Cultural Experience': 'Aeroporto / hotel, esperienza culturale a Kandy',
    'Kandy – Ella Hill Country Journey': 'Kandy – viaggio verso Ella e le colline',
    'Ella – Yala Wildlife Safari': 'Ella – safari a Yala',
    'Yala – Galle – Bentota – Airport': 'Yala – Galle – Bentota – aeroporto',
  },
  es: {
    'Airport / Hotel, Kandy Cultural Experience': 'Aeropuerto / hotel, experiencia cultural en Kandy',
    'Airport / Hotel – Kandy Cultural Experience': 'Aeropuerto / hotel, experiencia cultural en Kandy',
    'Kandy – Ella Hill Country Journey': 'Kandy – viaje a Ella y el hill country',
    'Ella – Yala Wildlife Safari': 'Ella – safari en Yala',
    'Yala – Galle – Bentota – Airport': 'Yala – Galle – Bentota – aeropuerto',
  },
  pl: {
    'Airport / Hotel, Kandy Cultural Experience': 'Lotnisko / hotel, kultura w Kandy',
    'Airport / Hotel – Kandy Cultural Experience': 'Lotnisko / hotel, kultura w Kandy',
    'Kandy – Ella Hill Country Journey': 'Kandy – podróż w góry Ella',
    'Ella – Yala Wildlife Safari': 'Ella – safari w Yala',
    'Yala – Galle – Bentota – Airport': 'Yala – Galle – Bentota – lotnisko',
  },
  ru: {
    'Airport / Hotel, Kandy Cultural Experience': 'Аэропорт / отель, культура Канди',
    'Airport / Hotel – Kandy Cultural Experience': 'Аэропорт / отель, культура Канди',
    'Kandy – Ella Hill Country Journey': 'Канди – поездка в холмы Эллы',
    'Ella – Yala Wildlife Safari': 'Элла – сафари в Яле',
    'Yala – Galle – Bentota – Airport': 'Яла – Галле – Бентота – аэропорт',
  },
};

const CONTACT_EXTRA = {
  en: {
    'body.intro':
      'Book a private chauffeur guide in Sri Lanka, ask about day tours, or request a custom multi day itinerary with hotels. We reply on WhatsApp, phone, and email in English and several European languages.',
    'body.helpTitle': 'How we can help',
    'body.help1': 'Private day tours to Galle, Kandy, Ella, and Sigiriya',
    'body.help2': 'Multi day packages with 4 star hotels and airport transfers',
    'body.help3': 'Custom routes for couples, families, and small groups',
    'body.help4': 'Pay later in Sri Lanka after written confirmation',
    'body.response': 'Typical reply time is under a few hours during the day. For same day pick ups, message WhatsApp with your hotel name and preferred start time.',
  },
  de: {
    'body.intro':
      'Buchen Sie einen privaten Chauffeur Guide in Sri Lanka, fragen Sie nach Tagesausflügen oder einem individuellen Mehrtagesprogramm mit Hotels. Wir antworten per WhatsApp, Telefon und E Mail auf Deutsch und Englisch.',
    'body.helpTitle': 'So können wir helfen',
    'body.help1': 'Private Tagesausflüge nach Galle, Kandy, Ella und Sigiriya',
    'body.help2': 'Mehrtagespakete mit 4 Sterne Hotels und Flughafentransfer',
    'body.help3': 'Individuelle Routen für Paare, Familien und kleine Gruppen',
    'body.help4': 'Zahlung vor Ort in Sri Lanka nach schriftlicher Bestätigung',
    'body.response': 'Antwort meist innerhalb weniger Stunden am Tag. Für Abholungen am selben Tag schreiben Sie auf WhatsApp mit Hotelname und Wunschstartzeit.',
  },
  fr: {
    'body.intro':
      'Réservez un chauffeur guide privé au Sri Lanka, demandez une excursion d’une journée ou un circuit sur mesure avec hôtels. Nous répondons sur WhatsApp, téléphone et e mail en français et en anglais.',
    'body.helpTitle': 'Comment nous pouvons vous aider',
    'body.help1': 'Excursions privées à Galle, Kandy, Ella et Sigiriya',
    'body.help2': 'Circuits de plusieurs jours avec hôtels 4 étoiles et transferts aéroport',
    'body.help3': 'Itinéraires sur mesure pour couples, familles et petits groupes',
    'body.help4': 'Paiement sur place au Sri Lanka après confirmation écrite',
    'body.response': 'Réponse en général en quelques heures dans la journée. Pour une prise en charge le jour même, écrivez sur WhatsApp avec l’hôtel et l’heure souhaitée.',
  },
  it: {
    'body.intro':
      'Prenotate un autista guida privato in Sri Lanka, chiedete un’escursione di un giorno o un itinerario su misura con hotel. Rispondiamo su WhatsApp, telefono ed e mail in italiano e inglese.',
    'body.helpTitle': 'Come possiamo aiutarvi',
    'body.help1': 'Tour giornalieri privati a Galle, Kandy, Ella e Sigiriya',
    'body.help2': 'Pacchetti di più giorni con hotel 4 stelle e transfer aeroporto',
    'body.help3': 'Itinerari personalizzati per coppie, famiglie e piccoli gruppi',
    'body.help4': 'Pagamento in Sri Lanka dopo conferma scritta',
    'body.response': 'Risposta tipica entro poche ore durante il giorno. Per ritiri lo stesso giorno scrivete su WhatsApp con hotel e orario preferito.',
  },
  es: {
    'body.intro':
      'Reserve un chófer guía privado en Sri Lanka, pregunte por tours de un día o un itinerario a medida con hoteles. Respondemos por WhatsApp, teléfono y correo en español e inglés.',
    'body.helpTitle': 'Cómo podemos ayudar',
    'body.help1': 'Tours privados de un día a Galle, Kandy, Ella y Sigiriya',
    'body.help2': 'Paquetes de varios días con hoteles 4 estrellas y traslados al aeropuerto',
    'body.help3': 'Rutas a medida para parejas, familias y grupos pequeños',
    'body.help4': 'Pago en Sri Lanka tras confirmación por escrito',
    'body.response': 'Respuesta habitual en pocas horas durante el día. Para recogidas el mismo día, escriba por WhatsApp con el hotel y la hora deseada.',
  },
  pl: {
    'body.intro':
      'Zarezerwuj prywatnego przewodnika kierowcę na Sri Lance, zapytaj o wycieczkę jednodniową lub indywidualny program wielodniowy z hotelami. Odpowiadamy na WhatsApp, telefon i e mail po polsku i angielsku.',
    'body.helpTitle': 'W czym możemy pomóc',
    'body.help1': 'Prywatne wycieczki jednodniowe do Galle, Kandy, Elli i Sigirii',
    'body.help2': 'Pakiety wielodniowe z hotelami 4 gwiazdkowymi i transferem z lotniska',
    'body.help3': 'Trasy na zamówienie dla par, rodzin i małych grup',
    'body.help4': 'Płatność na Sri Lance po pisemnym potwierdzeniu',
    'body.response': 'Zwykle odpowiadamy w ciągu kilku godzin w ciągu dnia. Przy odbiorze tego samego dnia napisz na WhatsApp z nazwą hotelu i preferowaną godziną startu.',
  },
  ru: {
    'body.intro':
      'Закажите частного гида водителя на Шри-Ланке, спросите про однодневный тур или индивидуальный многодневный маршрут с отелями. Отвечаем в WhatsApp, по телефону и email на русском и английском.',
    'body.helpTitle': 'Чем мы можем помочь',
    'body.help1': 'Частные однодневные туры в Галле, Канди, Эллу и Сигирию',
    'body.help2': 'Многодневные пакеты с отелями 4 звезды и трансфером из аэропорта',
    'body.help3': 'Маршруты под заказ для пар, семей и небольших групп',
    'body.help4': 'Оплата на Шри-Ланке после письменного подтверждения',
    'body.response': 'Обычно отвечаем в течение нескольких часов днём. Для подачи в тот же день напишите в WhatsApp название отеля и желаемое время старта.',
  },
};

function deriveHighlights(itinerary, limit = 6) {
  const titles = [];
  for (const day of itinerary || []) {
    for (const act of day.activities || []) {
      const type = String(act.type || '').toLowerCase();
      const title = String(act.title?.title || '').trim();
      if (!title) continue;
      if (type.includes('accommodation') || /overnight|ночев|übernacht|nuit|notte|noche|nocleg/i.test(title)) {
        continue;
      }
      if (!titles.includes(title)) titles.push(title);
      if (titles.length >= limit) return titles;
    }
  }
  return titles;
}

function buildFaq(lang, detail) {
  const tpl = FAQ_TEMPLATES[lang] || FAQ_TEMPLATES.en;
  const name = detail.title || 'Sri Lanka tour';
  const type = detail.tourType || '';
  const duration = detail.duration || '';
  return [
    { question: tpl.included.q(name), answer: tpl.included.a(type, duration) },
    { question: tpl.private.q, answer: tpl.private.a },
    { question: tpl.who.q, answer: tpl.who.a },
    { question: tpl.custom.q, answer: tpl.custom.a },
    { question: tpl.book.q, answer: tpl.book.a },
  ];
}

function enrichTours() {
  for (const lang of langs) {
    const file = path.join(root, lang, 'tours.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    let faqN = 0;
    let hlN = 0;
    let closeN = 0;
    let dayN = 0;

    for (const detail of Object.values(data.details || {})) {
      if (!Array.isArray(detail.faq) || detail.faq.length < 4) {
        detail.faq = buildFaq(lang, detail);
        faqN += 1;
      } else if (lang !== 'en' && detail.faq.some((f) => /^What is included|^Is this a private|^How do I book/i.test(f.question || ''))) {
        detail.faq = buildFaq(lang, detail);
        faqN += 1;
      }

      if (!Array.isArray(detail.highlights) || detail.highlights.length < 3) {
        detail.highlights = deriveHighlights(detail.itinerary);
        hlN += 1;
      }

      const closing = CLOSING[lang];
      if (closing && detail.overview && !detail.overview.includes(closing.trim().slice(0, 40))) {
        detail.overview = `${detail.overview.trim()}${closing}`;
        closeN += 1;
      }

      const map = DAY_TITLE_MAP[lang];
      if (map && Array.isArray(detail.itinerary)) {
        for (const day of detail.itinerary) {
          if (map[day.title]) {
            day.title = map[day.title];
            dayN += 1;
          }
        }
      }
    }

    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`[tours] ${lang}: faq ${faqN}, highlights ${hlN}, closings ${closeN}, dayTitles ${dayN}`);
  }
}

function enrichContact() {
  for (const lang of langs) {
    const file = path.join(root, lang, 'contact.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    Object.assign(data, CONTACT_EXTRA[lang]);
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`[contact] ${lang}: body fields added`);
  }
}

function enrichSeo() {
  const boosts = {
    de: {
      'tour.4-day-sri-lanka-tour.description':
        'Private 4 Tage Sri Lanka Rundreise mit Chauffeur Guide: Kandy, Ella, Yala Safari, Galle und 4 Sterne Hotels. Abholung Flughafen oder Hotel. WhatsApp Anfrage.',
      'tour.2-day-ella-yala-private-tour-sri-lanka.description':
        '2 Tage Ella und Yala Safari privat: Nine Arch Bridge, Little Adam’s Peak, Jeep Safari und 4 Sterne Hotels mit Chauffeur Guide.',
      'contact.description':
        'Privaten Chauffeur Guide in Sri Lanka anfragen: Tagesausflüge, Mehrtagespakete, Hotels und WhatsApp Buchung. Antwort auf Deutsch und Englisch.',
    },
    fr: {
      'tour.10-day-sri-lanka-tour.description':
        'Circuit privé 10 jours au Sri Lanka avec chauffeur guide: triangle culturel, Kandy, Ella, safari et plages. Hôtels 4 étoiles. Demande WhatsApp.',
      'contact.description':
        'Demandez un chauffeur guide privé au Sri Lanka: excursions, circuits, hôtels et réservation WhatsApp. Réponse en français et en anglais.',
    },
    it: {
      'tour.8-day-sri-lanka-private-tour.description':
        'Tour privato 8 giorni in Sri Lanka con autista guida: safari, Ella, costa sud e hotel 4 stelle. Ritiro aeroporto o hotel. WhatsApp.',
      'tour.6-day-sri-lanka-private-tour.description':
        'Tour privato 6 giorni in Sri Lanka con autista guida, hotel 4 stelle, safari e spiaggia flessibile. Prenotazione WhatsApp.',
      'contact.description':
        'Richiedete un autista guida privato in Sri Lanka: tour giornalieri, pacchetti, hotel e prenotazione WhatsApp. Risposta in italiano e inglese.',
    },
    es: {
      'tour.7-day-sri-lanka-tour.description':
        'Tour privado 7 días por Sri Lanka con chófer guía: Wilpattu, Sigiriya, Kandy, Ella, Galle y playa. Hoteles 4 estrellas. WhatsApp.',
      'tour.4-day-sri-lanka-tour.description':
        'Tour privado 4 días: Kandy, Ella, safari Yala, Galle y hoteles 4 estrellas con chófer guía. Recogida aeropuerto u hotel.',
      'tour.ella-day-tour.description':
        'Excursión privada de un día a Ella: Nine Arch Bridge, Little Adam’s Peak, cascada Ravana y tren. Chófer guía desde hotel.',
      'contact.description':
        'Consulte chófer guía privado en Sri Lanka: tours de un día, paquetes, hoteles y reserva por WhatsApp. Respuesta en español e inglés.',
    },
    pl: {
      'tour.4-day-sri-lanka-tour.description':
        'Prywatna wycieczka 4 dni po Sri Lance z przewodnikiem kierowcą: Kandy, Ella, safari Yala, Galle i hotele 4*. Odbiór z lotniska lub hotelu.',
      'tour.2-day-ella-yala-private-tour-sri-lanka.description':
        '2 dni Ella i safari Yala prywatnie: Nine Arch Bridge, Little Adam’s Peak, jeep safari i hotele 4* z kierowcą.',
      'contact.description':
        'Zapytaj o prywatnego przewodnika kierowcę na Sri Lance: wycieczki jednodniowe, pakiety, hotele i rezerwacja WhatsApp. Odpowiedź po polsku i angielsku.',
    },
    ru: {
      'tour.4-day-sri-lanka-tour.description':
        'Частный тур 4 дня по Шри-Ланке с гидом водителем: Канди, Элла, сафари Яла, Галле и отели 4*. Подача из аэропорта или отеля. WhatsApp.',
      'tour.10-day-sri-lanka-tour.description':
        'Частный тур 10 дней: культурный треугольник, Канди, Элла, сафари и пляжи с гидом водителем и отелями 4*. Запрос в WhatsApp.',
      'tour.8-day-sri-lanka-private-tour.description':
        'Частный тур 8 дней с водителем: сафари, Элла, южное побережье и отели 4*. Гибкий маршрут. WhatsApp.',
      'tour.2-day-ella-kandy-private-tour-sri-lanka.description':
        'Частный тур 2 дня Элла и Канди: холмы, храм Зуба, отели и гид водитель. Старт из отеля или аэропорта.',
      'tour.2-day-ella-yala-private-tour-sri-lanka.description':
        '2 дня Элла и сафари Яла: Nine Arch Bridge, джип сафари, отели 4* и частный гид водитель.',
      'contact.description':
        'Закажите частного гида водителя на Шри-Ланке: однодневные туры, пакеты, отели и бронь в WhatsApp. Отвечаем на русском и английском.',
    },
  };

  for (const [lang, patch] of Object.entries(boosts)) {
    const file = path.join(root, lang, 'seo.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    Object.assign(data, patch);
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
    console.log(`[seo] ${lang}: ${Object.keys(patch).length} keys boosted`);
  }
}

enrichTours();
enrichContact();
enrichSeo();
console.log('enrich-indexability done');
