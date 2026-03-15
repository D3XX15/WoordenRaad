import { useState, useEffect, useRef } from "react";

// ── Categorieën ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "dieren",        label: "🐶 Dieren" },
  { id: "voedsel",       label: "🍕 Eten & Drinken" },
  { id: "sport",         label: "⚽ Sport & Hobby" },
  { id: "acties",        label: "🏃 Werkwoorden" },
  { id: "beroepen",      label: "👷 Beroepen" },
  { id: "plaatsen",      label: "🧭 Plaatsen" },
  { id: "vervoer",       label: "🚗 Vervoer" },
  { id: "huishouden",    label: "🏠 Huishouden" },
  { id: "natuur",        label: "🌿 Natuur" },
  { id: "muziek",        label: "🎤 Muziek" },
  { id: "objecten",      label: "📦 Objecten" },
  { id: "militair",      label: "🪖 Militair" },
  { id: "ruimte",        label: "🚀 Ruimte" },
  { id: "wetenschap",    label: "🔬 Wetenschap" },
  { id: "gereedschap",   label: "🔧 Gereedschap" },
  { id: "politiek",      label: "⚖️ Politiek" },
  { id: "landen",        label: "🌍 Landen" },
  { id: "spreekwoorden", label: "💬 Spreekwoorden", bonus: true },
];

