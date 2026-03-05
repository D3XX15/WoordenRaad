import { useState, useEffect, useRef, useCallback } from "react";

const WORDS = [
  // Dieren
  "vliegtuig", "banaan", "olifant", "gitaar", "vulkaan", "ballon", "schildpad", "regenboog",
  "astronaut", "ijsberg", "piraat", "tornado", "cactus", "robot", "waterval", "dinosaurus",
  "zeemeermin", "kameleon", "trampoline", "iglo", "tovenaar", "krokodil", "paddenstoel",
  "vuurwerk", "flamingo", "orkest", "sprookje", "tijger", "submarine", "circus", "detective",
  "magneet", "hangmat", "kompas", "lampion", "kwallen", "marionet", "reddingsvest", "telescoop",
  "wasmachine", "zonnebloem", "aardbei", "badminton", "bezem", "blokfluit", "boekenkast",
  "brug", "bureau", "cadeautje", "camera", "camping", "caramel", "chocolade", "computer",
  "dolfijn", "druiven", "duif", "ei", "escalator", "fiets", "film", "fontein",
  "giraffe", "goud", "haai", "harp", "hartje", "heks", "helikopter",
  "hond", "horloge", "ijsje", "inktvis", "jongleur", "jungle", "kaars", "kanon",
  "kapsel", "kasteel", "kat", "ketting", "klok", "koffer", "konijn", "krab",
  "kraan", "kroon", "ladder", "leeuw", "lepel", "luchtballon", "maan",
  "mand", "masker", "medaille", "mier", "molen", "muziek",
  "nijlpaard", "octopus", "orang-oetan", "parachute", "papegaai", "parkbank",
  "pinguin", "pizza", "planeet", "politieagent", "poppenkast", "raket", "regen",
  "roos", "rugzak", "salade", "satelliet", "schaar", "schilderij", "school",
  "scooter", "slang", "sneeuw", "sok", "speelgoed", "spiegel", "spin",
  "stad", "ster", "stoofpot", "storm", "strand", "sumo", "surfen", "taart",
  "tandpasta", "tent", "theater", "theekan", "trap", "trein",
  "trommel", "tulp", "tunnel", "uil", "ukelele", "vampier",
  "vlinder", "voetbal", "volleybal", "vos", "walvis", "luchtballon",
  "wiel", "wolk", "yoga", "zeepbel", "zeilboot",
  // Voedsel & drinken
  "appeltaart", "avocado", "bacon", "bagel", "barbecue", "bitterbal", "bloemkool",
  "boterham", "broccoli", "bruschetta", "croissant", "curry", "donut", "erwtensoep",
  "friet", "fruitsalade", "garnaal", "gehaktbal", "goulash", "groentesoep", "hamburger",
  "hotdog", "hummus", "kaas", "kaneelbroodje", "kapsalon", "kerrieworst", "kip",
  "kipnuggets", "koffie", "kroket", "lasagne", "limonade", "macaroni", "milkshake",
  "muffin", "nasi", "noedels", "olijf", "omelet", "paella", "pancake", "pasta",
  "pindakaas", "popcorn", "ravioli", "risotto", "roomijs", "sandwich", "sashimi",
  "smoothie", "soep", "spaghetti", "sushi", "taco", "thee", "tiramisu", "toast",
  "tomatensoep", "wafel", "watermeloen", "witlof", "wrap", "yoghurt",
  // Beroepen & mensen
  "acrobaat", "advocaat", "architect", "bakker", "bibliothecaris", "brandweer",
  "buschauffeur", "chef-kok", "chirurg", "clown", "coach", "cowboy", "danser",
  "dierenarts", "dirigent", "dokter", "fotograaf", "geograaf", "gids", "goochelaar",
  "journalist", "kapitein", "kassamedewerker", "kunstenaar", "leraar", "matroos",
  "monteur", "musicus", "ontwerper", "piloot", "postbode", "profvoetballer",
  "rechercheur", "ridder", "ruimtevaarder", "schilder", "schoonmaker", "sheriff",
  "skateboarder", "soldaat", "stand-upcomedian", "stratenmaker", "taxichauffeur",
  "tuinman", "verpleegkundige", "visser", "vuilnisman", "wetenschapper", "wielrenner",
  "winkelier", "zanger", "zeiler", "zwemmer",
  // Sport & hobby's
  "aerobics", "basketbal", "biljarten", "boksen", "bowling", "breakdance", "cricket",
  "curling", "fietsen", "golfen", "gymnastiek", "handbal", "hardlopen", "hockey",
  "judo", "karate", "klimmen", "korfbal", "mountainbiken", "paardrijden", "roeien",
  "rugby", "schaatsen", "schaken", "schieten", "skiën", "snowboarden", "squash",
  "surfen", "taekwondo", "tafeltennis", "tennis", "trampolinespringen", "vissen",
  "vliegeren", "waterpolo", "wielrennen", "worstelen", "zeilen", "zwemmen",
  // Objecten & thuis
  "aansteker", "aardappelschiller", "afstandsbediening", "airfryer", "alarmbel",
  "ansichtkaart", "atlas", "barbecuetang", "blender", "boormachine", "borstel",
  "brievenbus", "deurbel", "dopje", "elektrische fiets", "föhn", "gieter",
  "gloeilamp", "hamer", "handtas", "haardroger", "ijskast", "ijsklontje", "kaarsenhouder",
  "keukenrol", "kleedhanger", "koekenpan", "krukje", "kurketrekker", "liniaal",
  "luidspreker", "magnetron", "meubelwagen", "mikrofoon", "naaimachine", "paraplu",
  "penseel", "plantenpot", "printer", "puzzel", "rekenmachine", "rolstoel",
  "schaakbord", "schommel", "sleutel", "snijplank", "speelkaart", "spijker",
  "stopwatch", "strijkijzer", "tandenborstel", "thermometer", "tijdmachine",
  "touwladder", "trampoline", "verfkwast", "wastafel", "weegschaal", "wekker",
  "zeeppomp", "zetel", "zonnebril", "zwembad",
  // Natuur & weer
  "aardbeving", "aardverschuiving", "aardworm", "blad", "bloem", "boom",
  "bos", "branding", "bui", "dageraad", "dauw", "droogte", "duinpan",
  "eb", "gletsjers", "golf", "hagel", "herfst", "heuvel", "ijspegel",
  "kiezel", "klif", "koraalrif", "lavastroom", "lente", "mist", "modder",
  "mos", "nevel", "onweer", "paddenvijver", "plas", "regenbui", "rivier",
  "rots", "schimmel", "schemering", "sneeuwvlok", "steengroeve", "storm",
  "stromend water", "tsunami", "veld", "vijver", "vlakte", "vloed",
  "vulkaanuitbarsting", "waterval", "weide", "woestijn", "woud", "zandstorm",
  "zee", "zomer", "zon", "zonsondergang", "zonsopgang", "zwaartekracht",
  // Vervoer & reizen
  "ambulance", "boot", "brandweerauto", "bus", "camper", "caravan", "draagstoel",
  "duikboot", "elektrische auto", "ferry", "fietskar", "forens", "gondel",
  "graafmachine", "hoverboard", "jetski", "kabelbaan", "kajak", "kar",
  "locomotief", "metro", "monorail", "motorfiets", "pick-uptruck", "politieauto",
  "racewagen", "riksja", "roeboot", "rolschaatsen", "segway", "slee",
  "sloep", "speedboot", "step", "stoomboot", "stoomlocomotief", "suv",
  "tractor", "tram", "trolleybus", "vrachtwagen", "vliegdekschip", "veerboot",
  "zweefvliegtuig",
  // Gebouwen & plaatsen
  "apotheek", "aquarium", "bioscoop", "boerderij", "bowlingbaan", "casino",
  "discotheek", "dierentuin", "fabriek", "gevangenis", "ijsbaan", "jachthaven",
  "kapperszaak", "kasteel", "kerk", "krantenwinkel", "kunstmuseum", "laboratorium",
  "lagune", "loods", "lunapark", "markt", "moskee", "museum", "paleis",
  "parkeergarage", "pretpark", "racebaan", "restaurant", "schaatsbaan",
  "speeltuin", "sporthal", "stadion", "sterrenwacht", "supermarkt", "synagoge",
  "tandartspraktijk", "tempel", "theater", "torentje", "treinstation",
  "universiteit", "vuurtoren", "watertoren", "windmolen", "winkelcentrum",
  "ziekenhuis", "zwembad",
  // Acties & situaties
  "applaudisseren", "duiken", "fluisteren", "gaaien", "gebaren", "gooien",
  "graven", "huppelen", "ijsberen", "klimmen", "knuffelen", "koken",
  "kruipen", "lachen", "lopen", "maaien", "naaien", "omhelzen",
  "rennen", "roeien", "rollen", "schommelen", "schilderen", "skiën",
  "slapen", "slingeren", "snurken", "springen", "stoeien", "struikelen",
  "surfen", "tikken", "trampolinespringen", "vallen", "vangen", "verstoppen",
  "vliegen", "vouwen", "waggelen", "wiebelen", "zeilen", "zwemmen",

  // Moeilijkere woorden
  'abseilen', 'acupunctuur', 'adrenaline', 'afgrond', 'afpersen', 'agressor', 'algoritme',
  'allergie', 'amputatie', 'anarchie', 'anesthesie', 'antenne', 'archeologie', 'assertief',
  'astronoom', 'atoomkern', 'autopsie', 'avondklok', 'baksteen', 'bankroet', 'begrafenis',
  'belasting', 'beroerte', 'beschaving', 'bewusteloos', 'bijtanken', 'blackout', 'bloedarmoede',
  'boeddhisme', 'brainwash', 'brainstorm', 'brandstichting', 'bureaucratie', 'camouflagepak',
  'censuur', 'chantage', 'cholesterol', 'claustrofobie', 'cliffhanger', 'cocaïne', 'coma',
  'concentratiekamp', 'confrontatie', 'corruptie', 'crisis', 'cyberpesten', 'dagvaarding',
  'dementie', 'democratie', 'depressie', 'desinfecteren', 'dialyse', 'dictator', 'dilemma',
  'diplomatie', 'discriminatie', 'dissectie', 'doping', 'draaikolk', 'droogte', 'dwangbuis',
  'eclips', 'embargo', 'epidemie', 'erfenis', 'evacuatie', 'evolutie', 'executie',
  'explosief', 'faillissement', 'fanatisme', 'fascisme', 'flitspaal', 'forensisch', 'fraude',
  'frictie', 'fundamentalisme', 'fusie', 'geheugenverlies', 'genocide', 'gerechtshof',
  'getuige', 'gijzeling', 'gletsjer', 'globalisering', 'grafiek', 'guerrilla', 'hallucinatie',
  'hartstilstand', 'hersenletsel', 'herverdeling', 'hiërarchie', 'hijacking', 'holocaust',
  'homeopathie', 'hoogtevrees', 'hormoon', 'hypnose', 'hypotheek', 'hysterie', 'illusie',
  'immigratie', 'immuunsysteem', 'imperialisme', 'implosie', 'inflatie', 'injectie',
  'inquisitie', 'intimidatie', 'invasie', 'isolatie', 'jaloezie', 'keizersnede', 'kidnapping',
  'klimaatcrisis', 'klokkenluider', 'kluizenaar', 'kwantumfysica', 'laserschip', 'lawine',
  'legitimiteit', 'lobbyist', 'lockdown', 'manipulatie', 'martelaar', 'massamoord',
  'meditatie', 'migraine', 'militaire coup', 'misogynie', 'monopolie', 'mutatie', 'narcisme',
  'nationalisme', 'nepnieuws', 'nihilisme', 'nucleaire reactor', 'obsessie', 'oligarchie',
  'onderbewustzijn', 'ondergrondse beweging', 'onteigening', 'oorlogsmisdaad', 'overdosis',
  'overlevingsdrang', 'pandemie', 'paradox', 'paranoia', 'parlementaire democratie',
  'persoonlijkheidsstoornis', 'pesticide', 'pionier', 'plagiaat', 'polarisatie', 'populisme',
  'posttraumatische stress', 'propaganda', 'protocolbreuk', 'psychiatrie', 'quarantaine',
  'radicalisering', 'radioactiviteit', 'rebellie', 'reïncarnatie', 'recessie', 'referendum',
  'rehabilitatie', 'relatief', 'repatriëring', 'revolutie', 'sabotage', 'sancties',
  'schandaal', 'schizofrenie', 'slavernij', 'sluipschutter', 'smokkel', 'soevereiniteit',
  'spionage', 'staking', 'stigma', 'stralingsvergiftiging', 'surrogaatmoeder', 'taboe',
  'terreurcel', 'tijdreizen', 'totalitarisme', 'transplantatie', 'tribunal', 'tsunami',
  'tunnelvisie', 'turbulentie', 'uitbuiting', 'uitzetting', 'undercover', 'utopie',
  'vaccinatie', 'verjaring', 'vervreemding', 'vetorecht', 'vluchteling', 'volksopstand',
  'wapenhandel', 'wedergeboorte', 'whistleblower', 'xenofobie', 'zelfmoordaanslag',
  'zielenknijper', 'zonsverduistering', 'zwarte markt',

  // Spreekwoorden
  'alle hens aan dek', 'als de kat van huis is dansen de muizen', 'al doende leert men',
  'beter laat dan nooit', 'de appel valt niet ver van de boom', 'door de zure appel heen bijten',
  'een gewaarschuwd man telt voor twee', 'een koude douche krijgen', 'een oogie dichtknijpen',
  'een storm in een glas water', 'ergens de brui aan geven', 'goede raad is duur',
  'het kind met het badwater weggooien', 'het roer omgooien', 'hoge bomen vangen veel wind',
  'iemand een hak zetten', 'iemand in de maling nemen', 'iemand op de kast jagen',
  'in de wolken zijn', 'in het nauw gedreven', 'je bed hebben gelegen',
  'je kunt niet op twee paarden tegelijk wedden', 'je vel te duur verkopen',
  'zoals het klokje thuis tikt tikt het nergens', 'langs de neus weg',
  'met de deur in huis vallen', 'met lege handen staan', 'met zijn rug tegen de muur staan',
  'met stomheid geslagen zijn', 'nieuwe bezems vegen schoon', 'niet alle dagen zondag',
  'olie op het vuur gooien', 'om de hete brij heen draaien', 'onder de duim houden',
  'op zijn lauweren rusten', 'over de rooie gaan', 'over één kam scheren',
  'potten en pannen gooien', 'roet in het eten gooien', 'schijnheilig als een kat',
  'slapende honden wakker maken', 'spijkers op laag water zoeken', 'tegen de stroom ingaan',
  'twee honden vechten om een been', 'uit de school klappen', 'van een mug een olifant maken',
  'van het kastje naar de muur sturen', 'ver van je bed show',
  'vlak voor het doel missen', 'vuur met vuur bestrijden', 'water naar de zee dragen',
  'wie niet waagt wie niet wint', 'wijn in oude zakken', 'wolf in schaapskleren',
  'zijn hand overspelen', 'zijn tanden laten zien', 'zijn vingers branden aan iets',
  'zo vader zo zoon', 'door de mand vallen', 'met de gebakken peren zitten',
  'de koe bij de horens vatten', 'het bijltje erbij neergooien', 'iemand de wind uit de zeilen nemen',
  'met alle winden meedraaien', 'geen haar op zijn hoofd', 'uit zijn vel springen',
  'de hand in eigen boezem steken', 'achter het net vissen', 'iets op zijn beloop laten',
  'twee vliegen in één klap', 'een blinde kan zien', 'als twee druppels water',
  'met de neus in de boter vallen', 'de pineut zijn', 'in de aap gelogeerd zijn',
  'al is de leugen nog zo snel de waarheid achterhaalt haar wel',
  'beter één vogel in de hand dan tien in de lucht',
  'een ezel stoot zich geen twee keer aan dezelfde steen',
  'oost west thuis best',
  'zoals de waard is vertrouwt hij zijn gasten',
  'wie goed doet goed ontmoet',
  'leugens hebben korte benen',
  'in het land der blinden is eenoog koning',
  'de wal keert het schip',
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
  'Rome is niet in één dag gebouwd',
  'schone schijn bedriegt',
  'stille wateren hebben diepe gronden',
  'tijd is geld',
  'uit het oog uit het hart',
  'vele handen maken licht werk',
  'vertrouwen komt te voet en gaat te paard',
  'voorzichtigheid is de moeder van de porseleinkast',
  'waar rook is is vuur',
  'wat men niet weet wat men niet deert',
  'wie de schoen past trekt hem aan',
  'wie het kleine niet eert is het grote niet weerd',
  'wie kaatst moet de bal verwachten',
  'wie zwijgt stemt toe',
  'zo gewonnen zo geronnen',
  'tussen droom en daad staan wetten in de weg',
  'men moet het ijzer smeden als het heet is',
  'een goed begin is het halve werk',
  'een half woord is genoeg voor een verstandige',
  'hoe meer zielen hoe meer vreugd',
  'het doel heiligt de middelen',
  'de pen is machtiger dan het zwaard',
  'beter voorkomen dan genezen',
  'de kost gaat voor de baat uit',
  'eind goed al goed',
  'er is geen roos zonder doornen',
  'goede wijn behoeft geen krans',
  'hij die lacht het laatst lacht het best',
  'in de nood leert men zijn vrienden kennen',
  'met één zwaluw is het nog geen zomer',
  'niets is zo oud als de nieuwtjes van gisteren',
  'over smaak valt niet te twisten',
  'wat de boer niet kent dat eet hij niet',
  'zo de ouders zongen piepen de jongen',
  'iemand een wit voetje halen',
  'iets voor zoete koek slikken',
  'op de vingers tikken',
  'over de schreef gaan',
  'voor de vuist weg praten',
  'er met de pet naar gooien',
  'iemand het hoofd op hol brengen',
  'ergens geen gat in zien',
  'met de neus op de feiten drukken',
  'op zijn dooie gemakje',
  'schouders ergens onder zetten',
  'iemand een loer draaien',
  'met de handschoen aanpakken',
  'niet alles is goud wat er blinkt',
  'achter de ellebogen zitten',
  'de knoop doorhakken',
  'ergens geen doekjes omwinden',
  'iets door de vingers zien',
  'iemand naar de mond praten',
  'zijn hart op de tong dragen',
  'de boot missen',
  'er een nachtje over slapen',
  'iemand de loef afsteken',
  'met de billen bloot',
  'niet van gisteren zijn',
  'op de hoogte zijn',
  'zijn mond voorbij praten',
  'tegen beter weten in',
  'uit de hand lopen',
  'van geen ophouden weten',
  'het bijltje erbij neerleggen',
  'met een kluitje in het riet sturen',
  'zijn hartje ophalen',
  'uit de toon vallen',
  'de kat uit de boom kijken',

  // Nog meer woorden
  'appelmoes',
  'asperges',
  'baguette',
  'balsamico',
  'basilicum',
  'bechamelsaus',
  'biefstuk',
  'bitterballen',
  'bladerdeeg',
  'boerenkool',
  'bolognese',
  'bonbons',
  'borrelplank',
  'bouillon',
  'brownie',
  'bruschetta',
  'caesarsalade',
  'cannelloni',
  'caprese',
  'carpaccio',
  'cheesecake',
  'chips',
  'churros',
  'coleslaw',
  'couscous',
  'crème brûlée',
  'dauphinoise',
  'dim sum',
  'donuts',
  'dragonfruit',
  'eclairs',
  'edamame',
  'enchilada',
  'falafel',
  'fondue',
  'frittata',
  'gazpacho',
  'gelato',
  'gyros',
  'hoisinsaus',
  'jalapeno',
  'jambalaya',
  'kaasfondue',
  'kaiserschmarrn',
  'kimchi',
  'kwarktaart',
  'loempia',
  'macaron',
  'mangochutney',
  'marshmallow',
  'mayonaise',
  'mochi',
  'moussaka',
  'mozzarella',
  'nougat',
  'pad thai',
  'paella',
  'pannenkoek',
  'parmezaan',
  'passievrucht',
  'penne',
  'pesto',
  'piccalilly',
  'poffertjes',
  'pommes frites',
  'prei',
  'profiteroles',
  'pulled pork',
  'quiche',
  'ratatouille',
  'ravioli',
  'rendang',
  'ricotta',
  'rijstpap',
  'rolmops',
  'rucola',
  'satésaus',
  'scones',
  'shakshuka',
  'slagroom',
  'soufflé',
  'stampot',
  'strudel',
  'tapenade',
  'tartaar',
  'tempura',
  'teriyaki',
  'tiramisu',
  'tompouce',
  'tortilla',
  'truffel',
  'tzatziki',
  'uiensoep',
  'vanillepudding',
  'vichyssoise',
  'wafels',
  'wontonsoep',
  'aardvarken',
  'albatros',
  'alpaca',
  'ananas',
  'axolotl',
  'baviaan',
  'bever',
  'bizon',
  'blauwvintonijn',
  'boomkikker',
  'buffel',
  'buldog',
  'cheetah',
  'chihuahua',
  'cobra',
  'condor',
  'dingo',
  'drakehagedis',
  'dromedaris',
  'dwergpinguïn',
  'eland',
  'elektrische paling',
  'fennek',
  'fret',
  'galapagosschildpad',
  'gecko',
  'gibbon',
  'goudvis',
  'gorilla',
  'grizzlybeer',
  'guanaco',
  'hamster',
  'havik',
  'hermelijn',
  'hyena',
  'ibis',
  'impala',
  'jaguar',
  'kaketoe',
  'kangoeroe',
  'koala',
  'komodovaraan',
  'kraanvogel',
  'krokodil',
  'lama',
  'lamprei',
  'lemur',
  'lepelaar',
  'luiaard',
  'lynx',
  'maanvis',
  'mangrovehaai',
  'meerkat',
  'miereneter',
  'mink',
  'moeflon',
  'mol',
  'muskusrat',
  'narwal',
  'neushoorn',
  'okapi',
  'orca',
  'otter',
  'panda',
  'panther',
  'pauw',
  'pelikaan',
  'platypus',
  'poema',
  'porcupine',
  'prairiehond',
  'raaf',
  'reiger',
  'rendier',
  'reuzenoctopus',
  'roerdomp',
  'salamander',
  'schildluis',
  'seahorse',
  'seconde',
  'serval',
  'sikahert',
  'skunk',
  'sneeuwluipaard',
  'sperwer',
  'springbok',
  'stinkdier',
  'stokstaartje',
  'struisvogel',
  'suikerspringer',
  'tapir',
  'tarantula',
  'toekaan',
  'valkparkiet',
  'veelvraat',
  'vliegende vis',
  'vombat',
  'wasbeer',
  'waterbuffel',
  'wezel',
  'wombat',
  'woudaap',
  'yakoe',
  'zebra',
  'zeehond',
  'zeeotter',
  'zeeschildpad',
  'accountant',
  'acteur',
  'apotheker',
  'archeoloog',
  'astroloog',
  'automonteur',
  'barista',
  'beveiliger',
  'biochemicus',
  'blogger',
  'boekhoudster',
  'botanicus',
  'brandweerman',
  'brouwerij',
  'cardioloog',
  'casinodealer',
  'chiropractor',
  'circusdirecteur',
  'croupier',
  'cryptograaf',
  'dansleraar',
  'dataanalist',
  'dermatoloog',
  'dierentrainer',
  'diplomaat',
  'dj',
  'documentairemaker',
  'dronepiloot',
  'duikinstructeur',
  'econoom',
  'entomoloog',
  'etholoog',
  'evenementenorganisator',
  'examinator',
  'exploratiegeoloog',
  'extinctiebiolog',
  'farmacoloog',
  'filosoof',
  'fysiotherapeut',
  'gastronoom',
  'geneesheer',
  'geoloog',
  'glazenwasser',
  'grafisch ontwerper',
  'gynaecoloog',
  'hacker',
  'handelaar',
  'heraldicus',
  'hersenchirurg',
  'hovenier',
  'hypnotherapeut',
  'ijsbeeldhouwer',
  'illustrator',
  'immunoloog',
  'informaticus',
  'ingenieur',
  'inspecteur',
  'instrumentmaker',
  'jagter',
  'juwelier',
  'kaartenmaker',
  'kapper',
  'kartograaf',
  'kinderarts',
  'klimaatoloog',
  'klokkenhersteller',
  'klusjesman',
  'kok',
  'kostuumontwerper',
  'kraamverzorger',
  'kruidenier',
  'kunstcriticus',
  'kweker',
  'laborant',
  'landmeter',
  'lasser',
  'levensmiddelentechnoloog',
  'loodgieter',
  'luchtverkeersleider',
  'magiër',
  'makelaar',
  'marionettespeler',
  'meteoroloog',
  'microbioloog',
  'mijningenieur',
  'modeontwerper',
  'moleculair bioloog',
  'museumconservator',
  'nanotechnoloog',
  'neuroloog',
  'notaris',
  'numismaticus',
  'oceanograaf',
  'oogarts',
  'operazanger',
  'optician',
  'ornitholoog',
  'orthopeed',
  'paleontoloog',
  'parasitoloog',
  'parfumeur',
  'patholoog',
  'pedagoog',
  'planoloog',
  'podoloog',
  'politicoloog',
  'primatolog',
  'producent',
  'psychiater',
  'psycholoog',
  'radioloog',
  'revalidatiearts',
  'rijksbouwmeester',
  'roboticus',
  'ruimtewetenschapper',
  'scenarioschrijver',
  'scheikundige',
  'schilder',
  'schrijver',
  'sieraadontwerper',
  'slager',
  'socioloog',
  'sommelier',
  'spelontwikkelaar',
  'stadsplanner',
  'sterrenwacht',
  'steward',
  'stoker',
  'strateeg',
  'stuntman',
  'systeembeheerder',
  'tatoeëerder',
  'taxidermist',
  'textielontwerper',
  'timmerman',
  'tolk',
  'toxicoloog',
  'trainer',
  'tuinier',
  'uroloog',
  'verzekeringsagent',
  'vioolmaker',
  'vliegtuigbouwer',
  'voedingswetenschapper',
  'volkskundige',
  'vuurwerkmaker',
  'wijnboer',
  'wiskundige',
  'woordvoerder',
  'zeebioloog',
  'ziekenhuisdirecteur',
  'zoöloog',
  'Afghanistan',
  'Albanië',
  'Amazone',
  'Antarctica',
  'Argentinië',
  'Armenië',
  'Australië',
  'Azerbeidzjan',
  'Bahrein',
  'Bangladesh',
  'Barbados',
  'Bhutan',
  'Bolivia',
  'Botswana',
  'Brazilië',
  'Brunei',
  'Bulgarije',
  'Cambodja',
  'Canada',
  'Chili',
  'Colombia',
  'Comoren',
  'Congo',
  'Cuba',
  'Denemarken',
  'Ecuador',
  'Egypte',
  'Ethiopië',
  'Fiji',
  'Filippijnen',
  'Finland',
  'Georgië',
  'Ghana',
  'Griekenland',
  'Guatemala',
  'Haïti',
  'Honduras',
  'Hongarije',
  'IJsland',
  'Indonesië',
  'Irak',
  'Iran',
  'Ierland',
  'Israël',
  'Italië',
  'Jamaica',
  'Japan',
  'Jemen',
  'Jordanië',
  'Kazachstan',
  'Kenia',
  'Kosovo',
  'Kroatië',
  'Laos',
  'Letland',
  'Libanon',
  'Liberia',
  'Libië',
  'Litouwen',
  'Luxemburg',
  'Madagascar',
  'Maleisië',
  'Maldiven',
  'Mali',
  'Malta',
  'Mexico',
  'Moldavië',
  'Monaco',
  'Mongolië',
  'Montenegro',
  'Mozambique',
  'Myanmar',
  'Namibië',
  'Nepal',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Noorwegen',
  'Oekraïne',
  'Oezbekistan',
  'Oman',
  'Oostenrijk',
  'Pakistan',
  'Panama',
  'Paraguay',
  'Peru',
  'Polen',
  'Portugal',
  'Qatar',
  'Roemenië',
  'Rusland',
  'Rwanda',
  'Saudi-Arabië',
  'Senegal',
  'Servië',
  'Singapore',
  'Slovenië',
  'Soedan',
  'Somalië',
  'Spanje',
  'Sri Lanka',
  'Suriname',
  'Syrië',
  'Tanzania',
  'Thailand',
  'Tsjechië',
  'Tunesië',
  'Turkije',
  'Uganda',
  'Uruguay',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe',
  'Zweden',
  'Zwitserland',
  'aikido',
  'american football',
  'angling',
  'atletiek',
  'beachvolleybal',
  'biatlon',
  'BMX',
  'bobslee',
  'boogschieten',
  'breakdansen',
  'dammen',
  'discuswerpen',
  'driedaagse',
  'dressuur',
  'duiken',
  'estafette',
  'freerunning',
  'frisbee',
  'gewichtheffen',
  'gokken',
  'hammerwerpen',
  'handboogschieten',
  'hindernisloop',
  'hoogspringen',
  'hordelopen',
  'ijshockey',
  'inline skaten',
  'jetski rijden',
  'kanoën',
  'karting',
  'kajakken',
  'knikkeren',
  'kogelstoten',
  'lacrosse',
  'langebaanschaatsen',
  'longboarden',
  'marathon',
  'moderne vijfkamp',
  'motorcross',
  'netbal',
  'orientatielopen',
  'paintball',
  'parachutespringen',
  'parkour',
  'polsstokhoogspringen',
  'racketball',
  'rafting',
  'ringsteken',
  'rodeo',
  'rolschaatsen',
  'roeien',
  'rugby sevens',
  'schermen',
  'scrabble',
  'sjoelen',
  'skeleton',
  'skijumping',
  'slalom',
  'slingeren',
  'speerwerpen',
  'squash',
  'steeplechase',
  'stoeien',
  'synchroonzwemmen',
  'taekwondo',
  'triatlon',
  'trefbal',
  'turnen',
  'veldrijden',
  'verspringen',
  'vliegvissen',
  'waterskiën',
  'worstelen',
  'zeilen',
  'abacus',
  'accordeon',
  'actiefiguur',
  'ader',
  'afstandsmeter',
  'albumhoes',
  'amphorae',
  'anker',
  'antiek',
  'aqualung',
  'aquaduct',
  'armbandhorloge',
  'asbak',
  'astrolabium',
  'atoomklok',
  'auteursrecht',
  'avondjurk',
  'azimuth',
  'bajonet',
  'balustrade',
  'banjo',
  'barometer',
  'beeldhouwwerk',
  'belfort',
  'biljartbal',
  'blazoen',
  'bodycam',
  'boekenlegger',
  'boog',
  'boomerang',
  'briefopener',
  'bronzen beeld',
  'bunker',
  'caduceus',
  'catapult',
  'celesta',
  'cello',
  'chronometer',
  'clarinet',
  'contrabas',
  'cornet',
  'cryptex',
  'dakpan',
  'dartpijl',
  'defibrillator',
  'didgeridoo',
  'draaikolk',
  'drietand',
  'dubbelfluit',
  'dwarsfluit',
  'dynamo',
  'eeuwigdurende kalender',
  'elpee',
  'epitaaf',
  'euforion',
  'fagot',
  'fakkel',
  'fallenscherm',
  'fanfare',
  'fenolplast',
  'foedraal',
  'fretboard',
  'ganzenbord',
  'gasmasker',
  'geigerteller',
  'gereedschapskist',
  'gietijzer',
  'glaasje',
  'glazen bol',
  'gletsjerkloof',
  'goudstaaf',
  'gps-tracker',
  'gramofoon',
  'grenadier',
  'guillotine',
  'handboei',
  'handgranaat',
  'harpoen',
  'heksenketel',
  'heliograaf',
  'heraldiek',
  'hooivork',
  'hourglass',
  'houweel',
  'ijzeren masker',
  'jakobsstaf',
  'kaleidoscoop',
  'kampioensbeker',
  'kanonskogel',
  'katapult',
  'kathedraal',
  'kettingzaag',
  'klokkentoren',
  'kluwen',
  'knipmessen',
  'kookwekker',
  'koord',
  'kristallen bol',
  'kruisboog',
  'kubus',
  'kwikthermometer',
  'laserpointer',
  'lasso',
  'leidraad',
  'leiklei',
  'lier',
  'liftkooi',
  'loep',
  'luidspreker',
  'maaidorser',
  'manchetknoop',
  'manometer',
  'meubel',
  'moersleutel',
  'morse',
  'muziekdoos',
  'naaldhak',
  'naaimand',
  'naschrift',
  'neonlamp',
  'notenbalk',
  'obsidiaan',
  'olieverfschilderij',
  'omegaklok',
  'onderzeeboot',
  'orgelpijp',
  'oscilloscoop',
  'overlevingspack',
  'papiermolen',
  'periscopie',
  'phonograaf',
  'pijlkoker',
  'pijporgel',
  'pikhouweel',
  'pinball',
  'pistoolholster',
  'poederdoos',
  'polygraph',
  'potloodhouder',
  'projectielantaarn',
  'projector',
  'propeller',
  'psalter',
  'puzzelbox',
  'radarscherm',
  'ratel',
  'regenjas',
  'rijsttafelonderdeel',
  'rolluik',
  'rotszuil',
  'rubberen eend',
  'rugbymaillot',
  'sabelzaag',
  'sarcofaag',
  'sarod',
  'scalpel',
  'scheermessen',
  'schildwacht',
  'scheepsschroef',
  'schijf van vijf',
  'schroefsleutel',
  'sigaardoos',
  'silo',
  'sitar',
  'slinger',
  'sluisbrug',
  'smeedijzer',
  'spiegel',
  'spionagesatelliet',
  'springveer',
  'gele kaart',
  'rode kaart',
  'stethoscoop',
  'stoommachine',
  'stroomgenerator',
  'suikerspin',
  'sundial',
  'syrinx',
  'tarotkaart',
  'telraam',
  'theemuts',
  'toorts',
  'transistor',
  'trechtervormige megafoon',
  'trombone',
  'trompet',
  'tuba',
  'tuimelaar',
  'turbine',
  'ukelele',
  'veiligheidsspeld',
  'vergrootglas',
  'vigilante',
  'vloeistof',
  'vloerkleed',
  'vuurpijl',
  'waaier',
  'wapenschild',
  'waterklok',
  'waterpas',
  'waterpistool',
  'windvaan',
  'wrijfsteen',
  'xylofoon',
  'zaklamp',
  'zandloper',
  'zeis',
  'zenderstation',
  'zetel',
  'zinken emmer',
  'zonnedial',
  'zweep',

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
  const [names, setNames] = useState(Array(3).fill(""));
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_TIME);

  const updateCount = (n) => {
    setCount(n);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
  };

  const updateName = (i, v) => {
    setNames((prev) => {
      const next = [...prev];
      next[i] = v;
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
          <div className="player-count-row">
            {[2,3,4,5,6,7,8,9,10].map((n) => (
              <button
                key={n}
                className={`count-btn ${count === n ? "active" : ""}`}
                onClick={() => updateCount(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="setup-section">
          <label className="setup-label">Namen van spelers</label>
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

function RoundScreen({ player, words, onRoundEnd, roundTime }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0 });
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [flash, setFlash] = useState(null); // "correct" | "skip"
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
        setDone(true);
        setTimeout(() => onRoundEnd({ ...scoresRef.current, wordsUsed: wordIndexRef.current }), 1000);
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 400);
  };

  const wordIndexRef = useRef(0);

  const correct = () => {
    if (done) return;
    triggerFlash("correct");
    const newScores = { ...scoresRef.current, correct: scoresRef.current.correct + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
  };

  const skip = () => {
    if (done) return;
    triggerFlash("skip");
    const newScores = { ...scoresRef.current, skipped: scoresRef.current.skipped + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
  };

  const pct = timeRemaining / roundTime;
  const timerColor = timeLeft > 30 ? "#4ade80" : timeLeft > 10 ? "#fbbf24" : "#f87171";
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
              strokeDashoffset={circumference * (1 - pct)}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke 0.5s" }}
            />
            <text x="50" y="56" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="inherit">
              {timeLeft}
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
          <div className="word-done-msg">Tijd is om! ⏰</div>
        ) : (
          <>
            <div className="word-counter">woord {wordIndex + 1}</div>
            <div className="current-word">{words[wordIndex]}</div>
            <div className="word-hint">Beeld of leg uit — maar zeg het woord niet!</div>
          </>
        )}
      </div>

      {!done && (
        <div className="action-row">
          <button className="action-btn skip-btn" onClick={skip}>
            <span className="btn-icon">↷</span>
            <span className="btn-label">Sla over</span>
          </button>
          <button className="action-btn correct-btn" onClick={correct}>
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
          padding: 12px 0;
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
          gap: 16px;
          padding: 20px;
        }

        .word-counter { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); }

        .current-word {
          font-family: 'Righteous', cursive;
          font-size: clamp(32px, 9vw, 68px);
          background: linear-gradient(135deg, #f9fafb, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.15;
          animation: wordIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          word-break: break-word;
          max-width: 100%;
          padding: 0 8px;
        }
        @keyframes wordIn { from{transform:scale(0.7) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }

        .word-hint { font-size: 13px; color: rgba(255,255,255,0.35); }
        .word-done-msg { font-family: 'Righteous', cursive; font-size: 48px; color: #f87171; animation: pulse 0.6s infinite alternate; }
        @keyframes pulse { from{transform:scale(1)} to{transform:scale(1.06)} }

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
        .action-btn:active { transform: scale(0.93); }
        .btn-icon { font-size: 28px; }
        .btn-label { font-size: clamp(13px, 3.5vw, 16px); white-space: nowrap; }

        .skip-btn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 2px solid rgba(251,191,36,0.3); }
        .skip-btn:hover { background: rgba(251,191,36,0.25); }

        .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 2px solid rgba(74,222,128,0.35); }
        .correct-btn:hover { background: rgba(74,222,128,0.35); }

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
