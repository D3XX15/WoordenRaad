import { useState, useEffect, useRef } from "react";

// ── Categorieën ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "dieren",        label: "🐶 Dieren" },
  { id: "natuur",        label: "🌿 Natuur" },
  { id: "vervoer",       label: "🚗 Vervoer" },
  { id: "voedsel",       label: "🍕 Eten & Drinken" },
  { id: "koken",         label: "🧑‍🍳 Koken & Bakken" },
  { id: "sport",         label: "⚽ Sport & Hobby" },
  { id: "huishouden",    label: "🏠 Huishouden" },
  { id: "kleding",       label: "👕 Kleding" },
  { id: "beroepen",      label: "👷 Beroepen" },
  { id: "kantoor",       label: "💼 Kantoor" },
  { id: "emoties",       label: "🎭 Emoties & Gedrag" },
  { id: "misdaad",       label: "🚔 Misdaad & Justitie" },
  { id: "muziek",        label: "🎶 Muziek" },
  { id: "kunst",         label: "🧑‍🎨 Kunst" },
  { id: "literatuur",    label: "✍️ Literatuur" },
  { id: "fictie",        label: "🧙 Fictie" },
  { id: "gereedschap",   label: "🔧 Gereedschap" },
  { id: "ruimte",        label: "🚀 Ruimte" },
  { id: "politiek",      label: "⚖️ Politiek & Maatschappij" },
  { id: "religie",       label: "🕍 Religie" },
  { id: "militair",      label: "🪖 Militair" },
  { id: "plaatsen",      label: "🧭 Plaatsen" },
  { id: "landen",        label: "🌍 Landen" },
  { id: "wetenschap",    label: "🔬 Wetenschap" },
  { id: "geneeskunde",   label: "🩺 Geneeskunde" },
  { id: "acties",        label: "🏃 Werkwoorden" },
  { id: "spreekwoorden", label: "💬 Spreekwoorden", bonus: true },
];