// WORDS_BY_CATEGORY maps category id → word array
const WORDS_BY_CATEGORY = (() => {
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
    'soufflé', 'spaghetti', 'spek', 'spinazie', 'stamppot', 'stoofpot',
    'strudel', 'suiker', 'sushi', 'taart', 'taco', 'tapenade',
    'tartaar', 'teriyaki', 'thee', 'tiramisu', 'toast', 'tomatensaus',
    'tomatensoep', 'tompouce', 'tortilla', 'truffel', 'ui',
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
    'voetbalcoach', 'cowboy', 'croupier', 'danser', 'dansleraar', 'data-analist',
    'dermatoloog', 'detective', 'dierenarts', 'dierentrainer', 'diplomaat', 'documentairemaker',
    'dokter', 'dronepiloot', 'duikinstructeur', 'econoom', 'ethisch hacker', 'examinator',
    'farmaceut', 'filosoof', 'fotograaf', 'fysiotherapeut', 'gameontwikkelaar', 'gastronoom',
    'geograaf', 'geoloog', 'gids', 'glazenwasser', 'goochelaar', 'grafisch ontwerper',
    'gynaecoloog', 'handelaar', 'heks', 'hersenchirurg', 'hovenier', 'hypnotherapeut',
    'ijsbeeldhouwer', 'illustrator', 'immunoloog', 'informaticus', 'ingenieur', 'inspecteur',
    'jager', 'jongleur', 'journalist', 'juwelier',
    'kapitein', 'kapper', 'kassière', 'kinderarts', 'klusjesman', 'kok',
    'kostuumontwerper', 'kraamverzorger', 'kruidenier', 'kunstcriticus', 'kunstenaar', 'kweker',
    'laborant', 'lasser', 'leraar', 'loodgieter', 'luchtverkeersleider', 'magiër',
    'makelaar', 'matroos', 'meteoroloog', 'microbioloog', 'modeontwerper',
    'moleculair bioloog', 'monteur', 'museumconservator', 'neuroloog', 'notaris', 'ontwerper',
    'oogarts', 'opticien', 'orthopeed', 'piloot', 'piraat', 'politicoloog',
    'politieagent', 'postbode', 'producent', 'profvoetballer', 'psychiater', 'psycholoog',
    'radioloog', 'rechercheur', 'revalidatiearts', 'scenarioschrijver', 'schappenvuller',
    'scheikundige', 'schilder', 'schildwacht', 'schoonmaker', 'schrijver', 'sheriff',
    'skateboarder', 'slager', 'socioloog', 'sommelier', 'stadsplanner', 'stand-upcomedian',
    'steward', 'strateeg', 'stratenmaker', 'stuntman', 'systeembeheerder',
    'tatoeëerder', 'taxichauffeur', 'taxidermist', 'timmerman', 'tolk', 'tovenaar',
    'toxicoloog', 'trainer', 'tuinman', 'verpleegkundige', 'verzekeringsagent', 'vioolmaker',
    'visser', 'vliegtuigbouwer', 'voedingswetenschapper', 'vuilnisman', 'wetenschapper', 'wijnboer',
    'winkelier', 'wiskundige', 'woordvoerder', 'zeebioloog', 'zeiler', 'ziekenhuisdirecteur',
    'aannemer', 'beeldhouwer', 'burgemeester', 'cabaretier', 'ijsverkoper', 'kaarsenmaker',
    'predikant', 'reddingswerker', 'straatveger', 'trambestuurder', 'vrijwilliger',
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
    'trampoline', 'fotograferen', 'vogelspotten', 'stoepkrijten',
    'borduren', 'breien', 'haakwerk', 'handwerken', 'origami',
    'pottenbakken', 'weven', 'lego', 'gezelschapsspel', 'escaperoom',
    'lasergame', 'beachtennis', 'langlaufen', 'kleiduivenschieten',
    'halfpipe', 'rolstoelbasketbal', 'dansen', 'salsadansen', 'linedance', 'volksdansen',
    'kampvuur maken', 'boogschieten', 'survivallen', 'kajakken', 'raften', 'skateboarden',
    'windsurfen', 'jagen', 'snorkelen', 'estafettelopen', 'fierljeppen', 'kogelslingeren',
    'puzzelen', 'bordspel', 'videospellen', 'kamperen', 'crossfit', 'boot camp',
    'spinning', 'kickboksen', 'speedklimmen', 'zaalvoetbal', 'rolstoeltennis', 'paragliding',
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
    'robot', 'rubberen eend', 'rugzak', 'sarcofaag', 'scheepsschroef', 'scheermes',
    'schijf van vijf', 'schilderij', 'schommel', 'speelgoed', 'sphinx', 'spijkerbroek',
    'springveer', 'stoommachine', 'tandenborstel', 'tandpasta', 'tent', 'tijdmachine',
    'toorts', 'tuinkabouter', 'tunnel', 'veiligheidsspeld', 'waaier',
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
    'aquarelverf', 'boetseerklei', 'naald', 'draad',
    'wol', 'haaknaald', 'breinaald',
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
    'wolk', 'woud', 'zandstorm', 'zee', 'zeewind', 'zomer', 'gewoontedier',
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
    'boot', 'brandweerwagen', 'bromfiets', 'bus', 'camper',
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
    'tankwagen', 'brandstoftanker', 'jacht', 'rubberboot', 'ongeluk',
    'kano', 'vlot', 'waterscooter', 'reddingsvlot', 'onderzeeër',
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
    'meubelboulevard', 'ophaalbrug', 'plattegrond', 'riolering', 'rotonde',
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
    'bewaken', 'bidden', 'blozen', 'branden', 'brengen', 'breken', 'buigen',
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
    'sluipen', 'brand blussen', 'eerste hulp verlenen', 'blindoeken', 'een geheim bewaren', 'inhalen',
    'misleiden', 'in de rij staan', 'op de vlucht zijn', 'rijbewijs halen', 'schipbreuk lijden', 'sleutels verliezen',
    'verslikken', 'hinkelen', 'touwtjesspringen', 'zwijgen', 'triomferen', 'takelen',
    'haasten', 'vervelen', 'achtervolgen', 'bazelen',
    'bedanken', 'begroeten', 'beschermen', 'bewonderen', 'boeren', 'controleren',
    'debatteren', 'demonstreren', 'flirten', 'herkennen', 'hijgen', 'improviseren',
    'jongleren', 'knijpen', 'krabben', 'kwispelen', 'mompelen', 'ontsnappen',
    'overwinnen', 'piepen', 'prikken', 'rijden', 'schudden', 'slenteren',
    'sluimeren', 'snuffelen', 'stampen', 'staren', 'steigeren', 'trillen',
    'wentelen', 'woelen', 'zuchten', 'reizen', 'bewijzen', 'dromen',
    'herinneren', 'liefhebben', 'oplossen', 'pech hebben', 'teweegbrengen', 'aarzelen',
    'roddelen', 'rusten', 'vertrouwen', 'vreugdevol zijn', 'bewonderen',
    'afpersen', 'kidnappen', 'gijzelen', 'brandstichten',
    'smokkelen', 'sms-en', 'appen', 'mailen', 'posten', 'liken',
    'googelen', 'typen', 'kopiëren', 'plakken', 'opslaan', 'printen',
    'filmen', 'livestreamen', 'opnemen', 'afspelen', 'pauzeren', 'openen',
    'sluiten', 'vergrendelen', 'ontgrendelen', 'instellen', 'bestellen', 'pinnen',
    'bezorgen', 'inpakken', 'sjouwen', 'tillen', 'dragen',
    'timmeren', 'zagen', 'boren', 'schroeven', 'metselen', 'zingen',
    'spelen', 'stampvoeten', 'dansen'
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
    'Mauritius', 'Nieuw-Zeeland', 'Noord-Korea', 'Oost-Timor', 'Papua Nieuw-Guinea',
    'San Marino', 'Sierra Leone', 'Taiwan', 'Tadzjikistan', 'Tsjaad', 'Turkmenistan',
    'Vaticaanstad', 'Wit-Rusland', 'Centraal-Afrikaanse Republiek', 'Trinidad en Tobago', 'Bosnië-Herzegovina',
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
    'overlevingsdrang', 'pandemie', 'paranoia', 'persoonlijkheid', 'PTSS', 'psychiatrie',
    'quarantaine', 'reflectie', 'rehabilitatie', 'reïncarnatie', 'schizofrenie', 'stigma',
    'surrogaatmoeder', 'transplantatie', 'tunnelvisie', 'vaccinatie', 'wedergeboorte', 'begrafenis',
    'laboratorium', 'algoritme', 'brainstorm', 'evolutie', 'frictie', 'grafiek',
    'implosie', 'mutatie', 'nihilisme', 'paradox', 'pesticide',
    'relatief', 'vergiftiging', 'tijdreizen', 'utopie', 'stroomuitval', 'hersenspoeling',
    'isolatie', 'sprookje', 'plagiaat', 'archeologie', 'barometer', 'geigerteller',
    'kwikthermometer', 'stethoscoop', 'thermometer', 'vergrootglas', 'loep', 'magneet',
    'transistor', 'dwangbuis', 'scalpel', 'defibrillator', 'atoomkern',
    'nucleaire reactor', 'radioactiviteit', 'biologie', 'scheikunde', 'natuurkunde', 'wiskunde',
    'informatica', 'geologie', 'meteorologie', 'genetica', 'microbiologie', 'ecologie',
    'antropologie', 'hypothese', 'theorie', 'experiment', 'observatie', 'controlegroep',
    'steekproef', 'statistiek', 'variabele', 'correlatie', 'causaliteit', 'replica',
    'publicatie', 'operatie', 'diagnose', 'symptoom', 'behandeling', 'medicijn',
    'vaccin', 'antibiotica', 'pijnstiller', 'bloeddruk', 'pols', 'ECG',
    'MRI', 'röntgenfoto', 'echo', 'bloedonderzoek', 'besmetting', 'infectie',
    'virus', 'bacterie', 'microscoop', 'centrifuge', 'reageerbuisje', 'pipet',
    'bunsenbrander', 'onderzoeksinstituut', 'promotie',
    'citatie', 'bibliografie', 'laboratoriumjas', 'proefopstelling', 'meting', 'fout',
    'nauwkeurigheid', 'precisie', 'standaard', 'kilogram',
    'meter', 'ampere', 'kelvin', 'joule', 'watt', 'stoornis',
    'frequentie', 'golflengte', 'trilling', 'geluid', 'licht', 'kleur',
    'spectrum', 'weerspiegeling', 'elektriciteit', 'magnetisme', 'stroom',
    'spanning', 'weerstand', 'geleider', 'supergeleider', 'mysterie',
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
    'senaat', 'grondwet', 'wet', 'amendement', 'motie', 'debat', 'nieuws',
    'lobby', 'fractie', 'kamerlid', 'wethouder', 'gemeenteraad', 'provincie',
    'beleid', 'maatregel', 'subsidie', 'bezuiniging', 'begroting', 'nationalisatie',
    'privatisering', 'verdrag', 'VN', 'NAVO', 'EU', 'traditie', 'mening', 'karakter',
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
    'verkiezingscampagne', 'staatsbegroting', 'BTW', 'vrijhandelszone', 'klimaatwet', 'woningmarkt',
    'volksgezondheid', 'pensioenfonds', 'arbeidsongeschiktheid', 'uitkeringsinstantie', 'vice-premier', 'fractievoorzitter',
    'partijcongres', 'ledenraadpleging', 'coalitiekabinet', 'minderheidskabinet', 'hoorzitting',
    'kamerdebat', 'burgemeester', 'fractieleider', 'provinciebestuur', 'kabinetscrisis', 'motie van wantrouwen',
    'tweede kamer', 'eerste kamer', 'confrontatie', 'waarheid', 'intimidatie', 'manipulatie'
  ];

  const muziek = [
    'gitaar', 'basgitaar', 'elektrische gitaar', 'akoestische gitaar', 'ukelele', 'banjo',
    'viool', 'altviool', 'cello', 'contrabas', 'harp',
    'luit', 'sitar', 'trompet', 'trombone', 'tuba', 'hoorn',
    'saxofoon', 'klarinet', 'fluit', 'dwarsfluit', 'blokfluit',
    'fagot', 'hobo', 'didgeridoo', 'piano', 'vleugel', 'orgel',
    'accordeon', 'synthesizer', 'keyboard', 'trommel', 'xylofoon', 'djembé',
    'microfoon', 'luidspreker', 'versterker', 'mengpaneel', 'grammofoon', 'elpee',
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
    'tenor', 'sopraan', 'alt', 'koorzanger', 'cassette', 'cd',
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
    'gevechtsvliegtuig', 'kazerne', 'bunker', 'fort', 'vesting',
    'commandopost', 'militaire basis', 'loopgraaf', 'mijnenveld', 'patrouilleboot', 'schieten',
    'invasie', 'guerrilla oorlog', 'coup', 'oorlogsmisdaad', 'wapenhandel', 'burgerwacht',
    'agressor', 'militaire oefening', 'belegering', 'geheime operatie', 'spionage', 'sabotage',
    'capitulatie', 'wapenstilstand', 'tribunaal', 'krijgsraad', 'massamoord', 'evacuatie',
    'parachute', 'radarscherm', 'infanterie', 'cavalerie', 'artillerie', 'marine',
    'luchtmacht', 'landmacht', 'commando', 'parachutist', 'verkenner',
    'majoor', 'kolonel', 'admiraal', 'veldslag', 'hinderlaag', 'frontlinie',
    'achterhoede', 'vliegbasis', 'militaire begraafplaats', 'marinebasis', 'grenspost', 'checkpoint',
    'mijnenveger', 'verkenningsvliegtuig', 'bommenwerper', 'jachtvliegtuig', 'transportvliegtuig', 'gevechtshelikopter',
    'raketschild', 'luchtafweer', 'radar', 'sonar', 'gevaarlijk',
    'nachtkijker', 'verrekijker', 'veldtent', 'veldhospitaal', 'verbandpost', 'ziekenauto',
    'wapenopslag', 'munitiedepot', 'kruitkamer', 'schietbaan', 'hindernisbaan',
    'oorlogsvlag', 'saluut', 'wachtpost', 'identiteit', 'noodrantsoen', 'veldfles',
    'kaartlezen', 'geheime boodschap', 'beveiliging', 'bewaking', 'grenscontrole',
    'veiligheidszone', 'bufferzones', 'neutrale zone', 'demilitarisatie', 'vredesmissie', 'VN-missie',
    'militaire alliantie', 'wapenbestand', 'vuurstaking', 'terugtrekking', 'bezetting',
    'bevrijding', 'overwinning', 'nederlaag', 'verovering', 'stadsbelegering', 'blokkade',
    'embargo', 'oorlogsverklaring', 'mobilisatie', 'dienstplicht', 'huurling', 'militie',
    'reservist', 'veteraan', 'krijgsgevangene', 'onderscheiding',
    'vaandel', 'vlag', 'schouderstuk', 'rang', 'angst',
    'oorlogsgraf', 'herdenkingsmonument', 'militaire parade', 'militaire politie',
    'inlichtingendienst', 'geheime dienst', 'cyberaanval', 'informatieoorlog',
    'guerrilla', 'terrorisme', 'aanslagen', 'zelfmoordaanslag', 'bomaanslag', 'ontvoeringen',
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
    'freesmachine', 'bankmes', 'stanleymes', 'dieptemeter',
    'gradenboog', 'klinknagel', 'snijder',
    'verfroller', 'kwast', 'verfbak', 'afplaktape', 'kit', 'siliconekit',
    'purschuim', 'isolatiemateriaal', 'ducttape', 'perslucht',
    'compressor', 'spijkerpistool', 'tacker', 'houtlijm',
    'plamuurmes', 'roerder', 'mixer', 'cementmixer', 'hoogteschaffer',
    'nijptang', 'werktafel', 'lijmspuit', 'noodstroomgenerator', 'stofopvangzak',
    'verlengstuk', 'spoorbreedte', 'boorset', 'luchtcompressor', 'verfspuiter',
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
    'boontje komt om zijn loontje',
    'de aanhouder wint',
    'de appel valt niet ver van de boom',
    'de beste stuurlui staan aan wal',
    'de pot verwijt de ketel dat hij zwart ziet',
    'door de zure appel heen bijten',
    'door de bomen het bos niet meer zien',
    'blaffende honden bijten niet',
    'een gewaarschuwd man telt voor twee',
    'van een koude kermis thuiskomen',
    'een oogie dichtknijpen',
    'een storm in een glas water',
    'eerlijkheid duurt het langst',
    'eerst zien dan geloven',
    'ergens de brui aan geven',
    'het kind met het badwater weggooien',
    'het roer omgooien',
    'hoge bomen vangen veel wind',
    'iemand een hak zetten',
    'iemand in de maling nemen',
    'iemand op de kast jagen',
    'in de wolken zijn',
    'in het nauw gedreven',
    'praatjes vullen geen gaatjes',
    'haastige spoed is zelden goed',
    'preken voor eigen parochie',
    'je kunt niet op twee paarden tegelijk wedden',
    'je huid duur verkopen',
    'zoals het klokje thuis tikt tikt het nergens',
    'roeien met de riemen die je hebt',
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
    'wie niet sterk is moet slim zijn',
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
    'ieder voor zich',
    'iets is beter dan niets',
    'in de aap gelogeerd zijn',
    'al is de leugen nog zo snel de waarheid achterhaalt haar wel',
    'beter een vogel in de hand dan tien in de lucht',
    'een ezel stoot zich geen twee keer aan dezelfde steen',
    'oost west thuis best',
    'zoals de waard is vertrouwt hij zijn gasten',
    'wie goed doet goed ontmoet',
    'leugens hebben korte benen',
    'kort maar krachtig',
    'liefde maakt blind',
    'langzaam maar zeker',
    'leven en laten leven',
    'met vallen en opstaan',
    'oefening baart kunst',
    'in het land der blinden is eenoog koning',
    'van uitstel komt afstel',
    'de eerste klap is een daalder waard',
    'eigen haard is goud waard',
    'achteraf is iedereen wijs',
    'als het kalf verdronken is dempt men de put',
    'gedeelde smart is halve smart',
    'gedeelde vreugde is dubbele vreugde',
    'geld maakt niet gelukkig',
    'het gras is altijd groener aan de overkant',
    'honger is de beste saus',
    'ieder huisje heeft zijn kruisje',
    'jong geleerd is oud gedaan',
    'liefde maakt blind',
    'geduld is een schone zaak',
    'geen nieuws is goed nieuws',
    'na regen komt zonneschijn',
    'nooit te oud om te leren',
    'onbekend maakt onbemind',
    'oude liefde roest niet',
    'spreken is zilver zwijgen is goud',
    'Rome is niet in een dag gebouwd',
    'schone schijn bedriegt',
    'stille wateren hebben diepe gronden',
    'tijd is geld',
    'schijn bedriegt',
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
    'nood breekt wet',
    'je oogst wat je zaait',
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
    'voor wat hoort wat',
    'recht door zee',
    'zeg nooit nooit',
    'rust roest',
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
    'de kat uit de boom kijken',
    'maak dat de kat wijs'
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
    'pizzasnijder', 'aardappelstamper', 'handdoek', 'badmat', 'douchegordijn',
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
    'cakestandaard', 'rijstzeef', 'vuilniszak', 'vuilnisbak', 'afvalbak',
    'papierbak', 'glasbak', 'gft-bak', 'vloerlamp', 'tafellamp',
    'bureaulamp', 'plafondlamp', 'spotje', 'vitrage', 'overgordijn', 'rolgordijn',
    'antislipmat', 'muizenmat', 'vloerbedekking', 'parket', 'laminaat', 'tegels',
    'behang', 'verf', 'handdoekrek', 'toilettas',
    'nagelvijl', 'pincet', 'bloemperk', 'vijverpomp', 'tuinverlichting', 'schutting',
    'tuinhek', 'tuinpad', 'vliegenwering', 'muggenlamp', 'vogelbadje',
    'vogelhuisje', 'vogelvoer', 'tuinaarde', 'bad', 'douche', 'toilet',
    'plank', 'rek', 'bak', 'radiator', 'thermostaatknop', 'rookmelder',
    'sleutelhaak', 'brievenbus', 'buitenlamp', 'wandspiegel', 'fotolijstje', 'kaarsenhouder',
    'tafelkleed', 'badkamerspiegel', 'wasknijper'
  ];

  const map = { dieren, voedsel, beroepen, sport, objecten, huishouden, natuur, vervoer, plaatsen, acties, landen, gereedschap, muziek, militair, ruimte, wetenschap, politiek, spreekwoorden };
  
  // FLAT alle woorden tot 1 array, filter dubbele (zoals 'vissen') eruit:
  const allWords = [...new Set(Object.values(map).flat())];
  map.all = allWords;

  return map;
})();

