const { useEffect, useMemo, useState } = React;



function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeChoiceText(key, text) {
  // Many existing JSON choice texts include a leading "Yes -" / "No -" prefix.
  // When we shuffle/swap yes/no choices, that baked-in prefix can become wrong.
  // Strip it and let the UI label (YES./NO.) carry the meaning.
  if (typeof text !== 'string') return text;
  if (key === 'yes' || key === 'no') {
    return text.replace(/^(yes|no)\s*[-–—:]\s*/i, '');
  }
  return text;
}

function invertPrompt(prompt) {
  // Turn "Will X ..." into "Will X not ..." (best-effort)
  // Also handles "... will X ..." -> "... will X not ..."
  return prompt
    .replace(/^Will\s+/i, 'Will ')
    .replace(/^Will\s+(.+?)\s+(\S+)/i, (m, subj, verb) => `Will ${subj} not ${verb}`)
    .replace(/\bwill\s+(.+?)\s+(\S+)/i, (m, subj, verb) => `will ${subj} not ${verb}`);
}

function applyInversion(d) {
  // For yes/no decisions: inversion swaps choices and flips canonical answer.
  const inv = { ...d };
  inv.decision = invertPrompt(d.decision);
  inv.canonical_answer = d.canonical_answer === 'yes' ? 'no' : 'yes';
  if (d.choices && d.choices.yes && d.choices.no) {
    inv.choices = { yes: d.choices.no, no: d.choices.yes };
  }
  return inv;
}
async function fetchJson(url) {
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  return res.json();
}

async function loadGameBundle() {
  const [
    metadata,
    reflections,
    dorothea,
    lydgate,
    fred,
    finales
  ] = await Promise.all([
    fetchJson('data/metadata.json'),
    fetchJson('data/reflections.json'),
    fetchJson('data/storylines/dorothea.json'),
    fetchJson('data/storylines/lydgate.json'),
    fetchJson('data/storylines/fred.json'),
    fetchJson('data/finales.json'),
  ]);

  return {
    game: {
      metadata,
      reflections,
      storylines: { dorothea, lydgate, fred },
    },
    finales,
  };
}

function Header({ subtitle }) {
  return (
    <div className="site-header">
      <h1>Middlemarch</h1>
      <div className="subtitle">{subtitle || "The Paths Not Taken"}</div>
    </div>
  );
}

function Landing({ onMode }) {
  return (
    <div>
      <Header />
      <div className="ornament">❦ ❦ ❦</div>
      <div className="epigraph">
        <p>"For the growing good of the world is partly dependent on unhistoric acts; and that things are not so ill with you and me as they might have been, is half owing to the number who lived faithfully a hidden life."</p>
        <cite>— George Eliot, <em>Middlemarch</em> (1872)</cite>
      </div>
      <div className="ornament">❦</div>
      <div className="intro">
        <p>Follow the cascading choices of Dorothea Brooke, Tertius Lydgate, and Fred Vincy. In <strong>Quiz Mode</strong>, earn points for knowing what actually happened. In <strong>Exploration Mode</strong>, create the paths they might have taken.</p>
      </div>
      <div className="mode-row">
        <button className="btn-mode" onClick={() => onMode('quiz')}>
          <strong>Quiz Mode</strong>
          Test your knowledge of the canonical novel
        </button>
        <button className="btn-mode" onClick={() => onMode('explore')}>
          <strong>Exploration Mode</strong>
          Discover alternative paths and possibilities
        </button>
      </div>
    </div>
  );
}

function StorylineSelect({ game, mode, onSelect, onBack }) {
  const storylines = [
    { key: 'dorothea', emoji: '🕊', arc: 'Redemption through love' },
    { key: 'lydgate',  emoji: '⚕', arc: 'Tragic fall'             },
    { key: 'fred',     emoji: '🌾', arc: 'Earned happiness'        }
  ];

  return (
    <div>
      <Header subtitle={mode === 'quiz'
        ? "Quiz Mode — What Actually Happens?"
        : "Exploration Mode — What Might Have Been?"}
      />
      <div className="ornament">❦</div>

      <div className="cards">
        {storylines.map(s => {
          const st = game.storylines[s.key];
          return (
            <div key={s.key} className="card" onClick={() => onSelect(s.key)}>
              <h2>{s.emoji} {st.title}</h2>
              <p>{st.description}</p>
              <div className="meta">{s.arc}</div>
            </div>
          );
        })}
      </div>

      <button className="btn-back" onClick={onBack}>← Back</button>
    </div>
  );
}