// WORDS_BY_CATEGORY maps category id → word array
const WORDS_BY_CATEGORY = (() => {
  const dieren = [
    'aardvarken', 'adelaar', 'albatros', 'alpaca', 'anakonda', 'baviaan', 'kameleon', 'kangoeroe',
    'beer', 'bever', 'bijenkoningin', 'bizon', 'boomkikker', 'boomslang', 'kat', 'kever', 'kikker',
    'buffel', 'buizerd', 'buldog', 'cheetah', 'chihuahua', 'cobra', 'kiwi', 'egel', 'ekster', 'eland',
    'condor', 'das', 'dingo', 'dinosaurus', 'dolfijn', 'dromedaris', 'duif', 'dwergpinguïn', 'eekhoorn',
    'gibbon', 'giraffe', 'gorilla', 'goudjakhals', 'goudvis', 'grizzlybeer', 'hyena', 'ibis', 'ijsbeer',
    'guppie', 'haai', 'haas', 'hagedis', 'hamster', 'havik', 'prooidier', 'hermelijn', 'hond', 'honingdas',
    'impala', 'inktvis', 'jaguar', 'jakhals', 'kaketoe', 'kameel', 'emoe', 'fazant', 'flamingo', 'fret',
    'koala', 'koe', 'komodovaraan', 'konijn', 'kraanvogel', 'krab', 'galapagosschildpad', 'gecko', 'lynx',
    'krokodil', 'kwal', 'kwartel', 'lama', 'leeuw', 'leguaan', 'chimpansee', 'lemming', 'lepelaar', 'libel',
    'maanvis', 'marmot', 'meerkat', 'meerval', 'mier', 'miereneter', 'nijlpaard', 'octopus', 'meikever',
    'mol', 'mug', 'muilezel', 'muskusrat', 'narwal', 'postduif', 'nerts', 'neusaap', 'neushoorn', 'nijlgans',
    'oehoe', 'olifant', 'ooievaar', 'orang-oetan', 'orka', 'otter', 'stier', 'stinkdier', 'stokstaartje',
    'paard', 'panda', 'papegaai', 'paradijsvogel', 'parkiet', 'bidsprinkhaan', 'stekelvarken', 'steur',
    'pauw', 'pelikaan', 'pinguïn', 'vogelbekdier', 'poema', 'poolvos', 'lieveheersbeestje', 'luiaard',
    'prairiehond', 'raaf', 'rat', 'reiger', 'rendier', 'reuzenoctopus', 'reuzenpanda', 'roofvogel', 'salamander',
    'slak', 'slang', 'snoek', 'specht', 'sperwer', 'spin', 'roedel', 'kudde', 'schaap', 'schildpad', 'schorpioen',
    'struisvogel', 'tapir', 'tarantula', 'tijger', 'toekan', 'tor', 'kakkerlak', 'wants', 'walvis', 'wasbeer',
    'uil', 'varaan', 'veelvraat', 'vleermuis', 'vlieg', 'vliegend hert', 'vliegende vis', 'vlinder', 'vos',
    'waterbuffel', 'waterrat', 'wezel', 'wild zwijn', 'wolf', 'wombat', 'goudhaan', 'ijsvogel', 'kauw',
    'worm', 'wrattenzwijn', 'zebra', 'zeehond', 'zeeotter', 'bonobo', 'zwarte panter', 'damhert', 'forel',
    'krekel', 'mus', 'vuurvliegje', 'zeepaardje', 'zeeschildpad', 'zwaan', 'zwaluw', 'zwarte mamba',
    'pimpelmees', 'roodborst', 'steenuil', 'zanglijster', 'kraai', 'knobbelzwaan', 'nachtegaal', 'bultrug',
    'tonijn', 'zalm', 'haring', 'makreel', 'kabeljauw', 'paling', 'walrus', 'zeeleeuw', 'bruinvis', 'potvis',
    'kreeft', 'mossel', 'oester', 'pijlinktvis', 'bij', 'wesp', 'hommel', 'vlooien', 'pissebed', 'glimworm',
    'mot', 'haan', 'eend', 'gans', 'kalkoen', 'geit', 'karper', 'baars', 'rog', 'zwaardvis', 'clownvis', 
    'zeester', 'varken', 'ezel', 'pony', 'lam', 'reuzenhaai', 'merel', 'spookdier', 'vis', 'capibara',
    'gordeldier', 'gier', 'papegaaiduiker', 'piranha', 'wandelende tak'
  ];

  const voedsel = [
    'aardappel', 'aardappelpuree', 'aardbei', 'abrikoos', 'amaretto', 'ananas', 'andijvie', 'appelmoes', 'appelsap', 
    'appeltaart', 'asperges', 'avocado', 'bacon', 'bagel', 'baguette', 'balsamico', 'bami', 'banaan', 'hamburger',
    'bananenbrood', 'basilicum', 'biefstuk', 'bier', 'bieslook', 'bietensalade', 'bitterbal', 'bitterkoekje', 'taugé',
    'bladerdeeg', 'blauwe bes', 'bloemkool', 'boerenkool', 'bolognese', 'bonbons', 'bosbessen', 'boterham', 'bouillon',
    'brandnetelsoep', 'broccoli', 'brood', 'brownie', 'bruine bonen', 'caesarsalade', 'karamel', 'nougat', 'carpaccio',
    'cashewnoot', 'champignon', 'cheesecake', 'chipolata', 'chips', 'noten', 'chocolade', 'churros', 'ciabatta', 'tosti',
    'citroen', 'citroentaart', 'cola', 'tapenade', 'corndog', 'couscous', 'cranberrysap', 'croissant', 'crème brûlée',
    'curry', 'omelet', 'dadel', 'donut', 'doperwt', 'drakenvrucht', 'druiven', 'eclairs', 'hummus', 'olijf', 'ei',
    'enchilada', 'energiedrank', 'erwtensoep', 'espresso', 'falafel', 'nasi', 'feta', 'friet', 'frikandel', 'zure room',
    'frisdrank', 'fruitsalade', 'noedels', 'garnaal', 'gazpacho', 'gehaktbal', 'geitenkaas', 'gelato', 'gerst',
    'nectarine', 'gin-tonic', 'goulash', 'granaatappel', 'groenten', 'groentesoep', 'gyros', 'paprika', 'jalapeno',
    'jus', 'kaas', 'kaasfondue', 'kaassoufflé', 'kaneelbroodje', 'parmezaan', 'kappertjes', 'kapsalon', 'kastanje',
    'kerrieworst', 'kersensap', 'kip', 'pasta', 'kipnuggets', 'koffie', 'kokosmelk', 'komkommer', 'koriander', 'kroket',
    'penne', 'kwark', 'kwarktaart', 'lamsvlees', 'lasagne', 'latte', 'limonade', 'salami', 'paella', 'linzen', 'loempia',
    'lychee', 'macaron', 'macaroni', 'mango', 'hazelnoot', 'hotdog', 'marshmallow', 'mayonaise', 'meloensap', 'milkshake',
    'miso', 'mosterd', 'olijfolie', 'perzik', 'pesto', 'piccalilly', 'pindakaas', 'pistache', 'pitabrood', 'pannenkoek',
    'pizza', 'poffertjes', 'pommes frites', 'pompoen', 'popcorn', 'prei', 'mueslireep', 'pruim', 'pulled pork', 'quiche',
    'rabarber', 'radijs', 'ratatouille', 'mozzarella', 'ravioli', 'ricotta', 'rijstpap', 'rijsttafel', 'risotto',
    'rode wijn', 'passievrucht', 'roggebrood', 'rolmops', 'roomijs', 'rozijnen', 'rucola', 'rum', 'ijs', 'muffin',
    'salade', 'sandwich', 'sap', 'satésaus', 'scones', 'selderij', 'honing', 'lolly', 'sinaasappel', 'slagroom',
    'smoothie', 'snoep', 'soep', 'sojasaus', 'poke bowl', 'soufflé', 'spaghetti', 'spek', 'spinazie', 'stamppot',
    'stoofpot', 'zuurvlees', 'strudel', 'suiker', 'sushi', 'taart', 'taco', 'vitamine', 'zonnebloempitten', 'wafel',
    'tartaar', 'teriyaki', 'thee', 'tiramisu', 'toast', 'tomatensaus', 'quinoa', 'tomatensoep', 'tompouce', 'tortilla',
    'truffel', 'ui', 'eiwit', 'vet', 'roti', 'uiensoep', 'vanillepudding', 'vla', 'walnoot', 'watermeloen', 'pecannoot',
    'koolhydraat', 'witlof', 'witte wijn', 'wrap', 'yoghurt', 'zuurkool', 'zuur', 'zout', 'zoet', 'bitter', 'paneermeel',
    'appelstroop', 'beschuit', 'boontjes', 'erwten', 'flensje', 'gehakt', 'gevulde koek', 'hagelslag', 'hutspot',
    'jenever', 'karnemelk', 'kokos', 'krentenbollen', 'pinda', 'kruidenboter', 'melk', 'muesli', 'ontbijtkoek', 'pap',
    'peperkoek', 'pepernoot', 'rijst', 'rookworst', 'speculaas', 'stroopwafel', 'schijf van vijf', 'roomboter', 'eidooier',
    'wentelteefje', 'wittebrood', 'suikerspin', 'aardpeer', 'ansjovis', 'rode kool', 'bamischijf', 'biet', 'bloedworst',
    'brie', 'bami pangang', 'pistolet', 'sambal', 'courgette', 'döner', 'eendenborst', 'eierkoek', 'filet american',
    'panna cotta', 'gember', 'guacamole', 'grillworst', 'havermout', 'inktvisringen', 'ierse koffie', 'kalfsvlees',
    'kapucijners','kaviaar','kibbeling', 'knoflook', 'koolraap', 'kruidnoten', 'lekkerbek','leverworst', 'limoen',
    'maïs', 'mandarijn', 'matse', 'merengue', 'nasischijf', 'nootmuskaat', 'oliebol', 'paaseitje', 'paksoi', 
    'sardientje', 'saté', 'saucijzenbroodje', 'shoarma', 'snert', 'sparerib', 'spruitje', 'stokbrood', 'tapas',
    'tofu', 'venkel', 'wasabi', 'borrelplank', 'wortel', 'vijgen', 'visstick', 'worstenbroodje', 'kauwgom',
    'laurierblad', 'tijm', 'kaneel', 'chilipeper', 'witte peper', 'zelfrijzend bakmeel', 'gist', 'basterdsuiker'
  ];

  const koken = [
    'bakker', 'chef-kok', 'kok', 'aardappelschiller', 'magnetron', 'heteluchtoven', 'kookplaat', 'airfryer',
    'blender', 'mixer', 'waterkoker', 'rijstkoker', 'slowcooker', 'barbecue', 'snijplank', 'restaurant',
    'wokpan', 'braadpan', 'koekenpan', 'steelpan', 'rasp', 'zeef', 'kookwekker',  'pollepel', 'soeplepel',
    'maatbeker', 'ovenwant', 'vergiet', 'aluminiumfolie', 'bakpapier', 'onderzetter', 'soepkom', 'bestek',
    'koksmes', 'theelepel', 'spatel', 'lepel', 'vork', 'pepermolen', 'garde', 'deegroller', 'taartvorm',
    'broodplank', 'pizzasnijder', 'fluitketel', 'blikopener', 'kurkentrekker', 'kookboek', 'schort', 'diner',
    'weegschaal', 'bakplaat', 'beslagkom', 'knoflookpers', 'broodrooster', 'sapcentrifuge', 'aanrecht', 'amuse',
    'bakkerij', 'koken', 'bakken', 'braden', 'recept', 'frituren', 'grillen', 'roosteren', 'wokken', 'maaltijd',
    'sudderen', 'pocheren', 'blancheren', 'marineren', 'karamelliseren', 'glaceren', 'flamberen', 'menu',
    'inkoken', 'kneden', 'schillen', 'afgieten', 'proeven', 'keukenrol', 'theedoek', 'servet', 'catering',
    'kruidenrek', 'afzuigkap', 'spuitzak', 'springvorm', 'keuken', 'wafelijzer', 'tosti-ijzer', 'voorgerecht',
    'broodmes', 'schilmesje', 'vleeshamer', 'mengkom', 'ovenschaal', 'roerbakken', 'bijgerecht', 'hoofdgerecht',
    'portie', 'smaakmaker', 'frituurpan', 'inductieplaat', 'staafmixer', 'cakevorm', 'ovenrek', 'nagerecht',
    'conserveren', 'fileren', 'snipperen', 'ontdooien', 'bereidingstijd', 'Gordon Ramsey', 'toetje',
  ];

  const beroepen = [
    'acrobaat', 'archeoloog', 'stand-upcomedian', 'monteur', 'notaris', 'socioloog', 'architect',
    'blogger', 'botanicus', 'brandweerman', 'buschauffeur', 'circusdirecteur', 'clown', 'automonteur',
    'voetbalcoach', 'cowboy', 'croupier', 'danser', 'dansleraar', 'data-analist', 'handelaar', 'hovenier',
    'dierenarts', 'dierentrainer', 'diplomaat', 'documentairemaker', 'schoenmaker',
    'dronepiloot', 'duikinstructeur', 'econoom', 'ethisch hacker', 'examinator', 'beveiliger',
    'gids', 'glazenwasser', 'illusionist', 'grafisch ontwerper', 'kassière', 'tegelzetter', 'pedicure',
    'informaticus', 'ingenieur', 'inspecteur', 'kraamverzorger', 'begeleider', 'lasser', 'leraar',
    'jongleur', 'journalist', 'juwelier', 'astroloog', 'slager', 'kapitein', 'luchtverkeersleider',
    'makelaar', 'matroos', 'meteoroloog', 'microbioloog', 'kruidenier', 'stadsplanner', 'klusjesman',
    'opticien', 'piloot', 'politicoloog', 'postbode', 'stoffeerder', 'loodgieter', 'sommelier', 'ober',
    'strateeg', 'stratenmaker', 'stuntman', 'systeembeheerder', 'visser', 'vliegtuigbouwer', 'vuilnisman',
    'tatoeëerder', 'taxichauffeur', 'taxidermist', 'timmerman', 'tolk', 'kweker', 'wijnboer', 'kustwacht',
    'trainer', 'tuinman', 'verpleegkundige', 'verzekeringsagent', 'lobbyist', 'undercoveragent', 'pionier',
    'winkelier', 'wiskundige', 'woordvoerder', 'zeebioloog', 'zeiler', 'diëtist', 'schildwacht', 'bioloog',
    'aannemer', 'burgemeester', 'cabaretier', 'ijsverkoper', 'kaarsenmaker', 'profvoetballer', 'barista',
    'ambtenaar', 'animator', 'auteur', 'bankier', 'belastingadviseur', 'hoefsmid', 'bibliothecaris',
    'marketeer', 'masseur', 'muziekleraar', 'ondernemer', 'penningmeester', 'drogist', 'elektricien',
    'politiecommissaris', 'rechter', 'rijinstructeur', 'secretaris', 'vakkenvuller', 'fietsenmaker',
    'stadsgids', 'stewardess', 'vertaler', 'forensisch arts', 'marechaussee', 'vrachtwagenchauffeur',
    'conducteur', 'douanier', 'ecoloog', 'figurant', 'investeerder', 'kraanmachinist', 'straatveger',
    'machinist', 'molenaar', 'parkeercontroleur', 'recruiter', 'receptionist', 'vrijwilliger', 'acteur',
    'trambestuurder', 'kapper', 'reisleider', 'restaurateur', 'stukadoor', 'wegwerker', 'webdesigner',
    'producent', 'zwemleraar', 'gameontwikkelaar', 'reddingswerker', 'schoonmaker', 'glasblazer'
  ];

  const sport = [
    'aerobics', 'alpineskiën', 'american football', 'atletiek', 'badminton', 'taekwondo',
    'balletdansen', 'basketbal', 'beachvolleybal', 'bergsport', 'biatlon', 'bingo', 'trofee',
    'biljarten', 'BMX', 'bobslee', 'boksen', 'bowling', 'breakdance', 'doping', 'boomerang',
    'cricket', 'curling', 'dammen', 'diepzeeduiken', 'discgolf', 'discuswerpen', 'ganzenbord',
    'dressuur', 'duiken', 'e-sporten', 'estafette', 'fietsen', 'freerunning', 'tennis',
    'frisbee', 'gewichtheffen', 'gokken', 'golfen', 'gymnastiek', 'handbal', 'tafeltennis',
    'hardlopen', 'hengelen', 'hindernisloop', 'hockey', 'hoogspringen', 'hordelopen',
    'ijshockey', 'jiu-jitsu', 'joggen', 'judo', 'kaatsen', 'kanoën', 'turnen', 'snorkelen',
    'karate', 'karting', 'kegelen', 'kitesurfen', 'klimmen', 'klimwand', 'trail running',
    'knikkeren', 'kogelstoten', 'korfbal', 'krachttraining', 'kunstrijden', 'lacrosse',
    'langebaanschaatsen', 'longboarden', 'marathon', 'minigolf', 'motorcross', 'motorsport',
    'mountainbiken', 'netbal', 'nordic walking', 'paardrijden', 'padel', 'paintball', 'varen',
    'parachutespringen', 'parcours', 'pétanque', 'polsstokhoogspringen', 'powerlifting',
    'ringsteken', 'rodeo', 'roeien', 'rolschaatsen', 'rugby', 'trampolinespringen', 'triatlon',
    'schaatsen', 'schaken', 'schansspringen', 'scrabble', 'sjoelen', 'skeeleren', 'veldrijden',
    'skeleton', 'skiën', 'skislalom', 'snowboarden', 'softbal', 'speerwerpen', 'verspringen',
    'spijkerpoepen', 'squash', 'stoeien', 'suppen', 'surfen', 'synchroonzwemmen', 'trefbal',
    'vliegeren', 'vliegvissen', 'voetbal', 'volleybal', 'wandelen', 'beachtennis', 'langlaufen',
    'waterpolo', 'waterskiën', 'wakeboarden', 'wedstrijdvissen', 'wielrennen', 'worstelen',
    'yoga', 'zeilen', 'zwemmen', 'schermen', 'kwartetten', 'sumoworstelen', 'windsurfen', 'jagen',
    'abseilen', 'kampioensbeker', 'medaille', 'stopwatch', 'borduren', 'breien', 'touwtrekken',
    'dartpijl', 'flipperkast', 'gele kaart', 'rode kaart', 'schaakbord', 'kleiduivenschieten',
    'trampoline', 'vogelspotten', 'stoepkrijten', 'weven', 'escaperoom', 'kogelslingeren',
    'halfpipe', 'rolstoelbasketbal', 'dansen', 'salsadansen', 'linedance', 'volksdansen',
    'kampvuur maken', 'boogschieten', 'survivallen', 'kajakken', 'raften', 'skateboarden',
    'puzzelen', 'bordspel', 'videospellen', 'kamperen', 'crossfit', 'boot camp', 'lasergame',
    'spinning', 'kickboksen', 'speedklimmen', 'zaalvoetbal', 'rolstoeltennis', 'paragliding',
    'tafeltennistafel', 'voetbalnet', 'basketbalring', 'hockeystick', 'tennisracket',  'domino',
    'modeltrein', 'legoblokje', 'puzzelstuk', 'kaarten', 'monopoly', 'dobbelsteen', 'fierljeppen'
  ];

  const natuur = [
    'aardbeving', 'aardverschuiving', 'algen', 'atlas', 'bamboe', 'bergtop', 'rots',
    'blad', 'bliksem', 'bloem', 'boom', 'bos', 'branding', 'zwerfkei', 'eb', 'rotsbodem',
    'brandnetels', 'bronwater', 'bui', 'cactus', 'compost', 'dauw', 'delta', 'savanne',
    'ecosysteem', 'fjord', 'fossiel', 'getijden', 'geiser', 'goud', 'strand', 'dijk',
    'greppel', 'hagel', 'herfst', 'herfstblad', 'heuvel', 'hittegolf', 'storm', 'duin',
    'ijsberg', 'ijspegel', 'ijsschots', 'ijsvorming', 'inham', 'keien', 'loof', 'mos',
    'kiezel', 'klif', 'koraal', 'koraalrif', 'lavastroom', 'lente', 'droogte', 'monsoen',
    'luchtvochtigheid', 'mangrovebos', 'maretak', 'meander', 'mist', 'modder', 'moeras',
    'oase', 'oceaan', 'orkaan', 'paddenstoel', 'paddenvijver', 'dennennaald', 'morgenrood',
    'plas', 'poollicht', 'regen', 'regenboog', 'regenbui', 'regenwoud', 'hars', 'naaldboom',
    'schemering', 'schimmel', 'sneeuw', 'sneeuwvlok', 'sneeuwstorm', 'steengroeve', 'nevel',
    'toendra', 'tornado', 'tropische regen', 'tsunami', 'tulp', 'uiterwaarde', 'roos',
    'vallei', 'veen', 'veld', 'vijver', 'vlakte', 'vloed', 'wild', 'stikstof', 'archipel',
    'vulkaan', 'vulkaanuitbarsting', 'waterval', 'weide', 'windvlaag', 'woestijn', 'stekel',
    'wolk', 'woud', 'zandstorm', 'zeewind', 'zomer', 'marmer', 'stroomversnelling', 'rivier',
    'zonsondergang', 'zonsopgang', 'schelp', 'schaduw', 'berk', 'eik', 'ravijn', 'vlierbes',
    'graan', 'kastanjeboom', 'klaver', 'korenbloem', 'lavendel', 'meidoorn', 'braamstruik',
    'narcis', 'populier', 'wilg', 'viooltje', 'afgrond', 'gletsjer', 'zee', 'lagedrukgebied',
    'lawine', 'draaikolk', 'turbulentie', 'akker', 'beek', 'bergpas', 'kurk', 'struikgewas',
    'bloemenveld', 'bosbrand', 'bospad', 'bron', 'dode boom', 'eiland', 'jager',  'bosje',
    'erosie', 'grasland', 'grot', 'jungle', 'kustlijn', 'natuur', 'boswachter', 'bosrand',
    'volle maan', 'onweersbui', 'oerbos', 'permafrost', 'polder', 'fermentatie', 'stroompje',
    'rivieroever', 'rotsklif', 'schors', 'steentijd', 'steppegras', 'waterlelie', 'riet',
    'stroomgebied', 'stuifzand', 'terp', 'waterput', 'wildernis', 'stofwolk', 'heide',
    'windstil', 'zandbank', 'zandvlakte', 'zeebodem', 'zeestroming', 'zeewier', 'koolzaad',
    'zilt', 'zoetwatermeer', 'zonnestraling', 'zonsverduistering', 'zoutvlakte', 'zonnebloem',
    'es', 'iep', 'beuk', 'hulst', 'klimop', 'varens', 'stromend water', 'madeliefje', 'distel',
    'steen', 'zeegras', 'braam', 'eikel', 'dennenappel', 'framboos', 'boomgaard', 'boterbloem',
    'vruchtvlees', 'stuifmeel', 'dooi', 'rijp', 'ijzel', 'aardkorst', 'lelie', 'magma', 'munt',
    'bladerdek', 'conifeer', 'den', 'gebergte', 'graniet', 'horizon', 'kalksteen', 'vloedgolf',
    'fotosynthese', 'riviermonding', 'winter', 'wind', 'sloot', 'wad', 'zwam'
  ];

  const vervoer = [
    'aanhanger', 'achtbaan', 'ambulance', 'benzine', 'tankstation', 'Boeing',
    'boot', 'brandweerwagen', 'bromfiets', 'bus', 'camper', 'GPS', 'achteruitkijkspiegel',
    'caravan', 'catamaran', 'containerschip', 'diesel', 'driewieler', 'vrachtwagen',
    'drone', 'dubbeldekker', 'duikboot', 'elektrische auto', 'elektrische scooter',
    'fietsendrager', 'fietstaxi', 'forens', 'vrachtschip', 'gondel', 'gondelbaan',
    'graafmachine', 'hangbrug', 'helikopter', 'hoogspoortrein', 'hoverboard', 'fatbike',
    'hovercraft', 'intercity', 'internationale trein', 'jetpack', 'jetski', 'kabelbaan',
    'kajak', 'kar', 'lijnbus', 'locomotief', 'metro', 'Mini', 'watervliegtuig', 'buggy',
    'monorail', 'motorfiets', 'nachttrein', 'oplegger', 'pick-uptruck', 'politieauto',
    'postkoets', 'racefiets', 'racewagen', 'reddingsboot', 'rijtuig', 'bushalte',
    'riksja', 'robotaxi', 'roeiboot', 'schip', 'scooterdeeldienst', 'segway', 'tol',
    'slee', 'sleepboot', 'sloep', 'sneltrein', 'speedboot', 'stadsbus', 'luchtballon', 
    'stadsfiets', 'step', 'stoomboot', 'stoomlocomotief', 'SUV', 'taxi', 'bulldozer',
    'touringcar', 'tractor', 'tram', 'trolleybus', 'tuk-tuk', 'veerboot', 'cabrio',
    'zeilschip', 'zijspan', 'zonneauto', 'zweefvliegtuig', 'minivan',
    'fiets', 'elektrische fiets', 'scooter', 'trein', 'zeilboot', 'bijtanken', 'tandem',
    'tankwagen', 'brandstoftanker', 'jacht', 'rubberboot', 'ongeluk', 'waterbus', 'quad',
    'kano', 'vlot', 'waterscooter', 'reddingsvlot', 'onderzeeër', 'waterfiets', 'golfkarretje',
    'stoomtram', 'toeristentrein', 'zweeftrein', 'kampeerbus', 'politiemotor', 'ziekenwagen',
    'brandweerboot', 'politiehelikopter', 'traumahelikopter', 'zeppelin', 'bakfiets', 'ligfiets',
    'sleepwagen', 'deelfiets', 'deelscooter', 'deelstep', 'snelweg', 'ringweg', 'kraanwagen',
    'afrit', 'invoegstrook', 'viaduct', 'tunnel', 'perron', 'spoorwegovergang', 'bagageband',
    'paspoortcontrole', 'vertrekhal', 'aankomsthal', 'landingsbaan', 'vliegtuigtrap', 'jetway',
    'bagage', 'handbagage', 'reistas', 'ov-chipkaart', 'treinkaartje', 'terreinwagen',
    'vliegticket', 'overstap', 'rijbewijs', 'kentekenplaat', 'autopech', 'lekke band', 'lantaarnpaal',
    'rijstrook', 'fietspad', 'kruispunt', 'stoplicht', 'parkeerbon', 'elektrisch rijden', 'shovel',
    'waterstofauto', 'carpoolen', 'pendelen', 'woon-werkverkeer', 'Nationale Spoorwegen', 'sprinter',
    'nachtbus', 'pendelbusje', 'rolstoelbus', 'baggerschip', 'cruiseschip', 'laad- en losplaats',
    'distributiecentrum', 'koelwagen', 'voetpad', 'wandelroute', 'aanlegsteiger', 'privéjet',
    'helipad', 'auto', 'motor', 'wagen', 'huifkar', 'lijkwagen', 'sneeuwschuiver', 'vorkheftruck',
    'schoolbus', 'rolstoel', 'skateboard', 'vouwfiets', 'laadpaal', 'paardentram', 'zebrapad'
  ];

  const plaatsen = [
    'apotheek', 'aquaduct', 'aquarium', 'badhuis', 'wielerbaan', 'skatepark',
    'balie', 'begraafplaats', 'bibliotheek', 'bioscoop', 'bloemenmarkt', 'boekenwinkel',
    'boerderij', 'bouwplaats', 'bowlingbaan', 'brandweerkazerne', 'brouwerij', 'brug',
    'café', 'camping', 'campingterrein', 'casino', 'centrum', 'circus', 'grensovergang',
    'consulaat', 'crematorium', 'dierentuin', 'discotheek', 'fabriek', 'fietsenwinkel',
    'fontein', 'fruitmarkt', 'gemeentehuis', 'grachtenpand', 'manege', 'markt', 'loods',
    'gymnasium', 'haven', 'herberg', 'honkbalstadion', 'hostel', 'hotel', 'tribune', 
    'huis', 'iglo', 'ijsbaan', 'jachthaven', 'kapperszaak', 'kasteel', 'territorium',
    'megabioscoop', 'monument', 'observatorium', 'dolfinarium', 'landgoed', 'molen',
    'paleis', 'parkeergarage', 'pier', 'plein', 'poppenkast', 'roltrap',
    'postkantoor', 'pretpark', 'pyramide', 'racebaan', 'recreatiegebied',
    'ruïne', 'sauna', 'schaatsbaan', 'school', 'silo', 'drielandenpunt',
    'sluis', 'speeltuin', 'sporthal', 'stad', 'stadion', 'stadshuis',
    'strandtent', 'supermarkt', 'tandartspraktijk', 'koffieshop',
    'toren', 'treinstation', 'universiteit', 'vakantiepark', 'kolenmijn', 'luchthaven',
    'villa', 'vliegveld', 'voetgangersgebied', 'vuurtoren', 'watertoren',
    'wegrestaurant', 'windmolen', 'winkelcentrum', 'zwembad',
    'benzinepomp', 'bloemenwinkel', 'boekhandel', 'buurthuis', 'drogisterij', 'garage',
    'ijssalon', 'kiosk', 'nachtwinkel', 'pannenkoekenhuis', 'parkeerplaats',
    'slagerij', 'snackbar', 'sportschool', 'stomerij', 'viswinkel', 'warenhuis',
    'Afrika', 'Azië', 'Europa', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanië',
    'Himalaya', 'Kaspische Zee', 'Mississippi', 'Nijl', 'Noordzee',
    'Sahara', 'Thames', 'Corsica', 'Hawaï', 'Kaukasus', 'Siberië',
    'Sicilië', 'steppe', 'boomhut', 'brandtrap', 'carwash', 'dierenasiel',
    'fietsbrug', 'gemaal', 'graftombe', 'hertenkamp', 'ijsbaantje', 'kasteelgracht',
    'kerkhof', 'kinderdagverblijf', 'klimrek', 'klimbos', 'markthal', 'ansichtkaart',
    'meubelboulevard', 'ophaalbrug', 'plattegrond', 'riolering', 'rotonde',
    'schaapskooi', 'sportpark', 'stadspark', 'stoep', 'uitkijktoren', 'kroeg',
    'visvijver', 'voetbalveld', 'volkstuin', 'wijngaard', 'windpark', 'zonnepark',
    'hutje', 'bungalow', 'studentenhuis', 'flat', 'appartement', 'studio',
    'boerenschuur', 'stal', 'poolcirkel', 'slachthuis'
  ];

  const religie = [
    'reïncarnatie', 'wedergeboorte', 'meditatie', 'ketter', 'kluizenaar',
    'boeddhisme', 'predikant', 'abdij', 'kathedraal', 'kerk', 'klooster',
    'moskee', 'synagoge', 'tempel', 'kapel', 'orthodox', 'heiden', 'begrafenis',
    'christendom', 'islam', 'jodendom', 'hindoeisme', 'sikhisme', 'calvinisme',
    'taoisme', 'reformatie', 'protestantisme', 'katholicisme', 'Maarten Luther',
    'gebed', 'zonde', 'genade', 'verlossing', 'hemel', 'hel', 'Maria', 'beeldenstorm',
    'vagevuur', 'paradijs', 'karma', 'nirvana', 'ziel', 'heilige geest', 'hagenpreek',
    'schepping', 'doop', 'biecht', 'mis', 'besnijdenis', 'offer', 'zegening',
    'pelgrimstocht', 'bedevaart', 'vasten', 'wierook', 'ramadan', 'kruistocht',
    'exorcisme', 'bar mitswa', 'hekserij', 'paus', 'bisschop', 'priester',
    'imam', 'rabbijn', 'monnik', 'non', 'abt', 'dalai lama', 'pastoor', 'dominee',
    'ayatollah', 'apostel', 'profeet', 'heilige', 'martelaar', 'engel', 'aartsengel',
    'messias', 'Jezus', 'Mekka', 'Jeruzalem', 'bedevaartsoord', 'heiligdom', 'ritueel',
    'bijbel', 'koran', 'torah', 'psalm', 'kruis', 'crucifix', 'duivel', 'communie',
    'davidster', 'scepter', 'kloostertuin', 'rozenkrans', 'lot', 'relikwie',
    'talisman', 'amulet', 'altaar', 'God', 'Pasen', 'Kerstmis', 'Pinksteren',
    'Chanoekkah', 'Suikerfeest', 'Offerfeest', 'zondvloed', 'godsdienst',
    'brandstapel', 'Boeddha', 'Allah', 'atheïsme', 'agnost'
  ];

  const fictie = [
    'zeemeermin', 'heks', 'sprookje', 'fabel', 'glazen bol', 'tovenaar',
    'tijdmachine', 'tijdreizen', 'draak', 'eenhoorn', 'vampier', 'weerwolf',
    'zombie', 'trol', 'fee', 'feniks', 'toverstaf', 'vloek', 'legende', 'mythe',
    'sciencefiction', 'bovennatuurlijk', 'spook', 'griffioen', 'centaur', 'spreuk',
    'cycloop', 'yeti', 'fictief', 'parallel universum', 'zwarte magie', 'teleportatie',
    'toverdrank', 'fantasy', 'gnoom', 'ork', 'cyborg', 'Dr. Frankenstein', 'elfjes',
    'demon', 'telepathie', 'helderziend', 'waarzegger', 'gedachtelezen', 'visioen',
    'gedaantewisseling', 'klopgeest', 'superheld', 'Hans Christian Andersen',
    'gebroeders Grim', 'bosnimf', 'reus', 'ondoden', 'onsterfelijkheid',
    'heksenketel', 'sphinx'
  ];

  const literatuur = [
    'thriller', 'roman', 'cliffhanger', 'dystopie', 'utopie', 'horror', 'biografie',
    'held', 'antiheld', 'anticlimax', 'autobiografie', 'Shakespeare', 'Charles Dickens',
    'dagboek', 'verhalenbundel', 'stripboek', 'personage', 'hoofdstuk', 'rijm', 'haiku',
    'monoloog', 'dialoog', 'metafoor', 'ironie', 'satire', 'symbolisch', 'gedicht',
    'schrijver', 'scenarioschrijver', 'dichter', 'komedie', 'tragedie', 'flashback',
    'subplot', 'plottwist', 'Nobel literatuurprijs', 'essay', 'poëzie', 'open eind',
    'hyperbool', 'column', 'columnist', 'copywriter', 'boekenclub', 'boekenlegger',
    'bladwijzer', 'inleiding', 'nawoord', 'register', 'citaat', 'ghostwriter',
    'woordenboek', 'encyclopedie', 'tijdschrift', 'krant', 'bestseller',
    'redacteur', 'auteursrecht'
  ];

  const kunst = [
    'kunstcriticus', 'kunstenaar', 'schilder', 'schilderen', 'schilderij',
    'beeldhouwer', 'verfpalet', 'schildersezel', 'kleurpotlood', 'viltstift',
    'aquarelverf', 'kwast', 'boetseerklei', 'penseel', 'muurschildering', 'film',
    'beeldje', 'standbeeld', 'illustrator', 'fotograaf', 'surrealisme', 'realisme',
    'museumconservator', 'museum', 'galerie', 'theater', 'amfitheater', 'pop-art',
    'olieverf', 'ets', 'mozaïek', 'collage', 'graffiti', 'boetseren', 'abstract', 
    'sculptuur', 'portret', 'stilleven', 'schets', 'canvas', 'spuitbus',
    'Rembrandt', 'Van Gogh', 'Vermeer', 'Mondriaan', 'Picasso', 'ballet',
    'expositie', 'tentoonstelling', 'atelier', 'veilinghuis', 'regisseur',
    'kunstbeurs', 'openluchtmuseum', 'tekenen', 'fotograferen', 'modeontwerper',
    'origami', 'pottenbakken', 'choreograaf', 'danseres', 'camera', 'cameraman'
    
  ];

  const misdaad = [
    'vliegtuigkaping', 'politie', 'cel', 'stelen', 'dreigen', 'criminoloog',
    'afpersen', 'kidnappen', 'smokkelen', 'brandstichten', 'cyberpesten',
    'intimideren', 'op de vlucht zijn', 'executie', 'massamoord', 'overval',
    'terrorisme', 'zelfmoordaanslag', 'bomaanslag', 'ontvoering', 'plaatsdelict',
    'cyberaanval', 'corruptie', 'fraude', 'getuige', 'chantage', 'klokkenluider',
    'slavernij', 'terreurcel', 'dagvaarding', 'radicalisering', 'zwarte markt',
    'forensisch onderzoek', 'vergiftiging', 'detective', 'sheriff', 'hoger beroep',
    'leugendetector', 'handboeien', 'rechercheur', 'politieagent', 'undercover',
    'piraterij', 'gevangenis', 'politiebureau', 'rechtbank', 'gerechtshof',
    'straatrover', 'boef', 'gevangene', 'liquidatie', 'inbraak', 'inbreker',
    'zakkenroller', 'oplichter', 'valsmunterij', 'witwassen', 'moord', 'bodycam',
    'diefstal', 'alibi', 'verdachte', 'aanklacht', 'advocaat', 'celstraf', 'hitman',
    'taakstraf', 'borgsom', 'huiszoeking', 'arrestatie', 'verhoor', 'vonnis',
    'openbaar ministerie', 'rechtszaak', 'vluchtroute', 'vluchtauto', 'gijzelen',
    'ooggetuige', 'vingerafdruk', 'crimineel', 'drugs', 'drugskartel', 'smokkelwaar',
    'heling', 'signalement', 'misdrijf', 'delict', 'tbs', 'vrijspraak', 'bloedspoor',
    'conflict', 'moordwapen', 'seriemoordenaar', 'losgeld', 'enkelband', 'bewijsstuk', 
    'huisarrest', 'drugsdealer', 'stalking', 'phishing', 'maffia', 'geweld'
  ];

  const acties = [
    'applaudisseren', 'fluisteren', 'gebaren', 'gooien', 'graven', 'huppelen', 'rollen',
    'ijsberen', 'klunen', 'knuffelen', 'kruipen', 'lachen', 'aanvallen', 'slapen', 'stomen',
    'lopen', 'maaien', 'naaien', 'omhelzen', 'pesten', 'rennen', 'schreeuwen', 'struikelen',
    'vallen', 'vangen', 'verstoppen', 'vliegen', 'vouwen', 'waggelen', 'helpen', 'hijsen',
    'wiebelen', 'afrekenen', 'afscheid nemen', 'bellen', 'betalen', 'huilen',
    'bewaken', 'bidden', 'blozen', 'branden', 'brengen', 'breken', 'buigen', 'argumenteren',
    'dagdromen', 'delen', 'douchen', 'drinken', 'duwen', 'ademhalen', 'hangen', 'snurken',
    'eten', 'fluiten', 'gapen', 'geven', 'giechelen', 'gillen', 'gluren', 'groeten',
    'inschenken', 'inslapen', 'juichen', 'kijken', 'klagen', 'kloppen', 'tikken',
    'knipogen', 'kopen', 'leren', 'lezen', 'liegen', 'luisteren', 'trappen', 'opruimen',
    'meten', 'nabootsen', 'nadenken', 'omvallen', 'onderhandelen', 'ophangen', 'opstaan',
    'plukken', 'praten', 'proberen', 'roepen', 'ruiken', 'ruilen', 'betoveren', 'plannen',
    'schelden', 'schminken', 'schrijven', 'schuilen', 'schuiven', 'slepen', 'pakken',
    'smeken', 'snijden', 'sparen', 'speuren', 'stoppen', 'verdedigen', 'schudden', 
    'strelen', 'studeren', 'telefoneren', 'twijfelen', 'uitleggen', 'uitpakken', 'roken',
    'verbergen', 'verdwalen', 'vergeten', 'verkopen', 'verliezen', 'verrassen', 'roeren',
    'verzorgen', 'vluchten', 'volgen', 'wachten', 'wassen', 'weggooien', 'inhalen', 'hakken',
    'werken', 'winnen', 'wroeten', 'zoeken', 'zwaaien', 'niezen', 'veroveren', 'oversteken',
    'sluipen', 'brandblussen', 'eerste hulp verlenen', 'blindoeken', 'een geheim bewaren',
    'misleiden', 'in de rij staan', 'rijbewijs halen', 'piekeren', 'overwinnen', 'piepen',
    'verslikken', 'hinkelen', 'touwtjesspringen', 'zwijgen', 'triomferen', 'takelen',
    'haasten', 'vervelen', 'achtervolgen', 'bazelen', 'broeden', 'sleutels verliezen',
    'bedanken', 'begroeten', 'beschermen', 'bewonderen', 'boeren', 'controleren',
    'debatteren', 'demonstreren', 'flirten', 'herkennen', 'hijgen', 'improviseren',
    'jongleren', 'knijpen', 'krabben', 'kwispelen', 'mompelen', 'ontsnappen', 'plassen',
    'sluimeren', 'snuffelen', 'stampen', 'staren', 'steigeren', 'trillen', 'migreren',
    'wentelen', 'woelen', 'zuchten', 'reizen', 'bewijzen', 'dromen', 'schipbreuk lijden',
    'herinneren', 'liefhebben', 'oplossen', 'pech hebben', 'teweegbrengen', 'aarzelen',
    'roddelen', 'rusten', 'vertrouwen', 'markeren', 'imiteren', 'afwachten', 'zingen',
    'sms-en', 'appen', 'mailen', 'posten', 'liken', 'kwetsen', 'doneren', 'metselen',
    'googelen', 'typen', 'kopiëren', 'plakken', 'opslaan', 'printen', 'uitbuiten', 
    'filmen', 'livestreamen', 'opnemen', 'afspelen', 'pauzeren', 'openen', 'schroeven',
    'sluiten', 'vergrendelen', 'ontgrendelen', 'instellen', 'bestellen', 'pinnen', 'boren',
    'bezorgen', 'inpakken', 'sjouwen', 'tillen', 'dragen', 'uitstellen', 'timmeren', 'zagen',
    'spelen', 'stampvoeten', 'opdrukken', 'rekken', 'afwassen', 'confronteren', 'prikken',
    'manipuleren', 'dweilen', 'knippen', 'logeren', 'ontbijten', 'strijken', 'stofzuigen',
    'vegen', 'beschuldigen', 'commanderen', 'condoleren', 'feliciteren', 'rijden',
    'geruststellen', 'hinderen', 'omkijken', 'troosten', 'vergeven', 'waarschuwen',
    'downloaden', 'kleien', 'updaten', 'blaffen', 'grazen', 'grommen', 'kauwen',
    'slikken', 'spugen', 'beslissen', 'fantaseren', 'inbeelden', 'slenteren',
    'organiseren', 'peinzen', 'raden', 'vergelijken', 'voorspellen'
  ];

  const emoties = [
    'blij', 'tevreden', 'angstig', 'enthousiast', 'opgewonden', 'ontspannen', 'territoriaal',
    'alert', 'gestrest', 'paniekerig', 'energiek', 'traag', 'actief', 'bescheiden', 'karakteristiek',
    'leergierig', 'nieuwsgierig', 'onzeker', 'jaloers', 'gefrustreerd', 'verdrietig', 'narcisme',
    'somber', 'teleurgesteld', 'eenzaam', 'verveeld', 'opgelucht', 'trots', 'egoïstisch', 'humaan',
    'beschaamd', 'schuldig', 'wantrouwig', 'achterdochtig', 'hoopvol', 'gespannen', 'schuw', 'logisch',
    'overprikkeld', 'nerveus', 'onrustig', 'overbelast', 'prikkelbaar', 'uitgeput', 'tam', 'ethisch',
    'speels', 'sociaal', 'teruggetrokken', 'vermijdend', 'aanhankelijk', 'onafhankelijk', 'absurd',
    'gehoorzaam', 'koppig', 'impulsief', 'voorzichtig', 'minderwaardig', 'opgefokt', 'stoïcijns',
    'confronterend', 'meegaand', 'dominant', 'agressief', 'onderdanig', 'hyperactief', 'sceptisch',
    'loom', 'passief', 'gefocust', 'afgeleid', 'doelgericht', 'lui', 'arrogant', 'eerlijk',
    'volhardend', 'dankbaar', 'voldaan', 'content', 'geïnspireerd', 'verbonden', 'machteloos',
    'geliefd', 'optimistisch', 'zelfverzekerd', 'boos', 'woedend', 'geïrriteerd', 'wanhopig',
    'overweldigd', 'kalm', 'slaperig', 'futloos', 'verward', 'besluiteloos', 'pessimistisch',
    'gefixeerd', 'creatief', 'dromerig', 'empathisch', 'zorgzaam', 'afstandelijk', 'onbeleefd',
    'kritisch', 'behulpzaam', 'perfectionistisch', 'zenuwachtig', 'bang', 'verrast', 'vrolijk',
    'verlegen', 'geduldig', 'eigenwijs', 'moedig', 'vergevingsgezind', 'afwezig', 'gewoontedier',
    'euforisch', 'vreedzaam', 'gepassioneerd', 'radeloos', 'gastvrij', 'suf', 'wraakzuchtig',
    'rationeel', 'ambitieus', 'zorgeloos', 'roekeloos', 'gul', 'vrijgevig', 'gierig', 'nonchalant',
    'fanatiek', 'betrouwbaar', 'onverschillig', 'assertief', 'cynisch', 'verstrooid',
    'bewust', 'materialistisch'
  ];

  const landen = [
    'Afghanistan', 'Albanië', 'Algerije', 'Argentinië', 'Armenië', 'Australië',
    'Azerbeidzjan', 'Bahrein', 'Bangladesh', 'Barbados', 'België', 'Bhutan',
    'Bolivia', 'Botswana', 'Bosnië-Herzegovina', 'Brazilië', 'Brunei', 'Bulgarije',
    'Cambodja', 'Canada', 'Chili', 'China', 'Colombia', 'Comoren', 'Congo',
    'Cuba', 'Denemarken', 'Duitsland', 'Ecuador', 'Egypte', 'Ethiopië',
    'Fiji', 'Filippijnen', 'Finland', 'Frankrijk', 'Georgië', 'Ghana',
    'Griekenland', 'Guatemala', 'Haïti', 'Honduras', 'Hongarije', 'Ierland',
    'IJsland', 'Indonesië', 'Irak', 'Iran', 'Israël', 'Italië',
    'Jamaica', 'Japan', 'Jemen', 'Jordanië', 'Kazachstan', 'Kenia',
    'Kosovo', 'Kroatië', 'Laos', 'Letland', 'Libanon', 'Liberia',
    'Libië', 'Litouwen', 'Luxemburg', 'Maldiven', 'Maleisië',
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
    'Vaticaanstad', 'Wit-Rusland', 'Centraal-Afrikaanse Republiek', 'Trinidad en Tobago',
    'Kaapverdië', 'Dominica', 'Palestina', 'Schotland', 'Wales', 'Catalonië',
    'Koerdistan', 'Tibet', 'Puerto Rico', 'Groenland', 'Aruba', 'Curaçao',
    'Bermuda', 'Gibraltar', 'Frans-Guyana', 'Tahiti', 'Sint Maarten'
  ];

  const wetenschap = [
    'algoritme', 'ampère', 'atoom', 'atoomkern', 'barometer', 'biologie', 'scheikundige',
    'controlegroep', 'correlatie', 'deeltjesversneller', 'DNA', 'elektriciteit', 'celsius',
    'elektron', 'element', 'evolutie', 'experiment', 'thermometer',
    'gen', 'genetica', 'geologie', 'golflengte', 'grafiek', 'histogram', 'nucleaire reactor',
    'foutmarge', 'frequentie', 'frictie', 'geigerteller', 'geleider', 'gemiddelde', 'celkern',
    'hologram', 'hypothese', 'implosie', 'infrarood', 'informatica', 'isolatie', 'centrifuge',
    'joule', 'kelvin', 'kernfusie', 'kernsplijting', 'kilogram', 'robot', 'bunsenbrander',
    'laboratorium', 'laboratoriumjas', 'laser', 'licht', 'loep', 'magneet', 'paradox', 'pipet',
    'mediaan', 'meting', 'meteorologie', 'meter', 'microbiologie', 'microscoop', 'pesticide',
    'mitochondriën', 'modus', 'molecuul', 'mutatie', 'mysterie', 'nauwkeurigheid', 'pH-waarde',
    'natuurkunde', 'neutron', 'observatie', 'ondertoon', 'onderzoeksinstituut', 'oxidatie',
    'proton', 'publicatie', 'radioactiviteit', 'reactie', 'reageerbuisje', 'chromosoom',
    'reductie', 'relatief', 'replica', 'RNA', 'scheikunde', 'spanning', 'straling',
    'spectrum', 'staafdiagram', 'standaard', 'statistiek', 'steekproef', 'stroom', 'precisie',
    'supergeleider', 'supergeluid', 'taartdiagram', 'theorie', 'transistor', 'trilling',
    'ultraviolet', 'variabele', 'verbinding', 'vergrootglas', 'watt', 'weerspiegeling',
    'weerstand', 'wiskunde', 'zuurgraad', 'laborant', 'toxicoloog', 'wetenschapper'
  ];

  const geneeskunde = [
    'placebo', 'acupunctuur', 'ader', 'adrenaline', 'allergie', 'amputatie', 'anesthesie',
    'antibiotica', 'autopsie', 'behandeling', 'beroerte', 'besmetting', 'bewusteloos',
    'bloedarmoede', 'bloeddruk', 'bloedgroep', 'bloedonderzoek', 'claustrofobie', 'coma',
    'defibrillator', 'dementie', 'depressie', 'desinfecteren', 'diagnose', 'dialyse',
    'doofstom', 'dwangbuis', 'echo', 'enzym', 'epidemie', 'homeopathie', 'bacterie',
    'geheugenverlies', 'hallucinatie', 'hartstilstand', 'hersenletsel', 'hersenspoeling',
    'hoogtevrees', 'hormoon', 'hypnose', 'hysterie', 'immuunsysteem', 'infectie', 'blind',
    'injectie', 'keizersnede', 'medicijn', 'migraine', 'MRI', 'virus', 'kleurenblind',
    'obsessie', 'onderbewustzijn', 'operatie', 'overdosis', 'overlevingsdrang', 'pandemie',
    'paranoia', 'persoonlijkheid', 'pijnstiller', 'plasma', 'pols', 'psychiatrie', 'ziekte',
    'PTSS', 'quarantaine', 'reflex', 'reflectie', 'rehabilitatie', 'ontsteking', 'ziekenhuis',
    'röntgenfoto', 'scalpel', 'schizofrenie', 'stethoscoop', 'stigma', 'stoornis', 'doof',
    'surrogaatmoeder', 'symptoom', 'transplantatie', 'tunnelvisie', 'vaccinatie', 'vaccin',
    'fractuur', 'hechting', 'zwelling', 'reanimatie', 'verband', 'narcose', 'long', 'hart',
    'nier', 'lever', 'alvleesklier', 'galblaas', 'schildklier', 'dikke darm', 'spieren',
    'chemotherapie', 'prothese', 'pacemaker', 'bloedsuiker', 'cholesterol', 'botten',
    'litteken', 'tumor', 'kanker', 'leukemie', 'diabetes', 'astma', 'reuma', 'alzheimer',
    'parkinson', 'burnout', 'bipolaire', 'anorexia', 'obesitas', 'hartritme', 'bloedvat',
    'zenuwstelsel', 'orgaandonatie', 'EHBO-kit', 'apotheker', 'cardioloog', 'chiropractor',
    'chirurg', 'verzorger', 'dermatoloog', 'hersenchirurg', 'gynaecoloog', 'immunoloog',
    'kinderarts', 'neuroloog', 'radioloog', 'psycholoog', 'orthopeed', 'revalidatiearts', 
    'farmaceut', 'fysiotherapeut', 'ziekenhuisdirecteur', 'huisarts', 'psychiater',
    'hypnotherapeut', 'dokter', 'therapeut', 'verloskundige', 'zorgverlener', 'oogarts'
  ];

  const politiek = [
    'anarchie', 'democratie', 'dictator', 'fascisme', 'imperialisme', 'nationalisme', 'kamerlid',
    'diplomatie', 'bureaucratie', 'legitimiteit', 'avondklok', 'belasting', 'lobby', 'fractie',
    'revolutie', 'staking', 'volksopstand', 'vluchteling', 'sancties', 'schandaal', 'wethouder',
    'censuur', 'crisis', 'oligarchie', 'soevereiniteit', 'vetorecht', 'xenofobie', 'gemeenteraad',
    'dilemma', 'discriminatie', 'erfenis', 'faillissement', 'fusie', 'stakingsrecht', 'provincie',
    'globalisering', 'herverdeling', 'immigratie', 'lockdown', 'recessie', 'referendum',
    'monopolie', 'nepnieuws', 'onteigening', 'polarisatie', 'populisme', 'propaganda', 'rente',
    'schijnheilig', 'taboe', 'uitzetting', 'verjaring', 'vervreemding', 'beschaving', 'mening',
    'coalitie', 'oppositie', 'verkiezingen', 'stemmen', 'verkiezingscampagne', 'vlag', 'EU',
    'minister', 'staatssecretaris', 'premier', 'president', 'koning', 'parlement', 'traditie',
    'senaat', 'grondwet', 'wet', 'amendement', 'motie', 'debat', 'nieuws', 'solidariteit',
    'beleid', 'maatregel', 'subsidie', 'bezuiniging', 'begroting', 'nationalisatie', 'NAVO',
    'ambassade', 'consul', 'staatshoofd', 'topontmoeting', 'vredesakkoord', 'hiërarchie',
    'resolutie', 'handelsoorlog', 'mensenrechten', 'vrijheid van meningsuiting', 'persvrijheid',
    'integratie', 'asielzoeker', 'statushouder', 'tweede kamer', 'eerste kamer',  'zetel',
    'paspoort', 'douane', 'belastingdienst', 'sociale zekerheid', 'werkloosheid', 'armoede',
    'welvaart', 'inkomensverdeling', 'stembureau', 'kiesdrempel', 'lijsttrekker', 'kandidaat',
    'verkiezingsprogramma', 'coalitieakkoord', 'informateur', 'formateur', 'woningmarkt', 'VN',
    'kabinetsformatie', 'regeerakkoord', 'troonrede', 'prinsjesdag', 'miljoenennota', 'verdrag',
    'belastingaangifte', 'toeslagen', 'uitkering', 'pensioen', 'zorgverzekering', 'privatisering',
    'hypotheekrenteaftrek', 'minimumloon', 'CAO', 'vakbond', 'werkgeversorganisatie',
    'petitie', 'demonstratie', 'burgerrechten', 'grondrechten', 'privacywet', 'gelijkheid',
    'desinformatie', 'transparantie', 'integriteit', 'gedragscode', 'pressiegroep', 'plagiaat',
    'denktank', 'adviesraad', 'raad van state', 'nationale ombudsman', 'rekenkamer', 'hoge raad',
    'constitutioneel hof', 'europees hof', 'internationaal strafhof', 'arbitrage', 'mediation',
    'scheiding der machten', 'checks en balances', 'stemrecht', 'formatiegesprek', 'rechtsstaat',
    'raadslid', 'gedeputeerde', 'staatsschuld', 'BTW', 'inkomstenbelasting', 'subjectief', 'objectief',
    'vermogensbelasting', 'accijns', 'handelsakkoord', 'handelspartner', 'stelling', 'autonoom',
    'gezondheidszorg', 'pensioenstelsel', 'politieke partij', 'handelsverdrag', 'demissionair kabinet',
    'volksgezondheid', 'pensioenfonds', 'arbeidsongeschiktheid', 'uitkeringsinstantie', 'vice-premier',
    'partijcongres', 'ledenraadpleging', 'coalitiekabinet', 'minderheidskabinet', 'hoorzitting',
    'kamerdebat', 'fractieleider', 'provinciebestuur', 'kabinetscrisis', 'motie van wantrouwen'
  ];

  const muziek = [
    'gitaar', 'basgitaar', 'elektrische gitaar', 'akoestische gitaar', 'ukelele',
    'luit', 'sitar', 'trompet', 'trombone', 'tuba', 'hoorn', 'contrabas', 'banjo',
    'saxofoon', 'klarinet', 'fluit', 'dwarsfluit', 'blokfluit', 'harp', 'uitgever',
    'fagot', 'hobo', 'didgeridoo', 'piano', 'vleugel', 'orgel', 'elpee', 'royalties', 
    'accordeon', 'synthesizer', 'keyboard', 'trommel', 'xylofoon', 'Spotify', 'indie',
    'microfoon', 'luidspreker', 'versterker', 'mengpaneel', 'grammofoon', 'grunge',
    'platenspeler', 'koptelefoon', 'muziekdoos', 'notenbalk', 'orgelpijp', 'hardrock',
    'muziek', 'orkest', 'koor', 'symfonie', 'opera', 'jazz', 'albumhoes', 'heavy metal',
    'blues', 'rock', 'pop', 'rap', 'hiphop', 'klassiek', 'componeren', 'r&b', 'koorlid',
    'reggae', 'soul', 'folk', 'punk', 'metal', 'elektronische muziek', 'muziekvideo',
    'akkoord', 'melodie', 'ritme', 'beat', 'refrein', 'solo', 'altviool', 'platenlabel',
    'concert', 'festival', 'repetitie', 'songtekst', 'opname', 'album', 'live optreden',
    'operazanger', 'componist', 'gitarist', 'drummer', 'pianist', 'violist', 'single',
    'kapelmeester', 'bandlid', 'producer', 'pianospelen', 'djembé', 'dirigent', 'dj', 
    'optreden', 'country', 'gospel', 'latin', 'afrobeat', 'musicus', 'zanger',
    'disco', 'techno', 'house', 'trance', 'drum and bass', 'ambient', 'tenor', 'sopraan',
    'toonladder', 'noot', 'maat', 'tempo', 'dynamiek', 'harmonie', 'podium', 'soundcheck',
    'octaaf', 'interval', 'crescendo', 'panfluit', 'doedelzak', 'groupie', 'cover',
    'mondharmonica', 'kazoo', 'tamboerijn', 'conservatorium', 'cello', 'cassette',
    'songwriter', 'geluidstechnicus', 'lichtontwerper', 'tourmanager', 'koorzanger',
    'akoestisch', 'repetitieruimte', 'muziekschool', 'geluidsinstallatie', 'alt', 'cd',
    'strijkorkest', 'fanfare', 'jazzband', 'rockband', 'liveband', 'remix', 'mashup',
    'popgroep', 'duo', 'trio', 'kwartet', 'solist', 'muziekzaal', 'gitaarsolo',
    'discjockey', 'turntable', 'beatmaker', 'sample', 'viool', 'muziekfestival',
    'openluchtconcert', 'jamsessie', 'nachtclub', 'poppodium', 'trekharmonika',
    'operahuis', 'concertgebouw', 'festivalterrein', 'backstage', 'strijkkwartet',
    'volkslied', 'kinderlied', 'slaapliedje', 'kerstlied', 'hymne',
    'serenade', 'wals', 'polka', 'tango', 'samba', 'rumba',
    'cha-cha-cha', 'foxtrot', 'quickstep', 'slowfox'
  ];

  const kleding = [
    'armband', 'avondjurk', 'handtas', 'horloge', 'ketting', 'badjas', 'pyjama',
    'koffer', 'kroon', 'maillot', 'manchetknoop', 'masker', 'rugzak', 'ochtendjas',
    'naaldhak', 'reddingsvest', 'regenjas', 'spijkerbroek', 'muts', 'poncho', 'cape',
    'zonnebril', 'kleerhanger', 'boodschappentas', 'broek', 'hoed', 'bontjas', 'wol',
    'riem', 'schoen', 'stropdas', 'sjaal', 'shirt', 'wandelstok', 'sandaal', 'tuinbroek', 
    'handschoenen', 'pet', 'bril', 'vest', 'trui', 'heuptas', 'sneaker', 'jurk', 'polo', 
    'rits', 'gesp', 'camouflagepak', 'helm', 'uniform', 'bodywarmer', 'blouse', 'rok',
    'colbert', 'pak', 'smoking', 'kamerjas', 'badpak', 'zwembroek', 'minirok', 'jumpsuit',
    'sokken', 'ondergoed', 'beha', 'bikini', 'laars', 'legging', 'tanktop', 'longsleeve',
    'oorbel', 'trouwring', 'vlinderdas', 'bretels', 'polsband', 'pantoffel', 'kousen',
    'nekwarmer', 'wanten', 'baret', 'tulband', 'haarband', 'haarspeld', 'sleutelhanger',
    'beenwarmers', 'slipper', 'zonneklep', 'portemonnee', 'piercing', 'boxershort',
    'coltrui', 'overhemd', 'hoodie', 'sweater', 'joggingbroek', 'hemd', 'corset',
    'panty', 'klompen', 'veters', 'hijab', 'boerka', 'garderobe'
  ];

  const militair = [
    'soldaat', 'generaal', 'luitenant', 'sergeant', 'korporaal', 'officier', 'genocide',
    'commandant', 'ridder', 'sluipschutter', 'marinier', 'luchtmachtpiloot', 'onderofficier',
    'geweer', 'pistool', 'machinegeweer', 'zwaard', 'bunker', 'fort', 'drietand', 'speer',
    'kanon', 'kanonskogel', 'katapult', 'handgranaat', 'explosief', 'bajonet', 'harnas',
    'munitie', 'torpedo', 'landmijn', 'bom', 'nucleaire bom', 'boog', 'schild', 'gasmasker',
    'bazooka', 'morse', 'vuurpijl', 'harpoen', 'antitankwapen', 'amfibievoertuig', 'kompas',
    'guillotine', 'tank', 'pantservoertuig', 'onderzeeboot', 'vliegdekschip', 'oorlogsschip', 
    'commandopost', 'militaire basis', 'loopgraaf', 'mijnenveld', 'patrouilleboot', 'schieten',
    'invasie', 'guerrilla oorlog', 'coup', 'oorlogsmisdaad', 'wapenhandel', 'burgerwacht',
    'agressor', 'militaire oefening', 'belegering', 'geheime operatie', 'spionage', 'sabotage',
    'capitulatie', 'wapenstilstand', 'tribunaal', 'krijgsraad', 'evacuatie', 'kogelvrij vest',
    'parachute', 'radarscherm', 'infanterie', 'cavalerie', 'artillerie', 'marine', 'verrekijker',
    'luchtmacht', 'landmacht', 'commando', 'parachutist', 'verkenner', 'kazerne', 'nachtkijker',
    'majoor', 'kolonel', 'admiraal', 'veldslag', 'hinderlaag', 'frontlinie', 'gevechtshelikopter',
    'achterhoede', 'vliegbasis', 'militaire begraafplaats', 'marinebasis', 'grenspost', 'checkpoint',
    'mijnenveger', 'verkenningsvliegtuig', 'bommenwerper', 'jachtvliegtuig', 'transportvliegtuig',
    'raketschild', 'luchtafweer', 'radar', 'sonar', 'gevaarlijk', 'gevechtsvliegtuig', 'luchtaanval',
    'wapenopslag', 'munitiedepot', 'schietbaan', 'hindernisbaan', 'geheime boodschap', 'grenscontrole',
    'saluut', 'wachtpost', 'identiteit', 'noodrantsoen', 'veldfles', 'kaartlezen', 'bombardement',
    'veiligheidszone', 'bufferzones', 'neutrale zone', 'demilitarisatie', 'vredesmissie', 'VN-missie',
    'alliantie', 'bezetting', 'vaandel', 'rang', 'staatsgreep', 'wapen', 'veldtent', 'veldhospitaal',
    'bevrijding', 'overwinning', 'nederlaag', 'stadsbelegering', 'blokkade', 'kruisboog',  'konvooi', 
    'embargo', 'oorlogsverklaring', 'mobilisatie', 'dienstplicht', 'huurling', 'militie', 'landkaart',
    'reservist', 'veteraan', 'krijgsgevangene', 'onderscheiding', 'verdedigingslinie', 'terugtrekken',
    'oorlogsgraf', 'herdenkingsmonument', 'militaire parade', 'militaire politie', 'beschietingen',
    'inlichtingendienst', 'geheime dienst', 'informatieoorlog', 'wapenuitrusting', 'lans',
    'scherpschutter', 'bomopruimer', 'pantserdivisie', 'granaatwerper', 'mortier',
    'leger', 'gevecht', 'oorlog', 'strijd', 'concentratiekamp'
  ];

  const gereedschap = [
    'hamer', 'schaar', 'sleutel', 'moersleutel', 'schroefsleutel', 'zaag', 'beitel',
    'hooivork', 'hark', 'gieter', 'borstel', 'ladder', 'moker', 'kettingzaag', 'naaimachine',
    'stroomgenerator', 'windturbine', 'dynamo', 'liniaal', 'waterpas', 'boormachine',
    'spijker', 'smeedijzer', 'telraam', 'betonmixer', 'touwladder', 'zeis',
    'klem', 'verlengsnoer', 'pomp', 'kabel', 'snoer', 'zekering', 'pikhouweel', 'schroevendraaier',
    'waterpomptang', 'steeksleutel', 'inbussleutel', 'schaaf', 'vijl', 'klinknagel', 'snijder',
    'handzaag', 'figuurzaag', 'cirkelzaag', 'schuurmachine', 'decoupeerzaag', 'prikpen', 'punttang',
    'accuboormachine', 'lasapparaat', 'soldeerbout', 'heteluchtpistool', 'schroef', 'gradenboog',
    'bout', 'moer', 'plug', 'haak', 'kram', 'schoffel', 'bladblazer', 'tuinschep', 'stofopvangzak',
    'nagel', 'kittpistool', 'lijmpistool', 'lijmklem', 'bankschroef', 'werkbank', 'luchtcompressor',
    'veiligheidshelm', 'veiligheidsbril', 'werkhandschoenen', 'stofmasker', 'cementmixer', 'meetlint',
    'kruiwagen', 'hefboom', 'katrol', 'handkar', 'palletwagen', 'grasmaaier', 'plamuurmes', 'roerder',
    'hijsband', 'touw', 'steiger', 'koevoet', 'breekijzer', 'schuurpapier', 'noodstroomgenerator',
    'freesmachine', 'bankmes', 'stanleymes', 'dieptemeter', 'kniebeschermer', 'werktafel', 'lijmspuit',
    'verfroller', 'verfblik', 'afplaktape', 'kit', 'siliconekit', 'stoommachine', 'nijptang', 'zaagblad',
    'purschuim', 'isolatiemateriaal', 'ducttape', 'perslucht', 'heggenschaar', 'hijskraan', 'koord',
    'compressor', 'spijkerpistool', 'houtlijm', 'gereedschapskist', 'verfspuit', 'gehoorbescherming',
    'verfafbijter', 'ontvetter', 'ontroesters', 'beschermkapjes', 'sloopkogel', 'gasbrander', 'lasbril'
  ];

  const ruimte = [
    'astronaut', 'ruimtevaart', 'ruimtewetenschapper', 'raket', 'space shuttle', 'ruimtepak',
    'maanlander', 'vliegende schotel', 'satelliet', 'telescoop', 'sterrenwacht', 'ruimtestation',
    'planeet', 'komeet', 'ruimte', 'melkweg', 'zwart gat', 'supernova', 'lanceerplatform', 'maan',
    'sterrenstelsel', 'meteoor', 'meteoriet', 'Mars', 'Venus', 'Jupiter', 'Saturnus', 'zon', 'ster',
    'Mercurius', 'Neptunus', 'Uranus', 'noorderlicht', 'maansverduistering', 'ruimtesonde', 'sterrenbeeld',
    'eclips', 'zwaartekracht', 'dampkring', 'astronomie', 'buitenaards leven', 'maanwandeling', 'Grote Beer',
    'ISS', 'seconde', 'Pluto', 'big bang', 'heelal', 'asteroïde', 'komeetstaart', 'meteorenregen',
    'zuurstoftank', 'landingsgestel', 'lanceerinstallatie', 'CO2-filter', 'maanmissie', 'ruimtewandeling',
    'NASA', 'lichtjaar', 'lichtsnelheid', 'sterrenkunde', 'planetarium', 'vallende ster', 'ruimtecapsule',
    'relativiteitstheorie', 'oerknal', 'botsende sterrenstelsels', 'gewichtloosheid', 'Houston',
    'gasreuzen', 'planetenring', 'alien', 'ufo', 'moederschip', 'ruimtetelescoop', 'Hubble', 'James Webb',
    'magnetische pool', 'poolster', 'evenaar', 'landing op de maan', 'Apollo', 'SpaceX', 'hemellichaam',
    'commerciële ruimtevaart', 'marsrover', 'Voyager', 'kosmonaut', 'luchtsluis', 'koppelingssysteem',
    'Kleine Beer', 'Tweelingen', 'Maagd', 'Waterman', 'krater', 'sterrenkundige', 'zonnepanelen',
    'gyroscoop', 'hitteschild', 'stratosfeer', 'magnetisch veld', 'ruimteschip', 'marslandschap'
  ];

  const huishouden = [
    'wasmachine', 'theemuts', 'doos',
    'beker' , 'wijnglas', 'bezem', 'stofzuiger', 'wasrek', 'toiletborstel', 'afwasborstel',
    'deurbel', 'rolluik', 'vloerkleed', 'lamp', 'gloeilamp', 'wekker', 'gordijn', 'tuintafel',
    'klok', 'boekenkast', 'spiegel', 'tafel', 'stoel', 'bank', 'behang', 'deurmat', 'douchegordijn',
    'wasmand', 'prullenbak', 'schoonmaakmiddel', 'smartphone', 'smartwatch', 'handdoek', 'badmat',
    'zeep', 'shampoo', 'conditioner', 'scheerapparaat', 'haarborstel', 'toiletpapier', 'kachel',
    'deken', 'laken', 'kussensloop', 'matras', 'nachtkastje', 'kledingkast', 'tuinslang', 'tuinstoel',
    'strijkijzer', 'strijkplank', 'dweil', 'stoffer', 'bloempot', 'vaas', 'fotolijst', 'douchekop',
    'theepot', 'koffiepot', 'broodtrommel', 'koektrommel', 'stofdoek', 'mop', 'emmer', 'allesreiniger',
    'schuurspons', 'vaatwasser', 'wasmiddel', 'wasverzachter', 'bijzettafel', 'batterij', 'parasol',
    'salontafel', 'tv-meubel', 'wandkast', 'ladekast', 'dressoir', 'kapstok', 'fotoalbum', 'plantenbak',
    'schoenenrek', 'sprinkler', 'plantenspuit', 'toilettas', 'zeeppomp', 'krat', 'fruitschaal', 'blik',
    'vuilniszak', 'vuilnisbak', 'afvalcontainer', 'papierbak', 'glasbak', 'gft-bak', 'deurklink',
    'plafondlamp', 'spotje', 'antislipmat', 'vloerbedekking', 'asbak', 'afstandsbediening', 'koelkast',
    'parket', 'laminaat', 'tegels', 'nagelvijl', 'pincet', 'bloemperk', 'tuinverlichting', 'vriezer',
    'tuinhek', 'tuinpad', 'vliegenwering', 'vogelbadje', 'vogelhuisje', 'schutting', 'breinaald',
    'vogelvoer', 'tuinaarde', 'bad', 'douche', 'toilet', 'radiator', 'thermostaatknop', 'fles', 'tablet',
    'rookmelder', 'brievenbus', 'buitenlamp', 'wandspiegel', 'washandje', 'badkamerspiegel', 'antenne',
    'antiek', 'ballon', 'balustrade', 'lampion', 'kaars', 'computer', 'dakpan', 'bierglas', 'dekbed',
    'fakkel', 'föhn', 'haardroger', 'hangmat', 'ijsklontjesmaker', 'pakketje', 'oplader', 'cadeau',
    'megafoon', 'neonlamp', 'paraplu', 'lichtschakelaar', 'spelcomputer', 'aansteker',
    'spaarpot', 'wiel', 'rubberen eend', 'scheermes', 'tandenstoker', 'harde schijf', 'powerbank',
    'schommel', 'speelgoed', 'zonnewijzer', 'tandenborstel', 'tandpasta', 'tent', 'kalender', 'haard',
    'knuffelbeer', 'bellenblaas', 'trechter', 'theeglas', 'lampenkap', 'brandblusser', 'tafelkleed',
    'dvd', 'blu-ray', 'lenzen', 'gehoorapparaat', 'kruk', 'tuinkabouter', 'fietspomp', 'wasknijper',
    'kaasschaaf', 'zonnescherm', 'vouwstoel', 'campingstoel', 'stekker', 'kruik', 'spons', 'zaklamp'
  ];

  const kantoor = [
    'nietmachine', 'rekenmachine', 'Post-it',  'agenda', 'aktetas', 'perforator', 'paperclip', 'laptop',
    'usb-stick', 'printer', 'projector', 'scanner', 'headset', 'webcam', 'bureau', 'bureaustoel',
    'whiteboard', 'vergadertafel', 'vergaderzaal', 'ordner', 'map', 'envelop', 'brief', 'briefopener',
    'toetsenbord', 'muis', 'plakband', 'balpen', 'marker', 'prikbord', 'visitekaartje', 'schrift', 
    'postvak', 'factuur', 'offerte', 'contract', 'memo', 'notulen', 'presentatie', 'koffiezetapparaat',
    'vergadering', 'evaluatie', 'kantine', 'kopieermachine', 'archief', 'papier', 'pen', 'potlood',
    'punaise', 'elastiekje', 'notitieblok', 'shredder', 'postzegel', 'inktcartridge', 'kluisje',
    'flexwerk', 'collega', 'baas', 'kantoorpand', 'thuiswerken', 'loonstrook', 'verlof', 'arbeid',
    'reiskosten', 'project', 'checklist', 'functie', 'promotie', 'opslag', 'ontslag', 'werkgever',
    'werknemer', 'brainstorm', 'sollicitatie', 'teambuilding', 'bedrijfsuitje', 'cursus', 'training',
    'directeur', 'manager', 'secretaresse', 'stagiair', 'teamleider', 'leidinggevende', 'boekhouder',
    'accountant', 'muismat', 'laserpointer', 'bureaulamp', 'Excel', 'Powerpoint', 'intranet', 'cloud',
    'overuren', 'ziekteverzuim', 'arbo', 'budget', 'omzet', 'verslag', 'klanten', 'leverancier',
    'deadline', 'receptie', 'koffiepauze', 'lunchpauze', 'handtekening', 'bedrijfswagen', 'leasebak'
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
    'en ze leefden nog lang en gelukkig',
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
    'geen slapende honden wakker maken',
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
    'geduld is een schone zaak',
    'geen nieuws is goed nieuws',
    'na regen komt zonneschijn',
    'nooit te oud om te leren',
    'onbekend maakt onbemind',
    'oude liefde roest niet',
    'spreken is zilver zwijgen is goud',
    'Rome is niet in een dag gebouwd',
    'stille wateren hebben diepe gronden',
    'van hetzelfde laken een pak',
    'ergens je plasje over doen',
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
    'maak dat de kat wijs',
    'de kogel is door de kerk',
    'met de kippen op stok gaan',
    'met een korreltje zout nemen',
    'de bloemetjes buiten zetten',
    'een appeltje voor de dorst',
    'nu komt de aap uit de mouw',
    'een gegeven paard niet in de bek kijken',
    'de plank misslaan',
    'wie A zegt moet ook B zeggen',
    'de puntjes op de i zetten',
    'iets onder de loep nemen',
    'een oogje in het zeil houden',
    'de touwtjes in handen hebben',
    'iets op de lange baan schuiven',
    'het hoofd boven water houden',
    'geen blad voor de mond nemen',
    'de hond in de pot vinden',
    'als een paal boven water staan',
    'iets aan de grote klok hangen',
    'de kool en de geit sparen',
    'het spits afbijten',
    'tussen wal en schip vallen',
    'de handdoek in de ring gooien',
    'op eieren lopen',
    'een gat in de lucht springen',
    'aan het kortste eind trekken',
    'de bakens verzetten',
    'iets uit de duim zuigen'
  ];

  const map = { dieren, voedsel, koken, beroepen, kantoor, sport, huishouden, natuur, vervoer, plaatsen, kunst, kleding, religie, fictie, literatuur, acties, misdaad, emoties, landen, gereedschap, muziek, militair, ruimte, wetenschap, geneeskunde, politiek, spreekwoorden };
  
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
'formatie', 'gesprekken', 'kabinet', 'formatie', 'hypotheekrente', 'rente', 'hypotheek', 'renteaftrek',
'aftrek', 'werkgever', 'organisatie', 'volk', 'vertegenwoordiger', 'inkomsten', 'vermogen', 'belasting', 
'consumenten', 'bescherming', 'campagne', 'arbeid', 'ongeschikt', 'heid', 'minderheid', 'kabinet',
'openlucht', 'concert', 'patrouille', 'verkenning', 'stad', 'belegering', 'inlichtingen', 'gevende',
'stroom', 'generator', 'gereedschap', 'kist', 'aardappel', 'schiller', 'accu', 'boormachine', 'uitje',
'hetelucht', 'pistool', 'werk', 'handschoen', 'bescherming', 'isolatie', 'materiaal', 'istiek',
'maan', 'relativiteit', 'theorie', 'koppeling', 'lanceer', 'installatie', 'weten', 'schapper',
'laboratorium', 'aardappel', 'stamper', 'gezondheid', 'zorg', 'ondergang', 'telescoop', 'ruimte',
'aanslag', 'aardig', 'actie', 'akkoord', 'amfibie', 'apparaat', 'arijs', 'atie', 'aanval', 'tijd',
'baan', 'band', 'basis', 'bedrijf', 'beheer', 'beleid', 'bestuur', 'bom', 'bond', 'bouw', 'tocht',
'cel', 'concentratie', 'crisis', 'damp', 'debat', 'deel', 'deeltje', 'democratie', 'deur', 'dienst',
'energie', 'erij', 'explosie', 'factor', 'fiets', 'front', 'gas', 'gebouw', 'tuin', 'moordenaar',
'geving', 'gever', 'golf', 'graaf', 'grond', 'haven', 'heid', 'herdenking', 'afdruk', 'therapie',
'houder', 'hulp', 'informatie', 'ing', 'isme', 'iteit', 'kamer', 'kamp', 'kampioen', 'kant', 
'kast', 'kern', 'kracht', 'krijgs', 'kunde', 'kwartier', 'leger', 'leider', 'lijn', 'prijs',
'linie', 'logie', 'loos', 'lucht', 'machine', 'macht', 'massa', 'maatregel', 'meester', 
'ment', 'middel', 'minister', 'misdaad', 'monument', 'oord', 'natuurlijk', 'wisseling',
'moord', 'motor', 'nemer', 'neming', 'netwerk', 'nota', 'officier', 'onderhandeling', 
'oorlog', 'overleg', 'oxide', 'pad', 'partij', 'planeet', 'proef', 'punt', 'harmonica',
'raad', 'raam', 'raket', 'recht', 'reis', 'ruimte', 'schap', 'schip', 'schot', 'schutter', 
'scoop', 'sluiting', 'soldaat', 'speler', 'staf', 'stand', 'staat', 'station', 'nationaal',
'stelsel', 'ster', 'stilstand', 'stof', 'stoel', 'straal', 'sturing', 'systeem', 'tafel', 
'transport', 'trein', 'tuig', 'tuigage', 'vaart', 'veld', 'verdrag', 'verdediging', 'verkeer', 
'verkiezing', 'verklaring', 'verlening', 'vlak', 'vlucht', 'voertuig', 'voerder', 'vol', 
'vorming', 'vuur', 'waardig', 'wagen', 'wapen', 'water', 'wedstrijd', 'weer', 'werker', 
'wet', 'wetenschap', 'wiel', 'weg', 'zelfmoord', 'zijde', 'zorg', 'zuur'
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

// Lookup: woord → categorie-object (voor categorielabel in de banner)
const WORD_TO_CATEGORY = {};
for (const cat of CATEGORIES) {
  for (const word of (WORDS_BY_CATEGORY[cat.id] || [])) {
    if (!WORD_TO_CATEGORY[word]) WORD_TO_CATEGORY[word] = cat;
  }
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
  const [teamSizes, setTeamSizes] = useState([2, 2]);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2"]);

  const allCategoryIds = CATEGORIES.map((c) => c.id);
  const allSelected = allCategoryIds.every((id) => selectedCategories.has(id));

  const toggleTeamMode = () => {
    setTeamMode((prev) => {
      if (!prev) {
        setCount(2);
        setTeamSizes([2, 2]);
        setTeamNames(["Team 1", "Team 2"]);
        setNames(Array(4).fill(""));
      } else {
        setCount(3);
        setNames(["Dennis", "Marion", "Theo"]);
      }
      return !prev;
    });
  };

  const addPlayer = () => {
    if (teamMode) {
      if (teamSizes.length < 10) {
        const newTeamSizes = [...teamSizes, 2];
        setTeamSizes(newTeamSizes);
        setTeamNames(prev => [...prev, `Team ${prev.length + 1}`]);
        setNames(prev => [...prev, "", ""]);
        setCount(newTeamSizes.length);
      }
    } else {
      if (names.length < 10) {
        setNames(prev => [...prev, ""]);
        setCount(prev => prev + 1);
      }
    }
  };

  const removePlayer = (index) => {
    if (teamMode) {
      if (teamSizes.length > 2) {
        const newSizes = teamSizes.filter((_, i) => i !== index);
        setTeamSizes(newSizes);
        setTeamNames(prev => prev.filter((_, i) => i !== index));
        let offset = 0;
        for (let i = 0; i < index; i++) offset += teamSizes[i];
        const numToRemove = teamSizes[index];
        setNames(prev => {
          const next = [...prev];
          next.splice(offset, numToRemove);
          return next;
        });
        setCount(newSizes.length);
      }
    } else {
      if (names.length > 2) {
        setNames(prev => prev.filter((_, i) => i !== index));
        setCount(prev => prev - 1);
      }
    }
  };

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

  const toggleCategory = (id) => {
    setSelectedCategories((prev) => {
      if (id === "all") {
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

  const getTeamOffset = (t) => teamSizes.slice(0, t).reduce((a, b) => a + b, 0);

  return (
    <div className="screen">
      <div className="setup-card">
        <div className="logo-area">
          <div className="logo-icon">💬</div>
          <h1 className="logo-title">WoordenRaad</h1>
          <p className="logo-sub">Het raad- en uitbeeldspel</p>
        </div>

        <div className="setup-mode-toggle-group">
          <button
            className={`start-btn mode-toggle-btn mode-toggle-btn-half ${!teamMode ? " mode-toggle-teams" : " mode-toggle-singles"}`}
            onClick={() => !teamMode ? null : toggleTeamMode()}
          >
            👤
          </button>
          <button
            className={`start-btn mode-toggle-btn mode-toggle-btn-half ${teamMode ? " mode-toggle-teams" : " mode-toggle-singles"}`}
            onClick={() => teamMode ? null : toggleTeamMode()}
          >
            👥
          </button>
        </div>

        <div className="setup-section">
          {teamMode ? (
            <div className="teams-setup-wrapper">
              <div className="setup-wrapper-badge">
                TEAMS
              </div>

              <div className="teams-grid">
                {teamSizes.map((size, t) => {
                  const offset = getTeamOffset(t);
                  return (
                    <div key={t} className="team-section-container">
                      <div className="team-header-row">
                        <input
                          className="team-name-input-flat"
                          value={teamNames[t] ?? `Team ${t + 1}`}
                          onChange={(e) => setTeamNames((prev) => prev.map((n, i) => i === t ? e.target.value : n))}
                          maxLength={12}
                        />
                        {teamSizes.length > 2 && (
                          <button className="delete-btn-round" onClick={() => removePlayer(t)} title="Team verwijderen">
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="team-players-list">
                        {Array.from({ length: size }, (_, p) => {
                          const idx = offset + p;
                          return (
                            <div key={idx} className="player-input-group small-group">
                              <div className="player-name-container player-bg">
                                <span className="player-index-badge">{p + 1}</span>
                                <input
                                  className="integrated-name-input"
                                  placeholder={`Speler ${p + 1}`}
                                  value={names[idx] ?? ""}
                                  onChange={(e) => updateName(idx, e.target.value)}
                                  maxLength={16}
                                />
                              </div>
                              {size > 2 && (
                                <button className="integrated-delete-btn btn-subtle" onClick={() => removePlayerFromTeam(t)}>
                                  −
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {size < 10 && (
                        <button 
                          className="add-player-integrated" 
                          onClick={() => addPlayerToTeam(t)}>
                          Speler toevoegen
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {teamSizes.length < 6 && (
                <button 
                  className="add-player-integrated dashed team-add-btn" 
                  onClick={addPlayer}
                >
                  Team toevoegen
                </button>
              )}
            </div>
          ) : (
            <div className="teams-setup-wrapper">
              <div className="setup-wrapper-badge">
                SPELERS
              </div>

              <div className="names-grid">
                {names.map((name, i) => (
                  /* TOEVOEGEN VAN small-group KLASSE VOOR DEZELFDE GROOTTE */
                  <div key={i} className="player-input-group small-group">
                    <div className="player-name-container player-bg">
                      <span className="player-index-badge">{i + 1}</span>
                      <input
                        className="integrated-name-input"
                        placeholder="Naam invullen..."
                        value={name}
                        onChange={(e) => updateName(i, e.target.value)}
                        maxLength={16}
                      />
                    </div>
                    {names.length > 2 && (
                      <button
                        className="integrated-delete-btn btn-subtle"
                        onClick={() => removePlayer(i)}
                        title="Verwijder speler"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
                {names.length < 10 && (
                  <button className="add-player-integrated"
                    onClick={addPlayer}>
                    Speler toevoegen
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="setup-section">
          <div className="time-control">
            <button
              className={`time-btn time-btn-minus${roundTime <= 30 ? " time-btn-disabled" : ""}`}
              onClick={() => setRoundTime((t) => Math.max(30, t - 30))}
              disabled={roundTime <= 30}
            >−30</button>
            <span className="time-display">{roundTime}s </span>
            <button
              className={`time-btn time-btn-plus${roundTime >= 300 ? " time-btn-disabled" : ""}`}
              onClick={() => setRoundTime((t) => Math.min(300, t + 30))}
              disabled={roundTime >= 300}
            >+30</button>
          </div>
        </div>

        <div className="setup-section">
          <button
            className={`toggle-all-btn ${allSelected ? "toggle-all-btn-active" : ""}`}
            onClick={() => toggleCategory("all")}
          >
            {allSelected ? "🎲 Alle categorieën" : "⚙️ Custom selectie"}
          </button>

          {!allSelected && (
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
          )}
        </div>

        <div className="names-label-row center-labels">
          <label className="setup-label center-label">
            {totalWordsCount}/{absoluteTotalWords} woorden in het spel
          </label>
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
  const skipCountRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);

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
    // Streak bijhouden
    const newStreak = streakRef.current + 1;
    streakRef.current = newStreak;
    setStreak(newStreak);
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
    // Streak resetten bij overslaan
    streakRef.current = 0;
    setStreak(0);
    // Alleen penalty starten als tijd nog niet verstreken is
    if (timesUpRef.current) {
      finishRound(newScores, wordIndexRef.current);
      return;
    }
    skipCountRef.current += 1;
    const penaltyDuration = skipCountRef.current === 1 ? 3 : skipCountRef.current === 2 ? 5 : 7;
    skipPenaltyRef.current = penaltyDuration;
    setSkipPenalty(penaltyDuration);
    let count = penaltyDuration;
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
              className="timer-circle-progress"
              cx="50" cy="50" r="44"
              fill="none"
              stroke={timerColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={timesUp ? circumference : circumference * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="56" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="inherit"
              className={timesUp ? "timer-ring" : ""}>
              {timesUp ? "⏰" : timeLeft}
            </text>
          </svg>
        </div>
        <div className="round-stats">
          <span className={`stat ${streak >= 3 ? "correct-stat-fire" : "correct-stat"}`}>
            <span className="stat-icon">{streak >= 3 ? "🔥" : "✓"}</span>
            <span>{scores.correct}</span>
          </span>
          <span className="stat skip-stat">
            <span className="stat-icon">↷</span>
            <span>{scores.skipped}</span>
          </span>
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
              <div className="penalty-bar-fill" style={{ animationDuration: `${skipCountRef.current === 1 ? 3 : skipCountRef.current === 2 ? 5 : 7}s` }} />
            </div>
            <div className="penalty-sublabel">
              {skipCountRef.current === 1 ? "3 seconden wachten…" : skipCountRef.current === 2 ? "5 seconden wachten…" : "7 seconden wachten…"}
            </div>
          </div>
        ) : (
          <>
            <div className="word-anchor">
              <div className="word-counter">woord {wordIndex + 1}</div>
              <div key={wordIndex} className={`current-word${isCurrentBonus ? " bonus-word" : ""}`}>{currentWord ? hyphenateWord(currentWord) : "— geen woorden meer —"}</div>
              <div className={`times-up-banner${timesUp ? '' : isCurrentBonus ? ' bonus-banner' : ' category-banner'}`}>
                {timesUp
                  ? '⏰ Tijd is om — maak dit woord nog af!'
                  : isCurrentBonus
                    ? '⭐ BONUSGEZEGDE — 3 punten!'
                    : currentWord ? (WORD_TO_CATEGORY[currentWord]?.label ?? '📦 Categorie') : ''}
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
            className="tiebreaker-start-btn"
            onClick={() => onStartTiebreaker(tiedPlayerIndices)}
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
                      <div className="score-row-right">
                        <span className="score-pts">{team.avgScore} pt</span>
                        <div className="score-row-subtext">gem. per speler · totaal {team.totalScore}</div>
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
                      className={rowClass + (isLast ? " cursor-pointer" : "")}
                      onClick={isLast ? () => onShowStats(originalIdx) : undefined}
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
        <div className="stats-header-row">
          <button
            className="stats-back-btn"
            onClick={onBack}
            title="Terug naar scorebord"
          ><span className="stats-back-icon">➜</span></button>
          <h2 className="score-title stats-header-title">📊 Statistieken</h2>
          <div className="stats-header-spacer" />
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
        <h2 className="score-title tiebreaker-title">⚡ Tie-breaker</h2>
        <p className="tiebreaker-subtitle">
          Kies samen een categorie.<br/>Alle spelers krijgen een woord uit dezelfde categorie.
        </p>
        <div className="tiebreaker-cat-list">
          {(candidateCategories || []).map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChosen(cat.id)}
              className="tiebreaker-cat-btn"
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
          <div className={`tiebreaker-result-banner ${hasJointWinner ? 'tiebreaker-result-tied' : 'tiebreaker-result-winner'}`}>
            {hasJointWinner ? (
              <span className="tiebreaker-result-text-tied">
                🤝 Nog steeds gelijkspel!
              </span>
            ) : (
              <span className="tiebreaker-result-text-winner">
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
                  <span className="score-pts tiebreaker-pts">
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
          <p className="handoff-sub tiebreaker-handoff-sub">
            TIE-BREAKER · {currentStep + 1}/{tiedPlayerIndices.length}
          </p>
          <h2 className="handoff-name">{players[currentPlayerIdx]}</h2>
          <p className="handoff-tip mb-2">Raad z.s.m. het random woord</p>
          <p className="handoff-tip mt-0">in de categorie: {categoryLabel}</p>
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
              className="tiebreaker-timer-circle"
              strokeDasharray={circumference}
              strokeDashoffset={yellowOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="50" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" fontFamily="inherit" dy="0">{secs}</text>
            <text x="50" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="inherit">.{tenths}s</text>
          </svg>
        </div>
        <div className="round-stats">
          <span className="round-stats-cat">{categoryLabel}</span>
        </div>
      </div>

      <div className="word-stage">
        <div className="word-anchor">
          <div className="word-counter">leg z.s.m. uit</div>
          <div className="current-word">{hyphenateWord(currentWord)}</div>
          <div className="times-up-banner is-hidden">placeholder</div>
        </div>
      </div>

      <div className="action-row">
        <button className="action-btn correct-btn" onClick={handleGuessed}>
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
    // Priority: categories used in this game come first,
    // then fill up with random safe categories not yet in the list.
    const safeCats = ['dieren', 'voedsel', 'koken', 'beroepen', 'kantoor','sport', 'natuur', 'emoties', 'landen', 'vervoer', 'plaatsen', 'kunst', 'kleding', 'religie', 'fictie', 'literatuur', 'muziek', 'acties', 'gereedschap', 'wetenschap', 'geneeskunde', 'ruimte', 'militair', 'misdaad', 'politiek', 'huishouden', 'spreekwoorden'];
    const catSet = selectedCategory instanceof Set ? selectedCategory : new Set();
    const allIds = CATEGORIES.map(c => c.id);
    const allSelected = catSet.size === 0 || allIds.every(id => catSet.has(id));

    // Categories used in this game
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

        /* ── Cards & Layout ── */
        .setup-card, .score-card, .stats-card {
          background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 28px 20px;
          width: 100%;
          backdrop-filter: blur(20px);
          overflow: hidden;
        }
        .setup-card { max-width: 480px; }
        .score-card { max-width: 440px; }
        .stats-card { max-width: 480px; overflow-y: auto; max-height: 92vh; }

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
        .setup-label { display: block; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 4px; }
        
        .names-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
        .names-label-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .center-labels { justify-content: center; width: 100%; }
        .center-label { text-align: center; width: 100%; }

        /* ── Toggles & Buttons ── */
        .setup-mode-toggle-group { display: flex; gap: 12px; margin-bottom: 30px; }

        .start-btn {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: 3px solid rgba(255,255,255,0.2);
          font-family: 'Righteous', cursive;
          font-size: 20px;
          letter-spacing: 0.04em;
          cursor: pointer;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          transition: all 0.25s;
          margin-top: 4px;
        }
        .start-btn.ready { border-color: #a78bfa; background: rgba(167,139,250,0.1); color: #a78bfa; }
        .start-btn.ready:hover { background: rgba(167,139,250,0.2); }

        .mode-toggle-btn { border: 3px solid rgba(255,255,255,0.2); }
        .mode-toggle-btn-half { margin: 0; flex: 1; }
        .mode-toggle-singles { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.7); }
        .mode-toggle-singles:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.35); }
        .mode-toggle-teams { background: rgba(74, 144, 226, 0.1); color: #4a90e2; border-color: #4a90e2; }
        .mode-toggle-teams:hover { background: rgba(74, 144, 226, 0.2); }
        
        .toggle-all-btn {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px; border-radius: 12px; border: 2px dashed #ccc; background: transparent;
          margin-bottom: 15px; font-family: 'Righteous', cursive; font-size: 20px; letter-spacing: 0.04em;
          cursor: pointer; color: rgba(255,255,255,0.45); transition: all 0.25s;
        }
        .toggle-all-btn:hover { background: rgba(255,255,255,0.1); }
        .toggle-all-btn-active { background: rgba(74, 144, 226, 0.1); border-color: #4a90e2; color: #4a90e2; margin-bottom: 0; }
        .toggle-all-btn-active:hover { background: rgba(74, 144, 226, 0.2); }

        /* ── Player Inputs (Individual & Teams) ── */
        .player-input-group { display: flex; margin-bottom: 4px; height: 48px; width: 100%; }
        .player-name-container {
          display: flex; align-items: center;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px; padding: 0 12px;
          flex-grow: 1; transition: border-color 0.2s;
        }
        .player-input-group:has(.integrated-delete-btn) .player-name-container { border-radius: 12px 0 0 12px; }
        .player-bg { background: rgba(255, 255, 255, 0.06) !important; border: none; }
        .player-index-badge { color: rgba(255, 255, 255, 0.3); font-weight: bold; font-size: 0.85rem; min-width: 20px; }
        
        .integrated-name-input {
          background: transparent !important; border: none !important; color: white !important;
          width: 100%; height: 100%; font-size: 1rem; outline: none; padding-left: 8px;
        }
        .integrated-delete-btn {
          background: #ff4757; color: white; border: none; border-radius: 0 12px 12px 0;
          width: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; transition: background 0.2s;
        }
        .integrated-delete-btn:hover { background: #ff2e44; }
        .btn-subtle { background: rgba(255, 255, 255, 0.1) !important; color: white !important; }

        .add-player-integrated {
          width: 100%; height: 44px; margin-top: 4px;
          background: rgba(52, 211, 153, 0.1); border: 2px dashed #34d399; border-radius: 12px;
          color: #34d399; display: flex; align-items: center; justify-content: center; gap: 12px;
          cursor: pointer; font-size: 1rem; font-weight: 600;
        }
        .add-player-integrated:hover { background: rgba(52, 211, 153, 0.2); }

        /* ── Team Layout ── */
        .teams-setup-wrapper {
          border: 3px solid #4a90e2; border-radius: 24px; padding: 25px;
          background-color: rgba(0,0,0,0.02); margin-bottom: 20px; position: relative;
        }
        .setup-wrapper-badge {
          position: absolute; top: -14px; left: 20px; background-color: #4a90e2; color: white;
          padding: 4px 16px; border-radius: 12px; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; z-index: 1;
        }
        .teams-grid { display: flex; flex-direction: column; gap: 14px; }
        .team-section-container {
          margin-bottom: 14px; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          width: 100%; background-color: transparent; border-radius: 16px;
        }
        .team-header-row { position: relative; display: flex; align-items: center; margin-bottom: 8px; }
        .team-name-input-flat {
          background: transparent !important; border: none !important; border-bottom: 2px solid rgba(74, 144, 226, 0.4) !important;
          color: #4a90e2 !important; font-size: 1.1rem; font-weight: bold; text-transform: uppercase;
          padding: 2px 0; width: 100%; outline: none;
        }
        .delete-btn-round {
          position: absolute; right: 0; top: 0; background: rgba(0,0,0,0.02); color: white; border: none;
          border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 10px;
        }
        .team-players-list { display: flex; flex-direction: column; gap: 4px; }
        .team-add-btn { margin-top: 15px; border-color: #4a90e2; color: #4a90e2; background: rgba(74, 144, 226, 0.1); }
        .team-add-btn:hover { background: rgba(74, 144, 226, 0.2); }

        .small-group { height: 38px !important; margin-bottom: 4px !important; }
        .small-group .player-name-container { border-radius: 10px; }
        .small-group:has(.integrated-delete-btn) .player-name-container { border-radius: 10px 0 0 10px; }
        .small-group .integrated-delete-btn { border-radius: 0 10px 10px 0; width: 38px !important; }

        /* ── Time Control ── */
        .time-control { display: flex; align-items: center; gap: 12px; }
        .time-btn {
          width: 64px; height: 44px; border-radius: 12px; border: 3px solid #34d399;
          background: rgba(52,211,153,0.08); color: #34d399; font-family: inherit; font-size: 15px;
          font-weight: 700; cursor: pointer; transition: all 0.18s;
        }
        .time-btn-plus:hover:not(:disabled) { background: rgba(52,211,153,0.2); }
        .time-btn-minus { border-color: #f87171; background: rgba(248,113,113,0.1); color: #f87171; }
        .time-btn-minus:hover:not(:disabled) { background: rgba(248,113,113,0.2); }
        .time-btn:disabled { opacity: 0.3; cursor: default; }
        .time-btn-disabled { opacity: 1 !important; cursor: not-allowed !important; pointer-events: none; background: rgba(255,255,255,0.05) !important; border-color: rgba(255,255,255,0.2) !important; color: rgba(255,255,255,0.35) !important; }
        .time-display { flex: 1; text-align: center; font-family: 'Righteous', cursive; font-size: 24px; color: rgba(255,255,255,0.9); }

        /* ── Categories ── */
        .category-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .category-btn {
          padding: 8px 14px; border-radius: 20px; border: 3px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s; user-select: none;
        }
        .category-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); color: white; }
        .category-btn-active { background: rgba(52,211,153,0.08); border-color: #34d399; color: #34d399; }
        .category-btn-active:hover { background: rgba(52,211,153,0.18); border-color: #34d399; }

        /* ── Handoff Screen ── */
        .handoff-screen { background: none; }
        .handoff-card {
          text-align: center; padding: 40px 24px; background: rgba(255,255,255,0.06);
          border: 3px solid rgba(255,255,255,0.12); border-radius: 28px; max-width: 400px;
          width: 100%; backdrop-filter: blur(20px);
        }
        .handoff-icon { font-size: 52px; margin-bottom: 16px; animation: bounce 1.5s infinite; }
        .handoff-sub { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; margin-bottom: 10px; }
        .handoff-name { font-family: 'Righteous', cursive; font-size: clamp(28px, 8vw, 42px); color: #a78bfa; margin-bottom: 24px; word-break: break-word; }
        .handoff-team { font-size: 13px; color: #34d399; font-weight: 800; letter-spacing: 0.06em; margin-top: -10px; margin-bottom: 16px; }
        .handoff-tip { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 28px; }
        .handoff-btn {
          padding: 16px 32px; border-radius: 16px; border: 3px solid #a78bfa; background: rgba(167,139,250,0.08);
          color: #a78bfa; font-family: 'Righteous', cursive; font-size: 18px; cursor: pointer; transition: all 0.2s;
        }
        .handoff-btn:hover { background: rgba(167,139,250,0.15); }

        /* ── Round Screen ── */
        .round-screen { flex-direction: column; background: none; transition: background 0.2s; padding-top: max(28px, env(safe-area-inset-top)); }
        .round-screen.flash-correct { animation: flashGreen 0.4s ease; }
        .round-screen.flash-skip { animation: flashOrange 0.4s ease; }
        .round-screen.round-done { opacity: 0.6; }

        .round-top {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          max-width: 520px; padding: 28px 0 12px; gap: 8px; flex-shrink: 0; position: relative;
        }
        .round-player { font-family: 'Righteous', cursive; font-size: clamp(14px, 4vw, 20px); color: #a78bfa; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .timer-wrap { position: absolute; left: 50%; transform: translateX(-50%); flex-shrink: 0; }
        .timer-circle-progress { transition: stroke 0.5s; }
        .timer-ring { animation: ring 0.5s infinite; transform-origin: 50px 50px; }

        .round-stats { display: flex; gap: 8px; flex-shrink: 0; margin-left: auto; }
        .stat {
          font-size: 14px; font-weight: 800; padding: 5px 10px; border-radius: 20px; white-space: nowrap;
          display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-width: 52px;
        }
        .stat-icon { display: flex; align-items: center; justify-content: center; line-height: 1; }
        .correct-stat { background: rgba(74,222,128,0.2); color: #4ade80; }
        .correct-stat-fire { background: rgba(251,146,60,0.25); color: #fb923c; text-shadow: 0 0 8px rgba(251,146,60,0.7); transition: background 0.3s, color 0.3s; }
        .skip-stat { background: rgba(251,191,36,0.15); color: #fbbf24; }
        .round-stats-cat { font-size: 12px; color: rgba(255,255,255,0.4); }

        .word-stage {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; max-width: 520px; width: 100%; gap: 0; padding: 20px;
        }
        .word-anchor { display: flex; flex-direction: column; align-items: center; }
        .word-counter { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px; }

        .current-word {
          font-family: 'Righteous', cursive; font-size: clamp(38px, 11vw, 80px);
          background: linear-gradient(135deg, #f9fafb, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; line-height: 1.15; animation: wordIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          word-break: break-word; overflow-wrap: break-word; hyphens: manual; -webkit-hyphens: manual;
          max-width: 100%; padding: 0 8px; text-align: center;
        }
        .current-word.bonus-word {
          background: linear-gradient(135deg, #fb923c, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .times-up-banner {
          font-family: 'Righteous', cursive; font-size: clamp(13px, 3.5vw, 16px); color: #f87171;
          background: rgba(248,113,113,0.12); border: 3px solid rgba(248,113,113,0.35); border-radius: 12px;
          padding: 8px 16px; text-align: center; min-height: 40px; margin-top: 20px;
          animation: pulse-red-banner 1.2s ease-in-out infinite;
        }
        .times-up-banner.bonus-banner {
          color: #fb923c; background: rgba(251,146,60,0.12); border-color: rgba(251,146,60,0.35);
          animation: pulse-orange-banner 1.2s ease-in-out infinite;
        }
        .times-up-banner.category-banner {
          color: #a78bfa; background: rgba(167,139,250,0.10); border-color: rgba(167,139,250,0.30);
          animation: none; font-size: clamp(12px, 3.2vw, 15px);
        }
        .is-visible { visibility: visible; }
        .is-hidden { visibility: hidden; }

        .penalty-wrap { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .penalty-label { font-family: 'Righteous', cursive; font-size: clamp(15px, 4vw, 18px); color: #fbbf24; letter-spacing: 0.04em; }
        .penalty-bar-track { width: 220px; height: 6px; background: rgba(251,191,36,0.15); border-radius: 3px; overflow: hidden; }
        .penalty-bar-fill { height: 100%; background: #fbbf24; border-radius: 3px; width: 100%; animation: penalty-drain 3s linear forwards; }
        .penalty-sublabel { font-size: clamp(12px, 3vw, 14px); color: rgba(255,255,255,0.45); font-weight: 600; letter-spacing: 0.02em; }

        .word-done-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; margin-top: -80px; }
        .word-done-count { font-size: clamp(18px, 5vw, 26px); color: rgba(255,255,255,0.6); font-family: 'Righteous', cursive; letter-spacing: 0.03em; }
        .word-done-msg { font-family: 'Righteous', cursive; font-size: clamp(36px, 10vw, 72px); text-align: center; word-break: break-word; line-height: 1.15; }
        .word-done-msg.tier-poor { color: #f87171; }
        .word-done-msg.tier-ok { color: #fbbf24; }
        .word-done-msg.tier-great { color: #4ade80; }

        /* Action Row */
        .action-row {
          display: flex; gap: 12px; width: 100%; max-width: 520px;
          padding: 0 0 max(24px, env(safe-area-inset-bottom)); flex-shrink: 0;
        }
        .action-btn {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 20px 12px; border-radius: 20px; border: none; cursor: pointer;
          font-family: 'Righteous', cursive; transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          -webkit-tap-highlight-color: transparent; min-width: 0;
        }
        .action-btn:focus { outline: none; }
        .action-btn:active { transform: scale(0.93); }
        .btn-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
        .btn-icon { font-size: 28px; }
        .btn-label { font-size: clamp(13px, 3.5vw, 16px); white-space: nowrap; }

        .skip-btn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 3px solid rgba(251,191,36,0.3); }
        .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 3px solid rgba(74,222,128,0.35); }

        @media (hover: hover) {
          .skip-btn:hover { background: rgba(251,191,36,0.25); }
          .correct-btn:hover { background: rgba(74,222,128,0.35); }
        }

        /* ── Score Screen ── */
        .score-title { font-family: 'Righteous', cursive; font-size: clamp(22px, 6vw, 28px); text-align: center; margin-bottom: 20px; }
        .scores-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .score-row {
          display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 16px;
          background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.07); animation: slideIn 0.4s ease both;
        }
        .score-row-right { text-align: right; }
        .score-row-subtext { font-size: 11px; opacity: 0.5; margin-top: 2px; }
        .cursor-pointer { cursor: pointer; }
        .score-row.cursor-pointer:hover { filter: brightness(1.25); }

        /* Basic row ranks */
        .score-row.rank-1 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .score-row.rank-2 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
        .score-row.rank-3 { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }

        /* Tussenstand */
        .score-row.rank-1.rank-interim { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-1.rank-interim .score-pts { color: #4ade80; }
        .score-row.rank-2.rank-interim, .score-row.rank-3.rank-interim { background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.14); }
        
        .score-row.rank-interim-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-interim-tied .score-pts { color: #4ade80; }
        
        .score-row.rank-interim-played { background: rgba(167,139,250,0.08); border: 3px solid rgba(167,139,250,0.5); }
        .score-row.rank-interim-played .score-pts { color: #a78bfa; }

        /* Eindstand */
        .score-row.rank-1.rank-final { background: rgba(251,191,36,0.08); border: 3px solid #fbbf24; }
        .score-row.rank-1.rank-final .score-pts { color: #fbbf24; }
        .score-row.rank-2.rank-final { background: rgba(192,192,192,0.1); border: 3px solid #c0c0c0; }
        .score-row.rank-2.rank-final .score-pts { color: #c0c0c0; }
        .score-row.rank-3.rank-final { background: rgba(205,127,50,0.08); border: 3px solid #cd7f32; }
        .score-row.rank-3.rank-final .score-pts { color: #cd7f32; }
        .score-row.rank-4.rank-final, .score-row.rank-5.rank-final, .score-row.rank-6.rank-final,
        .score-row.rank-7.rank-final, .score-row.rank-8.rank-final, .score-row.rank-9.rank-final,
        .score-row.rank-10.rank-final { background: rgba(167,139,250,0.08); border: 3px solid rgba(167,139,250,0.5); }
        .score-row.rank-final:not(.rank-1):not(.rank-2):not(.rank-3) .score-pts { color: #a78bfa; }

        .score-row.rank-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
        .score-row.rank-tied .score-pts { color: #4ade80; }
        .score-row.rank-tied .score-name { color: #4ade80; }

        .rank-badge { font-size: 20px; min-width: 28px; text-align: center; flex-shrink: 0; }
        .score-name-block { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
        .score-name { flex: 1; font-size: clamp(14px, 4vw, 18px); font-weight: 700; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .score-members { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .score-pts { font-family: 'Righteous', cursive; font-size: clamp(16px, 4vw, 20px); color: rgba(255,255,255,0.9); flex-shrink: 0; }

        .score-btn {
          width: 100%; padding: 18px; border-radius: 16px; border: none; font-family: 'Righteous', cursive;
          font-size: 20px; cursor: pointer; transition: filter 0.18s;
        }
        .next-btn { background: rgba(167,139,250,0.08); color: #a78bfa; border: 3px solid #a78bfa; }
        .next-btn:hover { background: rgba(167,139,250,0.15); }
        .continue-btn { background: rgba(52,211,153,0.1); color: #34d399; border: 3px solid rgba(52,211,153,0.35); margin-bottom: 10px; }
        .continue-btn:hover { background: rgba(52,211,153,0.18); }
        .restart-btn { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); border: 3px solid rgba(255,255,255,0.2); }
        .restart-btn:hover { background: rgba(255,255,255,0.14); }
        .stats-btn { background: rgba(251,191,36,0.1); color: #fbbf24; border: 3px solid rgba(251,191,36,0.35); margin-bottom: 10px; }
        .stats-btn:hover { background: rgba(251,191,36,0.18); }
        .final-btns { display: flex; flex-direction: column; }

        /* ── Stats Screen ── */
        .stats-header-row { display: flex; align-items: center; margin-bottom: 16px; }
        .stats-back-btn {
          background: rgba(255,255,255,0.08); border: 2.5px solid rgba(255,255,255,0.15);
          border-radius: 12px; color: rgba(255,255,255,0.75); font-size: 18px; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.15s;
        }
        .stats-back-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .stats-back-icon { display: inline-block; transform: scaleX(-1); line-height: 1; vertical-align: middle; }
        .stats-header-title { margin: 0; flex: 1; text-align: center; }
        .stats-header-spacer { width: 36px; flex-shrink: 0; }

        .stats-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .stats-tab {
          padding: 6px 14px; border-radius: 20px; border: 2.5px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 700;
          font-family: inherit; cursor: pointer; transition: all 0.15s;
        }
        .stats-tab-active { background: rgba(167,139,250,0.25); border-color: rgba(167,139,250,0.6); color: #a78bfa; }
        .stats-player-name { font-family: 'Righteous', cursive; font-size: 22px; margin-bottom: 2px; }
        .stats-total-score { color: #a78bfa; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
        
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
        .stats-cell { background: rgba(255,255,255,0.06); border: 2.5px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px; text-align: center; }
        .stats-cell-gold { border-color: rgba(251,146,60,0.35); background: rgba(251,146,60,0.08); }
        .stats-cell-val { font-family: 'Righteous', cursive; font-size: 26px; }
        .stats-cell-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 2px; }
        .stats-best {
          font-size: 13px; font-weight: 700; color: #fbbf24; background: rgba(251,191,36,0.1);
          border: 2.5px solid rgba(251,191,36,0.25); border-radius: 12px; padding: 10px 14px; margin-bottom: 14px;
        }
        
        .stats-words-section { display: flex; gap: 10px; margin-bottom: 4px; }
        .stats-words-col { flex: 1; min-width: 0; }
        .stats-words-title { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
        .stats-green { color: #4ade80; }
        .stats-red { color: #f87171; }
        .stats-words-list { display: flex; flex-wrap: wrap; gap: 4px; }
        .stats-word-chip {
          font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 10px; background: rgba(74,222,128,0.1);
          border: 2.5px solid rgba(74,222,128,0.25); color: #4ade80;
        }
        .stats-word-bonus { background: rgba(251,146,60,0.12); border-color: rgba(251,146,60,0.4); color: #fb923c; }
        .stats-word-skipped { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.25); color: #f87171; }
        .stats-word-more { font-size: 11px; color: rgba(255,255,255,0.4); align-self: center; }

        /* ── Tiebreaker Screen ── */
        .tiebreaker-start-btn {
          width: 100%; background: rgba(251,191,36,0.1); border: 3px solid rgba(251,191,36,0.3);
          border-radius: 14px; padding: 10px 16px; margin-bottom: 14px; text-align: center;
          font-size: 14px; font-weight: 700; color: #fbbf24; cursor: pointer; font-family: inherit;
          transition: background 0.15s, border-color 0.15s;
        }
        .tiebreaker-start-btn:hover { background: rgba(251,191,36,0.22); border-color: rgba(251,191,36,0.6); }
        .tiebreaker-title { margin-bottom: 6px; }
        .tiebreaker-subtitle { text-align: center; color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 22px; line-height: 1.5; }
        .tiebreaker-cat-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .tiebreaker-cat-btn {
          width: 100%; padding: 18px 20px; border-radius: 18px; background: rgba(167,139,250,0.1);
          border: 2.5px solid rgba(167,139,250,0.3); color: white; font-family: inherit; font-size: 20px;
          font-weight: 800; cursor: pointer; text-align: left; transition: all 0.15s; display: flex; align-items: center; gap: 12px;
        }
        .tiebreaker-cat-btn:hover { background: rgba(167,139,250,0.25); border-color: rgba(167,139,250,0.7); }

        .tiebreaker-result-banner { margin: 0 0 16px; padding: 10px 16px; border-radius: 14px; text-align: center; border: 2.5px solid; }
        .tiebreaker-result-tied { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.3); }
        .tiebreaker-result-winner { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.3); }
        .tiebreaker-result-text-tied { color: #fbbf24; font-weight: 800; font-size: 14px; }
        .tiebreaker-result-text-winner { color: #4ade80; font-weight: 800; font-size: 14px; }
        .tiebreaker-pts { font-size: 17px; }
        .tiebreaker-handoff-sub { color: #fbbf24; font-weight: 800; letter-spacing: 0.06em; font-size: 13px; }
        .mb-2 { margin-bottom: 2px; }
        .mt-0 { margin-top: 0px; }
        .tiebreaker-timer-circle { transition: stroke-dashoffset 0.05s linear; }

        /* ── Animations ── */
        @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
        .score-row:nth-child(1) { animation-delay: 0.05s }
        .score-row:nth-child(2) { animation-delay: 0.1s }
        .score-row:nth-child(3) { animation-delay: 0.15s }
        .score-row:nth-child(4) { animation-delay: 0.2s }
        .score-row:nth-child(5) { animation-delay: 0.25s }
        .score-row:nth-child(6) { animation-delay: 0.3s }
        
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes flashGreen { 0%{background:rgba(74,222,128,0.3)} 100%{background:transparent} }
        @keyframes flashOrange { 0%{background:rgba(251,191,36,0.2)} 100%{background:transparent} }
        @keyframes flash-bonus-anim { 0% { background: rgba(251,146,60,0); } 30% { background: rgba(251,146,60,0.2); } 100% { background: rgba(251,146,60,0); } }
        @keyframes wordIn { from{transform:scale(0.7) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes penalty-drain { from { width: 100%; } to { width: 0%; } }
        @keyframes pulse-red-banner { 0%, 100% { box-shadow: 0 0 6px rgba(248,113,113,0.4); } 50% { box-shadow: 0 0 14px rgba(248,113,113,0.8); } }
        @keyframes pulse-orange-banner { 0%, 100% { box-shadow: 0 0 6px rgba(251,146,60,0.4); } 50% { box-shadow: 0 0 14px rgba(251,146,60,0.8); } }
        @keyframes ring { 0% { transform: rotate(0deg); } 15% { transform: rotate(18deg); } 30% { transform: rotate(-16deg); } 45% { transform: rotate(14deg); } 60% { transform: rotate(-10deg); } 75% { transform: rotate(6deg); } 90% { transform: rotate(-3deg); } 100% { transform: rotate(0deg); } }
        @keyframes pulse-gold { 0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.4); } 50% { box-shadow: 0 0 0 8px rgba(251,191,36,0); } }
        @keyframes streak-pulse { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }

        /* ── Media Queries ── */
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
