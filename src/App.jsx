import { useState, useEffect, useRef, useCallback } from "react";

// ── Categorieën ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all",              label: "🎲 Alles",                   emoji: "🎲" },
  { id: "dieren",           label: "🐾 Dieren",                  emoji: "🐾" },
  { id: "voedsel",          label: "🍕 Voedsel",                 emoji: "🍕" },
  { id: "beroepen",         label: "👷 Beroepen",                emoji: "👷" },
  { id: "sport",            label: "⚽ Sport & Hobby",           emoji: "⚽" },
  { id: "huishouden",       label: "🏠 Huishouden",              emoji: "🏠" },
  { id: "objecten",         label: "📦 Objecten",                emoji: "📦" },
  { id: "natuur",           label: "🌿 Natuur",                  emoji: "🌿" },
  { id: "vervoer",          label: "🚗 Vervoer",                 emoji: "🚗" },
  { id: "plaatsen",         label: "🏛️ Plaatsen",                emoji: "🏛️" },
  { id: "acties",           label: "🏃 Acties",                  emoji: "🏃" },
  { id: "landen",           label: "🌍 Landen",                  emoji: "🌍" },
  { id: "gereedschap",      label: "🔧 Gereedschap",             emoji: "🔧" },
  { id: "muziek",           label: "🎤 Muziek",                  emoji: "🎤" },
  { id: "militair",         label: "🪖 Militair",                emoji: "🪖" },
  { id: "ruimte",           label: "🚀 Ruimte",                  emoji: "🚀" },
  { id: "wetenschap",       label: "🔬 Wetenschap",              emoji: "🔬" },
  { id: "politiek",         label: "🏛 Politiek",                emoji: "🏛" },
  { id: "spreekwoorden",    label: "💬 Spreekwoorden",           emoji: "💬", bonus: true },
];



// WORDS_BY_CATEGORY maps category id → word array
const WORDS_BY_CATEGORY = {};

