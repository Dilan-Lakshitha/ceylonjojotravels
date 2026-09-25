const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'src', 'assets', 'i18n');
const skipFiles = new Set(['routes.json']);
const skipKeys = new Set(['id', 'slug', 'filecode', 'routerLink', 'icon']);

// Longest-first replacements for visible copy only.
const pairs = [
  ['przewodnikami-kierowcami', 'przewodnikami kierowcami'],
  ['kierowcami-przewodnikami', 'kierowcami przewodnikami'],
  ['kierowcom-przewodnikom', 'kierowcom przewodnikom'],
  ['kierowcy-przewodnikowi', 'kierowcy przewodnikowi'],
  ['przewodnikiem-kierowcą', 'przewodnikiem kierowcą'],
  ['przewodnika-kierowcę', 'przewodnika kierowcę'],
  ['przewodnika-kierowcy', 'przewodnika kierowcy'],
  ['Przewodnicy-kierowcy', 'Przewodnicy kierowcy'],
  ['przewodnicy-kierowcy', 'przewodnicy kierowcy'],
  ['kierowcy-przewodnicy', 'kierowcy przewodnicy'],
  ['kierowcę-przewodnika', 'kierowcę przewodnika'],
  ['kierowca-przewodnik', 'kierowca przewodnik'],
  ['Przewodnik-kierowca', 'Przewodnik kierowca'],
  ['przewodnik-kierowca', 'przewodnik kierowca'],
  ['гидами-водителями', 'гидами водителями'],
  ['водителями-гидами', 'водителями гидами'],
  ['гидом-водителем', 'гидом водителем'],
  ['водителем-гидом', 'водителем гидом'],
  ['гида-водителя', 'гида водителя'],
  ['Гиды-водители', 'Гиды водители'],
  ['гиды-водители', 'гиды водители'],
  ['водители-гиды', 'водители гиды'],
  ['Гид-водитель', 'Гид водитель'],
  ['гид-водитель', 'гид водитель'],
  ['водитель-гид', 'водитель гид'],
  ['Chauffeurs-guides', 'Chauffeurs guides'],
  ['chauffeurs-guides', 'chauffeurs guides'],
  ['Guides-chauffeurs', 'Guides chauffeurs'],
  ['guides-chauffeurs', 'guides chauffeurs'],
  ['Chauffeur-guide', 'Chauffeur guide'],
  ['chauffeur-guide', 'chauffeur guide'],
  ['guide-chauffeur', 'guide chauffeur'],
  ['Autisti-guida', 'Autisti guida'],
  ['autisti-guida', 'autisti guida'],
  ['autista-guida', 'autista guida'],
  ['Guida-autista', 'Guida autista'],
  ['Guide-autista', 'Guide autista'],
  ['guida-autista', 'guida autista'],
  ['guide-autista', 'guide autista'],
  ['conductor-guía', 'conductor guía'],
  ['Co-proprietario', 'Co proprietario'],
  ['Co-propriétaire', 'Co propriétaire'],
  ['Co-Owner', 'Co Owner'],
  ['Senior-Berater', 'Senior Berater'],
  ['driver-guides', 'driver guides'],
  ['driver-guide', 'driver guide'],
  ['chauffeur-driven', 'chauffeur driven'],
  ['English-speaking', 'English speaking'],
  ['Air-Conditioned', 'Air Conditioned'],
  ['air-conditioned', 'air conditioned'],
  ['tailor-made', 'tailor made'],
  ['Tailor-Made', 'Tailor Made'],
  ['Family-run', 'Family run'],
  ['hassle-free', 'hassle free'],
  ['best-selling', 'best selling'],
  ['first-time', 'first time'],
  ['island-wide', 'island wide'],
  ['long-distance', 'long distance'],
  ['monsoon-aware', 'monsoon aware'],
  ['Door-to-door', 'Door to door'],
  ['Cross-island', 'Cross island'],
  ['cross-island', 'cross island'],
  ['hill-country', 'hill country'],
  ['tea-country', 'tea country'],
  ['tea-factory', 'tea factory'],
  ['short-eat', 'short eat'],
  ['laid-back', 'laid back'],
  ['star-class', 'star class'],
  ['safari-area', 'safari area'],
  ['south-coast', 'south coast'],
  ['red-and-white', 'red and white'],
  ['must-see', 'must see'],
  ['multi-day', 'multi day'],
  ['Multi-Day', 'Multi Day'],
  ['multi-jours', 'plusieurs jours'],
  ['multi-giorno', 'più giorni'],
  ['full-day', 'full day'],
  ['one-day', 'one day'],
  ['Two-day', 'Two day'],
  ['Six-day', 'Six day'],
  ['Eight-day', 'Eight day'],
  ['zip-lining', 'zip lining'],
  ['zip-line', 'zip line'],
  ['pick-up', 'pick up'],
  ['Pick-up', 'Pick up'],
  ['drop-off', 'drop off'],
  ['world-famous', 'world famous'],
  ['colonial-era', 'colonial era'],
  ['UNESCO-listed', 'UNESCO listed'],
  ['rocher-forteresse', 'rocher forteresse'],
  ['qualité-prix', 'qualité prix'],
  ['qualità-prezzo', 'qualità prezzo'],
  ['Asia-Pacifico', 'Asia Pacifico'],
  ['Asia-Pacífico', 'Asia Pacífico'],
  ['Asie-Pacifique', 'Asie Pacifique'],
  ['Asia-Pacific', 'Asia Pacific'],
  ['Asien-Pazifik', 'Asien Pazifik'],
  ['Azji-Pacyfiku', 'Azji Pacyfiku'],
  ['Hotel-Pickups', 'Hotel Pickups'],
  ['Wildlife-Park-Zeiten', 'Wildlife Park Zeiten'],
  ['Wildlife-Parks', 'Wildlife Parks'],
  ['Bestätigungs-E-Mail', 'Bestätigungs E Mail'],
  ['24-Stunden-Service', '24 Stunden Service'],
  ['4-Sterne-Hotels', '4 Sterne Hotels'],
  ['4-Sterne-Hotel', '4 Sterne Hotel'],
  ['Sterne-Hotels', 'Sterne Hotels'],
  ['Sterne-Hotel', 'Sterne Hotel'],
  ['Ravana-Wasserfällen', 'Ravana Wasserfällen'],
  ['Ravana-Wasserfälle', 'Ravana Wasserfälle'],
  ['Ravana-Wasserfall', 'Ravana Wasserfall'],
  ['Ramboda-Wasserfällen', 'Ramboda Wasserfällen'],
  ['Ramboda-Wasserfälle', 'Ramboda Wasserfälle'],
  ['Ramboda-Wasserfall', 'Ramboda Wasserfall'],
  ['Pidurangala-Felsens', 'Pidurangala Felsens'],
  ['Pidurangala-Felsen', 'Pidurangala Felsen'],
  ['Koggala-Schildkröten-Aufzuchtstation', 'Koggala Schildkröten Aufzuchtstation'],
  ['Meeresschildkröten-Aufzuchtstation', 'Meeresschildkröten Aufzuchtstation'],
  ['Meeresschildkröten-Schutzprojekt', 'Meeresschildkröten Schutzprojekt'],
  ['Meeresschildkröten-Schutzzentrum', 'Meeresschildkröten Schutzzentrum'],
  ['UNESCO-Weltkulturerbestätte', 'UNESCO Weltkulturerbestätte'],
  ['UNESCO-Weltkulturerbe-Höhlentempel', 'UNESCO Weltkulturerbe Höhlentempel'],
  ['UNESCO-Weltkulturerbe', 'UNESCO Weltkulturerbe'],
  ['UNESCO-Welterbestätten', 'UNESCO Welterbestätten'],
  ['UNESCO-Höhlentempel', 'UNESCO Höhlentempel'],
  ['UNESCO-gelistete', 'UNESCO gelistete'],
  ['UNESCO-Stätte', 'UNESCO Stätte'],
  ['Sri-Maha-Bodhi-Tempel', 'Sri Maha Bodhi Tempel'],
  ['Sri-Maha-Bodhi-Baum', 'Sri Maha Bodhi Baum'],
  ['Mondstein-Minen-Zentrum', 'Mondstein Minen Zentrum'],
  ['Ambuluwawa-Biodiversitätsturm', 'Ambuluwawa Biodiversitätsturm'],
  ['Ambuluwawa-Turm', 'Ambuluwawa Turm'],
  ['Löwenfelsen-Festung', 'Löwenfelsen Festung'],
  ['Feuchtgebiets-Ökosysteme', 'Feuchtgebiets Ökosysteme'],
  ['Wildtier-Safaris', 'Wildtier Safaris'],
  ['Wildtier-Safari', 'Wildtier Safari'],
  ['Wildtiersafari-Touren', 'Wildtiersafari Touren'],
  ['Safari-Abenteuer', 'Safari Abenteuer'],
  ['Safari-Eintrittskarten', 'Safari Eintrittskarten'],
  ['Safari-Eintritt', 'Safari Eintritt'],
  ['Safari-Gebiet', 'Safari Gebiet'],
  ['Leoparden-Safari', 'Leoparden Safari'],
  ['Jeep-Safari', 'Jeep Safari'],
  ['Madu-Fluss-Safari', 'Madu Fluss Safari'],
  ['Madu-Flusses', 'Madu Flusses'],
  ['Madu-Fluss', 'Madu Fluss'],
  ['Bentota-Flusstour', 'Bentota Flusstour'],
  ['Bentota-Flusses', 'Bentota Flusses'],
  ['Bentota-Fluss', 'Bentota Fluss'],
  ['Kandy-Aussichtspunkt', 'Kandy Aussichtspunkt'],
  ['Kandy-See', 'Kandy See'],
  ['Glenloch-Teefabrik', 'Glenloch Teefabrik'],
  ['Bluefield-Teefabrik', 'Bluefield Teefabrik'],
  ['Field-Teefabrik', 'Field Teefabrik'],
  ['Tee-Erlebnis', 'Tee Erlebnis'],
  ['Ceylon-Tee', 'Ceylon Tee'],
  ['Buduruwagala-Tempel', 'Buduruwagala Tempel'],
  ['Gangaramaya-Tempel', 'Gangaramaya Tempel'],
  ['Hindu-Tempel', 'Hindu Tempel'],
  ['Tsunami-Denkmal', 'Tsunami Denkmal'],
  ['Tsunami-Katastrophe', 'Tsunami Katastrophe'],
  ['Ayurveda-Massage', 'Ayurveda Massage'],
  ['Buddha-Statuen', 'Buddha Statuen'],
  ['Buddha-Statue', 'Buddha Statue'],
  ['Udawalawa-Nationalpark', 'Udawalawa Nationalpark'],
  ['Minneriya-Nationalpark', 'Minneriya Nationalpark'],
  ['Mahaweli-Flusses', 'Mahaweli Flusses'],
  ['Boutique-Hotels', 'Boutique Hotels'],
  ['Budget-Gästehäusern', 'Budget Gästehäusern'],
  ['Hospitality-Services', 'Hospitality Services'],
  ['Restaurant-Inhalte', 'Restaurant Inhalte'],
  ['Tour-Highlights', 'Tour Highlights'],
  ['Tour-Fotogalerie', 'Tour Fotogalerie'],
  ['Galerie-Miniaturen', 'Galerie Miniaturen'],
  ['Sigiriya-Besuche', 'Sigiriya Besuche'],
  ['Yala-Einfahrten', 'Yala Einfahrten'],
  ['Dorf-Snack', 'Dorf Snack'],
  ['Guide-Reise', 'Guide Reise'],
  ['guide-Service', 'guide Service'],
  ['Top-Zielen', 'Top Zielen'],
  ['Top-Attraktionen', 'Top Attraktionen'],
  ['See-Abenteuer', 'See Abenteuer'],
  ['Pettah-Markt', 'Pettah Markt'],
  ['360-Grad-Panoramablicke', '360 Grad Panoramablicke'],
  ['360-Grad-Ausblicke', '360 Grad Ausblicke'],
  ['Grad-Panoramablicke', 'Grad Panoramablicke'],
  ['Grad-Ausblicke', 'Grad Ausblicke'],
  ['Sigiriya-Kandy', 'Sigiriya Kandy'],
  ['Ella-Wellawaya', 'Ella Wellawaya'],
  ['Элла-Веллавайя', 'Элла Веллавайя'],
  ['Рамбода-Фолс', 'Рамбода Фолс'],
  ['зиплайн-трассой', 'зиплайн трассой'],
  ['джип-сафари', 'джип сафари'],
  ['Премиум-туры', 'Премиум туры'],
  ['Сафари-туры', 'Сафари туры'],
  ['бутик-отели', 'бутик отели'],
  ['медведей-ленивцев', 'медведей ленивцев'],
  ['дресс-кода', 'дресс кода'],
  ['Сигирия-Льв', 'Сигирия Льв'],
  ['ziołowo-przyprawowym', 'ziołowo przyprawowym'],
  ['czerwono-białą', 'czerwono białą'],
  ['красно-белой', 'красно белой'],
  ['rot-weißer', 'rot weißer'],
  ['4-gwiazdkowe', '4 gwiazdkowe'],
  ['10-dniowe', '10 dniowe'],
  ['7-dniowa', '7 dniowa'],
  ['7-dniowej', '7 dniowej'],
  ['5-dniowej', '5 dniowej'],
  ['4-dniowa', '4 dniowa'],
  ['4-dniowej', '4 dniowej'],
  ['1-dniowe', '1 dniowe'],
  ['1-dniowa', '1 dniowa'],
];