// ── Dutch compound-word hyphenation ──────────────────────────────────────────
// Woordenboek opgebouwd uit alle spelwoorden — dat is voldoende om samenstellingen
// te herkennen, omdat het rechter deel vrijwel altijd zelf ook een speelwoord is.
const HYPHENATION_DICT = (() => {
  const dict = new Set();
  WORDS_BY_CATEGORY.all
    .filter(w => typeof w === 'string' && !w.includes(' ') && !w.includes('-'))
    .forEach(w => dict.add(w.toLowerCase()));
  return dict;
})();

// Deze lijst vult het HYPHENATION_DICT aan voor woorden die niet 
// als los speelwoord voorkomen, maar wel delen zijn van samenstellingen.
const EXTRA_WORD_PARTS = new Set([
'bijen', 'koningin', 'dwerg', 'pinguïn', 'galapagos', 'schildpad', 'lieveheers', 'beestje',
'bid', 'sprinkhaan', 'stok', 'staartje', 'aardappel', 'puree', 'brandnetel', 'soep', 'caesar',
'salade', 'granaat', 'appel', 'kaneel', 'broodje', 'vanille', 'pudding', 'water', 'meloen', 
'biblio', 'thecaris', 'documentaire', 'maker', 'duik', 'instructeur', 'fysio', 'therapeut',
'game', 'ontwikkelaar', 'hypno', 'ijsbeeld', 'beeld', 'houwer', 'kostuum', 'ontwerper',
'kraam', 'verzorger', 'kunst', 'criticus', 'luchtverkeer', 'leider', 'museum', 'conservator',
'revalidatie', 'arts', 'scenario', 'schrijver', 'stand-up', 'comedian', 'systeem', 'beheerder',
'verzekering', 'agent', 'voeding', 'wetenschapper', 'ziekenhuis', 'directeur', 'tram', 'bestuurder',
'undercover', 'agent', 'belasting', 'adviseur', 'politie', 'commissaris', 'vrachtwagen', 'chauffeur',
'beach', 'volleybal', 'diepzee', 'duiken', 'langebaan', 'schaatsen', 'parachute', 'springen', 'polsstok',
'hoogspringen', 'schans', 'synchroon', 'trampoline', 'wedstrijd', 'vissen', 'kampioen', 'beker',
'gezelschap', 'spel', 'kleiduiven', 'schieten', 'estafette', 'ring', 'afstand', 'bediening',
'armband', 'horloge', 'beeld', 'houwwerk', 'kaarsen', 'houder', 'manchet', 'knoop', 'scheep',
'schroef', 'veiligheid', 'speld', 'boodchappen', 'tas', 'gehoor', 'apparaat', 'muur', 'schildering',
'aard', 'verschuiving', 'lucht', 'vochtigheid', 'vulkaan', 'uitbarsting', 'zoetwater', 'meer',
'zon', 'verduistering', 'deeldienst', 'stoom', 'locomotief', 'water', 'zweef', 'vliegtuig', 'kaping',
'boot', 'trauma', 'spoorweg', 'overgang', 'paspoort', 'controle', 'kenteken', 'plaat', 'woon-werk',
'verkeer', 'distributie', 'centrum', 'brandweer', 'kazerne', 'camping', 'terrein', 'recreatie', 
'gebied', 'tandarts', 'praktijk', 'voetgangers', 'pannenkoeken', 'huis', 'kinder', 'dagverblijf',
'meubel', 'boulevard', 'onder', 'handelen', 'touwtje', 'teweeg', 'stichten', 'live', 'streamen',
'geheugen', 'verlies', 'bewustzijn', 'overling', 'drang', 'surrogaat', 'moeder', 'kwik', 'thermometer',
'weten', 'schappelijk', 'onderzoek', 'instituut', 'deeltjes', 'versneller', 'parlement', 'aire',
'staat', 'secretaris', 'rechtvaardig', 'heid', 'inkomen', 'verdeling', 'verkiezing', 'programma',
'formatie', 'gesprekken', 'kabinet', 'formatie', 'hypotheekrente', 'rente', 'hypotheek', 'aftrek',
'werkgever', 'organisatie', 'volk', 'vertegenwoordiger', 'inkomsten', 'vermogen', 'belasting', 
'consumenten', 'bescherming', 'campagne', 'arbeid', 'ongeschikt', 'heid', 'minderheid', 'kabinet',
'openlucht', 'concert', 'patrouille', 'verkenning', 'stad', 'belegering', 'inlichtingen',
'stroom', 'generator', 'gereedschap', 'kist', 'aardappel', 'schiller', 'accu', 'boormachine',
'hetelucht', 'pistool', 'werk', 'handschoen', 'bescherming', 'isolatie', 'materiaal',
'maan', 'relativiteit', 'theorie', 'koppeling', 'lanceer', 'installatie', 'weten', 'schapper',
'laboratorium', 'aardappel', 'stamper', 'gezondheid', 'zorg', 'ondergang', 'telescoop', 'ruimte',


  'aanslag', 'aardig', 'actie', 'akkoord', 'amfibie', 'apparaat', 'arijs', 'atie', 'aanval',
  'baan', 'band', 'basis', 'bedrijf', 'beheer', 'beleid', 'bestuur', 'bom', 'bond', 'bouw',
  'cel', 'concentratie', 'crisis', 'damp', 'debat', 'deel', 'deeltje', 'democratie', 'deur', 'dienst',
  'energie', 'erij', 'explosie', 'factor', 'fiets', 'front', 'gas', 'gebouw',
  'gevangene', 'geving', 'gever', 'golf', 'graaf', 'grond', 'haven', 'heid', 'herdenking',
  'houder', 'hulp', 'informatie', 'ing', 'isme', 'iteit', 'kamer', 'kamp', 'kampioen', 'kant', 
  'kast', 'kern', 'kracht', 'krijgs', 'kunde', 'kwartier', 'leger', 'leider', 'lijn', 
  'linie', 'logie', 'loos', 'lucht', 'machine', 'macht', 'massa', 'maatregel', 'meester', 
  'ment', 'middel', 'minister', 'misdaad', 'monument',
  'moord', 'motor', 'nemer', 'neming', 'netwerk', 'nota', 'officier', 'onderhandeling', 
  'onderzoek', 'oorlog', 'overleg', 'oxide', 'pad', 'partij', 'planeet', 'proef', 'punt', 
  'raad', 'raam', 'raket', 'recht', 'reis', 'ruimte', 'schap', 'schip', 'schot', 'schutter', 
  'scoop', 'sluiting', 'soldaat', 'speler', 'staf', 'stand', 'staat', 'station', 'stelling', 
  'stelsel', 'ster', 'stilstand', 'stof', 'stoel', 'straal', 'sturing', 'systeem', 'tafel', 
  'transport', 'trein', 'tuig', 'tuigage', 'vaart', 'veld', 'verdrag', 'verdediging', 'verkeer', 
  'verkiezing', 'verklaring', 'verlening', 'vlak', 'vliegtuig', 'vlucht', 'voertuig', 'voerder', 'vol', 
  'vorming', 'vuur', 'waardig', 'wagen', 'wapen', 'water', 'wedstrijd', 'weer', 'werker', 
  'wet', 'wetenschap', 'wiel', 'weg', 'zelfmoord', 'zetel', 'zijde', 'zorg', 'zuur'
]);