// Build category buckets
(function buildCategories() {
  const dieren = [
    'aardvarken', 'adelaar', 'albatros', 'alpaca', 'anakonda', 'baviaan',
    'beer', 'bever', 'bijenkoningin', 'bizon', 'boomkikker', 'boomslang',
    'buffel', 'buizerd', 'buldog', 'cheetah', 'chihuahua', 'cobra',
    'condor', 'das', 'dingo', 'dinosaurus', 'dolfijn', 'dromedaris',
    'duif', 'dwergpinguïn', 'eekhoorn', 'egel', 'ekster', 'eland',
    'emoe', 'fazant', 'flamingo', 'fret', 'galapagosschildpad', 'gecko',
    'gibbon', 'giraffe', 'gorilla', 'goudjakhals', 'goudvis', 'grizzlybeer',
    'guppie', 'haai', 'haas', 'hagedis', 'hamster', 'havik',
    'hermelijn', 'hond', 'honingdas', 'hyena', 'ibis', 'ijsbeer',
    'impala', 'inktvis', 'jaguar', 'jakhals', 'kaketoe', 'kameel',
    'kameleon', 'kangoeroe', 'kat', 'kever', 'kikker', 'kiwi',
    'koala', 'koe', 'komodovaraan', 'konijn', 'kraanvogel', 'krab',
    'krokodil', 'kwal', 'kwartel', 'lama', 'leeuw', 'leguaan',
    'lemming', 'lepelaar', 'libel', 'lieveheersbeestje', 'luiaard', 'lynx',
    'maanvis', 'marmot', 'meerkat', 'meerval', 'mier', 'miereneter',
    'mol', 'mug', 'muilezel', 'muskusrat', 'narwal',
    'nerts', 'neusaap', 'neushoorn', 'nijlgans', 'nijlpaard', 'octopus',
    'oehoe', 'olifant', 'ooievaar', 'orang-oetan', 'orka', 'otter',
    'paard', 'panda', 'panther', 'papegaai', 'paradijsvogel', 'parkiet',
    'pauw', 'pelikaan', 'pinguïn', 'vogelbekdier', 'poema', 'poolvos',
    'prairiehond', 'raaf', 'rat', 'reiger', 'rendier', 'reuzenoctopus',
    'reuzenpanda', 'roofvogel', 'salamander', 'schaap', 'schildpad', 'schorpioen',
    'slak', 'slang', 'snoek', 'specht', 'sperwer', 'spin',
    'bidsprinkhaan', 'stekelvarken', 'steur', 'stier', 'stinkdier', 'stokstaartje',
    'struisvogel', 'tapir', 'tarantula', 'tijger', 'toekan', 'tor',
    'uil', 'varaan', 'veelvraat', 'vleermuis', 'vlieg', 'vliegend hert',
    'vliegende vis', 'vlinder', 'vos', 'wants', 'walvis', 'wasbeer',
    'waterbuffel', 'waterrat', 'wezel', 'wild zwijn', 'wolf', 'wombat',
    'worm', 'wrattenzwijn', 'zebra', 'zeehond', 'zeemeermin', 'zeeotter',
    'krekel', 'mus', 'vuurvliegje', 'zeepaardje', 'zeeschildpad', 'zwaan',
    'zwaluw', 'zwarte mamba', 'zwarte panter', 'damhert', 'forel', 'goudhaan',
    'heggenmus', 'hop', 'ijsvogel', 'kauw', 'knobbelzwaan', 'nachtegaal',
    'pimpelmees', 'roodborst', 'steenuil', 'zanglijster', 'kraai',
    'walrus', 'zeeleeuw', 'bruinvis', 'potvis', 'bultrug', 'zeebaars',
    'tonijn', 'zalm', 'haring', 'makreel', 'kabeljauw', 'paling',
    'karper', 'baars', 'rog', 'zwaardvis', 'clownvis', 'zeester',
    'kreeft', 'mossel', 'oester', 'pijlinktvis', 'bij', 'wesp',
    'hommel', 'vlooien', 'pissebed', 'glimworm', 'meikever', 'kakkerlak',
    'mot', 'haan', 'eend', 'gans', 'kalkoen', 'geit',
    'varken', 'ezel', 'pony', 'lam', 'reuzenhaai',
    'spookdier', 'vis'
  ];

  const voedsel = [
    'aardappel', 'aardappelpuree', 'aardbei', 'abrikoos', 'amaretto', 'ananas',
    'andijvie', 'appelmoes', 'appelsap', 'appeltaart', 'asperges', 'avocado',
    'bacon', 'bagel', 'baguette', 'balsamico', 'bami', 'banaan',
    'bananenbrood', 'basilicum', 'biefstuk', 'bier', 'bieslook', 'bietensalade',
    'bitterbal', 'bitterkoekje', 'bladerdeeg', 'blauwe bes', 'bloemkool', 'boerenkool',
    'bolognese', 'bonbons', 'bosbessen', 'boterham', 'bouillon', 'brandnetelsoep',
    'broccoli', 'brood', 'brownie', 'bruine bonen', 'caesarsalade', 'karamel',
    'carpaccio', 'cashewnoot', 'champignon', 'cheesecake', 'chipolata', 'chips',
    'chocolade', 'churros', 'ciabatta', 'citroen', 'citroentaart', 'cola',
    'corndog', 'couscous', 'cranberrysap', 'croissant', 'crème brûlée', 'curry',
    'dadel', 'donut', 'doperwt', 'drakenvrucht', 'druiven', 'eclairs',
    'ei', 'enchilada', 'energiedrank', 'erwtensoep', 'espresso', 'falafel',
    'feta', 'fondue', 'friet', 'frikandel', 'frisdrank', 'fruitsalade',
    'garnaal', 'gazpacho', 'gehaktbal', 'geitenkaas', 'gelato', 'gerst',
    'gin-tonic', 'goulash', 'granaatappel', 'groenten', 'groentesoep', 'gyros',
    'hamburger', 'hazelnoot', 'honing', 'hotdog', 'hummus', 'ijs',
    'jalapeno', 'jus', 'kaas', 'kaasfondue', 'kaassoufflé', 'kaneelbroodje',
    'kappertjes', 'kapsalon', 'kastanje', 'kerrieworst', 'kersensap', 'kip',
    'kipnuggets', 'koffie', 'kokosmelk', 'komkommer', 'koriander', 'kroket',
    'kwark', 'kwarktaart', 'lamsvlees', 'lasagne', 'latte', 'limonade',
    'linzen', 'loempia', 'lychee', 'macaron', 'macaroni', 'mango',
    'marshmallow', 'mayonaise', 'meloensap', 'milkshake', 'miso', 'mosterd',
    'mozzarella', 'mueslireep', 'muffin', 'nasi', 'nectarine', 'noedels',
    'noten', 'nougat', 'olijf', 'olijfolie', 'omelet', 'paella',
    'pannenkoek', 'paprika', 'parmezaan', 'passievrucht', 'pasta', 'penne',
    'perzik', 'pesto', 'piccalilly', 'pindakaas', 'pistache', 'pitabrood',
    'pizza', 'poffertjes', 'pommes frites', 'pompoen', 'popcorn', 'prei',
    'pruim', 'pulled pork', 'quiche', 'rabarber', 'radijs', 'ratatouille',
    'ravioli', 'ricotta', 'rijstpap', 'rijsttafel', 'risotto', 'rode wijn',
    'roggebrood', 'rolmops', 'roomijs', 'rozijnen', 'rucola', 'rum',
    'salade', 'sandwich', 'sap', 'satésaus', 'scones', 'selderij',
    'sinaasappel', 'slagroom', 'smoothie', 'snoep', 'soep', 'sojasaus',
    'soufflé', 'spaghetti', 'spek', 'spinazie', 'stampot', 'stoofpot',
    'strudel', 'suiker', 'sushi', 'taart', 'taco', 'tapenade',
    'tartaar', 'teriyaki', 'thee', 'tiramisu', 'toast', 'tomatensaus',
    'tomatensoep', 'tompouce', 'tortilla', 'truffel', 'tzatziki', 'ui',
    'uiensoep', 'vanillepudding', 'wafel', 'walnoot', 'watermeloen', 'wijn',
    'witlof', 'witte wijn', 'wrap', 'yoghurt', 'zuurkool', 'appelstroop',
    'beschuit', 'boontjes', 'erwten', 'flensje', 'gehakt', 'gevulde koek',
    'hagelslag', 'hutspot', 'jenever', 'karnemelk', 'kokos', 'krentenbollen',
    'kruidenboter', 'melk', 'muesli', 'ontbijtkoek', 'pap', 'peperkoek',
    'rijst', 'rookworst', 'speculaas', 'stroopwafel', 'tosti', 'vla',
    'wentelteefje', 'wittebrood', 'suikerspin'
  ];

  const beroepen = [
    'accountant', 'acrobaat', 'acteur', 'advocaat', 'apotheker', 'archeoloog',
    'architect', 'automonteur', 'bakker', 'barista', 'beveiliger', 'bibliothecaris',
    'blogger', 'boekhoudster', 'botanicus', 'brandweerman', 'buschauffeur', 'cardioloog',
    'casinodealer', 'chef-kok', 'chiropractor', 'chirurg', 'circusdirecteur', 'clown',
    'coach', 'cowboy', 'croupier', 'danser', 'dansleraar', 'data-analist',
    'dermatoloog', 'detective', 'dierenarts', 'dierentrainer', 'diplomaat', 'documentairemaker',
    'dokter', 'dronepiloot', 'duikinstructeur', 'econoom', 'ethisch hacker', 'examinator',
    'farmaceut', 'filosoof', 'fotograaf', 'fysiotherapeut', 'gameontwikkelaar', 'gastronoom',
    'geograaf', 'geoloog', 'gids', 'glazenwasser', 'goochelaar', 'grafisch ontwerper',
    'gynaecoloog', 'handelaar', 'heks', 'hersenchirurg', 'hovenier', 'hypnotherapeut',
    'ijsbeeldhouwer', 'illustrator', 'immunoloog', 'informaticus', 'ingenieur', 'inspecteur',
    'instrumentmaker', 'jager', 'jongleur', 'journalist', 'juwelier',
    'kapitein', 'kapper', 'kassamedewerker', 'kinderarts', 'klusjesman', 'kok',
    'kostuumontwerper', 'kraamverzorger', 'kruidenier', 'kunstcriticus', 'kunstenaar', 'kweker',
    'laborant', 'lasser', 'leraar', 'loodgieter', 'luchtverkeersleider', 'magiër',
    'makelaar', 'matroos', 'meteoroloog', 'microbioloog', 'modeontwerper',
    'moleculair bioloog', 'monteur', 'museumconservator', 'neuroloog', 'notaris', 'ontwerper',
    'oogarts', 'opticien', 'orthopeed', 'piloot', 'piraat', 'politicoloog',
    'politieagent', 'postbode', 'producent', 'profvoetballer', 'psychiater', 'psycholoog',
    'radioloog', 'rechercheur', 'revalidatiearts', 'scenarioschrijver', 'schappenvuller',
    'scheikundige', 'schilder', 'schildwacht', 'schoonmaker', 'schrijver', 'sheriff',
    'skateboarder', 'slager', 'socioloog', 'sommelier', 'stadsplanner', 'stand-upcomedian',
    'steward', 'stoker', 'strateeg', 'stratenmaker', 'stuntman', 'systeembeheerder',
    'tatoeëerder', 'taxichauffeur', 'taxidermist', 'timmerman', 'tolk', 'tovenaar',
    'toxicoloog', 'trainer', 'tuinman', 'verpleegkundige', 'verzekeringsagent', 'vioolmaker',
    'visser', 'vliegtuigbouwer', 'voedingswetenschapper', 'vuilnisman', 'wetenschapper', 'wijnboer',
    'winkelier', 'wiskundige', 'woordvoerder', 'zeebioloog', 'zeiler', 'ziekenhuisdirecteur',
    'aannemer', 'beeldhouwer', 'burgemeester', 'cabaretier', 'ijsverkoper', 'kaarsenmaker',
    'kolenboer', 'predikant', 'reddingswerker', 'straatveger', 'trambestuurder', 'vrijwilliger',
    'lobbyist', 'undercoveragent', 'pionier', 'kluizenaar', 'kustwacht', 'manager',
    'ambtenaar', 'animator', 'auteur', 'bankier', 'belastingadviseur', 'bioloog',
    'boswachter', 'columnist', 'copywriter', 'criminoloog', 'dichter', 'diëtist',
    'directeur', 'drogist', 'elektricien', 'forensisch arts', 'huisarts', 'marechaussee',
    'marketeer', 'masseur', 'muziekleraar', 'ondernemer', 'pedagoog', 'penningmeester',
    'politiecommissaris', 'rechter', 'redacteur', 'regisseur', 'rijinstructeur', 'secretaris',
    'stadsgids', 'stewardess', 'therapeut', 'verloskundige', 'vertaler',
    'vrachtwagenchauffeur', 'zorgverlener', 'zwemleraar', 'fietsenmaker', 'glazenmaker', 'hoefsmid',
    'schoenmaker', 'stoffeerder', 'tegelzetter', 'verzorger', 'begeleider', 'ober'
  ];

  const sport = [
    'aerobics', 'alpineskiën', 'american football', 'atletiek', 'badminton',
    'balletdansen', 'basketbal', 'beachvolleybal', 'bergsport', 'biatlon', 'bingo',
    'biljarten', 'BMX', 'bobslee', 'boksen', 'bowling', 'breakdance',
    'cricket', 'curling', 'dammen', 'diepzeeduiken', 'discgolf', 'discuswerpen',
    'dressuur', 'duiken', 'e-sporten', 'estafette', 'fietsen', 'freerunning',
    'frisbee', 'gewichtheffen', 'gokken', 'golfen', 'gymnastiek', 'handbal',
    'hardlopen', 'hengelen', 'hindernisloop', 'hockey', 'hoogspringen', 'hordelopen',
    'ijshockey', 'jiu-jitsu', 'joggen', 'judo', 'kaatsen', 'kanoën',
    'karate', 'karting', 'kegelen', 'kitesurfen', 'klimmen', 'klimwand',
    'knikkeren', 'kogelstoten', 'korfbal', 'krachttraining', 'kunstrijden', 'lacrosse',
    'langebaanschaatsen', 'longboarden', 'marathon', 'minigolf', 'motorcross', 'motorsport',
    'mountainbiken', 'netbal', 'nordic walking', 'paardrijden', 'padel', 'paintball',
    'parachutespringen', 'parcours', 'pétanque', 'polo', 'polsstokhoogspringen', 'powerlifting',
    'rafting', 'ringsteken', 'rodeo', 'roeien', 'rolschaatsen', 'rugby',
    'schaatsen', 'schaken', 'schansspringen', 'scrabble', 'sjoelen', 'skeeleren',
    'skeleton', 'skiën', 'skislalom', 'snowboarden', 'softbal', 'speerwerpen',
    'spijkerpoepen', 'squash', 'stoeien', 'suppen', 'surfen', 'synchroonzwemmen',
    'taekwondo', 'tafeltennis', 'tennis', 'touwtrekken', 'trail running', 'trampolinespringen',
    'trefbal', 'triatlon', 'turnen', 'varen', 'veldrijden', 'verspringen',
    'vissen', 'vliegeren', 'vliegvissen', 'voetbal', 'volleybal', 'wandelen',
    'waterpolo', 'waterskiën', 'wakeboarden', 'wedstrijdvissen', 'wielrennen', 'worstelen',
    'yoga', 'zeilen', 'zwemmen', 'schermen', 'kaartspelen', 'kwartetten',
    'tekenen', 'abseilen', 'kampioensbeker', 'medaille', 'stopwatch',
    'dartpijl', 'flipperkast', 'gele kaart', 'rode kaart', 'schaakbord', 'speelkaart',
    'trampoline', 'fotograferen', 'vogelkijken', 'stoepkrijten',
    'borduren', 'breien', 'haakwerk', 'handwerken', 'origami',
    'pottenbakken', 'weven', 'lego', 'gezelschapsspel', 'escaperoom',
    'lasergame', 'beachtennis', 'langlaufen', 'kleiduivenschieten',
    'halfpipe', 'rolstoelbasketbal', 'dansen', 'salsadansen', 'linedance', 'volksdansen',
    'kampvuur maken', 'boogschieten', 'survivallen', 'kajakken', 'raften', 'skateboarden',
    'windsurfen', 'jagen', 'snorkelen',
    'puzzelen', 'bordspel', 'videospellen', 'kamperen', 'crossfit', 'boot camp',
    'spinning', 'kickboksen', 'speedklimmen', 'zaalvoetbal', 'rolstoeltennis', 'paragliding',
    'estafettelopen', 'polsstokverspringen', 'kogelslingeren',
    'tafeltennistafel', 'voetbalnet', 'basketbalring', 'hockeystick', 'tennisracket'
  ];

  const objecten = [
    'aansteker', 'actiefiguur', 'afstandsbediening', 'alarmbel', 'anker', 'ansichtkaart',
    'antiek', 'armbandhorloge', 'avondjurk', 'ballon', 'balustrade', 'beeldhouwwerk',
    'bodycam', 'boekenlegger', 'boomerang', 'briefopener', 'brievenbus', 'camera',
    'computer', 'dakpan', 'roltrap', 'fakkel', 'film', 'föhn',
    'ganzenbord', 'glazen bol', 'haardroger', 'handtas', 'hangmat', 'heksenketel',
    'horloge', 'ijsklontje', 'kaars', 'kaarsenhouder', 'ketting', 'kleedhanger',
    'koffer', 'kompas', 'kroon', 'krukje', 'kubus', 'kurketrekker',
    'lampion', 'lantaarn', 'laserpointer', 'luchtballon', 'maillot', 'manchetknoop',
    'masker', 'megafoon', 'molen', 'naaldhak', 'neonlamp', 'paraplu',
    'penseel', 'printer', 'projector', 'puzzel', 'reddingsvest', 'regenjas',
    'robot', 'rubberen eend', 'rugzak', 'sarcofaag', 'scheepsschroef', 'scheermessen',
    'schijf van vijf', 'schilderij', 'schommel', 'speelgoed', 'sphinx', 'spijkerbroek',
    'springveer', 'stoommachine', 'tandenborstel', 'tandpasta', 'tent', 'tijdmachine',
    'toorts', 'tuinkabouter', 'tunnel', 'veiligheidsspeld', 'waaier', 'waterklok',
    'wiel', 'zaklamp', 'zandloper', 'zeepbel', 'zeeppomp', 'zenderstation',
    'zetel', 'zonnebril', 'zonnewijzer', 'zweep', 'tandenstoker', 'kleerhanger',
    'elastiekje', 'kurk', 'boodschappentas', 'broek', 'handschoen', 'hoed',
    'jasje', 'knoop', 'krijtbord', 'muts', 'papier', 'pen',
    'portemonnee', 'riem', 'schoen', 'spaarpot', 'stropdas', 'tas',
    'antenne', 'smartphone', 'tablet', 'laptop', 'toetsenbord', 'muis',
    'monitor', 'usb-stick', 'harde schijf', 'powerbank', 'oplader', 'oortjes',
    'smartwatch', 'drone', 'spelcomputer', 'potlood', 'gum', 'schrift',
    'map', 'ordner', 'plakband', 'paperclip', 'nieter', 'perforator',
    'whiteboard', 'Post-it', 'agenda', 'envelop', 'postzegel', 'sjaal',
    'handschoenen', 'pet', 'bril', 'jas', 'vest', 'trui',
    'shirt', 'fles', 'blik', 'zak', 'doos', 'krat',
    'sleutelring', 'kaartje', 'briefje', 'pakketje', 'cadeau', 'dobbelsteen',
    'tol', 'jojo', 'vlieger', 'blokken', 'knuffelbeer', 'pop',
    'modeltrein', 'legoblokje', 'puzzelstuk', 'kaarten', 'dobbelstenen', 'monopoly',
    'domino', 'memory', 'verfpalet', 'schildersezel', 'kleurpotlood', 'viltstift',
    'pastelkrijt', 'aquarelverf', 'boetseerklei', 'origamipapier', 'naald', 'draad',
    'wol', 'haaknaald', 'breinaald', 'grammofoonplaat', 'cassette', 'cd',
    'dvd', 'blu-ray', 'lenzen', 'gehoorapparaat', 'kruk', 'wandelstok',
    'aktetas', 'shopper', 'heuptas', 'zonnescherm', 'vouwstoel', 'campingstoel',
    'trechter', 'pomp', 'kabel', 'snoer', 'stekker', 'verlengsnoer',
    'schakelaar', 'zekering', 'batterij', 'rits', 'gesp', 'klem',
    'muurschildering', 'beeldje', 'vaasje', 'schaal', 'kom', 'kan',
    'kruik', 'theeglas', 'shotglas', 'bierglas', 'champagneglas', 'trofee',
    'urn', 'relikwie', 'scepter', 'wapenrusting', 'lans', 'pijl en boog',
    'olielamp', 'gasbrander', 'kalender', 'dagboek', 'fotoalbum', 'poster',
    'kaart', 'woordenboek', 'encyclopedie', 'roman', 'tijdschrift', 'krant'
  ];

  const natuur = [
    'aardbeving', 'aardverschuiving', 'algen', 'atlas', 'bamboe', 'bergtop',
    'blad', 'bliksem', 'bloem', 'boom', 'bos', 'branding',
    'brandnetels', 'bronwater', 'bui', 'cactus', 'compost', 'dauw',
    'delta', 'dennennaald', 'dijk', 'droogte', 'duin', 'eb',
    'ecosysteem', 'fjord', 'fossiel', 'getijden', 'geiser', 'goud',
    'greppel', 'hagel', 'herfst', 'herfstblad', 'heuvel', 'hittegolf',
    'ijsberg', 'ijspegel', 'ijsschots', 'ijsvorming', 'inham', 'keien',
    'kiezel', 'klif', 'koraal', 'koraalrif', 'lavastroom', 'lente',
    'luchtvochtigheid', 'mangrovebos', 'maretak', 'meander', 'mist', 'modder',
    'moeras', 'monsoen', 'morgenrood', 'mos', 'naaldboom', 'nevel',
    'oase', 'oceaan', 'onweer', 'orkaan', 'paddenstoel', 'paddenvijver',
    'plas', 'poollicht', 'regen', 'regenboog', 'regenbui', 'regenwoud',
    'rivier', 'riviermonding', 'roos', 'rots', 'rotsbodem', 'savanne',
    'schemering', 'schimmel', 'sneeuw', 'sneeuwvlok', 'sneeuwstorm', 'steengroeve',
    'stikstof', 'stofwolk', 'storm', 'strand', 'stromend water', 'tij',
    'toendra', 'tornado', 'tropische regen', 'tsunami', 'tulp', 'uiterwaard',
    'vallei', 'veen', 'veld', 'vijver', 'vlakte', 'vloed',
    'vulkaan', 'vulkaanuitbarsting', 'waterval', 'weide', 'windvlaag', 'woestijn',
    'wolk', 'woud', 'zandstorm', 'zee', 'zeewind', 'zomer',
    'zonsondergang', 'zonsopgang', 'schelp', 'schaduw', 'berk', 'eik',
    'graan', 'kastanjeboom', 'klaver', 'korenbloem', 'lavendel', 'meidoorn',
    'narcis', 'populier', 'wilg', 'viooltje', 'afgrond', 'gletsjer',
    'lawine', 'draaikolk', 'turbulentie', 'akker', 'beek', 'bergpas',
    'bloemenveld', 'bosbrand', 'bospad', 'bron', 'dode boom', 'eiland',
    'erosie', 'grasland', 'grot', 'jungle', 'kustlijn', 'natuur',
    'volle maan', 'onweersbui', 'oerbos', 'permafrost', 'polder', 'prooi',
    'rivieroever', 'rotsklif', 'schors', 'slikken', 'steentijd', 'steppegras',
    'stroomgebied', 'stuifzand', 'terp', 'tundra', 'waterput', 'wildernis',
    'windstil', 'zandbank', 'zandvlakte', 'zeebodem', 'zeestroming', 'zeewier',
    'zilt', 'zoetwatermeer', 'zonnestraling', 'zonsverduistering', 'zoutvlakte', 'zwerfkei',
    'zonnebloem', 'koolzaad', 'heide', 'waterlelie', 'riet', 'stroompje',
    'bosrand', 'bosje', 'struikgewas', 'braamstruik', 'vlierbes',
    'es', 'iep', 'beuk', 'hulst', 'klimop', 'varens',
    'mossen', 'winter', 'getij', 'wind', 'zon', 'sloot',
    'steen', 'zeegras', 'braam', 'eikel', 'dennenappel', 'framboos',
    'boomgaard', 'botanische tuin'
  ];

  const vervoer = [
    'aanhanger', 'achtbaan', 'ambulance', 'benzine', 'benzinestation', 'boeing',
    'boot', 'brandweerauto', 'brandweerwagen', 'bromfiets', 'bus', 'camper',
    'caravan', 'catamaran', 'containerschip', 'diesel', 'driewieler',
    'dronepost', 'dubbeldekker', 'duikboot', 'elektrische auto', 'elektrische scooter', 'fatbike',
    'fietsendrager', 'fietstaxi', 'forens', 'vrachtschip', 'gondel', 'gondelbaan',
    'graafmachine', 'grensovergang', 'hangbrug', 'helikopter', 'hoogspoortrein', 'hoverboard',
    'hovercraft', 'intercity', 'internationale trein', 'jetpack', 'jetski', 'kabelbaan',
    'kajak', 'kar', 'lijnbus', 'locomotief', 'metro', 'mini',
    'monorail', 'motorfiets', 'nachttrein', 'oplegger', 'pick-uptruck', 'politieauto',
    'postduif', 'postkoets', 'racefiets', 'racewagen', 'reddingsboot', 'rijtuig',
    'riksja', 'robotaxi', 'roeiboot', 'schip', 'scooterdeeldienst', 'segway',
    'slee', 'sleepboot', 'sloep', 'sneltrein', 'speedboot', 'stadsbus',
    'stadsfiets', 'step', 'stoomboot', 'stoomlocomotief', 'suv', 'taxi',
    'touringcar', 'tractor', 'tram', 'trolleybus', 'tuk-tuk', 'veerboot',
    'vierwieler', 'vrachtwagen', 'waterbus', 'waterfiets', 'bushalte', 'watervliegtuig',
    'wielerbaan', 'zeilschip', 'zijspan', 'zonneauto', 'zweefvliegtuig', 'vliegtuigkaping',
    'fiets', 'elektrische fiets', 'scooter', 'trein', 'zeilboot', 'bijtanken',
    'tankwagen', 'brandstoftanker', 'jacht', 'rubberboot',
    'kano', 'vlot', 'waterscooter', 'reddingsvlot', 'trimaran', 'onderzeeër',
    'stoomtram', 'toeristentrein', 'zweeftrein', 'kampeerbus', 'politiemotor', 'ziekenwagen',
    'brandweerboot', 'politiehelikopter', 'traumahelikopter', 'zeppelin', 'bakfiets', 'ligfiets',
    'tandemfiets', 'bromscooter', 'quad', 'buggy', 'golfkarretje', 'stadsauto',
    'cabrio', 'stationwagen', 'terreinwagen', 'minivan', 'camionette',
    'kraanwagen', 'betonmixer', 'vorkheftruck', 'shovel', 'bulldozer', 'sloopkogel',
    'sleepwagen', 'deelfiets', 'deelscooter', 'deelstep', 'snelweg', 'ringweg',
    'afritten', 'invoegstrook', 'viaduct', 'perron', 'spoorwegovergang', 'bagageband',
    'paspoortcontrole', 'vertrekhal', 'aankomsthal', 'landingsbaan', 'vliegtuigtrap', 'jetway',
    'bagage', 'handbagage', 'reistas', 'reiskaart', 'ov-chipkaart', 'treinkaartje',
    'vliegticket', 'overstap', 'rijbewijs', 'kentekenplaat', 'autopech', 'lekke band',
    'rijstrook', 'fietspad', 'kruispunt', 'stoplicht', 'parkeerbon', 'elektrisch rijden',
    'waterstofauto', 'carpoolen', 'pendelen', 'woon-werkverkeer', 'NS', 'sprinter',
    'nachtbus', 'pendelbusje', 'rolstoelbus', 'baggerschip', 'cruiseschip', 'laad- en losplaats',
    'distributiecentrum', 'koelwagen', 'voetpad', 'wandelroute', 'aanlegsteiger', 'privéjet',
    'helipad', 'auto', 'motor', 'wagen', 'kruiwagen', 'huifkar',
    'schoolbus', 'rolstoel', 'skateboard', 'vouwfiets', 'laadpaal'
  ];

  const plaatsen = [
    'abdij', 'amfiteater', 'apotheek', 'aquaduct', 'aquarium', 'badhuis',
    'balie', 'begraafplaats', 'bibliotheek', 'bioscoop', 'bloemenmarkt', 'boekenwinkel',
    'boerderij', 'bouwplaats', 'bowlingbaan', 'brandweerkazerne', 'brouwerij', 'brug',
    'café', 'camping', 'campingterrein', 'casino', 'centrum', 'circus',
    'consulaat', 'crematorium', 'dierentuin', 'discotheek', 'fabriek', 'fietsenwinkel',
    'fontein', 'fruitmarkt', 'galerie', 'gemeentehuis', 'gevangenis', 'grachtenpand',
    'gymnasium', 'haven', 'herberg', 'honkbalstadion', 'hostel', 'hotel',
    'huis', 'iglo', 'ijsbaan', 'jachthaven', 'kapperszaak', 'kasteel',
    'kathedraal', 'kerk', 'klooster', 'koffieshop', 'kolenmijn', 'kroeg',
    'kunstmuseum', 'landgoed', 'loods', 'luchthaven', 'manege', 'markt',
    'megabioscoop', 'monument', 'moskee', 'museum', 'observatorium', 'dolfinarium',
    'paleis', 'parkeergarage', 'pier', 'plein', 'politiebureau', 'poppenkast',
    'postkantoor', 'pretpark', 'pyramide', 'racebaan', 'rechtbank', 'recreatiegebied',
    'restaurant', 'ruïne', 'sauna', 'schaatsbaan', 'school', 'silo',
    'sluis', 'speeltuin', 'sporthal', 'stad', 'stadion', 'stadshuis',
    'standbeeld', 'strandtent', 'supermarkt', 'synagoge', 'tandartspraktijk', 'tankstation',
    'tempel', 'theater', 'toren', 'treinstation', 'universiteit', 'vakantiepark',
    'vergaderzaal', 'villa', 'vliegveld', 'voetgangersgebied', 'vuurtoren', 'watertoren',
    'wegrestaurant', 'windmolen', 'winkelcentrum', 'ziekenhuis', 'zwembad', 'bakkerij',
    'benzinepomp', 'bloemenwinkel', 'boekhandel', 'buurthuis', 'drogisterij', 'garage',
    'ijssalon', 'kantine', 'kiosk', 'nachtwinkel', 'pannenkoekenhuis', 'parkeerplaats',
    'slagerij', 'snackbar', 'sportschool', 'stomerij', 'viswinkel', 'warenhuis',
    'gerechtshof', 'tribune', 'Afrika', 'Azië', 'Europa', 'Noord-Amerika',
    'Zuid-Amerika', 'Himalaya', 'Kaspische Zee', 'Mississippi', 'Nijl', 'Noordzee',
    'Sahara', 'Thames', 'Corsica', 'Hawaï', 'Kaukasus', 'Siberië',
    'Sicilië', 'Steppe', 'boomhut', 'brandtrap', 'carwash', 'dierenasiel',
    'fietsbrug', 'gemaal', 'graftombe', 'hertenkamp', 'ijsbaantje', 'kasteelgracht',
    'kerkhof', 'kinderdagverblijf', 'klimrek', 'klimbos', 'lantaarnpaal', 'markthal',
    'meubelboulevard', 'recreatiegebied', 'ophaalbrug', 'plattegrond', 'riolering', 'rotonde',
    'schaapskooi', 'sportpark', 'stadspark', 'steiger', 'stoep', 'uitkijktoren',
    'visvijver', 'voetbalveld', 'volkstuin', 'wijngaard', 'windpark', 'zonnepark',
    'hutje', 'bungalow', 'studentenhuis', 'flat', 'appartement', 'studio',
    'boerenschuur', 'stal', 'kapel'
  ];

  const acties = [
    'applaudisseren', 'fluisteren', 'gebaren', 'gooien', 'graven', 'huppelen',
    'ijsberen', 'klunen', 'knuffelen', 'koken', 'kruipen', 'lachen',
    'lopen', 'maaien', 'naaien', 'omhelzen', 'pesten', 'rennen',
    'rollen', 'schilderen', 'slapen', 'snurken', 'struikelen', 'tikken',
    'vallen', 'vangen', 'verstoppen', 'vliegen', 'vouwen', 'waggelen',
    'wiebelen', 'afrekenen', 'afscheid nemen', 'bakken', 'bellen', 'betalen',
    'bewaken', 'bidden', 'blozen', 'branden', 'breken', 'buigen',
    'dagdromen', 'delen', 'douchen', 'dreigen', 'drinken', 'duwen',
    'eten', 'fluiten', 'gapen', 'geven', 'giechelen', 'gillen',
    'gluren', 'groeten', 'hangen', 'helpen', 'hijsen', 'huilen',
    'inschenken', 'inslapen', 'juichen', 'kijken', 'klagen', 'kloppen',
    'knipogen', 'kopen', 'leren', 'lezen', 'liegen', 'luisteren',
    'meten', 'nabootsen', 'nadenken', 'omvallen', 'onderhandelen', 'ophangen',
    'opruimen', 'opstaan', 'oversteken', 'pakken', 'plannen', 'plassen',
    'plukken', 'praten', 'proberen', 'roepen', 'ruiken', 'ruilen',
    'schelden', 'schminken', 'schrijven', 'schuilen', 'schuiven', 'slepen',
    'smeken', 'snijden', 'sparen', 'speuren', 'stelen', 'stoppen',
    'strelen', 'studeren', 'telefoneren', 'twijfelen', 'uitleggen', 'uitpakken',
    'verbergen', 'verdwalen', 'vergeten', 'verkopen', 'verliezen', 'verrassen',
    'verzorgen', 'vluchten', 'volgen', 'wachten', 'wassen', 'weggooien',
    'werken', 'winnen', 'wroeten', 'zoeken', 'zwaaien', 'niezen',
    'sluipen', 'brand blussen', 'eerste hulp verlenen', 'geblinddoekt', 'geheim bewaren', 'inhalen',
    'misleiden', 'in de rij staan', 'op de vlucht zijn', 'rijbewijs halen', 'schipbreukeling', 'sleutels verliezen',
    'verslikken', 'verstoppertje', 'hinkelen', 'touwtjesspringen', 'bijna', 'stilte',
    'angst', 'geluk', 'haast', 'verveeld', 'achtervolgen', 'bazelen',
    'bedanken', 'begroeten', 'beschermen', 'bewonderen', 'boeren', 'controleren',
    'debatteren', 'demonstreren', 'flirten', 'herkennen', 'hijgen', 'improviseren',
    'jongleren', 'knijpen', 'krabben', 'kwispelen', 'mompelen', 'ontsnappen',
    'overwinnen', 'piepen', 'prikken', 'rijden', 'schudden', 'slenteren',
    'sluimeren', 'snuffelen', 'stampen', 'staren', 'steigeren', 'trillen',
    'wentelen', 'woelen', 'zuchten', 'avontuur', 'bewijs', 'droom',
    'gevaar', 'gewoonte', 'grens', 'herinnering', 'idee', 'kans',
    'karakter', 'leugen', 'liefde', 'mening', 'mysterie', 'nieuws',
    'ongeluk', 'oplossing', 'pech', 'plan', 'probleem', 'raadsel',
    'roddel', 'rust', 'succes', 'takelen', 'toeval', 'traditie', 'trots',
    'verrassing', 'vertrouwen', 'vreugde', 'waarheid', 'wonder', 'confrontatie',
    'intimidatie', 'manipulatie', 'afpersen', 'kidnapping', 'gijzeling', 'brandstichting',
    'smokkel', 'sms-en', 'appen', 'mailen', 'posten', 'liken',
    'googelen', 'typen', 'kopiëren', 'plakken', 'opslaan', 'printen',
    'filmen', 'livestreamen', 'opnemen', 'afspelen', 'pauzeren', 'openen',
    'sluiten', 'vergrendelen', 'ontgrendelen', 'instellen', 'bestellen', 'pinnen',
    'aftekenen', 'bezorgen', 'inpakken', 'sjouwen', 'tillen', 'dragen',
    'timmeren', 'zagen', 'boren', 'schroeven', 'metselen', 'zingen',
    'spelen', 'stampvoet', 'dansen'
  ];

  const landen = [
    'Afghanistan', 'Albanië', 'Algerije', 'Argentinië', 'Armenië', 'Australië',
    'Azerbeidzjan', 'Bahrein', 'Bangladesh', 'Barbados', 'België', 'Bhutan',
    'Bolivia', 'Botswana', 'Brazilië', 'Brunei', 'Bulgarije', 'Cambodja',
    'Canada', 'Chili', 'China', 'Colombia', 'Comoren', 'Congo',
    'Cuba', 'Denemarken', 'Duitsland', 'Ecuador', 'Egypte', 'Ethiopië',
    'Fiji', 'Filippijnen', 'Finland', 'Frankrijk', 'Georgië', 'Ghana',
    'Griekenland', 'Guatemala', 'Haïti', 'Honduras', 'Hongarije', 'Ierland',
    'IJsland', 'Indonesië', 'Irak', 'Iran', 'Israël', 'Italië',
    'Jamaica', 'Japan', 'Jemen', 'Jordanië', 'Kazachstan', 'Kenia',
    'Kosovo', 'Kroatië', 'Laos', 'Letland', 'Libanon', 'Liberia',
    'Libië', 'Litouwen', 'Luxemburg', 'Madagascar', 'Maldiven', 'Maleisië',
    'Mali', 'Malta', 'Mexico', 'Moldavië', 'Monaco', 'Mongolië',
    'Montenegro', 'Mozambique', 'Myanmar', 'Namibië', 'Nederland', 'Nepal',
    'Nicaragua', 'Niger', 'Nigeria', 'Noorwegen', 'Oekraïne', 'Oezbekistan',
    'Oman', 'Oostenrijk', 'Pakistan', 'Panama', 'Paraguay', 'Peru',
    'Polen', 'Portugal', 'Qatar', 'Roemenië', 'Rusland', 'Rwanda',
    'Saudi-Arabië', 'Senegal', 'Servië', 'Singapore', 'Slovenië', 'Soedan',
    'Somalië', 'Spanje', 'Sri Lanka', 'Suriname', 'Syrië', 'Tanzania',
    'Thailand', 'Tsjechië', 'Tunesië', 'Turkije', 'Uganda', 'Uruguay',
    'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe', 'Zweden', 'Zwitserland',
    'Andorra', 'Angola', 'Burkina Faso', 'Costa Rica', 'Cyprus', 'Djibouti',
    'Dominicaanse Republiek', 'El Salvador', 'Eritrea', 'Estland', 'Gambia', 'Guyana',
    'Ivoorkust', 'Kameroen', 'Kirgizië', 'Koeweit', 'Liechtenstein', 'Madagaskar',
    'Mauritius', 'Nieuw-Zeeland', 'Noord-Korea', 'Oost-Timor', 'Papua Nieuw-Guinea', 'Filipijnen',
    'San Marino', 'Sierra Leone', 'Taiwan', 'Tadzjikistan', 'Tsjaad', 'Turkmenistan',
    'Vaticaanstad', 'Wit-Rusland', 'Centraal-Afrikaanse Republiek', 'Trinidad en Tobago', 'Bosnië-Herzegovina', 'Libië',
    'Kaapverdië', 'Dominica', 'Palestina', 'Schotland', 'Wales', 'Catalonië',
    'Koerdistan', 'Tibet', 'Puerto Rico', 'Groenland', 'Aruba', 'Curaçao',
    'Bermuda', 'Gibraltar', 'Frans-Guyana', 'Tahiti', 'Sint Maarten'
  ];

  const wetenschap = [
    'acupunctuur', 'ader', 'adrenaline', 'allergie', 'amputatie', 'anesthesie',
    'autopsie', 'bewusteloos', 'bloedarmoede', 'beroerte', 'celsius', 'cholesterol',
    'claustrofobie', 'coma', 'dementie', 'depressie', 'desinfecteren', 'dialyse',
    'doofstom', 'doping', 'epidemie', 'forensisch onderzoek', 'geheugenverlies', 'hallucinatie',
    'hartstilstand', 'hersenletsel', 'homeopathie', 'hoogtevrees', 'hormoon', 'hypnose',
    'hysterie', 'illusie', 'immuunsysteem', 'injectie', 'jaloezie', 'keizersnede',
    'meditatie', 'migraine', 'narcisme', 'obsessie', 'onderbewustzijn', 'overdosis',
    'overlevingsdrang', 'pandemie', 'paranoia', 'persoonlijkheidsstoornis', 'posttraumatische stress', 'psychiatrie',
    'quarantaine', 'reflectie', 'rehabilitatie', 'reïncarnatie', 'schizofrenie', 'stigma',
    'surrogaatmoeder', 'transplantatie', 'tunnelvisie', 'vaccinatie', 'wedergeboorte', 'begrafenis',
    'laboratorium', 'algoritme', 'brainstorm', 'evolutie', 'frictie', 'grafiek',
    'hypotheek', 'implosie', 'mutatie', 'nihilisme', 'paradox', 'pesticide',
    'relatief', 'stralingsvergiftiging', 'tijdreizen', 'utopie', 'stroomuitval', 'hersenspoeling',
    'isolatie', 'sprookje', 'plagiaat', 'archeologie', 'barometer', 'geigerteller',
    'kwikthermometer', 'stethoscoop', 'thermometer', 'vergrootglas', 'loep', 'magneet',
    'transistor', 'dwangbuis', 'scalpel', 'defibrillator', 'rolstoel', 'atoomkern',
    'nucleaire reactor', 'radioactiviteit', 'biologie', 'scheikunde', 'natuurkunde', 'wiskunde',
    'informatica', 'geologie', 'meteorologie', 'genetica', 'microbiologie', 'ecologie',
    'antropologie', 'hypothese', 'theorie', 'experiment', 'observatie', 'controlegroep',
    'steekproef', 'statistiek', 'variabele', 'correlatie', 'causaliteit', 'replica',
    'publicatie', 'operatie', 'diagnose', 'symptoom', 'behandeling', 'medicijn',
    'vaccin', 'antibiotica', 'pijnstiller', 'bloeddruk', 'pols', 'ECG',
    'MRI', 'röntgenfoto', 'echo', 'bloedonderzoek', 'besmetting', 'infectie',
    'virus', 'bacterie', 'microscoop', 'centrifuge', 'reageerbuisje', 'pipet',
    'bunsenbrander', 'onderzoeksinstituut', 'promotie', 'wetenschappelijk artikel', 'peer review',
    'citatie', 'bibliografie', 'laboratoriumjas', 'proefopstelling', 'meting', 'fout',
    'nauwkeurigheid', 'precisie', 'kalibratie', 'ijking', 'standaard', 'kilogram',
    'meter', 'ampere', 'kelvin', 'joule', 'watt',
    'frequentie', 'golflengte', 'trilling', 'geluid', 'licht', 'kleur',
    'spectrum', 'breking', 'spiegeling', 'elektriciteit', 'magnetisme', 'stroom',
    'spanning', 'weerstand', 'geleider', 'supergeleider',
    'chromosoom', 'DNA', 'RNA', 'gen', 'eiwit', 'cel',
    'celkern', 'mitochondriën', 'fotosynthese', 'ademhaling', 'reactie', 'verbinding',
    'element', 'molecuul', 'atoom', 'elektron', 'proton', 'neutron',
    'foutmarge', 'gemiddelde', 'mediaan', 'modus', 'histogram', 'staafdiagram',
    'taartdiagram', 'pH-waarde', 'zuurgraad', 'base', 'zuur', 'zout',
    'oxidatie', 'reductie', 'straling', 'kernfusie', 'kernsplijting', 'deeltjesversneller',
    'supergeluid', 'ondertoon', 'boventoon', 'ultrageluid', 'infrarood', 'ultraviolet',
    'röntgen', 'hologram', 'laser', 'bloedgroep', 'plasma', 'enzym',
    'receptor', 'reflex', 'metabolisme'
  ];

  const politiek = [
    'anarchie', 'democratie', 'dictator', 'fascisme', 'imperialisme', 'nationalisme',
    'oligarchie', 'parlementaire democratie', 'totalitarisme', 'soevereiniteit', 'bureaucratie', 'hiërarchie',
    'diplomatie', 'legitimiteit', 'genocide', 'holocaust', 'rebellie', 'revolutie',
    'slavernij', 'staking', 'terreurcel', 'volksopstand', 'vluchteling', 'martelaar',
    'inquisitie', 'executie', 'avondklok', 'bankroet', 'belasting', 'beschaving',
    'boeddhisme', 'censuur', 'corruptie', 'crisis', 'cyberpesten', 'dagvaarding',
    'dilemma', 'discriminatie', 'erfenis', 'faillissement', 'fraude', 'fusie',
    'getuige', 'globalisering', 'herverdeling', 'immigratie', 'lockdown', 'misogynie',
    'monopolie', 'nepnieuws', 'onteigening', 'polarisatie', 'populisme', 'propaganda',
    'protocolbreuk', 'radicalisering', 'recessie', 'referendum', 'sancties', 'schandaal',
    'schijnheilig', 'taboe', 'uitbuiting', 'uitzetting', 'verjaring', 'vervreemding',
    'vetorecht', 'xenofobie', 'zwarte markt', 'chantage', 'klokkenluider', 'assertief',
    'klimaatcrisis', 'coalitie', 'oppositie', 'verkiezingen', 'stemmen', 'partij',
    'minister', 'staatssecretaris', 'premier', 'president', 'koning', 'parlement',
    'senaat', 'grondwet', 'wet', 'amendement', 'motie', 'debat',
    'lobby', 'fractie', 'kamerlid', 'wethouder', 'gemeenteraad', 'provincie',
    'beleid', 'maatregel', 'subsidie', 'bezuiniging', 'begroting', 'nationalisatie',
    'privatisering', 'verdrag', 'VN', 'NAVO', 'EU',
    'ambassade', 'consul', 'staatshoofd', 'topontmoeting', 'vredesakkoord', 'veto',
    'resolutie', 'sanctie', 'handelsoorlog', 'mensenrechten', 'vrijheid van meningsuiting', 'persvrijheid',
    'gelijkheid', 'rechtvaardigheid', 'solidariteit', 'integratie', 'asielzoeker', 'statushouder',
    'paspoort', 'douane', 'belastingdienst', 'sociale zekerheid', 'werkloosheid', 'armoede',
    'welvaart', 'inkomensverdeling', 'stembureau', 'kiesdrempel', 'lijsttrekker', 'kandidaat',
    'campagne', 'verkiezingsprogramma', 'coalitieakkoord', 'formatiegesprekken', 'informateur', 'formateur',
    'kabinetsformatie', 'demissionair', 'regeerakkoord', 'troonrede', 'prinsjesdag', 'miljoenennota',
    'rijksbegroting', 'belastingaangifte', 'toeslagen', 'uitkering', 'pensioen', 'zorgverzekering',
    'hypotheekrenteaftrek', 'minimumloon', 'cao', 'vakbond', 'werkgeversorganisatie', 'stakingsrecht',
    'collectieve actie', 'petitie', 'demonstratie', 'burgerrechten', 'grondrechten', 'privacywet',
    'vrije pers', 'desinformatie', 'transparantie', 'integriteit', 'gedragscode', 'pressiegroep',
    'denktank', 'adviesraad', 'raad van state', 'nationale ombudsman', 'rekenkamer', 'hoge raad',
    'constitutioneel hof', 'europees hof', 'internationaal strafhof', 'arbitrage', 'mediation', 'rechtsstaat',
    'scheiding der machten', 'checks en balances', 'stemrecht', 'kiesrecht', 'formatiegesprek', 'demissionair kabinet',
    'raadslid', 'gedeputeerde', 'volksvertegenwoordiger', 'staatsschuld', 'btw', 'inkomstenbelasting',
    'vermogensbelasting', 'accijns', 'handelsakkoord', 'handelspartner', 'economische unie', 'vrijhandel',
    'consumentenbescherming', 'milieubeleid', 'klimaatbeleid', 'energiebeleid', 'woningbeleid', 'onderwijsbeleid',
    'gezondheidszorg', 'pensioenstelsel', 'politieke partij', 'handelsverdrag', 'gelijkwaardigheid', 'algemene staking',
    'verkiezingscampagne', 'staatsbegroting', 'belasting over toegevoegde waarde', 'vrijhandelszone', 'klimaatwet', 'woningmarkt',
    'volksgezondheid', 'pensioenfonds', 'arbeidsongeschiktheid', 'uitkeringsinstantie', 'vice-premier', 'fractievoorzitter',
    'partijcongres', 'ledenraadpleging', 'coalitiekabinet', 'minderheidskabinet', 'vertrouwensstemming', 'hoorzitting',
    'kamerdebat', 'burgemeester', 'fractieleider', 'provinciebestuur', 'kabinetscrisis', 'motie van wantrouwen',
    'tweede kamer', 'eerste kamer'
  ];

  const muziek = [
    'gitaar', 'basgitaar', 'elektrische gitaar', 'akoestische gitaar', 'ukelele', 'banjo',
    'viool', 'altviool', 'cello', 'contrabas', 'harp',
    'luit', 'sitar', 'trompet', 'trombone', 'tuba', 'hoorn',
    'saxofoon', 'klarinet', 'clarinet', 'fluit', 'dwarsfluit', 'blokfluit',
    'fagot', 'hobo', 'didgeridoo', 'piano', 'vleugel', 'orgel',
    'accordeon', 'synthesizer', 'keyboard', 'trommel', 'xylofoon', 'djembé',
    'microfoon', 'luidspreker', 'versterker', 'mengpaneel', 'gramofoon', 'elpee',
    'platenspeler', 'koptelefoon', 'muziekdoos', 'notenbalk', 'orgelpijp', 'albumhoes',
    'muziek', 'orkest', 'koor', 'symfonie', 'opera', 'jazz',
    'blues', 'rock', 'pop', 'rap', 'hiphop', 'klassiek',
    'reggae', 'soul', 'folk', 'punk', 'metal', 'elektronische muziek',
    'akkoord', 'melodie', 'ritme', 'beat', 'refrein', 'solo',
    'concert', 'festival', 'repetitie', 'songtekst', 'opname', 'album',
    'single', 'live optreden', 'dirigent', 'dj', 'musicus', 'zanger',
    'operazanger', 'componist', 'gitarist', 'drummer', 'pianist', 'violist',
    'kapelmeester', 'bandlid', 'producer', 'pianospelen', 'djembé spelen', 'componeren',
    'dirigeren', 'optreden', 'country', 'gospel', 'latin', 'afrobeat',
    'disco', 'techno', 'house', 'trance', 'drum and bass', 'ambient',
    'new wave', 'indie', 'grunge', 'hardrock', 'heavy metal', 'r&b',
    'toonladder', 'noot', 'maat', 'tempo', 'dynamiek', 'harmonie',
    'octaaf', 'interval', 'crescendo', 'panfluit', 'doedelzak',
    'mondharmonica', 'kazoo', 'tamboerijn', 'steeldrum',
    'songwriter', 'geluidstechnicus', 'lichtontwerper', 'tourmanager',
    'groupie', 'danseres', 'choreograaf', 'geluidsinstallatie', 'podium',
    'theaterzaal', 'akoestisch', 'repetitieruimte', 'muziekschool', 'conservatorium', 'songcontest',
    'muziekfestival', 'gitaarsolo', 'drumritme', 'baspartij', 'zangpartij', 'koorpartij',
    'strijkorkest', 'fanfare', 'jazzband', 'rockband',
    'popgroep', 'duo', 'trio', 'kwartet', 'solist',
    'tenor', 'sopraan', 'alt', 'koorzanger',
    'koorlid', 'koordirigent', 'muziekvideo', 'platenlabel',
    'muziekuitgever', 'auteursrecht', 'royalties', 'streaming', 'muziekapp',
    'discjockey', 'turntable', 'beatmaker', 'sample',
    'remix', 'mashup', 'cover', 'liveband',
    'openluchtconcert', 'jamsessie', 'nachtclub', 'poppodium', 'muziekzaal',
    'operahuis', 'concertgebouw', 'festivalterrein', 'backstage',
    'soundcheck', 'trekharmonika', 'oud', 'strijkkwartet',
    'volkslied', 'kinderlied', 'slaapliedje', 'kerstlied', 'hymne', 'psalm',
    'serenade', 'wals', 'polka', 'tango', 'samba', 'rumba',
    'cha-cha-cha', 'foxtrot', 'quickstep', 'slowfox'
  ];

  const militair = [
    'soldaat', 'generaal', 'luitenant', 'sergeant', 'korporaal', 'officier',
    'commandant', 'ridder', 'sluipschutter', 'marinier', 'luchtmachtpiloot', 'onderofficier',
    'geweer', 'pistool', 'machinegeweer', 'zwaard',
    'speer', 'boog', 'kruisboog', 'bajonet', 'drietand', 'lasso',
    'kanon', 'kanonskogel', 'katapult', 'handgranaat', 'explosief',
    'munitie', 'torpedo', 'landmijn', 'bom', 'nucleaire bom', 'harnas',
    'schild', 'wapenschild', 'helm', 'kogelvrij vest', 'gasmasker', 'camouflagepak',
    'bazooka', 'leugendetector', 'handboeien', 'morse', 'vuurpijl', 'harpoen',
    'guillotine', 'tank', 'pantservoertuig', 'onderzeeboot', 'vliegdekschip', 'oorlogsschip',
    'gevechtsvliegtuig', 'militaire helikopter', 'kazerne', 'bunker', 'fort', 'vesting',
    'commandopost', 'militaire basis', 'loopgraaf', 'mijnenveld', 'patrouilleboot', 'schieten',
    'invasie', 'guerrilla oorlog', 'coup', 'oorlogsmisdaad', 'wapenhandel', 'burgerwacht',
    'agressor', 'militaire oefening', 'belegering', 'geheime operatie', 'spionage', 'sabotage',
    'capitulatie', 'wapenstilstand', 'tribunaal', 'krijgsraad', 'massamoord', 'evacuatie',
    'parachute', 'radarscherm', 'infanterie', 'cavalerie', 'artillerie', 'marine',
    'luchtmacht', 'landmacht', 'commando', 'parachutist', 'verkenner',
    'majoor', 'kolonel', 'admiraal', 'veldslag', 'hinderlaag', 'frontlinie',
    'achterhoede', 'vliegbasis', 'militaire begraafplaats', 'marinebasis', 'grenspost', 'checkpoint',
    'mijnenveger', 'verkenningsvliegtuig', 'bommenwerper', 'jachtvliegtuig', 'transportvliegtuig', 'gevechtshelikopter',
    'raketschild', 'luchtafweer', 'radar', 'sonar',
    'nachtkijker', 'verrekijker', 'veldtent', 'veldhospitaal', 'verbandpost', 'ziekenauto',
    'wapenopslag', 'munitiedepot', 'kruitkamer', 'schietbaan', 'hindernisbaan',
    'orlogsvlag', 'saluut', 'wachtpost', 'identiteitsbewijs', 'noodrantsoen', 'veldfles',
    'kaartlezen', 'geheime boodschap', 'beveiliging', 'bewaking', 'grenscontrole',
    'veiligheidszone', 'bufferzones', 'neutrale zone', 'demilitarisatie', 'vredesmissie', 'VN-missie',
    'NAVO-oefening', 'militaire alliantie', 'wapenbestand', 'vuurstaking', 'terugtrekking', 'bezetting',
    'bevrijding', 'overwinning', 'nederlaag', 'verovering', 'stadsbelegering', 'blokkade',
    'embargo', 'oorlogsverklaring', 'mobilisatie', 'dienstplicht', 'huurling', 'militie',
    'reservist', 'veteraan', 'krijgsgevangene', 'onderscheiding',
    'vaandel', 'vlag', 'schouderstuk', 'rang',
    'oorlogsgraf', 'herdenkingsmonument', 'militaire parade', 'militaire politie',
    'inlichtingendienst', 'geheime dienst', 'spionnage', 'cyberaanval', 'informatieoorlog', 'psychologische oorlogsvoering',
    'guerrilla', 'terrorisme', 'aanslagen', 'zelfmoordaanslag', 'bom aanslag', 'ontvoeringen',
    'scherpschutter', 'bomopruimer',
    'pantserdivisie', 'granaatwerper', 'mortier',
    'antitankwapen', 'mijnenlegger', 'amfibievoertuig',
    'konvooi', 'luchtaanval', 'bombardement', 'beschietingen', 'salvo',
    'verdedigingslinie', 'aanvallen', 'terugtrekken','uniform',
    'medaille', 'schreeuw', 'aanval', 'verdediging', 'wapen', 'ransel',
    'kaart', 'leger', 'gevecht', 'oorlog', 'strijd', 'concentratiekamp'
  ];

  const gereedschap = [
    'hamer', 'schaar', 'sleutel', 'moersleutel', 'schroefsleutel', 'tang',
    'zaag', 'schroevendraaier', 'beitel', 'mes', 'pikhouweel', 'zeis',
    'hooivork', 'hark', 'gieter', 'borstel', 'verfkwast', 'ladder',
    'touwladder', 'trap', 'waterpas', 'boormachine', 'kettingzaag', 'naaimachine',
    'stroomgenerator', 'turbine', 'dynamo', 'liniaal', 'weegschaal', 'gereedschapskist',
    'spijker', 'smeedijzer', 'telraam', 'rekenmachine', 'aardappelschiller',
    'waterpomptang', 'steeksleutel', 'inbussleutel', 'schaaf', 'vijl',
    'handzaag', 'figuurzaag', 'cirkelzaag', 'schuurmachine', 'decoupeerzaag',
    'accuboormachine', 'lasapparaat', 'soldeerbout', 'heteluchtpistool', 'meetlint', 'duimstok',
    'prikpen', 'punttang', 'schroef',
    'bout', 'moer', 'ring', 'plug', 'haak', 'kram',
    'nagel', 'kittpistool', 'lijmpistool', 'lijmklem', 'bankschroef', 'werkbank',
    'veiligheidshelm', 'veiligheidsbril', 'werkhandschoenen', 'stofmasker', 'gehoorbescherming', 'kniebeschermer',
    'kruiwagen', 'hefboom', 'katrol', 'handkar', 'palletwagen',
    'hijsband', 'touw', 'steiger', 'koevoet', 'breekijzer', 'schuurpapier',
    'freesmachine', 'bankmes', 'stanleymes', 'cuttermesje', 'lintmeter', 'dieptemeter',
    'gradenboog', 'klinknagel', 'snijder',
    'verfroller', 'kwast', 'verfbak', 'afplaktape', 'kit', 'siliconekit',
    'purschuim', 'isolatiemateriaal', 'ducttape', 'perslucht',
    'compressor', 'spijkerpistool', 'tacker', 'houtlijm',
    'plamuurmes', 'roerder', 'mixer', 'cementmixer', 'hoogteschaffer',
    'nijptang', 'werktafel', 'lijmspuit', 'noodstroomgenerator', 'stofopvangzak',
    'verlengstuk', 'worktafel', 'spoorbreedte', 'boorset', 'luchtcompressor', 'verfspuiter',
    'verf afbijter', 'ontvetter', 'ontroesters', 'beschermkapjes',
    'zaagblad', 'potje verf', 'rol', 'spijkertje', 'schroefje', 'boortje',
    'zaagje', 'sloopkogel', 'hijskraan', 'moker', 'vuurhaard', 'kachel',
    'gasbrander', 'lasbril', 'koord', 'spatel', 'tegelsnijder'
  ];

  const ruimte = [
    'astronaut', 'astroloog', 'ruimtevaart', 'ruimtewetenschapper', 'raket', 'space shuttle',
    'maanlander', 'vliegende schotel', 'satelliet', 'telescoop', 'sterrenwacht', 'ruimtestation',
    'ruimtepak', 'lanceerplatform', 'ruimtesonde', 'maan', 'zon', 'ster',
    'planeet', 'komeet', 'ruimte', 'melkweg', 'zwart gat', 'supernova',
    'sterrenstelsel', 'meteoor', 'meteoriet', 'Mars', 'Venus', 'Jupiter', 'Saturnus',
    'Mercurius', 'Neptunus', 'Uranus', 'noorderlicht', 'maansverduistering',
    'eclips', 'zwaartekracht', 'dampkring', 'astronomie', 'buitenaards leven', 'maanwandeling',
    'ISS', 'seconde', 'Pluto',
    'big bang', 'heelal', 'asteroïde', 'komeetstaart',
    'meteorenregen', 'vallende ster', 'ruimtecapsule', 'ruimtewandeling',
    'ruimtetelescoop', 'Hubble', 'James Webb', 'kosmische straling', 'gewichtloosheid',
    'zuurstoftank', 'landingsgestel', 'lanceerinstallatie',
    'NASA', 'lichtjaar', 'lichtsnelheid', 'horizon',
    'sterrenkunde', 'planetarium',
    'relativiteitstheorie', 'oerknal', 'botsende sterrenstelsels',
    'gasreuzen', 'planetenring',
    'magnetische pool', 'poolster', 'evenaar', 'landing op de maan', 'eerste mens in de ruimte',
    'commerciële ruimtevaart', 'marsrover', 'Voyager',
    'Apollo', 'SpaceX', 'gps-tracker',
    'hemellichaam', 'sterrenbeeld', 'Grote Beer',
    'Kleine Beer', 'Tweelingen', 'Maagd', 'Waterman',
    'kosmonaut', 'luchtsluis',
    'koppelingssysteem', 'zonnepanelen', 'gyroscoop', 'hitteschild',
    'krater', 'sterrenkundige', 'CO2-filter', 'maanmissie',
    'stratosfeer', 'magnetisch veld', 'ruimteschip', 'marslandschap'
  ];

  const spreekwoorden = [
    'alle hens aan dek',
    'als de kat van huis is dansen de muizen',
    'al doende leert men',
    'beter laat dan nooit',
    'de appel valt niet ver van de boom',
    'door de zure appel heen bijten',
    'een gewaarschuwd man telt voor twee',
    'van een koude kermis thuiskomen',
    'een oogie dichtknijpen',
    'een storm in een glas water',
    'ergens de brui aan geven',
    'het kind met het badwater weggooien',
    'het roer omgooien',
    'hoge bomen vangen veel wind',
    'iemand een hak zetten',
    'iemand in de maling nemen',
    'iemand op de kast jagen',
    'in de wolken zijn',
    'in het nauw gedreven',
    'je kunt niet op twee paarden tegelijk wedden',
    'je huid duur verkopen',
    'zoals het klokje thuis tikt tikt het nergens',
    'langs de neus weg',
    'met de deur in huis vallen',
    'met lege handen staan',
    'met zijn rug tegen de muur staan',
    'met stomheid geslagen zijn',
    'nieuwe bezems vegen schoon',
    'niet alle dagen zondag',
    'olie op het vuur gooien',
    'om de hete brij heen draaien',
    'onder de duim houden',
    'op zijn lauweren rusten',
    'over de rooie gaan',
    'over een kam scheren',
    'roet in het eten gooien',
    'slapende honden wakker maken',
    'muggenziften',
    'tegen de stroom ingaan',
    'twee honden vechten om een been',
    'uit de school klappen',
    'van een mug een olifant maken',
    'van het kastje naar de muur sturen',
    'ver van mijn bed show',
    'vuur met vuur bestrijden',
    'water naar de zee dragen',
    'wie niet waagt wie niet wint',
    'nieuwe wijn in oude zakken',
    'wolf in schaapskleren',
    'zijn hand overspelen',
    'zijn tanden laten zien',
    'zijn vingers branden aan iets',
    'zo vader zo zoon',
    'broodje aap verhaal',
    'door de mand vallen',
    'met de gebakken peren zitten',
    'de koe bij de horens vatten',
    'iemand de wind uit de zeilen nemen',
    'met alle winden meedraaien',
    'geen haar op zijn hoofd',
    'uit zijn vel springen',
    'de hand in eigen boezem steken',
    'achter het net vissen',
    'iets op zijn beloop laten',
    'twee vliegen in een klap',
    'als twee druppels water',
    'de wind in de zeilen hebben',
    'met de neus in de boter vallen',
    'de pineut zijn',
    'in de aap gelogeerd zijn',
    'al is de leugen nog zo snel de waarheid achterhaalt haar wel',
    'beter een vogel in de hand dan tien in de lucht',
    'een ezel stoot zich geen twee keer aan dezelfde steen',
    'oost west thuis best',
    'zoals de waard is vertrouwt hij zijn gasten',
    'wie goed doet goed ontmoet',
    'leugens hebben korte benen',
    'in het land der blinden is eenoog koning',
    'van uitstel komt afstel',
    'de eerste klap is een daalder waard',
    'eigen haard is goud waard',
    'achteraf is iedereen wijs',
    'als het kalf verdronken is dempt men de put',
    'gedeelde smart is halve smart',
    'gedeelde vreugde is dubbele vreugde',
    'geld maakt niet gelukkig',
    'het gras is altijd groener aan de andere kant',
    'honger is de beste saus',
    'ieder huisje heeft zijn kruisje',
    'jong geleerd oud gedaan',
    'liefde maakt blind',
    'met geduld en vlijt komt men wijd',
    'na regen komt zonneschijn',
    'nooit te oud om te leren',
    'onbekend maakt onbemind',
    'oude liefde roest niet',
    'praten is zilver zwijgen is goud',
    'Rome is niet in een dag gebouwd',
    'schone schijn bedriegt',
    'stille wateren hebben diepe gronden',
    'tijd is geld',
    'uit het oog uit het hart',
    'vele handen maken licht werk',
    'vertrouwen komt te voet en gaat te paard',
    'waar rook is is vuur',
    'wat men niet weet wat men niet deert',
    'wie de schoen past trekt hem aan',
    'wie het kleine niet eert is het grote niet weerd',
    'wie kaatst moet de bal verwachten',
    'wie zwijgt stemt toe',
    'men moet het ijzer smeden als het heet is',
    'een goed begin is het halve werk',
    'aan een half woord genoeg hebben',
    'hoe meer zielen hoe meer vreugd',
    'het doel heiligt de middelen',
    'de pen is machtiger dan het zwaard',
    'beter voorkomen dan genezen',
    'eind goed al goed',
    'er is geen roos zonder doornen',
    'wie het laatst lacht lacht het best',
    'in de nood leert men zijn vrienden kennen',
    'met een zwaluw is het nog geen zomer',
    'over smaak valt niet te twisten',
    'wat de boer niet kent dat eet hij niet',
    'een wit voetje halen',
    'iets voor zoete koek slikken',
    'op de vingers tikken',
    'over de schreef gaan',
    'er met de pet naar gooien',
    'iemand het hoofd op hol brengen',
    'hard aan de weg timmeren',
    'ergens geen gat in zien',
    'met de neus op de feiten drukken',
    'op zijn dooie gemakje',
    'schouders ergens onder zetten',
    'iemand een loer draaien',
    'met fluwelen handschoen aanpakken',
    'niet alles is goud wat er blinkt',
    'het achter de ellebogen hebben',
    'de knoop doorhakken',
    'ergens geen doekjes omwinden',
    'iets door de vingers zien',
    'iemand naar de mond praten',
    'zijn hart op de tong dragen',
    'de boot missen',
    'er een nachtje over slapen',
    'met de billen bloot',
    'niet van gisteren zijn',
    'op de hoogte zijn',
    'zijn mond voorbij praten',
    'tegen beter weten in',
    'uit de hand lopen',
    'van geen ophouden weten',
    'het bijltje erbij neerleggen',
    'met een kluitje in het riet sturen',
    'zijn hart ophalen',
    'uit de toon vallen',
    'de kat uit de boom kijken'
  ];

  const huishouden = [
    'aanrecht', 'barbecuetang', 'keukenrol', 'theedoek', 'servet', 'wasmachine',
    'beker', 'glaasje', 'wijnglas', 'lepel', 'vork', 'kookwekker',
    'strijkijzer', 'bezem', 'plantenpot', 'plantje', 'gordijn', 'deurmat',
    'deurbel', 'rolluik', 'vloerkleed', 'lamp', 'gloeilamp', 'wekker',
    'klok', 'boekenkast', 'spiegel', 'tafel', 'stoel', 'bank',
    'bureau', 'dekbed', 'mand', 'prullenbak', 'wastafel', 'koffiezetapparaat',
    'koelkast', 'vriezer', 'magnetron', 'sierkussen', 'kookpan', 'schoonmaakmiddel',
    'barbecue', 'borrelplank', 'snijplank', 'airfryer', 'blender', 'koekenpan',
    'pan', 'pollepel', 'soeplepel', 'theekan', 'theemuts', 'kookplaat',
    'oven', 'broodrooster', 'waterkoker', 'keukenmixer', 'sapcentrifuge', 'keukenmachine',
    'rijstkoker', 'slowcooker', 'wokpan', 'braadpan', 'steelpan', 'grillpan',
    'maatbeker', 'keukendoek', 'ovenwant', 'rasp', 'zeef', 'vergiet',
    'blik opener', 'pizzasnijder', 'aardappelstamper', 'handdoek', 'badmat', 'douchegordijn',
    'zeep', 'shampoo', 'conditioner', 'scheerapparaat', 'haarborstel', 'toiletpapier',
    'kussen', 'deken', 'laken', 'kussensloop', 'matras', 'nachtkastje',
    'kleerkast', 'kledingrek', 'strijkplank', 'wasmand', 'droogrek', 'stofzuiger',
    'dweil', 'stoffer', 'bloempot', 'vaas', 'fotolijst', 'tuinslang',
    'tuinschaar', 'grasmaaier', 'heggenschaar', 'tuinstoel', 'tuintafel', 'parasol',
    'tuinkussen', 'saladeschaal', 'serveerschaal', 'soepkom', 'ontbijtkom', 'theepot',
    'koffiepot', 'suikerpot', 'roomkannetje', 'broodtrommel', 'koektrommel', 'botervloot',
    'kaasplank', 'bestek', 'mes', 'theelepel', 'opscheplepel', 'spatel',
    'garde', 'deegroller', 'taartvorm', 'muffinvorm', 'bakpapier', 'aluminiumfolie',
    'huishoudfolie', 'vershoudzakje', 'diepvrieszak', 'stofdoek', 'mop', 'emmer',
    'schrobber', 'toiletborstel', 'afwasborstel', 'sponzen', 'schuurspons', 'allesreiniger',
    'bleekwater', 'afwasmiddel', 'vaatwasser', 'vaatwasmiddel', 'wasmiddel', 'wasverzachter',
    'droogkast', 'eettafel', 'eetkamerstoel', 'salontafel', 'tv-meubel', 'wandkast',
    'ladekast', 'commode', 'dressoir', 'kapstok', 'schoenenrek', 'bijzettafel',
    'schoffel', 'spade', 'tuinvork', 'tuinschep', 'plantenbak', 'compostbak',
    'regenwatertank', 'sprinkler', 'tuinkruiwagen', 'plantenspuit', 'onkruidsteker', 'koffiezetter',
    'pannenset', 'braadslede', 'soeppan', 'fluitketel', 'eierdopje', 'broodplank',
    'kaasrasp', 'citruspers', 'blikopener', 'dopjesopener', 'kurkentrekker', 'kookboek',
    'receptenboek', 'keukentimer', 'keukenweegschaal', 'maatlepel', 'spuitzak', 'taartsteker',
    'cakestandaard', 'boterpapier', 'rijstzeef', 'vuilniszak', 'vuilnisbak', 'afvalbak',
    'oud papier bak', 'glasbak', 'gft-bak', 'papierbak', 'vloerlamp', 'tafellamp',
    'bureaulamp', 'plafondlamp', 'spotje', 'vitrage', 'overgordijn', 'rolgordijn',
    'antislipmat', 'muizenmat', 'vloerbedekking', 'parket', 'laminaat', 'tegels',
    'behang', 'verf', 'handdoekrek', 'zeephouder', 'tandenborstelhouder', 'toilettasje',
    'nagelvijl', 'pincet', 'bloemperk', 'vijverpomp', 'tuinverlichting', 'schutting',
    'pergola', 'tuinhek', 'tuinpad', 'vliegenwering', 'muggenlamp', 'vogelbadje',
    'vogelhuisje', 'vogelvoer', 'tuinaarde', 'bad', 'douche', 'toilet',
    'plank', 'rek', 'bak', 'verwarmingsradiator', 'thermostaatknop', 'rookmelder',
    'sleutelhaak', 'brievenbus', 'buitenlamp', 'wandspiegel', 'fotolijstje', 'kaarsenhouder',
    'windlicht', 'plantenhanger', 'salontafelkleed', 'badkamerspiegel', 'wasknijper'
  ];

  WORDS_BY_CATEGORY['dieren'] = dieren;
  WORDS_BY_CATEGORY['voedsel'] = voedsel;
  WORDS_BY_CATEGORY['beroepen'] = beroepen;
  WORDS_BY_CATEGORY['sport'] = sport;
  WORDS_BY_CATEGORY['objecten'] = objecten;
  WORDS_BY_CATEGORY['huishouden'] = huishouden;
  WORDS_BY_CATEGORY['natuur'] = natuur;
  WORDS_BY_CATEGORY['vervoer'] = vervoer;
  WORDS_BY_CATEGORY['plaatsen'] = plaatsen;
  WORDS_BY_CATEGORY['acties'] = acties;
  WORDS_BY_CATEGORY['landen'] = landen;
  WORDS_BY_CATEGORY['gereedschap'] = gereedschap;
  WORDS_BY_CATEGORY['muziek'] = muziek;
  WORDS_BY_CATEGORY['militair'] = militair;
  WORDS_BY_CATEGORY['ruimte'] = ruimte;
  WORDS_BY_CATEGORY['wetenschap'] = wetenschap;
  WORDS_BY_CATEGORY['politiek'] = politiek;
  WORDS_BY_CATEGORY['spreekwoorden'] = spreekwoorden;
  WORDS_BY_CATEGORY['all'] = [...new Set(Object.values(WORDS_BY_CATEGORY).flat())];
})();