function DecisionScreen({ game, finales, mode, storylineKey, onRestart }) {
  const decisions = useMemo(() => {
    const base = game.storylines[storylineKey].decisions || [];
    // 1) Shuffle question order every time you enter a storyline
    let shuffled = shuffleArray(base);

    // 2) Balance correct-answer distribution (aim ~50/50 yes/no) by inverting a subset
    // Only applies to questions that have yes/no choices.
    const total = shuffled.length;
    const targetYes = Math.floor(total / 2);
    let yesIdxs = [];
    let yesCount = 0;
    let noCount = 0;
    shuffled.forEach((q, i) => {
      if (q.canonical_answer === 'yes') { yesCount++; yesIdxs.push(i); }
      else if (q.canonical_answer === 'no') { noCount++; }
    });
    const needFlip = Math.max(0, yesCount - targetYes);
    if (needFlip > 0) {
      const pick = shuffleArray(yesIdxs).slice(0, needFlip);
      const pickSet = new Set(pick);
      shuffled = shuffled.map((q, i) => {
        const canInvert = q.choices && q.choices.yes && q.choices.no;
        if (pickSet.has(i) && canInvert) return applyInversion(q);
        return q;
      });
    }

    return shuffled;
  }, [game, storylineKey]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [chosenKey, setChosenKey] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const total = decisions.length;
  const pct = total ? Math.round((score / total) * 100) : 0;
  const progressPct = total ? Math.round(((idx) / total) * 100) : 0;

  const d = decisions[idx] || null;
  const isCanon = d ? d.canonical_answer : null;

  // Shuffle choices ONCE per question (not every render)
  const choiceEntries = useMemo(() => {
    const choicesObj = (d && d.choices) ? d.choices : {};

    // Keep YES above NO consistently for binary yes/no questions
    const hasYesNo = Object.prototype.hasOwnProperty.call(choicesObj, 'yes')
      && Object.prototype.hasOwnProperty.call(choicesObj, 'no');
    const keys = Object.keys(choicesObj);

    if (hasYesNo && keys.length === 2 && keys.includes('yes') && keys.includes('no')) {
      return [['yes', choicesObj.yes], ['no', choicesObj.no]];
    }

    // For any non-binary choice sets, keep variety by shuffling
    return shuffleArray(Object.entries(choicesObj));
  }, [idx, storylineKey]);

  const choose = (key) => {
    if (answered) return;
    setAnswered(true);
    setChosenKey(key);

    if (mode === 'quiz') {
      if (key === isCanon) setScore(s => s + 1);
    }
  };

  const next = () => {
    if (idx + 1 >= decisions.length) {
      // Finale
      setIdx(decisions.length); // sentinel
      return;
    }
    setIdx(i => i + 1);
    setAnswered(false);
    setChosenKey(null);
    setRevealed(false);
  };

  const restartStory = () => {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setChosenKey(null);
    setRevealed(false);
    onRestart();
  };

  // Finale screen
  if (idx >= decisions.length) {
    return (
      <div>
        <Header subtitle="Results" />
        <div className="ornament">❦</div>
        <div className="finale">
          <h2>Your Journey Concludes</h2>
          {mode === 'quiz' && (
            <>
              <div className="finale-score">{score} / {total}</div>
              <div className="finale-pct">{pct}% correct</div>
            </>
          )}
          <div className="finale-text">{finales[storylineKey]}</div>
          <div className="finale-btns">
            <button className="btn-primary" onClick={() => onRestart()}>
              Choose Another Story
            </button>
            <button className="btn-primary" onClick={() => { setIdx(0); setScore(0); setAnswered(false); setChosenKey(null); setRevealed(false); }}>
              Replay This Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header subtitle={game.storylines[storylineKey].title} />
      <div className="ornament">❦</div>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-label">
          <span>Decision {idx + 1} of {decisions.length}</span>
          {mode === 'quiz' && <span className="score-badge">Score: {score}</span>}
        </div>
      </div>

      <div className="decision-card">
        <div>
          <span className="chapter-tag">Chapter {d.chapter}</span>
          <span className={`importance-tag importance-${d.importance}`}>{d.importance}</span>
        </div>

        <div className="character-name">{d.character}</div>
        <div className="decision-q">{d.decision}</div>

        <div className="choices">
          {choiceEntries.map(([key, c]) => {
            const isSelected = answered && key === chosenKey;
            const isCanonKey = answered && key === isCanon;

            let cls = "btn-choice";

            // Only style after the user answers (prevents pre-highlighting)
            if (answered) {
              if (mode === "quiz") {
                if (isCanonKey) cls += " canonical-choice";       // highlight correct
                else if (isSelected) cls += " wrong-choice";      // highlight chosen wrong
              } else {
                // explore mode: only highlight what they chose
                if (isSelected) cls += " selected-choice";
                // optional: only reveal canonical highlight AFTER they click reveal
                if (revealed && key === isCanon) cls += " canonical-choice";
              }
            }

            return (
              <button
                key={key}
                className={cls}
                onClick={() => choose(key)}
                disabled={answered}
                aria-disabled={answered ? "true" : "false"}
                style={answered ? { opacity: 0.95, cursor: "default" } : null}
              >
                <span className="choice-label">{key.toUpperCase()}.</span>
                {normalizeChoiceText(key, c.text)}
              </button>
            );
          })}
        </div>

        {/* Context should only appear AFTER a selection is made */}
        {answered && (
          <div style={{ marginBottom: '1.2rem' }}>
            <div className="context-label">Context</div>
            <div className="context-box">{d.context}</div>
          </div>
        )}

        {d.themes && d.themes.length > 0 && (
          <div className="themes-row">
            {d.themes.map(t => <span key={t} className="theme-pill">{t}</span>)}
          </div>
        )}

        {answered && mode === 'quiz' && (
          <div className={"result-box " + (chosenKey === isCanon ? "result-correct" : "result-wrong")}>
            <div className="result-label">
              {chosenKey === isCanon ? "✓ Correct" : `✗ Not in the novel — the canonical answer is ${isCanon.toUpperCase()}`}
            </div>
            <div className="result-text">
              {chosenKey === isCanon ? d.choices[chosenKey].consequence : d.choices[isCanon].consequence}
            </div>
          </div>
        )}

        {answered && mode === 'explore' && (
          <div>
            <div className="result-box result-explore">
              <div className="result-label">Your path: {chosenKey.toUpperCase()}</div>
              <div className="result-text">{d.choices[chosenKey].consequence}</div>
            </div>
            {!revealed && (
              <button className="btn-reveal" onClick={() => setRevealed(true)}>
                📖 What did Eliot actually write?
              </button>
            )}
            {revealed && chosenKey !== isCanon && (
              <div className="result-box result-correct" style={{ marginTop: '0.8rem' }}>
                <div className="result-label">✓ In the novel ({isCanon.toUpperCase()}):</div>
                <div className="result-text">{d.choices[isCanon].consequence}</div>
              </div>
            )}
            {revealed && chosenKey === isCanon && (
              <div className="result-box result-correct" style={{ marginTop: '0.8rem' }}>
                <div className="result-label">✓ You chose the canonical path!</div>
                <div className="result-text">This is exactly what Eliot writes.</div>
              </div>
            )}
          </div>
        )}

        {answered && (
          <button className="btn-next" onClick={next}>
            {idx + 1 >= decisions.length ? 'See Results →' : 'Next Decision →'}
          </button>
        )}
      </div>

      <button className="btn-back" onClick={onRestart}>← Choose Different Story</button>
    </div>
  );
}

function App() {
  const [bundle, setBundle] = useState({ game: null, finales: null, error: null });

  useEffect(() => {
    let alive = true;
    loadGameBundle()
      .then((b) => { if (alive) setBundle({ game: b.game, finales: b.finales, error: null }); })
      .catch((e) => { if (alive) setBundle({ game: null, finales: null, error: e.message || String(e) }); });
    return () => { alive = false; };
  }, []);

  const { game, finales, error } = bundle;

  const [mode, setMode] = useState(null);
  const [storyline, setStoryline] = useState(null);

  if (error) {
    return (
      <div className="error-box">
        <h2>Unable to load game data</h2>
        <p>{error}</p>
        <p style={{ marginTop: '0.8rem' }}>
          Make sure the <code>data/</code> folder is being served (GitHub Pages or a local static server).
        </p>
      </div>
    );
  }

  if (!game || !finales) {
    return (
      <div>
        <Header subtitle="Loading…" />
        <div className="ornament">❦</div>
        <div className="intro"><p>Loading game data…</p></div>
      </div>
    );
  }

  if (!mode) return <Landing onMode={setMode} />;
  if (!storyline) return <StorylineSelect game={game} mode={mode} onSelect={setStoryline} onBack={() => setMode(null)} />;
  return <DecisionScreen game={game} finales={finales} mode={mode} storylineKey={storyline} onRestart={() => setStoryline(null)} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
