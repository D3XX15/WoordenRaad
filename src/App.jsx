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
];

const ROUND_TIME = 10;

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
  const [count, setCount] = useState(4);
  const [names, setNames] = useState(Array(4).fill(""));

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

        <button
          className={`start-btn ${canStart ? "ready" : ""}`}
          onClick={() => canStart && onStart(names.map((n) => n.trim()))}
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

function RoundScreen({ player, words, onRoundEnd }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0 });
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [flash, setFlash] = useState(null); // "correct" | "skip"
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const startTimeRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME); // exact float for smooth circle

  useEffect(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, ROUND_TIME - elapsed);
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

  const pct = timeRemaining / ROUND_TIME;
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
            <div className="word-hint">Beelden uit of leg uit — maar zeg het woord niet!</div>
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

  const totalRounds = players.length; // each player plays once = 1 full round

  const startGame = (names) => {
    const empty = Array(names.length).fill(0);
    setPlayers(names);
    setScores(empty);
    setDisplayScores(empty);
    setCurrentPlayerIdx(0);
    setRoundNum(0);
    setUsedWords(new Set());
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

        body {
          font-family: 'Nunito', sans-serif;
          background: #0f0a1e;
          min-height: 100vh;
          color: white;
        }

        .screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
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
          border-radius: 28px;
          padding: 40px 36px;
          width: 100%;
          max-width: 480px;
          backdrop-filter: blur(20px);
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

        .names-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
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
          padding: 60px 40px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 32px;
          max-width: 400px;
          width: 100%;
          backdrop-filter: blur(20px);
        }
        .handoff-icon { font-size: 64px; margin-bottom: 20px; animation: bounce 1.5s infinite; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .handoff-sub { font-size: 14px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; margin-bottom: 12px; }
        .handoff-name { font-family: 'Righteous', cursive; font-size: 42px; color: #a78bfa; margin-bottom: 20px; }
        .handoff-tip { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 36px; }
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
          padding: 16px 4px;
          gap: 16px;
        }

        .round-player { font-family: 'Righteous', cursive; font-size: 22px; color: #a78bfa; flex: 1; }

        .timer-wrap { flex-shrink: 0; }

        .round-stats { display: flex; gap: 12px; flex: 1; justify-content: flex-end; }
        .stat { font-size: 16px; font-weight: 800; padding: 6px 12px; border-radius: 20px; }
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
          font-size: clamp(40px, 10vw, 72px);
          background: linear-gradient(135deg, #f9fafb, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          animation: wordIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes wordIn { from{transform:scale(0.7) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }

        .word-hint { font-size: 13px; color: rgba(255,255,255,0.35); }
        .word-done-msg { font-family: 'Righteous', cursive; font-size: 48px; color: #f87171; animation: pulse 0.6s infinite alternate; }
        @keyframes pulse { from{transform:scale(1)} to{transform:scale(1.06)} }

        .action-row {
          display: flex;
          gap: 16px;
          width: 100%;
          max-width: 520px;
          padding: 0 4px 32px;
        }

        .action-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 24px 16px;
          border-radius: 24px;
          border: none;
          cursor: pointer;
          font-family: 'Righteous', cursive;
          transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
          -webkit-tap-highlight-color: transparent;
        }
        .action-btn:active { transform: scale(0.93); }
        .btn-icon { font-size: 32px; }
        .btn-label { font-size: 16px; }

        .skip-btn { background: rgba(251,191,36,0.15); color: #fbbf24; border: 2px solid rgba(251,191,36,0.3); }
        .skip-btn:hover { background: rgba(251,191,36,0.25); }

        .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 2px solid rgba(74,222,128,0.35); }
        .correct-btn:hover { background: rgba(74,222,128,0.35); }

        /* ── Scores ── */
        .score-card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 28px;
          padding: 40px 32px;
          width: 100%;
          max-width: 440px;
          backdrop-filter: blur(20px);
        }
        .score-title { font-family: 'Righteous', cursive; font-size: 28px; text-align: center; margin-bottom: 28px; }
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

        .rank-badge { font-size: 20px; min-width: 28px; text-align: center; }
        .score-name { flex: 1; font-size: 18px; font-weight: 700; }
        .score-pts { font-family: 'Righteous', cursive; font-size: 20px; color: #a78bfa; }

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

        @media (max-width: 400px) {
          .setup-card { padding: 28px 20px; }
          .names-grid { grid-template-columns: 1fr; }
          .round-player { font-size: 16px; }
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