pairs.sort((a, b) => b[0].length - a[0].length);

function transformString(s) {
  let out = s;
  for (const [a, b] of pairs) out = out.split(a).join(b);
  out = out.replace(/\s[—–]\s/g, ', ');
  out = out.replace(/(\d)-tägig/g, '$1 tägig');
  out = out.replace(/(\d)-dniow/g, '$1 dniow');
  out = out.replace(/(3,5|\d)-gwiazdk/g, '$1 gwiazdk');
  out = out.replace(/(\d+)th-century/g, '$1th century');
  out = out.replace(/(\d+)-day /g, '$1 day ');
  out = out.replace(/(\d+)-star /g, '$1 star ');
  return out;
}

function walkFiles(dir, exts, jsonCheck) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      walkFiles(p, exts, jsonCheck);
      continue;
    }
    if (!exts.some((e) => name.endsWith(e))) continue;
    if (skipFiles.has(name)) continue;
    const orig = fs.readFileSync(p, 'utf8');
    const next = transformString(orig);
    if (next === orig) continue;
    if (jsonCheck) JSON.parse(next.replace(/^\uFEFF/, ''));
    fs.writeFileSync(p, next);
    files++;
    console.log('updated', path.relative(path.join(__dirname, '..'), p));
  }
}

let files = 0;
walkFiles(root, ['.json'], true);
walkFiles(path.join(__dirname, '..', 'src', 'app', 'mainComponents', 'tour-packages'), ['.ts'], false);
walkFiles(path.join(__dirname, '..', 'src', 'assets', 'data'), ['.json'], true);
console.log('files touched', files);
