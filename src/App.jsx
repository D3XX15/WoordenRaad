import { useState, useEffect, useRef, useCallback } from "react";

const WORDS = [
  // Dieren
  'aardvarken', 'adelaar', 'albatros', 'alpaca', 'anakonda', 'baviaan', 'beer',
  'bever', 'bijenkoningin', 'bizon', 'blauwvin­tonijn', 'boomkikker', 'boomslang',
  'buffel', 'buizerd', 'buldog', 'cheetah', 'chihuahua', 'cobra', 'condor', 'das',
  'dingo', 'dinosaurus', 'dolfijn', 'draak', 'dromedaris', 'duif', 'dwergpinguïn', 'eekhoorn',
  'egel', 'ekster', 'eland', 'elektrische paling', 'emoe', 'fazant', 'flamingo',
  'fret', 'galapagos­schildpad', 'gecko', 'gibbon', 'giraffe',
  'gorilla', 'goudjakhals', 'goudvis', 'grizzlybeer', 'guppie', 'haai', 'haas',
  'hagedis', 'hamster', 'havik', 'hermelijn', 'hond', 'honingdas', 'hyena', 'ibis',
  'ijsbeer', 'impala', 'inktvis', 'jaguar', 'jakhals', 'kaketoe',
  'kameel', 'kameleon', 'kangoeroe', 'kat', 'kever', 'kikker', 'kiwi', 'koala',
  'koe', 'komodovaraan', 'konijn', 'kraanvogel', 'krab', 'krokodil', 'kwal',
  'kwartel', 'lama', 'leeuw', 'leguaan', 'lemming', 'lepelaar', 'libel', 'lieve­heersbeestje',
  'luiaard', 'lynx', 'maanvis', 'marmot', 'meerkat',
  'meerval', 'mier', 'miereneter', 'moeflon', 'mol', 'mug',
  'muilezel', 'muskusrat', 'narwal', 'nerts', 'neusaap', 'neushoorn', 'nijlgans', 'nijlpaard',
  'octopus', 'oehoe', 'okapi', 'olifant', 'ooievaar', 'orang-oetan', 'orka',
  'otter', 'paard', 'panda', 'panther', 'papegaai', 'paradijsvogel', 'parkiet', 'pauw',
  'pelikaan', 'pijlgif kikker', 'pinguïn', 'platypus', 'poema', 'poolvos', 'prairiehond',
  'raaf', 'rat', 'reiger', 'rendier', 'reuzenoctopus', 'reuzenpanda', 'roofvogel', 'varkenshaas',
  'salamander', 'schaap', 'schildpad', 'schildwants', 'schorpioen', 'slak', 'slang', 'sneeuw­luipaard',
  'snoek', 'specht', 'sperwer', 'spin', 'springbok', 'sprinkhaan', 'stekelvarken', 'steur',
  'stier', 'stinkdier', 'stokstaartje', 'struisvogel', 'tapir', 'tarantula', 'tijger',
  'toekan', 'tor', 'uil', 'valkparkiet', 'vampier', 'varaan', 'veelvraat', 'vleermuis',
  'vlieg', 'vliegend hert', 'vliegende vis', 'vlinder', 'vos', 'vuurkever', 'walvis',
  'wasbeer', 'waterbuffel', 'waterrat', 'wezel', 'wild zwijn', 'wolf', 'wombat',
  'worm', 'wrattenzwijn', 'zebra', 'zeehond', 'zeemeermin', 'zeeotter',
  'krekel', 'mus', 'vuurvliegje',
  'zeepaardje', 'zeeschildpad', 'zwaan', 'zwaluw', 'zwarte mamba', 'zwarte panter',
  'damhert', 'forel', 'goudhaan', 'heggenmus', 'hop', 'ijsvogel',
  'kauw', 'knobbelzwaan', 'kwikstaart', 'nachtegaal', 'patrijs', 'pimpelmees',
  'roodborst', 'scholekster', 'staartmees', 'steenuil', 'veldleeuwerik',
  'wielewaal', 'wulp', 'zanglijster', 'zwarte kraai',
  
  // Voedsel & drinken
  'aardappel', 'aardappel­puree', 'aardbei', 'abrikoos', 'amaretto', 'ananas', 'andijvie', 'appelmoes',
  'appelsap', 'appeltaart', 'asperges', 'avocado', 'bacon', 'bagel', 'baguette', 'balsamico',
  'bami', 'banaan', 'bananenbrood', 'barbecue', 'basilicum', 'biefstuk', 'bier',
  'bieslook', 'bietensalade', 'bitterbal', 'bitterkoekje', 'bladerdeeg', 'blauwe bes',
  'bloemkool', 'boerenkool', 'bolognese', 'bonbons', 'borrelplank', 'bosbessen', 'boterham', 'bouillon',
  'brandnetel­soep', 'broccoli', 'brood', 'brownie', 'bruine bonen', 'bruschetta', 'caesarsalade',
  'cannelloni', 'karamel', 'carpaccio', 'cashewnoot', 'champignon',
  'cheesecake', 'chipolata', 'chips', 'chocolade', 'churros', 'ciabatta', 'citroen', 'citroentaart',
  'cola', 'corndog', 'couscous', 'cranberrysap', 'croissant', 'crème brûlée', 'curry', 'dadel',
  'dim sum', 'donut', 'doperwt', 'drakenvrucht', 'druiven', 'eclairs', 'ei',
  'enchilada', 'energiedrank', 'erwtensoep', 'espresso', 'falafel', 'feta', 'fondue', 'friet',
  'frikandel', 'frisdrank', 'fruitsalade', 'garnaal', 'gazpacho', 'gehaktbal', 'geitenkaas', 'gelato',
  'gerst', 'gin-tonic', 'gnocchi', 'goulash', 'granaatappel', 'groenten', 'groentesoep', 'gyros',
  'hamburger', 'hazelnoot', 'honing', 'hotdog', 'hummus', 'ijs', 'jalapeno',
  'jus', 'kaas', 'kaasfondue', 'kaassoufflé', 'kaneelbroodje', 'kappertjes', 'kapsalon', 'kastanje',
  'kerrieworst', 'kersensap', 'kip', 'kipnuggets', 'koffie', 'kokosmelk', 'komkommer',
  'koriander', 'kroket', 'kwark', 'kwarktaart', 'lamsvlees', 'lasagne', 'latte', 'limonade',
  'linzen', 'loempia', 'lychee', 'macaron', 'macaroni', 'mango', 'marshmallow',
  'mayonaise', 'meloensap', 'milkshake', 'miso', 'mosterd', 'moussaka', 'mozzarella',
  'mueslireep', 'muffin', 'nasi', 'nectarine', 'noedels', 'noten', 'nougat', 'olijf',
  'olijfolie', 'omelet', 'pad thai', 'paella', 'pannenkoek', 'paprika', 'parmezaan',
  'passievrucht', 'pasta', 'penne', 'perzik', 'pesto', 'piccalilly', 'pindakaas', 'pistache',
  'pitabrood', 'pizza', 'poffertjes', 'pommes frites', 'pompoen', 'popcorn', 'prei', 'pruim',
  'pulled pork', 'quiche', 'rabarber', 'radijs', 'ratatouille', 'ravioli', 'ricotta',
  'rijstpap', 'rijsttafel', 'risotto', 'rode wijn', 'roggebrood', 'rolmops', 'roomijs', 'rozijnen',
  'rucola', 'rum', 'salade', 'sandwich', 'sap', 'sashimi', 'satésaus', 'scones',
  'selderij', 'sinaasappel', 'slagroom', 'smoothie', 'snoep', 'soep', 'sojasaus',
  'soufflé', 'spaghetti', 'spek', 'spinazie', 'stampot', 'stoofpot', 'strudel', 'suiker',
  'sushi', 'taart', 'taco', 'tapenade', 'tartaar', 'teriyaki', 'thee', 'tiramisu',
  'toast', 'tomatensaus', 'tomatensoep', 'tompouce', 'tortilla', 'truffel', 'tzatziki', 'ui',
  'uiensoep', 'vanille­pudding', 'wafel', 'walnoot', 'watermeloen', 'wijn', 'witlof',
  'witte wijn', 'wrap', 'yoghurt', 'zuurkool',
  'appelstroop', 'beschuit', 'boontjes', 'erwten', 'flensje', 'gehakt', 'gevulde koek',
  'hagelslag', 'hutspot', 'jenever', 'karnemelk', 'kokos', 'krentenbollen',
  'kruidenboter', 'melk', 'muesli', 'ontbijtkoek', 'pap', 'peperkoek', 'rijst',
  'rookworst', 'speculaas', 'stroopwafel', 'tosti', 'vla', 'wentelteefje', 'wittebrood',
  
  // Beroepen & mensen
  'accountant', 'acrobaat', 'acteur', 'advocaat', 'apotheker', 'archeoloog', 'architect', 'astroloog',
  'astronaut', 'automonteur', 'bakker', 'barista', 'beveiliger', 'biblio­thecaris', 'blogger',
  'boekhoudster', 'botanicus', 'brandweer', 'brandweerman', 'buschauffeur', 'cardioloog', 'casinodealer', 'chef-kok',
  'chiropractor', 'chirurg', 'circus­directeur', 'clown', 'coach', 'cowboy', 'croupier',
  'danser', 'dansleraar', 'dataanalist', 'dermatoloog', 'detective', 'dierenarts', 'dierentrainer', 'diplomaat',
  'dirigent', 'dj', 'documentaire­maker', 'dokter', 'dronepiloot', 'duik­instructeur', 'econoom',
  'ethisch hacker', 'evenementen­organisator', 'examinator', 'farmaceut', 'filosoof',
  'fotograaf', 'fysio­therapeut', 'game­ontwikkelaar', 'gastronoom', 'geneesheer', 'geograaf', 'geoloog', 'gids',
  'glazenwasser', 'goochelaar', 'grafisch ontwerper', 'gynaecoloog', 'handelaar', 'heks', 'hersenchirurg', 'hovenier',
  'hypno­therapeut', 'ijs­beeldhouwer', 'illustrator', 'immunoloog', 'informaticus', 'ingenieur', 'inspecteur', 'instrument­maker',
  'jager', 'jongleur', 'journalist', 'juwelier', 'kaartenmaker', 'kapitein', 'kapper',
  'kassa­medewerker', 'kinderarts', 'klimaatoloog', 'klusjesman', 'kok', 'kostuum­ontwerper', 'kraam­verzorger',
  'kruidenier', 'kunstcriticus', 'kunstenaar', 'kweker', 'laborant', 'landmeter', 'lasser', 'leraar',
  'levens­middelen', 'loodgieter', 'lucht­verkeersleider', 'magiër', 'makelaar', 'marionette­speler', 'matroos', 'meteoroloog',
  'microbioloog', 'modeontwerper', 'moleculair bioloog', 'monteur', 'museum­conservator', 'musicus',
  'neuroloog', 'notaris', 'ontwerper', 'oogarts', 'operazanger', 'opticien',
  'orthopeed', 'parasiet', 'parfum', 'piloot',
  'piraat', 'politicoloog', 'politieagent', 'postbode', 'primaat', 'producent',
  'prof­voetballer', 'psychiater', 'psycholoog', 'radioloog', 'rechercheur', 'revalidatie­arts', 'ridder', 'roboticus',
  'ruimtevaarder', 'ruimte­wetenschapper', 'scenario­schrijver', 'schappen­vuller', 'scheikundige', 'schilder', 'schildwacht', 'schoonmaker',
  'schrijver', 'sheriff', 'skateboarder', 'slager', 'socioloog', 'soldaat', 'sommelier', 'stadsplanner', 'stand-up­comedian',
  'steward', 'stoker', 'strateeg', 'stratenmaker', 'stuntman', 'sumo', 'systeem­beheerder', 'tatoeëerder',
  'taxichauffeur', 'taxidermist', 'textiel­ontwerper', 'timmerman', 'tolk', 'tovenaar', 'toxicoloog', 'trainer',
  'tuinieren', 'tuinman', 'verpleeg­kundige', 'verzekerings­agent', 'vioolmaker', 'visser', 'vliegtuig­bouwer',
  'voedings­wetenschapper', 'volksmenner', 'vuilnisman', 'vuurwerkmaker', 'wetenschapper', 'wijnboer', 'winkelier',
  'wiskundige', 'woordvoerder', 'zanger', 'zeebioloog', 'zeiler', 'ziekenhuis­directeur',
  'aannemer', 'beeldhouwer', 'burgemeester', 'cabaretier', 'ijsverkoper',
  'kaarsenmaker', 'kolenboer', 'koster', 'omroeper', 'organist',
  'predikant', 'reddings­werker', 'smid', 'straatveger', 'taalkundige',
  'tram­bestuurder', 'vrijwilliger', 'zeepmaker',
  
  // Sport & hobby's
  'aerobics', 'alpineskiën', 'american football', 'aquajogging', 'atletiek', 'badminton', 'balletdansen',
  'bankschieten', 'basketbal', 'beach­volleybal', 'bergsport', 'biatlon', 'biljarten', 'BMX', 'bobslee',
  'boksen', 'boogschieten', 'boogsport', 'boulderen', 'bowling', 'breakdance',
  'cricket', 'curling', 'dammen', 'diepzeeduiken', 'discgolf', 'discuswerpen', 'djembé spelen', 'dressuur',
  'driedaagse', 'duiken', 'e-sporten', 'estafette', 'fietsen',
  'fitness­training', 'freerunning', 'frisbee', 'gewichtheffen', 'gokken', 'golfen', 'gymnastiek', 'handbal', 'handwerken', 'hardlopen', 'hengelen', 'hindernisloop', 'hip-hop dansen', 'hockey',
  'hoogspringen', 'hordelopen', 'ijshockey', 'jiu-jitsu', 'joggen',
  'judo', 'kaatsen', 'kanoën', 'karate', 'karting', 'kegelen',
  'kegelspel', 'kitesurfen', 'klimmen', 'klimwand', 'knikkeren', 'kogelstoten', 'korfbal', 'kracht­training',
  'kunstrijden', 'lacrosse', 'langebaan­schaatsen', 'lasergame', 'lijnvissen', 'longboarden', 'magisch goochelen',
  'marathon', 'minigolf', 'modelbouwen', 'motorcross', 'motorsport', 'mountainbiken', 'netbal', 'ninjaparcours',
  'nordic walking', 'obstakelloop', 'oriëntatie­lopen', 'paardrijden', 'padel', 'paintball', 'parachute­springen',
  'parkour', 'pétanque', 'pilates', 'poedelen', 'polowedstrijd', 'polsstok­hoogspringen', 'powerlifting', 'racketball',
  'rafting', 'ringsteken', 'rodeo', 'roeien', 'rolschaatsen', 'rots klimmen', 'rugby',
  'sauna', 'schaatsen', 'schaken', 'schans­springen', 'schermen', 'schieten',
  'scrabble', 'shorttrack­sprint', 'sjoelen', 'skeeleren', 'skeleton', 'skiën', 'skislalom',
  'slipstream', 'snowboarden', 'softbal', 'speerwerpen', 'spijkerpoepen', 'squash', 'stoeien',
  'stoepkrijten', 'stuntrijden', 'suppen', 'surfen', 'synchroon­zwemmen', 'taekwondo', 'tafeltennis', 'telemarketeer', 'tennis', 'touwtrekken', 'trail running', 'trampoline­springen', 'trefbal', 'triatlon',
  'turnen', 'varen', 'veldrijden', 'verspringen', 'vissen', 'vliegeren', 'vliegtuig­modelbouwen', 'vliegvissen',
  'voetbal', 'volleybal', 'wandelen', 'waterpolo', 'waterskiën', 'wakeboarden',
  'wcpotwerpen', 'wedstrijd­vissen', 'wielrennen', 'worstelen', 'yoga', 'zeilen', 'zwemmen',
  'aquarelleren', 'borduren', 'breien', 'calligrafie', 'escaperoom',
  'fotograferen', 'gezelschaps­spel', 'haakwerk', 'kaartspelen',
  'kwartetten', 'lego', 'origami', 'pianospelen', 'pottendraaien',
  'quilten', 'tekenen', 'vogelkijken', 'weven',
  
  // Objecten & thuis
  'aansteker', 'aardappel­schiller', 'accordeon', 'actiefiguur', 'afstands­bediening', 'airfryer', 'alarmbel', 'albumhoes',
  'anker', 'ansichtkaart', 'antiek', 'armband­horloge', 'asbak', 'atlas', 'atoomklok', 'avondjurk',
  'bajonet', 'ballon', 'balustrade', 'banjo', 'barbecuetang', 'barometer', 'beeldhouwwerk', 'bezem',
  'biljartbal', 'blender', 'bloesem', 'blokfluit', 'bodycam', 'boekenkast', 'boekenlegger', 'boog',
  'boomerang', 'boormachine', 'borstel', 'briefopener', 'brievenbus', 'bronzen beeld', 'bureau', 'cadeaus',
  'cadeautje', 'camera', 'catapult', 'cello', 'clarinet', 'computer', 'contrabas', 'cornetto',
  'dakpan', 'dartpijl', 'defibrillator', 'deurbel', 'didgeridoo', 'dopje', 'drietand', 'dwarsfluit',
  'dynamo', 'elektrische fiets', 'elpee', 'emmer', 'escalator', 'fagot', 'fakkel', 'fanfare',
  'fiets', 'film', 'föhn', 'ganzenbord', 'gasmasker', 'geigerteller', 'gele kaart', 'gereedschaps­kist',
  'gieter', 'gietijzer', 'gitaar', 'glaasje', 'glazen bol', 'gloeilamp', 'goudstaaf', 'gps-tracker',
  'gramofoon', 'guillotine', 'haardroger', 'hamer', 'handboeien', 'handgranaat', 'handtas', 'hangmat',
  'harp', 'harpoen', 'hartje', 'heksenketel', 'hooivork', 'horloge', 'ijsje', 'koelkast',
  'ijsklontje', 'kaars', 'kaarsenhouder', 'kampioens­beker', 'kanon', 'kanonskogel', 'kapsel',
  'katapult', 'ketting', 'kettingzaag', 'keukenrol', 'kleedhanger', 'klok', 'koekenpan', 'koffer',
  'kompas', 'kookwekker', 'kraan', 'kroon', 'kruisboog', 'krukje', 'kubus', 'kurketrekker',
  'kwik­thermometer', 'ladder', 'lampion', 'lantaarn', 'laserpointer', 'lasso', 'leidraad', 'lepel',
  'leugen­detector', 'liniaal', 'loep', 'luchtballon', 'luidspreker', 'magneet', 'magnetron', 'maillot',
  'manchetknoop', 'mand', 'marionet', 'masker', 'medaille', 'megafoon', 'meubelstuk', 'microfoon',
  'moersleutel', 'molen', 'morse', 'muziekdoos', 'naaimachine', 'naaldhak', 'neonlamp', 'notenbalk',
  'orgelpijp', 'papiermolen', 'parachute', 'paraplu', 'penseel', 'pikhouweel', 'flipperkast', 'pistool­holster',
  'plantenpot', 'poederdoos', 'potloodventer', 'printer', 'projector', 'puzzel', 'puzzeldoos', 'radarscherm',
  'ratelen', 'reddingsvest', 'regenjas', 'rekenmachine', 'robot', 'rode kaart', 'rolluik', 'rolstoel',
  'rubberen eend', 'rugzak', 'sarcofaag', 'satelliet', 'scalpel', 'schaakbord', 'schaar', 'scheeps­schroef',
  'scheermessen', 'schijf van vijf', 'schilderij', 'schommel', 'schroef­sleutel', 'scooter', 'sigaardoos', 'sitar',
  'sleutel', 'slingeren', 'smeedijzer', 'snijplank', 'sok', 'speelgoed', 'speelkaart', 'sphinx',
  'spiegel', 'spijker', 'spijkerbroek', 'spionage­satelliet', 'springveer', 'stethoscoop', 'stoommachine', 'stopwatch', 'strijkijzer',
  'stroom­generator', 'suikerspin', 'tandenborstel', 'tandpasta', 'tarotkaart', 'telescoop', 'telraam', 'tent',
  'theekan', 'theemuts', 'thermometer', 'tijdmachine', 'toorts', 'touwladder', 'trampoline', 'transistor',
  'trap', 'trein', 'trombone', 'trommel', 'trompet', 'tuba', 'tuimelaar', 'tuinkabouter', 'tunnel',
  'turbine', 'ukelele', 'veiligheids­speld', 'verfkwast', 'vergrootglas', 'vloeistof', 'vloerkleed', 'vriezer', 'vuurpijl',
  'waaier', 'wapenschild', 'wasmachine', 'wastafel', 'waterklok', 'waterpas', 'waterpistool', 'weegschaal',
  'wekker', 'wiel', 'xylofoon', 'zaklamp', 'zandloper', 'zeepbel', 'zeeppomp', 'zeilboot',
  'zeis', 'zenderstation', 'zetel', 'zonnebloem', 'zonnebril', 'zonnewijzer', 'zweep',
  'tandenstoker', 'kleerhanger', 'elastiekje', 'kurk',
  'aanrecht', 'bank', 'beker', 'boodschappen­tas', 'broek', 'dekbed', 'deurmat', 'gordijn',
  'handschoen', 'hark', 'hoed', 'jasje', 'knoop', 'koffiezet­apparaat',
  'krijtbord', 'lamp', 'mes', 'muts', 'pan', 'papier', 'pen',
  'plantje', 'pollepel', 'portemonnee', 'riem', 'schoen', 'servet', 'soeplepel',
  'spaarpot', 'stoel', 'stropdas', 'tafel', 'tas', 'theedoek', 'vork', 'wijnglas',
  
  // Natuur & weer
  'aardbeving', 'aard­verschuiving', 'aardworm', 'algen', 'aurora', 'bamboe', 'bergtop', 'blad',
  'bliksem', 'bloem', 'boom', 'bos', 'branding', 'brandnetels', 'bronwater', 'bui',
  'cactus', 'compost', 'dauw', 'delta',
  'dennennaald', 'dijk', 'droogte', 'duin', 'eb', 'ecosysteem',
  'fjord', 'fossiel', 'getijden', 'geiser', 'greppel', 'hagel',
  'hagelstorm', 'herfst', 'herfstblad', 'heuvel', 'hittegolf', 'ijsberg', 'ijspegel', 'ijsschots',
  'ijsvorming', 'inham', 'kapen', 'keien', 'kiezel', 'klif', 'kliffen', 'knop',
  'komeet', 'koraal', 'koraalrif', 'lavastroom', 'lente', 'lucht­vochtigheid',
  'maan', 'maans­verduistering', 'mangrovebos', 'maretak', 'meander', 'mist', 'modder',
  'moeras', 'monsoen', 'morgenrood', 'mos', 'naaldboom', 'nevel', 'noorderlicht', 'oase',
  'oceaan', 'onweer', 'orkaan', 'paddenstoel', 'paddenvijver', 'planeet', 'plas', 'poel',
  'pool', 'poollicht', 'regen', 'regenboog', 'regenbui', 'regenwoud', 'rivier', 'riviermonding',
  'roos', 'rots', 'rotsbodem', 'ruimte', 'savanne', 'schemering', 'schemerlicht', 'schimmel',
  'schimmel­sporen', 'sneeuw', 'sneeuwvlok', 'sneeuwstorm', 'steengroeve', 'ster',
  'stikstof', 'stofwolk', 'storm', 'strand', 'stromend water', 'tij', 'toendra', 'tornado', 'tropische regen',
  'tsunami', 'tulp', 'uiterwaard', 'uitzicht', 'vallei', 'veen', 'veld', 'vijver',
  'vlakte', 'vloed', 'vluchtheuvel', 'voorjaarswind', 'vulkaan', 'vulkaan­uitbarsting', 'waterloop', 'waterval',
  'weide', 'windvlaag', 'woestijn', 'wolk', 'woud', 'zandstorm', 'zee',
  'zeewind', 'zilt water', 'zomer', 'zon', 'zonsondergang', 'zonsopgang', 'zwaartekracht',
  'schelp', 'schaduw',
  'berk', 'eik', 'graan', 'kastanjeboom', 'klaver', 'korenbloem',
  'lavendel', 'linde', 'meidoorn', 'narcis', 'papaver', 'populier', 'wilg', 'viooltje',
  
  // Vervoer & reizen
  'aanhanger', 'achtbaan', 'ambulance', 'benzine', 'benzine­station', 'boeing', 'boot', 'brandweerauto',
  'brandweer­wagen', 'bromfiets', 'bus', 'camper', 'caravan', 'catamaran', 'commandowagen',
  'container', 'container­schip', 'deklift', 'diesel', 'driewieler', 'drijvend hotel',
  'dronepost', 'dubbeldekker', 'duikboot', 'elektrische auto', 'elektrische scooter', 'elektrische step', 'ferry', 'fietsendrager',
  'fietstaxi', 'forens', 'vrachtschip', 'gondel', 'gondelbaan', 'graafmachine', 'grensovergang', 'hangbrug',
  'helikopter', 'hoogspoor­trein', 'hoverboard', 'hovercraft', 'intercity', 'internationale trein',
  'jetpack', 'jetski', 'kabelbaan', 'kajak', 'kar', 'kolenschip', 'kruisvaarder', 'kustwacht',
  'lijnbus', 'locomotief', 'luchtschip', 'maanlander', 'metro', 'minicar', 'monorail',
  'motorfiets', 'motorfiets­sidecar', 'nachttrein', 'onderzeeboot', 'oplegger', 'pantser­voertuig', 'patrouille­boot', 'pick-uptruck',
  'politieauto', 'postduif', 'postkoets', 'racefiets', 'racewagen', 'raket', 'reddingsboot',
  'rijtuig', 'riksja', 'robotaxi', 'roeiboot', 'schip',
  'scooter­deeldienst', 'segway', 'slee', 'sleepboot', 'sloep', 'sneltrein',
  'space shuttle', 'speedboot', 'stadsbus', 'stadsfiets', 'step', 'stoomboot',
  'stoom­locomotief', 'suv', 'taxiboot', 'touringcar', 'tractor', 'tram', 'trolleybus',
  'tuk-tuk', 'veerboot', 'veerfiets', 'vierwieler', 'vliegdekschip', 'vliegende schotel', 'vliegtuig', 'vrachtwagen',
  'waterbus', 'waterfiets', 'water­vliegtuig', 'wielerbaan', 'zeilschip', 'zeilvliegtuig', 'zijspan', 'zonneauto', 'zweef­vliegtuig',
  
  // Gebouwen & plaatsen
  'abdij', 'amfiteater', 'apotheek', 'aquaduct', 'aquarium', 'badhuis', 'balie', 'bankgebouw',
  'begraafplaats', 'bibliotheek', 'bioscoop', 'bloemenmarkt', 'boekenwinkel', 'boerderij', 'boogbrug', 'bouwplaats',
  'bowlingbaan', 'brandweer­kazerne', 'brouwerij', 'brug', 'bunker', 'café', 'camping', 'camping­terrein',
  'casino', 'centrum', 'circus', 'consulaat', 'crematorium', 'cultureel centrum', 'dak', 'dambord',
  'dierentuin', 'discotheek', 'driesterren­hotel', 'duiventoren', 'fabriek', 'fietsenwinkel', 'fontein', 'fort',
  'fruitmarkt', 'galerie', 'gemeentehuis', 'gevangenis', 'gezondheids­centrum', 'grachtenpand', 'gymnasium', 'halfpipe',
  'haven', 'hectometer­paal', 'herberg', 'honkbal­stadion', 'hostel', 'hotel', 'huis', 'iglo',
  'ijsbaan', 'ijsherberg', 'jachthaven', 'jungle', 'kapperszaak', 'kasteel', 'kathedraal', 'kazerne',
  'kerk', 'klimhal', 'klokkenspel', 'klokkentoren', 'klooster', 'koffieshop', 'kolenmijn',
  'krantenwinkel', 'kroeg', 'kunstmuseum', 'laadpaal', 'laboratorium', 'lagerhuis', 'landgoed',
  'loods', 'luchthaven', 'lunapark', 'manege', 'markt', 'megabioscoop', 'monument', 'moskee',
  'museum', 'observatorium', 'dolfinarium', 'ouderenhuis', 'paleis', 'parkbank', 'parkeergarage',
  'pier', 'pleintje', 'politiebureau', 'poppenkast', 'postkantoor', 'pretpark', 'pyramide', 'racebaan', 'rechtbank', 'recreatie­gebied', 'renbaan', 'restaurant', 'rioolstelsel', 'ruïne',
  'schaatsbaan', 'school', 'silo', 'sluis', 'speeltuin', 'sporthal', 'stad', 'stadion',
  'stadshuis', 'standbeeld', 'sterrenwacht', 'strandtent', 'supermarkt', 'synagoge', 'tandarts­praktijk', 'tankstation',
  'tempel', 'theater', 'toren', 'torentje', 'treinstation', 'universiteit', 'vakantiepark', 'vergaderzaal',
  'villa', 'vliegveld', 'voetgangers­zone', 'vuurtoren', 'watertoren', 'wegrestaurant', 'wetenschaps­centrum', 'wijkcentrum',
  'windmolen', 'winkelcentrum', 'ziekenhuis', 'zwembad',
  'bakkerij', 'benzinepomp', 'bloemenwinkel', 'boekhandel', 'buurthuis', 'drogisterij',
  'garage', 'ijssalon', 'kantine', 'kiosk', 'nachtwinkel',
  'pannenkoeken­huis', 'parkeerplaats', 'slagerij', 'snackbar', 'sportschool',
  'stomerij', 'viswinkel', 'warenhuis',
  
  // Acties & situaties
  'ap­plaudisseren', 'fluisteren', 'gebaren', 'gooien', 'graven', 'huppelen',
  'ijsberen', 'klunen', 'knuffelen', 'koken', 'kruipen', 'lachen', 'lopen',
  'maaien', 'naaien', 'omhelzen', 'pesten', 'rennen', 'rollen', 'schilderen', 'slapen', 'snurken', 'springen', 'struikelen',
  'tikken', 'vallen', 'vangen', 'verstoppen', 'vliegen', 'vouwen',
  'waggelen', 'wiebelen',
  'afrekenen', 'afscheid nemen', 'bakken', 'bellen', 'betalen',
  'bewaken', 'bidden', 'blozen', 'branden', 'breken',
  'buigen', 'dagdromen', 'dansen', 'delen', 'douchen', 'dreigen', 'drinken',
  'duwen', 'eten', 'fluiten', 'gapen', 'geven', 'giechelen',
  'gillen', 'gluren', 'groeten', 'hangen', 'helpen', 'hijsen',
  'huilen', 'inschenken', 'inslapen', 'jagen', 'juichen', 'kijken',
  'klagen', 'kloppen', 'knipogen', 'kopen', 'kussen', 'leren', 'lezen',
  'liegen', 'luisteren', 'meten', 'nabootsen', 'nadenken', 'omvallen',
  'onderhandelen', 'ophangen', 'opruimen', 'opstaan', 'oversteken', 'pakken', 'plannen',
  'plassen', 'plukken', 'praten', 'proberen', 'roepen', 'ruiken',
  'ruilen', 'schelden', 'schminken', 'schrijven', 'schuilen', 'schuiven',
  'slepen', 'smeken', 'snijden', 'sparen', 'speuren',
  'stelen', 'stoppen', 'strelen', 'studeren', 'telefoneren',
  'twijfelen', 'uitleggen', 'uitpakken', 'verbergen', 'verdwalen', 'vergeten', 'verkopen',
  'verliezen', 'verrassen', 'verzorgen', 'vluchten', 'volgen', 'wachten', 'wassen',
  'weggooien', 'werken', 'winnen', 'wroeten', 'zingen', 'zoeken', 'zwaaien',
  'niezen', 'sluipen',
  'brand blussen', 'eerste hulp verlenen', 'geblinddoekt', 'geheim bewaren',
  'inhalen', 'misleiden', 'in de rij staan', 'op de vlucht zijn',
  'rijbewijs halen', 'schipbreuk­eling', 'sleutels verliezen', 'verslikken',
  'verstoppertje', 'hinkelen', 'touwtjes­springen',
  'bijna', 'stilte', 'angst', 'geluk', 'haast', 'verveeld',
  'achtervolgen', 'bazelen', 'bedanken', 'begroeten', 'beschermen', 'bewonderen',
  'boeren', 'controleren', 'debatteren', 'demonstreren', 'flirten',
  'herkennen', 'hijgen', 'improviseren', 'jongleren', 'knijpen', 'krabben', 'kwispelen',
  'mompelen', 'ontsnappen', 'overwinnen', 'piepen', 'prikken',
  'rijden', 'schudden', 'slenteren', 'sluimeren', 'snuffelen', 'stampen',
  'staren', 'steigeren', 'trillen', 'wentelen', 'woelen', 'zuchten',
  'avontuur', 'bewijs', 'droom', 'gevaar', 'gewoonte', 'grens', 'herinnering',
  'idee', 'kans', 'karakter', 'leugen', 'liefde', 'mening', 'mysterie',
  'nieuws', 'ongeluk', 'oplossing', 'pech', 'plan', 'probleem', 'raadsel',
  'roddel', 'rust', 'spanning', 'succes', 'toeval', 'traditie', 'trots', 'verrassing',
  'vertrouwen', 'vreugde', 'waarheid', 'wonder',
  
  // Landen & gebieden
  'Afghanistan', 'Albanië', 'Amazone', 'Antarctica', 'Argentinië', 'Armenië', 'Australië', 'Azerbeidzjan',
  'Bahrein', 'Bangladesh', 'Barbados', 'Bhutan', 'Bolivia', 'Botswana', 'Brazilië', 'Brunei',
  'Bulgarije', 'Cambodja', 'Canada', 'Chili', 'Colombia', 'Comoren', 'Congo', 'Cuba',
  'Denemarken', 'Ecuador', 'Egypte', 'Ethiopië', 'Fiji', 'Filippijnen', 'Finland', 'Georgië',
  'Ghana', 'Griekenland', 'Guatemala', 'Haïti', 'Honduras', 'Hongarije', 'Ierland', 'IJsland',
  'Indonesië', 'Irak', 'Iran', 'Israël', 'Italië', 'Jamaica', 'Japan', 'Jemen',
  'Jordanië', 'Kazachstan', 'Kenia', 'Kosovo', 'Kroatië', 'Laos', 'Letland', 'Libanon',
  'Liberia', 'Libië', 'Litouwen', 'Luxemburg', 'Madagascar', 'Maldiven', 'Maleisië', 'Mali',
  'Malta', 'Mexico', 'Moldavië', 'Monaco', 'Mongolië', 'Montenegro', 'Mozambique', 'Myanmar',
  'Namibië', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Noorwegen', 'Oekraïne', 'Oezbekistan',
  'Oman', 'Oostenrijk', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Polen', 'Portugal',
  'Qatar', 'Roemenië', 'Rusland', 'Rwanda', 'Saudi-Arabië', 'Senegal', 'Servië', 'Singapore',
  'Slovenië', 'Soedan', 'Somalië', 'Spanje', 'Sri Lanka', 'Suriname', 'Syrië', 'Tanzania',
  'Thailand', 'Tsjechië', 'Tunesië', 'Turkije', 'Uganda', 'Uruguay', 'Venezuela', 'Vietnam',
  'Zambia', 'Zimbabwe', 'Zweden', 'Zwitserland',

  // Moeilijkere woorden
  'abseilen', 'acupunctuur', 'ader', 'adrenaline', 'afgrond', 'afpersen', 'agressor', 'algoritme',
  'allergie', 'amputatie', 'anarchie', 'anesthesie', 'antenne', 'archeologie', 'assertief', 'astronoom',
  'atoomkern', 'auteursrecht', 'autopsie', 'avondklok', 'baksteen', 'bankroet', 'begrafenis', 'belasting',
  'beroerte', 'beschaving', 'bewusteloos', 'bijtanken', 'stroomuitval', 'bloedarmoede', 'boeddhisme', 'brainstorm',
  'hersens­poeling', 'brand­stichting', 'bureaucratie', 'camouflagepak', 'celsius', 'censuur', 'chantage', 'cholesterol',
  'claustrofobie', 'cliffhanger', 'cocaïne', 'coma', 'concentratie­kamp', 'confrontatie', 'corruptie', 'crisis',
  'cyberpesten', 'dagvaarding', 'dementie', 'democratie', 'depressie', 'desinfecteren', 'dialyse', 'dictator',
  'dilemma', 'diplomatie', 'discriminatie', 'doofstom', 'doping', 'draaikolk',
  'dwangbuis', 'eclips', 'embargo', 'epidemie', 'erfenis', 'evacuatie', 'evolutie', 'executie',
  'explosief', 'faillissement', 'fascisme', 'flitspaal', 'forensisch onderzoek', 'fraude', 'frictie',
  'fundament', 'fusie', 'geheugen­verlies', 'genocide', 'gerechtshof', 'getuige', 'gijzeling', 'gletsjer',
  'globalisering', 'goud', 'grafiek', 'guerrilla oorlog', 'hallucinatie', 'hartstilstand', 'hersenletsel', 'herverdeling',
  'vliegtuig­kaping', 'hiërarchie', 'holocaust', 'homeopathie', 'hoogtevrees', 'hormoon', 'hypnose', 'hypotheek',
  'hysterie', 'illusie', 'immigratie', 'immuunsysteem', 'imperialisme', 'implosie', 'inflatie', 'injectie',
  'inquisitie', 'intimidatie', 'invasie', 'isolatie', 'jaloezie', 'keizersnede', 'kidnapping', 'klimaatcrisis',
  'klokkenluider', 'kluizenaar', 'kwantumfysica', 'lawine', 'legitimiteit', 'lobbyist', 'lockdown',
  'manipulatie', 'martelaar', 'massamoord', 'meditatie', 'migraine', 'militaire coup', 'misogynie', 'monopolie',
  'mutatie', 'muziek', 'narcisme', 'nationalisme', 'nepnieuws', 'nihilisme', 'nucleaire reactor', 'obsessie',
  'oligarchie', 'onder­bewustzijn', 'ondergrondse beweging', 'onteigening', 'oorlogs­misdaad', 'orkest', 'overdosis', 'overlevings­drang',
  'pandemie', 'paradox', 'paranoia', 'parlementaire democratie', 'persoonlijkheids­stoornis', 'pesticide', 'pionier', 'plagiaat',
  'polarisatie', 'populisme', 'posttraumatische stress', 'propaganda', 'protocolbreuk', 'psychiatrie', 'quarantaine', 'radicali­sering',
  'radio­activiteit', 'rebellen', 'recessie', 'referendum', 'reflectie', 'rehabilitatie', 'relatief', 'repatriëring',
  'revolutie', 'reïncarnatie', 'sabotage', 'sancties', 'schandaal', 'schijnheilig', 'schizofrenie', 'seconde', 'slavernij',
  'sluipschutter', 'smokkel', 'soevereini­teit', 'spionage', 'sprookje', 'staking', 'stigma', 'stralings­vergiftiging',
  'surrogaat­moeder', 'taboe', 'terreurcel', 'tijdreizen', 'totalitarisme', 'trans­plantatie', 'tribunaal', 'tribune',
  'tunnelvisie', 'turbulentie', 'uitbuiting', 'uitzetting', 'undercover­agent', 'utopie', 'vaccinatie', 'verjaring',
  'vervreemding', 'vetorecht', 'burgerwacht', 'vluchteling', 'volksopstand', 'vuurwerk', 'wapenhandel', 'wedergeboorte',
  'xenofobie', 'zelfmoord­aanslag', 'zielenknijper', 'zons­verduistering', 'zwarte markt',
  
  // Spreekwoorden & uitdrukkingen
  'alle hens aan dek', 'als de kat van huis is dansen de muizen', 'al doende leert men', 'beter laat dan nooit', 'de appel valt niet ver van de boom', 'door de zure appel heen bijten', 'een gewaarschuwd man telt voor twee', 'van een koude kermis thuiskomen',
  'een oogie dichtknijpen', 'een storm in een glas water', 'ergens de brui aan geven', 'het kind met het badwater weggooien', 'het roer omgooien', 'hoge bomen vangen veel wind', 'iemand een hak zetten',
  'iemand in de maling nemen', 'iemand op de kast jagen', 'in de wolken zijn', 'in het nauw gedreven', 'je kunt niet op twee paarden tegelijk wedden', 'je huid duur verkopen', 'zoals het klokje thuis tikt tikt het nergens',
  'langs de neus weg', 'met de deur in huis vallen', 'met lege handen staan', 'met zijn rug tegen de muur staan', 'met stomheid geslagen zijn', 'nieuwe bezems vegen schoon', 'niet alle dagen zondag', 'olie op het vuur gooien',
  'om de hete brij heen draaien', 'onder de duim houden', 'op zijn lauweren rusten', 'over de rooie gaan', 'over één kam scheren', 'roet in het eten gooien',
  'slapende honden wakker maken', 'muggenziften', 'tegen de stroom ingaan', 'twee honden vechten om een been', 'uit de school klappen', 'van een mug een olifant maken', 'van het kastje naar de muur sturen', 'ver van mijn bed show',
  'vuur met vuur bestrijden', 'water naar de zee dragen', 'wie niet waagt wie niet wint', 'nieuwe wijn in oude zakken', 'wolf in schaapskleren', 'zijn hand overspelen', 'zijn tanden laten zien',
  'zijn vingers branden aan iets', 'zo vader zo zoon', 'broodje aap verhaal', 'door de mand vallen', 'met de gebakken peren zitten', 'de koe bij de horens vatten', 'iemand de wind uit de zeilen nemen', 'met alle winden meedraaien',
  'geen haar op zijn hoofd', 'uit zijn vel springen', 'de hand in eigen boezem steken', 'achter het net vissen', 'iets op zijn beloop laten', 'twee vliegen in één klap', 'als twee druppels water', 'de wind in de zeilen hebben',
  'met de neus in de boter vallen', 'de pineut zijn', 'in de aap gelogeerd zijn', 'al is de leugen nog zo snel de waarheid achterhaalt haar wel', 'beter één vogel in de hand dan tien in de lucht', 'een ezel stoot zich geen twee keer aan dezelfde steen', 'oost west thuis best', 'zoals de waard is vertrouwt hij zijn gasten',
  'wie goed doet goed ontmoet', 'leugens hebben korte benen', 'in het land der blinden is eenoog koning', 'van uitstel komt afstel', 'de eerste klap is een daalder waard', 'eigen haard is goud waard', 'achteraf is iedereen wijs',
  'als het kalf verdronken is dempt men de put', 'gedeelde smart is halve smart', 'gedeelde vreugde is dubbele vreugde', 'geld maakt niet gelukkig', 'het gras is altijd groener aan de andere kant', 'honger is de beste saus', 'ieder huisje heeft zijn kruisje', 'jong geleerd oud gedaan',
  'liefde maakt blind', 'met geduld en vlijt komt men wijd', 'na regen komt zonneschijn', 'nooit te oud om te leren', 'onbekend maakt onbemind', 'oude liefde roest niet', 'praten is zilver zwijgen is goud', 'Rome is niet in één dag gebouwd',
  'schone schijn bedriegt', 'stille wateren hebben diepe gronden', 'tijd is geld', 'uit het oog uit het hart', 'vele handen maken licht werk', 'vertrouwen komt te voet en gaat te paard', 'waar rook is is vuur',
  'wat men niet weet wat men niet deert', 'wie de schoen past trekt hem aan', 'wie het kleine niet eert is het grote niet weerd', 'wie kaatst moet de bal verwachten', 'wie zwijgt stemt toe', 'men moet het ijzer smeden als het heet is',
  'een goed begin is het halve werk', 'aan een half woord genoeg hebben', 'hoe meer zielen hoe meer vreugd', 'het doel heiligt de middelen', 'de pen is machtiger dan het zwaard', 'beter voorkomen dan genezen', 'eind goed al goed',
  'er is geen roos zonder doornen', 'wie het laatst lacht lacht het best', 'in de nood leert men zijn vrienden kennen', 'met één zwaluw is het nog geen zomer', 'over smaak valt niet te twisten', 'wat de boer niet kent dat eet hij niet',
  'een wit voetje halen', 'iets voor zoete koek slikken', 'op de vingers tikken', 'over de schreef gaan', 'er met de pet naar gooien', 'iemand het hoofd op hol brengen', 'hard aan de weg timmeren',
  'ergens geen gat in zien', 'met de neus op de feiten drukken', 'op zijn dooie gemakje', 'schouders ergens onder zetten', 'iemand een loer draaien', 'met fluwelen handschoen aanpakken', 'niet alles is goud wat er blinkt', 'het achter de ellebogen hebben',
  'de knoop doorhakken', 'ergens geen doekjes omwinden', 'iets door de vingers zien', 'iemand naar de mond praten', 'zijn hart op de tong dragen', 'de boot missen', 'er een nachtje over slapen',
  'met de billen bloot', 'niet van gisteren zijn', 'op de hoogte zijn', 'zijn mond voorbij praten', 'tegen beter weten in', 'uit de hand lopen', 'van geen ophouden weten', 'het bijltje erbij neerleggen',
  'met een kluitje in het riet sturen', 'zijn hart ophalen', 'uit de toon vallen', 'de kat uit de boom kijken',
];

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

  const updateCount = (n) => {
    const clamped = Math.min(20, Math.max(2, n));
    setCount(clamped);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < clamped) next.push("");
      return next.slice(0, clamped);
    });
  };

  const updateName = (i, v) => {
    setNames((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  };

  const randomizeNames = () => {
    setNames((prev) => {
      if (prev.length <= 1) return prev;
      let next;
      do {
        next = shuffle([...prev]);
      } while (next.every((n, i) => n === prev[i]));
      return next;
    });
  };

  const canStart = names.every((n) => n.trim().length > 0);

  return (
    <div className="screen setup-screen">
      <div className="setup-card">
        <div className="logo-area">
          <div className="logo-icon">💬</div>
          <h1 className="logo-title">WoordenRaad</h1>
          <p className="logo-sub">Het raad- en uitbeeldspel</p>
        </div>

        <div className="setup-section">
          <label className="setup-label">Aantal spelers</label>
          <div className="time-control">
            <button
              className="time-btn"
              onClick={() => updateCount(count - 1)}
              disabled={count <= 2}
            >−</button>
            <span className="time-display">{count}</span>
            <button
              className="time-btn"
              onClick={() => updateCount(count + 1)}
              disabled={count >= 20}
            >+</button>
          </div>
        </div>

        <div className="setup-section">
          <div className="names-label-row">
            <label className="setup-label">Namen van spelers</label>
            <button className="randomize-btn" onClick={randomizeNames} title="Volgorde door elkaar gooien">
              Andere volgorde
            </button>
          </div>
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
          onClick={() => canStart && onStart(names.map((n) => n.trim()), roundTime)}
          disabled={!canStart}
        >
          Spel starten →
        </button>
      </div>
    </div>
  );
}

function HandoffScreen({ player, onReady }) {
  return (
    <div className="screen handoff-screen">
      <div className="handoff-card">
        <div className="handoff-icon">📱</div>
        <p className="handoff-sub">Geef de telefoon aan</p>
        <h2 className="handoff-name">{player}</h2>
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
  () => `Wat een mooie prestatie! 🏆`,
  () => `Jij verdient een sticker! ⭐`,
  () => `De rest is onder de indruk. 😎`,
  () => `De anderen beven van angst. 🫨`,
  () => `Je staat in vuur en vlam! 🔥`,
  (n) => `${n} ${w(n)} goed geraden! 🥳`,
  (n) => `${n} ${pt(n)} erbij geknalt! 💥`,
  () => `Jij bent niet te stoppen! 🚀`,
  () => `De rest kan wel inpakken! 😄`,
  () => `Heb jij dit zitten oefen? 🤨`,
  (n) => `${n} ${w(n)} in één ronde! 🤩`,
];

const MESSAGES_OK = [
  () => `Lekker bezig! 🙌`,
  (n) => `${n} ${w(n)}, niet slecht! 👍`,
  (n) => `${n} ${pt(n)} op de teller. ✅`,
  () => `De tijd is om! ⏰`,
  (n) => `${n} ${pt(n)} bijgeschreven! ✍️`,
  () => `Ga zo door! 💪`,
];

const MESSAGES_POOR = [
  () => `Ik weet niet of dit goed komt! 😅`,
  () => `Volgende keer beter! 🙈`,
  () => `Haal even rustig adem! 😮‍💨`,
  () => `De volgende ronde gaat beter, toch? 😉`,
  () => `De anderen ruiken bloed! 🩸`,
  () => `De spanning zat er zeker in! 😅`,
];

function getRandomEndMessage(correctCount, roundTime) {
  const target = roundTime / 6;
  const ratio = target > 0 ? correctCount / target : 0;

  let pool, tier;
  if (ratio >= 1.0) {
    pool = MESSAGES_GREAT;
    tier = "great";
  } else if (ratio >= 0.6) {
    pool = MESSAGES_OK;
    tier = "ok";
  } else {
    pool = MESSAGES_POOR;
    tier = "poor";
  }

  const idx = Math.floor(Math.random() * pool.length);
  return { message: pool[idx](correctCount), tier, count: correctCount };
}

function RoundScreen({ player, words, onRoundEnd, roundTime }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0 });
  const endMessageRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [flash, setFlash] = useState(null); // "correct" | "skip"
  const [timesUp, setTimesUp] = useState(false); // timer ran out, but current word can still be finished
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const startTimeRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(roundTime); // exact float for smooth circle

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, roundTime - elapsed);
      setTimeRemaining(remaining);
      setTimeLeft(Math.round(remaining));
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTimesUp(true);
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 400);
  };

  const wordIndexRef = useRef(0);
  const [skipPenalty, setSkipPenalty] = useState(0); // countdown 3..2..1..0
  const penaltyRef = useRef(null);

  const finishRound = useCallback((finalScores, finalWordIndex) => {
    endMessageRef.current = getRandomEndMessage(finalScores.correct, roundTime);
    setDone(true);
    setTimeout(() => onRoundEnd({ ...finalScores, wordsUsed: finalWordIndex }), 2800);
  }, [onRoundEnd, roundTime]);

  const correct = () => {
    if (done || skipPenalty > 0) return;
    triggerFlash("correct");
    const newScores = { ...scoresRef.current, correct: scoresRef.current.correct + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    if (timesUp) {
      finishRound(newScores, wordIndexRef.current);
    }
  };

  const skip = () => {
    if (done || skipPenalty > 0) return;
    triggerFlash("skip");
    const newScores = { ...scoresRef.current, skipped: scoresRef.current.skipped + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    if (timesUp) {
      finishRound(newScores, wordIndexRef.current);
      return;
    }
    // Start 3-second penalty countdown
    setSkipPenalty(3);
    let count = 3;
    penaltyRef.current = setInterval(() => {
      count -= 1;
      setSkipPenalty(count);
      if (count <= 0) {
        clearInterval(penaltyRef.current);
      }
    }, 1000);
  };

  useEffect(() => () => clearInterval(penaltyRef.current), []);

  const pct = timeRemaining / roundTime;
  const timerColor = timesUp ? "#f87171" : timeLeft > 30 ? "#4ade80" : timeLeft > 10 ? "#fbbf24" : "#f87171";
  const circumference = 2 * Math.PI * 44;

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
            <div className="penalty-label">Overgeslagen — wacht even</div>
            <div className="penalty-countdown">{skipPenalty}</div>
          </div>
        ) : (
          <>
            <div className="word-anchor">
              <div className="word-counter">woord {wordIndex + 1}</div>
              <div className="current-word">{words[wordIndex]}</div>
              <div className="times-up-banner" style={{visibility: timesUp ? 'visible' : 'hidden'}}>⏰ Tijd is om — maak dit woord nog af!</div>
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

function ScoreScreen({ players, scores, currentRound, totalRounds, onNext, onRestart, onContinue }) {
  const sorted = [...players]
    .map((p, i) => ({ name: p, score: scores[i] }))
    .sort((a, b) => b.score - a.score);

  const isLast = currentRound >= totalRounds;

  return (
    <div className="screen score-screen">
      <div className="score-card">
        <h2 className="score-title">{isLast ? "🏆 Eindstand" : `Stand na ronde ${currentRound}`}</h2>
        <div className="scores-list">
          {sorted.map((p, i) => (
            <div key={p.name} className={`score-row rank-${i + 1}`}>
              <span className="rank-badge">{i === 0 ? "👑" : i + 1}</span>
              <span className="score-name">{p.name}</span>
              <span className="score-pts">{p.score} pt</span>
            </div>
          ))}
        </div>
        {isLast ? (
          <div className="final-btns">
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

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [phase, setPhase] = useState("setup"); // setup | handoff | round | score
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [displayScores, setDisplayScores] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNum, setRoundNum] = useState(0); // how many rounds completed
  const [wordDeck, setWordDeck] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);

  const totalRounds = players.length; // each player plays once = 1 full round

  const startGame = (names, time) => {
    const empty = Array(names.length).fill(0);
    setPlayers(names);
    setScores(empty);
    setDisplayScores(empty);
    setCurrentPlayerIdx(0);
    setRoundNum(0);
    setUsedWords(new Set());
    setRoundTime(time);
    setWordDeck(shuffle(WORDS));
    setPhase("handoff");
  };

  const onRoundReady = () => setPhase("round");

  const onRoundEnd = ({ correct, wordsUsed }) => {
    const newScores = [...scores];
    newScores[currentPlayerIdx] += correct;
    setScores(newScores);
    setDisplayScores(newScores);
    // Mark the words shown this round as used
    const newUsed = new Set(usedWords);
    wordDeck.slice(0, wordsUsed).forEach(w => newUsed.add(w));
    setUsedWords(newUsed);
    setRoundNum((r) => r + 1);
    setPhase("score");
  };

  const onNext = (nextUsed) => {
    const nextIdx = (currentPlayerIdx + 1) % players.length;
    setCurrentPlayerIdx(nextIdx);
    const available = WORDS.filter(w => !(nextUsed || usedWords).has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : WORDS));
    setPhase("handoff");
  };

  const onContinue = () => {
    // Start a new full rotation keeping current scores and excluding used words
    setCurrentPlayerIdx(0);
    setRoundNum(0);
    const available = WORDS.filter(w => !usedWords.has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : WORDS));
    setPhase("handoff");
  };

  const onRestart = () => {
    setPhase("setup");
    setPlayers([]);
    setScores([]);
  };

  const currentWords = wordDeck;

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


        .penalty-wrap { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .penalty-label { font-size: clamp(13px, 3.5vw, 16px); color: #fbbf24; opacity: 0.8; }
        .penalty-countdown {
          font-family: 'Righteous', cursive;
          font-size: 96px;
          color: #fbbf24;
          animation: pulse 0.9s infinite alternate;
          line-height: 1;
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

        /* ── Scores ── */
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
        .final-btns { display: flex; flex-direction: column; }

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
          onReady={onRoundReady}
        />
      )}

      {phase === "round" && (
        <RoundScreen
          key={`${currentPlayerIdx}-${roundNum}`}
          player={players[currentPlayerIdx]}
          words={currentWords}
          onRoundEnd={(s) => onRoundEnd(s)}
          roundTime={roundTime}
        />
      )}

      {phase === "score" && (
        <ScoreScreen
          players={players}
          scores={displayScores}
          currentRound={roundNum}
          totalRounds={totalRounds}
          onNext={() => onNext(usedWords)}
          onRestart={onRestart}
          onContinue={onContinue}
        />
      )}
    </>
  );
}