// Bonus words: alle woorden uit categorieen met bonus: true (spreekwoorden)
const BONUS_WORDS_SET = new Set(
  CATEGORIES
    .filter(c => c.bonus)
    .flatMap(c => WORDS_BY_CATEGORY[c.id] || [])
);

// Geeft het aantal bonuspunten terug voor een woord:
// spreekwoorden (uit bonus-categorie) → +2 extra (totaal 3 punten)
// gewone woorden → 0 bonuspunten (totaal 1 punt)
function getBonusPoints(word) {
  if (BONUS_WORDS_SET.has(word)) return 2;
  return 0;
}

const DEFAULT_ROUND_TIME = 120;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}


// ── Screens ──────────────────────────────────────────────────────────────────

function SetupScreen({ onStart }) {
  const [count, setCount] = useState(3);
  const [names, setNames] = useState(["Dennis", "Marion", "Theo"]);
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);
  const [teamMode, setTeamMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(() => new Set(CATEGORIES.map((c) => c.id)));
  // In team mode: teamSizes[t] = aantal spelers in team t
  const [teamSizes, setTeamSizes] = useState([2, 2]);

  const toggleTeamMode = () => {
    setTeamMode((prev) => {
      if (!prev) {
        // Schakel over naar team-modus: 2 teams van elk 2 spelers
        setCount(2);
        setTeamSizes([2, 2]);
        setNames(Array(4).fill(""));
      } else {
        // Terug naar singles
        setCount(3);
        setNames(["Dennis", "Marion", "Theo"]);
      }
      return !prev;
    });
  };

  const updateCount = (n) => {
    const clamped = Math.min(teamMode ? 10 : 20, Math.max(2, n));
    setCount(clamped);
    if (teamMode) {
      // Bereken nieuwe teamSizes synchroon op basis van huidige state
      const newSizes = [...teamSizes.slice(0, clamped)];
      while (newSizes.length < clamped) newSizes.push(2);
      const total = newSizes.reduce((a, b) => a + b, 0);
      setTeamSizes(newSizes);
      setNames((prevNames) => {
        const next = [...prevNames];
        while (next.length < total) next.push("");
        const result = [];
        let offset = 0;
        for (let t = 0; t < clamped; t++) {
          result.push(...next.slice(offset, offset + newSizes[t]));
          offset += newSizes[t];
        }
        return result.slice(0, total);
      });
    } else {
      setNames((prev) => {
        const next = [...prev];
        while (next.length < clamped) next.push("");
        return next.slice(0, clamped);
      });
    }
  };

  // Voeg een speler toe aan team t
  const addPlayerToTeam = (t) => {
    const offset = teamSizes.slice(0, t + 1).reduce((a, b) => a + b, 0);
    setTeamSizes((prev) => prev.map((s, i) => i === t ? s + 1 : s));
    setNames((prev) => {
      const next = [...prev];
      next.splice(offset, 0, "");
      return next;
    });
  };

  // Verwijder laatste speler uit team t (minimaal 2)
  const removePlayerFromTeam = (t) => {
    if (teamSizes[t] <= 2) return;
    const offset = teamSizes.slice(0, t + 1).reduce((a, b) => a + b, 0);
    setTeamSizes((prev) => prev.map((s, i) => i === t ? s - 1 : s));
    setNames((prev) => {
      const next = [...prev];
      next.splice(offset - 1, 1);
      return next;
    });
  };

  const updateName = (i, v) =>
    setNames((prev) => prev.map((n, j) => j === i ? v : n));

  const randomizeNames = () => {
    setNames((prev) => {
      if (prev.length <= 1) return prev;
      let next;
      do { next = shuffle([...prev]); }
      while (prev.length > 1 && next.every((n, i) => n === prev[i]));
      return next;
    });
  };

  const canStart = names.every((n) => n.trim().length > 0);

  // Bouw teams array: [{ name: "Team 1", players: [...] }, ...]
  const buildTeams = () => {
    if (!teamMode) return null;
    const trimmed = names.map((n) => n.trim());
    const result = [];
    let offset = 0;
    for (let t = 0; t < count; t++) {
      result.push({
        name: `Team ${t + 1}`,
        players: trimmed.slice(offset, offset + teamSizes[t]),
      });
      offset += teamSizes[t];
    }
    return result;
  };

  const nonAllIds = CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);
  const allSelected = nonAllIds.every((id) => selectedCategories.has(id));

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => {
      if (id === "all") {
        // Alles aan als nog niet alles aan, anders alles uit
        return allSelected ? new Set() : new Set(CATEGORIES.map((c) => c.id));
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      next.delete("all");
      return next;
    });
  };

  const handleStart = () => {
    if (!canStart) return;
    const trimmed = names.map((n) => n.trim());
    onStart(trimmed, roundTime, buildTeams(), selectedCategories);
  };

  // Bereken naam-offset per team
  const getTeamOffset = (t) => teamSizes.slice(0, t).reduce((a, b) => a + b, 0);

  return (
    <div className="screen setup-screen">
      <div className="setup-card">
        <div className="logo-area">
          <div className="logo-icon">💬</div>
          <h1 className="logo-title">WoordenRaad</h1>
          <p className="logo-sub">Het raad- en uitbeeldspel</p>
        </div>

        <div className="setup-section">
          <div className="names-label-row">
            <label className="setup-label">{teamMode ? "Aantal teams" : "Aantal spelers"}</label>
            <button
              className={`randomize-btn${teamMode ? " randomize-btn-active" : ""}`}
              onClick={toggleTeamMode}
              title="Schakel team-modus in of uit"
            >
              {teamMode ? "👥 Teams" : "👤 Singles"}
            </button>
          </div>
          <div className="time-control">
            <button className="time-btn" onClick={() => updateCount(count - 1)} disabled={count <= 2}>−</button>
            <span className="time-display">{count}</span>
            <button className="time-btn" onClick={() => updateCount(count + 1)} disabled={teamMode ? count >= 10 : count >= 20}>+</button>
          </div>
        </div>

        <div className="setup-section">
          <div className="names-label-row">
            <label className="setup-label">Namen van spelers</label>
            {!teamMode && (
              <button className="randomize-btn" onClick={randomizeNames} title="Volgorde door elkaar gooien">
                Andere volgorde
              </button>
            )}
          </div>
          {teamMode ? (
            <div className="teams-grid">
              {Array.from({ length: count }, (_, t) => {
                const offset = getTeamOffset(t);
                const size = teamSizes[t];
                return (
                  <div key={t} className="team-block">
                    <div className="team-block-header">
                      <span>Team {t + 1}</span>
                      <div className="team-size-controls">
                        {size > 2 && (
                          <button className="team-size-btn team-size-remove" onClick={() => removePlayerFromTeam(t)} title="Speler verwijderen">−1</button>
                        )}
                        <button className="team-size-btn team-size-add" onClick={() => addPlayerToTeam(t)} title="Speler toevoegen">+1</button>
                      </div>
                    </div>
                    {Array.from({ length: size }, (_, p) => {
                      const idx = offset + p;
                      return (
                        <div key={idx} className="name-input-wrap">
                          <span className="name-num">{p + 1}</span>
                          <input
                            className="name-input"
                            placeholder={`Speler ${p + 1}`}
                            value={names[idx] ?? ""}
                            onChange={(e) => updateName(idx, e.target.value)}
                            maxLength={16}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="names-grid">
              {names.map((name, i) => (
                <div key={i} className="name-input-wrap">
                  <span className="name-num">{i + 1}</span>
                  <input
                    className="name-input"
                    placeholder={`Speler ${i + 1}`}
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                    maxLength={16}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="setup-section">
          <div className="names-label-row">
            <label className="setup-label">Categorieën</label>
            <button
              className={`randomize-btn${allSelected ? " randomize-btn-active" : ""}`}
              onClick={() => toggleCategory("all")}
              title={allSelected ? "Deselecteer alle categorieën" : "Selecteer alle categorieën"}
            >
              🎲 Alles
            </button>
          </div>
          <div className="category-grid">
            {CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => (
              <button
                key={cat.id}
                className={`category-btn${selectedCategories.has(cat.id) ? " category-btn-active" : ""}`}
                onClick={() => toggleCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <label className="setup-label">Tijd per ronde</label>
          <div className="time-control">
            <button
              className="time-btn"
              onClick={() => setRoundTime((t) => Math.max(30, t - 30))}
              disabled={roundTime <= 30}
            >−30s</button>
            <span className="time-display">{roundTime}s</span>
            <button
              className="time-btn"
              onClick={() => setRoundTime((t) => t + 30)}
            >+30s</button>
          </div>
        </div>

        <button
          className={`start-btn ${canStart ? "ready" : ""}`}
          onClick={handleStart}
          disabled={!canStart}
        >
          Spel starten →
        </button>
      </div>
    </div>
  );
}

function HandoffScreen({ player, teamName, onReady }) {
  return (
    <div className="screen handoff-screen">
      <div className="handoff-card">
        <div className="handoff-icon">📱</div>
        <p className="handoff-sub">Geef de telefoon aan</p>
        <h2 className="handoff-name">{player}</h2>
        {teamName && <p className="handoff-team">{teamName}</p>}
        <p className="handoff-tip">De andere spelers kijken weg!</p>
        <button className="handoff-btn" onClick={onReady}>
          Ik ben klaar — start ronde!
        </button>
      </div>
    </div>
  );
}

// Berichten op basis van prestatie: enthousiast (goed) vs bemoedigend (matig/slecht)
// Tier wordt bepaald door: woorden per seconde t.o.v. een streefsnelheid van ~1 woord per 6s
// ratio = correct / (roundTime / 6)  →  >= 0.75 = goed, < 0.4 = slecht, daartussen = aardig

const w = (n) => n === 1 ? "woord" : "woorden";
const pt = (n) => n === 1 ? "punt" : "punten";

const MESSAGES_GREAT = [
  () => `Wat een enorme prestatie! 🏆`,
  () => `Jij verdient een sticker! ⭐`,
  () => `De rest is onder de indruk. 😎`,
  () => `De anderen beven van angst. 🫨`,
  () => `Je staat in vuur en vlam! 🔥`,
  () => `Je bent niet te stoppen! 🚀`,
  () => `De rest kan wel inpakken! 😄`,
  () => `Heb jij dit zitten oefen? 🤨`,
];

const MESSAGES_OK = [
  (n) => `${n} ${w(n)}, lekker bezig! 🙌`,
  (n) => `${n} ${w(n)}, niet slecht! 👍`,
  (n) => `${n} ${pt(n)} op de teller. ✅`,
  (n) => `${n} ${w(n)} goed geraden! 🥳`,
  (n) => `${n} ${pt(n)} erbij geknalt! 💥`,
  (n) => `${n} ${pt(n)} bijgeschreven! ✍️`,
  (n) => `${n} ${w(n)} in één ronde! 🤩`,
  (n) => `${n} ${w(n)}, ga zo door! 💪`,
];

const MESSAGES_POOR = [
  () => `Ik weet niet of dit nog goed komt! 😅`,
  (n) => `${n} ${w(n)}. Volgende keer beter! 🙈`,
  (n) => `${n} ${w(n)}. Haal even rustig adem! 😮‍💨`,
  () => `De volgende ronde gaat beter, toch? 😉`,
  () => `De andere spelers ruiken bloed! 🩸`,
  () => `De spanning zat er zeker in! 😅`,
];

function getRandomEndMessage(correctCount, roundTime) {
  const ratio = roundTime > 0 ? correctCount / (roundTime / 6) : 0;
  const [pool, tier] =
    ratio >= 0.75 ? [MESSAGES_GREAT, "great"] :
    ratio >= 0.5  ? [MESSAGES_OK,    "ok"]    :
                    [MESSAGES_POOR,  "poor"];
  const idx = Math.floor(Math.random() * pool.length);
  return { message: pool[idx](correctCount), tier, count: correctCount };
}

function RoundScreen({ player, words, onRoundEnd, roundTime }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0 });
  const endMessageRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(roundTime);
  const timeRemainingRef = useRef(roundTime);
  const [flash, setFlash] = useState(null); // "correct" | "skip" | "bonus"
  const [timesUp, setTimesUp] = useState(false);
  const timesUpRef = useRef(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const wordResultsRef = useRef([]); // [{word, guessed, isBonus}]
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, roundTime - elapsed);
      timeRemainingRef.current = remaining;
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timesUpRef.current = true;
        setTimesUp(true);
        // Stop eventuele lopende skip-penalty en beëindig de ronde direct
        if (penaltyRef.current) {
          clearInterval(penaltyRef.current);
          penaltyRef.current = null;
          skipPenaltyRef.current = 0;
          setSkipPenalty(0);
          finishRoundRef.current(scoresRef.current, wordIndexRef.current);
        }
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, []);

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 400);
  };

  const wordIndexRef = useRef(0);
  const [skipPenalty, setSkipPenalty] = useState(0);
  const penaltyRef = useRef(null);
  const skipPenaltyRef = useRef(0);

  const finishRound = useCallback((finalScores, finalWordIndex) => {
    endMessageRef.current = getRandomEndMessage(finalScores.correct, roundTime);
    setDone(true);
    setTimeout(() => onRoundEnd({ ...finalScores, wordsUsed: finalWordIndex, wordResults: wordResultsRef.current }), 2800);
  }, [onRoundEnd, roundTime]);

  // Ref naar finishRound zodat de timer-interval er altijd de actuele versie van kan aanroepen
  const finishRoundRef = useRef(finishRound);
  useEffect(() => { finishRoundRef.current = finishRound; }, [finishRound]);

  const correct = () => {
    if (done || skipPenaltyRef.current > 0) return;
    const word = words[wordIndexRef.current];
    const bonusPts = getBonusPoints(word);
    const isBonus = bonusPts > 0;
    triggerFlash(isBonus ? "bonus" : "correct");
    wordResultsRef.current.push({ word, guessed: true, isBonus, bonusPts });
    const newScores = { ...scoresRef.current, correct: scoresRef.current.correct + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    if (timesUpRef.current) {
      finishRound(newScores, wordIndexRef.current);
    }
  };

  const skip = () => {
    if (done || skipPenaltyRef.current > 0) return;
    const word = words[wordIndexRef.current];
    triggerFlash("skip");
    wordResultsRef.current.push({ word, guessed: false, isBonus: getBonusPoints(word) > 0, bonusPts: 0 });
    const newScores = { ...scoresRef.current, skipped: scoresRef.current.skipped + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    // Alleen penalty starten als tijd nog niet verstreken is
    if (timesUpRef.current) {
      finishRound(newScores, wordIndexRef.current);
      return;
    }
    skipPenaltyRef.current = 3;
    setSkipPenalty(3);
    let count = 3;
    penaltyRef.current = setInterval(() => {
      count -= 1;
      skipPenaltyRef.current = count;
      setSkipPenalty(count);
      if (count <= 0) {
        clearInterval(penaltyRef.current);
        penaltyRef.current = null;
        // Als tijd intussen is verlopen: ronde beëindigen, anders gewoon doorgaan
        if (timesUpRef.current) {
          finishRound(scoresRef.current, wordIndexRef.current);
        }
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(penaltyRef.current), []);

  const pct = timeRemaining / roundTime;
  const timeLeft = Math.round(timeRemaining);
  const timerColor = timesUp ? "#f87171" : timeLeft > 30 ? "#4ade80" : timeLeft > 10 ? "#fbbf24" : "#f87171";
  const circumference = 2 * Math.PI * 44;
  const currentWord = words[wordIndex];
  const currentBonusPts = currentWord ? getBonusPoints(currentWord) : 0;
  const isCurrentBonus = currentBonusPts > 0;

  return (
    <div className={`screen round-screen ${flash ? `flash-${flash}` : ""} ${done ? "round-done" : ""}`}>
      <div className="round-top">
        <span className="round-player">{player}</span>
        <div className="timer-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8"/>
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={timesUp ? circumference : circumference * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke 0.5s" }}
            />
            <text x="50" y="56" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="inherit"
              className={timesUp ? "timer-ring" : ""}>
              {timesUp ? "⏰" : timeLeft}
            </text>
          </svg>
        </div>
        <div className="round-stats">
          <span className="stat correct-stat">✓ {scores.correct}</span>
          <span className="stat skip-stat">↷ {scores.skipped}</span>
        </div>
      </div>

      <div className="word-stage">
        {done ? (
          (() => {
            const result = endMessageRef.current || getRandomEndMessage(scores.correct, roundTime);
            const n = result.count;
            return (
              <div className="word-done-wrap">
                <div className="word-done-count">{n} {w(n)} goed geraden</div>
                <div className={`word-done-msg tier-${result.tier}`}>{result.message}</div>
              </div>
            );
          })()
        ) : skipPenalty > 0 ? (
          <div className="penalty-wrap">
            <div className="penalty-label">⏭️ Overgeslagen</div>
            <div className="penalty-bar-track">
              <div className="penalty-bar-fill" />
            </div>
            <div className="penalty-sublabel">Volgende woord zo meteen…</div>
          </div>
        ) : (
          <>
            <div className="word-anchor">
              <div className="word-counter">woord {wordIndex + 1}</div>
              <div className={`current-word${isCurrentBonus ? " bonus-word" : ""}`}>{currentWord ?? "— geen woorden meer —"}</div>
              <div className={`times-up-banner${isCurrentBonus && !timesUp ? ' bonus-banner' : ''}`} style={{visibility: (timesUp || isCurrentBonus) ? 'visible' : 'hidden'}}>
                {timesUp ? '⏰ Tijd is om — maak dit woord nog af!' : `⭐ BONUSSPREEKWOORD — 3 punten!`}
              </div>
            </div>
          </>
        )}
      </div>

      {!done && (
        <div className="action-row">
          <button className={`action-btn skip-btn ${skipPenalty > 0 ? "btn-disabled" : ""}`} onClick={skip}>
            <span className="btn-icon">↷</span>
            <span className="btn-label">Sla over</span>
          </button>
          <button className={`action-btn correct-btn ${skipPenalty > 0 ? "btn-disabled" : ""}`} onClick={correct}>
            <span className="btn-icon">✓</span>
            <span className="btn-label">Goed geraden!</span>
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreScreen({ players, scores, currentRound, totalRounds, onNext, onRestart, onContinue, onShowStats, teams, teamScores }) {
  const isLast = currentRound >= totalRounds;

  // Team mode: sorteer teams op gemiddelde score per speler
  const sortedTeams = teams
    ? [...teams]
        .map((t, i) => ({
          ...t,
          totalScore: teamScores[i],
          avgScore: Math.round((teamScores[i] / t.players.length) * 10) / 10,
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
    : null;

  // Individueel: sorteer spelers op score
  const sortedPlayers = !teams
    ? [...players].map((p, i) => ({ name: p, score: scores[i] })).sort((a, b) => b.score - a.score)
    : null;

  return (
    <div className="screen score-screen">
      <div className="score-card">
        <h2 className="score-title">{isLast ? "🏆 Eindstand" : `Stand na ronde ${currentRound}`}</h2>
        <div className="scores-list">
          {sortedTeams
            ? sortedTeams.map((team, i) => (
                <div key={team.name} className={`score-row rank-${i + 1}`}>
                  <span className="rank-badge">{i === 0 ? "👑" : i + 1}</span>
                  <div className="score-name-block">
                    <span className="score-name">{team.name}</span>
                    <span className="score-members">{team.players.join(", ")}</span>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <span className="score-pts">{team.avgScore} pt</span>
                    <div style={{fontSize:'11px', opacity:0.5, marginTop:'2px'}}>gem. per speler · totaal {team.totalScore}</div>
                  </div>
                </div>
              ))
            : sortedPlayers.map((p, i) => (
                <div key={p.name} className={`score-row rank-${i + 1}`}>
                  <span className="rank-badge">{i === 0 ? "👑" : i + 1}</span>
                  <span className="score-name">{p.name}</span>
                  <span className="score-pts">{p.score} pt</span>
                </div>
              ))
          }
        </div>
        {isLast ? (
          <div className="final-btns">
            <button className="score-btn stats-btn" onClick={onShowStats}>
              📊 Statistieken bekijken
            </button>
            <button className="score-btn continue-btn" onClick={onContinue}>
              Nog een ronde! →
            </button>
            <button className="score-btn restart-btn" onClick={onRestart}>
              Nieuw spel
            </button>
          </div>
        ) : (
          <button className="score-btn next-btn" onClick={onNext}>
            Volgende speler →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Stats Screen ─────────────────────────────────────────────────────────────

function StatsScreen({ players, playerStats, scores, onRestart, onContinue }) {
  const [activePlayer, setActivePlayer] = useState(0);

  const ps = playerStats[activePlayer];
  if (!ps) return null;

  const allRounds = ps.rounds;
  const totalCorrect = allRounds.reduce((s, r) => s + r.correct, 0);
  const totalSkipped = allRounds.reduce((s, r) => s + r.skipped, 0);
  const totalBonus = allRounds.reduce((s, r) => s + (r.bonusPoints || 0), 0);
  const totalSeen = totalCorrect + totalSkipped;
  const skipRatio = totalSeen > 0 ? Math.round((totalSkipped / totalSeen) * 100) : 0;

  const bestRound = allRounds.reduce((best, r, i) => (r.correct > (best?.correct ?? -1) ? { ...r, idx: i } : best), null);

  const allWordResults = allRounds.flatMap(r => r.wordResults || []);
  const guessedWords = allWordResults.filter(w => w.guessed);
  const skippedWords = allWordResults.filter(w => !w.guessed);

  return (
    <div className="screen stats-screen">
      <div className="stats-card">
        <h2 className="score-title">📊 Statistieken</h2>

        {/* Player tabs */}
        <div className="stats-tabs">
          {players.map((p, i) => (
            <button
              key={i}
              className={`stats-tab${activePlayer === i ? " stats-tab-active" : ""}`}
              onClick={() => setActivePlayer(i)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="stats-player-name">{players[activePlayer]}</div>
        <div className="stats-total-score">{scores[activePlayer]} punten totaal</div>

        {/* Overview grid */}
        <div className="stats-grid">
          <div className="stats-cell">
            <div className="stats-cell-val">{totalCorrect}</div>
            <div className="stats-cell-lbl">✓ Geraden</div>
          </div>
          <div className="stats-cell">
            <div className="stats-cell-val">{totalSkipped}</div>
            <div className="stats-cell-lbl">↷ Geskipt</div>
          </div>
          <div className="stats-cell">
            <div className="stats-cell-val">{skipRatio}%</div>
            <div className="stats-cell-lbl">Skip-ratio</div>
          </div>
          <div className="stats-cell stats-cell-gold">
            <div className="stats-cell-val">+{totalBonus}</div>
            <div className="stats-cell-lbl">⭐ Bonuspunten</div>
          </div>
        </div>

        {bestRound && (
          <div className="stats-best">
            🏅 Beste ronde: ronde {bestRound.idx + 1} — {bestRound.correct} woorden geraden
          </div>
        )}

        {/* Word lists */}
        <div className="stats-words-section">
          <div className="stats-words-col">
            <div className="stats-words-title stats-green">✓ Goed geraden ({guessedWords.length})</div>
            <div className="stats-words-list">
              {guessedWords.slice(0, 20).map((wr, i) => (
                <span key={i} className={`stats-word-chip${wr.isBonus ? " stats-word-bonus" : ""}`}>
                  {wr.word}{wr.isBonus ? " ⭐" : ""}
                </span>
              ))}
              {guessedWords.length > 20 && <span className="stats-word-more">+{guessedWords.length - 20} meer</span>}
            </div>
          </div>
          <div className="stats-words-col">
            <div className="stats-words-title stats-red">↷ Geskipt ({skippedWords.length})</div>
            <div className="stats-words-list">
              {skippedWords.slice(0, 20).map((wr, i) => (
                <span key={i} className="stats-word-chip stats-word-skipped">{wr.word}</span>
              ))}
              {skippedWords.length > 20 && <span className="stats-word-more">+{skippedWords.length - 20} meer</span>}
            </div>
          </div>
        </div>

        <div className="final-btns" style={{marginTop: 20}}>
          <button className="score-btn continue-btn" onClick={onContinue}>Nog een ronde! →</button>
          <button className="score-btn restart-btn" onClick={onRestart}>Nieuw spel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("setup"); // setup | handoff | round | score | stats
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [wordDeck, setWordDeck] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);
  const [teams, setTeams] = useState(null);
  const [teamScores, setTeamScores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  // playerStats: array of { rounds: [{correct, skipped, words:[{word,guessed}]}] }
  const [playerStats, setPlayerStats] = useState([]);

  const totalRounds = players.length;

  const getWordPool = (cats) => {
    const catSet = cats instanceof Set ? cats : new Set();
    const nonAll = CATEGORIES.filter((c) => c.id !== "all").map((c) => c.id);
    if (catSet.size === 0 || catSet.has("all") || nonAll.every((id) => catSet.has(id))) {
      return WORDS_BY_CATEGORY['all'];
    }
    const merged = new Set();
    for (const id of catSet) {
      const arr = WORDS_BY_CATEGORY[id];
      if (arr) arr.forEach((w) => merged.add(w));
    }
    return merged.size > 0 ? [...merged] : WORDS_BY_CATEGORY['all'];
  };

  const startGame = (names, time, teamsData, categories) => {
    const empty = Array(names.length).fill(0);
    setPlayers(names);
    setScores(empty);
    setCurrentPlayerIdx(0);
    setRoundNum(0);
    setUsedWords(new Set());
    setRoundTime(time);
    const catSet = categories instanceof Set ? categories : new Set(["all"]);
    setSelectedCategory(catSet);
    const pool = getWordPool(catSet);
    setWordDeck(shuffle(pool));
    setTeams(teamsData);
    setTeamScores(teamsData ? Array(teamsData.length).fill(0) : []);
    setPlayerStats(names.map(() => ({ rounds: [] })));
    const order = buildPlayOrder(teamsData, names.length);
    setPlayOrder(order);
    setPlayOrderPos(0);
    setCurrentPlayerIdx(order[0] ?? 0);
    setPhase("handoff");
  };

  // Speelvolgorde: in team modus afwisselend per team (A, B, S, C ipv A, S, B, C)
  // playOrder is een array van player-indices in de juiste volgorde
  const [playOrder, setPlayOrder] = useState([]);
  const [playOrderPos, setPlayOrderPos] = useState(0);

  const buildPlayOrder = (teamsData, totalPlayers) => {
    if (!teamsData) return Array.from({ length: totalPlayers }, (_, i) => i);
    // Bereken per team de absolute player-indices
    const teamPlayerIndices = [];
    let offset = 0;
    for (const team of teamsData) {
      teamPlayerIndices.push(team.players.map((_, i) => offset + i));
      offset += team.players.length;
    }
    // Interleave: ronde 0 → speler 0 van elk team, ronde 1 → speler 1 van elk team, etc.
    const maxSize = Math.max(...teamPlayerIndices.map(t => t.length));
    const order = [];
    for (let pos = 0; pos < maxSize; pos++) {
      for (const indices of teamPlayerIndices) {
        if (pos < indices.length) order.push(indices[pos]);
      }
    }
    return order;
  };

  // Helper: given a player index, find which team they belong to
  const getTeamIdxForPlayer = (playerIdx) => {
    if (!teams) return null;
    let offset = 0;
    for (let t = 0; t < teams.length; t++) {
      if (playerIdx < offset + teams[t].players.length) return t;
      offset += teams[t].players.length;
    }
    return null;
  };

  const onRoundEnd = ({ correct, skipped, wordsUsed, wordResults }) => {
    // wordResults: [{word, guessed, isBonus, bonusPts}]
    // spreekwoorden geven +2 extra (totaal 3)
    const bonusPoints = wordResults ? wordResults.filter(r => r.guessed).reduce((sum, r) => sum + (r.bonusPts || 0), 0) : 0;
    const totalPoints = correct + bonusPoints;

    const newScores = [...scores];
    newScores[currentPlayerIdx] += totalPoints;
    setScores(newScores);

    if (teams) {
      const teamIdx = getTeamIdxForPlayer(currentPlayerIdx);
      if (teamIdx !== null) {
        const newTeamScores = [...teamScores];
        newTeamScores[teamIdx] += totalPoints;
        setTeamScores(newTeamScores);
      }
    }

    // Track per-player stats
    const newPlayerStats = playerStats.map((ps, i) => {
      if (i !== currentPlayerIdx) return ps;
      return {
        ...ps,
        rounds: [...ps.rounds, { correct, skipped, bonusPoints, wordResults: wordResults || [] }]
      };
    });
    setPlayerStats(newPlayerStats);

    const newUsed = new Set(usedWords);
    wordDeck.slice(0, wordsUsed).forEach(w => newUsed.add(w));
    setUsedWords(newUsed);
    setRoundNum((r) => r + 1);
    setPhase("score");
  };

  const onNext = () => {
    const nextPos = (playOrderPos + 1) % playOrder.length;
    setPlayOrderPos(nextPos);
    setCurrentPlayerIdx(playOrder[nextPos]);
    const pool = getWordPool(selectedCategory);
    const available = pool.filter(w => !usedWords.has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : pool));
    setPhase("handoff");
  };

  const onContinue = () => {
    setPlayOrderPos(0);
    setCurrentPlayerIdx(playOrder[0] ?? 0);
    setRoundNum(0);
    const pool = getWordPool(selectedCategory);
    const available = pool.filter(w => !usedWords.has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : pool));
    setPhase("handoff");
  };

  const onRestart = () => {
    setPhase("setup");
    setPlayers([]);
    setScores([]);
    setTeams(null);
    setTeamScores([]);
    setPlayerStats([]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Righteous&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Nunito', sans-serif;
          background: #0f0a1e;
          min-height: 100vh;
          min-height: 100dvh;
          color: white;
          overflow-x: hidden;
          -webkit-text-size-adjust: 100%;
        }

        .screen {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        /* ── Background noise/grain ── */
        .screen::before {
          content: '';
          position: fixed; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, #3b1a6b 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 80% 80%, #1a3a6b 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 50%, #0f0a1e 0%, #0f0a1e 100%);
          z-index: 0;
        }

        .screen > * { position: relative; z-index: 1; }

        /* ── Setup ── */
        .setup-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 28px 20px;
          width: 100%;
          max-width: 480px;
          backdrop-filter: blur(20px);
          overflow: hidden;
        }

        .logo-area { text-align: center; margin-bottom: 36px; }
        .logo-icon { font-size: 52px; margin-bottom: 8px; }
        .logo-title {
          font-family: 'Righteous', cursive;
          font-size: 36px;
          background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-sub { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }

        .setup-section { margin-bottom: 28px; }
        .setup-label { display: block; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 12px; }

        .player-count-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .count-btn {
          width: 44px; height: 44px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-family: inherit;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
        }
        .count-btn:hover { border-color: #a78bfa; background: rgba(167,139,250,0.15); }
        .count-btn.active { background: #a78bfa; border-color: #a78bfa; color: #0f0a1e; }

        .names-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .names-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .names-label-row .setup-label { margin-bottom: 0; }
        .randomize-btn {
          background: rgba(167,139,250,0.15);
          color: #a78bfa;
          border: 1.5px solid rgba(167,139,250,0.35);
          border-radius: 10px;
          padding: 6px 12px;
          font-size: 13px;
          font-family: 'Righteous', cursive;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .randomize-btn:hover { background: rgba(167,139,250,0.28); transform: scale(1.04); }
        .name-input-wrap { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0 12px; transition: border-color 0.2s; }
        .name-input-wrap:focus-within { border-color: #a78bfa; }
        .name-num { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.3); min-width: 14px; }
        .name-input { flex: 1; background: none; border: none; outline: none; color: white; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 0; }
        .name-input::placeholder { color: rgba(255,255,255,0.25); }

        .start-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: none;
          font-family: 'Righteous', cursive;
          font-size: 20px;
          letter-spacing: 0.04em;
          cursor: pointer;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          transition: all 0.25s;
          margin-top: 4px;
        }
        .time-control { display: flex; align-items: center; gap: 12px; }
        .time-btn {
          width: 64px; height: 44px;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
        }
        .time-btn:hover:not(:disabled) { border-color: #a78bfa; background: rgba(167,139,250,0.15); }
        .time-btn:disabled { opacity: 0.3; cursor: default; }
        .time-display {
          flex: 1;
          text-align: center;
          font-family: 'Righteous', cursive;
          font-size: 24px;
          color: #a78bfa;
        }

        .start-btn.ready {
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          color: white;
          box-shadow: 0 8px 32px rgba(167,139,250,0.35);
        }
        .start-btn.ready:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(167,139,250,0.5); }

        /* ── Handoff ── */
        .handoff-screen { background: none; }
        .handoff-card {
          text-align: center;
          padding: 40px 24px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(20px);
        }
        .handoff-icon { font-size: 52px; margin-bottom: 16px; animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .handoff-sub { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; margin-bottom: 10px; }
        .handoff-name { font-family: 'Righteous', cursive; font-size: clamp(28px, 8vw, 42px); color: #a78bfa; margin-bottom: 16px; word-break: break-word; }
        .handoff-team { font-size: 13px; color: #34d399; font-weight: 800; letter-spacing: 0.06em; margin-top: -10px; margin-bottom: 16px; }
        .handoff-tip { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 28px; }
        .handoff-btn {
          padding: 16px 32px;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          color: white;
          font-family: 'Righteous', cursive;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 6px 24px rgba(167,139,250,0.4);
        }
        .handoff-btn:hover { transform: translateY(-2px); }

        /* ── Round ── */
        .round-screen {
          flex-direction: column;
          background: none;
          transition: background 0.2s;
          padding-top: max(28px, env(safe-area-inset-top));
        }
        .round-screen.flash-correct { animation: flashGreen 0.4s ease; }
        .round-screen.flash-skip { animation: flashOrange 0.4s ease; }
        @keyframes flashGreen { 0%{background:rgba(74,222,128,0.3)} 100%{background:transparent} }
        @keyframes flashOrange { 0%{background:rgba(251,191,36,0.2)} 100%{background:transparent} }
        .round-screen.round-done { opacity: 0.6; }

        .round-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 520px;
          padding: 28px 0 12px;
          gap: 8px;
          flex-shrink: 0;
          position: relative;
        }

        .round-player { font-family: 'Righteous', cursive; font-size: clamp(14px, 4vw, 20px); color: #a78bfa; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .timer-wrap { position: absolute; left: 50%; transform: translateX(-50%); flex-shrink: 0; }

        .round-stats { display: flex; gap: 8px; flex-shrink: 0; margin-left: auto; }
        .stat { font-size: 14px; font-weight: 800; padding: 5px 10px; border-radius: 20px; white-space: nowrap; }
        .correct-stat { background: rgba(74,222,128,0.2); color: #4ade80; }
        .skip-stat { background: rgba(251,191,36,0.15); color: #fbbf24; }

        .word-stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 520px;
          width: 100%;
          gap: 0;
          padding: 20px;
        }

        .word-anchor {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .word-counter { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px; }

        .current-word {
          font-family: 'Righteous', cursive;
          font-size: clamp(38px, 11vw, 80px);
          background: linear-gradient(135deg, #f9fafb, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
          animation: wordIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: manual;
          -webkit-hyphens: manual;
          max-width: 100%;
          padding: 0 8px;
        }
        @keyframes wordIn { from{transform:scale(0.7) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }


        .penalty-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .penalty-label {
          font-family: 'Righteous', cursive;
          font-size: clamp(15px, 4vw, 18px);
          color: #fbbf24;
          letter-spacing: 0.04em;
        }
        .penalty-bar-track {
          width: 220px;
          height: 6px;
          background: rgba(251,191,36,0.15);
          border-radius: 3px;
          overflow: hidden;
        }
        .penalty-bar-fill {
          height: 100%;
          background: #fbbf24;
          border-radius: 3px;
          width: 100%;
          animation: penalty-drain 3s linear forwards;
        }
        @keyframes penalty-drain {
          from { width: 100%; }
          to   { width: 0%; }
        }
        .penalty-sublabel {
          font-size: clamp(12px, 3vw, 14px);
          color: rgba(255,255,255,0.45);
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .btn-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
        .times-up-banner {
          font-family: 'Righteous', cursive;
          font-size: clamp(13px, 3.5vw, 16px);
          color: #f87171;
          background: rgba(248,113,113,0.12);
          border: 1.5px solid rgba(248,113,113,0.35);
          border-radius: 12px;
          padding: 8px 16px;
          text-align: center;
          min-height: 40px;
          margin-top: 20px;
          animation: pulse-red-banner 1.2s ease-in-out infinite;
        }
        @keyframes pulse-red-banner {
          0%, 100% { box-shadow: 0 0 6px rgba(248,113,113,0.4); }
          50% { box-shadow: 0 0 14px rgba(248,113,113,0.8); }
        }
        .times-up-banner.bonus-banner {
          color: #fbbf24;
          background: rgba(251,191,36,0.12);
          border-color: rgba(251,191,36,0.35);
          animation: pulse-gold-banner 1.2s ease-in-out infinite;
        }
        @keyframes pulse-gold-banner {
          0%, 100% { box-shadow: 0 0 6px rgba(251,191,36,0.4); }
          50% { box-shadow: 0 0 14px rgba(251,191,36,0.8); }
        }
        .word-done-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: -80px; }
        .word-done-count { font-size: clamp(18px, 5vw, 26px); color: rgba(255,255,255,0.6); font-family: 'Righteous', cursive; letter-spacing: 0.03em; }
        .word-done-msg { font-family: 'Righteous', cursive; font-size: clamp(36px, 10vw, 72px); text-align: center; word-break: break-word; line-height: 1.15; }
        .word-done-msg.tier-poor { color: #f87171; }
        .word-done-msg.tier-ok { color: #fbbf24; }
        .word-done-msg.tier-great { color: #4ade80; }
        @keyframes pulse { from{transform:scale(1)} to{transform:scale(1.06)} }
        .timer-ring { animation: ring 0.5s infinite; transform-origin: 50px 50px; }
        @keyframes ring {
          0%   { transform: rotate(0deg); }
          15%  { transform: rotate(18deg); }
          30%  { transform: rotate(-16deg); }
          45%  { transform: rotate(14deg); }
          60%  { transform: rotate(-10deg); }
          75%  { transform: rotate(6deg); }
          90%  { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }

        .action-row {
          display: flex;
          gap: 12px;
          width: 100%;
          max-width: 520px;
          padding: 0 0 max(24px, env(safe-area-inset-bottom));
          flex-shrink: 0;
        }

        .action-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 20px 12px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-family: 'Righteous', cursive;
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          -webkit-tap-highlight-color: transparent;
          min-width: 0;
        }
        .action-btn:focus { outline: none; }
        .action-btn:active { transform: scale(0.93); }
        .btn-icon { font-size: 28px; }
        .btn-label { font-size: clamp(13px, 3.5vw, 16px); white-space: nowrap; }

        .skip-btn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 2px solid rgba(251,191,36,0.3); }
        .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 2px solid rgba(74,222,128,0.35); }

        @media (hover: hover) {
          .skip-btn:hover { background: rgba(251,191,36,0.25); }
          .correct-btn:hover { background: rgba(74,222,128,0.35); }
        }

        .randomize-btn-active {
          background: rgba(52,211,153,0.2);
          color: #34d399;
          border-color: rgba(52,211,153,0.45);
        }
        .randomize-btn-active:hover { background: rgba(52,211,153,0.32) !important; }

        .teams-grid { display: flex; flex-direction: column; gap: 14px; }
        .team-block {
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 12px 14px;
        }
        .team-block-header {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .team-size-controls { display: flex; gap: 6px; }
        .team-size-btn {
          padding: 3px 10px;
          border-radius: 8px;
          border: 1.5px solid rgba(167,139,250,0.35);
          background: rgba(167,139,250,0.12);
          color: #a78bfa;
          font-size: 12px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1.4;
        }
        .team-size-btn:hover { background: rgba(167,139,250,0.25); }
        .team-size-remove { border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.1); color: #fbbf24; }
        .team-size-remove:hover { background: rgba(251,191,36,0.22); }

        .team-block .name-input-wrap { margin-bottom: 6px; }
        .team-block .name-input-wrap:last-child { margin-bottom: 0; }

        .score-name-block { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
        .score-members { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        
        .score-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 28px 20px;
          width: 100%;
          max-width: 440px;
          backdrop-filter: blur(20px);
          overflow: hidden;
        }
        .score-title { font-family: 'Righteous', cursive; font-size: clamp(22px, 6vw, 28px); text-align: center; margin-bottom: 20px; }
        .scores-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .score-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.07);
          animation: slideIn 0.4s ease both;
        }
        .score-row.rank-1 { background: rgba(167,139,250,0.15); border-color: rgba(167,139,250,0.4); }
        @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
        .score-row:nth-child(1){animation-delay:0.05s}
        .score-row:nth-child(2){animation-delay:0.1s}
        .score-row:nth-child(3){animation-delay:0.15s}
        .score-row:nth-child(4){animation-delay:0.2s}
        .score-row:nth-child(5){animation-delay:0.25s}
        .score-row:nth-child(6){animation-delay:0.3s}

        .rank-badge { font-size: 18px; min-width: 26px; text-align: center; flex-shrink: 0; }
        .score-name { flex: 1; font-size: clamp(14px, 4vw, 18px); font-weight: 700; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .score-pts { font-family: 'Righteous', cursive; font-size: clamp(16px, 4vw, 20px); color: #a78bfa; flex-shrink: 0; }

        .score-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: none;
          font-family: 'Righteous', cursive;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .next-btn { background: linear-gradient(135deg, #a78bfa, #60a5fa); color: white; box-shadow: 0 6px 24px rgba(167,139,250,0.35); }
        .next-btn:hover { transform: translateY(-2px); }
        .restart-btn { background: rgba(255,255,255,0.1); color: white; border: 1.5px solid rgba(255,255,255,0.2); }
        .restart-btn:hover { background: rgba(255,255,255,0.15); }
        .continue-btn { background: linear-gradient(135deg, #34d399, #60a5fa); color: white; box-shadow: 0 6px 24px rgba(52,211,153,0.35); margin-bottom: 10px; }
        .continue-btn:hover { transform: translateY(-2px); }
        .stats-btn { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #1a1a1a; box-shadow: 0 6px 24px rgba(251,191,36,0.35); margin-bottom: 10px; }
        .stats-btn:hover { transform: translateY(-2px); }
        .final-btns { display: flex; flex-direction: column; }

        /* ── Category picker ── */
        .category-grid {
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .category-btn {
          padding: 6px 12px; border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          font-size: 12px; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: all 0.15s;
          user-select: none;
        }
        .category-btn:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); }
        .category-btn-active {
          background: rgba(167,139,250,0.28);
          border-color: rgba(167,139,250,0.75);
          color: #c4b5fd;
          box-shadow: 0 0 0 2px rgba(167,139,250,0.18);
        }
        .category-btn-active:hover {
          background: rgba(167,139,250,0.38);
        }

        /* ── Bonus word ── */
        .bonus-badge {
          font-size: 12px; font-weight: 800; letter-spacing: 0.06em;
          color: #fbbf24;
          background: rgba(251,191,36,0.12);
          border: 1.5px solid rgba(251,191,36,0.35);
          border-radius: 12px; padding: 4px 12px;
          text-align: center; margin-bottom: 8px;
          animation: pulse-gold 1.2s ease-in-out infinite;
        }
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
        .current-word.bonus-word {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .flash-bonus { animation: flash-bonus-anim 0.4s ease; }
        @keyframes flash-bonus-anim {
          0% { background: rgba(251,191,36,0); }
          30% { background: rgba(251,191,36,0.2); }
          100% { background: rgba(251,191,36,0); }
        }

        /* ── Stats screen ── */
        .stats-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px; padding: 28px 20px;
          width: 100%; max-width: 480px;
          backdrop-filter: blur(20px);
          overflow-y: auto; max-height: 92vh;
        }
        .stats-tabs {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
        }
        .stats-tab {
          padding: 6px 14px; border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .stats-tab-active {
          background: rgba(167,139,250,0.25);
          border-color: rgba(167,139,250,0.6); color: #a78bfa;
        }
        .stats-player-name {
          font-family: 'Righteous', cursive; font-size: 22px; margin-bottom: 2px;
        }
        .stats-total-score {
          color: #a78bfa; font-size: 14px; font-weight: 700; margin-bottom: 16px;
        }
        .stats-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-bottom: 14px;
        }
        .stats-cell {
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 12px;
          text-align: center;
        }
        .stats-cell-gold { border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.08); }
        .stats-cell-val { font-family: 'Righteous', cursive; font-size: 26px; }
        .stats-cell-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 2px; }
        .stats-best {
          font-size: 13px; font-weight: 700; color: #fbbf24;
          background: rgba(251,191,36,0.1); border: 1.5px solid rgba(251,191,36,0.25);
          border-radius: 12px; padding: 10px 14px; margin-bottom: 14px;
        }
        .stats-words-section { display: flex; gap: 10px; margin-bottom: 4px; }
        .stats-words-col { flex: 1; min-width: 0; }
        .stats-words-title { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .stats-green { color: #4ade80; }
        .stats-red { color: #f87171; }
        .stats-words-list { display: flex; flex-wrap: wrap; gap: 4px; }
        .stats-word-chip {
          font-size: 11px; font-weight: 700; padding: 3px 8px;
          border-radius: 10px; background: rgba(74,222,128,0.1);
          border: 1px solid rgba(74,222,128,0.25); color: #4ade80;
        }
        .stats-word-bonus { background: rgba(251,191,36,0.12); border-color: rgba(251,191,36,0.4); color: #fbbf24; }
        .stats-word-skipped { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.25); color: #f87171; }
        .stats-word-more { font-size: 11px; color: rgba(255,255,255,0.4); align-self: center; }

        @media (max-width: 380px) {
          .names-grid { grid-template-columns: 1fr; }
          .logo-title { font-size: 28px; }
          .timer-wrap svg { width: 80px; height: 80px; }
        }
        @media (max-height: 680px) {
          .handoff-card { padding: 28px 20px; }
          .handoff-icon { font-size: 40px; margin-bottom: 10px; }
          .word-stage { gap: 10px; padding: 12px; }
        }
      `}</style>

      {phase === "setup" && <SetupScreen onStart={startGame} />}

      {phase === "handoff" && (
        <HandoffScreen
          player={players[currentPlayerIdx]}
          teamName={teams ? teams[getTeamIdxForPlayer(currentPlayerIdx)]?.name : null}
          onReady={() => setPhase("round")}
        />
      )}

      {phase === "round" && (
        <RoundScreen
          key={`${currentPlayerIdx}-${roundNum}`}
          player={players[currentPlayerIdx]}
          words={wordDeck}
          onRoundEnd={onRoundEnd}
          roundTime={roundTime}
        />
      )}

      {phase === "score" && (
        <ScoreScreen
          players={players}
          scores={scores}
          currentRound={roundNum}
          totalRounds={totalRounds}
          onNext={onNext}
          onRestart={onRestart}
          onContinue={onContinue}
          onShowStats={() => setPhase("stats")}
          teams={teams}
          teamScores={teamScores}
        />
      )}

      {phase === "stats" && (
        <StatsScreen
          players={players}
          playerStats={playerStats}
          scores={scores}
          onRestart={onRestart}
          onContinue={onContinue}
        />
      )}
    </>
  );
}
