import { useState, useEffect, useRef, useCallback } from "react";

// ── Hulpfuncties ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Gedeelde UI-componenten ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

/**
 * useLetterSpinAnimation — herbruikbare spin-animatie voor letter-kiezen.
 * @param {string[]} pool       - Array van letters om uit te kiezen
 * @param {string|null} exclude - Letter om uit te sluiten (bijv. huidige letter)
 * @param {(l: string) => void} onLetter - Callback bij elke tussentijdse letter
 * @param {(l: string) => void} onDone   - Callback als de uiteindelijke letter vaststaat
 * @returns {{ spin, spinning }}
 */
function useLetterSpinAnimation({ pool, exclude = null, onLetter, onDone }) {
  const [spinning, setSpinning] = useState(false);
  const spinIntervalRef = useRef(null);
  const spinCountRef = useRef(0);
  const onLetterRef = useRef(onLetter);
  const onDoneRef = useRef(onDone);

  // Houd refs altijd actueel zodat de interval nooit verouderde callbacks aanroept
  useEffect(() => { onLetterRef.current = onLetter; }, [onLetter]);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  useEffect(() => () => clearInterval(spinIntervalRef.current), []);

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    spinCountRef.current = 0;
    const totalTicks = 18 + Math.floor(Math.random() * 12);
    const available = exclude ? pool.filter(l => l !== exclude) : pool;
    const target = available[Math.floor(Math.random() * available.length)];

    // Vaste interval van 60ms, identiek aan v23 — geen herstart halverwege
    const tick = () => {
      spinCountRef.current++;
      if (spinCountRef.current < totalTicks) {
        onLetterRef.current(pool[Math.floor(Math.random() * pool.length)]);
      } else {
        clearInterval(spinIntervalRef.current);
        onLetterRef.current(target);
        setSpinning(false);
        onDoneRef.current(target);
      }
    };
    spinIntervalRef.current = setInterval(tick, 60);
  }, [spinning, pool, exclude]);

  return { spin, spinning };
}

/** Header-balk bovenaan een game-scherm (logo links, stop-knop rechts). */
function GameHeaderBar({ logo, onStop }) {
  return (
    <div className="ls-header">
      <div className="ls-logo">{logo}</div>
      <button className="ls-restart-btn" onClick={onStop}>↩ Stop</button>
    </div>
  );
}

/** Kaartgebied voor LetterSnel (kaart-label + kaart-tekst). */
function LetterSnelCardDisplay({ cardIdx, card }) {
  return (
    <div className="ls-card-area">
      <div className="ls-card-label">KAART #{cardIdx + 1}</div>
      <div className="ls-card">
        <div className="ls-card-inner">
          <span className="ls-card-text">{card}</span>
        </div>
      </div>
    </div>
  );
}

/** Grote letter-display voor LetterSnel. */
function LetterSnelActiveLetter({ letter, spinning, trophy = false, onClick = null, clickable = false }) {
  const clickProps = onClick ? { onClick, style: { cursor: clickable ? "pointer" : "default" } } : {};
  if (trophy) {
    return <div className="ls-letter ls-letter-trophy" {...clickProps}>🏆</div>;
  }
  if (letter) {
    return <div className={`ls-letter ${spinning ? "ls-letter-spinning" : "ls-letter-landed"}`} {...clickProps}>{letter}</div>;
  }
  return <div className="ls-letter-placeholder" {...clickProps}>?</div>;
}

/**
 * Horizontale tijdsbalk.
 * @param {number} pct      - Voortgang 0–1 (1 = volledig gevuld)
 * @param {string} color    - CSS-kleur van de balk
 * @param {boolean} empty   - Als true: balk is leeg (bijv. als tijd op is)
 * @param {string} [transition] - CSS transition-waarde (optioneel)
 */
function TimerProgressBar({ pct, color, empty = false, transition = "width 0.05s linear, background 0.5s" }) {
  return (
    <div style={{height:"8px", background:"rgba(255,255,255,0.1)", borderRadius:"4px", marginBottom:"8px", overflow:"hidden"}}>
      <div style={{height:"100%", width:`${empty ? 0 : pct * 100}%`, background:color, borderRadius:"4px", transition}} />
    </div>
  );
}

/**
 * Gedeelde resultatenweergave voor solo tie-breakers (Taboe en WoordRaad Klassiek).
 * Toont ranking op tijd, gelijkspel-banner of winnaar-banner, en een "Nieuw spel"-knop.
 */
function TiebreakerSoloResultScreen({ players, tiedPlayerIndices, times, onRestart, onStartTiebreaker }) {
  const tieBadges = ["🥇","🥈","🥉"];
  const results = tiedPlayerIndices.map((pi, i) => ({ name: players[pi], time: times[i] })).sort((a, b) => a.time - b.time);
  const winnerTime = Math.round(results[0].time * 100) / 100;
  const hasJointWinner = results.filter(r => Math.round(r.time * 100) / 100 === winnerTime).length > 1;
  return (
    <div className="screen"><div className="score-card">
      <h2 className="score-title">⚡ Tie-breaker resultaten</h2>
      {hasJointWinner
        ? <button className="tiebreaker-start-btn" onClick={() => {
            const si = results.filter(r => Math.round(r.time*100)/100 === winnerTime).map(r => tiedPlayerIndices.find(pi => players[pi] === r.name)).filter(pi => pi !== undefined);
            onStartTiebreaker(si);
          }}>🤝 Nog steeds gelijkspel! Start opnieuw.</button>
        : <div className="tiebreaker-result-banner tiebreaker-result-winner"><span className="tiebreaker-result-text-winner">🏆 {results[0].name} wint de tie-breaker!</span></div>
      }
      <div className="scores-list">
        {results.map((r) => {
          const effectiveRank = results.filter(r2 => Math.round(r2.time*100)/100 < Math.round(r.time*100)/100).length + 1;
          const isTied = Math.round(r.time*100)/100 === winnerTime && hasJointWinner;
          const rowClass = isTied ? "score-row rank-1 rank-tied" : `score-row rank-${effectiveRank} rank-final`;
          return (
            <div key={r.name} className={rowClass}>
              <span className="rank-badge">{isTied ? "👑" : (tieBadges[effectiveRank-1] ?? effectiveRank)}</span>
              <span className="score-name">{r.name}</span>
              <span className="score-pts tiebreaker-pts">{r.time == null ? "—" : `${r.time.toFixed(2)}s`}</span>
            </div>
          );
        })}
      </div>
      <div className="final-btns"><button className="score-btn restart-btn" onClick={onRestart}>Nieuw spel</button></div>
    </div></div>
  );
}

/** Formatteer verstreken tijd als "seconden.tienden" (bijv. "4.2s"). */
function formatElapsedTime(elapsed) {
  const secs = Math.floor(elapsed);
  const tenths = Math.floor((elapsed % 1) * 10);
  return `${secs}.${tenths}s`;
}

/**
 * Gedeeld handoff-scherm voor tie-breakers (Taboe en WoordRaad Klassiek).
 */
function TiebreakerHandoffScreen({ subtitle, player, tip1, tip2, tip3, onStart }) {
  return (
    <div className="screen handoff-screen"><div className="handoff-card">
      <div className="handoff-icon">⚡</div>
      <p className="handoff-sub tiebreaker-handoff-sub">{subtitle}</p>
      <h2 className="handoff-name">{player}</h2>
      <p className="handoff-tip mb-2">{tip1}</p>
      <p className="handoff-tip mt-0">{tip2}</p>
      {tip3 && <p className="handoff-tip" style={{marginTop:"12px"}}>{tip3}</p>}
      <button className="handoff-btn" onClick={onStart}>Start tie-breaker!</button>
    </div></div>
  );
}

/** Tijdweergave: toont seconden of een rinkelende wekker als de tijd op is. */
function TimerCountdown({ secs, timesUp }) {
  return timesUp ? <span className="alarm-ringing">⏰</span> : <>{secs}s</>;
}

/**
 * Hergebruikt in GameSetupScreen (WoordRaad) en LetterSnelSetupPanel.
 */
function PlayerNameField({ index, value, onChange, onRemove, canRemove, placeholder = "Naam invullen..." }) {
  return (
    <div className="player-input-group small-group">
      <div className="player-name-container player-bg">
        <span className="player-index-badge">{index + 1}</span>
        <input
          className="integrated-name-input"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          maxLength={8}
        />
      </div>
      {canRemove && (
        <button className="integrated-delete-btn btn-subtle" onClick={onRemove}>−</button>
      )}
    </div>
  );
}

/** Geeft de CSS-klasse terug voor een flash-type (correct / skip / bonus). */
function getFlashClass(flash) {
  if (flash === "correct") return " taboe-flash-correct";
  if (flash === "skip")    return " taboe-flash-skip";
  if (flash === "bonus")   return " taboe-flash-bonus";
  return "";
}

// ── LetterSnel Cards ────────────────────────────────────────────────────────
const LETTER_SNEL_CARD_PROMPTS = [
  "een kleur", "een land, regio of stad", "een jongensnaam", "een meisjesnaam", "keukengerei", "iets in de tuin", "een beroep", "een natuurverschijnsel",
  "een sport", "iets in de supermarkt", "een voertuig", "iets in de badkamer", "een film of serie", "een merk", "iets wat koud is", "een knaagdier",
  "iets wat warm is", "iets wat lang is", "iets in de natuur", "iets op een verjaardag", "iets in een museum", "iets wat stinkt", "iets in een laboratorium",
  "iets wat je kan eten", "een superkracht", "een bloem of boom", "iets in de slaapkamer", "iets op het strand", "iets op een boerderij", "iets op een filmset",
  "iets in een ziekenhuis", "een insect", "een vogel", "iets wat je kan gooien", "iets wat glinstert", "iets wat zwaar is", "iets wat licht is", "een dier",
  "iets wat lekker ruikt", "speelgoed", "iets van hout", "iets van metaal", "iets van plastic", "iets van glas", "een reden om te laat te komen", "iets in een haven",
  "iets wat je kan verzamelen", "iets in een handtas", "iets in je broekzak", "iets op kantoor", "iets wat je kan lezen", "iets wat je kan kweken", "iets op een camping",
  "iets in een winkelcentrum", "iets van vroeger", "iets op het internet", "iets in een speeltuin", "een kledingstuk", "iets in de ruimte", "iets in een waterpark",
  "iets in een pretpark", "iets in een bioscoop", "een acteur of actrice", "een tekenfilmfiguur", "iets in een kasteel", "iets rond Kerst",  "iets in een school",
  "iets rond Sinterklaas", "iets rond Halloween", "iets rond carnaval", "een held of een schurk", "iets in een circus", "iets in de zee", "een geluid",
  "iets wat duur is", "iets wat gratis is", "iets wat je kan winnen", "iets wat je kan verliezen", "een deel van een auto", "een voetbalclub", "iets in een casino",
  "iets in een apotheek", "iets bij de (tand)arts", "iets wat je dagelijks doet", "iets wat snel gaat", "iets wat gigantisch is", "een hondenras", "iets op een vliegveld",
  "een gewoonte", "iets wat spannend is", "iets wat saai is", "iets wat je zegt als je je teen stoot", "een politicus", "iets wat plakt", "iets wat je kan rollen",
  "iets uit de Middeleeuwen", "iets uit de oudheid", "iets uit WO II", "iets Japans", "iets Frans", "iets Italiaans", "iets Amerikaans", "iets Nederlands", "iets in een slagerij",
  "een dessert", "een hoofdgerecht", "een ontbijtproduct", "iets wat je kan bakken", "voedsel zonder suiker", "iets wat je kan versieren", "iets op een bouwplaats",
  "een snack of snoepje", "iets op een pizza", "iets in een salade", "een fruit", "een spel", "iets wat je weggooit",  "iets op een begrafenis",
  "iets op een festival", "iets op een braderie", "iets waarbij je concentratie nodig hebt", "een groente", "een stripfiguur", "iets op een bruiloft",
  "iets wat giftig is", "iets wat rond is", "een meubelstuk", "iets zachts", "een automerk", "iets in een gevangenis",
  "iets wat onzichtbaar is", "een plant", "een muziekinstrument", "iets wat je kan opvouwen", "iets waar je boos van wordt", "iets in een bakkerij",
  "iets wat je meeneemt op reis", "een melkproduct", "iets wat je op brood doet", "iets roods", "iets wat je mee naar school neemt", "iets wat langzaam gaat",
  "iets wat vierkant is", "iets wat kan breken", "iets wat kan groeien", "iets scherps", "iets wat je kan drinken", "iets wat licht geeft", "iets in een piramide",
  "iets wat je op school leert", "een slechte eigenschap", "een goede eigenschap", "een huishoudelijk apparaat", "iets wat je in de winter nodig hebt", "iets in een sportschool",
  "een deel van het menselijk lichaam", "iets wat je zelf kan maken", "iets wat je ziet in een droom", "iets wat je in de garage vindt", "een sprookjesfiguur",
  "iets wat vleugels heeft", "iets geels", "iets blauws", "iets wat lawaai maakt in de nacht", "iets wat je met een afstandsbediening bestuurt", "iets in een kerk of moskee",
  "iets wat je in de zomer nodig hebt", "iets wat elektriciteit gebruikt", "iets zoets", "iets zouts", "iets groens", "gereedschap", "iets in de jungle"
];

// ── LetterSnel Component ─────────────────────────────────────────────────────

const FULL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function LetterSnelGameRouter({ players, onRestart, activeLetters, gameMode, targetScore }) {
  if (gameMode === "ketting") return <LetterSnelChainGame players={players} onRestart={onRestart} activeLetters={activeLetters} targetScore={targetScore} />;
  return <LetterSnelClassicGame players={players} onRestart={onRestart} activeLetters={activeLetters} targetScore={targetScore} />;
}