function hyphenateWord(word) {
  if (!word || word.includes(' ') || word.length <= 11) return word;
  
  const lower = word.toLowerCase();
  const isKnown = (str) => HYPHENATION_DICT.has(str) || EXTRA_WORD_PARTS.has(str);

  // --- STAP 1: Morfologische splitsing (Samenstellingen) ---
  
  // A. Check op tussen-s bij bekende woorden (bijv. herdenkings-monument)
  for (let i = 4; i <= lower.length - 5; i++) {
    if (lower[i] === 's') {
      const stam = lower.slice(0, i);
      const rest = lower.slice(i + 1);
      if (isKnown(stam) && isKnown(rest)) {
        return word.slice(0, i + 1) + '\u00AD' + word.slice(i + 1);
      }
    }
  }

  // B. Algemene samenstelling check (van rechts naar links)
  for (let i = lower.length - 4; i >= 4; i--) {
    const links = lower.slice(0, i);
    const rechts = lower.slice(i);
    
    if (isKnown(links) && isKnown(rechts)) {
      return word.slice(0, i) + '\u00AD' + word.slice(i);
    }
    
    if (EXTRA_WORD_PARTS.has(rechts) && rechts.length >= 5) {
      return word.slice(0, i) + '\u00AD' + word.slice(i);
    }
  }

  // --- STAP 2: Fonetisch Vangnet (Alleen als Stap 1 niets vond) ---
  const vowels = 'aeiouyàáèéëïöü';
  const diphthongs = ['ee', 'oo', 'aa', 'uu', 'ei', 'au', 'ie', 'ij', 'oe', 'ou', 'ui', 'eu'];
  let result = "";
  let i = 0;

  while (i < word.length) {
    result += word[i];
    
    // BEVEILIGING: Nooit afbreken in de laatste 5 letters
    if (i < word.length - 5) { 
      const char1 = word[i].toLowerCase();
      const char2 = word[i + 1].toLowerCase();
      const char3 = word[i + 2].toLowerCase();
      
      const isVow1 = vowels.includes(char1);
      const isVow2 = vowels.includes(char2);
      const isVow3 = vowels.includes(char3);

      // Alleen afbreken als we niet midden in een tweeklank zitten
      if (isVow1 && !isVow2 && isVow3 && i > 1) {
        result += '\u00AD';
      } 
      else if (isVow1 && !isVow2 && !isVow3 && i < word.length - 6) {
        if (vowels.includes(word[i + 3].toLowerCase())) {
          result += char2 + '\u00AD';
          i++; 
        }
      }
    }
    i++;
  }
  return result;
}

// Bonus words: alle woorden uit categorieen met bonus: true (spreekwoorden)
const BONUS_WORDS_SET = new Set(
  CATEGORIES
    .filter(c => c.bonus)
    .flatMap(c => WORDS_BY_CATEGORY[c.id] || [])
);

// Spreekwoorden geven +2 extra punten (totaal 3); gewone woorden 0
const getBonusPoints = (word) => BONUS_WORDS_SET.has(word) ? 2 : 0;

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
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2"]);

  const toggleTeamMode = () => {
    setTeamMode((prev) => {
      if (!prev) {
        // Schakel over naar team-modus: 2 teams van elk 2 spelers
        setCount(2);
        setTeamSizes([2, 2]);
        setTeamNames(["Team 1", "Team 2"]);
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
    const clamped = Math.min(10, Math.max(2, n));
    setCount(clamped);
    if (teamMode) {
      // Bereken nieuwe teamSizes synchroon op basis van huidige state
      const newSizes = [...teamSizes.slice(0, clamped)];
      while (newSizes.length < clamped) newSizes.push(2);
      const total = newSizes.reduce((a, b) => a + b, 0);
      setTeamSizes(newSizes);
      setTeamNames((prev) => {
        const next = [...prev.slice(0, clamped)];
        while (next.length < clamped) next.push(`Team ${next.length + 1}`);
        return next;
      });
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
    if (teamSizes[t] >= 10) return;
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

  const canStart = names.every((n) => n.trim().length > 0) && selectedCategories.size > 0;

  // Bouw teams array: [{ name: "Team 1", players: [...] }, ...]
  const buildTeams = () => {
    if (!teamMode) return null;
    const trimmed = names.map((n) => n.trim());
    const result = [];
    let offset = 0;
    for (let t = 0; t < count; t++) {
      result.push({
        name: teamNames[t] || `Team ${t + 1}`,
        players: trimmed.slice(offset, offset + teamSizes[t]),
      });
      offset += teamSizes[t];
    }
    return result;
  };

  const totalWordsCount = Array.from(selectedCategories).reduce((total, catId) => {
    return total + (WORDS_BY_CATEGORY[catId]?.length || 0);
  }, 0);
  const absoluteTotalWords = CATEGORIES.reduce((total, cat) => {
    return total + (WORDS_BY_CATEGORY[cat.id]?.length || 0);
  }, 0);
  const allCategoryIds = CATEGORIES.map((c) => c.id);
  const allSelected = allCategoryIds.every((id) => selectedCategories.has(id));

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => {
      if (id === "all") {
        // Alles aan als nog niet alles aan, anders alles uit
        return allSelected ? new Set() : new Set(allCategoryIds);
      }
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    <div className="screen">
      <div className="setup-card">
        <div className="logo-area">
          <div className="logo-icon">💬</div>
          <h1 className="logo-title">WoordenRaad</h1>
          <p className="logo-sub">Het raad- en uitbeeldspel</p>
        </div>

        <div style={{display:'flex', gap:'12px', marginBottom:'20px'}}>
          <button
            className={`start-btn mode-toggle-btn${!teamMode ? " mode-toggle-teams" : " mode-toggle-singles"}`}
            style={{margin:0, flex:1}}
            onClick={() => !teamMode ? null : toggleTeamMode()}
          >
            👤
          </button>
          <button
            className={`start-btn mode-toggle-btn${teamMode ? " mode-toggle-teams" : " mode-toggle-singles"}`}
            style={{margin:0, flex:1}}
            onClick={() => teamMode ? null : toggleTeamMode()}
          >
            👥
          </button>
        </div>

        <div className="setup-section">
          <label className="setup-label" style={{marginBottom: '12px', textAlign: 'center'}}>{teamMode ? "Aantal teams" : "Aantal spelers"}</label>
          <div className="time-control" style={{marginBottom: '20px'}}>
            <button
              className={`time-btn time-btn-minus${count <= 2 ? " time-btn-disabled" : ""}`}
              onClick={() => updateCount(count - 1)}
              disabled={count <= 2}
            >−</button>
            <span className="time-display">{count}</span>
            <button
              className={`time-btn time-btn-plus${count >= 10 ? " time-btn-disabled" : ""}`}
              onClick={() => updateCount(count + 1)}
              disabled={count >= 10}
            >+</button>
          </div>
          {teamMode ? (
            <div className="teams-grid">
              {Array.from({ length: count }, (_, t) => {
                const offset = getTeamOffset(t);
                const size = teamSizes[t];
                return (
                  <div key={t} className="team-block">
                    <div className="team-block-header">
                      <input
                        className="name-input team-name-input"
                        value={teamNames[t] ?? `Team ${t + 1}`}
                        onChange={(e) => setTeamNames((prev) => prev.map((n, i) => i === t ? e.target.value : n))}
                        maxLength={12}
                      />
                      <div className="team-size-controls">
                        <button className={`team-size-btn team-size-remove${size <= 2 ? " team-size-btn-disabled" : ""}`} onClick={() => removePlayerFromTeam(t)} title="Speler verwijderen" disabled={size <= 2}>−1</button>
                        <button className={`team-size-btn team-size-add${size >= 10 ? " team-size-btn-disabled" : ""}`} onClick={() => addPlayerToTeam(t)} title="Speler toevoegen" disabled={size >= 10}>+1</button>
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
          <div className="names-label-row" style={{ justifyContent: 'center', width: '100%' }}>
            <label className="setup-label" style={{ marginBottom: '8px', textAlign: 'center', width: '100%' }}>
              Aantal woorden ({totalWordsCount}/{absoluteTotalWords})
            </label>
          </div>

          <button
            className={`toggle-all-btn${allSelected ? " toggle-all-btn-active" : ""}`}
            onClick={() => toggleCategory("all")}
            style={{ 
              width: '100%', 
              marginBottom: '16px',
              display: 'block'
            }}
          >
            {allSelected ? "🎲 Alle categorieën" : "🎲 Alle categorieën"}
          </button>

          <div className="category-grid">
            {CATEGORIES.map((cat) => (
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
              className={`time-btn time-btn-minus${roundTime <= 30 ? " time-btn-disabled" : ""}`}
              onClick={() => setRoundTime((t) => Math.max(30, t - 30))}
              disabled={roundTime <= 30}
            >−30s</button>
            <span className="time-display">{roundTime}s</span>
            <button
              className={`time-btn time-btn-plus${roundTime >= 300 ? " time-btn-disabled" : ""}`}
              onClick={() => setRoundTime((t) => Math.min(300, t + 30))}
              disabled={roundTime >= 300}
            >+30s</button>
          </div>
        </div>

        <button
          className={`start-btn ${canStart ? "ready" : ""}`}
          onClick={handleStart}
          disabled={!canStart}
        >
          Spel starten
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
        <button className="handoff-btn" onClick={onReady}>
          Ik ben er klaar voor!
        </button>
      </div>
    </div>
  );
}

// Berichten op basis van prestatie: enthousiast (goed) vs bemoedigend (matig/slecht)

const w = (n) => n === 1 ? "woord" : "woorden";
const pt = (n) => n === 1 ? "punt" : "punten";

const MESSAGES_GREAT = [
  () => `Wat een enorme prestatie! 🏆`,
  () => `Jij verdient een sticker! ⭐`,
  () => `De rest is onder de indruk! 😎`,
  () => `Toevallig een woordenboek opgegeten? 📖`,
  () => `De anderen beven van angst! 🫨`,
  () => `Je staat in vuur en vlam! 🔥`,
  () => `Je bent niet te stoppen! 🚀`,
  () => `De rest kan wel inpakken! 😄`,
  () => `Heb jij zitten oefenen? 🤨`,
  () => `Dit heeft iets weg van pesten. 😂`,
  () => `Even een staande ovatie. 👏`,
];

const MESSAGES_OK = [
  (_, pts) => `${pts} ${pt(pts)}, lekker bezig! 🙌`,
  (_, pts) => `${pts} ${pt(pts)}, niet slecht! 👍`,
  (_, pts) => `${pts} ${pt(pts)} op de teller. ✅`,
  (_, pts) => `${pts} ${pt(pts)}, wat geweldig! 🥳`,
  (_, pts) => `${pts} ${pt(pts)} bijgeschreven! ✍️`,
  (_, pts) => `${pts} ${pt(pts)} in één ronde! 🤩`,
  (_, pts) => `${pts} ${pt(pts)}, ga zo door! 💪`,
];
const MESSAGES_POOR = [
  (_, pts) => `${pts} ${pt(pts)}, werk aan de winkel! 🔨`,
  (_, pts) => `${pts} ${pt(pts)}. Volgende keer beter! 🙈`,
  (_, pts) => `${pts} ${pt(pts)}. Haal even rustig adem! 😮‍💨`,
  (_, pts) => `Gewoon doen alsof je die ${pts} ${pt(pts)} niet ziet. 🤫`,
  () => `Volgende keer eerst je bril opzetten. 🤓`,
  () => `De volgende ronde gaat vast beter. 😉`,
  () => `De andere spelers ruiken bloed! 🩸`,
  () => `De spanning zat er zeker in! 😅`,
];

function getRandomEndMessage(correctCount, roundTime, totalScore = correctCount) {
  const ratio = roundTime > 0 ? totalScore / (roundTime / 6) : 0;
  const [pool, tier] =
    ratio >= 0.6   ? [MESSAGES_GREAT, "great"] :
    ratio >= 0.4   ? [MESSAGES_OK,    "ok"]    :
                     [MESSAGES_POOR,  "poor"];
  const idx = Math.floor(Math.random() * pool.length);
  return { message: pool[idx](correctCount, totalScore), tier, count: correctCount, totalScore };
}

function RoundScreen({ player, words, onRoundEnd, roundTime }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0 });
  const endMessageRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(roundTime);
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
  }, [roundTime]);

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 400);
  };

  const wordIndexRef = useRef(0);
  const [skipPenalty, setSkipPenalty] = useState(0);
  const penaltyRef = useRef(null);
  const skipPenaltyRef = useRef(0);
  const roundEndTimeoutRef = useRef(null);

  const finishRound = (finalScores, finalWordIndex) => {
    const totalScore = finalScores.correct + wordResultsRef.current.reduce((sum, r) => sum + (r.bonusPts || 0), 0);
    endMessageRef.current = getRandomEndMessage(finalScores.correct, roundTime, totalScore);
    setDone(true);
    roundEndTimeoutRef.current = setTimeout(() => onRoundEnd({ ...finalScores, wordsUsed: finalWordIndex, wordResults: wordResultsRef.current }), 2800);
  };

  // Ref naar finishRound zodat de timer-interval er altijd de actuele versie van kan aanroepen
  const finishRoundRef = useRef(null);
  finishRoundRef.current = finishRound;

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

  useEffect(() => () => {
    clearInterval(penaltyRef.current);
    clearTimeout(roundEndTimeoutRef.current);
  }, []);

  const pct = timeRemaining / roundTime;
  const timeLeft = Math.round(timeRemaining);
  const timerColor = timesUp ? "#f87171" : timeLeft > 30 ? "#4ade80" : timeLeft > 10 ? "#fbbf24" : "#f87171";
  const circumference = 2 * Math.PI * 44;
  const currentWord = words[wordIndex];
  const isCurrentBonus = currentWord ? getBonusPoints(currentWord) > 0 : false;

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
            const result = endMessageRef.current;
            const n = result.count;
            return (
              <div className="word-done-wrap">
                <div className="word-done-count">{n} {w(n)} · {result.totalScore} {pt(result.totalScore)}</div>
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
            <div className="penalty-sublabel">Wacht een paar seconden…</div>
          </div>
        ) : (
          <>
            <div className="word-anchor">
              <div className="word-counter">woord {wordIndex + 1}</div>
              <div key={wordIndex} className={`current-word${isCurrentBonus ? " bonus-word" : ""}`}>{currentWord ? hyphenateWord(currentWord) : "— geen woorden meer —"}</div>
              <div className={`times-up-banner${isCurrentBonus && !timesUp ? ' bonus-banner' : ''}`} style={{visibility: (timesUp || isCurrentBonus) ? 'visible' : 'hidden'}}>
                {timesUp ? '⏰ Tijd is om — maak dit woord nog af!' : `⭐ BONUSGEZEGDE — 3 punten!`}
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

function ScoreScreen({ players, scores, currentRound, totalRounds, onNext, onRestart, onContinue, onShowStats, teams, teamScores, onStartTiebreaker, playedIndices }) {
  const isLast = currentRound >= totalRounds;

  // Team mode: sorteer teams op gemiddelde score per speler en bewaar originalIndex
  const sortedTeams = teams
    ? [...teams]
        .map((t, i) => ({
          ...t,
          originalIndex: i, // Belangrijk voor gelijke namen en tie-breakers
          totalScore: teamScores[i],
          avgScore: Math.round((teamScores[i] / t.players.length) * 10) / 10,
        }))
        .sort((a, b) => b.avgScore - a.avgScore)
    : null;

  // Individueel: sorteer spelers op score
  const sortedPlayers = !teams
    ? [...players].map((p, i) => ({ name: p, score: scores[i] })).sort((a, b) => b.score - a.score)
    : null;

  // Gelijkspel detectie (alleen bij eindstand)
  let tiedPlayerIndices = null;
  if (isLast && !teams) {
    const topScore = Math.max(...scores);
    const tied = scores.map((s, i) => ({ s, i })).filter(x => x.s === topScore);
    if (tied.length > 1) tiedPlayerIndices = tied.map(x => x.i);
  }
  
  if (isLast && teams) {
    const topAvg = Math.max(...sortedTeams.map(t => t.avgScore));
    const tiedTeams = sortedTeams.filter(t => t.avgScore === topAvg);
    if (tiedTeams.length > 1) {
      // Gebruik originalIndex voor correcte referentie 
      tiedPlayerIndices = tiedTeams.map(team => {
        let offset = 0;
        for (let t = 0; t < team.originalIndex; t++) offset += teams[t].players.length;
        return offset; // eerste speler van elk gebonden team
      });
    }
  }

  return (
    <div className="screen">
      <div className="score-card">
        <h2 className="score-title">{isLast ? "🏆 Eindstand" : `Stand na ronde ${currentRound}`}</h2>
        {isLast && tiedPlayerIndices && (
          <button
            onClick={() => onStartTiebreaker(tiedPlayerIndices)}
            style={{
              width:'100%',
              background:'rgba(251,191,36,0.1)',
              border:'3px solid rgba(251,191,36,0.3)',
              borderRadius:'14px',
              padding:'10px 16px',
              marginBottom:'14px',
              textAlign:'center',
              fontSize:'14px',
              fontWeight:700,
              color:'#fbbf24',
              cursor:'pointer',
              fontFamily:'inherit',
              transition:'background 0.15s, border-color 0.15s',
            }}
            onMouseOver={e => { e.currentTarget.style.background='rgba(251,191,36,0.22)'; e.currentTarget.style.borderColor='rgba(251,191,36,0.6)'; }}
            onMouseOut={e => { e.currentTarget.style.background='rgba(251,191,36,0.1)'; e.currentTarget.style.borderColor='rgba(251,191,36,0.3)'; }}
          >
            🤝 Gelijkspel! Start een tie-breaker.
          </button>
        )}
        <div className="scores-list">
          {sortedTeams
            ? (() => {
                const topAvg = sortedTeams[0]?.avgScore;
                const medals = ["🥇","🥈","🥉"];
                // Effectieve rang: aantal teams met strikt hogere gemiddelde score + 1
                const getTeamEffectiveRank = (avgScore) => sortedTeams.filter(t2 => t2.avgScore > avgScore).length + 1;
                // Gelijkspel detectie per plek
                const firstPlaceTied = isLast && sortedTeams.filter(t => t.avgScore === topAvg).length > 1;
                const interimFirstPlaceTied = !isLast && sortedTeams.filter(t => t.avgScore === topAvg).length > 1;
                return sortedTeams.map((team, i) => {
                  const effectiveRank = getTeamEffectiveRank(team.avgScore);
                  const isTiedFinal = firstPlaceTied && team.avgScore === topAvg;
                  const isTiedInterim = interimFirstPlaceTied && team.avgScore === topAvg;
                  const badge = isLast
                    ? (isTiedFinal ? "👑" : (medals[effectiveRank - 1] ?? effectiveRank))
                    : (team.avgScore === topAvg ? "👑" : effectiveRank);
                  const rowClass = `score-row rank-${effectiveRank} ${isLast ? (isTiedFinal ? "rank-tied" : "rank-final") : (isTiedInterim ? "rank-interim-tied" : "rank-interim")}`;
                  return (
                    <div key={`${team.originalIndex}-${team.name}`} className={rowClass}>
                      <span className="rank-badge">{badge}</span>
                      <div className="score-name-block">
                        <span className="score-name">{team.name}</span>
                        <span className="score-members">{team.players.join(", ")}</span>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <span className="score-pts">{team.avgScore} pt</span>
                        <div style={{fontSize:'11px', opacity:0.5, marginTop:'2px'}}>gem. per speler · totaal {team.totalScore}</div>
                      </div>
                    </div>
                  );
                });
              })()
            : (() => {
                const topScore = sortedPlayers[0]?.score;
                const medals = ["🥇","🥈","🥉"];
                // Effectieve rang: aantal spelers met strikt hogere score + 1
                const getEffectiveRank = (score) => sortedPlayers.filter(p2 => p2.score > score).length + 1;
                // Gelijkspel detectie per plek
                const firstPlaceTied = isLast && sortedPlayers.filter(p => p.score === topScore).length > 1;
                const interimFirstPlaceTied = !isLast && sortedPlayers.filter(p => p.score === topScore).length > 1;
                return sortedPlayers.map((p, i) => {
                  const effectiveRank = getEffectiveRank(p.score);
                  const isTiedFinal = firstPlaceTied && p.score === topScore;
                  const isTiedInterim = interimFirstPlaceTied && p.score === topScore;
                  const originalIdx = players.indexOf(p.name);
                  const hasPlayed = !isLast && (playedIndices?.has(originalIdx) ?? false);
                  const isTopScore = p.score === topScore;
                  const badge = isLast
                    ? (isTiedFinal ? "👑" : (medals[effectiveRank - 1] ?? effectiveRank))
                    : (isTopScore ? "👑" : effectiveRank);
                  const interimClass = isTiedInterim
                    ? "rank-interim-tied"
                    : (isTopScore ? "rank-interim" : (hasPlayed ? "rank-interim-played" : "rank-interim"));
                  const rowClass = `score-row rank-${effectiveRank} ${isLast ? (isTiedFinal ? "rank-tied" : "rank-final") : interimClass}`;
                  return (
                    <div
                      key={p.name}
                      className={rowClass}
                      onClick={isLast ? () => onShowStats(originalIdx) : undefined}
                      style={isLast ? {cursor:'pointer'} : undefined}
                    >
                      <span className="rank-badge">{badge}</span>
                      <span className="score-name">{p.name}</span>
                      <span className="score-pts">{p.score} pt</span>
                    </div>
                  );
                });
              })()
          }
        </div>
        {isLast ? (
          <div className="final-btns">
            <button className="score-btn continue-btn" onClick={onContinue}>
              Nog een ronde ➜
            </button>
            <button className="score-btn restart-btn" onClick={onRestart}>
              Nieuw spel
            </button>
          </div>
        ) : (
          <button className="score-btn next-btn" onClick={onNext}>
            Volgende speler ➜
          </button>
        )}
      </div>
    </div>
  );
}

// ── Stats Screen ─────────────────────────────────────────────────────────────

function StatsScreen({ players, playerStats, scores, initialPlayer, onBack }) {
  const [activePlayer, setActivePlayer] = useState(initialPlayer ?? 0);

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
    <div className="screen">
      <div className="stats-card">
        <div style={{display:"flex", alignItems:"center", marginBottom:16}}>
          <button
            onClick={onBack}
            style={{
              background:"rgba(255,255,255,0.08)", border:"2.5px solid rgba(255,255,255,0.15)",
              borderRadius:12, color:"rgba(255,255,255,0.75)", fontSize:18,
              width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", flexShrink:0, transition:"all 0.15s"
            }}
            onMouseOver={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";e.currentTarget.style.color="#fff"}}
            onMouseOut={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.color="rgba(255,255,255,0.75)"}}
            title="Terug naar scorebord"
          ><span style={{display:"inline-block", transform:"scaleX(-1)", lineHeight:1, verticalAlign:"middle"}}>➜</span></button>
          <h2 className="score-title" style={{margin:0, flex:1, textAlign:"center"}}>📊 Statistieken</h2>
          <div style={{width:36, flexShrink:0}} />
        </div>

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
        <div className="stats-total-score">{scores[activePlayer]} {pt(scores[activePlayer])}</div>

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
            🏅 Beste ronde: {bestRound.idx + 1} — {bestRound.correct} {w(bestRound.correct)} geraden
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


      </div>
    </div>
  );
}

// ── Tiebreaker Screen ─────────────────────────────────────────────────────────

// Categoriepicker: apart component zodat hooks in TiebreakerRound altijd worden aangeroepen.
function TiebreakerCategoryPicker({ candidateCategories, onCategoryChosen }) {
  return (
    <div className="screen">
      <div className="score-card">
        <h2 className="score-title" style={{marginBottom:'6px'}}>⚡ Tie-breaker</h2>
        <p style={{textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:'13px', marginBottom:'22px', lineHeight:'1.5'}}>
          Kies samen een categorie.<br/>Alle spelers krijgen een woord uit dezelfde categorie.
        </p>
        <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'24px'}}>
          {(candidateCategories || []).map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChosen(cat.id)}
              style={{
                width:'100%', padding:'18px 20px',
                borderRadius:'18px',
                background:'rgba(167,139,250,0.1)',
                border:'2.5px solid rgba(167,139,250,0.3)',
                color:'white', fontFamily:'inherit',
                fontSize:'20px', fontWeight:800,
                cursor:'pointer', textAlign:'left',
                transition:'all 0.15s',
                display:'flex', alignItems:'center', gap:'12px',
              }}
              onMouseOver={e => { e.currentTarget.style.background='rgba(167,139,250,0.25)'; e.currentTarget.style.borderColor='rgba(167,139,250,0.7)'; }}
              onMouseOut={e => { e.currentTarget.style.background='rgba(167,139,250,0.1)'; e.currentTarget.style.borderColor='rgba(167,139,250,0.3)'; }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TiebreakerScreen({ players, tiebreakerState, onCategoryChosen, onWordGuessed, onRestart }) {
  const { tiedPlayerIndices, candidateCategories, chosenCategoryId, words, categoryLabel, times, currentStep } = tiebreakerState;
  const allDone = currentStep >= tiedPlayerIndices.length;

  // subPhase: 'handoff' | 'round' | 'results'
  const [subPhase, setSubPhase] = useState('handoff');
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  // Reset timer when moving to a new player's round
  useEffect(() => {
    setSubPhase('handoff');
    setElapsed(0);
    clearInterval(timerRef.current);
  }, [currentStep]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Category picker: show when no category chosen yet
  if (!chosenCategoryId) {
    return (
      <TiebreakerCategoryPicker
        candidateCategories={candidateCategories}
        onCategoryChosen={onCategoryChosen}
      />
    );
  }

  const startRound = () => {
    setSubPhase('round');
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);
    }, 50);
  };

  const handleGuessed = () => {
    clearInterval(timerRef.current);
    const finalTime = (Date.now() - startTimeRef.current) / 1000;
    setElapsed(finalTime);
    setSubPhase('handoff');
    onWordGuessed(finalTime);
  };

  const currentPlayerIdx = allDone ? null : tiedPlayerIndices[currentStep];
  const currentWord = allDone ? null : words[currentStep];

  // Results view
  if (allDone) {
    const results = tiedPlayerIndices.map((pi, i) => ({
      name: players[pi],
      time: times[i],
    })).sort((a, b) => a.time - b.time);
    const winnerTime = results[0].time;
    const hasJointWinner = results.filter(r => r.time === winnerTime).length > 1;

    return (
      <div className="screen">
        <div className="score-card">
          <h2 className="score-title">⚡ Tie-breaker resultaten</h2>
          <div style={{
            margin:'0 0 16px',
            padding:'10px 16px',
            borderRadius:'14px',
            background: hasJointWinner ? 'rgba(251,191,36,0.08)' : 'rgba(74,222,128,0.08)',
            border: `2.5px solid ${hasJointWinner ? 'rgba(251,191,36,0.3)' : 'rgba(74,222,128,0.3)'}`,
            textAlign:'center',
          }}>
            {hasJointWinner ? (
              <span style={{color:'#fbbf24', fontWeight:800, fontSize:'14px'}}>
                🤝 Nog steeds gelijkspel!
              </span>
            ) : (
              <span style={{color:'#4ade80', fontWeight:800, fontSize:'14px'}}>
                🏆 {results[0].name} wint de tie-breaker!
              </span>
            )}
          </div>
          <div className="scores-list">
            {results.map((r, i) => {
              const tieBadges = ["🥇", "🥈", "🥉"];
              return (
                <div key={r.name} className={`score-row rank-${i + 1} rank-final`}>
                  <span className="rank-badge">{tieBadges[i] ?? i + 1}</span>
                  <span className="score-name">{r.name}</span>
                  <span className="score-pts" style={{fontSize:'17px'}}>
                    {r.time.toFixed(1)}s
                  </span>
                </div>
              );
            })}
          </div>
          <div className="final-btns">
            <button className="score-btn restart-btn" onClick={onRestart}>Nieuw spel</button>
          </div>
        </div>
      </div>
    );
  }

  // Handoff view
  if (subPhase === 'handoff') {
    return (
      <div className="screen handoff-screen">
        <div className="handoff-card">
          <div className="handoff-icon">⚡</div>
          <p className="handoff-sub" style={{color:'#fbbf24', fontWeight:800, letterSpacing:'0.06em', fontSize:'13px'}}>
            TIE-BREAKER · {currentStep + 1}/{tiedPlayerIndices.length}
          </p>
          <h2 className="handoff-name">{players[currentPlayerIdx]}</h2>
          <p className="handoff-tip" style={{marginBottom:'2px'}}>Raad z.s.m. het random woord</p>
          <p className="handoff-tip" style={{marginTop:'0px'}}>in de categorie: {categoryLabel}</p>
          <button className="handoff-btn" onClick={startRound}>
            Start tie-breaker!
          </button>
        </div>
      </div>
    );
  }

  // Round view — show word, count-up timer, "guessed" button
  const secs = Math.floor(elapsed);
  const tenths = Math.floor((elapsed % 1) * 10);

  // Fill circle: 0→full over 60s (orange/yellow)
  const circumference = 2 * Math.PI * 44;
  const yellowFill = Math.min(elapsed / 60, 1);
  const yellowOffset = circumference * (1 - yellowFill);

  return (
    <div className="screen round-screen">
      <div className="round-top">
        <span className="round-player">⚡ {players[currentPlayerIdx]}</span>
        <div className="timer-wrap">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8"/>
            {/* Yellow/orange fill — grows from 0 to full over 60s */}
            <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={yellowOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{transition:'stroke-dashoffset 0.05s linear'}}
            />
            <text x="50" y="50" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" fontFamily="inherit" dy="0">{secs}</text>
            <text x="50" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="inherit">.{tenths}s</text>
          </svg>
        </div>
        <div className="round-stats">
          <span style={{fontSize:'12px', color:'rgba(255,255,255,0.4)'}}>{categoryLabel}</span>
        </div>
      </div>

      <div className="word-stage">
        <div className="word-anchor">
          <div className="word-counter">leg z.s.m. uit</div>
          <div className="current-word">{hyphenateWord(currentWord)}</div>
          <div className="times-up-banner" style={{visibility:'hidden'}}>placeholder</div>
        </div>
      </div>

      <div className="action-row">
        <button className="action-btn correct-btn" style={{flex:1}} onClick={handleGuessed}>
          <span className="btn-icon">✓</span>
          <span className="btn-label">Goed geraden!</span>
        </button>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("setup"); // setup | handoff | round | score | stats | tiebreaker
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [wordDeck, setWordDeck] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);
  const [teams, setTeams] = useState(null);
  const [teamScores, setTeamScores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => new Set());
  // playerStats: array of { rounds: [{correct, skipped, words:[{word,guessed}]}] }
  const [playerStats, setPlayerStats] = useState([]);
  // Tie-breaker state
  const [tiebreakerState, setTiebreakerState] = useState(null);
  // Stats: welke speler wordt getoond bij openen
  const [statsInitialPlayer, setStatsInitialPlayer] = useState(0);
  // Speelvolgorde: in team modus afwisselend per team
  const [playOrder, setPlayOrder] = useState([]);
  const [playOrderPos, setPlayOrderPos] = useState(0);

  const totalRounds = players.length;

  const getWordPool = (cats) => {
    const catSet = cats instanceof Set ? cats : new Set();
    const allIds = CATEGORIES.map(c => c.id);
    // Gebruik 'alles' als niets geselecteerd is of alle categorieën aan staan
    if (catSet.size === 0 || allIds.every(id => catSet.has(id))) {
      return WORDS_BY_CATEGORY.all;
    }
    const merged = new Set();
    for (const id of catSet) {
      (WORDS_BY_CATEGORY[id] || []).forEach(word => merged.add(word));
    }
    return merged.size > 0 ? [...merged] : WORDS_BY_CATEGORY.all;
  };

  const startGame = (names, time, teamsData, categories) => {
    const empty = Array(names.length).fill(0);
    setPlayers(names);
    setScores(empty);
    setCurrentPlayerIdx(0);
    setRoundNum(0);
    setUsedWords(new Set());
    setRoundTime(time);
    const catSet = categories instanceof Set ? categories : new Set();
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

  // Helper: geeft het teamindex terug voor een spelerindex
  const getTeamIdxForPlayer = (playerIdx) => {
    if (!teams) return null;
    let offset = 0;
    for (let t = 0; t < teams.length; t++) {
      offset += teams[t].players.length;
      if (playerIdx < offset) return t;
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
    wordDeck.slice(0, wordsUsed).forEach(word => newUsed.add(word));
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

  const onStartTiebreaker = (tiedPlayerIndices) => {
    // Always show exactly 3 categories.
    // Priority: categories used in this game (excl. spreekwoorden) come first,
    // then fill up with random safe categories not yet in the list.
    const safeCats = ['dieren', 'voedsel', 'beroepen', 'sport', 'objecten', 'natuur', 'landen', 'vervoer', 'plaatsen', 'muziek', 'acties', 'gereedschap', 'wetenschap', 'ruimte', 'militair', 'politiek', 'huishouden'];
    const catSet = selectedCategory instanceof Set ? selectedCategory : new Set();
    const allIds = CATEGORIES.map(c => c.id);
    const allSelected = catSet.size === 0 || allIds.every(id => catSet.has(id));

    // Categories used in this game that are safe (no spreekwoorden, no all)
    const usedSafe = allSelected
      ? []
      : safeCats.filter(c => catSet.has(c));

    // Shuffle the used-safe list, take up to 3
    const chosen = shuffle(usedSafe).slice(0, 3);

    // Fill remaining slots with random safe cats not already chosen
    const remaining = shuffle(safeCats.filter(c => !chosen.includes(c)));
    while (chosen.length < 3 && remaining.length > 0) chosen.push(remaining.shift());

    const candidateCategories = chosen.map(id => CATEGORIES.find(c => c.id === id)).filter(Boolean);

    setTiebreakerState({
      tiedPlayerIndices,
      candidateCategories,
      chosenCategoryId: null,
      words: null,
      categoryLabel: null,
      times: tiedPlayerIndices.map(() => null),
      currentStep: 0,
    });
    setPhase('tiebreaker');
  };

  const onTiebreakerCategoryChosen = (catId) => {
    const chosenCat = CATEGORIES.find(c => c.id === catId);
    const pool = WORDS_BY_CATEGORY[catId] || [];
    const tiedIndices = tiebreakerState.tiedPlayerIndices;
    const fresh = pool.filter(w => !usedWords.has(w));
    const src = shuffle(fresh.length >= tiedIndices.length ? fresh : shuffle(pool));
    const words = src.slice(0, tiedIndices.length);
    setTiebreakerState(prev => ({
      ...prev,
      chosenCategoryId: catId,
      categoryLabel: chosenCat?.label ?? '🎲',
      words,
    }));
  };

  const onTiebreakerWordGuessed = (elapsedSeconds) => {
    setTiebreakerState(prev => {
      const newTimes = [...prev.times];
      newTimes[prev.currentStep] = elapsedSeconds;
      return { ...prev, times: newTimes, currentStep: prev.currentStep + 1 };
    });
  };

  const onRestart = () => {
    setPhase("setup");
    setPlayers([]);
    setScores([]);
    setTeams(null);
    setTeamScores([]);
    setPlayerStats([]);
    setPlayOrder([]);
    setPlayOrderPos(0);
    setTiebreakerState(null);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Righteous&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

        html, body {
          font-family: 'Nunito', sans-serif;
          background: #060d1a;
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

        /* ── Background ── */
        .screen::before {
          content: '';
          position: fixed; inset: 0;
          background: #060d1a;
          z-index: 0;
        }
        .screen::after {
          content: '';
          position: fixed; inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E");
          background-size: 180px 180px, 340px 340px;
          opacity: 0.07;
          mix-blend-mode: overlay;
        }

        .screen > * { position: relative; z-index: 1; }

        /* ── Setup ── */
        .setup-card {
          background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12);
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

        .names-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .names-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .names-label-row .setup-label { margin-bottom: 0; }
        .toggle-all-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: 3px solid rgba(255,255,255,0.2);
          font-family: 'Righteous', cursive;
          font-size: 20px;
          letter-spacing: 0.04em;
          cursor: pointer;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.45);
          transition: all 0.25s;
        }
        .toggle-all-btn:hover { background: rgba(255,255,255,0.1); }
        .toggle-all-btn-active {
          background: rgba(52,211,153,0.08);
          color: #34d399;
          border-color: #34d399;
        }
        .toggle-all-btn-active:hover { background: rgba(52,211,153,0.18); }
        .name-input-wrap { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 2.5px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 0 12px; transition: border-color 0.2s; }
        .name-input-wrap:focus-within { border-color: #60a5fa; background: rgba(96,165,250,0.06); }
        .name-num { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.3); min-width: 14px; }
        .name-input { flex: 1; background: none; border: none; outline: none; color: white; font-family: inherit; font-size: 14px; font-weight: 600; padding: 12px 0; }
        .name-input::placeholder { color: rgba(255,255,255,0.25); }

        .start-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: 3px solid #a78bfa;
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
          border: 3px solid #34d399;
          background: rgba(52,211,153,0.08);
          color: #34d399;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s;
        }
        .time-btn-plus:hover:not(:disabled) { background: rgba(52,211,153,0.18); }
        .time-btn-minus { border-color: #f87171; background: rgba(248,113,113,0.08); color: #f87171; }
        .time-btn-minus:hover:not(:disabled) { background: rgba(248,113,113,0.18); }
        .time-btn:disabled { opacity: 0.3; cursor: default; }
        .time-btn-disabled { opacity: 1 !important; cursor: not-allowed !important; pointer-events: none; background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.35) !important; }
        .time-display {
          flex: 1;
          text-align: center;
          font-family: 'Righteous', cursive;
          font-size: 24px;
          color: rgba(255,255,255,0.9);
        }

        .start-btn.ready {
          border: 3px solid #a78bfa;
          background: rgba(167,139,250,0.08);
          color: #a78bfa;
        }
        .start-btn.ready:hover { background: rgba(167,139,250,0.15); }
        .mode-toggle-btn {
          margin-bottom: 20px;
          border: 3px solid rgba(255,255,255,0.2);
        }
        .mode-toggle-singles {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          border-color: rgba(255,255,255,0.2);
        }
        .mode-toggle-singles:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.35); }
        .mode-toggle-teams {
          background: rgba(52,211,153,0.08);
          color: #34d399;
          border-color: #34d399;
        }
        .mode-toggle-teams:hover { background: rgba(52,211,153,0.15); }

        /* ── Handoff ── */
        .handoff-screen { background: none; }
        .handoff-card {
          text-align: center;
          padding: 40px 24px;
          background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(20px);
        }
        .handoff-icon { font-size: 52px; margin-bottom: 16px; animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .handoff-sub { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; margin-bottom: 10px; }
        .handoff-name { font-family: 'Righteous', cursive; font-size: clamp(28px, 8vw, 42px); color: #a78bfa; margin-bottom: 24px; word-break: break-word; }
        .handoff-team { font-size: 13px; color: #34d399; font-weight: 800; letter-spacing: 0.06em; margin-top: -10px; margin-bottom: 16px; }
        .handoff-tip { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 28px; }
        .handoff-btn {
          padding: 16px 32px;
          border-radius: 16px;
          border: 3px solid #a78bfa;
          background: rgba(167,139,250,0.08);
          color: #a78bfa;
          font-family: 'Righteous', cursive;
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .handoff-btn:hover { background: rgba(167,139,250,0.15); }

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
          text-align: center;
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
          border: 3px solid rgba(248,113,113,0.35);
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
          color: #fb923c;
          background: rgba(251,146,60,0.12);
          border-color: rgba(251,146,60,0.35);
          animation: pulse-orange-banner 1.2s ease-in-out infinite;
        }
        @keyframes pulse-orange-banner {
          0%, 100% { box-shadow: 0 0 6px rgba(251,146,60,0.4); }
          50% { box-shadow: 0 0 14px rgba(251,146,60,0.8); }
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

        .skip-btn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 3px solid rgba(251,191,36,0.3); }
        .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 3px solid rgba(74,222,128,0.35); }

        @media (hover: hover) {
          .skip-btn:hover { background: rgba(251,191,36,0.25); }
          .correct-btn:hover { background: rgba(74,222,128,0.35); }
        }

        .teams-grid { display: flex; flex-direction: column; gap: 14px; }
        .team-block {
          background: rgba(167,139,250,0.05);
          border: 2.5px solid rgba(167,139,250,0.25);
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
        .team-name-input {
          font-size: 13px !important;
          font-weight: 800 !important;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #a78bfa !important;
          padding: 6px 10px !important;
          flex: none !important;
          width: 160px;
          background: rgba(167,139,250,0.06) !important;
          border: 2.5px solid rgba(167,139,250,0.35) !important;
          border-radius: 8px !important;
        }
        .team-name-input:focus { border-color: #a78bfa !important; background: rgba(167,139,250,0.1) !important; }
        .team-name-input::placeholder { color: rgba(167,139,250,0.4) !important; }
        .team-size-controls { display: flex; gap: 6px; }
        .team-size-btn {
          padding: 3px 10px;
          border-radius: 8px;
          border: 2.5px solid #34d399;
          background: rgba(52,211,153,0.08);
          color: #34d399;
          font-size: 12px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1.4;
        }
        .team-size-btn:hover:not(.team-size-btn-disabled) { background: rgba(52,211,153,0.18); }
        .team-size-remove { border-color: #f87171; border-width: 2.5px; background: rgba(248,113,113,0.08); color: #f87171; }
        .team-size-remove:hover:not(.team-size-btn-disabled) { background: rgba(248,113,113,0.18); }
        .team-size-btn-disabled { opacity: 1; cursor: not-allowed; pointer-events: none; background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.35) !important; }

        .team-block .name-input-wrap { margin-bottom: 6px; }
        .team-block .name-input-wrap:last-child { margin-bottom: 0; }

        .score-name-block { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
        .score-members { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .score-card {
          background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12);
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
          border: 3px solid rgba(255,255,255,0.07);
          animation: slideIn 0.4s ease both;
        }
        .score-row.rank-1 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .score-row.rank-2 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .score-row.rank-3 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }

        /* Tussenstand: alleen #1 groen, rest neutraal */
        .score-row.rank-1.rank-interim { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-2.rank-interim { background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.14); }
        .score-row.rank-3.rank-interim { background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.14); }
        /* Tussenstand gelijkspel: alle gedeelde eersten groen */
        .score-row.rank-interim-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-interim-tied .score-pts { color: #4ade80; }
        .score-row.rank-interim-played { background: rgba(167,139,250,0.08); border: 3px solid rgba(167,139,250,0.5); }
        .score-row.rank-interim-played .score-pts { color: #a78bfa; }

        /* Eindstand: goud / zilver / brons */
        .score-row.rank-1.rank-final { background: rgba(251,191,36,0.08); border: 3px solid #fbbf24; }
        .score-row.rank-2.rank-final { background: rgba(192,192,192,0.1); border: 3px solid #c0c0c0; }
        .score-row.rank-3.rank-final { background: rgba(205,127,50,0.08); border: 3px solid #cd7f32; }
        .score-row.rank-4.rank-final, .score-row.rank-5.rank-final, .score-row.rank-6.rank-final,
        .score-row.rank-7.rank-final, .score-row.rank-8.rank-final, .score-row.rank-9.rank-final,
        .score-row.rank-10.rank-final { background: rgba(167,139,250,0.08); border: 3px solid rgba(167,139,250,0.5); }
        .score-row.rank-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-tied .score-pts { color: #4ade80; }
        .score-row.rank-tied .score-name { color: #4ade80; }
        .score-row[style*="pointer"]:hover { filter: brightness(1.25); }
        @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
        .score-row:nth-child(1){animation-delay:0.05s}
        .score-row:nth-child(2){animation-delay:0.1s}
        .score-row:nth-child(3){animation-delay:0.15s}
        .score-row:nth-child(4){animation-delay:0.2s}
        .score-row:nth-child(5){animation-delay:0.25s}
        .score-row:nth-child(6){animation-delay:0.3s}

        .rank-badge { font-size: 20px; min-width: 28px; text-align: center; flex-shrink: 0; }
        .score-name { flex: 1; font-size: clamp(14px, 4vw, 18px); font-weight: 700; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .score-pts { font-family: 'Righteous', cursive; font-size: clamp(16px, 4vw, 20px); color: rgba(255,255,255,0.9); flex-shrink: 0; }
        .score-row.rank-1.rank-interim .score-pts { color: #4ade80; }
        .score-row.rank-1.rank-final .score-pts { color: #fbbf24; }
        .score-row.rank-2.rank-final .score-pts { color: #c0c0c0; }
        .score-row.rank-3.rank-final .score-pts { color: #cd7f32; }
        .score-row.rank-4.rank-final .score-pts, .score-row.rank-5.rank-final .score-pts,
        .score-row.rank-6.rank-final .score-pts, .score-row.rank-7.rank-final .score-pts,
        .score-row.rank-8.rank-final .score-pts, .score-row.rank-9.rank-final .score-pts,
        .score-row.rank-10.rank-final .score-pts { color: #a78bfa; }

        .score-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: none;
          font-family: 'Righteous', cursive;
          font-size: 20px;
          cursor: pointer;
          transition: filter 0.18s;
        }
        .next-btn { background: rgba(167,139,250,0.08); color: #a78bfa; border: 3px solid #a78bfa; }
        .next-btn:hover { background: rgba(167,139,250,0.15); }
        .restart-btn { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); border: 3px solid rgba(255,255,255,0.2); }
        .restart-btn:hover { background: rgba(255,255,255,0.14); }
        .continue-btn { background: rgba(52,211,153,0.1); color: #34d399; border: 3px solid rgba(52,211,153,0.35); margin-bottom: 10px; }
        .continue-btn:hover { background: rgba(52,211,153,0.18); }
        .stats-btn { background: rgba(251,191,36,0.1); color: #fbbf24; border: 3px solid rgba(251,191,36,0.35); margin-bottom: 10px; }
        .stats-btn:hover { background: rgba(251,191,36,0.18); }
        .final-btns { display: flex; flex-direction: column; }

        /* ── Category picker ── */
        .category-grid {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .category-btn {
          padding: 8px 14px; border-radius: 20px;
          border: 3px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-size: 13px; font-weight: 700; font-family: inherit;
          cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s;
          user-select: none;
        }
        .category-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); color: white; }
        .category-btn-active {
          background: rgba(52,211,153,0.08);
          border-color: #34d399;
          color: #34d399;
        }
        .category-btn-active:hover {
          background: rgba(52,211,153,0.18);
          border-color: #34d399;
        }

        /* ── Bonus word ── */
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); }
        }
        .current-word.bonus-word {
          background: linear-gradient(135deg, #fb923c, #f97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .flash-bonus { animation: flash-bonus-anim 0.4s ease; }
        @keyframes flash-bonus-anim {
          0% { background: rgba(251,146,60,0); }
          30% { background: rgba(251,146,60,0.2); }
          100% { background: rgba(251,146,60,0); }
        }

        /* ── Stats screen ── */
        .stats-card {
          background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12);
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
          border: 2.5px solid rgba(255,255,255,0.15);
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
          border: 2.5px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 12px;
          text-align: center;
        }
        .stats-cell-gold { border-color: rgba(251,146,60,0.35); background: rgba(251,146,60,0.08); }
        .stats-cell-val { font-family: 'Righteous', cursive; font-size: 26px; }
        .stats-cell-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 2px; }
        .stats-best {
          font-size: 13px; font-weight: 700; color: #fbbf24;
          background: rgba(251,191,36,0.1); border: 2.5px solid rgba(251,191,36,0.25);
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
          border: 2.5px solid rgba(74,222,128,0.25); color: #4ade80;
        }
        .stats-word-bonus { background: rgba(251,146,60,0.12); border-color: rgba(251,146,60,0.4); color: #fb923c; }
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
          onShowStats={(playerIdx) => { setStatsInitialPlayer(playerIdx ?? 0); setPhase("stats"); }}
          teams={teams}
          teamScores={teamScores}
          onStartTiebreaker={onStartTiebreaker}
          playedIndices={new Set(playOrder.slice(0, playOrderPos + 1))}
        />
      )}

      {phase === "tiebreaker" && tiebreakerState && (
        <TiebreakerScreen
          players={players}
          tiebreakerState={tiebreakerState}
          onCategoryChosen={onTiebreakerCategoryChosen}
          onWordGuessed={onTiebreakerWordGuessed}
          onRestart={onRestart}
        />
      )}

      {phase === "stats" && (
        <StatsScreen
          players={players}
          playerStats={playerStats}
          scores={scores}
          initialPlayer={statsInitialPlayer}
          onBack={() => setPhase("score")}
        />
      )}
    </>
  );
}