// ── LetterSnel Klassiek ───────────────────────────────────────────────────────
function LetterSnelClassicGame({ players, onRestart, activeLetters, targetScore }) {
  const alphabet = activeLetters && activeLetters.length > 0 ? activeLetters : FULL_ALPHABET;
  const [scores, setScores] = useState(Array(players.length).fill(0));
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [cardDeck] = useState(() => shuffle([...LETTER_SNEL_CARD_PROMPTS]));
  const [letter, setLetter] = useState(null);
  const [winner, setWinner] = useState(null);
  const [phase, setPhase] = useState("ready");
  const [gameWinner, setGameWinner] = useState(null);

  const currentCard = cardDeck[currentCardIdx % cardDeck.length];

  const { spin: doSpin, spinning } = useLetterSpinAnimation({
    pool: alphabet,
    exclude: letter,
    onLetter: setLetter,
    onDone: () => {},
  });

  const spinLetter = () => {
    if (spinning || phase === "awarded") return;
    setPhase("playing");
    setWinner(null);
    doSpin();
  };

  const awardPoint = (playerIdx) => {
    if (phase !== "playing" || spinning) return;
    const newScores = [...scores];
    newScores[playerIdx]++;
    setScores(newScores);
    setWinner(playerIdx);
    if (newScores[playerIdx] >= targetScore) {
      setGameWinner(playerIdx);
      return;
    }
    setPhase("awarded");
  };

  const nextCard = () => {
    setCurrentCardIdx(i => i + 1);
    // Letter bewust NIET gereset: de huidige letter blijft als `exclude` actief
    // zodat de volgende spin nooit dezelfde letter kan opleveren.
    // De letter-display wordt verborgen via phase === "ready".
    setWinner(null);
    setPhase("ready");
  };

  useEffect(() => {
    if (phase !== "awarded") return;
    const t = setTimeout(nextCard, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const topScore = Math.max(...scores);

  if (gameWinner !== null) {
    return <LetterSnelWinnerScreen players={players} scores={scores} winnaarIdx={gameWinner} onRestart={onRestart} />;
  }

  return (
    <div className="ls-screen">
      <GameHeaderBar logo="LetterSnel" onStop={onRestart} />
      <LetterSnelCardDisplay cardIdx={currentCardIdx} card={currentCard} />
      <div className="ls-letter-area">
        <LetterSnelActiveLetter
          letter={phase === "ready" ? null : letter}
          spinning={spinning}
          trophy={phase === "awarded"}
          onClick={spinning || phase === "awarded" ? null : spinLetter}
          clickable={!spinning && phase !== "awarded"}
        />
      </div>
      {(phase === "ready" || phase === "playing" || phase === "awarded") && (
        <div className="ls-award-section">
          <div className="ls-award-label">{phase === "ready" ? "Tik op het vak om een letter te kiezen" : phase === "awarded" ? `${players[winner]} haalt een punt!` : spinning ? "Letter kiezen…" : "Wie was er het eerst?"}</div>
          <div className="ls-scores-strip" style={{gridTemplateColumns:`repeat(${Math.min(3, players.length % 2 === 0 ? 2 : players.length % 3 === 0 ? 3 : 2)}, 1fr)`}}>
            {players.map((p, i) => (
              <button key={i} className={`ls-score-chip ls-score-chip-btn ${scores[i] === topScore && topScore > 0 ? "ls-score-leader" : ""}`} onClick={() => phase === "playing" && !spinning && awardPoint(i)} disabled={phase === "ready" || spinning || phase === "awarded"}>
                <span className="ls-score-chip-name">{p}</span>
                <span className="ls-score-chip-val">{scores[i]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



// ── LetterSnel Winnaar Scherm ─────────────────────────────────────────────────
function LetterSnelWinnerScreen({ players, scores, winnaarIdx, onRestart }) {
  const sorted = [...scores.map((s, i) => ({ s, i }))].sort((a, b) => b.s - a.s);
  const medals = ["🥇","🥈","🥉"];
  const getEffectiveRank = (score) => sorted.filter(e => e.s > score).length + 1;
  const medal = (score) => {
    const rank = getEffectiveRank(score);
    return medals[rank - 1] ?? `${rank}.`;
  };
  return (
    <div className="ls-screen" style={{justifyContent:"center"}}>
      <div style={{textAlign:"center", padding:"32px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:"24px"}}>
        <div style={{fontSize:"64px"}}>🏆</div>
        <div style={{fontFamily:"'Righteous', cursive", fontSize:"13px", letterSpacing:"0.15em", color:"rgba(255,255,255,0.45)", textTransform:"uppercase"}}>Winnaar</div>
        <div style={{fontFamily:"'Righteous', cursive", fontSize:"36px", color:"#facc15", textShadow:"0 0 24px rgba(250,204,21,0.5)"}}>{players[winnaarIdx]}</div>
        <div style={{width:"100%", display:"flex", flexDirection:"column", gap:"10px", marginTop:"8px"}}>
          {sorted.map(({ s, i }) => {
            const rank = getEffectiveRank(s);
            const rankColors = { 1: { bg: "rgba(251,191,36,0.08)", border: "#fbbf24", pts: "#fbbf24" }, 2: { bg: "rgba(192,192,192,0.1)", border: "#c0c0c0", pts: "#c0c0c0" }, 3: { bg: "rgba(205,127,50,0.08)", border: "#cd7f32", pts: "#cd7f32" } };
            const col = rankColors[rank] ?? { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.07)", pts: "rgba(255,255,255,0.9)" };
            return (
              <div key={i} style={{display:"flex", alignItems:"center", gap:"12px", background: col.bg, border: `3px solid ${col.border}`, borderRadius:"16px", padding:"14px 16px"}}>
                <span style={{fontFamily:"'Righteous', cursive", fontSize:"16px", color: col.pts, width:"24px"}}>{medal(s)}</span>
                <span style={{flex:1, fontFamily:"'Righteous', cursive", fontSize:"18px", color:"white"}}>{players[i]}</span>
                <span style={{fontFamily:"'Righteous', cursive", fontSize:"22px", color: col.pts}}>{s} pt</span>
              </div>
            );
          })}
        </div>
        <button className="start-btn ready-solid" style={{marginTop:"8px", width:"100%"}} onClick={onRestart}>Nieuw spel ↩</button>
      </div>
    </div>
  );
}

// ── Geluidseffecten ───────────────────────────────────────────────────────────
function playSound(type) {
  const cfg = type === "correct"
    ? { oscType: "sine",     freqEnd: 1318, rampTime: 0.06, gain: 0.45, duration: 0.55 }
    : { oscType: "triangle", freqEnd: 784,  rampTime: 0.08, gain: 0.35, duration: 0.25 };
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = cfg.oscType;
    osc.frequency.setValueAtTime(1046, now);
    osc.frequency.exponentialRampToValueAtTime(cfg.freqEnd, now + cfg.rampTime);
    gain.gain.setValueAtTime(cfg.gain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + cfg.duration);
    osc.start(now);
    osc.stop(now + cfg.duration);
  } catch (e) {}
}
const playCorrectSound = () => playSound("correct");
const playSkipSound    = () => playSound("skip");

function playTimeUpSound() {
  if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const note = (startTime, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    const now = ctx.currentTime;
    note(now,        523, 0.18); // C5
    note(now + 0.20, 349, 0.30); // F4
  } catch (e) {}
}
const CHAIN_ROUND_SECONDS = 15;

function LetterSnelChainGame({ players, onRestart, activeLetters, targetScore }) {
  const alphabet = activeLetters && activeLetters.length > 0 ? activeLetters : FULL_ALPHABET;
  const [scores, setScores] = useState(Array(players.length).fill(0));
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [cardDeck] = useState(() => shuffle([...LETTER_SNEL_CARD_PROMPTS]));
  const [gameWinner, setGameWinner] = useState(null);

  // ketting state
  const [phase, setPhase] = useState("ready"); // ready | spinning | playing | roundover
  const [currentLetter, setCurrentLetter] = useState(null);
  const [lastValidWord, setLastValidWord] = useState(null);
  const lastValidWordRef = useRef(null);
  const [activePlayers, setActivePlayers] = useState(() => players.map((_, i) => i));
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [eliminated, setEliminated] = useState([]);
  const [roundWinner, setRoundWinner] = useState(null);

  // refs that mirror state so timer callback always has fresh values
  const activePlayersRef = useRef(players.map((_, i) => i));
  const currentTurnIdxRef = useRef(0);
  const scoresRef = useRef(Array(players.length).fill(0));
  const eliminatedRef = useRef([]);
  const phaseRef = useRef("ready");
  const roundStartRef = useRef(0); // which player index starts the next round

  // spinning animation via gedeelde hook
  const { spin: doSpinLetter, spinning } = useLetterSpinAnimation({
    pool: alphabet,
    exclude: currentLetter,
    onLetter: setCurrentLetter,
    onDone: (_target) => {
      phaseRef.current = "playing";
      setPhase("playing");
      startTimer();
    },
  });

  // timer
  const [timeRemaining, setTimeRemaining] = useState(CHAIN_ROUND_SECONDS);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentCard = cardDeck[currentCardIdx % cardDeck.length];
  const activePlayerIdx = activePlayers[currentTurnIdx % activePlayers.length];
  const timeLeft = Math.ceil(timeRemaining);

  // cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
  }, []);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const doFail = () => {
    const ap = activePlayersRef.current;
    const turnIdx = currentTurnIdxRef.current;
    const failedPlayer = ap[turnIdx % ap.length];
  
    const newActivePlayers = ap.filter(i => i !== failedPlayer);
    const newEliminated = [...eliminatedRef.current, failedPlayer];

    eliminatedRef.current = newEliminated;
    setEliminated(newEliminated);
    activePlayersRef.current = newActivePlayers;
    setActivePlayers(newActivePlayers);

    // Check of de ronde direct moet stoppen
    if (newActivePlayers.length === 1 && lastValidWordRef.current !== null) {
      // Iemand heeft al een woord geraden, dus de laatste overgebleven speler wint
      const winnerIdx = newActivePlayers[0];
      finishRound(winnerIdx);
    } else if (newActivePlayers.length === 0) {
      // Iedereen is afgevallen zonder een woord te raden
      finishRound(null);
    } else {
      // De ronde gaat door (ook als er nog maar 1 speler over is die nog moet raden!)
      const nextTurnIdx = turnIdx % newActivePlayers.length;
      currentTurnIdxRef.current = nextTurnIdx;
      setCurrentTurnIdx(nextTurnIdx);
      startTimer();
    }
  };

  const finishRound = (winnerIdx) => {
    if (winnerIdx !== null) {
      const newScores = [...scoresRef.current];
      newScores[winnerIdx]++;
      scoresRef.current = newScores;
      setScores(newScores);
      if (newScores[winnerIdx] >= targetScore) {
        setGameWinner(winnerIdx);
        phaseRef.current = "gameover";
        return;
      }
    }
    setRoundWinner(winnerIdx);
    phaseRef.current = "roundover";
    setPhase("roundover");
  };

  const startTimer = () => {
    stopTimer();
    setTimeRemaining(CHAIN_ROUND_SECONDS);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, CHAIN_ROUND_SECONDS - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        stopTimer();
        playTimeUpSound();
        doFail();
      }
    }, 50);
  };

  const spinLetter = () => {
    if (spinning) return;
    doSpinLetter();
  };

  const handleCorrect = () => {
    if (phaseRef.current !== "playing") return;
    stopTimer();
    playCorrectSound();

    const wordData = { playerIdx: activePlayerIdx, letter: currentLetter };
    setLastValidWord(wordData);
    lastValidWordRef.current = wordData;

    const ap = activePlayersRef.current;

    // Als er maar één actieve speler is, heeft die net als enige geraden → wint de ronde
    if (ap.length === 1) {
      finishRound(ap[0]);
      return;
    }

    const nextTurnIdx = (currentTurnIdxRef.current + 1) % ap.length;
    currentTurnIdxRef.current = nextTurnIdx;
    setCurrentTurnIdx(nextTurnIdx);
    startTimer();
  };

  const handleFail = () => {
    if (phaseRef.current !== "playing") return;
    stopTimer();
    doFail();
  };

  const nextRound = (winner) => {
    const nextStart = winner !== null && winner !== undefined
      ? winner
      : (roundStartRef.current + 1) % players.length;
    roundStartRef.current = nextStart;

    const freshActive = players.map((_, i) => (i + nextStart) % players.length);
    activePlayersRef.current = freshActive;
    currentTurnIdxRef.current = 0;
    eliminatedRef.current = [];
    phaseRef.current = "ready";
    setCurrentCardIdx(i => i + 1);
    // currentLetter bewust NIET gereset: blijft als `exclude` actief zodat
    // de volgende spin nooit dezelfde letter oplevert. Display verbergt via phase === "ready".
    lastValidWordRef.current = null;
    setLastValidWord(null);
    setActivePlayers(freshActive);
    setCurrentTurnIdx(0);
    setEliminated([]);
    setRoundWinner(null);
    setPhase("ready");
    stopTimer();
    setTimeRemaining(CHAIN_ROUND_SECONDS);
  };

  const topScore = Math.max(...scores, 0);
  const timerPct = timeRemaining / CHAIN_ROUND_SECONDS;
  const timesUp = timeRemaining <= 0;
  const timerColor = timerPct > 0.5 ? "#4ade80" : timerPct > 0.25 ? "#fbbf24" : "#f87171";

  useEffect(() => {
    if (phase !== "roundover") return;
    const t = setTimeout(() => nextRound(roundWinner), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  if (gameWinner !== null) {
    return <LetterSnelWinnerScreen players={players} scores={scores} winnaarIdx={gameWinner} onRestart={onRestart} />;
  }

  return (
    <div className="ls-screen">
      <GameHeaderBar logo="LetterSnel" onStop={onRestart} />

      {/* Card */}
      <LetterSnelCardDisplay cardIdx={currentCardIdx} card={currentCard} />

      {/* Letter + knop */}
      <div className="ls-letter-area">
        <LetterSnelActiveLetter
          letter={phase === "ready" ? null : currentLetter}
          spinning={spinning}
          trophy={phase === "roundover" && roundWinner !== null}
          onClick={
            phase === "ready" ? () => { setPhase("spinning"); spinLetter(); } :
            phase === "playing" ? handleCorrect :
            null
          }
          clickable={phase !== "spinning" && phase !== "roundover"}
        />
      </div>

      {/* Label + score chips */}
      <div className="ls-award-section">
        <div className="ls-award-label">
          {phase === "ready" && (<><span className="ls-ketting-turn-name">{players[activePlayers[0]]}</span> begint — tik op het vak</>)}
          {phase === "spinning" && "Letter kiezen…"}
          {phase === "playing" && (<><span className="ls-ketting-turn-name">{players[activePlayerIdx]}</span> is aan de beurt</>)}
          {phase === "roundover" && (roundWinner !== null ? <>🏆 <span className="ls-ketting-turn-name">{players[roundWinner]}</span> wint de ketting!</> : "Niemand wist iets te bedenken 🤷")}
        </div>

        <div className="ls-scores-strip" style={{gridTemplateColumns:`repeat(${Math.min(3, players.length % 2 === 0 ? 2 : players.length % 3 === 0 ? 3 : 2)}, 1fr)`}}>
          {players.map((p, i) => {
            const isElim = eliminated.includes(i);
            const isActive = (phase === "playing" && activePlayers[currentTurnIdx % activePlayers.length] === i)
                          || ((phase === "ready" || phase === "spinning") && activePlayers[0] === i);
            const isWinner = phase === "roundover" && roundWinner === i;
            const isClickable = phase === "playing" && !isElim;
            const Tag = isClickable ? "button" : "div";
            return (
              <Tag key={i} role="status" aria-label={`${p}: ${scores[i]} punten`} className={`ls-score-chip ls-ketting-chip ${isActive ? "ls-ketting-chip-active" : ""} ${isElim ? "ls-ketting-chip-elim" : ""} ${isWinner ? "ls-ketting-chip-winner" : ""} ${isClickable ? "ls-score-chip-btn" : ""}`} style={{cursor: isClickable ? "pointer" : "default"}} onClick={isClickable ? handleCorrect : undefined}>
                <span className="ls-score-chip-name">{p}</span>
                <span className="ls-score-chip-val">{scores[i]}</span>
              </Tag>
            );
          })}
        </div>

        {/* Timer balk — onder de score chips */}
        <div key={activePlayerIdx + "-" + currentTurnIdx} style={{opacity: phase === "playing" ? 1 : 0.25, transition: "opacity 0.3s"}}>
          <TimerProgressBar pct={phase === "playing" ? timerPct : 1} color={phase === "playing" ? timerColor : "rgba(255,255,255,0.4)"} empty={timesUp} transition="width 0.05s linear, background 0.5s" />
          <div style={{textAlign:"center", fontFamily:"'Righteous', cursive", fontSize:"clamp(13px, 3.5vw, 16px)", color: phase === "playing" ? timerColor : "rgba(255,255,255,0.4)", transition:"color 0.5s"}}>
            {phase === "roundover" ? "0s" : <TimerCountdown secs={phase === "playing" ? timeLeft : CHAIN_ROUND_SECONDS} timesUp={timesUp} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LetterSnel Setup overlay ─────────────────────────────────────────────────
function LetterSnelSetupPanel({ onStartLS, names, setNames, activeLetters, setActiveLetters }) {
  const [lsGameMode, setLsGameMode] = useState("klassiek");
  const [targetScore, setTargetScore] = useState(10);
  const canStart = names.length >= 2 && names.every(n => n.trim().length > 0) && activeLetters.length >= 2;

  const addPlayer = () => { if (names.length < 10) setNames(prev => [...prev, ""]); };
  const removePlayer = (i) => { if (names.length > 2) setNames(prev => prev.filter((_, j) => j !== i)); };
  const updateName = (i, v) => setNames(prev => prev.map((n, j) => j === i ? v : n));

  const toggleLetter = (letter) => {
    setActiveLetters(prev =>
      prev.includes(letter)
        ? prev.length > 2 ? prev.filter(l => l !== letter) : prev
        : [...prev, letter].sort()
    );
  };

  const letterRows = [
    FULL_ALPHABET.slice(0, 7),
    FULL_ALPHABET.slice(7, 14),
    FULL_ALPHABET.slice(14, 21),
    FULL_ALPHABET.slice(21, 26),
  ];

  return (
    <div className="ls-setup-section">

      {/* Modus keuze */}
      <div className="ls-mode-wrap">
        <div className="setup-wrapper-badge" style={{background:"#ea580c", top:"-14px"}}>MODUS</div>
        <div className="ls-mode-grid">
          <button
            className={`ls-mode-btn ${lsGameMode === "klassiek" ? "ls-mode-btn-active" : "ls-mode-btn-inactive"}`}
            onClick={() => setLsGameMode("klassiek")}
          >
            <span className="ls-mode-icon">⚡</span>
            <span className="ls-mode-title">Klassiek</span>
            <span className="ls-mode-desc">Wie roept als eerste een woord dat begint met de letter?</span>
          </button>
          <button
            className={`ls-mode-btn ${lsGameMode === "ketting" ? "ls-mode-btn-active" : "ls-mode-btn-inactive"}`}
            onClick={() => setLsGameMode("ketting")}
          >
            <span className="ls-mode-icon">🔗</span>
            <span className="ls-mode-title">Ketting</span>
            <span className="ls-mode-desc">Wie staat als laatste overeind in de strijd tegen de klok?</span>
          </button>
        </div>
      </div>

      <div className="ls-setup-players-wrap">
        <div className="setup-wrapper-badge" style={{background:"#ea580c", top:"-14px"}}>SPELERS</div>
        <div className="names-grid">
          {names.map((name, i) => (
            <PlayerNameField
              key={i}
              index={i}
              value={name}
              onChange={v => updateName(i, v)}
              onRemove={() => removePlayer(i)}
              canRemove={names.length > 2}
            />
          ))}
          {names.length < 10 && (
            <button className="add-player-integrated" onClick={addPlayer}>Speler toevoegen</button>
          )}
        </div>
      </div>

      <div className="ls-letters-wrap">
        <div className="setup-wrapper-badge" style={{background:"#ea580c"}}>LETTERS</div>
        {letterRows.map((row, ri) => (
          <div key={ri} className="ls-letter-toggle-row">
            {row.map(l => (
              <button
                key={l}
                className={`ls-letter-toggle-btn ${activeLetters.includes(l) ? "ls-letter-toggle-on" : "ls-letter-toggle-off"}`}
                onClick={() => toggleLetter(l)}
              >{l}</button>
            ))}
          </div>
        ))}
        <div className="ls-letters-count">{activeLetters.length} van 26 letters actief</div>
      </div>

      <div className="setup-section-wrap" style={{borderColor: "#f97316"}}>
        <div className="setup-wrapper-badge" style={{background:"#ea580c"}}>EINDDOEL</div>
        <div className="time-control">
          <div className="time-click-wrap">
            <div className="time-click-zone time-click-left" onClick={() => setTargetScore(s => Math.max(1, s - 1))}>
              <span className={`time-click-symbol${targetScore <= 1 ? " time-click-disabled" : ""}`}>−</span>
            </div>
            <span className="time-display">{targetScore} pt</span>
            <div className="time-click-zone time-click-right" onClick={() => setTargetScore(s => Math.min(50, s + 1))}>
              <span className={`time-click-symbol${targetScore >= 50 ? " time-click-disabled" : ""}`}>+</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className={`start-btn ${canStart ? "ready-solid" : ""}`}
        style={{marginTop: "12px"}}
        onClick={() => canStart && onStartLS(names.map(n => n.trim()), activeLetters, lsGameMode, targetScore)}
        disabled={!canStart}
      >
        {canStart ? "Spel starten ➜" : activeLetters.length < 2 ? "Kies minimaal 2 letters" : "Vul alles in…"}
      </button>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// ── WoordenRaad (original game) ───────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

// ── Categorieën ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "voedsel",        label: "🍕 Eten & Drinken" },
  { id: "koken",          label: "🧑‍🍳 Koken & Bakken" },
  { id: "sport",          label: "⚽ Sport & Hobby" },
  { id: "verkeer",        label: "🚗 Verkeer & Vervoer" },
  { id: "dieren",         label: "🐶 Dieren" },
  { id: "natuur",         label: "🌿 Natuur" },
  { id: "kleding",        label: "👕 Kleding" },
  { id: "huishouden",     label: "🏠 Huishouden" },
  { id: "gereedschap",    label: "🔧 Gereedschap" },
  { id: "beroepen",       label: "👷 Beroepen" },
  { id: "kantoor",        label: "💼 Werk & Kantoor" },
  { id: "emoties",        label: "🎭 Emoties & Gedrag" },
  { id: "acties",         label: "🏃 Werkwoorden" },
  { id: "misdaad",        label: "🚔 Misdaad & Justitie" },
  { id: "fictie",         label: "🧙 Fictie & Mythe" },
  { id: "literatuur",     label: "✍️ Literatuur" },
  { id: "muziek",         label: "🎶 Muziek" },
  { id: "kunst",          label: "🧑‍🎨 Kunst" },
  { id: "politiek",       label: "⚖️ Politiek & Maatschappij" },
  { id: "onderwijs",      label: "🎓 Onderwijs" },
  { id: "religie",        label: "🕍 Religie" },
  { id: "militair",       label: "🪖 Militair" },
  { id: "wapens",         label: "🔫 Wapens" },
  { id: "wetenschap",     label: "🔬 Wetenschap" },
  { id: "geneeskunde",    label: "🩺 Geneeskunde" },
  { id: "ruimte",         label: "🚀 Ruimte" },
  { id: "plaatsen",       label: "🧭 Plaatsen" },
  { id: "landen",         label: "🌍 Landen" },
  { id: "spreekwoorden",  label: "💬 Gezegden", bonus: true },
];

// WORDS_BY_CATEGORY maps category id → word array
const WORDS_BY_CATEGORY = (() => {
  const dieren = [
    'aardvarken', 'adelaar', 'arend', 'albatros', 'alpaca', 'anaconda', 'baviaan', 'kameleon', 'kangoeroe', 'kuiken',
    'beer', 'bever', 'bijenkoningin', 'bizon', 'boomkikker', 'boomslang', 'kat', 'kever', 'kikker', 'bladluis',
    'buffel', 'buizerd', 'buldog', 'cheetah', 'chihuahua', 'cobra', 'kiwi', 'egel', 'ekster', 'eland', 'marter',
    'condor', 'dingo', 'dinosaurus', 'dolfijn', 'dromedaris', 'tortelduif', 'dwergpinguïn', 'eekhoorn', 'bloedzuiger',
    'gibbon', 'giraffe', 'gorilla', 'goudjakhals', 'goudvis', 'grizzlybeer', 'hyena', 'ibis', 'ijsbeer', 'coyote',
    'guppie', 'haai', 'haas', 'hagedis', 'hamster', 'havik', 'prooidier', 'hermelijn', 'hond', 'honingdas', 'gazelle',
    'impala', 'inktvis', 'jaguar', 'jakhals', 'kaketoe', 'kameel', 'emoe', 'fazant', 'flamingo', 'fret', 'fauna',
    'koala', 'koe', 'komodovaraan', 'konijn', 'kraanvogel', 'krab', 'galapagosschildpad', 'gecko', 'lynx', 'herbivoor',
    'krokodil', 'kwal', 'kwartel', 'lama', 'leeuw', 'leguaan', 'chimpansee', 'lemming', 'lepelaar', 'libel', 'omnivoor',
    'maanvis', 'marmot', 'meerkat', 'meerval', 'mier', 'miereneter', 'nijlpaard', 'octopus', 'meikever', 'garnaal',
    'mol', 'mug', 'muilezel', 'muskusrat', 'narwal', 'postduif', 'nerts', 'neusaap', 'neushoorn', 'nijlgans', 'mijt',
    'oehoe', 'olifant', 'ooievaar', 'orang-oetan', 'orka', 'otter', 'stier', 'stinkdier', 'stokstaartje', 'jak', 'kip',
    'paard', 'panda', 'papegaai', 'paradijsvogel', 'parkiet', 'bidsprinkhaan', 'stekelvarken', 'steur', 'zeekoe',
    'pauw', 'pelikaan', 'pinguïn', 'vogelbekdier', 'poema', 'poolvos', 'lieveheersbeestje', 'luiaard', 'ratelslang',
    'prairiehond', 'raaf', 'rat', 'reiger', 'rendier', 'reuzenoctopus', 'reuzenpanda', 'roofvogel', 'salamander',
    'slak', 'snoek', 'specht', 'sperwer', 'spin', 'roedel', 'kudde', 'schaap', 'schildpad', 'schorpioen', 'naaktslak',
    'struisvogel', 'tapir', 'tarantula', 'tijger', 'toekan', 'tor', 'kakkerlak', 'wants', 'walvis', 'wasbeer', 'kieviet',
    'kerkuil', 'varaan', 'veelvraat', 'vleermuis', 'vlieg', 'vliegend hert', 'vliegende vis', 'vlinder', 'vos', 'dodo',
    'waterbuffel', 'waterrat', 'wezel', 'wild zwijn', 'wolf', 'wombat', 'goudhaan', 'ijsvogel', 'kauw', 'aaseter',
    'worm', 'wrattenzwijn', 'zebra', 'zeehond', 'zeeotter', 'bonobo', 'zwarte panter', 'damhert', 'forel', 'adder',
    'krekel', 'huismus', 'vuurvliegje', 'eendagsvlieg', 'zeepaardje', 'zeeschildpad', 'zwaan', 'zwaluw', 'zwarte mamba',
    'pimpelmees', 'roodborst', 'steenuil', 'zanglijster', 'kraai', 'knobbelzwaan', 'nachtegaal', 'bultrug', 'everzwijn',
    'tonijn', 'zalm', 'haring', 'makreel', 'kabeljauw', 'paling', 'walrus', 'zeeleeuw', 'bruinvis', 'potvis', 'husky',
    'kreeft', 'mossel', 'oester', 'pijlinktvis', 'bij', 'wesp', 'hommel', 'vlooien', 'pissebed', 'glimworm', 'teckel',
    'mot', 'haan', 'eend', 'gans', 'kalkoen', 'geit', 'karper', 'baars', 'rog', 'zwaardvis', 'clownvis', 'herkauwer',
    'zeester', 'varken', 'ezel', 'pony', 'lam', 'reuzenhaai', 'merel', 'spookdier', 'kogelvis', 'capibara', 'pluimvee',
    'sidderaal', 'gnoe', 'gordeldier', 'gier', 'papegaaiduiker', 'piranha', 'wandelende tak', 'organisme', 'kaaiman',
    'carnivoor', 'duizendpoot', 'ongedierte', 'hoefdier', 'okapi', 'lintworm', 'insect', 'jachthond', 'kanarie',
    'kariboe', 'kikkervisje', 'knaagdier', 'kolibrie', 'koolmees', 'koudbloedig', 'warmbloedig', 'plankton'
  ];

  const voedsel = [
    'aardappel', 'aardappelpuree', 'aardbei', 'abrikoos', 'amaretto', 'ananas', 'andijvie', 'appelmoes', 'appelsap', 'jam',
    'appeltaart', 'asperges', 'avocado', 'bacon', 'bagel', 'baguette', 'balsamico', 'bami', 'banaan', 'hamburger', 'truffel',
    'bananenbrood', 'basilicum', 'biefstuk', 'bier', 'bieslook', 'bietensalade', 'bitterbal', 'bitterkoekje', 'taugé',
    'bladerdeeg', 'blauwe bes', 'bloemkool', 'boerenkool', 'bolognese', 'bonbons', 'bosbes', 'boterham', 'bouillon', 'kruimel',
    'brandnetelsoep', 'broccoli', 'brood', 'brownie', 'bruine bonen', 'caesarsalade', 'karamel', 'nougat', 'carpaccio',
    'cashewnoot', 'champignon', 'cheesecake', 'chipolata', 'chips', 'noten', 'chocolade', 'churros', 'ciabatta', 'tosti',
    'citroen', 'cola', 'tapenade', 'corndog', 'couscous', 'cranberrysap', 'croissant', 'crème brûlée', 'gewas', 'hachee',
    'curry', 'boerenomelet', 'dadel', 'donut', 'doperwt', 'drakenvrucht', 'druiven', 'eclairs', 'hummus', 'olijf', 'ei',
    'enchilada', 'energiedrank', 'erwtensoep', 'espresso', 'falafel', 'nasi', 'feta', 'friet', 'frikadel', 'zure room',
    'frisdrank', 'fruitsalade', 'noedels', 'gazpacho', 'gehaktbal', 'geitenkaas', 'gerst', 'vlaai', 'gebak', 'ijsbergsla',
    'nectarine', 'gin-tonic', 'goulash', 'granaatappel', 'groente', 'groentesoep', 'gyros', 'paprika', 'jalapeno', 'aalbes',
    'jus', 'kaas', 'kaasfondue', 'kaassoufflé', 'kaneelbroodje', 'parmezaan', 'kappertjes', 'kapsalon', 'kastanje', 'anijs',
    'kerrieworst', 'kers', 'kipfilet', 'pasta', 'kipnuggets', 'koffie', 'kokosmelk', 'komkommer', 'koriander', 'kroket',
    'penne', 'kwark', 'kwarktaart', 'lamsvlees', 'lasagne', 'latte', 'limonade', 'salami', 'paella', 'linzen', 'loempia',
    'lychee', 'macaron', 'macaroni', 'mango', 'hazelnoot', 'hotdog', 'marshmallow', 'mayonaise', 'meloensap', 'milkshake',
    'miso', 'mosterd', 'olijfolie', 'perzik', 'pesto', 'piccalilly', 'pindakaas', 'pistache', 'pitabrood', 'pannenkoek',
    'pizza', 'poffertjes', 'pommes frites', 'pompoen', 'popcorn', 'prei', 'mueslireep', 'pruim', 'pulled pork', 'quiche',
    'rabarber', 'radijs', 'ratatouille', 'mozzarella', 'ravioli', 'ricotta', 'rijstpap', 'rijsttafel', 'risotto', 'banketstaaf',
    'rode wijn', 'passievrucht', 'roggebrood', 'rolmops', 'roomijs', 'rozijnen', 'rucola', 'rum', 'softijs', 'muffin', 'appelflap',
    'salade', 'sandwich', 'sap', 'satésaus', 'scones', 'selderij', 'honing', 'lolly', 'sinaasappel', 'slagroom', 'cracker',
    'smoothie', 'snoep', 'soep', 'sojasaus', 'poke bowl', 'soufflé', 'spaghetti', 'speklap', 'spinazie', 'stamppot', 'grapefruit',
    'stoofpot', 'zuurvlees', 'strudel', 'suiker', 'sushi', 'taart', 'taco', 'vitamine', 'zonnebloempitten', 'wafel', 'augurk',
    'tartaar', 'teriyaki', 'thee', 'tiramisu', 'toast', 'tomatensaus', 'quinoa', 'tomatensoep', 'tompouce', 'tortilla', 'rollade',
    'ui', 'eiwit', 'vet', 'roti', 'uiensoep', 'vanillepudding', 'vla', 'walnoot', 'watermeloen', 'pecannoot', 'huzarensalade',
    'koolhydraat', 'witlof', 'witte wijn', 'wrap', 'yoghurt', 'zuurkool', 'zuur', 'zout', 'zoet', 'bitter', 'paneermeel', 'krieltje',
    'appelstroop', 'beschuit', 'boontjes', 'erwten', 'flensje', 'gehakt', 'gevulde koek', 'hagelslag', 'hutspot', 'baklava',
    'jenever', 'karnemelk', 'kokos', 'krentenbol', 'pinda', 'kruidenboter', 'melk', 'muesli', 'ontbijtkoek', 'pap', 'pastei',
    'peperkoek', 'pepernoot', 'rijst', 'rookworst', 'speculaas', 'stroopwafel', 'schijf van vijf', 'roomboter', 'eidooier',
    'wentelteefje', 'wittebrood', 'suikerspin', 'aardpeer', 'ansjovis', 'rode kool', 'bamischijf', 'biet', 'bloedworst', 'hamlap',
    'brie', 'bami pangang', 'pistolet', 'sambal', 'courgette', 'döner', 'eendenborst', 'eierkoek', 'filet americain', 'biscuit',
    'panna cotta', 'gember', 'guacamole', 'grillworst', 'havermout', 'inktvisringen', 'ierse koffie', 'kalfsvlees', 'deeg',
    'kapucijners','kaviaar','kibbeling', 'knoflook', 'koolraap', 'kruidnoten', 'lekkerbek','leverworst', 'limoen', 'kroepoek',
    'rijstwafel', 'maïs', 'mandarijn', 'matse', 'merengue', 'nasischijf', 'nootmuskaat', 'oliebol', 'paaseitje', 'paksoi', 
    'druivensap', 'sardientje', 'saté', 'saucijzenbroodje', 'shoarma', 'snert', 'sparerib', 'spruitje', 'stokbrood', 'tapas',
    'cacao', 'tofu', 'venkel', 'wasabi', 'borrelplank', 'wortel', 'vijgen', 'visstick', 'worstenbroodje', 'kauwgom', 'beenham',
    'laurierblad', 'tijm', 'kaneel', 'chilipeper', 'witte peper', 'zelfrijzend bakmeel', 'gist', 'basterdsuiker', 'cognac',
    'zuurstok', 'drop', 'pretzel', 'bavarois', 'cervelaatworst', 'champagne', 'whisky', 'bourbon', 'cider', 'cocktail', 'kebab',
    'cordon bleu', 'cornflakes', 'crouton', 'feestmaal', 'glühwein', 'gluten', 'ijsblokje', 'junkfood', 'kandij', 'karbonade',
    'kerstkransje', 'ketchup', 'kikkerbilletjes', 'kletskop', 'kliekjes', 'knäckebröd', 'kousenband', 'schuimkraag', 'kropsla'
  ];

  const koken = [
    'bakker', 'banketbakker', 'chef-kok', 'kok', 'dunschiller', 'magnetron', 'heteluchtoven', 'kookplaat', 'airfryer',
    'blender', 'mixer', 'waterkoker', 'rijstkoker', 'slowcooker', 'barbecue', 'snijplank', 'restaurant', 'culinair',
    'wokpan', 'braadpan', 'koekenpan', 'steelpan', 'rasp', 'zeef', 'kookwekker',  'pollepel', 'soeplepel', 'flauw',
    'maatbeker', 'ovenwant', 'vergiet', 'aluminiumfolie', 'bakpapier', 'onderzetter', 'soepkom', 'bestek', 'fruiten',
    'koksmes', 'theelepel', 'spatel', 'lepel', 'vork', 'pepermolen', 'garde', 'deegroller', 'taartvorm', 'gaar',
    'broodplank', 'pizzasnijder', 'fluitketel', 'blikopener', 'kurkentrekker', 'kookboek', 'diner', 'fornuis',
    'weegschaal', 'bakplaat', 'beslagkom', 'knoflookpers', 'broodrooster', 'sapcentrifuge', 'aanrecht', 'amuse',
    'bakkerij', 'koken', 'bakken', 'braden', 'recept', 'frituren', 'grillen', 'roosteren', 'wokken', 'maaltijd',
    'sudderen', 'pocheren', 'blancheren', 'marineren', 'karamelliseren', 'glaceren', 'flamberen', 'menukaart',
    'inkoken', 'kneden', 'schillen', 'afgieten', 'proeven', 'keukenrol', 'theedoek', 'servet', 'doorbakken',
    'kruidenrek', 'afzuigkap', 'spuitzak', 'springvorm', 'keuken', 'wafelijzer', 'tosti-ijzer', 'voorgerecht',
    'broodmes', 'schilmesje', 'vleeshamer', 'mengkom', 'ovenschaal', 'roerbakken', 'bijgerecht', 'hoofdgerecht',
    'portie', 'smaakmaker', 'frituurpan', 'inductieplaat', 'staafmixer', 'cakevorm', 'ovenrek', 'nagerecht',
    'lopend buffet', 'conserveren', 'fileren', 'snipperen', 'ontdooien', 'bereidingstijd', 'Gordon Ramsay',
    'opkloppen', 'afruimen', 'opdienen', 'dressing', 'ijslepel', 'hartig', 'pittig', 'knapperig', 'toetje',
    'romig', 'sappig', 'glazuren', 'lunch', 'brunch', 'aanbakken', 'aanbranden', 'aroma', 'fijnsnijden',
    'garnering', 'keukengerei', 'hapjespan', 'indikken', 'ingrediënt', 'kookeiland', 'kruiden'
  ];

  const onderwijs = [
    'leerling', 'docent', 'onderwijs', 'scriptie', 'klas', 'klaslokaal', 'klassenfoto', 'proefwerk', 'toets',
    'cijferlijst', 'rapport', 'huiswerk', 'dictee', 'spreekbeurt', 'aardrijkskunde', 'geschiedenis', 'handvaardigheid',
    'maatschappijleer', 'studie', 'diploma', 'examen', 'student', 'hogeschool', 'universiteit', 'professor', 'ijsvrij',
    'tentamen', 'academisch', 'rector', 'mentor', 'bijles', 'conciërge', 'basisschool', 'middelbare school',
    'montessori', 'thuisonderwijs', 'bijscholing', 'schoolreisje', 'excursie', 'werkstuk', 'stage', 'lezing',
    'open dag', 'ouderavond', 'zomervakantie', 'overhoring', 'atlas', 'geodriehoek', 'passer', 'liniaal',
    'schoolbord', 'kluisje', 'etui', 'onvoldoende', 'blijven zitten', 'CITO-toets', 'schooladvies', 'brugpieper',
    'lesrooster', 'samenvatting', 'aantekeningen', 'meerkeuzevraag', 'studiefinanciering', 'cum laude', 'hoogleraar',
    'afstuderen', 'schoolkrant', 'groepsdruk', 'afkijken', 'spiekbriefje', 'nablijven', 'schorsing', 'lesuur',
    'uitval', 'invaller', 'absentie', 'faalangst', 'studiebeurs', 'luizenmoeder', 'peuterspeelzaal', 'examenvrees',
    'gymnasium', 'lyceum', 'internaat', 'schoolplein', 'puntenslijper', 'schrift', 'practicum', 'aula', 'meeloopdag',
    'mediatheek', 'college', 'reünie', 'semester', 'tussenuur', 'je vinger opsteken', 'de beurt krijgen', 'intercom',
    'brugklas', 'campus', 'studentencorps', 'cursus', 'meester', 'juf', 'educatie', 'eindcijfer', 'zakken',
    'kleuterklas', 'laatstejaars'
  ];

  const beroepen = [
    'acrobaat', 'archeoloog', 'stand-upcomedian', 'monteur', 'notaris', 'socioloog', 'architect', 'fijnproever', 'kraanmachinist',
    'blogger', 'botanicus', 'brandweerman', 'buschauffeur', 'stalmeester', 'clown', 'automonteur', 'financier', 'straatveger',
    'bondscoach', 'cowboy', 'croupier', 'dansleraar', 'data-analist', 'beurshandelaar', 'hovenier', 'influencer', 'reddingswerker',
    'dierenarts', 'dierentrainer', 'diplomaat', 'documentairemaker', 'schoenmaker', 'verkeersregelaar', 'havenarbeider', 'imker',
    'dronepiloot', 'duikinstructeur', 'econoom', 'ethisch hacker', 'examinator', 'beveiliger', 'cameraman', 'herder', 'ijsmeester',
    'gids', 'glazenwasser', 'illusionist', 'grafisch ontwerper', 'kassière', 'tegelzetter', 'pedicure', 'trimmer', 'importeur',
    'ingenieur', 'inspecteur', 'kraamverzorger', 'begeleider', 'lasser', 'audicien', 'houthakker', 'beul', 'installateur',
    'jongleur', 'journalist', 'juwelier', 'astroloog', 'slager', 'kapitein', 'luchtverkeersleider', 'commentator', 'butler',
    'makelaar', 'matroos', 'meteoroloog', 'microbioloog', 'kruidenier', 'stadsplanner', 'klusjesman', 'escort', 'goudzoeker',
    'opticien', 'piloot', 'politicoloog', 'postbode', 'stoffeerder', 'loodgieter', 'sommelier', 'ober', 'grensrechter', 'kotter',
    'strateeg', 'stratenmaker', 'stuntman', 'systeembeheerder', 'visser', 'vliegtuigbouwer', 'vuilnisman', 'babysitter',
    'tatoeëerder', 'taxichauffeur', 'taxidermist', 'timmerman', 'tolk', 'kweker', 'wijnboer', 'kustwacht', 'badmeester',
    'trainer', 'tuinman', 'verpleegkundige', 'verzekeringsagent', 'lobbyist', 'pionier', 'winkelmanager', 'bemiddelaar',
    'winkelier', 'wiskundige', 'woordvoerder', 'zeebioloog', 'zeiler', 'diëtist', 'schildwacht', 'bioloog', 'bloemist',
    'aannemer', 'burgemeester', 'cabaretier', 'ijscoman', 'kaarsenmaker', 'profvoetballer', 'barista', 'bouwvakker', 'jockey',
    'ambtenaar', 'animator', 'auteur', 'bankier', 'belastingadviseur', 'hoefsmid', 'bibliothecaris', 'collectant', 'investeerder',
    'marketeer', 'masseur', 'muziekleraar', 'ondernemer', 'penningmeester', 'drogist', 'elektricien', 'huishoudster', 'figurant',
    'rijinstructeur', 'secretaris', 'vakkenvuller', 'fietsenmaker', 'diepzeeduiker', 'doventolk', 'knecht', 'douanier', 'ecoloog',
    'stewardess', 'vertaler', 'forensisch arts', 'marechaussee', 'vrachtwagenchauffeur', 'gigolo', 'glasblazer', 'conducteur',
    'machinist', 'molenaar', 'parkeercontroleur', 'recruiter', 'receptionist', 'vrijwilliger', 'acteur', 'gameontwikkelaar',
    'trambestuurder', 'kapper', 'reisleider', 'restaurateur', 'stukadoor', 'wegwerker', 'webdesigner', 'producent', 'zwemleraar',
    'strandjutter', 'kelner', 'kermisklant', 'hulpkerstman', 'klaar-over', 'kleermaker', 'koerier', 'koetsier', 'kolenboer',
    'koopman', 'verloskundige', 'krantenjongen', 'kroegbaas'
  ];

  const sport = [
    'aerobics', 'alpineskiën', 'american football', 'atletiek', 'badminton', 'taekwondo', 'discipline',
    'balletdansen', 'basketbal', 'beachvolleybal', 'bergsport', 'biatlon', 'bingo', 'trofee', 'blessure',
    'biljarten', 'BMX', 'bobslee', 'boksen', 'bowling', 'breakdance', 'doping', 'scheenbeschermer', 'VAR',
    'cricket', 'curling', 'dammen', 'discuswerpen', 'ganzenbord', 'rivaliteit', 'doelpunt', 'hobby',
    'dressuur', 'duiken', 'e-sporten', 'estafette', 'fietsen', 'freerunning', 'tennis', 'honkbal', 'arbiter',
    'frisbee', 'gewichtheffen', 'gokken', 'golfen', 'gymnastiek', 'handbal', 'tafeltennis', 'scheidsrechter',
    'hardlopen', 'hengelen', 'hindernisloop', 'hockey', 'hoogspringen', 'hordelopen', 'slagbal', 'atleet',
    'ijshockey', 'jiu-jitsu', 'joggen', 'judo', 'kaatsen', 'turnen', 'snorkelen', 'apenkooien', 'podcast',
    'karate', 'karting', 'kegelen', 'kitesurfen', 'klimmen', 'klimwand', 'trail running', 'competitie',
    'knikkeren', 'kogelstoten', 'krachttraining', 'kunstrijden', 'lacrosse', 'langlaufen', 'conditie',
    'langebaanschaatsen', 'longboarden', 'marathon', 'minigolf', 'motorcross', 'motorsport', 'degradatie',
    'mountainbiken', 'netbal', 'nordic walking', 'paardrijden', 'padel', 'paintball', 'varen', 'denksport',
    'parachutespringen', 'parcours', 'pétanque', 'polsstokhoogspringen', 'powerlifting', 'kanoën', 'goal',
    'ringsteken', 'rodeo', 'roeien', 'rolschaatsen', 'rugby', 'trampolinespringen', 'triatlon', 'doelsaldo',
    'schaatsen', 'schaken', 'schansspringen', 'scrabble', 'sjoelen', 'skeeleren', 'veldrijden', 'grand prix',
    'skeleton', 'skiën', 'skislalom', 'snowboarden', 'softbal', 'speerwerpen', 'verspringen', 'fitness',
    'spijkerpoepen', 'squash', 'stoeien', 'suppen', 'surfen', 'synchroonzwemmen', 'trefbal', 'hattrick',
    'pottenbakken', 'vliegeren', 'vliegvissen', 'voetbal', 'volleybal', 'wandelen', 'grand slam',
    'waterpolo', 'waterskiën', 'wakeboarden', 'wedstrijd', 'wielrennen', 'worstelen', 'korfbal',
    'yoga', 'zeilen', 'zwemmen', 'schermen', 'kwartetten', 'sumoworstelen', 'windsurfen', 'jagen',
    'abseilen', 'kampioensbeker', 'medaille', 'stopwatch', 'borduren', 'breien', 'touwtrekken',
    'dartpijl', 'flipperkast', 'gele kaart', 'rode kaart', 'schaakbord', 'kleiduiven schieten', 'bodybuilden',
    'trampoline', 'vogelspotten', 'stoepkrijten', 'weven', 'escaperoom', 'kogelslingeren', 'jeu de boules',
    'halfpipe', 'rolstoelbasketbal', 'salsadansen', 'linedance', 'volksdansen', 'interland', 'touwtjespringen',
    'boogschieten', 'survivallen', 'raften', 'skateboarden', 'keeper', 'keu', 'klaverjassen',
    'puzzelen', 'bordspel', 'videospellen', 'kamperen', 'crossfit', 'boot camp', 'lasergame',
    'spinning', 'kickboksen', 'speedklimmen', 'zaalvoetbal', 'rolstoeltennis', 'paragliding',
    'tafeltennistafel', 'voetbalnet', 'basketbalring', 'hockeystick', 'tennisracket',  'domino',
    'modeltrein', 'legoblokje', 'puzzelstuk', 'kaartspel', 'monopoly', 'dobbelsteen', 'fierljeppen'
  ];

  const natuur = [
    'aardbeving', 'aardverschuiving', 'algen', 'bamboe', 'bergtop', 'rots', 'seizoen', 'aardkorst',
    'bliksem', 'donder', 'bloem', 'bos', 'branding', 'zwerfkei', 'eb', 'rotsbodem', 'metaal', 'heksenkring',
    'brandnetels', 'bronwater', 'hoosbui', 'cactus', 'compost', 'dauw', 'delta', 'savanne', 'microplastic',
    'ecosysteem', 'fjord', 'fossiel', 'getijden', 'geiser', 'goudklomp', 'strand', 'dijk', 'hortensia',
    'greppel', 'hagel', 'herfst', 'herfstblad', 'heuvel', 'hittegolf', 'storm', 'duin', 'anjer', 'onkruid',
    'ijsberg', 'ijspegel', 'ijsschots', 'ijsvorming', 'inham', 'loof', 'mos', 'margriet', 'flora', 'landschap',
    'kiezel', 'klif', 'koraal', 'koraalrif', 'lavastroom', 'lente', 'droogte', 'moesson', 'krokus', 'grind',
    'luchtvochtigheid', 'mangrovebos', 'maretak', 'meander', 'mist', 'modder', 'moeras', 'hyacint', 'liaan',
    'oase', 'oceaan', 'orkaan', 'paddenstoel', 'paddenvijver', 'dennennaald', 'morgenrood', 'asbest', 'ijzererts',
    'plas', 'poollicht', 'regen', 'regenboog', 'regenbui', 'regenwoud', 'hars', 'naaldboom', 'bloeitijd', 'kaap',
    'schemering', 'schimmel', 'sneeuw', 'sneeuwvlok', 'sneeuwstorm', 'steengroeve', 'nevel', 'bloesem',
    'toendra', 'tornado', 'tropische regen', 'tsunami', 'tulp', 'uiterwaarden', 'klaproos', 'houtskool', 'jaargetijde',
    'vallei', 'veen', 'veld', 'vijver', 'vlakte', 'vloed', 'wild', 'stikstof', 'archipel', 'steenkool', 'kampvuur',
    'vulkaan', 'vulkaanuitbarsting', 'waterval', 'weide', 'windvlaag', 'woestijn', 'stekel', 'aardgas',
    'wolk', 'woud', 'zandstorm', 'zeewind', 'zomer', 'marmer', 'stroomversnelling', 'rivier', 'biesbos',
    'zonsondergang', 'zonsopgang', 'schelp', 'schaduw', 'berk', 'eik', 'ravijn', 'vlierbes', 'blubber',
    'graan', 'kastanjeboom', 'klaver', 'korenbloem', 'lavendel', 'meidoorn', 'braamstruik', 'cocon',
    'narcis', 'populier', 'wilg', 'viooltje', 'afgrond', 'gletsjer', 'zee', 'lagedrukgebied', 'diamant',
    'lawine', 'draaikolk', 'turbulentie', 'akker', 'beek', 'bergpas', 'kurk', 'struikgewas', 'bestuiving',
    'bloemenveld', 'bosbrand', 'bospad', 'bron', 'boomstam', 'eiland', 'jager',  'bosje', 'berenklauw',
    'erosie', 'gras', 'grot', 'jungle', 'kustlijn', 'natuur', 'boswachter', 'bosrand', 'berm', 'weiland',
    'volle maan', 'onweersbui', 'oerbos', 'permafrost', 'polder', 'fermentatie', 'stroompje', 'grondwater',
    'rivieroever', 'schors', 'steentijd', 'steppegras', 'waterlelie', 'riet', 'aardbol', 'landbouw',
    'stroomgebied', 'stuifzand', 'terp', 'waterput', 'wildernis', 'stofwolk', 'heide', 'tuinieren',
    'windstil', 'zandbank', 'zandvlakte', 'zeebodem', 'zeestroming', 'zeewier', 'koolzaad', 'grondstof',
    'zilt', 'zoetwatermeer', 'zonnestraling', 'zonsverduistering', 'zoutvlakte', 'zonnebloem', 'helium',
    'es', 'iep', 'beuk', 'hulst', 'klimop', 'varens', 'stromend water', 'madeliefje', 'distel', 'bloeddiamant', 
    'steen', 'zeegras', 'braam', 'eikel', 'dennenappel', 'framboos', 'boomgaard', 'boterbloem', 'windhoos',
    'vruchtvlees', 'stuifmeel', 'dooi', 'rijp', 'ijzel', 'lelie', 'magma', 'munt', 'najaar', 'voorjaar',
    'bladerdek', 'conifeer', 'den', 'gebergte', 'graniet', 'horizon', 'kalksteen', 'vloedgolf', 'kikkerdril',
    'fotosynthese', 'riviermonding', 'winter', 'wind', 'sloot', 'wad', 'zwam', 'inheems', 'ivoor'
  ];

  const verkeer = [
    'aanhanger', 'achtbaan', 'ambulance', 'Boeing', 'zeilschip', 'hybride', 'boot', 'brandweerwagen', 'bromfiets', 'rolstoel', 'skateboard',
    'bus', 'camper', 'go-kart', 'caravan', 'catamaran', 'containerschip', 'driewieler', 'vrachtwagen', 'fietstaxi', 'drone', 'vouwfiets',
    'dubbeldekker', 'duikboot', 'elektrische auto', 'helikopter', 'hogesnelheidstrein', 'hoverboard', 'fatbike', 'jetpack', 'paardentram',
    'hovercraft', 'intercity', 'internationale trein', 'jetski', 'kabelbaan', 'kajak', 'kar', 'lijnbus', 'metro', 'Mini', 'watervliegtuig',
    'buggy', 'cabrio', 'cockpit', 'vrachtvliegtuig', 'monorail', 'motorfiets', 'nachttrein', 'oplegger', 'pick-uptruck', 'politieauto',
    'veerboot', 'postkoets', 'racefiets', 'racewagen', 'reddingsboot', 'rijtuig', 'riksja', 'robotaxi', 'roeiboot', 'schip', 'segway',
    'jumbojet', 'zweefvliegtuig', 'veerpont', 'slee', 'sleepboot', 'sloep', 'speedboot', 'stadsbus', 'luchtballon', 'minivan', 'skelter',
    'stadsfiets', 'stoomboot', 'stoomlocomotief', 'SUV', 'taxi', 'bulldozer', 'touringcar', 'scooter', 'trein', 'zeilboot', 'tandem', 'step',
    'tractor', 'bestelbus', 'waterstofauto', 'tankwagen', 'olietanker', 'jacht', 'rubberboot', 'waterbus', 'quad', 'trolleybus', 'kano',
    'vlot', 'waterscooter', 'onderzeeër', 'waterfiets', 'golfkarretje', 'tram', 'boemeltrein', 'ligfiets', 'ziekenwagen', 'tuk-tuk',
    'brandweerboot', 'traumahelikopter', 'zeppelin', 'bakfiets', 'sleepwagen', 'deelfiets', 'deelscooter', 'kraanwagen', 'gondel',
    'terreinwagen', 'zijspan', 'shovel', 'nachtbus', 'pendelbusje', 'sneeuwschuiver', 'lijkwagen', 'rolstoelbus', 'baggerschip',
    'cruiseschip', 'koelwagen', 'privéjet', 'automobilist', 'motor', 'huifkar', 'vorkheftruck', 'schoolbus',

    'brandstof', 'benzine', 'diesel', 'kerosine', 'laadpaal', 'GPS', 'asfalt', 'haaientanden', 'flitspaal', 'verkeersdrempel', 'daluren',
    'vliegtuigtrap', 'ov-chipkaart', 'treinkaartje', 'vliegticket', 'rijbewijs', 'kentekenplaat', 'autopech', 'lekke band', 'lantaarnpaal',
    'Nationale Spoorwegen', 'doodlopende weg', 'eenrichtingsweg', 'tolweg', 'snelweg', 'ringweg', 'perron', 'riolering', 'rotonde',
    'spoorwegovergang', 'laad- en losplaats', 'tunnel', 'bagageband', 'viaduct', 'aquaduct', 'ecoduct', 'vertrekhal', 'aankomsthal',
    'landingsbaan', 'afrit', 'invoegstrook', 'zebrapad', 'rijstrook', 'fietspad', 'kruispunt', 'stoplicht', 'voetpad', 'wandelroute',
    'aanlegsteiger', 'hangbrug', 'spoorlijn', 'bushalte', 'haarspeldbocht', 'ophaalbrug', 'tankstation', 'file', 'forens', 'plattegrond',
    'fietsendrager', 'zijspiegel', 'gaspedaal', 'handrem', 'haven', 'benzinepomp', 'helipad', 'stoep', 'treinstation', 'treincoupé',
    'fietsenrek', 'voetganger', 'ijsbreker', 'infrastructuur', 'oprit', 'kanaal', 'karavaan', 'verkeer', 'laadklep'
  ];

  const plaatsen = [
    'apotheek', 'aquarium', 'badhuis', 'wielerbaan', 'skatepark', 'balie', 'campingterrein', 'frietkraam', 'kuuroord',
    'bioscoop', 'bloemenmarkt', 'boekenwinkel', 'boerderij', 'bouwplaats', 'bowlingbaan', 'kazerne', 'brouwerij', 'kerker',
    'circus', 'grensovergang', 'consulaat', 'crematorium', 'dierentuin', 'discotheek', 'fabriek', 'café', 'camping', 'brug',
    'fietsenwinkel', 'fontein', 'fruitmarkt', 'gemeentehuis', 'grachtenpand', 'manege', 'markt', 'loods', 'casino', 'centrum',
    'jachthaven', 'kasteel', 'territorium', 'monument', 'observatorium', 'wegrestaurant', 'arena', 'bistro', 'kringloop',
    'dolfinarium', 'landgoed', 'molen', 'paleis', 'parkeergarage', 'pier', 'plein', 'poppenkast', 'roltrap', 'windmolen',
    'buitenwijk', 'postkantoor', 'pretpark', 'piramide', 'racebaan', 'recreatiegebied', 'ruïne', 'sauna', 'watertoren',
    'schaatsbaan', 'school', 'silo', 'drielandenpunt', 'sluis', 'speeltuin', 'sporthal', 'stad', 'stadion', 'vuurtoren',
    'stadshuis', 'hertenkamp', 'gracht', 'strandtent', 'supermarkt', 'tandartspraktijk', 'coffeeshop', 'distributiecentrum',
    'scheepswerf', 'toren', 'vakantiepark', 'kolenmijn', 'luchthaven', 'villa', 'vliegveld', 'alarmcentrale', 'winkelcentrum',
    'drogisterij', 'garage', 'ijssalon', 'kiosk', 'nachtwinkel', 'pannenkoekenhuis', 'parkeerplaats', 'vuilnisbelt',
    'slagerij', 'snackbar', 'sportschool', 'stomerij', 'viswinkel', 'warenhuis', 'kinderdagverblijf', 'bloemenwinkel', 'zwembad',
    'iglo', 'binnenstad', 'platteland', 'gemaal', 'steppe', 'boomhut', 'brandtrap', 'carwash', 'habitat', 'Hanzestad',
    'graftombe', 'kerkhof', 'klimrek', 'klimbos', 'markthal', 'meubelboulevard', 'herberg', 'hotel', 'hangar', 'bordeel', 'kennel',
    'schaapskooi', 'sportpark', 'stadspark', 'uitkijktoren', 'honkbalstadion', 'kermis', 'voetgangersgebied', 'houtzagerij', 'hunebed',
    'kroeg', 'voetbalveld', 'volkstuin', 'wijngaard', 'windpark', 'zonnepark', 'hutje', 'bungalow', 'tribune', 'catacombe', 'dug-out',
    'hostel', 'studentenhuis', 'flatgebouw', 'appartement', 'studio', 'stal', 'slachthuis', 'bestemming', 'filmhuis', 'knooppunt',
    'rijtjeshuis', 'ijsbaan', 'provincie', 'hoofdstad', 'gemeente', 'afsluitdijk', 'waddeneiland', 'bejaardentehuis', 'circuit',
    'clubhuis', 'continent', 'dansvloer', 'dierenkliniek', 'dierenwinkel', 'dojo', 'drukkerij', 'duiventil', 'etalage', 'expo',
    'gala', 'gangpad', 'gehucht', 'gekkenhuis', 'getto', 'golfbaan', 'golfstaat', 'green', 'IJsselmeer', 'smelterij', 'kajuit',
    'industrieterrein', 'jaarbeurs', 'jachtgebied', 'kade', 'paskamer', 'etage', 'woonwagenkamp', 'kerncentrale', 'doolhof'
  ];

  const religie = [
    'reïncarnatie', 'wedergeboorte', 'meditatie', 'ketter', 'kluizenaar', 'aura', 'yin', 'yang', 'biechtstoel',
    'boeddhisme', 'predikant', 'abdij', 'kathedraal', 'kerk', 'klooster', 'geloof', 'wijwater', 'cult', 'wonder',
    'moskee', 'synagoge', 'tempel', 'kapel', 'orthodox', 'heiden', 'begrafenis', 'kerkbank', 'hostie', 'amen',
    'christendom', 'islam', 'jodendom', 'hindoeïsme', 'sikhisme', 'Johannes Calvijn', 'taboe', 'halleluja', 'hel',
    'Reformatie', 'protestants', 'katholiek', 'Maarten Luther', 'spiritueel', 'misdienaar', 'gelovig', 'Jehova',
    'gebed', 'zonde', 'genade', 'verlossing', 'hemel', 'Maria', 'beeldenstorm', 'Goede Vrijdag', 'zondvloed',
    'vagevuur', 'paradijs', 'karma', 'nirvana', 'ziel', 'heilige geest', 'hagenpreek', 'kruisiging', 'voodoo',
    'schepping', 'doop', 'biecht', 'mis', 'besnijdenis', 'mensenoffer', 'zegening', 'zondigen', 'Hemelvaart',
    'pelgrimstocht', 'bedevaart', 'vasten', 'wierook', 'ramadan', 'kruistocht', 'gebedshuis', 'glas in lood',
    'exorcisme', 'bar mitswa', 'paus', 'bisschop', 'priester', 'mormonen', 'orgel', 'sjabbat', 'godin', 'visioen',
    'imam', 'rabbijn', 'monnik', 'non', 'abt', 'Dalai Lama', 'pastoor', 'dominee', 'Leger des Heils', '95 stellingen',
    'ayatollah', 'apostel', 'profeet', 'heilige', 'martelaar', 'engel', 'duivel', 'celibaat', 'klaagmuur', 'koster',
    'messias', 'Jezus', 'Mekka', 'Jeruzalem', 'bedevaartsoord', 'heiligdom', 'ritueel', 'davidster', 'scepter',
    'bijbel', 'koran', 'torah', 'psalm', 'communie', 'koosjer', 'halal', 'haram', 'keppel', 'atheïsme', 'agnost',
    'altaar', 'God', 'Pasen', 'Kerstmis', 'Pinksteren', 'kloostertuin', 'rozenkrans', 'lot', 'Hervorming', 'ideologie',
    'Chanoekkah', 'Suikerfeest', 'Offerfeest', 'godsdienst', 'relikwie', 'brandstapel', 'Boeddha', 'Allah', 'idool',
    'aanbidden', 'bidden', 'aalmoes', 'antichrist', 'Ark van Noach', 'bekeren', 'bezeten', 'conclaaf', 'hiernamaals',
    'discipel', 'evangelie', 'extremisme', 'geestelijke', 'geloofsovertuiging', 'godslastering', 'goeroe',
    'indoctrinatie', 'scientology', 'jihad', 'kardinaal', 'kerkganger', 'Bonifatius'
  ];

  const fictie = [
    'zeemeermin', 'heks', 'sprookje', 'fabel', 'glazen bol', 'magiër', 'tovenaar', 'schatkaart', 'fee',
    'elixer', 'tijdmachine', 'tijdreizen', 'draak', 'eenhoorn', 'vampier', 'weerwolf', 'zombie', 'trol',
    'sciencefiction', 'bovennatuurlijk', 'spook', 'griffioen', 'centaur', 'spreuk', 'feniks', 'toverstaf',
    'cycloop', 'yeti', 'fictief', 'parallel universum', 'zwarte magie', 'teleportatie', 'vloek', 'legende',
    'toverdrank', 'gnoom', 'ork', 'cyborg', 'Dr. Frankenstein', 'elfjes', 'mythe', 'folklore', 'fantasie',
    'demon', 'telepathie', 'helderziend', 'waarzegger', 'gedachtelezen', 'monster', 'verzinsel', 'hekserij',
    'gedaantewisseling', 'klopgeest', 'superheld', 'Hans Christian Andersen', 'bezwering', 'verbeelding',
    'schaduwwereld', 'gebroeders Grimm', 'bosnimf', 'reus', 'ondoden', 'onsterfelijkheid', 'illusie',
    'portaal', 'heksenketel', 'sphinx', 'minotaurus', 'hobbit', 'titaan', 'betoveren', 'zeemonster',
    'sirene', 'boeman', 'dubbelganger', 'zesde zintuig', 'halfgod', 'orakel', 'handlezer', 'Hercules',
    'Zeus', 'Atlantis', 'Poseidon', 'Hades', 'Thor', 'Olympus', 'talisman', 'amulet', 'wensput',
    'hersenspinsel', 'hocus-pocus', 'gladiator', 'kabouter', 'plaaggeest'
  ];

  const literatuur = [
    'boekhandel', 'thriller', 'roman', 'cliffhanger', 'dystopie', 'utopie', 'biografie', 'verhaallijn',
    'held', 'antiheld', 'anticlimax', 'autobiografie', 'Shakespeare', 'Charles Dickens', 'chronologisch',
    'dagboek', 'verhalenbundel', 'stripboek', 'personage', 'hoofdstuk', 'rijm', 'haiku', 'revisie', 'uitgave',
    'verteller', 'monoloog', 'dialoog', 'metafoor', 'ironie', 'satire', 'symbolisch', 'gedicht', 'bibliotheek',
    'perspectief', 'schrijver', 'scenarioschrijver', 'dichter', 'komedie', 'tragedie', 'flashback', 'publicatie',
    'spanningsboog', 'subplot', 'plottwist', 'Nobel literatuurprijs', 'essay', 'poëzie', 'open eind', 'zinsbouw',
    'horror', 'hyperbool', 'column', 'columnist', 'copywriter', 'boekenclub', 'boekenlegger', 'thema', 'alinea',
    'bladwijzer', 'inleiding', 'nawoord', 'register', 'ghostwriter', 'setting', 'beeldspraak', 'uitgeverij',
    'citaat', 'verhaal', 'woordenboek', 'encyclopedie', 'tijdschrift', 'krant', 'bestseller', 'paragraaf',
    'toon', 'literatuur', 'beschrijving', 'prentenboek', 'redacteur', 'auteursrecht', 'luisterboek', 'e-book',
    'context', 'genre', 'limerick', 'manga', 'kinderboek', 'woordenschat', 'woordspeling', 'boekenweek',
    'bijlage', 'bladzijde', 'blokletter', 'boekenbal', 'boekenwurm', 'braille', 'dagblad', 'dichtbundel',
    'versje', 'drukpers', 'roddelpers', 'handboek', 'handleiding', 'handschrift', 'hardcover', 'hiëroglief',
    'spijkerschrift', 'alfabet', 'hoofdpersoon', 'index', 'inhoudsopgave', 'interpunctie', 'kaligrafie',
    'zware kost', 'krachtterm'
  ];

  const kunst = [
    'kleurgebruik', 'kunstcriticus', 'kunstenaar', 'schilder', 'schilderen', 'schilderij', 'zeefdruk',
    'beeldhouwer', 'verfpalet', 'schildersezel', 'kleurpotlood', 'viltstift', 'compositie', 'erfgoed',
    'kunstwerk', 'aquarelverf', 'kwast', 'boetseerklei', 'penseel', 'muurschildering', 'film', 'ets',
    'kunstacademie', 'standbeeld', 'illustrator', 'fotograaf', 'surrealisme', 'realisme', 'voorstelling',
    'schetsboek', 'museumconservator', 'museum', 'galerie', 'theater', 'amfitheater', 'pop-art', 'decor',
    'olieverf', 'mozaïek', 'collage', 'graffiti', 'boetseren', 'abstract', 'origami', 'meme', 'designer',
    'sculptuur', 'portret', 'stilleven', 'schets', 'canvas', 'spuitbus', 'miniatuur', 'danseres', 'drama',
    'Rembrandt', 'Van Gogh', 'Vermeer', 'Mondriaan', 'Picasso', 'Da Vinci', 'ballet', 'choreograaf', 
    'expositie', 'tentoonstelling', 'atelier', 'veilinghuis', 'regisseur', 'keramiek', 'tekening', 'kunstvorm',
    'kunststroming', 'openluchtmuseum', 'fotograferen', 'modeontwerper', 'kubisme', 'première', 'kunstcollectie',
    'meesterwerk', 'zelfportret', 'Banksy', 'M.C. Escher', 'Monet', 'cartoon', 'close-up', 'entertainment',
    'toneelstuk', 'scène', 'eregalerij', 'improvisatie', 'inspiratie'
  ];

  const misdaad = [
    'vliegtuigkaping', 'politie', 'cel', 'dreigement', 'fraude', 'criminoloog', 'achtervolging', 'dader',
    'afpersen', 'kidnappen', 'smokkelen', 'brandstichten', 'cyberpesten', 'vonnis', 'onderwereld', 'aframmeling',
    'intimidatie', 'op de vlucht zijn', 'executie', 'massamoord', 'ramkraak', 'boef', 'celgenoot', 'afrekening',
    'terrorisme', 'zelfmoordaanslag', 'bomaanslag', 'ontvoering', 'plaats delict', 'arrestatieteam', 'aftuigen',
    'cyberaanval', 'corruptie', 'chantage', 'klokkenluider', 'inbreker', 'slavernij', 'verjaring', 'bajesklant',
    'terreurcel', 'dagvaarding', 'radicalisering', 'zwarte markt', 'liquidatie', 'agent in burger', 'bandiet',
    'forensisch onderzoek', 'vergiftiging', 'detective', 'sheriff', 'hoger beroep', 'inbraak', 'inval', 'boete',
    'laster', 'leugendetector', 'handboeien', 'rechercheur', 'politieagent', 'undercover', 'gevangene', 'bekentenis',
    'piraterij', 'gevangenis', 'politiebureau', 'rechtbank', 'hooggerechtshof', 'struikrover', 'maffia', 'bendeleider',
    'zakkenroller', 'oplichter', 'valsmunterij', 'witwassen', 'moord', 'bodycam', 'motief', 'geweld', 'bedreiging',
    'diefstal', 'alibi', 'verdachte', 'aanklacht', 'advocaat', 'celstraf', 'hitman', 'drugsdealer', 'schuilnaam',
    'taakstraf', 'borgsom', 'huiszoeking', 'arrestatie', 'verhoor', 'verduistering', 'huisarrest', 'afluisteren',
    'openbaar ministerie', 'rechtszaak', 'vluchtroute', 'vluchtauto', 'gijzeling', 'schuilplaats', 'slachtoffer',
    'ooggetuige', 'vingerafdruk', 'crimineel', 'harddrugs', 'softdrugs', 'drugskartel', 'smokkelwaar', 'stalking',
    'heling', 'signalement', 'misdrijf', 'misbruik', 'tbs', 'vrijspraak', 'bloedspoor', 'phishing', 'aanrijding',
    'conflict', 'moordwapen', 'seriemoordenaar', 'losgeld', 'enkelband', 'bewijsstuk', 'smaad', 'aanranding', 'lijk',
    'kroongetuige', 'rapporteren', 'identiteitsfraude', 'bankoverval', 'belastingontduiking', 'mensenhandel', 'dief',
    'bekeuring', 'relschopper', 'berechten', 'beroving', 'bestraffen', 'bewaker', 'bewijslast', 'bloedbad', 'gevecht',
    'marteling', 'bommelding', 'cipier', 'commissaris', 'rechter', 'deëscalatie', 'dekmantel', 'doodstraf', 'illegaal',
    'dwangarbeid', 'dwangsom', 'edelachtbare', 'mobiele eenheid', 'strafeis', 'elektrische stoel', 'heler', 'BOA',
    'fouilleren', 'galg', 'gangster', 'gedetineerde', 'vermomming', 'gespuis', 'gratie', 'guillotine', 'handgemeen',
    'handhaver', 'handlanger', 'hechtenis', 'pimp', 'hoorzitting', 'huisvredebreuk', 'huurmoordenaar', 'eerwraak',
    'incident', 'beschuldiging', 'onschuldig', 'stelen', 'pikken', 'jatten', 'inrekenen', 'Interpol', 'isoleercel',
    'HALT', 'joyride', 'junkie', 'wijkagent', 'smeris', 'wout', 'kannibaal', 'kleptomaan', 'kruimeldief',
    'klopjacht', 'knokploeg', 'steekpenning', 'smeergeld', 'omkoping', 'kortgeding', 'kraakpand',
    'internationaal strafrecht'
  ];

  const acties = [
    'applaudisseren', 'fluisteren', 'gebaren', 'gooien', 'graven', 'huppelen', 'rollen', 'ontbijten', 'diëten',
    'klunen', 'knuffelen', 'kruipen', 'schaterlachen', 'aanvallen', 'slapen', 'stomen',  'strijken',
    'lopen', 'maaien', 'naaien', 'omhelzen', 'pesten', 'rennen', 'schreeuwen', 'struikelen', 'stofzuigen', 'kwijlen',
    'vallen', 'vangen', 'verstoppen', 'vliegen', 'vouwen', 'waggelen', 'helpen', 'hijsen', 'pakken', 'afkicken',
    'wiebelen', 'afrekenen', 'afscheid nemen', 'bellen', 'betalen', 'huilen', 'oogsten', 'schuilen', 'kluiven',
    'bewaken', 'blozen', 'branden', 'brengen', 'breken', 'buigen', 'slepen', 'accelereren', 'inzamelen', 'verzamelen',
    'dagdromen', 'delen', 'douchen', 'drinken', 'duwen', 'ademhalen', 'hangen', 'snurken', 'schuiven', 'falen',
    'eten', 'fluiten', 'gapen', 'geven', 'giechelen', 'gillen', 'gluren', 'groeten', 'tikken', 'winnen', 'fokken',
    'inloggen', 'uitloggen', 'inschenken', 'inslapen', 'juichen', 'kijken', 'klagen', 'aankloppen', 'wroeten', 'inzoomen',
    'knipogen', 'kopen', 'leren', 'lezen', 'liegen', 'luisteren', 'trappen', 'opruimen', 'schrijven', 'aanbellen',
    'meten', 'nabootsen', 'nadenken', 'omvallen', 'onderhandelen', 'ophangen', 'opstaan', 'schminken', 'organiseren',
    'plukken', 'praten', 'proberen', 'roepen', 'ruiken', 'ruilen', 'plannen', 'tekenen', 'schelden', 'oplappen', 'kotsen',
    'smeken', 'snijden', 'sparen', 'speuren', 'stoppen', 'verdedigen', 'schudden', 'delegeren', 'openen', 'aanbevelen',
    'strelen', 'studeren', 'telefoneren', 'twijfelen', 'uitleggen', 'uitpakken', 'roken', 'kwetsen', 'corrigeren',
    'verbergen', 'verdwalen', 'vergeten', 'verkopen', 'verliezen', 'verrassen', 'roeren',  'doneren', 'renoveren',
    'verzorgen', 'vluchten', 'volgen', 'wachten', 'wassen', 'weggooien', 'inhalen', 'hakken', 'werken', 'bijwerken',
    'sluipen', 'brandblussen', 'eerste hulp verlenen', 'een geheim bewaren', 'liken', 'repareren', 'dartelen', 'ridderen',
    'misleiden', 'in de rij staan', 'afrijden', 'piekeren', 'overwinnen', 'piepen', 'hinkelen', 'herstellen', 'kwebbelen',
    'haasten', 'vervelen', 'achtervolgen', 'bazelen', 'broeden', 'sleutels verliezen', 'verslikken', 'ploegen', 'zwoegen',
    'bedanken', 'begroeten', 'beschermen', 'bewonderen', 'boeren', 'controleren', 'scheuren', 'zoeken', 'floppen',
    'debatteren', 'flirten', 'herkennen', 'hijgen', 'doorsturen', 'zwaaien', 'zweten', 'fikkie stoken', 'inschrijven',
    'jongleren', 'knijpen', 'krabben', 'kwispelen', 'mompelen', 'ontsnappen', 'plassen', 'zwijgen', 'niezen', 'krijsen',
    'sluimeren', 'snuffelen', 'stampen', 'staren', 'steigeren', 'trillen', 'migreren', 'flossen',
    'wentelen', 'woelen', 'zuchten', 'reizen', 'bewijzen', 'dromen', 'schipbreuk lijden', 'triomferen', 'sissen',
    'herinneren', 'liefhebben', 'oplossen', 'pech hebben', 'teweegbrengen', 'aarzelen', 'takelen', 'oversteken',
    'roddelen', 'rusten', 'vertrouwen', 'markeren', 'imiteren', 'afwachten', 'zingen', 'sms-en', 'veroveren',
    'googelen', 'typen', 'kopiëren', 'plakken', 'opslaan', 'printen', 'uitbuiten', 'zaaien', 'appen', 'filmen',
    'sluiten', 'vergrendelen', 'ontgrendelen', 'instellen', 'bestellen', 'pinnen', 'boren', 'mailen', 'opnemen',
    'bezorgen', 'inpakken', 'sjouwen', 'tillen', 'dragen', 'uitstellen', 'timmeren', 'zagen', 'posten', 'afspelen',
    'spelen', 'stampvoeten', 'opdrukken', 'rekken', 'afwassen', 'confronteren', 'prikken', 'metselen', 'pauzeren',
    'vegen', 'commanderen', 'condoleren', 'feliciteren', 'rijden', 'knagen', 'scoren', 'debuteren', 'kietelen',
    'geruststellen', 'hinderen', 'omkijken', 'troosten', 'vergeven', 'waarschuwen', 'sabbelen', 'dweilen', 'uitgaan',
    'uitnodigen', 'downloaden', 'kleien', 'updaten', 'blaffen', 'grazen', 'grommen', 'kauwen', 'spitten', 'knippen',
    'slikken', 'spugen', 'beslissen', 'fantaseren', 'inbeelden', 'slenteren', 'vlechten', 'logeren', 'protesteren',
    'livestreamen', 'uploaden', 'reflecteren', 'peinzen', 'raden', 'vergelijken', 'voorspellen', 'voordringen',
    'dwarsbomen', 'dwarsliggen', 'ploeteren', 'sjoemelen', 'graaien', 'headbangen', 'heersen', 'herladen', 'tanken',
    'overstappen', 'inleveren', 'inpikken', 'jonassen', 'kapseizen', 'kielhalen', 'klappertanden', 'knarsetanden',
    'knikkebollen', 'kokhalzen', 'afkraken', 'krimpen', 'kwijtraken', 'kwispelen'
  ];

  const emoties = [
    'dolblij', 'tevreden', 'angstig', 'enthousiast', 'opgewonden', 'territoriaal', 'saai', 'haat', 'gek', 'kalm', 'alert', 'gestrest',
    'paniekerig', 'energiek', 'traag', 'actief', 'bescheiden', 'wijs', 'leergierig', 'nieuwsgierig', 'onzeker', 'jaloers', 'gefrustreerd',
    'verdrietig', 'narcistisch', 'geheimzinnig', 'kinds', 'somber', 'teleurgesteld', 'eenzaam', 'verveeld', 'opgelucht', 'trots', 'suf',
    'egoïstisch', 'humaan', 'nostalgisch', 'imperfect', 'wantrouwig', 'achterdochtig', 'hoopvol', 'gespannen', 'schuw', 'logisch', 'dom',
    'sympathiek', 'instinctief', 'nerveus', 'onrustig', 'prikkelbaar', 'uitgeput', 'tam', 'ethisch', 'succesvol', 'immoreel', 'agressief',
    'speels', 'sociaal', 'aanhankelijk', 'onafhankelijk', 'absurd', 'eervol', 'raar', 'kenau', 'gehoorzaam', 'koppig',
    'impulsief', 'voorzichtig', 'minderwaardig', 'opgefokt', 'stoïcijns', 'emotie', 'dominant', 'onderdanig', 'afgeleid', 'doelgericht',
    'hyperactief', 'sceptisch', 'wilskracht', 'boerenlul', 'gangmaker', 'loom', 'passief', 'lui', 'arrogant', 'eerlijk', 'oprecht', 'kattig',
    'bijgelovig', 'dankbaar', 'content', 'machteloos', 'attent', 'hardhandig', 'geliefd', 'optimistisch', 'zelfverzekerd', 'woedend', 'krent',
    'geïrriteerd', 'wanhopig', 'schaamte', 'bang', 'gul', 'autistisch', 'slaperig', 'futloos', 'verward', 'besluiteloos', 'pessimistisch',
    'duidelijk', 'kneuterig', 'atypisch', 'creatief', 'dromerig', 'empathisch', 'zorgzaam', 'afstandelijk', 'onbeleefd', 'boos', 'klungelig',
    'ijverig', 'kritisch', 'behulpzaam', 'perfectionistisch', 'zenuwachtig', 'verrast', 'vrolijk', 'manipulatief', 'gluiperig', 'braaf',
    'verlegen', 'geduldig', 'eigenwijs', 'moedig', 'vergevingsgezind', 'afwezig', 'trendy', 'joviaal', 'gewoon', 'gladjanus', 'vriendelijk',
    'wreed', 'radeloos', 'gastvrij', 'wraakzuchtig', 'hebberig', 'brutaal', 'rationeel', 'ambitieus', 'zorgeloos', 'roekeloos', 'vrijgevig',
    'gierig', 'nonchalant', 'laf', 'fanatiek', 'betrouwbaar', 'onverschillig', 'assertief', 'cynisch', 'verstrooid', 'lafaard', 'verbijsterd',
    'smoorverliefd', 'heimwee', 'ontroerd', 'geschokt', 'materialistisch', 'tegendraads', 'maf', 'subjectief', 'objectief', 'vreemd', 'aardig',
    'schijnheilig', 'zelfbewust', 'mal', 'luiwammes', 'lapzwans', 'viezerik', 'pestkop', 'buitenbeentje', 'nietsnut', 'vreemde vogel', 'kreng',
    'menselijk', 'einzelgänger', 'treiteraar', 'smeerlap', 'huichelaar', 'blaaskaak', 'slijmjurk', 'dwaas', 'sukkel',
    'smeerpoets', 'lolbroek', 'lulhannes', 'betweter', 'wijsneus', 'mierenneuker', 'koekenbakker', 'apart', 'krankzinnig', 'kneus', 'druiloor',
    'hansworst', 'heikneuter', 'zeurkous', 'halvezool', 'flapdrol', 'mafkees', 'vastberaden', 'angsthaas', 'aandachtig', 'aanstellerij', 'trouw',
    'leugenaar', 'aasgier', 'abnormaal', 'achterlijk', 'ad rem', 'gevat', 'afzetter', 'gemeen', 'allemansvriend', 'amateuristisch', 'flapuit',
    'bazig', 'gulzig', 'baldadig', 'bangeschijter', 'barbaars', 'beheerst', 'beïnvloedbaar', 'bekakt', 'deugniet', 'bemoeial', 'berucht', 'fel',
    'beteuterd', 'beunhaas', 'muggenzifter', 'bevlogen', 'bijdehand', 'bofkont', 'casanova', 'charmant', 'chaotisch', 'chic', 'deftig', 'clownesk',
    'dapper', 'depressief', 'droevig', 'doelloos', 'domoor', 'dondersteen', 'doodmoe', 'driftig', 'driftkikker', 'droogkloot', 'droplul', 'hufter',
    'waaghals', 'gewetenloos', 'eigenaardig', 'elegant', 'etterbak', 'introvert', 'flamboyant', 'geestig', 'geinig', 'grappig', 'genadeloos', 'hork',
    'genant', 'gewelddadig', 'goedzak', 'grapjas', 'halvegare', 'hamsteren', 'hardleers', 'heethoofd', 'heldhaftig', 'herrieschopper', 'hielenlikker',
    'huilebalk', 'humeurig', 'hypocriet', 'hysterisch', 'ongelukkig', 'brokkenpiloot', 'idioot', 'ijdeltuit', 'ijzersterk', 'incompetent', 'consequent',
    'intelligent', 'jaknikker', 'jokkebrok', 'liegbeest', 'kinderachtig', 'boerenkinkel', 'klikspaan', 'kluns', 'kortaf', 'kortzichtig', 'koelbloedig',
    'krachtpatser', 'kwaadaardig', 'kwajongen', 'kwiek', 'hebzuchtig', 'laatkomer', 'laconiek'
  ];

  const landen = [
    'Afghanistan', 'Albanië', 'Algerije', 'Argentinië', 'Armenië', 'Australië', 'Azerbeidzjan', 
    'Bahrein', 'Bangladesh', 'Barbados', 'België', 'Bhutan', 'Bolivia', 'Botswana', 'Bosnië-Herzegovina',
    'Brazilië', 'Brunei', 'Bulgarije', 'Cambodja', 'Canada', 'Chili', 'China', 'Colombia', 'Comoren', 
    'Congo', 'Cuba', 'Denemarken', 'Duitsland', 'Ecuador', 'Egypte', 'Ethiopië', 'Fiji', 'Filippijnen',
    'Finland', 'Frankrijk', 'Georgië', 'Ghana', 'Griekenland', 'Guatemala', 'Haïti', 'Honduras',
    'Hongarije', 'Ierland', 'IJsland', 'Indonesië', 'Irak', 'Iran', 'Israël', 'Italië', 'Jamaica',
    'Japan', 'Jemen', 'Jordanië', 'Kazachstan', 'Kenia', 'Kosovo', 'Kroatië', 'Laos', 'Letland',
    'Libanon', 'Liberia', 'Libië', 'Litouwen', 'Luxemburg', 'Maldiven', 'Maleisië', 'Noord-Macedonië',
    'Mali', 'Malta', 'Mexico', 'Moldavië', 'Monaco', 'Mongolië', 'Montenegro', 'Mozambique', 'Myanmar',
    'Namibië', 'Nederland', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Noorwegen', 'Oekraïne', 'Oezbekistan',
    'Oman', 'Oostenrijk', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Polen', 'Portugal', 'Qatar', 'Roemenië',
    'Rusland', 'Rwanda', 'Saudi-Arabië', 'Senegal', 'Servië', 'Singapore', 'Slovenië', 'Soedan', 'Somalië',
    'Spanje', 'Sri Lanka', 'Suriname', 'Syrië', 'Tanzania', 'Thailand', 'Tsjechië', 'Tunesië', 'Turkije', 
    'Uganda', 'Uruguay', 'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe', 'Zweden', 'Zwitserland',
    'Andorra', 'Angola', 'Burkina Faso', 'Costa Rica', 'Cyprus', 'Djibouti', 'Dominicaanse Republiek',
    'El Salvador', 'Eritrea', 'Estland', 'Gambia', 'Guyana', 'Ivoorkust', 'Kameroen', 'Kirgizië', 'Koeweit',
    'Liechtenstein', 'Madagaskar', 'Mauritius', 'Nieuw-Zeeland', 'Noord-Korea', 'Oost-Timor',
    'Papua Nieuw-Guinea', 'San Marino', 'Sierra Leone', 'Taiwan', 'Tadzjikistan', 'Tsjaad', 'Turkmenistan',
    'Vaticaanstad', 'Wit-Rusland', 'Centraal-Afrikaanse Republiek', 'Trinidad en Tobago', 'Kaapverdië',
    'Dominica', 'Palestina', 'Schotland', 'Wales', 'Catalonië', 'Koerdistan', 'Tibet', 'Puerto Rico',
    'Groenland', 'Aruba', 'Curaçao', 'Bermuda', 'Gibraltar', 'Frans-Guyana', 'Tahiti', 'Sint Maarten',
    'Afrika', 'Azië', 'Europa', 'Noord-Amerika', 'Zuid-Amerika', 'Oceanië', 'Himalaya', 'Kaspische Zee',
    'Mississippi', 'Nijl', 'Sahara', 'Thames', 'Corsica', 'Hawaï', 'Kaukasus', 'Sicilië', 'Siberië',
    'poolcirkel'
  ];

  const wetenschap = [
    'paradox', 'pipet', 'algoritme', 'atoom', 'barometer', 'biologie', 'scheikundige', 'schaal van Beaufort',
    'schaal van Richter', 'controlegroep', 'correlatie', 'deeltjesversneller', 'DNA', 'elektriciteit', 'Celsius',
    'ampère', 'elektron', 'element', 'evolutie', 'experiment', 'thermometer', 'CRISPR', 'kwantumcomputer', 'impact',
    'gen', 'genetica', 'geologie', 'golflengte', 'grafiek', 'histogram', 'filosofie', 'chemisch', 'Fahrenheit', 'Kelvin',
    'foutmarge', 'frequentie', 'frictie', 'geigerteller', 'gemiddelde', 'celkern', 'cyclus', 'bevinding', 'computerchip',
    'hologram', 'hypothese', 'implosie', 'infrarood', 'informatica', 'centrifuge', 'contrast', 'chloor', 'windkracht',
    'joule', 'kernfusie', 'kernreactor', 'kilogram', 'robot', 'bunsenbrander', 'analyse', 'logica', 'feit', 'fenomeen',
    'mediaan', 'meting', 'meteorologie', 'meter', 'microbiologie', 'microscoop', 'pesticide', 'meltdown', 'decibel',
    'mitochondriën', 'modus', 'molecuul', 'mutatie', 'mysterie', 'nauwkeurigheid', 'pH-waarde', 'conclusie', 'figuur',
    'natuurkunde', 'neutron', 'observatie', 'ondertoon', 'onderzoeksinstituut', 'oxidatie', 'watt', 'methode', 'wrijving',
    'proton', 'radioactiviteit', 'reactie', 'reageerbuisje', 'chromosoom', 'onderzoek', 'laboratorium', 'chemicus', 'kubus',
    'reductie', 'relatief', 'replica', 'RNA', 'scheikunde', 'spanning', 'straling', 'formule', 'labjas', 'accuraat',
    'spectrum', 'staafdiagram', 'standaard', 'statistiek', 'steekproef', 'stroom', 'laser', 'precies', 'nauwkeurig',
    'supergeleider', 'taartdiagram', 'theorie', 'transistor', 'trilling', 'loep', 'nuance', 'neuron', 'calorieën', 'genie',
    'ultraviolet', 'variabele', 'verbinding', 'vergrootglas', 'weerspiegeling', 'magneet', 'kernenergie', 'chemicaliën',
    'weerstand', 'trendlijn', 'wiskunde', 'zuurgraad', 'laborant', 'toxicoloog', 'wetenschapper', 'metrieke stelsel',
    'tijdperk', 'tijdstip', 'moment', 'periode', 'fase', 'vloeistof', 'kunstmatige intelligentie', 'dichtheid', 'innovatie',
    'effect', 'epicentrum', 'eureka', 'expertise', 'geleerde', 'geluidsbarrière', 'geluidsgolf', 'hertz', 'homogeen',
    'hightech', 'technologie', 'Charles Darwin', 'Isaac Newton', 'Albert Einstein', 'Marie Curie', 'Thomas Edison',
    'Alexander Graham Bell', 'Galileo Galilei', 'Nikola Tesla', 'Stephen Hawking','Plato', 'Socrates', 'incubator',
    'uitvinding', 'middelpuntvliedendekracht', 'kwadraat'
  ];

  const geneeskunde = [
    'placebo', 'acupunctuur', 'ader', 'adrenaline', 'allergie', 'amputatie', 'anesthesie', 'antibiotica', 'autopsie', 'oogkas',
    'bloedarmoede', 'bloeddruk', 'bloedgroep', 'bloedonderzoek', 'claustrofobie', 'coma', 'behandeling', 'beroerte', 'neusholte',
    'defibrillator', 'dementie', 'desinfecteren', 'diagnose', 'dialyse', 'doofstom', 'dwangbuis', 'echo', 'dyslexie', 'diarree',
    'geheugenverlies', 'hallucinatie', 'hartstilstand', 'hersenletsel', 'hersenspoeling', 'besmetting', 'bewusteloos', 'bloedcel',
    'hoogtevrees', 'hormoon', 'hypnose', 'immuunsysteem', 'infectie', 'blind', 'injectie', 'keizersnede', 'dyscalculie', 'immuniteit',
    'obsessie', 'onderbewustzijn', 'operatie', 'overdosis', 'overlevingsdrang', 'pandemie', 'enzym', 'epidemie', 'beademing', 'ADHD',
    'paranoia', 'persoonlijkheid', 'pijnstiller', 'plasma', 'pols', 'psychiatrie', 'ziekte', 'PTSS', 'quarantaine', 'CT-scan', 'donor',
    'röntgenfoto', 'scalpel', 'schizofrenie', 'stethoscoop', 'stigma', 'stoornis', 'doof', 'medicijn', 'migraine', 'slaapapneu', 'fobie',
    'surrogaatmoeder', 'symptoom', 'transplantatie', 'tunnelvisie', 'vaccinatie', 'vaccin', 'homeopathie', 'bacterie', 'eczeem', 'jeuk',
    'fractuur', 'hechting', 'zwelling', 'reanimatie', 'verband', 'narcose', 'long', 'reflex', 'rehabilitatie', 'puistje', 'SOA', 'hartaanval',
    'nier', 'lever', 'alvleesklier', 'galblaas', 'schildklier', 'dikke darm', 'spieren', 'MRI', 'virus', 'kleurenblind', 'wrat', 'gewricht',
    'chemotherapie', 'prothese', 'pacemaker', 'bloedsuiker', 'cholesterol', 'botten', 'ontsteking', 'ziekenhuis', 'ruggengraat', 'facelift',
    'litteken', 'tumor', 'leukemie', 'diabetes', 'astma', 'reuma', 'alzheimer', 'medicatie', 'aspirientje', 'gewond',
    'parkinson', 'burnout', 'bipolaire', 'anorexia', 'obesitas', 'hartslag', 'bloedvat', 'zenuwstelsel', 'orgaandonatie', 'verziend', 'hasj',
    'chirurg', 'verzorger', 'dermatoloog', 'hersenchirurg', 'gynaecoloog', 'EHBO-kit', 'apotheker', 'cardioloog', 'griep', 'implantaat',
    'kinderarts', 'neuroloog', 'radioloog', 'psycholoog', 'orthopeed', 'revalidatiearts', 'farmaceut', 'fysiotherapeut', 'bijziend', 'koorts',
    'hypnotherapeut', 'dokter', 'therapeut', 'vroedvrouw', 'zorgverlener', 'oogarts', 'huisarts', 'psychiater', 'ruggenmerg', 'brandwond',
    'chiropractor', 'blindedarmontsteking', 'nierstenen', 'spatader', 'oorsuizen', 'longontsteking', 'lichaam', 'navelstreng', 'botbreuk',
    'bloedlichaampje', 'skelet', 'bloedsomloop', 'schaamhaar', 'nagelriem', 'vingerkootje', 'telefoonbotje', 'bestraling', 'blauwe plek',
    'hamstringblessure', 'scheurbuik', 'aambei', 'alcoholisme', 'anaal', 'oraal', 'anticonceptie', 'beugel', 'bijsluiter', 'brancard',
    'cafeïne', 'cocaïne', 'heroïne', 'morfine', 'cannabis', 'capsule', 'maandverband', 'darmflora', 'embryo', 'doodziek', 'draagmoeder',
    'verslaving', 'epilepsie', 'erfelijk', 'euthanasie', 'fentanyl', 'flauwvallen', 'foetus', 'geneesmiddel', 'griepprik', 'zwangerschap',
    'hartmassage', 'patiënt', 'hartritmestoornis', 'hazenlip', 'hernia', 'hoestdrank', 'hondsdolheid', 'hoofdpijn', 'impotent', 'incisie',
    'incubatietijd', 'inenting', 'infuus', 'ingewanden', 'insuline', 'inteelt', 'intensive care', 'invalide', 'jicht', 'jodium', 'kramp',
    'kadaver', 'kalknagel', 'kuur', 'misselijk', 'kraambed', 'kreupel', 'kriebelhoest', 'kritieke toestand', 'kunstgebit', 'kunstheup',
    'kwaal', 'kwakzalver', 'waanbeeld', 'lachgas'
  ];

  const politiek = [
    'anarchie', 'democratie', 'dictatuur', 'fascisme', 'imperialisme', 'nationalisme', 'kamerlid', 'diplomatie', 'bureaucratie',
    'revolutie', 'staking', 'volksopstand', 'vluchteling', 'sancties', 'schandaal', 'wethouder', 'legitimiteit', 'avondklok',
    'censuur', 'crisis', 'oligarchie', 'soevereiniteit', 'vetorecht', 'xenofobie', 'gemeenteraad', 'belasting', 'lobby',
    'dilemma', 'discriminatie', 'erfenis', 'stakingsrecht', 'fractie', 'beschaving', 'vergunning', 'bankwezen', 'statiegeld',
    'globalisering', 'herverdeling', 'migratie', 'lockdown', 'recessie', 'referendum', 'integratie', 'asielzoeker', 'feminisme',
    'monopolie', 'nepnieuws', 'onteigening', 'polarisatie', 'populisme', 'propaganda', 'rente', 'statushouder', 'mening',
    'coalitie', 'oppositie', 'verkiezingen', 'stemmen', 'verkiezingscampagne', 'vlag', 'EU', 'zetel', 'uitzetting', 'adel',
    'minister', 'staatssecretaris', 'premier', 'president', 'koning', 'parlement', 'traditie', 'paspoort', 'douane', 'boycot',
    'senaat', 'grondwet', 'wet', 'amendement', 'motie', 'debat', 'nieuws', 'solidariteit', 'Tweede Kamer', 'Eerste Kamer', 
    'beleid', 'maatregel', 'subsidie', 'bezuiniging', 'begroting', 'nationalisatie', 'NAVO', 'belastingdienst', 'armoede',
    'ambassade', 'ambassadeur', 'staatshoofd', 'topontmoeting', 'vredesakkoord', 'hiërarchie', 'sociale zekerheid', 'activist',
    'resolutie', 'handelsoorlog', 'mensenrechten', 'vrijheid van meningsuiting', 'persvrijheid', 'werkloosheid', 'cryptocurrency',
    'welvaart', 'stembureau', 'kiesdrempel', 'lijsttrekker', 'kandidaat', 'voorzitter', 'stemmen ronselen', 'argument',
    'partijprogramma', 'coalitieakkoord', 'informateur', 'formateur', 'woningmarkt', 'VN', 'wetsvoorstel', 'persconferentie',
    'belastingaangifte', 'toeslagen', 'uitkering', 'pensioen', 'privatisering', 'kabinetsformatie', 'bevolking', 'spotprent',
    'minimumloon', 'CAO', 'vakbond', 'stemhokje', 'beurskrach', 'exportproduct', 'fiscus', 'huwelijk', 'identiteitsbewijs',
    'petitie', 'demonstratie', 'burgerrechten', 'grondrechten', 'privacywet', 'gelijkheid', 'kieslijst', 'prinsjesdag', 'stichting',
    'desinformatie', 'transparantie', 'integriteit', 'gedragscode', 'pressiegroep', 'plagiaat', 'miljoenennota', 'verdrag',
    'denktank', 'adviesraad', 'raad van state', 'nationale ombudsman', 'rekenkamer', 'hoge raad', 'troonrede', 'vice-premier',
    'arbitrage', 'mediation', 'raadslid', 'gedeputeerde',
    'scheiding der machten', 'stemrecht', 'rechtsstaat', 'staatsschuld', 'BTW', 'compromis', 'keizer',
    'vermogensbelasting', 'accijns', 'handelsakkoord', 'handelspartner', 'stelling', 'autonoom', 'inkomstenbelasting', 'complot',
    'gezondheidszorg', 'pensioenstelsel', 'politieke partij', 'handelsverdrag', 'demissionair kabinet', 'volksgezondheid',
    'partijcongres', 'kabinet', 'minderheidskabinet', 'pensioenfonds', 'concurrentie', 'generatie', 'generatiekloof', 'dialect',
    'ministerie', 'kamerdebat', 'fractieleider', 'provinciebestuur', 'kabinetscrisis', 'motie van wantrouwen', 'conservatief',
    'progressief', 'cultuur', 'inflatie', 'deflatie', 'draagvlak', 'dunbevolkt', 'economie', 'emancipatie', 'etiquette',
    'kindertelefoon', 'kolonie', 'koopkracht'
  ];

  const muziek = [
    'gitaar', 'basgitaar', 'elektrische gitaar', 'ukelele', 'luit', 'sitar', 'trompet', 'trombone', 'bovenstem', 'canon',
    'saxofoon', 'klarinet', 'fluit', 'dwarsfluit', 'blokfluit', 'harp', 'tuba', 'hoorn', 'contrabas', 'banjo', 'keyboard',
    'fagot', 'hobo', 'didgeridoo', 'piano', 'vleugel', 'elpee', 'royalties', 'orgelpijp', 'accordeon', 'synthesizer', 'intro',
    'microfoon', 'luidspreker', 'versterker', 'mengpaneel', 'grammofoon', 'grunge', 'cassette', 'soul', 'playlist', 'album',
    'platenspeler', 'koptelefoon', 'muziekdoos', 'notenbalk', 'hardrock', 'koor', 'trommel', 'xylofoon', 'Spotify', 'indie',
    'achtergrondmuziek', 'orkest', 'symfonie', 'opera', 'jazz', 'albumhoes', 'heavy metal', 'conservatorium', 'blues', 'rock',
    'reggae', 'volkszanger', 'punk', 'metal', 'elektronische muziek', 'muziekvideo', 'soundtrack', 'rap', 'hiphop', 'klassiek',
    'akkoord', 'melodie', 'ritme', 'beat', 'refrein', 'solo', 'altviool', 'platenlabel', 'akoestisch', 'componeren', 'r&b',
    'concert', 'festival', 'repetitie', 'songtekst', 'opname', 'live optreden', 'muziekschool', 'koorlid', 'mondharmonica',
    'operazanger', 'componist', 'gitarist', 'drummer', 'pianist', 'violist', 'single', 'geluidsinstallatie', 'tamboerijn',
    'kapelmeester', 'bandlid', 'producer', 'pianospelen', 'djembé', 'dirigent', 'dj', 'cello', 'optreden', 'country', 'gospel',
    'disco', 'techno', 'house', 'trance', 'drum and bass', 'tenor', 'sopraan', 'cd', 'latin', 'afrobeat', 'musicus',
    'toonladder', 'muzieknoot', 'maat', 'tempo', 'dynamiek', 'podium', 'soundcheck', 'zanger', 'bongo', 'alt', 'pop', 'hardcore',
    'octaaf', 'interval', 'crescendo', 'panfluit', 'doedelzak', 'groupie', 'coverband', 'kazoo', 'songwriter', 'geluidstechnicus',
    'strijkorkest', 'fanfare', 'jazzband', 'rockband', 'liveband', 'remix', 'mashup', 'sample', 'popgroep', 'duo', 'trio',
    'openluchtconcert', 'jamsessie', 'nachtclub', 'trekharmonica', 'samba', 'rumba', 'tourmanager', 'koorzanger', 'drumstel',
    'operahuis', 'concertgebouw', 'festivalterrein', 'backstage', 'strijkkwartet', 'tango', 'viool', 'muziekzaal', 'gitaarsolo',
    'volkslied', 'kinderlied', 'slaapliedje', 'kerstlied', 'serenade', 'wals', 'polka', 'kwartet', 'solist', 'plectrum', 'jukebox',
    'turntable', 'autotune', 'cha-cha-cha', 'foxtrot', 'quickstep', 'slowfox', 'neuriën', 'deuntje', 'stemvork', 'instrument',
    'chanson', 'couplet', 'duet', 'evergreen', 'hit', 'hitlijst', 'hoempamuziek', 'carnavalsmuziek', 'jingle', 'jodelen',
    'kerkkoor', 'klank'
  ];

  const kleding = [
    'armband', 'avondjurk', 'handtas', 'horloge', 'halsketting', 'badjas', 'pyjama', 'koffer', 'kroon', 'maillot',
    'naaldhak', 'reddingsvest', 'regenjas', 'spijkerbroek', 'muts', 'poncho', 'cape', 'masker', 'rugzak', 'ochtendjas', 'shirt',
    'zonnebril', 'kleerhanger', 'boodschappentas', 'hoed', 'bontjas', 'riem', 'schoenen', 'stropdas', 'sjaal', 'mouw', 'halsband',
    'handschoenen', 'pet', 'bril', 'vest', 'trui', 'heuptas', 'sneaker', 'jurk', 'polo', 'wandelstok', 'sandalen', 'tuinbroek', 
    'rits', 'gesp', 'camouflage', 'helm', 'uniform', 'bodywarmer', 'blouse', 'rok', 'colbert', 'pak', 'smoking', 'japon',
    'sokken', 'ondergoed', 'beha', 'bikini', 'laarzen', 'legging', 'tanktop', 'longsleeve', 'oorbel', 'trouwring', 'vlinderdas',
    'wanten', 'baret', 'tulband', 'haarband', 'haarspeld', 'sleutelhanger', 'badpak', 'zwembroek', 'minirok', 'mode',
    'beenwarmers', 'slippers', 'zonneklep', 'portemonnee', 'piercing', 'bretels', 'polsband', 'pantoffels', 'broekzak', 'diadeem',
    'coltrui', 'overhemd', 'hoodie', 'sweater', 'joggingbroek', 'hemd', 'korset', 'motorpak', 'jumpsuit', 'kousen', 'blinddoek',
    'panty', 'klompen', 'veters', 'bomberjack', 'garderobe', 'laptoptas', 'wetsuit', 'trainingspak', 'broekspijp', 'boxershort',
    'hardloopschoenen', 'instappers', 'snowboots', 'capuchon', 'toga', 'accesoire', 'bandana', 'mijter', 'bivakmuts', 'decolleté',
    'fluweel', 'zijde', 'katoen', 'nylon', 'wol', 'leer', 'lingerie', 'pruik', 'hijab', 'niqab', 'boerka', 'hoofddeksel', 'kimono',
    'indianentooi', 'houwtje-touwtjejas', 'bagage', 'handbagage', 'inlegzool', 'schort', 'jeans', 'kaplaars', 'kniekous', 'label'
  ];

  const militair = [
    'soldaat', 'generaal', 'luitenant', 'sergeant', 'korporaal', 'officier', 'genocide', 'overwinning', 'nederlaag', 'cadet', 'deserteur',
    'commandant', 'ridder', 'sluipschutter', 'marinier', 'luchtmachtpiloot', 'onderofficier', 'bondgenoot', 'blitzkrieg', 'commando',
    'bunker', 'fort', 'arsenaal', 'bewapenen', 'harnas', 'barak', 'bevel', 'konvooi', 'schild', 'gasmasker', 'bestorming', 'conscriptie',
    'morse', 'kompas', 'bevrijding', 'blokkade', 'pantservoertuig', 'onderzeeboot', 'vliegdekschip', 'oorlogsschip', 'insigne',
    'commandopost', 'militaire basis', 'loopgraaf', 'mijnenveld', 'patrouilleboot', 'schieten', 'wapenwedloop', 'leger', 'gevechtspauze',
    'invasie', 'guerrillaoorlog', 'coup', 'oorlogsmisdaad', 'wapenhandel', 'burgerwacht', 'agressor', 'militaire oefening', 'oorlog',
    'belegering', 'geheime operatie', 'spionage', 'sabotage', 'capitulatie', 'wapenstilstand', 'tribunaal', 'krijgsmacht', 'evacuatie',
    'kogelvrij vest', 'parachute', 'radarscherm', 'infanterie', 'cavalerie', 'artillerie', 'marine', 'verrekijker', 'pantserdivisie',
    'luchtmacht', 'landmacht', 'parachutist', 'verkenner', 'nachtkijker', 'majoor', 'kolonel', 'admiraal', 'interbellum', 'krijger',
    'veldslag', 'hinderlaag', 'frontlinie', 'gevechtshelikopter', 'achterhoede', 'vliegbasis', 'militaire begraafplaats', 'marinebasis',
    'grenspost', 'checkpoint', 'mijnenveger', 'verkenningsvliegtuig', 'bommenwerper', 'jachtvliegtuig', 'strijd', 'flank', 'fusilleren',
    'raketschild', 'luchtafweer', 'radar', 'sonar', 'gevaarlijk', 'gevechtsvliegtuig', 'luchtaanval', 'wapenopslag', 'munitiedepot',
    'schietbaan', 'hindernisbaan', 'grenscontrole', 'saluut', 'wachtpost', 'noodrantsoen', 'veldfles', 'brigade', 'defensie', 'jerrycan',
    'kaartlezen', 'bombardement', 'veiligheidszone', 'bufferzones', 'neutrale zone', 'demilitarisatie', 'vredesmissie', 'VN-missie',
    'alliantie', 'bezetting', 'vaandel', 'rang', 'staatsgreep', 'veldtent', 'veldhospitaal', 'embargo', 'oorlogsverklaring', 'mobilisatie',
    'dienstplicht', 'huurling', 'militie', 'landkaart', 'reservist', 'veteraan', 'krijgsgevangene', 'onderscheiding', 'verdedigingslinie',
    'terugtrekken', 'herdenkingsmonument', 'militaire parade', 'militaire politie', 'beschietingen', 'Harley Davidson', 'concentratiekamp',
    'inlichtingendienst', 'geheime dienst', 'wapenuitrusting', 'jeep', 'scherpschutter', 'bomopruimer', 'overgave', 'interventie',
    'dubbelspion', 'grondtroepen', 'infiltrant', 'informant', 'kamikaze', 'strafkamp'
  ];

  const wapens = [
    'boksbeugel', 'geweer', 'pistool', 'machinegeweer', 'bazooka', 'granaatwerper', 'mortier', 'bom', 'kanon',
    'atoombom', 'handgranaat', 'landmijn', 'torpedo', 'explosief', 'kanonskogel', 'zwaard', 'speer', 'drietand',
    'lans', 'bajonet', 'harpoen', 'pijl-en-boog', 'kruisboog', 'katapult', 'handwapen', 'afweergeschut', 'munitie',
    'antitankwapen', 'tank', 'revolver', 'jachtgeweer', 'mitrailleur', 'uzi', 'kalasjnikov', 'taser', 'dynamiet',
    'molotovcocktail', 'tijdbom', 'dolk', 'stiletto', 'machete', 'katana', 'gummiknuppel', 'nunchucks', 'werpster',
    'boomerang', 'traangas', 'mosterdgas', 'pepperspray', 'vlammenwerper', 'stormram', 'zakmes', 'luchtbuks',
    'shotgun', 'sniper', 'vlindermes', 'waterkanon', 'blaaspijp', 'knots', 'kruisraket', 'wapenstok', 'bombrief',
    'degen', 'geschut', 'handboog', 'hellebaard', 'holster', 'kogel', 'patroon', 'huls', 'magnum', 'desert eagle',
    '9mm', 'ar-15', 'ak-47', 'tommy gun', 'kaliber', 'strijdbijl', 'sabel', 'kromzwaard', 'vuurwerk'
  ];


  const gereedschap = [
    'hamer', 'schaar', 'moersleutel', 'zaag', 'beitel', 'hakselaar', 'kniptang', 'krabber',
    'hooivork', 'hark', 'gieter', 'borstel', 'ladder', 'moker', 'kettingzaag', 'naaimachine',
    'stroomgenerator', 'windturbine', 'dynamo', 'waterpas', 'boormachine', 'lasbril', 'heipaal',
    'spijker', 'smeedijzer', 'telraam', 'betonmixer', 'touwladder', 'zeis', 'aambeeld', 'hoogwerker',
    'klem', 'verlengsnoer', 'pomp', 'kabel', 'snoer', 'zekering', 'pikhouweel', 'schroevendraaier',
    'waterpomptang', 'steeksleutel', 'inbussleutel', 'schaaf', 'vijl', 'klinknagel',
    'handzaag', 'figuurzaag', 'cirkelzaag', 'schuurmachine', 'decoupeerzaag', 'prikpen',
    'handboor', 'lasapparaat', 'soldeerbout', 'heteluchtpistool', 'schroef', 'gradenboog', 'ijzerdraad',
    'bout', 'moer', 'plug', 'haak', 'kram', 'schoffel', 'bladblazer', 'tuinschep', 'stofopvangzak',
    'kittpistool', 'lijmpistool', 'lijmklem', 'bankschroef', 'werkbank', 'luchtcompressor',
    'veiligheidshelm', 'veiligheidsbril', 'werkhandschoenen', 'stofmasker', 'cementmolen', 'meetlint',
    'kruiwagen', 'hefboom', 'katrol', 'handkar', 'palletwagen', 'grasmaaier', 'plamuurmes', 'roerder',
    'hijsband', 'touw', 'steiger', 'koevoet', 'breekijzer', 'schuurpapier', 'graafmachine', 
    'freesmachine', 'stanleymes', 'dieptemeter', 'kniebeschermer', 'werktafel', 'lijmspuit',
    'verfroller', 'verfblik', 'afplaktape', 'kit', 'siliconekit', 'stoommachine', 'nijptang', 'zaagblad',
    'purschuim', 'isolatiemateriaal', 'ducttape', 'perslucht', 'heggenschaar', 'hijskraan', 'koord',
    'compressor', 'spijkerpistool', 'houtlijm', 'gereedschapskist', 'verfspuit', 'gehoorbescherming',
    'verfafbijter', 'ontvetter', 'ontroesters', 'beschermkapjes', 'sloopkogel', 'gasbrander'
  ];

  const ruimte = [
    'astronaut', 'ruimtevaart', 'raket', 'space shuttle', 'ruimtepak', 'sterrenstof', 'implosie', 'kosmos',
    'maanlanding', 'vliegende schotel', 'satelliet', 'telescoop', 'sterrenwacht', 'ruimtestation', 'ruimtereis',
    'planeet', 'komeet', 'ruimte', 'melkweg', 'zwart gat', 'supernova', 'lanceerplatform', 'maan', 'raketlancering',
    'sterrenstelsel', 'meteoor', 'meteoriet', 'Mars', 'Venus', 'Jupiter', 'Saturnus', 'zon', 'ster', 'sterrenhemel',
    'Mercurius', 'Neptunus', 'Uranus', 'noorderlicht', 'maansverduistering', 'ruimtesonde', 'sterrenbeeld', 'vacuüm',
    'eclips', 'zwaartekracht', 'dampkring', 'astronomie', 'buitenaards leven', 'maanwandeling', 'Grote Beer', 'gaswolk',
    'ISS', 'seconde', 'Pluto', 'big bang', 'heelal', 'asteroïde', 'komeetstaart', 'meteorenregen', 'zonnewind', 'krater',
    'zuurstoftank', 'landingsgestel', 'lanceerinstallatie', 'CO2-filter', 'maanmissie', 'ruimtewandeling', 'zonnepanelen',
    'NASA', 'lichtjaar', 'lichtsnelheid', 'sterrenkunde', 'planetarium', 'vallende ster', 'ruimtecapsule', 'universum',
    'relativiteitstheorie', 'botsende sterrenstelsels', 'gewichtloosheid', 'Houston', 'ruimtepuin', 'atmosfeer',
    'gasreuzen', 'planetenring', 'alien', 'ufo', 'moederschip', 'Hubble', 'James Webb', 'docking', 'Kleine Beer',
    'magnetische pool', 'poolster', 'evenaar', 'landing op de maan', 'Apollo', 'SpaceX', 'hemellichaam', 'Tweelingen',
    'commerciële ruimtevaart', 'marsrover', 'Voyager', 'kosmonaut', 'luchtsluis', 'koppelingssysteem', 'Maagd', 'Waterman',
    'oerknal', 'hitteschild', 'stratosfeer', 'magnetisch veld', 'ruimteschip', 'interstellair'
  ];

  const huishouden = [
    'beker' , 'wijnglas', 'bezem', 'stofzuiger', 'wasrek', 'toiletborstel', 'afwasborstel', 'wasmachine',
    'deurbel', 'rolluik', 'vloerkleed', 'gloeilamp', 'wekker', 'gordijn', 'tuintafel', 'theemuts', 'gazon',
    'klok', 'boekenkast', 'tafel', 'stoel', 'bankstel', 'behang', 'deurmat', 'douchegordijn', 'stof', 'kussentje',
    'wasmand', 'prullenbak', 'schoonmaakmiddel', 'smartphone', 'smartwatch', 'handdoek', 'soapserie',
    'zeep', 'shampoo', 'conditioner', 'scheerapparaat', 'haarborstel', 'toiletpapier', 'kachel', 'kleingeld', 'krultang',
    'deken', 'laken', 'kussensloop', 'matras', 'nachtkastje', 'kledingkast', 'tuinslang', 'tuinstoel', 'pinpas', 'gel',
    'strijkijzer', 'strijkplank', 'dweil', 'stoffer en blik', 'bloempot', 'vaas', 'fotolijst', 'douchekop', 'doos',
    'theepot', 'koffiepot', 'broodtrommel', 'koektrommel', 'stofdoek', 'mop', 'emmer', 'allesreiniger', 'rekening',
    'schuurspons', 'vaatwasser', 'wasmiddel', 'wasverzachter', 'bijzettafel', 'batterij', 'parasol', 'kassabon',
    'salontafel', 'tv-meubel', 'dressoir', 'kapstok', 'fotoalbum', 'plantenbak', 'spaargeld', 'kattenluik', 'keukentrap',
    'schoenenrek', 'sprinkler', 'plantenspuit', 'toilettas', 'zeeppomp', 'krat', 'fruitschaal', 'blik', 'hypotheek',
    'vuilniszak', 'vuilnisbak', 'afvalcontainer', 'papierbak', 'glasbak', 'gft-bak', 'deurklink', 'camera', 'burenruzie',
    'plafondlamp', 'spotje', 'antislipmat', 'vloerbedekking', 'asbak', 'afstandsbediening', 'koelkast', 'verjaardag',
    'parket', 'laminaat', 'tegels', 'nagelvijl', 'pincet', 'bloemperk', 'tuinverlichting', 'vriezer', 'zorgverzekering',
    'tuinhek', 'tuinpad', 'vliegenwering', 'vogelbadje', 'vogelhuisje', 'schutting', 'breinaald', 'serre', 'achterdeur',
    'vogelvoer', 'tuinaarde', 'badkuip', 'douche', 'toilet', 'radiator', 'thermostaatknop', 'fles', 'tablet', 'achterom',
    'rookmelder', 'brievenbus', 'buitenlamp', 'wandspiegel', 'washandje', 'badkamerspiegel', 'antenne', 'aanbouw',
    'antiek', 'ballon', 'balustrade', 'lampion', 'kaars', 'computer', 'dakpan', 'bierglas', 'dekbed', 'vliegenmepper',
    'fakkel', 'föhn', 'hangmat', 'ijsklontjesmaker', 'pakketje', 'oplader', 'cadeau', 'zolder', 'adres', 'televisie',
    'megafoon', 'neonlamp', 'paraplu', 'lichtschakelaar', 'spelcomputer', 'aansteker', 'ventilator', 'kelder', 'bidet',
    'spaarpot', 'wiel', 'rubberen eend', 'scheermes', 'tandenstoker', 'harde schijf', 'powerbank', 'schuifdeur', 'visite',
    'schommel', 'speelgoed', 'zonnewijzer', 'tandenborstel', 'tandpasta', 'tent', 'kalender', 'open haard', 'dakgoot',
    'knuffelbeer', 'bellenblaas', 'trechter', 'theeglas', 'lampenkap', 'brandblusser', 'tafelkleed', 'schoorsteen',
    'dvd', 'blu-ray', 'lenzen', 'gehoorapparaat', 'kruk', 'tuinkabouter', 'fietspomp', 'wasknijper', 'plafond',
    'kaasschaaf', 'zonnescherm', 'vouwstoel', 'campingstoel', 'stekker', 'kruik', 'spons', 'zaklamp', 'trappenhuis',
    'airco', 'cv-ketel', 'warmtepomp', 'luxaflex', 'bezemkast', 'dakraam', 'balkon', 'terras', 'gevel', 'beeldscherm',
    'bluetooth', 'wifi', 'glasvezel', 'tweeling', 'schoonmoeder', 'stiefvader', 'weduwe', 'bruidegom', 'inboedel',
    'verloofde', 'echtgenoot', 'peetoom', 'kleindochter', 'betovergrootmoeder', 'boodschappen', 'deodorant', 'parfum',
    'deurbelcamera', 'dienblad', 'doe-het-zelven', 'vaatdoek', 'erf', 'erfstuk', 'façade', 'familielid', 'kozijn',
    'inrichting', 'interieur', 'plumeau', 'jacuzzi', 'kerstversiering', 'kortsluiting', 'krabpaal'
  ];

  const kantoor = [
    'arbeidsongeschikt', 'nietmachine', 'rekenmachine', 'Post-it',  'agenda', 'aktetas', 'perforator', 'paperclip', 'poster',
    'usb-stick', 'printer', 'projector', 'scanner', 'headset', 'webcam', 'bureau', 'bureaustoel', 'directie', 'laptop', 'folder',
    'whiteboard', 'vergadertafel', 'vergaderzaal', 'ordner', 'map', 'envelop', 'brief', 'briefopener', 'HR', 'expert', 'lening',
    'waterkoeler', 'toetsenbord', 'muis', 'plakband', 'balpen', 'marker', 'prikbord', 'visitekaartje', 'memo', 'hondenbaan', 'jargon',
    'postvak', 'factuur', 'offerte', 'contract', 'notulen', 'presentatie', 'koffiezetapparaat', 'administratie', 'carpoolen',
    'vergadering', 'evaluatie', 'kantine', 'kopieerapparaat', 'archief', 'papier', 'pen', 'potlood', 'samenwerken', 'declareren',
    'punaise', 'elastiekje', 'notitieblok', 'shredder', 'postzegel', 'inktcartridge', 'spreadsheet', 'kwartaal', 'feedback', 'catering',
    'flexwerk', 'collega', 'baas', 'kantoorpand', 'thuiswerken', 'loonstrook', 'verlof', 'arbeid', 'netwerken', 'jaarverslag', 'carrière',
    'reiskosten', 'project', 'checklist', 'functie', 'promotie', 'opslag', 'ontslag', 'werkgever', 'LinkedIn', 'kostenpost', 'loopbaan',
    'werknemer', 'brainstorm', 'sollicitatie', 'teambuilding', 'bedrijfsuitje', 'software', 'bedrijf', 'dochteronderneming', 'document',
    'directeur', 'manager', 'secretaresse', 'stagiair', 'teamleider', 'teamlid', 'leidinggevende', 'boekhouder', 'aandelen', 'cliënt',
    'accountant', 'muismat', 'laserpointer', 'bureaulamp', 'Excel', 'Powerpoint', 'intranet', 'cloud', 'afdeling', 'audit', 'organisatie',
    'overuren', 'ziekteverzuim', 'arbo', 'budget', 'omzet', 'winst', 'klandizie', 'leverancier', 'e-mail', 'belegging', 'branche', 'salaris',
    'vacature', 'deadline', 'receptie', 'koffiepauze', 'lunchpauze', 'handtekening', 'bedrijfswagen', 'leasebak', 'consument', 'ideeënbus',
    'dividend', 'faillissement', 'incasso', 'concept', 'internet', 'website', 'wachtwoord', 'gebruikersnaam', 'account', 'jubileum',
    'portfolio', 'profiel', 'database', 'zoekmachine', 'pixel', 'bestand', 'notificatie', 'abonnement', 'vrijmibo', 'dienstverlening',
    'woon-werkverkeer', 'eigenaar', 'ervaring', 'filiaal', 'firma', 'franchise', 'freelance', 'fusie', 'hongerloontje', 'hoofdkantoor',
    'inkomen', 'intakegesprek', 'interview', 'joint venture', 'kerstpakket', 'krediet'
  ];

  const spreekwoorden = [
    'alle hens aan dek!',
    'als de kat van huis is, dansen de muizen',
    'in de hoek zitten waar de slagen vallen',
    'een kat in het nauw maakt rare sprongen',
    'wie de jeugd heeft, heeft de toekomst',
    'zich voor het karretje laten spannen',
    'het schiet niet op',
    'stad en land aflopen',
    'er is met hem geen land te bezeilen',
    'aan lagerwal raken',
    'het op iemand gemunt hebben',
    'iemand de volle laag geven',
    'hoogmoed komt voor de val',
    'zich achter de oren krabben',
    'op de klippen lopen',
    'de klant is koning',
    'iets in de kiem smoren',
    'iets op je kerfstok hebben',
    'ons kent ons',
    'soort zoekt soort',
    'elkaar langer dan vandaag kennen',
    'buiten kennis raken',
    'de kar trekken',
    'een kink in de kabel',
    'het kaf van de koren scheiden',
    'ergens kaas van hebben gegeten',
    'zich de kaas van het brood laten eten',
    'iemand de laan uitsturen',
    'iets dat krom is, recht praten',
    'dweilen met de kraan open',
    'ergens een kei in zijn',
    'met Sint Juttemis',
    'Joost mag het weten',
    'beter iets dan niets',
    'in het hol van de leeuw',
    'het hazenpad kiezen',
    'tuig van de richel',
    'naar de filistijnen',
    'het deksel op je neus krijgen',
    'een boekje opendoen over iets',
    'je boekje te buiten gaan',
    'iemand op heterdaad betrappen',
    'als puntje bij paaltje komt',
    'als sneeuw voor de zon verdwijnen',
    'het verstand komt met de jaren',
    'in nog geen honderd jaar',
    'met losse flodders schieten',
    'iemand aan de tand voelen',
    'aan de bel trekken',
    'waar gehakt wordt, vallen spaanders',
    'tegen de lamp lopen',
    'niet zonder slag of stoot',
    'waar een wil is, is een weg',
    'van twee walletjes eten',
    'veel in je mars hebben',
    'tussen neus en lippen door',
    'uit de bocht vliegen',
    'de lakens uitdelen',
    'met man en macht',
    'niet voor één gat te vangen zijn',
    'als een donderslag bij heldere hemel',
    'iets dubbel en dwars verdienen',
    'krap bij kas zitten',
    'je kont niet kunnen keren',
    'op je kont liggen',
    'geen duimbreed wijken',
    'van heinde en verre',
    'op rozen zitten',
    'op stelten zetten',
    'over de brug komen',
    'overstag gaan',
    'spijkers op laag water zoeken',
    'het loodje leggen',
    'het onderspit delven',
    'het tij doen keren',
    'iemand de les lezen',
    'iemand de oren wassen',
    'iemand op de hielen zitten',
    'iemand voor het blok zetten',
    'iemand zand in de ogen strooien',
    'in goede aarde vallen',
    'in het diepe springen',
    'in iemands vaarwater zitten',
    'iemand in de kaart spelen',
    'iemand in de kaart kijken',
    'je kaarten op tafel leggen',
    'open kaart spelen',
    'van de kaart zijn',
    'iets onder de knie hebben',
    'met knikkende knieën',
    'zand erover',
    'kwaliteit over kwantiteit',
    'je licht ergens over laten schijnen',
    'de moed zakt je in de schoenen',
    'naast je schoenen lopen',
    'in andermans schoenen staan',
    'de onderste steen boven halen',
    'de schaapjes op het droge hebben',
    'de spijker op zijn kop slaan',
    'de vinger op de zere plek leggen',
    'je kop in het zand steken',
    'de zaak op scherp zetten',
    'door het lint gaan',
    'een duit in het zakje doen',
    'een frisse neus halen',
    'er een stokje voor steken',
    'aan het langste eind trekken',
    'kleur bekennen',
    'bij de pakken neerzitten',
    'de angel eruit halen',
    'de boel de boel laten',
    'de draad weer oppakken',
    'de geest is uit de fles',
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
    'een oogje dichtknijpen',
    'een storm in een glas water',
    'eerlijkheid duurt het langst',
    'eerst zien dan geloven',
    'er de brui aan geven',
    'er een eind aan breien',
    'het kind met het badwater weggooien',
    'een kind kan de was doen',
    'een ondergeschoven kind',
    'geen kind aan iemand hebben',
    'ergens kind aan huis zijn',
    'het beestje bij de naam noemen',
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
    '1 april kikker in je bil',
    'een koele kikker',
    'je huid duur verkopen',
    'iemand de huid volschelden',
    'een dikke huid hebben',
    'met huid en haar',
    'de huid verkopen voor de beer geschoten is',
    'in iemands huid kruipen',
    'in je schulp kruipen',
    'onder de wol kruipen',
    'in elkaar kruipen',
    'iemand op de huid zitten',
    'een brok in je keel krijgen',
    'de baard in de keel hebben',
    'iemand naar de keel vliegen',
    'iemand de keel uithangen',
    'iemand het mes op de keel zetten',
    'zoals het klokje thuis tikt, tikt het nergens',
    'roeien met de riemen die je hebt',
    'met de deur in huis vallen',
    'huisje, boompje, beestje',
    'in een glazen huis wonen',
    'van goede huize komen',
    'nog verder van huis zijn',
    'niet om over naar huis te schrijven',
    'met lege handen staan',
    'je handen ergens vanaf trekken',
    'geef hem een vinger en hij neemt de hele hand',
    'loop naar de hel!',
    'met harde hand regeren',
    'aan de betere hand zijn',
    'er je hand voor in het vuur durven steken',
    'je ogen de kost geven',
    'iemand de hand boven het hoofd houden',
    'handen thuis!',
    'losse handjes hebben',
    'uit de hand lopen',
    'als twee handen op een buik',
    'het heft in eigen handen nemen',
    'je hand ergens niet voor omdraaien',
    'geen knip voor de neus waard zijn',
    'met de handen in het haar zitten',
    'om de hand van zijn dochter vragen',
    'je handen uit de mouwen steken',
    'de hand in eigen boezem steken',
    'uit de losse pols',
    'met je rug tegen de muur staan',
    'met stomheid geslagen zijn',
    'nieuwe bezems vegen schoon',
    'er een hard hoofd in hebben',
    'olie op het vuur gooien',
    'om de hete brij heen draaien',
    'met jeugdige overmoed',
    'onder de duim houden',
    'over de rooie gaan',
    'alles over een kam scheren',
    'roet in het eten gooien',
    'iemand bij de kraag vatten',
    'geen slapende honden wakker maken',
    'stront aan de knikker',
    'tegen de stroom ingaan',
    'als twee honden vechten om een been, gaat de derde ermee heen',
    'uit de school klappen',
    'het klappen van de zweep kennen',
    'van een mug een olifant maken',
    'van het kastje naar de muur sturen',
    'in de kast zitten',
    'een ver-van-mijn-bedshow',
    'vuur met vuur bestrijden',
    'de strijdbijl begraven',
    'water naar de zee dragen',
    'wie niet waagt, wie niet wint',
    'wie niet sterk is, moet slim zijn',
    'nieuwe wijn in oude zakken',
    'een wolf in schaapskleren',
    'rauw op het dak vallen',
    'dat gaat hem niet in de koude kleren zitten',
    'iemand koud maken',
    'iemand in de kou laten staan',
    'de kou is uit de lucht',
    'je hand overspelen',
    'je tanden laten zien',
    'je tanden bloot lachen',
    'je vingers branden aan iets',
    'zo vader, zo zoon',
    'broodjeaapverhaal',
    'door de mand vallen',
    'met de gebakken peren zitten',
    'de koe bij de horens vatten',
    'over koetjes en kalfjes praten',
    'met alle winden meewaaien',
    'geen haar op mijn hoofd die daaraan denkt',
    'al je kruit verschoten hebben',
    'uit je vel springen',
    'achter het net vissen',
    'iets op zijn beloop laten',
    'twee vliegen in een klap',
    'als twee druppels water',
    'de wind in de zeilen hebben',
    'met de neus in de boter vallen',
    'je neus in andermans zaken steken',
    'iemand bij de neus nemen',
    'de pineut zijn',
    'ieder voor zich',
    'de jarige Job',
    'voor joker staan',
    'iemand voor joker zetten',
    'iets is beter dan niets',
    'in de aap gelogeerd zijn',
    'iemands bloed wel kunnen drinken',
    'al is de leugen nog zo snel, de waarheid achterhaalt haar wel',
    'beter een vogel in de hand dan tien in de lucht',
    'een ezel stoot zich geen twee keer aan dezelfde steen',
    'iemand de harses inslaan',
    'oost, west, thuis best',
    'met de benenwagen gaan',
    'zoals de waard is, vertrouwt hij zijn gasten',
    'wie goed doet, goed ontmoet',
    'leugens hebben korte benen',
    'kort maar krachtig',
    'te kort schieten',
    'iemand te kort doen',
    'aan het kortste eind trekken',
    'alles kort en klein slaan',
    'iemand de vleugels korten',
    'liefde maakt blind',
    'langzaam maar zeker',
    'leven en laten leven',
    'met vallen en opstaan',
    'oefening baart kunst',
    'een koud kunstje',
    'in het land der blinden is éénoog koning',
    'van uitstel komt afstel',
    'de eerste klap is een daalder waard',
    'als klap op de vuurpijl',
    'iemand een klap verkopen',
    'eigen haard is goud waard',
    'achteraf is iedereen wijs',
    'daar kraait geen haan naar',
    'als het kalf verdronken is, dempt men de put',
    'gedeelde smart is halve smart',
    'het gras is altijd groener aan de overkant',
    'zich van zijn goede kant laten zien',
    'de kantjes ervan af lopen',
    'een dubbeltje op zijn kant',
    'iets aan kant maken',
    'iemand van kant maken',
    'honger is de beste saus',
    'ieder huisje heeft zijn kruisje',
    'jong geleerd is oud gedaan',
    'geduld is een schone zaak',
    'geen nieuws is goed nieuws',
    'na regen komt zonneschijn',
    'nooit te oud om te leren',
    'onbekend maakt onbemind',
    'oude liefde roest niet',
    'spreken is zilver, zwijgen is goud',
    'Rome is niet in een dag gebouwd',
    'stille wateren hebben diepe gronden',
    'de kastanjes uit het vuur halen',
    'van hetzelfde laken een pak',
    'ergens je plasje over doen',
    'je uit de naad werken',
    'geld maakt niet gelukkig',
    'geld over de balk gooien',
    'zwemmen in het geld',
    'het geld groeit me niet op de rug',
    'ergens lak aan hebben',
    'eieren voor je geld kiezen',
    'geld in het laatje brengen',
    'tijd is geld',
    'schijn bedriegt',
    'uit het oog, uit het hart',
    'je hart ophalen',
    'je hart op de tong dragen',
    'in hart en nieren',
    'met hart en ziel',
    'een groot hart hebben',
    'een grote mond, maar een klein hartje',
    'iemand een warm hart toedragen',
    'iemand een hart onder de riem steken',
    'je hart vasthouden',
    'iemand op het hart trappen',
    'met de hand over het hart strijken',
    'iemand iets op het hart drukken',
    'een hart van steen hebben',
    'een hart van goud hebben',
    'uit de grond van mijn hart',
    'van je hart geen moordkuil maken',
    'iets niet over je hart kunnen verkrijgen',
    'vele handen maken licht werk',
    'vertrouwen komt te voet en gaat te paard',
    'iemand kaal plukken',
    'waar rook is, is vuur',
    'wat niet weet, wat niet deert',
    'wie de schoen past, trekt hem aan',
    'wie het kleine niet eert, is het grote niet weerd',
    'wie kaatst, moet de bal verwachten',
    'wie zwijgt, stemt toe',
    'men moet het ijzer smeden als het heet is',
    'een goed begin is het halve werk',
    'aan een half woord genoeg hebben',
    'hoe meer zielen, hoe meer vreugd',
    'het doel heiligt de middelen',
    'de pen is machtiger dan het zwaard',
    'tussen hoop en vrees leven',
    'op hoop van zegen',
    'je ziel aan de duivel verkopen',
    'twee geloven op één kussen, daar slaapt de duivel tussen',
    'des duivels zijn',
    'beter voorkomen dan genezen',
    'dat gaat je geen bal aan',
    'eind goed al goed',
    'nood breekt wet',
    'als de nood aan de man komt',
    'je oogst wat je zaait',
    'er is geen roos zonder doornen',
    'wie het laatst lacht, lacht het best',
    'de lachers op je hand krijgen',
    'laat mij niet lachen',
    'in je vuistje lachen',
    'de lachende derde',
    'lachen als een boer met kiespijn',
    'in nood leert men zijn vrienden kennen',
    'iets met argusogen bekijken',
    'je ogen uit je kop kijken',
    'één zwaluw maakt nog geen zomer',
    'over smaak valt niet te twisten',
    'wat de boer niet kent, dat eet hij niet',
    'iets in de doofpot stoppen',
    'iets onder de mat vegen',
    'een wit voetje halen',
    'iets voor zoete koek slikken',
    'nul komma nul',
    'niets dan kommer en kwel',
    'een koekje van eigen deeg',
    'op de vingers tikken',
    'over de schreef gaan',
    'er met de pet naar gooien',
    'iemand het hoofd op hol brengen',
    'nu breekt mijn klomp',
    'iets op je klompen kunnen aanvoelen',
    'hard aan de weg timmeren',
    'er geen gat in zien',
    'iemand met de neus op de feiten drukken',
    'de druk is van de ketel',
    'op je dooie gemakje',
    'je schouders eronder zetten',
    'iemand een loer draaien',
    'met fluwelen handschoenen aanpakken',
    'het is niet alles goud wat er blinkt',
    'de kluts kwijt zijn',
    'iemand liever kwijt dan rijk zijn',
    'het achter de ellebogen hebben',
    'iemand het hemd van het lijf vragen',
    'onder één hoedje spelen',
    'ergens geen hoge hoed van op hebben',
    'van de hoed en de rand weten',
    'zich een hoedje schrikken',
    'op je hoede zijn',
    'iemand in zijn hemd zetten',
    'de knoop doorhakken',
    'er geen doekjes omwinden',
    'iets door de vingers zien',
    'iemand naar de mond praten',
    'op je strepen staan',
    'voor wat hoort wat',
    'recht door zee',
    'zeg nooit nooit',
    'rust roest',
    'boe noch ba zeggen',
    'iets in petto hebben',
    'de kroon spannen',
    'de boot missen',
    'een rots in de branding',
    'iemand het vuur aan de schenen leggen',
    'iets aan je laars lappen',
    'kraak noch smaak aan zitten',
    'iemand in het zadel helpen',
    'iemand van de wal in de sloot helpen',
    'weten hoe laat het is',
    'vroeg of laat',
    'geen vlieg kwaad doen',
    'het kwaad was al geschied',
    'van kwaad tot erger',
    'op de bres springen voor iemand',
    'iemand uit de brand helpen',
    'er een nachtje over slapen',
    'met de billen bloot',
    'niet van gisteren zijn',
    'op de hoogte zijn',
    'hoog en droog zitten',
    'bij hoog en laag zweren',
    'te hoog gegrepen',
    'iemand hoog hebben zitten',
    'iets hoog opnemen',
    'je mond voorbij praten',
    'tegen beter weten in',
    'van geen ophouden weten',
    'het bijltje erbij neerleggen',
    'met een kluitje in het riet sturen',
    'uit de toon vallen',
    'de kat uit de boom kijken',
    'maak dat de kat wijs',
    'kat in het bakkie',
    'de kat op het spek binden',
    'de kogel is door de kerk',
    'vóór het zingen de kerk uitgaan',
    'je bent zeker in de kerk geboren',
    'met de kippen op stok gaan',
    'er als de kippen bij zijn',
    'de kip met de gouden eieren slachten',
    'met een korreltje zout nemen',
    'de bloemetjes buiten zetten',
    'een appeltje voor de dorst',
    'nu komt de aap uit de mouw',
    'met iets te kijk lopen',
    'iemand te kijk zetten',
    'dat is koren op zijn molen',
    'een gegeven paard niet in de bek kijken',
    'iemand tegen zich in het harnas jagen',
    'met iets te koop lopen',
    'op de koop toe nemen',
    'steen en been klagen',
    'op apegapen liggen',
    'iets op de kop tikken',
    'op de kop af',
    'iemand op zijn kop geven',
    'je het apelazarus schrikken',
    'een slag om de arm houden',
    'een voet tussen de deur',
    'de plank misslaan',
    'wie A zegt, moet ook B zeggen',
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
    'tegen de klok werken',
    'met hangende pootjes terugkomen',
    'iemand iets niet aan de neus hangen',
    'je oren laten hangen naar iemand',
    'een ongeluk zit in een klein hoekje',
    'iets aan de wilgen hangen',
    'de bui zien hangen',
    'het hangt erom',
    'aan een zijden draadje hangen',
    'iets boven het hoofd hebben hangen',
    'het hoofd koel houden',
    'iets het hoofd bieden',
    'het is hem naar zijn hoofd gestegen',
    'je hoofd over iets breken',
    'spijt als haren op je hoofd hebben',
    'iets in je hoofd halen',
    'met hangen en wurgen',
    'aan iemands lippen hangen',
    'april doet wat hij wil',
    'in mei leggen alle vogels een ei',
    'de kool en de geit sparen',
    'het spits afbijten',
    'daar lusten de honden geen brood van',
    'er is geen hond',
    'tussen wal en schip vallen',
    'de handdoek in de ring gooien',
    'krokodillentranen huilen',
    'op eieren lopen',
    'een gat in de lucht springen',
    'iets uit de duim zuigen',
    'zo trots als een pauw',
    'zo gek als een deur',
    'zo blij als een kind',
    'zo sterk als een beer',
    'zo doof als een kwartel',
    'zo snel als de wind',
    'zo sluw als een vos',
    'zo mak als een lammetje',
    'slapen als een roos',
    'zweten als een otter',
    'hij liegt dat hij barst',
    'zo blind als een mol',
    'zo fris als een hoentje',
    'zo gezond als een vis',
    'zo licht als een veertje',
    'zo oud als de weg naar Rome',
    'als een warm mes door de boter',
    'zo vrij als een vogel',
    'als een kip zonder kop',
    'zo blij als een ei',
    'zo stil dat je een speld kunt horen vallen',
    'zo klaar als een klontje',
    'zo hard als steen',
    'zo taai als leer',
    'zo scherp als een mes',
    'zo ziek als een hond',
    'zo dood als een pier',
    'zo glad als een aal',
    'zo mager als een lat',
    'een bek als een scheermes',
    'een waarheid als een koe',
    'stukje bij beetje'
  ];

  const map = { dieren, voedsel, koken, onderwijs, beroepen, kantoor, sport, huishouden, natuur, verkeer, plaatsen, kunst, kleding, religie, fictie, literatuur, acties, misdaad, emoties, landen, gereedschap, muziek, militair, wapens, ruimte, wetenschap, geneeskunde, politiek, spreekwoorden };
  const allWords = [...new Set(Object.values(map).flat())];
  map.all = allWords;

  return map;
})();
const HYPHENATION_DICT = (() => {
  const dict = new Set();
  WORDS_BY_CATEGORY.all
    .filter(w => typeof w === 'string' && !w.includes(' ') && !w.includes('-'))
    .forEach(w => dict.add(w.toLowerCase()));
  return dict;
})();

const EXTRA_WORD_PARTS = new Set([
'bijen', 'koningin', 'dwerg', 'pinguïn', 'galapagos', 'schildpad', 'lieveheers', 'beestje', 'sprinkhaan', 'stok', 'staartje', 'omloop', 'fantoom',
'puree', 'brandnetel', 'soep', 'caesar', 'salade', 'granaat', 'appel', 'kaneel', 'broodje', 'vanille', 'pudding', 'lichaampje', 'drempel', 'pijn',
'water', 'meloen', 'biblio', 'thecaris', 'documentaire', 'maker', 'duik', 'instructeur', 'fysio', 'therapeut', 'beheerder', 'controleur', 'driehoek',
'game', 'ontwikkelaar', 'hypno', 'ijsbeeld', 'beeld', 'houwer', 'kostuum', 'ontwerper', 'kraam', 'verzorger', 'kunst', 'criticus', 'lichaam', 'lastering',
'luchtverkeer', 'leider', 'museum', 'conservator', 'revalidatie', 'arts', 'scenario', 'schrijver', 'comedian', 'systeem', 'divisie', 'beschermer', 'jas',
'verzekering', 'agent', 'voeding', 'directeur', 'tram', 'bestuurder', 'belasting', 'adviseur', 'politie', 'geheim', 'kraan', 'bekdier', 'stroom', 'versnelling',
'vrachtwagen', 'chauffeur', 'vracht', 'beach', 'volleybal', 'diepzee', 'duiker', 'langebaan', 'schaatsen', 'parachute', 'springen', 'indianen', 'tooi',
'polsstok', 'hoogspringen', 'schans', 'synchroon', 'trampoline', 'vissen', 'kampioen', 'beker', 'oven', 'gezelschap', 'spel', 'getrokken', 'studie', 'serie',
'ring', 'afstand', 'bediening', 'regelaar', 'armband', 'horloge', 'houwwerk', 'kaarsen', 'houder', 'financiering', 'zinnig', 'huur', 'scheen', 'warm',
'knoop', 'scheep', 'schroef', 'veiligheid', 'speld', 'tas', 'gehoor', 'apparaat', 'muur', 'schildering', 'zuur', 'speelzaal', 'chip', 'dieren', 'koud',
'aard', 'verschuiving', 'lucht', 'vochtigheid', 'vulkaan', 'uitbarsting', 'zoetwater', 'meer', 'zon', 'verduistering', 'zorg', 'peuter', 'alarm', 'kliniek',
'stoom', 'locomotief', 'zweef', 'vliegtuig', 'kaping', 'boot', 'trauma', 'spoorweg', 'overgang', 'paspoort', 'controle', 'kenteken', 'centrale', 'carnaval',
'plaat', 'verkeer', 'distributie', 'centrum', 'brandweer', 'kazerne', 'camping', 'terrein', 'recreatie', 'gebied', 'tandarts', 'praktijk', 'mepper', 'kloof',
'pannenkoeken', 'huis', 'kinder', 'dagverblijf', 'meubel', 'boulevard', 'onder', 'handelen', 'touwtje', 'teweeg', 'stichten', 'winkel', 'identiteit', 'bewijs',
'live', 'streamen', 'geheugen', 'verlies', 'bewustzijn', 'drang', 'surrogaat', 'moeder', 'kwik', 'thermometer', 'weten', 'schappelijk', 'vliegen', 'geluid',
'onderzoek', 'instituut', 'deeltjes', 'versneller', 'parlement', 'aire', 'staat', 'secretaris', 'rechtvaardig', 'heid', 'inkomen', 'verdeling', 'overtuiging',
'verkiezing', 'programma', 'formatie', 'gesprek', 'kabinet', 'tijd', 'brander', 'worst', 'gerei', 'dood', 'lopende', 'broodjeaap', 'inhoud', 'opgave', 'lamp',
'aftrek', 'volk', 'vertegenwoordiger', 'inkomsten', 'vermogen', 'bescherming', 'campagne', 'arbeid', 'currency', 'worsten', 'export', 'product', 'sluip',
'ongeschikt', 'heid', 'minderheid', 'openlucht', 'concert', 'patrouille', 'verkenning', 'stad', 'inlichtingen', 'gevende', 'naam', 'lachen', 'schater',
'stroom', 'generator', 'gereedschap', 'kist', 'schiller', 'accu', 'boormachine', 'uitje', 'hetelucht', 'pistool', 'werk', 'handschoen', 'crypto', 'scherp',
'isolatie', 'materiaal', 'istiek', 'maan', 'relativiteit', 'theorie', 'koppeling', 'lanceer', 'installatie', 'schapper', 'sleutel', 'schuiver', 'getuige',
'laboratorium', 'stamper', 'gezondheid', 'zorg', 'ondergang', 'telescoop', 'ruimte', 'aanslag', 'aardig', 'actie', 'akkoord', 'amfibie', 'atie', 'haaien',
'aanval', 'baan', 'band', 'basis', 'beheer', 'bestuur', 'bond', 'bouw', 'tocht', 'cel', 'concentratie', 'crisis', 'damp', 'rel', 'schopper', 'vergeving',
'debat', 'deel', 'deeltje', 'deur', 'dienst', 'energie', 'erij', 'explosie', 'factor', 'fiets', 'front', 'gebouw', 'tuin', 'leugen', 'detector', 'tanden',
'moordenaar', 'geving', 'gever', 'golf', 'graaf', 'grond', 'haven', 'herdenking', 'afdruk', 'therapie', 'harmonica', 'ongeschiktheid', 'vraag', 'bocht',
'houder', 'hulp', 'informatie', 'ing', 'isme', 'iteit', 'kamer', 'kamp', 'kant', 'voorstel', 'kast', 'kern', 'kracht', 'krijgs', 'kunde', 'bloed', 'hoempa',
'leger', 'lijn', 'prijs', 'ontduiking', 'linie', 'logie', 'loos', 'machine', 'macht', 'massa', 'maatregel', 'meester', 'darm', 'draaier', 'drift', 'letsel',
'ment', 'middel', 'minister', 'misdaad', 'monument', 'oord', 'natuurlijk', 'wisseling', 'darmontsteking', 'moord', 'motor', 'nemer', 'neming', 'hersen',
'netwerk', 'nota', 'officier', 'onderhandeling', 'ontsteking', 'oorlog', 'overleg', 'oxide', 'partij', 'planeet', 'proef', 'punt', 'platform', 'spoeling',
'raad', 'raam', 'recht', 'reis', 'schap', 'schip', 'schot', 'schutter', 'staart', 'draaien', 'kwartier', 'straal', 'sturing', 'tafel', 'kopieer', 'spinsel',
'scoop', 'sluiting', 'speler', 'staf', 'stand', 'station', 'nationaal', 'gezind', 'stelsel', 'ster', 'stilstand', 'stof', 'stoel', 'hielen', 'huzaren',
'transport', 'trein', 'tuig', 'vaart', 'veld', 'verdrag', 'verdediging', 'verklaring', 'verlening', 'vlak', 'vlucht', 'voertuig', 'voerder', 'herrie',
'vorming', 'vuur', 'waardig', 'wagen', 'wapen', 'weer', 'werker', 'conferentie', 'wet', 'omelet', 'wetenschap', 'wiel', 'weg', 'zelfmoord', 'schopper',
'hoge', 'hogesnelheid', 'snelheid', 'kootje', 'botje', 'streng', 'merg', 'omloop', 'achtergrond', 'muziek', 'achter', 'volging', 'hartritme', 'likker',
'afval', 'container', 'afweer', 'geschut', 'alleman', 'vriend', 'olie', 'tanker', 'scheids', 'auto', 'bange', 'schijter', 'beurs', 'handelaar', 'jacht',
'banket', 'staaf', 'bejaarden', 'tehuis', 'bende', 'bestrijding', 'bet', 'betover', 'overgrootmoeder', 'grootmoeder', 'moeder', 'barrière', 'guerrilla',
'kaartje', 'molotov', 'vlammen', 'werper', 'studenten', 'corps', 'dansen', 'dochter', 'onderneming', 'dubbel', 'dekker', 'eendag', 'eenrichting', 'weg',
'dolheid', 'houwtje', 'touwtje', 'huisvrede', 'breuk', 'inbus', 'sleutel', 'incubatie', 'industrie', 'meeloop', 'dag', 'intake', 'invoeg', 'strook',
'jaar', 'getijde', 'klink', 'kalk', 'nagel', 'ochtend', 'jas', 'woonwagen', 'kamp', 'katten', 'luik', 'kerst', 'kransje', 'hulp', 'kerstman', 'pakket',
'versiering', 'billetjes', 'achtig', 'verblijf', 'telefoon', 'kinkel', 'klapper', 'knarse', 'tanden', 'jassen', 'kleuter', 'klas', 'knie', 'knikke',
'bollen', 'gummi', 'knuppel', 'steek', 'penning', 'kort', 'zichtig', 'bloedig', 'middelpunt', 'vliedende', 'kracht', 'kranten', 'jongen', 'kriebel',
'hoest', 'drank', 'badkamer', 'spiegel', 'vogel', 'badje', 'kunst', 'collectie', 'kwak', 'zalver', 'flat', 'laatste', 'jaars', 'lagedruk', 'hoog',
'gerechtshof'
]);

function insertSoftHyphens(word) {
  if (!word) return word;
  if (word.includes(' ')) return word.split(' ').map(insertSoftHyphens).join(' ');
  if (word.includes('-')) return word.split('-').map(insertSoftHyphens).join('-');
  if (word.length <= 10) return word;
  const lower = word.toLowerCase();
  const isKnown = (str) => HYPHENATION_DICT.has(str) || EXTRA_WORD_PARTS.has(str);
  for (let i = 4; i <= lower.length - 5; i++) {
    if (lower[i] === 's') {
      const stam = lower.slice(0, i);
      const rest = lower.slice(i + 1);
      if (isKnown(stam) && isKnown(rest)) return word.slice(0, i + 1) + '\u00AD' + word.slice(i + 1);
    }
  }
  for (let i = lower.length - 4; i >= 4; i--) {
    const links = lower.slice(0, i);
    const rechts = lower.slice(i);
    if (isKnown(links) && isKnown(rechts)) return word.slice(0, i) + '\u00AD' + word.slice(i);
    if (EXTRA_WORD_PARTS.has(rechts) && rechts.length >= 5) return word.slice(0, i) + '\u00AD' + word.slice(i);
  }
  const vowels = 'aeiouyàáèéëïöü';
  const diphthongs = ['ee','oo','aa','uu','ei','au','ie','ij','oe','ou','ui','eu'];
  let result = "";
  let i = 0;
  while (i < word.length) {
    result += word[i];
    if (i < word.length - 5) {
      const c1 = word[i].toLowerCase(), c2 = word[i+1]?.toLowerCase(), c3 = word[i+2]?.toLowerCase();
      if (c2 && diphthongs.includes(c1+c2)) { result += word[i+1]; i+=2; continue; }
      const v1 = vowels.includes(c1), v2 = c2 && vowels.includes(c2), v3 = c3 && vowels.includes(c3);
      if (v1 && !v2 && v3 && i > 1) result += '\u00AD';
      else if (v1 && !v2 && !v3 && i < word.length - 6) {
        const c4 = word[i+3]?.toLowerCase();
        if (c4 && vowels.includes(c4)) { result += word[i+1] + '\u00AD'; i++; }
      }
    }
    i++;
  }
  return result;
}

const BONUS_WORDS_SET = new Set(
  CATEGORIES.filter(c => c.bonus).flatMap(c => WORDS_BY_CATEGORY[c.id] || [])
);
const getBonusPointValue = (word) => BONUS_WORDS_SET.has(word) ? 2 : 0;
const WORD_TO_CATEGORY = {};
for (const cat of CATEGORIES) {
  for (const word of (WORDS_BY_CATEGORY[cat.id] || [])) {
    if (!WORD_TO_CATEGORY[word]) WORD_TO_CATEGORY[word] = cat;
  }
}
// ── Gedeelde hulpfuncties ─────────────────────────────────────────────────────

// Woordpool samenstellen op basis van categorieset (gebruikt in TaboeRoundGame en WoordRaadGame)
function buildWordPool(cats) {
  const catSet = cats instanceof Set ? cats : new Set();
  const allIds = CATEGORIES.map(c => c.id);
  if (catSet.size === 0 || allIds.every(id => catSet.has(id))) return WORDS_BY_CATEGORY.all;
  const merged = new Set();
  for (const id of catSet) (WORDS_BY_CATEGORY[id] || []).forEach(word => merged.add(word));
  return merged.size > 0 ? [...merged] : WORDS_BY_CATEGORY.all;
}

// Veilige categorielijst voor tiebreakers
const TIEBREAKER_ELIGIBLE_CATEGORIES = ['dieren','voedsel','koken','beroepen','kantoor','sport','natuur','emoties','landen','verkeer','plaatsen','kunst','kleding','religie','fictie','literatuur','muziek','acties','gereedschap','wetenschap','geneeskunde','ruimte','militair','misdaad','politiek','huishouden','spreekwoorden'];

// Kies 3 kandidaat-tiebreakercategorieën op basis van de actieve categorieset
function buildTiebreakerCategoryOptions(selectedCats) {
  const catSet = selectedCats instanceof Set ? selectedCats : new Set();
  const allIds = CATEGORIES.map(c => c.id);
  const allSelected = catSet.size === 0 || allIds.every(id => catSet.has(id));
  const usedSafe = allSelected ? [] : TIEBREAKER_ELIGIBLE_CATEGORIES.filter(c => catSet.has(c));
  const chosen = shuffle(usedSafe).slice(0, 3);
  const remaining = shuffle(TIEBREAKER_ELIGIBLE_CATEGORIES.filter(c => !chosen.includes(c)));
  while (chosen.length < 3 && remaining.length > 0) chosen.push(remaining.shift());
  return chosen.map(id => CATEGORIES.find(c => c.id === id)).filter(Boolean);
}

const TABOE_LETTER_POOL = FULL_ALPHABET.filter(l => !["Q","X","Y"].includes(l));

// ── Taboe Tie-breaker ────────────────────────────────────────────────────────
function TaboeTiebreakerGame({ players, tiedPlayerIndices, candidateCategories, onRestart, onStartTiebreaker }) {
  const [chosenCategoryId, setChosenCategoryId] = useState(null);
  const [forbiddenLetter, setForbiddenLetter] = useState(null);
  const [letterLocked, setLetterLocked] = useState(false);
  const [words, setWords] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [times, setTimes] = useState(tiedPlayerIndices.map(() => null));
  const [subPhase, setSubPhase] = useState("pick"); // pick | play | results
  const [elapsed, setElapsed] = useState(0);
  const [flash, setFlash] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const { spin: doSpinLetter, spinning } = useLetterSpinAnimation({
    pool: TABOE_LETTER_POOL,
    exclude: forbiddenLetter, // voorkomt dezelfde letter bij een herstart tie-breaker
    onLetter: setForbiddenLetter,
    onDone: (_target) => { setLetterLocked(true); },
  });

  useEffect(() => () => { clearInterval(timerRef.current); }, []);

  const spinLetter = () => {
    if (spinning) return;
    if (letterLocked) setLetterLocked(false); // reset lock so we can spin again
    doSpinLetter();
  };

  const chooseCategory = (catId) => {
    const pool = WORDS_BY_CATEGORY[catId] || [];
    const chosen = shuffle([...pool]).slice(0, tiedPlayerIndices.length);
    setChosenCategoryId(catId);
    setWords(chosen);
  };

  const canStart = chosenCategoryId && letterLocked;

  const startPlay = () => {
    setCurrentStep(0);
    setSubPhase("handoff");
  };

  const triggerFlash = (type) => { setFlash(type); setTimeout(() => setFlash(null), 350); };

  const startRound = () => {
    setElapsed(0);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => setElapsed((Date.now() - startTimeRef.current) / 1000), 50);
    setSubPhase("playing");
  };

  const handleCorrect = () => {
    clearInterval(timerRef.current);
    playCorrectSound();
    triggerFlash("correct");
    const finalTime = (Date.now() - startTimeRef.current) / 1000;
    setElapsed(finalTime);
    const newTimes = [...times];
    newTimes[currentStep] = finalTime;
    setTimes(newTimes);
    const next = currentStep + 1;
    if (next >= tiedPlayerIndices.length) {
      setCurrentStep(next);
      setSubPhase("results");
    } else {
      setCurrentStep(next);
      setSubPhase("handoff");
    }
  };



  const categoryLabel = CATEGORIES.find(c => c.id === chosenCategoryId)?.label ?? "";
  const currentPlayerIdx = tiedPlayerIndices[currentStep];
  const currentWord = words?.[currentStep];

  // ── Resultaten ──
  if (subPhase === "results") {
    return <TiebreakerSoloResultScreen players={players} tiedPlayerIndices={tiedPlayerIndices} times={times} onRestart={onRestart} onStartTiebreaker={onStartTiebreaker} />;
  }

  // ── Handoff ──
  if (subPhase === "handoff") {
    return (
      <TiebreakerHandoffScreen
        subtitle={`TIE-BREAKER · ${currentStep+1}/${tiedPlayerIndices.length}`}
        player={players[currentPlayerIdx]}
        tip1="Leg z.s.m. het woord uit"
        tip2={`in de categorie: ${categoryLabel}`}
        tip3={<>Verboden letter: <span style={{color:"#f87171", fontWeight:800}}>{forbiddenLetter}</span></>}
        onStart={startRound}
      />
    );
  }

  // ── Spelscherm ──
  if (subPhase === "playing") {
    const elapsedDisplay = formatElapsedTime(elapsed);
    return (
      <div className={`screen round-screen${getFlashClass(flash)}`}>

        {/* ── Bovenste sectie: header + timer ── */}
        <div style={{width:"100%", maxWidth:"420px"}}>
          <div className="ls-header">
            <div className="wr-logo">Tie-Breaker</div>
            <span className="round-player" style={{fontSize:"22px", textAlign:"right"}}>{players[currentPlayerIdx]}</span>
          </div>
          <TimerProgressBar pct={Math.min(elapsed / 60, 1)} color="#fbbf24" transition="width 0.05s linear" />
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
            <span style={{fontFamily:"'Righteous', cursive", fontSize:"22px", color:"#fbbf24", flex:1, textAlign:"left"}}>{elapsedDisplay}</span>
            <div className="round-stats" style={{flex:1, justifyContent:"flex-end"}}>
              <span className="stat correct-stat"><span>{currentStep+1}/{tiedPlayerIndices.length}</span></span>
            </div>
          </div>
        </div>

        {/* ── Middelste sectie: verboden letter + woord ── */}
        <div className="word-stage">
          <div className="word-anchor">
            <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"16px", gap:"6px"}}>
              <div style={{fontFamily:"'Righteous', cursive", fontSize:"clamp(56px,18vw,88px)", color:"#f87171", textShadow:"0 0 32px rgba(248,113,113,0.5)", letterSpacing:"0.05em", lineHeight:1, width:"1.1em", height:"1.1em", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                {forbiddenLetter}
              </div>
              <div style={{fontSize:"11px", fontWeight:"800", letterSpacing:"0.14em", color:"#f87171", textTransform:"uppercase"}}>🚫 Verboden letter</div>
            </div>
            <div style={{background:"linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.98))", border:"3px solid rgba(96,165,250,0.3)", borderRadius:"24px", padding:"28px 24px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", textAlign:"center", width:"100%", minHeight:"120px", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <h2 style={{fontFamily:"'Righteous', cursive", fontSize:"clamp(32px,10vw,44px)", color:"white", margin:0, lineHeight:1.1}}>{currentWord ? insertSoftHyphens(currentWord) : "—"}</h2>
            </div>
            <div className="times-up-banner is-hidden" aria-hidden="true" />
          </div>
        </div>

        {/* ── Onderste sectie: knop ── */}
        <div className="action-row">
          <button onClick={handleCorrect} className="action-btn correct-btn">✓ Goed</button>
        </div>

      </div>
    );
  }

  // ── Categorie + letter kiezen ──
  return (
    <div className="screen">
      <div className="score-card">
        <h2 className="score-title tiebreaker-title">⚡ Tie-breaker</h2>
        <p className="tiebreaker-subtitle">Genereer een verboden letter en kies samen een categorie.</p>

        {/* Verboden letter */}
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", marginBottom:"24px"}}>
          <div style={{fontFamily:"'Righteous', cursive", fontSize:"clamp(56px,18vw,80px)", color: spinning ? "rgba(248,113,113,0.5)" : letterLocked ? "#f87171" : "rgba(255,255,255,0.2)", textShadow: letterLocked && !spinning ? "0 0 32px rgba(248,113,113,0.5)" : "none", lineHeight:1, width:"1.1em", height:"1.1em", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"color 0.1s"}}>
            {forbiddenLetter ?? "?"}
          </div>
          <div style={{fontSize:"11px", fontWeight:"800", letterSpacing:"0.14em", color: letterLocked ? "#f87171" : "rgba(255,255,255,0.35)", textTransform:"uppercase"}}>
            {spinning ? "⏳ Letter kiezen…" : letterLocked ? "🚫 Verboden letter" : "Genereer een verboden letter"}
          </div>
          <button onClick={spinLetter} disabled={spinning}
            style={{fontFamily:"'Righteous', cursive", fontSize:"16px", padding:"12px 28px", borderRadius:"14px", border:"2.5px solid rgba(245,158,11,0.5)", background:"rgba(245,158,11,0.15)", color: spinning ? "rgba(245,158,11,0.4)" : "#f59e0b", cursor: spinning ? "default" : "pointer"}}>
            {spinning ? "Draaien…" : letterLocked ? "Opnieuw draaien" : "Genereer letter"}
          </button>
        </div>

        {/* Categorie */}
        <div className="tiebreaker-cat-list">
          {candidateCategories.map(cat => (
            <button key={cat.id} onClick={() => chooseCategory(cat.id)}
              className="tiebreaker-cat-btn"
              style={chosenCategoryId === cat.id ? {background:"rgba(167,139,250,0.25)", borderColor:"rgba(167,139,250,0.7)"} : {}}>
              {cat.label} {chosenCategoryId === cat.id ? "✓" : ""}
            </button>
          ))}
        </div>

        <button
          onClick={startPlay}
          disabled={!canStart}
          className={`start-btn${canStart ? " ready-solid" : ""}`}
          style={{width:"100%"}}>
          {canStart ? "Tie-breaker starten ➜" : "Vul alles in…"}
        </button>
      </div>
    </div>
  );
}

// TaboeStatsScreen is een alias voor de gedeelde PlayerStatsScreen met variant="taboe"
// (geen bonus/streak-kolommen, bestRound puur op correct-count)
const TaboeStatsScreen = ({ players, playerStats, scores, initialPlayer, onBack }) => (
  <PlayerStatsScreen players={players} playerStats={playerStats} scores={scores} initialPlayer={initialPlayer} onBack={onBack} variant="taboe" />
);

// ── Taboe Spel ───────────────────────────────────────────────────────────────
function TaboeRoundGame({ players, onRestart, roundTime, selectedCategories }) {
  const [deck] = useState(() => shuffle(buildWordPool(selectedCategories)));
  const [cardIdx, setCardIdx] = useState(0);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [scores, setScores] = useState(Array(players.length).fill(null));
  const [phase, setPhase] = useState("handoff"); // handoff | spinning | playing | roundover
  const [timeRemaining, setTimeRemaining] = useState(roundTime);
  const [correct, setCorrect] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [correctOffset, setCorrectOffset] = useState(0);
  const [skippedOffset, setSkippedOffset] = useState(0);
  const [flash, setFlash] = useState(null); // "correct" | "skip"
  const [timesUp, setTimesUp] = useState(false);
  const [graceCountdown, setGraceCountdown] = useState(null);
  const timesUpRef = useRef(false);
  const timerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const startRef = useRef(null);
  const roundNum = useRef(0);
  const [playerStats, setPlayerStats] = useState(() => Array(players.length).fill(null).map(() => ({ rounds: [] })));
  const [statsPhase, setStatsPhase] = useState(false);
  const [statsInitialPlayer, setStatsInitialPlayer] = useState(0);
  const currentRoundStatsRef = useRef({ correct: 0, skipped: 0, wordResults: [] });

  // ── Verboden letter state (via gedeelde hook) ──
  const [forbiddenLetter, setForbiddenLetter] = useState(null);
  const roundLetterRef = useRef(null); // gedeelde letter voor de hele spelronde

  const { spin: doSpinLetter, spinning } = useLetterSpinAnimation({
    pool: TABOE_LETTER_POOL,
    exclude: forbiddenLetter,
    onLetter: setForbiddenLetter,
    onDone: (target) => {
      roundLetterRef.current = target;
      setPhase("playing");
      currentRoundStatsRef.current = { correct: 0, skipped: 0, wordResults: [] };
      startTimer();
    },
  });

  const card = deck[cardIdx % deck.length];

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  const stopGraceTimer = () => { if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null; } };

  const startTimer = () => {
    stopTimer();
    timesUpRef.current = false;
    setTimesUp(false);
    setGraceCountdown(null);
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const remaining = Math.max(0, roundTime - elapsed);
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        stopTimer();
        if (!timesUpRef.current) {
          timesUpRef.current = true;
          setTimesUp(true);
          playTimeUpSound();
          let graceTime = 10;
          setGraceCountdown(graceTime);
          graceTimerRef.current = setInterval(() => {
            graceTime -= 1;
            setGraceCountdown(graceTime);
            if (graceTime <= 0) {
              stopGraceTimer();
              // Huidig woord telt als skip
              setCardIdx(i => {
                currentRoundStatsRef.current.skipped += 1;
                currentRoundStatsRef.current.wordResults.push({ word: deck[i % deck.length], guessed: false });
                return i + 1;
              });
              setSkipped(s => s + 1);
              setCorrect(c => { endRound(c); return c; });
            }
          }, 1000);
        }
      }
    }, 80);
  };

  useEffect(() => () => { stopTimer(); stopGraceTimer(); }, []);

  // ── Tiebreaker state ──
  const [tiebreakerState, setTiebreakerState] = useState(null); // null | { tiedPlayerIndices, candidateCategories }

  const startTiebreaker = (tiedPlayerIndices) => {
    const candidateCategories = buildTiebreakerCategoryOptions(selectedCategories);
    setTiebreakerState({ tiedPlayerIndices, candidateCategories });
    setPhase("tiebreaker");
  };

  const spinLetter = () => {
    if (spinning) return;
    setPhase("spinning");
    doSpinLetter();
  };

  const triggerFlash = (type) => {
    setFlash(type);
    setTimeout(() => setFlash(null), 350);
  };

  const onCorrect = () => {
    const wasTimesUp = timesUpRef.current;
    if (wasTimesUp) stopGraceTimer();
    playCorrectSound();
    triggerFlash("correct");
    const currentWord = deck[cardIdx % deck.length];
    currentRoundStatsRef.current.correct += 1;
    currentRoundStatsRef.current.wordResults.push({ word: currentWord, guessed: true });
    setCorrect(c => {
      const newC = c + 1;
      if (wasTimesUp) endRound(newC);
      return newC;
    });
    setCardIdx(i => i + 1);
  };

  const onSkip = () => {
    const wasTimesUp = timesUpRef.current;
    if (wasTimesUp) stopGraceTimer();
    playSkipSound();
    triggerFlash("skip");
    const currentWord = deck[cardIdx % deck.length];
    currentRoundStatsRef.current.skipped += 1;
    currentRoundStatsRef.current.wordResults.push({ word: currentWord, guessed: false });
    setSkipped(s => s + 1);
    setCardIdx(i => i + 1);
    if (wasTimesUp) setCorrect(c => { endRound(c); return c; });
  };

  const endRound = (currentCorrect) => {
    stopTimer();
    stopGraceTimer();
    // Commit ronde stats voor deze speler
    const roundStats = { ...currentRoundStatsRef.current };
    setPlayerStats(prev => prev.map((ps, i) => i === playerIdx
      ? { ...ps, rounds: [...ps.rounds, roundStats] }
      : ps
    ));
    // Commit score immediately so ScoreboardScreen sees correct values
    setScores(prev => prev.map((s, i) => i === playerIdx ? (s ?? 0) + currentCorrect : s));
    setPhase("roundover");
  };


  // Called when ScoreboardScreen's "Volgende speler" button is clicked
  const onNext = () => {
    const next = (playerIdx + 1) % players.length;
    const isNewGameRound = next === 0;
    setPlayerIdx(next);
    setCorrect(0);
    setSkipped(0);
    // Offsets = cumulatieve totalen van de volgende speler uit eerdere rondes
    const nextStats = playerStats[next];
    setCorrectOffset(nextStats?.rounds.reduce((s, r) => s + r.correct, 0) ?? 0);
    setSkippedOffset(nextStats?.rounds.reduce((s, r) => s + r.skipped, 0) ?? 0);
    setTimeRemaining(roundTime);
    setCardIdx(i => i + 1);
    setTimesUp(false);
    setGraceCountdown(null);
    timesUpRef.current = false;
    currentRoundStatsRef.current = { correct: 0, skipped: 0, wordResults: [] };
    roundNum.current += 1;
    if (isNewGameRound) {
      roundLetterRef.current = null;
      // forbiddenLetter bewust NIET gereset: de eerste speler van de nieuwe spelronde
      // gaat spinnen, en dan moet `exclude` nog de oude letter bevatten zodat
      // dezelfde verboden letter niet opnieuw gekozen kan worden.
    }
    setPhase("handoff");
  };

  const timerPct = timeRemaining / roundTime;
  const timerColor = timesUp ? "#f87171" : timerPct > 0.5 ? "#4ade80" : timerPct > 0.25 ? "#facc15" : "#f87171";

  if (phase === "handoff") {
    return <PlayerHandoffScreen player={players[playerIdx]} onReady={() => {
      if (roundLetterRef.current) {
        // Zelfde spelronde: bestaande letter tonen en direct starten
        setForbiddenLetter(roundLetterRef.current);
        setPhase("playing");
        currentRoundStatsRef.current = { correct: 0, skipped: 0, wordResults: [] };
        startTimer();
      } else {
        spinLetter();
      }
    }} />;
  }

  if (phase === "roundover") {
    if (statsPhase) {
      return (
        <TaboeStatsScreen
          players={players}
          playerStats={playerStats}
          scores={scores}
          initialPlayer={statsInitialPlayer}
          onBack={() => setStatsPhase(false)}
        />
      );
    }
    return (
      <ScoreboardScreen
        players={players}
        scores={scores}
        currentRound={roundNum.current + 1}
        totalRounds={players.length}
        onNext={onNext}
        onRestart={onRestart}
        onContinue={() => {
          roundLetterRef.current = null;
          // forbiddenLetter bewust NIET gereset: zie onNext hierboven.
          setPlayerIdx(0);
          setCorrect(0);
          setSkipped(0);
          // Zet offsets op de cumulatieve totalen van alle gespeelde rondes
          setCorrectOffset(playerStats[0]?.rounds.reduce((s, r) => s + r.correct, 0) ?? 0);
          setSkippedOffset(playerStats[0]?.rounds.reduce((s, r) => s + r.skipped, 0) ?? 0);
          setTimeRemaining(roundTime);
          setTimesUp(false);
          setGraceCountdown(null);
          timesUpRef.current = false;
          currentRoundStatsRef.current = { correct: 0, skipped: 0, wordResults: [] };
          roundNum.current = 0;
          setPhase("handoff");
        }}
        onShowStats={(idx) => { setStatsInitialPlayer(idx ?? 0); setStatsPhase(true); }}
        teams={null}
        teamScores={[]}
        onStartTiebreaker={startTiebreaker}
      />
    );
  }

  if (phase === "tiebreaker" && tiebreakerState) {
    return (
      <TaboeTiebreakerGame
        players={players}
        tiedPlayerIndices={tiebreakerState.tiedPlayerIndices}
        candidateCategories={tiebreakerState.candidateCategories}
        onRestart={onRestart}
        onStartTiebreaker={startTiebreaker}
      />
    );
  }

  // spinning or playing
  return (
    <div className={`screen round-screen${getFlashClass(flash)}`}>

      {/* ── Bovenste sectie: header + timer (vastzittend bovenaan) ── */}
      <div style={{width:"100%", maxWidth:"420px"}}>

        {/* WoordRaad header */}
        <div className="ls-header">
          <div className="wr-logo">WoordRaad</div>
          <span className="round-player" style={{fontSize:"22px", textAlign:"right"}}>{players[playerIdx]}</span>
        </div>

        {/* Timer balk */}
        <TimerProgressBar pct={timerPct} color={timerColor} empty={timesUp} transition="width 0.08s linear, background 0.5s" />

        {/* Timer links, stats rechts */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
          <span style={{fontFamily:"'Righteous', cursive", fontSize:"22px", color:timerColor, flex:1, textAlign:"left"}}>
            <TimerCountdown secs={Math.ceil(timeRemaining)} timesUp={timesUp} />
          </span>
          <div className="round-stats" style={{flex:1, justifyContent:"flex-end"}}>
            <span className="stat correct-stat">
              <span className="stat-icon">✓</span>
              <span>{correctOffset + correct}</span>
            </span>
            <span className="stat skip-stat">
              <span className="stat-icon">✗</span>
              <span>{skippedOffset + skipped}</span>
            </span>
          </div>
        </div>

      </div>

      {/* ── Middelste sectie: verboden letter + woord (vult resterende ruimte) ── */}
      <div className="word-stage">
        <div className="word-anchor">

          {/* Verboden letter */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"16px", gap:"6px"}}>
            <div style={{
              fontFamily:"'Righteous', cursive",
              fontSize:"clamp(56px, 18vw, 88px)",
              color: spinning ? "rgba(248,113,113,0.5)" : "#f87171",
              textShadow: spinning ? "none" : "0 0 32px rgba(248,113,113,0.5)",
              letterSpacing:"0.05em",
              lineHeight:1,
              transition:"color 0.1s",
              width:"1.1em",
              height:"1.1em",
              flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center"
            }}>
              {forbiddenLetter ?? "?"}
            </div>
            <div style={{fontSize:"11px", fontWeight:"800", letterSpacing:"0.14em", color:"#f87171", textTransform:"uppercase"}}>
              {spinning ? "⏳ Letter kiezen…" : "🚫 Verboden letter"}
            </div>
          </div>

          {/* Woord kaart */}
          <div style={{background:"linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.98))", border:"3px solid rgba(96,165,250,0.3)", borderRadius:"24px", padding:"28px 24px", boxShadow:"0 8px 32px rgba(0,0,0,0.4)", textAlign:"center", width:"100%", minHeight:"120px", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <h2 style={{fontFamily:"'Righteous', cursive", fontSize:"clamp(32px, 10vw, 44px)", color:"white", margin:0, lineHeight:1.1}}>{insertSoftHyphens(card)}</h2>
          </div>

          {/* Categorie label / Times Up Banner */}
          <div className={`times-up-banner${timesUp ? " grace-active" : " category-banner"}`}>
            {timesUp
              ? <span>Tijd is op — nog <span className="grace-countdown">{graceCountdown !== null ? graceCountdown : '…'}</span>s om te raden</span>
              : WORD_TO_CATEGORY[card]?.label ?? '📦 Categorie'}
          </div>

        </div>
      </div>

      {/* ── Onderste sectie: knoppen (vastzittend onderaan) ── */}
      <div className="action-row">
        <button onClick={onSkip} disabled={spinning} className={`action-btn skip-btn${spinning ? " btn-disabled" : ""}`}>✗ Skip</button>
        <button onClick={onCorrect} disabled={spinning} className={`action-btn correct-btn${spinning ? " btn-disabled" : ""}`} style={{flex:2}}>✓ Goed</button>
      </div>

    </div>
  );
}

const DEFAULT_ROUND_SECONDS = 120;

const w = (n) => n === 1 ? "woord" : "woorden";
const pt = (n) => n === 1 ? "punt" : "punten";

const MESSAGES_EXCELLENT = [
  () => `Wat een enorme prestatie! 🏆`,
  () => `Jij verdient een sticker! ⭐`,
  () => `Je staat in vuur en vlam! 🔥`,
  () => `Je bent niet te stoppen! 🚀`,
  () => `Heb jij zitten oefenen? 🤨`,
  () => `Dit heeft iets weg van pesten 😂`,
  () => `Hoe? Gewoon hoe? 🤯`,
  () => `Heb je soms een spiekbriefje? 🕵️`,
  () => `Is de Dikke Van Dale persoonlijk aanwezig? 📚`,
  () => `Toevallig een woordenboek opgegeten? 📖`,
  () => `Je mag mee voor het WK woordjes raden 🌍`,
  () => `Even checken of je geen robot bent 🤖`,
  () => `De anderen overwegen naar huis te gaan 🚪`,
  () => `Je hebt de groep getraumatiseerd 😵`,
  () => `Zelfs de klok is onder de indruk ⏱️`,
];
const MESSAGES_DECENT = [
  (_, pts) => `${pts} ${pt(pts)}, lekker bezig! 🙌`,
  (_, pts) => `${pts} ${pt(pts)}, prima gedaan 👌`,
  (_, pts) => `${pts} ${pt(pts)}, niet slecht 👍`,
  (_, pts) => `${pts} ${pt(pts)}, gefeliciteerd 🥳`,
  (_, pts) => `${pts} ${pt(pts)} bijgeschreven ✍️`,
  (_, pts) => `${pts} ${pt(pts)} in één ronde 🤩`,
  (_, pts) => `${pts} ${pt(pts)}, ga zo door! 💪`,
  (_, pts) => `${pts} ${pt(pts)}, keurig gedaan 🎯`,
  (_, pts) => `${pts} ${pt(pts)}, je bent op dreef ⚡`,
];
const MESSAGES_LOW = [
  (_, pts) => `${pts} ${pt(pts)}, werk aan de winkel 🔨`,
  (_, pts) => `${pts} ${pt(pts)}, volgende keer beter 🙈`,
  () => `Meedoen is belangrijker dan winnen 🫠`,
  () => `Volgende keer eerst je bril opzetten 🤓`,
  () => `De andere spelers ruiken bloed 🩸`,
  () => `Laten we doen alsof dit niet gebeurd is 🙊`,
  () => `Het lag allemaal aan de woorden 😠`,
  () => `Je gunt de rest een kans. Lief! 🎁`,
  (_, pts) => `${pts} ${pt(pts)}, de weg omhoog begint hier ⛰️`,
];
const lastShownMessageIndex = { great: -1, ok: -1, poor: -1 };
function pickRoundEndMessage(correctCount, roundTime, totalScore = correctCount) {
  const ratio = roundTime > 0 ? totalScore / (roundTime / 6) : 0;
  const [pool, tier] = ratio >= 0.6 ? [MESSAGES_EXCELLENT, "great"] : ratio >= 0.4 ? [MESSAGES_DECENT, "ok"] : [MESSAGES_LOW, "poor"];
  let idx;
  do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastShownMessageIndex[tier] && pool.length > 1);
  lastShownMessageIndex[tier] = idx;
  return { message: pool[idx](correctCount, totalScore), tier, count: correctCount, totalScore };
}

function GameSetupScreen({ onStart, gameMode, setGameMode, lsNames, setLsNames, onStartLS, lsActiveLetters, setLsActiveLetters }) {
  const [names, setNames] = useState(["", "", ""]);
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_SECONDS);
  const [teamMode, setTeamMode] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(() => new Set(CATEGORIES.map((c) => c.id)));
  const [teamSizes, setTeamSizes] = useState([2, 2]);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2"]);
  const [wrGameMode, setWrGameMode] = useState("klassiek"); // "klassiek" | "taboe"
  const [showAllCategories, setShowAllCategories] = useState(false);

  const allCategoryIds = CATEGORIES.map((c) => c.id);
  const allSelected = allCategoryIds.every((id) => selectedCategories.has(id));

  const toggleTeamMode = () => {
    setTeamMode((prev) => {
      if (!prev) { setTeamSizes([2, 2]); setTeamNames(["Team 1", "Team 2"]); setNames(Array(4).fill("")); }
      else { setNames(["", "", ""]); }
      return !prev;
    });
  };

  const addPlayer = () => {
    if (teamMode) {
      if (teamSizes.length < 10) { const ns = [...teamSizes, 2]; setTeamSizes(ns); setTeamNames(p => [...p, `Team ${p.length + 1}`]); setNames(p => [...p, "", ""]); }
    } else { if (names.length < 10) setNames(p => [...p, ""]); }
  };
  const removePlayer = (index) => {
    if (teamMode) {
      if (teamSizes.length > 2) {
        const ns = teamSizes.filter((_, i) => i !== index); setTeamSizes(ns);
        setTeamNames(p => p.filter((_, i) => i !== index));
        let offset = 0; for (let i = 0; i < index; i++) offset += teamSizes[i];
        const numToRemove = teamSizes[index];
        setNames(p => { const n = [...p]; n.splice(offset, numToRemove); return n; });
      }
    } else { if (names.length > 2) setNames(p => p.filter((_, i) => i !== index)); }
  };
  const addPlayerToTeam = (t) => {
    if (teamSizes[t] >= 10) return;
    const offset = teamSizes.slice(0, t + 1).reduce((a, b) => a + b, 0);
    setTeamSizes(p => p.map((s, i) => i === t ? s + 1 : s));
    setNames(p => { const n = [...p]; n.splice(offset, 0, ""); return n; });
  };
  const removePlayerFromTeam = (t) => {
    if (teamSizes[t] <= 2) return;
    const offset = teamSizes.slice(0, t + 1).reduce((a, b) => a + b, 0);
    setTeamSizes(p => p.map((s, i) => i === t ? s - 1 : s));
    setNames(p => { const n = [...p]; n.splice(offset - 1, 1); return n; });
  };
  const updateName = (i, v) => setNames(p => p.map((n, j) => j === i ? v : n));
  const canStart = names.every((n) => n.trim().length > 0) && selectedCategories.size > 0;

  const buildTeams = () => {
    if (!teamMode) return null;
    const trimmed = names.map(n => n.trim());
    const result = []; let offset = 0;
    for (let t = 0; t < teamSizes.length; t++) { result.push({ name: teamNames[t] || `Team ${t + 1}`, players: trimmed.slice(offset, offset + teamSizes[t]) }); offset += teamSizes[t]; }
    return result;
  };

  const totalWordsCount = Array.from(selectedCategories).reduce((total, catId) => total + (WORDS_BY_CATEGORY[catId]?.length || 0), 0);
  const absoluteTotalWords = CATEGORIES.reduce((total, cat) => total + (WORDS_BY_CATEGORY[cat.id]?.length || 0), 0);
  const toggleCategory = (id) => {
    setSelectedCategories(prev => {
      if (id === "all") return allSelected ? new Set() : new Set(allCategoryIds);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const handleStart = () => { if (!canStart) return; onStart(names.map(n => n.trim()), roundTime, buildTeams(), selectedCategories, wrGameMode); };
  const getTeamOffset = (t) => teamSizes.slice(0, t).reduce((a, b) => a + b, 0);

  return (
    <div className="screen">
      <div className="setup-card">
        {/* Game mode switcher */}
        <div className="game-mode-switcher">
          <button
            className={`game-mode-btn ${gameMode === "woordraad" ? "game-mode-active" : "game-mode-inactive"}`}
            onClick={() => setGameMode("woordraad")}
          >
            <span className="gm-icon">💬</span>
            <span className="gm-label">WoordRaad</span>
          </button>
          <button
            className={`game-mode-btn ${gameMode === "lettersnel" ? "game-mode-active-ls" : "game-mode-inactive"}`}
            onClick={() => setGameMode("lettersnel")}
          >
            <span className="gm-icon">🎯</span>
            <span className="gm-label">LetterSnel</span>
          </button>
        </div>

        {gameMode === "lettersnel" ? (
          <>
            <div className="logo-area" style={{marginBottom: "36px"}}>
              <div className="logo-icon">🎯</div>
              <h1 className="logo-title" style={{background:"linear-gradient(135deg,#f59e0b,#ef4444,#f97316)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent"}}>LetterSnel</h1>
              <p className="logo-sub">Noem een woord dat start met de letter!</p>
            </div>
            <LetterSnelSetupPanel onStartLS={onStartLS} names={lsNames} setNames={setLsNames} activeLetters={lsActiveLetters} setActiveLetters={setLsActiveLetters} />
          </>
        ) : (
          <>
            <div className="logo-area">
              <div className="logo-icon">💬</div>
              <h1 className="logo-title">WoordRaad</h1>
              <p className="logo-sub">Leg het woord uit terwijl de rest raadt!</p>
            </div>

            {/* WoordRaad modus kiezer */}
            <div className="ls-mode-wrap" style={{borderColor:"#60a5fa"}}>
              <div className="setup-wrapper-badge" style={{background:"#2563eb", top:"-14px"}}>MODUS</div>
              <div className="ls-mode-grid">
                <button
                  className={`ls-mode-btn ${wrGameMode === "klassiek" ? "ls-mode-btn-active" : "ls-mode-btn-inactive"}`}
                  onClick={() => setWrGameMode("klassiek")}
                  style={wrGameMode === "klassiek" ? {borderColor:"#60a5fa", background:"rgba(96,165,250,0.15)"} : {}}
                >
                  <span className="ls-mode-icon">🤔</span>
                  <span className="ls-mode-title">Klassiek</span>
                  <span className="ls-mode-desc">Leg of beeld zoveel mogelijk woorden uit binnen de tijd.</span>
                </button>
                <button
                  className={`ls-mode-btn ${wrGameMode === "taboe" ? "ls-mode-btn-active" : "ls-mode-btn-inactive"}`}
                  onClick={() => setWrGameMode("taboe")}
                  style={wrGameMode === "taboe" ? {borderColor:"#60a5fa", background:"rgba(96,165,250,0.15)"} : {}}
                >
                  <span className="ls-mode-icon">🤫</span>
                  <span className="ls-mode-title">Taboe</span>
                  <span className="ls-mode-desc">Leg het woord uit zonder de verboden letter te noemen.</span>
                </button>
              </div>
            </div>

            <div className="setup-section">
              {/* Solo/Teams toggle — gedeeld tussen beide branches */}
              {(() => {
                const SoloTeamsToggle = () => (
                  <div className="setup-mode-segmented" style={{marginBottom: "16px"}}>
                    <button className={`mode-seg-btn ${!teamMode ? "mode-seg-active" : "mode-seg-inactive"}`} onClick={() => teamMode && toggleTeamMode()}>👤 Solo</button>
                    <button className={`mode-seg-btn ${teamMode ? "mode-seg-active" : "mode-seg-inactive"}`} onClick={() => !teamMode && toggleTeamMode()}>👥 Teams</button>
                  </div>
                );
                return teamMode ? (
                <div className="teams-setup-wrapper">
                  <div className="setup-wrapper-badge">TEAMS</div>
                  <SoloTeamsToggle />
                  <div className="teams-grid">
                    {teamSizes.map((size, t) => {
                      const offset = getTeamOffset(t);
                      return (
                        <div key={t} className="team-section-container">
                          <div className="team-header-row">
                            <input className="team-name-input-flat" value={teamNames[t] ?? `Team ${t + 1}`} onChange={e => setTeamNames(p => p.map((n, i) => i === t ? e.target.value : n))} maxLength={12} />
                            {teamSizes.length > 2 && <button className="delete-btn-round" onClick={() => removePlayer(t)} title="Team verwijderen">✕</button>}
                          </div>
                          <div className="team-players-list">
                            {Array.from({ length: size }, (_, p) => {
                              const idx = offset + p;
                              return (
                                <div key={idx} className="player-input-group small-group">
                                  <div className="player-name-container player-bg">
                                    <span className="player-index-badge">{p + 1}</span>
                                    <input className="integrated-name-input" placeholder={`Speler ${p + 1}`} value={names[idx] ?? ""} onChange={e => updateName(idx, e.target.value)} maxLength={16} />
                                  </div>
                                  {size > 2 && <button className="integrated-delete-btn btn-subtle" onClick={() => removePlayerFromTeam(t)}>−</button>}
                                </div>
                              );
                            })}
                          </div>
                          {size < 10 && <button className="add-player-integrated add-player-in-team" onClick={() => addPlayerToTeam(t)}>Speler toevoegen</button>}
                        </div>
                      );
                    })}
                  </div>
                  {teamSizes.length < 6 && <button className="add-player-integrated dashed team-add-btn" onClick={addPlayer}>Team toevoegen</button>}
                </div>
              ) : (
                <div className="teams-setup-wrapper">
                  <div className="setup-wrapper-badge">SPELERS</div>
                  <SoloTeamsToggle />
                  <div className="names-grid">
                    {names.map((name, i) => (
                      <PlayerNameField
                        key={i}
                        index={i}
                        value={name}
                        onChange={v => updateName(i, v)}
                        onRemove={() => removePlayer(i)}
                        canRemove={names.length > 2}
                      />
                    ))}
                    {names.length < 10 && <button className="add-player-integrated" onClick={addPlayer}>Speler toevoegen</button>}
                  </div>
                </div>
              );
              })()}
            </div>

            {(wrGameMode === "klassiek" || wrGameMode === "taboe") && (
            <div className="setup-section-wrap" style={{borderColor: "#60a5fa"}}>
              <div className="setup-wrapper-badge" style={{background: "#2563eb"}}>CATEGORIEËN</div>
              <div className="cat-word-count">{totalWordsCount} / {absoluteTotalWords} woorden</div>
              <div className="category-grid">
                {(showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 8)).map(cat => (
                  <button key={cat.id} className={`category-btn${selectedCategories.has(cat.id) ? " category-btn-active" : ""}`} onClick={() => toggleCategory(cat.id)}>{cat.label}</button>
                ))}
                {!showAllCategories && (
                  <button className="category-btn cat-expand-btn" onClick={() => setShowAllCategories(true)}>
                    +{CATEGORIES.length - 8} meer
                  </button>
                )}
              </div>
            </div>
            )}

            <div className="setup-section-wrap" style={{borderColor: "#60a5fa"}}>
              <div className="setup-wrapper-badge">RONDETIJD</div>
              <div className="time-control">
                <div className="time-click-wrap">
                  <div className="time-click-zone time-click-left" onClick={() => setRoundTime(t => Math.max(30, t - 30))}>
                    <span className={`time-click-symbol${roundTime <= 30 ? " time-click-disabled" : ""}`}>−</span>
                  </div>
                  <span className="time-display">{roundTime}s</span>
                  <div className="time-click-zone time-click-right" onClick={() => setRoundTime(t => Math.min(300, t + 30))}>
                    <span className={`time-click-symbol${roundTime >= 300 ? " time-click-disabled" : ""}`}>+</span>
                  </div>
                </div>
              </div>
            </div>

            <button className={`start-btn ${canStart ? "ready-solid" : ""}`} onClick={handleStart} disabled={!canStart}>
              {canStart ? "Spel starten ➜" : "Vul alles in…"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PlayerHandoffScreen({ player, teamName, onReady }) {
  return (
    <div className="screen handoff-screen">
      <div className="handoff-card">
        <div className="handoff-icon">📱</div>
        <p className="handoff-sub">Geef de telefoon aan</p>
        <h2 className="handoff-name">{player}</h2>
        {teamName && <p className="handoff-team">{teamName}</p>}
        <button className="handoff-btn" onClick={onReady}>Start ronde ➜</button>
      </div>
    </div>
  );
}

function ActiveRoundScreen({ player, words, onRoundEnd, roundTime, initialPoints = 0, initialSkips = 0 }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [scores, setScores] = useState({ correct: 0, skipped: 0, points: 0 });
  const scoresRef = useRef({ correct: 0, skipped: 0, points: 0 });
  const endMessageRef = useRef(null);
  const [timeRemaining, setTimeRemaining] = useState(roundTime);
  const [flash, setFlash] = useState(null);
  const [timesUp, setTimesUp] = useState(false);
  const timesUpRef = useRef(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const [graceCountdown, setGraceCountdown] = useState(null);
  const wordResultsRef = useRef([]);
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
        if (penaltyRef.current) {
          clearInterval(penaltyRef.current);
          penaltyRef.current = null;
          skipPenaltyRef.current = 0;
          setSkipPenalty(0);
          finishRoundRef.current(scoresRef.current, wordIndexRef.current);
        } else {
          let graceTime = 10;
          setGraceCountdown(graceTime);
          graceTimerRef.current = setInterval(() => {
            graceTime -= 1;
            setGraceCountdown(graceTime);
            if (graceTime <= 0) {
              clearInterval(graceTimerRef.current);
              graceTimerRef.current = null;
              const currentWord = words[wordIndexRef.current];
              if (currentWord) {
                wordResultsRef.current.push({ word: currentWord, guessed: false, isBonus: getBonusPointValue(currentWord) > 0, bonusPts: 0 });
                scoresRef.current = { ...scoresRef.current, skipped: scoresRef.current.skipped + 1 };
                setScores(s => ({ ...s, skipped: s.skipped + 1 }));
              }
              finishRoundRef.current(scoresRef.current, wordIndexRef.current);
            }
          }, 1000);
        }
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [roundTime]);

  const triggerFlash = (type) => { setFlash(type); setTimeout(() => setFlash(null), 350); };
  const wordIndexRef = useRef(0);
  const [skipPenalty, setSkipPenalty] = useState(0);
  const penaltyRef = useRef(null);
  const skipPenaltyRef = useRef(0);
  const roundEndTimeoutRef = useRef(null);
  const skipCountRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const streakRef = useRef(0);
  const maxStreakRef = useRef(0);

  const finishRound = (finalScores, finalWordIndex) => {
    if (graceTimerRef.current) { clearInterval(graceTimerRef.current); graceTimerRef.current = null; }
    const totalScore = finalScores.correct + wordResultsRef.current.reduce((sum, r) => sum + (r.bonusPts || 0), 0);
    endMessageRef.current = pickRoundEndMessage(finalScores.correct, roundTime, totalScore);
    setDone(true);
    roundEndTimeoutRef.current = setTimeout(() => onRoundEnd({ ...finalScores, wordsUsed: finalWordIndex, wordResults: wordResultsRef.current, maxStreak: maxStreakRef.current }), 3000);
  };
  const finishRoundRef = useRef(null);
  finishRoundRef.current = finishRound;

  const correct = () => {
    if (done || skipPenaltyRef.current > 0) return;
    const word = words[wordIndexRef.current];
    const bonusPts = getBonusPointValue(word);
    const isBonus = bonusPts > 0;
    playCorrectSound();
    triggerFlash(isBonus ? "bonus" : "correct");
    wordResultsRef.current.push({ word, guessed: true, isBonus, bonusPts });
    const newScores = { correct: scoresRef.current.correct + 1, skipped: scoresRef.current.skipped, points: scoresRef.current.points + 1 + bonusPts };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    const newStreak = streakRef.current + 1;
    streakRef.current = newStreak;
    if (newStreak > maxStreakRef.current) maxStreakRef.current = newStreak;
    setStreak(newStreak);
    if (timesUpRef.current) finishRound(newScores, wordIndexRef.current);
  };

  const skip = () => {
    if (done || skipPenaltyRef.current > 0) return;
    const word = words[wordIndexRef.current];
    playSkipSound();
    triggerFlash("skip");
    wordResultsRef.current.push({ word, guessed: false, isBonus: getBonusPointValue(word) > 0, bonusPts: 0 });
    const newScores = { ...scoresRef.current, skipped: scoresRef.current.skipped + 1 };
    scoresRef.current = newScores;
    setScores(newScores);
    wordIndexRef.current += 1;
    setWordIndex(wordIndexRef.current);
    streakRef.current = 0;
    setStreak(0);
    if (timesUpRef.current) { finishRound(newScores, wordIndexRef.current); return; }
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
        if (timesUpRef.current) finishRound(scoresRef.current, wordIndexRef.current);
      }
    }, 1000);
  };

  useEffect(() => () => { clearInterval(penaltyRef.current); clearInterval(graceTimerRef.current); clearTimeout(roundEndTimeoutRef.current); }, []);

  const pct = timeRemaining / roundTime;
  const timeLeft = Math.ceil(timeRemaining);
  const timerColor = timesUp ? "#f87171" : timeLeft > 30 ? "#4ade80" : timeLeft > 10 ? "#fbbf24" : "#f87171";
  const currentWord = words[wordIndex];
  const isCurrentBonus = currentWord ? getBonusPointValue(currentWord) > 0 : false;

  return (
    <div className={`screen round-screen${getFlashClass(flash)} ${done ? "round-done" : ""}`}>
      <div style={{width:"100%", maxWidth:"420px"}}>

        {/* WoordRaad header */}
        <div className="ls-header">
          <div className="wr-logo">WoordRaad</div>
          <span className="round-player" style={{fontSize:"22px", textAlign:"right"}}>{player}</span>
        </div>

        {/* Timer balk */}
        <TimerProgressBar pct={pct} color={timerColor} empty={timesUp} />

        {/* Timer midden, stats rechts */}
        <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", marginBottom:"8px"}}>
          <span style={{fontFamily:"'Righteous', cursive", fontSize:"22px", color:timerColor, flex:1, textAlign:"left"}}>
            <TimerCountdown secs={timeLeft} timesUp={timesUp} />
          </span>
          <div className="round-stats" style={{justifyContent:"flex-end"}}>
            <span className={`stat ${streak >= 3 ? "correct-stat-fire" : "correct-stat"}`}>
              <span className="stat-icon">{streak >= 3 ? "🔥" : "✓"}</span>
              <span>{initialPoints + scores.points}</span>
            </span>
            <span className="stat skip-stat">
              <span className="stat-icon">✗</span>
              <span>{initialSkips + scores.skipped}</span>
            </span>
          </div>
        </div>

      </div>
      <div className="word-stage">
        {done ? (() => {
          const result = endMessageRef.current;
          const n = result.count;
          return (
            <div className="word-done-wrap">
              <div className="word-done-count">{n} {w(n)} · {result.totalScore} {pt(result.totalScore)}</div>
              <div className={`word-done-msg tier-${result.tier}`}>{result.message}</div>
            </div>
          );
        })() : skipPenalty > 0 ? (
          <div className="penalty-wrap">
            <div className="penalty-label">⏭️ Overgeslagen</div>
            <div className="penalty-bar-track">
              <div className="penalty-bar-fill" style={{ animationDuration: `${skipCountRef.current === 1 ? 3 : skipCountRef.current === 2 ? 5 : 7}s` }} />
            </div>
            <div className="penalty-sublabel">{skipCountRef.current === 1 ? "3 seconden wachten…" : skipCountRef.current === 2 ? "5 seconden wachten…" : "7 seconden wachten…"}</div>
          </div>
        ) : (
          <>
            <div className="word-anchor">
              <div className="word-counter">woord {wordIndex + 1}</div>
              <div key={wordIndex} className={`current-word${isCurrentBonus ? " bonus-word" : ""}`}>{currentWord ? insertSoftHyphens(currentWord) : "— geen woorden meer —"}</div>
              <div className={`times-up-banner${timesUp ? ' grace-active' : isCurrentBonus ? ' bonus-banner' : ' category-banner'}`}>
                {timesUp
                  ? <span>Tijd is op — nog <span className="grace-countdown">{graceCountdown !== null ? graceCountdown : '…'}</span>s om te raden!</span>
                  : isCurrentBonus ? '⭐ BONUSGEZEGDE — 3 punten!'
                  : currentWord ? (WORD_TO_CATEGORY[currentWord]?.label ?? '📦 Categorie') : ''}
              </div>
            </div>
          </>
        )}
      </div>
      {!done && (
        <div className="action-row">
          <button onClick={skip} disabled={skipPenalty > 0} className={`action-btn skip-btn${skipPenalty > 0 ? " btn-disabled" : ""}`}>✗ Skip</button>
          <button onClick={correct} disabled={skipPenalty > 0} className={`action-btn correct-btn${skipPenalty > 0 ? " btn-disabled" : ""}`} style={{flex:2}}>✓ Goed</button>
        </div>
      )}
    </div>
  );
}

function ScoreboardScreen({ players, scores, currentRound, totalRounds, onNext, onRestart, onContinue, onShowStats, teams, teamScores, onStartTiebreaker }) {
  const isLast = currentRound >= totalRounds;
  const sortedTeams = teams ? [...teams].map((t, i) => ({ ...t, originalIndex: i, totalScore: teamScores[i], avgScore: teamScores[i] === null ? null : Math.round((teamScores[i] / t.players.length) * 10) / 10 })).sort((a, b) => { if (a.avgScore === null && b.avgScore === null) return 0; if (a.avgScore === null) return 1; if (b.avgScore === null) return -1; return b.avgScore - a.avgScore; }) : null;
  const sortedPlayers = !teams ? [...players].map((p, i) => ({ name: p, score: scores[i] })).sort((a, b) => { if (a.score === null && b.score === null) return 0; if (a.score === null) return 1; if (b.score === null) return -1; return b.score - a.score; }) : null;
  let tiedPlayerIndices = null;
  if (isLast && !teams) {
    const topScore = Math.max(...scores.filter(s => s !== null));
    const tied = scores.map((s, i) => ({ s, i })).filter(x => x.s !== null && x.s === topScore);
    if (tied.length > 1) tiedPlayerIndices = tied.map(x => x.i);
  }
  const topAvg = sortedTeams ? (sortedTeams.find(t => t.avgScore !== null)?.avgScore ?? null) : null;
  if (isLast && teams) {
    const tiedTeams = topAvg !== null ? sortedTeams.filter(t => t.avgScore === topAvg) : [];
    if (tiedTeams.length > 1) {
      tiedPlayerIndices = tiedTeams.flatMap(team => {
        let offset = 0;
        for (let t = 0; t < team.originalIndex; t++) offset += teams[t].players.length;
        return team.players.map((_, i) => offset + i);
      });
    }
  }
  return (
    <div className="screen">
      <div className="score-card">
        <h2 className="score-title">{isLast ? "🏆 Eindstand" : `Stand na ronde ${currentRound}`}</h2>
        {isLast && tiedPlayerIndices && (
          <button className="tiebreaker-start-btn" onClick={() => onStartTiebreaker(tiedPlayerIndices)}>🤝 Gelijkspel! Start een tie-breaker.</button>
        )}
        <div className="scores-list">
          {sortedTeams ? (() => {
            const medals = ["🥇","🥈","🥉"];
            const getTeamEffectiveRank = (avgScore) => avgScore === null ? null : sortedTeams.filter(t2 => t2.avgScore !== null && t2.avgScore > avgScore).length + 1;
            const interimFirstPlaceTied = !isLast && topAvg !== null && sortedTeams.filter(t => t.avgScore === topAvg).length > 1;
            return sortedTeams.map((team, i) => {
              const effectiveRank = getTeamEffectiveRank(team.avgScore);
              const hasPlayed = team.avgScore !== null;
              const isTiedFinal = isLast && hasPlayed && team.avgScore === topAvg && sortedTeams.filter(t => t.avgScore === topAvg).length > 1;
              const isTiedInterim = interimFirstPlaceTied && team.avgScore === topAvg;
              const badge = isLast ? (!hasPlayed ? "—" : isTiedFinal ? "👑" : (medals[effectiveRank - 1] ?? effectiveRank)) : (!hasPlayed ? "—" : team.avgScore === topAvg ? "👑" : effectiveRank);
              const interimClass = !hasPlayed ? "rank-interim-unplayed" : isTiedInterim ? "rank-interim-tied" : "rank-interim";
              const rowClass = `score-row rank-${effectiveRank ?? 99} ${isLast ? (isTiedFinal ? "rank-tied" : "rank-final") : interimClass}`;
              return (
                <div key={`${team.originalIndex}-${team.name}`} className={rowClass}>
                  <span className="rank-badge">{badge}</span>
                  <div className="score-name-block">
                    <span className="score-name">{team.name}</span>
                    <span className="score-members">{team.players.join(", ")}</span>
                  </div>
                  <div className="score-row-right">
                    <span className="score-pts">{hasPlayed ? `⌀ ${team.avgScore} pt` : "—"}</span>
                    {hasPlayed && <div className="score-row-subtext">totaal {team.totalScore}</div>}
                  </div>
                </div>
              );
            });
          })() : (() => {
            const topScore = sortedPlayers.find(p => p.score !== null)?.score ?? null;
            const medals = ["🥇","🥈","🥉"];
            const getEffectiveRank = (score) => score === null ? null : sortedPlayers.filter(p2 => p2.score !== null && p2.score > score).length + 1;
            const interimFirstPlaceTied = !isLast && topScore !== null && sortedPlayers.filter(p => p.score === topScore).length > 1;
            return sortedPlayers.map((p, i) => {
              const effectiveRank = getEffectiveRank(p.score);
              const isTiedFinal = isLast && topScore !== null && p.score === topScore && sortedPlayers.filter(p2 => p2.score === topScore).length > 1;
              const isTiedInterim = interimFirstPlaceTied && p.score === topScore;
              const originalIdx = players.indexOf(p.name);
              const hasPlayed = p.score !== null;
              const isTopScore = topScore !== null && p.score === topScore;
              const badge = isLast ? (isTiedFinal ? "👑" : (medals[effectiveRank - 1] ?? effectiveRank)) : (!hasPlayed ? "—" : isTopScore ? "👑" : effectiveRank);
              const interimClass = !hasPlayed ? "rank-interim-unplayed" : isTiedInterim ? "rank-interim-tied" : (isTopScore ? "rank-interim" : "rank-interim-played");
              const rowClass = `score-row rank-${effectiveRank ?? 99} ${isLast ? (isTiedFinal ? "rank-tied" : "rank-final") : interimClass}`;
              return (
                <div key={p.name} className={rowClass + ((isLast || hasPlayed) ? " cursor-pointer" : "")} onClick={(isLast || hasPlayed) ? () => onShowStats(originalIdx) : undefined}>
                  <span className="rank-badge">{badge}</span>
                  <span className="score-name">{p.name}</span>
                  <span className="score-pts">{p.score !== null ? `${p.score} pt` : "—"}</span>
                </div>
              );
            });
          })()}
        </div>
        {isLast ? (
          <div className="final-btns">
            <button className="score-btn continue-btn" onClick={onContinue}>Nog een ronde ➜</button>
            <button className="score-btn restart-btn" onClick={onRestart}>Nieuw spel</button>
          </div>
        ) : (
          <button className="score-btn next-btn" onClick={onNext}>Volgende speler ➜</button>
        )}
      </div>
    </div>
  );
}

function PlayerStatsScreen({ players, playerStats, scores, initialPlayer, roundTime, onBack, variant = "klassiek" }) {
  const isTaboe = variant === "taboe";
  const [activePlayer, setActivePlayer] = useState(initialPlayer ?? 0);
  const ps = playerStats[activePlayer];
  if (!ps) return null;
  const allRounds = ps.rounds;
  const totalCorrect = allRounds.reduce((s, r) => s + r.correct, 0);
  const totalSkipped = allRounds.reduce((s, r) => s + r.skipped, 0);
  // Bonus en streak alleen in Klassiek-modus
  const totalBonus = isTaboe ? 0 : allRounds.reduce((s, r) => s + (r.bonusPoints || 0), 0);
  const longestStreak = isTaboe ? 0 : allRounds.reduce((max, r) => Math.max(max, r.maxStreak || 0), 0);
  const bestRound = isTaboe
    ? allRounds.reduce((best, r, i) => r.correct > (best?.correct ?? -1) ? { ...r, idx: i } : best, null)
    : allRounds.reduce((best, r, i) => { const pts = r.correct + (r.bonusPoints || 0); const bestPts = (best?.correct || 0) + (best?.bonusPoints || 0); return pts > bestPts ? { ...r, idx: i } : best; }, null);
  const bestPts = bestRound ? (isTaboe ? bestRound.correct : bestRound.correct + (bestRound.bonusPoints || 0)) : 0;
  const allWordResults = allRounds.flatMap(r => r.wordResults || []);
  const guessedWords = allWordResults.filter(w => w.guessed);
  const skippedWords = allWordResults.filter(w => !w.guessed);
  return (
    <div className="screen">
      <div className="stats-card">
        <div className="stats-header-row">
          <button className="stats-back-btn" onClick={onBack} title="Terug naar scorebord"><span className="stats-back-icon">➜</span></button>
          <h2 className="score-title stats-header-title">📊 Statistieken</h2>
          <div className="stats-header-spacer" />
        </div>
        <div className="stats-tabs">
          {players.map((p, i) => (<button key={i} className={`stats-tab${activePlayer === i ? " stats-tab-active" : ""}`} onClick={() => setActivePlayer(i)}>{p}</button>))}
        </div>
        <div className="stats-player-name">{players[activePlayer]}</div>
        <div className="stats-total-score">{scores[activePlayer] ?? 0} {pt(scores[activePlayer] ?? 0)}</div>
        <div className="stats-grid">
          <div className="stats-cell stats-cell-correct"><div className="stats-cell-val">{totalCorrect}</div><div className="stats-cell-lbl">✓ Geraden</div></div>
          {!isTaboe && <div className="stats-cell stats-cell-bonus"><div className="stats-cell-val">{totalBonus}</div><div className="stats-cell-lbl">⭐ Bonus</div></div>}
          <div className="stats-cell stats-cell-skip"><div className="stats-cell-val">{totalSkipped}</div><div className="stats-cell-lbl">↷ Geskipt</div></div>
          {!isTaboe && <div className="stats-cell stats-cell-streak"><div className="stats-cell-val">{longestStreak > 0 ? `${longestStreak}` : longestStreak}</div><div className="stats-cell-lbl">🔥 Streak</div></div>}
        </div>
        {bestRound && (<div className="stats-best">✨ Ronde {bestRound.idx + 1} was je beste ronde met {bestPts} {pt(bestPts)}</div>)}
        <div className="stats-words-section">
          <div className="stats-words-col">
            <div className="stats-words-title stats-green">✓ Goed geraden ({guessedWords.length})</div>
            <div className="stats-words-list">
              {guessedWords.map((wr, i) => (
                <span key={i} className={`stats-word-chip${!isTaboe && wr.isBonus ? " stats-word-bonus" : ""}`}>
                  {wr.word}{!isTaboe && wr.isBonus ? " ⭐" : ""}
                </span>
              ))}
            </div>
          </div>
          <div className="stats-words-col">
            <div className="stats-words-title stats-red">↷ Geskipt ({skippedWords.length})</div>
            <div className="stats-words-list">
              {skippedWords.map((wr, i) => (<span key={i} className="stats-word-chip stats-word-skipped">{wr.word}</span>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TiebreakerCategoryPickerScreen({ candidateCategories, onCategoryChosen }) {
  return (
    <div className="screen">
      <div className="score-card">
        <h2 className="score-title tiebreaker-title">⚡ Tie-breaker</h2>
        <p className="tiebreaker-subtitle">Kies samen een categorie.<br/>Alle spelers krijgen een woord uit dezelfde categorie.</p>
        <div className="tiebreaker-cat-list">
          {(candidateCategories || []).map(cat => (<button key={cat.id} onClick={() => onCategoryChosen(cat.id)} className="tiebreaker-cat-btn">{cat.label}</button>))}
        </div>
      </div>
    </div>
  );
}

function TiebreakerRoundScreen({ players, tiebreakerState, onCategoryChosen, onWordGuessed, onRestart, onStartTiebreaker }) {
  const { tiedPlayerIndices, tiedTeamGroups, candidateCategories, chosenCategoryId, words, categoryLabel, times, currentStep } = tiebreakerState;
  const allDone = currentStep >= tiedPlayerIndices.length;
  const [subPhase, setSubPhase] = useState('handoff');
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => { setSubPhase('handoff'); setElapsed(0); clearInterval(timerRef.current); }, [currentStep]);
  useEffect(() => () => clearInterval(timerRef.current), []);
  if (!chosenCategoryId) return <TiebreakerCategoryPickerScreen candidateCategories={candidateCategories} onCategoryChosen={onCategoryChosen} />;
  const startRound = () => { setSubPhase('round'); startTimeRef.current = Date.now(); timerRef.current = setInterval(() => setElapsed((Date.now() - startTimeRef.current) / 1000), 50); };
  const handleGuessed = () => { clearInterval(timerRef.current); playCorrectSound(); const finalTime = (Date.now() - startTimeRef.current) / 1000; setElapsed(finalTime); setSubPhase('handoff'); onWordGuessed(finalTime); };
  const currentPlayerIdx = allDone ? null : tiedPlayerIndices[currentStep];
  const currentWord = allDone ? null : words[currentStep];
  if (allDone) {
    if (tiedTeamGroups) {
      const teamResults = tiedTeamGroups.map(group => {
        const groupTimes = group.playerIndices.map(pi => { const stepIdx = tiedPlayerIndices.indexOf(pi); return times[stepIdx]; });
        const avgTime = groupTimes.reduce((a, b) => a + b, 0) / groupTimes.length;
        return { teamName: group.teamName, avgTime, playerResults: group.playerIndices.map((pi, idx) => ({ name: players[pi], time: groupTimes[idx] })) };
      }).sort((a, b) => a.avgTime - b.avgTime);
      const winnerTime = Math.round(teamResults[0].avgTime * 100) / 100;
      const hasJointWinner = teamResults.filter(r => Math.round(r.avgTime * 100) / 100 === winnerTime).length > 1;
      return (
        <div className="screen"><div className="score-card">
          <h2 className="score-title">⚡ Tie-breaker resultaten</h2>
          {hasJointWinner ? (<button className="tiebreaker-start-btn" onClick={() => { const si = teamResults.filter(tr => Math.round(tr.avgTime*100)/100===winnerTime).flatMap(tr => { const g = tiedTeamGroups.find(g=>g.teamName===tr.teamName); return g?g.playerIndices:[]; }); onStartTiebreaker(si); }}>🤝 Nog steeds gelijkspel! Start opnieuw.</button>) : (<div className="tiebreaker-result-banner tiebreaker-result-winner"><span className="tiebreaker-result-text-winner">🏆 {teamResults[0].teamName} wint de tie-breaker!</span></div>)}
          <div className="scores-list">
            {teamResults.map((tr, i) => {
              const tieBadges = ["🥇","🥈","🥉"];
              const sortedPs = [...tr.playerResults].sort((a,b)=>a.time-b.time);
              const isTied = Math.round(tr.avgTime*100)/100===winnerTime&&hasJointWinner;
              const rowClass = isTied?'score-row rank-1 rank-tied':`score-row rank-${i+1} rank-final`;
              return (<div key={tr.teamName} className="tiebreaker-team-block"><div className={rowClass+" tiebreaker-team-row"}><span className="rank-badge">{isTied?'👑':(tieBadges[i]??i+1)}</span><span className="score-name">{tr.teamName}</span><span className="score-pts tiebreaker-pts">⌀ {tr.avgTime.toFixed(2)}s</span></div><div className="tiebreaker-player-list">{sortedPs.map((pr,j)=>(<div key={pr.name} className="tiebreaker-player-row"><span className="tiebreaker-player-name">{pr.name}</span><span className="tiebreaker-player-time">{pr.time.toFixed(2)}s</span></div>))}</div></div>);
            })}
          </div>
          <div className="final-btns"><button className="score-btn restart-btn" onClick={onRestart}>Nieuw spel</button></div>
        </div></div>
      );
    }
    return <TiebreakerSoloResultScreen players={players} tiedPlayerIndices={tiedPlayerIndices} times={times} onRestart={onRestart} onStartTiebreaker={onStartTiebreaker} />;
  }
  if (subPhase === 'handoff') {
    const currentTeamGroup = tiedTeamGroups?.find(g=>g.playerIndices.includes(currentPlayerIdx));
    return (
      <TiebreakerHandoffScreen
        subtitle={`TIE-BREAKER · ${currentStep+1}/${tiedPlayerIndices.length}${currentTeamGroup ? ` · ${currentTeamGroup.teamName}` : ''}`}
        player={players[currentPlayerIdx]}
        tip1="Raad z.s.m. het random woord"
        tip2={`in de categorie: ${categoryLabel}`}
        onStart={startRound}
      />
    );
  }
  const elapsedDisplay = formatElapsedTime(elapsed);
  return (
    <div className="screen round-screen">
      <div style={{width:"100%", maxWidth:"420px"}}>

        {/* Tie-Breaker header */}
        <div className="ls-header">
          <div className="wr-logo">Tie-Breaker</div>
          <span className="round-player" style={{fontSize:"22px", textAlign:"right"}}>{players[currentPlayerIdx]}</span>
        </div>

        {/* Timer balk — groeit mee met de tijd, max bij 60s */}
        <TimerProgressBar pct={Math.min(elapsed / 60, 1)} color="#fbbf24" transition="width 0.05s linear" />

        {/* Tijd links, categorie rechts */}
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px"}}>
          <span style={{fontFamily:"'Righteous', cursive", fontSize:"22px", color:"#fbbf24"}}>{elapsedDisplay}</span>
          <span className="round-stats-cat" style={{textAlign:"right"}}>{categoryLabel}</span>
        </div>

      </div>
      <div className="word-stage">
        <div className="word-anchor">
          <div className="word-counter">leg z.s.m. uit</div>
          <div className="current-word">{insertSoftHyphens(currentWord)}</div>
          <div className="times-up-banner is-hidden" aria-hidden="true" />
        </div>
      </div>
      <div className="action-row">
        <button onClick={handleGuessed} className="action-btn correct-btn">✓ Goed geraden!</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ── Main App ──────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [gameMode, setGameMode] = useState("woordraad"); // "woordraad" | "lettersnel"
  const [lsPlayers, setLsPlayers] = useState(null); // null = not started
  const [lsNames, setLsNames] = useState(["", "", ""]);
  const [lsActiveLetters, setLsActiveLetters] = useState(TABOE_LETTER_POOL);
  const [lsChosenLetters, setLsChosenLetters] = useState(TABOE_LETTER_POOL);
  const [lsChosenGameMode, setLsChosenGameMode] = useState("klassiek");
  const [lsTargetScore, setLsTargetScore] = useState(10);

  const [wrMode, setWrMode] = useState("klassiek"); // "klassiek" | "taboe"
  const [taboePlayers, setTaboePlayers] = useState(null);
  const [taboeRoundTime, setTaboeRoundTime] = useState(DEFAULT_ROUND_SECONDS);
  const [taboeCategories, setTaboeCategories] = useState(() => new Set(CATEGORIES.map(c => c.id)));

  // WoordRaad state
  const [phase, setPhase] = useState("setup");
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [wordDeck, setWordDeck] = useState([]);
  const [usedWords, setUsedWords] = useState(new Set());
  const [roundTime, setRoundTime] = useState(DEFAULT_ROUND_SECONDS);
  const [teams, setTeams] = useState(null);
  const [teamScores, setTeamScores] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => new Set());
  const [playerStats, setPlayerStats] = useState([]);
  const [tiebreakerState, setTiebreakerState] = useState(null);
  const [statsInitialPlayer, setStatsInitialPlayer] = useState(0);
  const [playOrder, setPlayOrder] = useState([]);
  const [playOrderPos, setPlayOrderPos] = useState(0);

  const totalRounds = players.length;

  const startGame = (names, time, teamsData, categories, wrGameMode) => {
    setWrMode(wrGameMode || "klassiek");
    if (wrGameMode === "taboe") {
      setTaboePlayers(names);
      setTaboeRoundTime(time);
      setTaboeCategories(categories instanceof Set ? categories : new Set(CATEGORIES.map(c => c.id)));
      return;
    }
    const empty = Array(names.length).fill(null);
    setPlayers(names); setScores(empty); setCurrentPlayerIdx(0); setRoundNum(0);
    setUsedWords(new Set()); setRoundTime(time);
    const catSet = categories instanceof Set ? categories : new Set();
    setSelectedCategory(catSet);
    const pool = buildWordPool(catSet);
    setWordDeck(shuffle(pool));
    setTeams(teamsData);
    setTeamScores(teamsData ? Array(teamsData.length).fill(null) : []);
    setPlayerStats(names.map(() => ({ rounds: [] })));
    const order = buildPlayerTurnOrder(teamsData, names.length);
    setPlayOrder(order); setPlayOrderPos(0); setCurrentPlayerIdx(order[0] ?? 0);
    setPhase("handoff");
  };

  const buildPlayerTurnOrder = (teamsData, totalPlayers) => {
    if (!teamsData) return Array.from({ length: totalPlayers }, (_, i) => i);
    const teamPlayerIndices = [];
    let offset = 0;
    for (const team of teamsData) { teamPlayerIndices.push(team.players.map((_, i) => offset + i)); offset += team.players.length; }
    teamPlayerIndices.sort((a, b) => b.length - a.length);
    const maxSize = Math.max(...teamPlayerIndices.map(t => t.length));
    const order = [];
    for (let pos = 0; pos < maxSize; pos++) for (const indices of teamPlayerIndices) if (pos < indices.length) order.push(indices[pos]);
    return order;
  };

  const getTeamIdxForPlayer = (playerIdx) => {
    if (!teams) return null;
    let offset = 0;
    for (let t = 0; t < teams.length; t++) { offset += teams[t].players.length; if (playerIdx < offset) return t; }
    return null;
  };

  const onRoundEnd = ({ correct, skipped, wordsUsed, wordResults, maxStreak }) => {
    const bonusPoints = wordResults ? wordResults.filter(r => r.guessed).reduce((sum, r) => sum + (r.bonusPts || 0), 0) : 0;
    const totalPoints = correct + bonusPoints;
    const newScores = [...scores];
    newScores[currentPlayerIdx] = (newScores[currentPlayerIdx] ?? 0) + totalPoints;
    setScores(newScores);
    if (teams) {
      const teamIdx = getTeamIdxForPlayer(currentPlayerIdx);
      if (teamIdx !== null) { const nts = [...teamScores]; nts[teamIdx] = (nts[teamIdx] ?? 0) + totalPoints; setTeamScores(nts); }
    }
    const newPlayerStats = playerStats.map((ps, i) => i !== currentPlayerIdx ? ps : { ...ps, rounds: [...ps.rounds, { correct, skipped, bonusPoints, wordResults: wordResults || [], maxStreak: maxStreak || 0 }] });
    setPlayerStats(newPlayerStats);
    const newUsed = new Set(usedWords);
    wordDeck.slice(0, wordsUsed).forEach(word => newUsed.add(word));
    setUsedWords(newUsed);
    setRoundNum(r => r + 1);
    setPhase("score");
  };

  const onNext = () => {
    const nextPos = (playOrderPos + 1) % playOrder.length;
    setPlayOrderPos(nextPos); setCurrentPlayerIdx(playOrder[nextPos]);
    const pool = buildWordPool(selectedCategory);
    const available = pool.filter(w => !usedWords.has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : pool));
    setPhase("handoff");
  };

  const onContinue = () => {
    setPlayOrderPos(0); setCurrentPlayerIdx(playOrder[0] ?? 0); setRoundNum(0);
    const pool = buildWordPool(selectedCategory);
    const available = pool.filter(w => !usedWords.has(w));
    setWordDeck(shuffle(available.length >= 10 ? available : pool));
    setPhase("handoff");
  };

  const onStartTiebreaker = (tiedPlayerIndices) => {
    const candidateCategories = buildTiebreakerCategoryOptions(selectedCategory);
    let tiedTeamGroups = null;
    let orderedTiedPlayerIndices = tiedPlayerIndices;
    if (teams) {
      const teamMap = {};
      tiedPlayerIndices.forEach(pi => { const tIdx = getTeamIdxForPlayer(pi); if (tIdx !== null) { if (!teamMap[tIdx]) teamMap[tIdx] = { teamName: teams[tIdx].name, teamIdx: tIdx, playerIndices: [] }; teamMap[tIdx].playerIndices.push(pi); } });
      tiedTeamGroups = Object.values(teamMap).sort((a, b) => b.playerIndices.length - a.playerIndices.length);
      const maxSize = Math.max(...tiedTeamGroups.map(g => g.playerIndices.length));
      orderedTiedPlayerIndices = [];
      for (let pos = 0; pos < maxSize; pos++) for (const group of tiedTeamGroups) if (pos < group.playerIndices.length) orderedTiedPlayerIndices.push(group.playerIndices[pos]);
    }
    setTiebreakerState({ tiedPlayerIndices: orderedTiedPlayerIndices, tiedTeamGroups, candidateCategories, chosenCategoryId: null, words: null, categoryLabel: null, times: tiedPlayerIndices.map(() => null), currentStep: 0 });
    setPhase('tiebreaker');
  };

  const onTiebreakerCategoryChosen = (catId) => {
    const chosenCat = CATEGORIES.find(c => c.id === catId);
    const pool = WORDS_BY_CATEGORY[catId] || [];
    const tiedIndices = tiebreakerState.tiedPlayerIndices;
    const fresh = pool.filter(w => !usedWords.has(w));
    const src = shuffle(fresh.length >= tiedIndices.length ? fresh : shuffle(pool));
    const words = src.slice(0, tiedIndices.length);
    setTiebreakerState(prev => ({ ...prev, chosenCategoryId: catId, categoryLabel: chosenCat?.label ?? '🎲', words }));
  };

  const onTiebreakerWordGuessed = (elapsedSeconds) => {
    setTiebreakerState(prev => { const nts = [...prev.times]; nts[prev.currentStep] = elapsedSeconds; return { ...prev, times: nts, currentStep: prev.currentStep + 1 }; });
  };

  const onRestart = () => {
    setPhase("setup"); setPlayers([]); setScores([]); setUsedWords(new Set()); setWordDeck([]);
    setRoundTime(DEFAULT_ROUND_SECONDS); setSelectedCategory(new Set()); setTeams(null); setTeamScores([]);
    setPlayerStats([]); setPlayOrder([]); setPlayOrderPos(0); setTiebreakerState(null);
  };

  // LetterSnel flow
  if (gameMode === "lettersnel" && lsPlayers) {
    return (
      <>
        <style>{CSS}</style>
        <LetterSnelGameRouter players={lsPlayers} onRestart={() => setLsPlayers(null)} activeLetters={lsChosenLetters} gameMode={lsChosenGameMode} targetScore={lsTargetScore} />
      </>
    );
  }

  // Taboe flow
  if (gameMode === "woordraad" && wrMode === "taboe" && taboePlayers) {
    return (
      <>
        <style>{CSS}</style>
        <TaboeRoundGame players={taboePlayers} roundTime={taboeRoundTime} selectedCategories={taboeCategories} onRestart={() => { setTaboePlayers(null); setWrMode("klassiek"); }} />
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>

      {phase === "setup" && (
        <GameSetupScreen
          onStart={startGame}
          gameMode={gameMode}
          setGameMode={(m) => { setGameMode(m); setLsPlayers(null); }}
          lsNames={lsNames}
          setLsNames={setLsNames}
          onStartLS={(names, letters, mode, tScore) => { setLsChosenLetters(letters); setLsChosenGameMode(mode); setLsTargetScore(tScore ?? 10); setLsPlayers(names); }}
          lsActiveLetters={lsActiveLetters}
          setLsActiveLetters={setLsActiveLetters}
        />
      )}

      {gameMode === "woordraad" && phase === "handoff" && (
        <PlayerHandoffScreen player={players[currentPlayerIdx]} teamName={teams ? teams[getTeamIdxForPlayer(currentPlayerIdx)]?.name : null} onReady={() => setPhase("round")} />
      )}

      {gameMode === "woordraad" && phase === "round" && (() => {
        const currentPlayerTotalPoints = scores[currentPlayerIdx] ?? 0;
        const currentPlayerTotalSkips = playerStats[currentPlayerIdx]?.rounds.reduce((sum, r) => sum + r.skipped, 0) ?? 0;
        return (
          <ActiveRoundScreen key={`${currentPlayerIdx}-${roundNum}`} player={players[currentPlayerIdx]} words={wordDeck} onRoundEnd={onRoundEnd} roundTime={roundTime} initialPoints={currentPlayerTotalPoints} initialSkips={currentPlayerTotalSkips} />
        );
      })()}

      {gameMode === "woordraad" && phase === "score" && (
        <ScoreboardScreen players={players} scores={scores} currentRound={roundNum} totalRounds={totalRounds} onNext={onNext} onRestart={onRestart} onContinue={onContinue} onShowStats={(playerIdx) => { setStatsInitialPlayer(playerIdx ?? 0); setPhase("stats"); }} teams={teams} teamScores={teamScores} onStartTiebreaker={onStartTiebreaker} />
      )}

      {gameMode === "woordraad" && phase === "tiebreaker" && tiebreakerState && (
        <TiebreakerRoundScreen players={players} tiebreakerState={tiebreakerState} onCategoryChosen={onTiebreakerCategoryChosen} onWordGuessed={onTiebreakerWordGuessed} onRestart={onRestart} onStartTiebreaker={onStartTiebreaker} />
      )}

      {gameMode === "woordraad" && phase === "stats" && (
        <PlayerStatsScreen players={players} playerStats={playerStats} scores={scores} initialPlayer={statsInitialPlayer} roundTime={roundTime} onBack={() => setPhase("score")} />
      )}
    </>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Righteous&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html, body { font-family: 'Nunito', sans-serif; background: #060d1a; min-height: 100vh; min-height: 100dvh; color: white; overflow-x: hidden; -webkit-text-size-adjust: 100%; }

  .taboe-flash-correct { animation: taboe-flash-green 0.35s ease-out; }
  .taboe-flash-skip { animation: taboe-flash-red 0.35s ease-out; }
  .taboe-flash-bonus { animation: taboe-flash-bonus 0.35s ease-out; }
  @keyframes taboe-flash-green { 0%,100% { background-color: transparent; } 30% { background-color: rgba(74,222,128,0.18); } }
  @keyframes taboe-flash-red { 0%,100% { background-color: transparent; } 30% { background-color: rgba(248,113,113,0.18); } }
  @keyframes taboe-flash-bonus { 0%,100% { background-color: transparent; } 30% { background-color: rgba(255,215,0,0.22); } }

  .screen { min-height: 100vh; min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 16px; padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); padding-bottom: max(16px, env(safe-area-inset-bottom)); position: relative; overflow: hidden; width: 100%; }
  .screen::after { content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"), url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n2)'/%3E%3C/svg%3E"); background-size: 180px 180px, 340px 340px; opacity: 0.07; mix-blend-mode: overlay; }
  .screen > * { position: relative; z-index: 1; }

  /* ── Game Mode Switcher ── */
  .game-mode-switcher { display: flex; gap: 8px; margin-bottom: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 6px; }
  .game-mode-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 7px; padding: 10px 14px; border-radius: 12px; border: none; font-family: 'Righteous', cursive; font-size: 15px; cursor: pointer; transition: all 0.22s; }
  .game-mode-active { background: rgba(96,165,250,0.18); color: #60a5fa; border: 2px solid rgba(96,165,250,0.4); }
  .game-mode-active-ls { background: rgba(245,158,11,0.18); color: #f59e0b; border: 2px solid rgba(245,158,11,0.4); }
  .game-mode-inactive { background: transparent; color: rgba(255,255,255,0.4); border: 2px solid transparent; }
  .game-mode-inactive:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }
  .gm-icon { font-size: 18px; }
  .gm-label { white-space: nowrap; }

  /* ── LS Setup ── */
  .ls-setup-section { width: 100%; }
  .ls-setup-players-wrap { border: 3px solid #f97316; border-radius: 24px; padding: 25px; background-color: rgba(0,0,0,0.02); margin-bottom: 20px; position: relative; }
  .ls-letters-wrap { border: 3px solid #f97316; border-radius: 24px; padding: 20px 16px 14px; background-color: rgba(0,0,0,0.02); margin-bottom: 20px; position: relative; }
  .ls-letter-toggle-row { display: flex; gap: 5px; justify-content: center; margin-bottom: 7px; }
  .ls-letter-toggle-btn { width: 36px; height: 36px; border-radius: 10px; border: 2.5px solid; font-family: 'Righteous', cursive; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.13s; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ls-letter-toggle-on { background: rgba(249,115,22,0.2); border-color: #f97316; color: #fed7aa; }
  .ls-letter-toggle-off { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.25); }
  .ls-letter-toggle-on:hover { background: rgba(249,115,22,0.35); border-color: #fb923c; }
  .ls-letter-toggle-off:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.6); }
  .ls-letters-count { text-align: center; font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.06em; text-transform: uppercase; margin-top: 4px; }
  .ls-mode-wrap { border: 3px solid #f97316; border-radius: 24px; padding: 20px 16px 16px; background-color: rgba(0,0,0,0.02); margin-bottom: 20px; position: relative; }
  .ls-mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .ls-mode-btn { display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 14px 10px; border-radius: 16px; border: 2.5px solid; cursor: pointer; font-family: inherit; transition: all 0.15s; text-align: center; }
  .ls-mode-btn-active { background: rgba(245,158,11,0.15); border-color: #f59e0b; }
  .ls-mode-btn-inactive { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
  .ls-mode-btn-inactive:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.25); }
  .ls-mode-icon { font-size: 22px; }
  .ls-mode-title { font-size: 13px; font-weight: 800; color: white; letter-spacing: 0.03em; }
  .ls-mode-desc { font-size: 11px; color: rgba(255,255,255,0.5); line-height: 1.3; }
  .ls-mode-btn-active .ls-mode-title { color: #fcd34d; }
  .ls-mode-btn-active .ls-mode-desc { color: rgba(252,211,77,0.7); }

  
  .ls-ketting-chip-active { border-color: #f59e0b !important; background: rgba(245,158,11,0.15) !important; }
  .ls-ketting-chip-elim { border-color: rgba(248,113,113,0.4) !important; background: rgba(248,113,113,0.08) !important; opacity: 0.55; }
  .ls-ketting-chip-winner { border-color: #4ade80 !important; background: rgba(74,222,128,0.12) !important; box-shadow: 0 0 16px rgba(74,222,128,0.2); }
  .ls-ketting-turn-name { font-weight: 800; color: #fcd34d; }

  /* ── LS Game Screen ── */
  .ls-screen { min-height: 100vh; min-height: 100dvh; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 520px; margin: 0 auto; padding: max(20px, env(safe-area-inset-top)) 16px max(20px, env(safe-area-inset-bottom)); gap: 0; position: relative; z-index: 1; justify-content: space-between; }

  .ls-header { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 16px 0 12px; }
  .ls-logo { font-family: 'Righteous', cursive; font-size: 22px; background: linear-gradient(135deg, #f59e0b, #ef4444, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .wr-logo { font-family: 'Righteous', cursive; font-size: 22px; background: linear-gradient(135deg, #60a5fa, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ls-restart-btn { background: rgba(255,255,255,0.08); border: 2px solid rgba(255,255,255,0.15); border-radius: 12px; color: rgba(255,255,255,0.6); font-family: inherit; font-size: 13px; font-weight: 700; padding: 8px 14px; cursor: pointer; transition: all 0.15s; }
  .ls-restart-btn:hover { background: rgba(255,255,255,0.15); color: white; }

  /* Scores strip */
  .ls-scores-strip { width: 100%; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; } /* kolommen worden inline overschreven op basis van spelersaantal */
  .ls-score-chip { display: flex; align-items: center; justify-content: space-between; gap: 4px; padding: 0 18px; height: 56px; border-radius: 20px; background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.12); transition: all 0.2s; overflow: hidden; }
  .ls-score-leader { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.5); }
  .ls-score-chip-name { font-size: 16px; font-weight: 700; color: rgba(255,255,255,0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ls-score-chip-val { font-family: 'Righteous', cursive; font-size: 22px; color: #f59e0b; min-width: 24px; text-align: right; flex-shrink: 0; }
  .ls-score-leader .ls-score-chip-name { color: #fde68a; }

  /* Card */
  .ls-card-area { width: 100%; margin-bottom: 24px; }
  .ls-card-label { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 8px; text-align: center; }
  .ls-card { width: 100%; border-radius: 24px; background: rgba(255,255,255,0.07); border: 3px solid rgba(255,255,255,0.14); padding: 3px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
  .ls-card-inner { background: linear-gradient(145deg, rgba(245,158,11,0.08), rgba(239,68,68,0.06)); border-radius: 21px; padding: 32px 24px; text-align: center; min-height: 120px; display: flex; align-items: center; justify-content: center; }
  .ls-card-text { font-family: 'Righteous', cursive; font-size: clamp(22px, 6vw, 36px); background: linear-gradient(135deg, #fef9c3, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.2; text-align: center; }

  /* Letter */
  .ls-letter-area { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 16px; flex: 1; justify-content: center; }
  .ls-letter { font-family: 'Righteous', cursive; font-size: clamp(150px, 48vw, 175px); line-height: 1; text-align: center; width: clamp(170px, 55vw, 200px); height: clamp(170px, 55vw, 200px); flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 28px; border: 4px solid; }
  .ls-letter-trophy { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.4); font-size: clamp(90px, 28vw, 120px); animation: ls-letter-land 0.45s cubic-bezier(0.34,1.56,0.64,1); }
  .ls-letter-spinning { color: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); animation: ls-spin-flash 0.07s infinite; }
  .ls-letter-landed { background: linear-gradient(145deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08)); border-color: rgba(245,158,11,0.5); animation: ls-letter-land 0.45s cubic-bezier(0.34,1.56,0.64,1); background-image: linear-gradient(135deg, #fef9c3, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ls-letter-placeholder { font-family: 'Righteous', cursive; font-size: clamp(150px, 48vw, 175px); color: rgba(255,255,255,0.1); line-height: 1; width: clamp(170px, 55vw, 200px); height: clamp(170px, 55vw, 200px); flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 28px; border: 4px dashed rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); }
  /* Award section */
  .ls-award-section { width: 100%; }
  .ls-award-label { font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.4); text-align: center; margin-bottom: 14px; }
  .ls-score-chip-btn { cursor: pointer; font-family: inherit; border: none; -webkit-tap-highlight-color: transparent; transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
  .ls-score-chip-btn:active { transform: scale(0.94); }


  /* ── Cards & Layout ── */
  .setup-card, .score-card, .stats-card { background: rgba(255,255,255,0.06); border: 3px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 28px 20px; width: 100%; backdrop-filter: blur(20px); overflow: hidden; }
  .setup-card { max-width: 480px; }
  .score-card { max-width: 440px; }
  .stats-card { max-width: 480px; overflow-y: auto; max-height: 92vh; }
  .logo-area { text-align: center; margin-bottom: 36px; }
  .logo-icon { font-size: 52px; margin-bottom: 8px; }
  .logo-title { font-family: 'Righteous', cursive; font-size: 36px; background: linear-gradient(135deg, #93c5fd, #60a5fa, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .logo-sub { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; }
  .setup-section { margin-bottom: 28px; }
  .setup-section-wrap { border: 3px solid; border-radius: 24px; padding: 20px 20px 14px; margin-bottom: 28px; position: relative; }
  .names-grid { display: grid; grid-template-columns: 1fr; gap: 4px; }

  /* ── Toggles & Buttons ── */
  .setup-mode-segmented { display: flex; margin-bottom: 28px; border: 2px solid rgba(255,255,255,0.15); border-radius: 14px; overflow: hidden; }
  .mode-seg-btn { flex: 1; padding: 13px 10px; font-family: 'Righteous', cursive; font-size: 17px; letter-spacing: 0.04em; cursor: pointer; border: none; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .mode-seg-active { background: rgba(74,144,226,0.18); color: #4a90e2; }
  .mode-seg-inactive { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.45); }
  .mode-seg-inactive:hover { background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7); }

  .start-btn, .handoff-btn, .continue-btn, .next-btn { position: relative; display: block; width: 100%; padding: 16px 32px; cursor: pointer; background-color: #060d1a; border-radius: 12px; border: none; font-family: 'Righteous', cursive; font-size: 20px; transition: transform 0.2s ease; z-index: 1; }
  .handoff-btn { width: max-content; margin: 0 auto; min-width: 150px; }
  .continue-btn { margin-bottom: 10px; }
  .start-btn::before, .handoff-btn::before, .continue-btn::before, .next-btn::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 12px; padding: 3px; background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }
  .start-btn, .handoff-btn, .continue-btn, .next-btn { background-image: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: transparent; }
  .start-btn:active, .handoff-btn:active, .next-btn:active { transform: scale(0.98); }
  .start-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }

  .cat-word-count { text-align: center; font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.28); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px; }
  
  .category-grid { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 4px; font-weight: 700; }
  .category-btn { font-family: inherit; font-weight: inherit; line-height: inherit; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; padding: 5px 11px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); cursor: pointer; transition: background 0.15s, border-color 0.15s, color 0.15s; user-select: none; }
  .category-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); color: white; }
  .cat-expand-btn { border-style: dashed; color: rgba(255,255,255,0.45); border-color: rgba(255,255,255,0.25); }
  .cat-expand-btn:hover { color: white; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.08); }
  .category-btn-active { background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.45); color: rgba(110,231,183,0.95); }
  .category-btn-active:hover { background: rgba(52,211,153,0.2); border-color: #34d399; color: #6ee7b7; }

  .player-input-group { display: flex; margin-bottom: 4px; height: 48px; width: 100%; }
  .player-name-container { display: flex; align-items: center; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; padding: 0 12px; flex-grow: 1; transition: border-color 0.2s; }
  .player-input-group:has(.integrated-delete-btn) .player-name-container { border-radius: 12px 0 0 12px; }
  .player-bg { background: rgba(255,255,255,0.06) !important; border: none; }
  .player-index-badge { color: rgba(255,255,255,0.3); font-weight: bold; font-size: 0.85rem; min-width: 20px; }
  .integrated-name-input { background: transparent !important; border: none !important; color: white !important; width: 100%; height: 100%; font-size: 1rem; outline: none; padding-left: 8px; }
  .integrated-delete-btn { background: #ff4757; color: white; border: none; border-radius: 0 12px 12px 0; width: 48px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: background 0.2s; }
  .integrated-delete-btn:hover { background: #ff2e44; }
  .btn-subtle { background: rgba(255,255,255,0.1) !important; color: white !important; }
  .add-player-integrated { width: 100%; height: 44px; margin-top: 8px; background: rgba(52,211,153,0.1); border: 2px dashed #34d399; border-radius: 12px; color: #34d399; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; font-size: 1rem; font-weight: 600; }
  .add-player-integrated:hover { background: rgba(52,211,153,0.2); }
  .add-player-in-team { margin-top: 12px; }

  .teams-setup-wrapper { border: 3px solid #60a5fa; border-radius: 24px; padding: 25px; background-color: rgba(0,0,0,0.02); margin-bottom: 20px; position: relative; }
  .setup-wrapper-badge { position: absolute; top: -14px; left: 20px; background-color: #3b82f6; color: white; padding: 4px 16px; border-radius: 12px; font-size: 0.75rem; font-weight: 900; letter-spacing: 1px; z-index: 1; }
  .teams-grid { display: flex; flex-direction: column; gap: 14px; }
  .team-section-container { margin-bottom: 14px; padding: 10px 0; width: 100%; background-color: transparent; border-radius: 16px; }
  .team-header-row { position: relative; display: flex; align-items: center; margin-bottom: 8px; }
  .team-name-input-flat { background: transparent !important; border: none !important; border-bottom: 2px solid rgba(74,144,226,0.4) !important; color: #4a90e2 !important; font-size: 1.1rem; font-weight: bold; text-transform: uppercase; padding: 2px 0; width: 100%; outline: none; }
  .delete-btn-round { position: absolute; right: 0; top: 0; background: rgba(0,0,0,0.02); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 10px; }
  .team-players-list { display: flex; flex-direction: column; gap: 4px; }
  .team-add-btn { margin-top: 15px; border-color: #60a5fa; color: #60a5fa; background: rgba(96,165,250,0.1); }
  .team-add-btn:hover { background: rgba(74,144,226,0.2); }
  .small-group { height: 38px !important; margin-bottom: 4px !important; }
  .small-group .player-name-container { border-radius: 10px; }
  .small-group:has(.integrated-delete-btn) .player-name-container { border-radius: 10px 0 0 10px; }
  .small-group .integrated-delete-btn { border-radius: 0 10px 10px 0; width: 38px !important; }

  
  .time-control { display: flex; align-items: center; }
  .time-click-wrap { display: flex; align-items: center; width: 100%; }
  .time-click-zone { flex: 1; display: flex; align-items: center; justify-content: center; height: 48px; cursor: pointer; user-select: none; }
  .time-click-left { justify-content: flex-start; }
  .time-click-right { justify-content: flex-end; }
  .time-click-symbol { font-family: 'Righteous', cursive; font-size: 26px; color: rgba(255,255,255,0.35); transition: color 0.15s; }
  .time-click-zone:hover .time-click-symbol { color: rgba(255,255,255,0.75); }
  .time-click-symbol.time-click-disabled { color: rgba(255,255,255,0.12); pointer-events: none; }
  .time-display { text-align: center; font-family: 'Righteous', cursive; font-size: 24px; color: rgba(255,255,255,0.9); min-width: 72px; }

  .handoff-screen { background: none; }
  .handoff-card { text-align: center; padding: 40px 24px; background: rgba(255,255,255,0.06); border: 3px solid rgba(255,255,255,0.12); border-radius: 28px; max-width: 400px; width: 100%; backdrop-filter: blur(20px); }
  .handoff-icon { font-size: 52px; margin-bottom: 16px; animation: bounce 1.5s infinite; }
  .handoff-sub { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; margin-bottom: 12px; }
  .handoff-name { font-family: 'Righteous', cursive; font-size: clamp(28px, 8vw, 42px); margin-bottom: 24px; background: linear-gradient(135deg, #a78bfa, #60a5fa, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: inline-block; }
  .handoff-team { font-size: 13px; color: #34d399; font-weight: 800; letter-spacing: 0.06em; margin-top: -10px; margin-bottom: 16px; }
  .handoff-tip { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 28px; }

  .round-screen { flex-direction: column; background: none; transition: background 0.2s; padding-top: max(28px, env(safe-area-inset-top)); }

  .round-player { font-family: 'Righteous', cursive; font-size: clamp(14px, 4vw, 20px); color: #a78bfa; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .round-stats { display: flex; gap: 8px; flex-shrink: 0; margin-left: auto; }
  .stat { font-size: 14px; font-weight: 800; padding: 5px 10px; border-radius: 20px; white-space: nowrap; display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-width: 52px; }
  .stat-icon { display: flex; align-items: center; justify-content: center; line-height: 1; }
  .correct-stat { background: rgba(74,222,128,0.2); color: #4ade80; }
  .correct-stat-fire { background: rgba(251,146,60,0.25); color: #fb923c; text-shadow: 0 0 8px rgba(251,146,60,0.7); transition: background 0.3s, color 0.3s; }
  .skip-stat { background: rgba(248,113,113,0.15); color: #f87171; }
  .round-stats-cat { font-size: 12px; color: rgba(255,255,255,0.4); }
  .word-stage { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; width: 100%; gap: 0; padding: 20px; }
  .word-anchor { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 420px; }
  .word-counter { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 10px; }
  .current-word { font-family: 'Righteous', cursive; font-size: clamp(38px, 11vw, 80px); background: linear-gradient(135deg, #f9fafb, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.15; animation: wordIn 0.3s cubic-bezier(0.34,1.56,0.64,1); word-break: break-word; overflow-wrap: break-word; hyphens: manual; -webkit-hyphens: manual; max-width: 100%; padding: 0 8px; text-align: center; }
  .current-word.bonus-word { background: linear-gradient(135deg, #fef9c3, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .times-up-banner { font-family: 'Righteous', cursive; font-size: clamp(13px, 3.5vw, 16px); color: #f87171; background: rgba(248,113,113,0.12); border: 3px solid rgba(248,113,113,0.35); border-radius: 12px; padding: 8px 16px; text-align: center; min-height: 40px; margin-top: 20px; position: relative; overflow: hidden; }
  .times-up-banner.grace-active::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(248,113,113,0.22); animation: grace-drain 10s linear forwards; border-radius: 9px 0 0 9px; pointer-events: none; }
  .times-up-banner.bonus-banner { color: #f59e0b; background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.26); animation: none; }
  .times-up-banner.category-banner { color: #a78bfa; background: rgba(167,139,250,0.10); border-color: rgba(167,139,250,0.30); animation: none; font-size: clamp(12px, 3.2vw, 15px); }
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

  .action-row { display: flex; gap: 12px; width: 100%; max-width: 520px; padding: 0 0 max(24px, env(safe-area-inset-bottom)); flex-shrink: 0; }
  .action-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 20px 12px; border-radius: 20px; border: none; cursor: pointer; font-family: 'Righteous', cursive; transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); -webkit-tap-highlight-color: transparent; min-width: 0; }
  .action-btn:focus { outline: none; }
  .action-btn:active { transform: scale(0.93); }
  .btn-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }
  .skip-btn { background: rgba(248,113,113,0.1); color: #f87171; border: 3px solid rgba(248,113,113,0.4); font-size: 22px; }
  .correct-btn { background: rgba(74,222,128,0.2); color: #4ade80; border: 3px solid rgba(74,222,128,0.35); font-size: 22px; }
  @media (hover: hover) { .skip-btn:hover { background: rgba(248,113,113,0.2); } .correct-btn:hover { background: rgba(74,222,128,0.35); } }

  .score-title { font-family: 'Righteous', cursive; font-size: clamp(22px, 6vw, 28px); text-align: center; margin-bottom: 20px; }
  .scores-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
  .score-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 3px solid rgba(255,255,255,0.07); animation: slideIn 0.4s ease both; }
  .score-row-right { text-align: right; }
  .score-row-subtext { font-size: 11px; opacity: 0.5; margin-top: 2px; }
  .cursor-pointer { cursor: pointer; }
  .score-row.cursor-pointer:hover { filter: brightness(1.25); }
  .score-row.rank-1.rank-interim { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
  .score-row.rank-1.rank-interim .score-pts { color: #4ade80; }
  .score-row.rank-interim-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
  .score-row.rank-interim-tied .score-pts { color: #4ade80; }
  .score-row.rank-interim-played { background: rgba(167,139,250,0.08); border: 3px solid rgba(167,139,250,0.5); }
  .score-row.rank-interim-played .score-pts { color: #a78bfa; }
  .score-row.rank-interim-unplayed { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
  .score-row.rank-1.rank-final { background: rgba(251,191,36,0.08); border: 3px solid #fbbf24; }
  .score-row.rank-1.rank-final .score-pts { color: #fbbf24; }
  .score-row.rank-2.rank-final { background: rgba(192,192,192,0.1); border: 3px solid #c0c0c0; }
  .score-row.rank-2.rank-final .score-pts { color: #c0c0c0; }
  .score-row.rank-3.rank-final { background: rgba(205,127,50,0.08); border: 3px solid #cd7f32; }
  .score-row.rank-3.rank-final .score-pts { color: #cd7f32; }
  .score-row.rank-final:not(.rank-1):not(.rank-2):not(.rank-3) .score-pts { color: #a78bfa; }
  .score-row.rank-tied { background: rgba(74,222,128,0.08); border: 3px solid #4ade80; }
  .score-row.rank-tied .score-pts { color: #4ade80; }
  .score-row.rank-tied .score-name { color: #4ade80; }
  .rank-badge { font-size: 20px; min-width: 28px; text-align: center; flex-shrink: 0; }
  .score-name-block { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
  .score-name { flex: 1; font-size: clamp(14px, 4vw, 18px); font-weight: 700; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .score-members { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .score-pts { font-family: 'Righteous', cursive; font-size: clamp(16px, 4vw, 20px); color: rgba(255,255,255,0.9); flex-shrink: 0; }
  .score-btn { width: 100%; padding: 18px; border-radius: 16px; border: none; font-family: 'Righteous', cursive; font-size: 20px; cursor: pointer; transition: filter 0.18s; }
  .restart-btn { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); border: 3px solid rgba(255,255,255,0.2); }
  .restart-btn:hover { background: rgba(255,255,255,0.14); }
  .final-btns { display: flex; flex-direction: column; }

  .stats-header-row { display: flex; align-items: center; margin-bottom: 16px; }
  .stats-back-btn { background: rgba(255,255,255,0.08); border: 2.5px solid rgba(255,255,255,0.15); border-radius: 12px; color: rgba(255,255,255,0.75); font-size: 18px; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: all 0.15s; }
  .stats-back-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .stats-back-icon { display: inline-block; transform: scaleX(-1); line-height: 1; vertical-align: middle; }
  .stats-header-title { margin: 0; flex: 1; text-align: center; }
  .stats-header-spacer { width: 36px; flex-shrink: 0; }
  .stats-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
  .stats-tab { padding: 6px 14px; border-radius: 20px; border: 2.5px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; transition: all 0.15s; }
  .stats-tab-active { background: rgba(167,139,250,0.25); border-color: rgba(167,139,250,0.6); color: #a78bfa; }
  .stats-player-name { font-family: 'Righteous', cursive; font-size: 22px; margin-bottom: 2px; }
  .stats-total-score { color: #a78bfa; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .stats-cell { background: rgba(255,255,255,0.06); border: 2.5px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 12px; text-align: center; }
  .stats-cell-correct { background: rgba(74,222,128,0.2); border-color: rgba(74,222,128,0.35); color: #4ade80; }
  .stats-cell-skip { background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.3); color: #fbbf24; }
  .stats-cell-streak { background: rgba(251,146,60,0.25); border-color: rgba(251,146,60,0.4); color: #fb923c; }
  .stats-cell-bonus { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.26); color: #f59e0b; }
  .stats-cell-val { font-family: 'Righteous', cursive; font-size: 26px; }
  .stats-cell-lbl { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.45); margin-top: 2px; }
  .stats-cell-correct .stats-cell-lbl, .stats-cell-skip .stats-cell-lbl, .stats-cell-streak .stats-cell-lbl, .stats-cell-bonus .stats-cell-lbl { color: inherit; opacity: 0.7; }
  .stats-best { font-size: 13px; font-weight: 700; color: #fbbf24; background: rgba(251,191,36,0.1); border: 2.5px solid rgba(251,191,36,0.25); border-radius: 12px; padding: 10px 14px; margin-bottom: 14px; }
  .stats-words-section { display: flex; gap: 10px; margin-bottom: 4px; }
  .stats-words-col { flex: 1; min-width: 0; }
  .stats-words-title { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; }
  .stats-green { color: #4ade80; }
  .stats-red { color: #f87171; }
  .stats-words-list { display: flex; flex-wrap: wrap; gap: 4px; }
  .stats-word-chip { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 10px; background: rgba(74,222,128,0.1); border: 2.5px solid rgba(74,222,128,0.25); color: #4ade80; }
  .stats-word-bonus { background: rgba(251,146,60,0.12); border-color: rgba(251,146,60,0.4); color: #fb923c; }
  .stats-word-skipped { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.25); color: #f87171; }

  .tiebreaker-start-btn { width: 100%; background: rgba(251,191,36,0.1); border: 3px solid rgba(251,191,36,0.3); border-radius: 14px; padding: 10px 16px; margin-bottom: 14px; text-align: center; font-size: 14px; font-weight: 700; color: #fbbf24; cursor: pointer; font-family: inherit; transition: background 0.15s, border-color 0.15s; }
  .tiebreaker-start-btn:hover { background: rgba(251,191,36,0.22); border-color: rgba(251,191,36,0.6); }
  .tiebreaker-title { margin-bottom: 6px; }
  .tiebreaker-subtitle { text-align: center; color: rgba(255,255,255,0.5); font-size: 13px; margin-bottom: 22px; line-height: 1.5; }
  .tiebreaker-cat-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
  .tiebreaker-cat-btn { width: 100%; padding: 18px 20px; border-radius: 18px; background: rgba(167,139,250,0.1); border: 2.5px solid rgba(167,139,250,0.3); color: white; font-family: inherit; font-size: 20px; font-weight: 800; cursor: pointer; text-align: left; transition: all 0.15s; display: flex; align-items: center; gap: 12px; }
  .tiebreaker-cat-btn:hover { background: rgba(167,139,250,0.25); border-color: rgba(167,139,250,0.7); }
  .tiebreaker-result-banner { margin: 0 0 16px; padding: 10px 16px; border-radius: 14px; text-align: center; border: 2.5px solid; }
  .tiebreaker-result-winner { background: rgba(74,222,128,0.08); border-color: rgba(74,222,128,0.3); }
  .tiebreaker-result-text-winner { color: #4ade80; font-weight: 800; font-size: 14px; }
  .tiebreaker-pts { font-size: 17px; }
  .tiebreaker-handoff-sub { color: #fbbf24; font-weight: 800; letter-spacing: 0.06em; font-size: 13px; }
  .mb-2 { margin-bottom: 2px; }
  .mt-0 { margin-top: 0px; }
  .tiebreaker-team-block:not(:last-child) { margin-bottom: 10px; }
  .tiebreaker-team-row { margin-bottom: 6px; }
  .tiebreaker-player-list { margin-left: 14px; padding-left: 14px; border-left: 2px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 5px; }
  .tiebreaker-player-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-radius: 10px; background: rgba(255,255,255,0.04); }
  .tiebreaker-player-name { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.75); }
  .tiebreaker-player-time { font-size: 14px; font-weight: 800; color: rgba(255,255,255,0.6); }
  .grace-countdown { display: inline-block; min-width: 1.5ch; text-align: center; }

  /* ── Animations ── */
  @keyframes slideIn { from{transform:translateX(-20px);opacity:0} to{transform:translateX(0);opacity:1} }
  .score-row:nth-child(1){animation-delay:0.05s} .score-row:nth-child(2){animation-delay:0.1s} .score-row:nth-child(3){animation-delay:0.15s} .score-row:nth-child(4){animation-delay:0.2s} .score-row:nth-child(5){animation-delay:0.25s} .score-row:nth-child(6){animation-delay:0.3s}
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  @keyframes wordIn { from{transform:scale(0.7) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
  @keyframes penalty-drain { from{width:100%} to{width:0%} }
  @keyframes grace-drain { from{width:100%} to{width:0%} }

  @keyframes ring { 0%{transform:rotate(0deg)} 15%{transform:rotate(18deg)} 30%{transform:rotate(-16deg)} 45%{transform:rotate(14deg)} 60%{transform:rotate(-10deg)} 75%{transform:rotate(6deg)} 90%{transform:rotate(-3deg)} 100%{transform:rotate(0deg)} }
  @keyframes alarm-ring { 0%{transform:rotate(0deg) scale(1)} 10%{transform:rotate(-18deg) scale(1.15)} 25%{transform:rotate(18deg) scale(1.15)} 40%{transform:rotate(-14deg) scale(1.1)} 55%{transform:rotate(14deg) scale(1.1)} 70%{transform:rotate(-8deg) scale(1.05)} 85%{transform:rotate(8deg) scale(1.05)} 100%{transform:rotate(0deg) scale(1)} }
  .alarm-ringing { display:inline-block; animation: alarm-ring 0.6s ease-in-out infinite; transform-origin: center center; }

  @keyframes ls-letter-land { 0%{transform:scale(0.5) rotate(-8deg);opacity:0} 70%{transform:scale(1.12) rotate(2deg)} 100%{transform:scale(1) rotate(0deg);opacity:1} }
  @keyframes ls-spin-flash { 0%{opacity:0.4} 50%{opacity:0.9} 100%{opacity:0.4} }


  @media (max-width: 380px) { .names-grid { grid-template-columns: 1fr; } .logo-title { font-size: 28px; } }
  @media (max-height: 680px) { .handoff-card { padding: 28px 20px; } .handoff-icon { font-size: 40px; margin-bottom: 10px; } .word-stage { gap: 10px; padding: 12px; } }
  @media (min-width: 768px) { .word-anchor { max-width: 80vw; } }
`;
