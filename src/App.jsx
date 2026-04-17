import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── BRAND ───────────────────────────────────────────────
const B = {
  bg: "#050A14",
  navy: "#0A1628",
  blue: "#1E3A5F",
  mid: "#2B5C8A",
  crystal: "#4A90D9",
  light: "#6BB5FF",
  accent: "#8DCFFF",
  border: "rgba(74,144,217,0.18)",
  borderHover: "rgba(74,144,217,0.4)",
  glow: "rgba(74,144,217,0.1)",
  textFaint: "rgba(255,255,255,0.18)",
  textMuted: "rgba(255,255,255,0.38)",
  textSub: "rgba(255,255,255,0.55)",
  textMain: "rgba(255,255,255,0.88)",
};

const primaryBtn = {
  background: `linear-gradient(135deg, ${B.mid} 0%, ${B.crystal} 100%)`,
  color: "#fff", border: "none", borderRadius: 12,
  fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
  fontSize: 14, cursor: "pointer",
  boxShadow: "0 4px 24px rgba(74,144,217,0.25)",
};
const ghostBtn = {
  background: "rgba(255,255,255,0.04)", color: B.textSub,
  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
  fontSize: 13, cursor: "pointer",
};
const inp = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: `1px solid ${B.border}`, borderRadius: 12,
  padding: "14px 20px", fontSize: 15, color: "#fff",
  fontFamily: "'Montserrat', sans-serif", outline: "none",
  letterSpacing: "3px", fontWeight: 700, boxSizing: "border-box",
};

// ─── PETALS DATA ──────────────────────────────────────────
const PETALS = [
  { id: 1,  name: "The Strategist",  tagline: "Angles. Hooks. Dominance.",     icon: "◈", tier: 1, desc: "Deconstructs any brief and generates 15 conversion-ranked ad angles with emotional triggers, pattern interrupts, and scoring. Your media buyer brain, on demand.", link: null },
  { id: 2,  name: "The Scribe",      tagline: "Script. Copy. Convert.",        icon: "✦", tier: 1, desc: "Transforms angles into production-ready ad scripts with scene direction, captions, b-roll guides, and hook variations. Hook to CTA in seconds.", link: null },
  { id: 3,  name: "The Scout",       tagline: "Find. Target. Outreach.",       icon: "◉", tier: 1, desc: "Discovers your ideal clients, builds hyper-targeted prospect lists, and drafts personalised outreach sequences at scale.", link: null },
  { id: 4,  name: "The Compass",     tagline: "Direction. Clarity. Speed.",    icon: "⬡", tier: 2, desc: "Maps your entire content calendar from a single brief. 90 days of strategy in 90 seconds, calibrated to your brand voice and platform.", link: null },
  { id: 5,  name: "The Pipeline",    tagline: "Brief → Delivered.",            icon: "⬟", tier: 2, desc: "End-to-end ad production workflow. Brief ingestion through angles, scripts, production execution, client review, and delivery — automated.", link: null },
  { id: 6,  name: "The Architect",   tagline: "Build. Convert. Scale.",        icon: "⬢", tier: 2, desc: "Designs complete marketing funnels — landing pages, email sequences, lead magnets, and ad sets — from a single product brief.", link: null },
  { id: 7,  name: "The Analyst",     tagline: "Data. Insight. Action.",        icon: "◬", tier: 3, desc: "Reads your channel analytics across every connected platform and tells you exactly what to do next. No dashboards. Just decisions.", link: null },
  { id: 8,  name: "The Outreach",    tagline: "Connect. Pitch. Close.",        icon: "◈", tier: 3, desc: "Manages your full sales pipeline. Finds prospects, writes personalised sequences, tracks conversations, and closes — on your behalf.", link: null },
  { id: 9,  name: "The Publisher",   tagline: "Create. Schedule. Dominate.",   icon: "✦", tier: 3, desc: "Adapts any piece of content across every platform and format. Write once, publish everywhere, in every language.", link: null },
  { id: 10, name: "Rosa",            tagline: "IP. Rights. Legacy.",           icon: "◉", tier: 3, desc: "Manages your intellectual property across all platforms. Registers, protects, licenses, and monetises your creative output on-chain.", link: null },
  { id: 11, name: "The Negotiator",  tagline: "Deal. Term. Win.",              icon: "⬡", tier: 4, desc: "Builds pitch decks, proposal documents, brand partnership frameworks, and deal terms. Structures, negotiates, and closes on your behalf.", link: null },
  { id: 12, name: "The Crystal",     tagline: "All Twelve. One Mind.",         icon: "∞", tier: 4, desc: "The master intelligence. All 12 petals working as a single unified system. The self-made billionaire AI stack — reserved for Fragment XII holders only.", link: null, special: true },
];

const FRAGMENT_TIERS = {
  I:   { name: "Fragment I",   label: "Seed",         petals: [1,2,3],                      price: 97,   desc: "Your first three petals. The creative core begins." },
  III: { name: "Fragment III", label: "Core",         petals: [1,2,3,4,5,6],               price: 297,  desc: "Six petals. Production, strategy, and scale." },
  VII: { name: "Fragment VII", label: "Arc",          petals: [1,2,3,4,5,6,7,8,9],        price: 597,  desc: "Nine petals. The complete production-to-distribution arc." },
  XII: { name: "Fragment XII", label: "Full Crystal", petals: [1,2,3,4,5,6,7,8,9,10,11,12], price: 1297, desc: "All twelve petals. The full crystal unlocked." },
};

const PETAL_COLORS = {
  1: "#4A90D9", 2: "#5AABEF", 3: "#3A78C5",
  4: "#6BB5FF", 5: "#4A90D9", 6: "#2B6AB5",
  7: "#5AABEF", 8: "#3A78C5", 9: "#4A90D9",
  10: "#6BB5FF", 11: "#2B5C8A", 12: "#8DCFFF",
};

// ─── CRYSTAL CANVAS ──────────────────────────────────────
function drawCrystal(canvas, size, rotation = 0) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2, cy = canvas.height / 2;
  const maxR = (size / 2) * 0.91;
  const N = 24;
  const layers = [
    [1.00, 0,             "#5AABEF", 0.95],
    [0.82, Math.PI / 48,  "#4A90D9", 1.00],
    [0.65, Math.PI / 32,  "#2B5C8A", 1.00],
    [0.50, Math.PI / 24,  "#1E3A5F", 1.00],
    [0.36, Math.PI / 18,  "#0D1E3A", 1.00],
  ];
  for (let li = layers.length - 1; li >= 0; li--) {
    const [rR, rot, color, op] = layers[li];
    const R = maxR * rR, r = R * 0.38;
    ctx.globalAlpha = op;
    ctx.beginPath();
    for (let i = 0; i < N * 2; i++) {
      const angle = (i * Math.PI / N) + rot + rotation - Math.PI / 2;
      const radius = i % 2 === 0 ? R : r;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, maxR * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = "#050A14";
  ctx.fill();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.arc(cx, cy - maxR * 0.07, maxR * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = "#8DCFFF";
  ctx.fill();
  ctx.globalAlpha = 1;
}

function CrystalMark({ size, spinning = false }) {
  const ref = useRef(null);
  const rotRef = useRef(0);
  const rafRef = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (spinning) {
      const loop = () => {
        rotRef.current += 0.007;
        drawCrystal(canvas, size, rotRef.current);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } else {
      drawCrystal(canvas, size, 0);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [size, spinning]);
  return <canvas ref={ref} width={size} height={size} style={{ display: "block" }} />;
}

// ─── PETAL CARD ──────────────────────────────────────────
function PetalCard({ petal, unlocked, onClick }) {
  const [hovered, setHovered] = useState(false);
  const color = PETAL_COLORS[petal.id];
  return (
    <div
      onClick={() => unlocked && onClick(petal)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: unlocked
          ? hovered ? `rgba(${hexToRgb(color)},0.12)` : `rgba(${hexToRgb(color)},0.05)`
          : "rgba(255,255,255,0.018)",
        border: `1px solid ${unlocked ? (hovered ? color : `rgba(${hexToRgb(color)},0.35)`) : "rgba(255,255,255,0.055)"}`,
        borderRadius: 16, padding: "22px 20px",
        cursor: unlocked ? "pointer" : "default",
        transition: "all 0.25s ease",
        transform: hovered && unlocked ? "translateY(-4px)" : "none",
        boxShadow: hovered && unlocked ? `0 12px 40px rgba(${hexToRgb(color)},0.18)` : "none",
        position: "relative", overflow: "hidden",
      }}>
      {unlocked && hovered && (
        <div style={{ position: "absolute", top: -50, right: -50, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, rgba(${hexToRgb(color)},0.1) 0%, transparent 70%)`, pointerEvents: "none" }} />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 22, color: unlocked ? color : "rgba(255,255,255,0.1)", lineHeight: 1 }}>{petal.icon}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {!unlocked && <span style={{ fontSize: 13, color: "rgba(255,255,255,0.1)" }}>🔒</span>}
          {unlocked && petal.special && (
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1.5px", color: B.accent, background: `rgba(${hexToRgb(color)},0.2)`, padding: "3px 8px", borderRadius: 20 }}>MASTER</span>
          )}
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: unlocked ? B.textMain : "rgba(255,255,255,0.15)", marginBottom: 4, letterSpacing: "-0.3px" }}>{petal.name}</div>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: unlocked ? color : "rgba(255,255,255,0.08)", marginBottom: 10 }}>{unlocked ? petal.tagline : "LOCKED"}</div>
      <div style={{ fontSize: 12, color: unlocked ? B.textMuted : "rgba(255,255,255,0.07)", lineHeight: 1.65 }}>
        {unlocked ? petal.desc : "Acquire a higher-tier Fragment to unlock this petal."}
      </div>
      {unlocked && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, color: color }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>Launch Agent</span>
          <span style={{ fontSize: 14 }}>→</span>
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

// ─── LANDING ─────────────────────────────────────────────
function Landing({ onEnter, onGet }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative" }}>
        {/* Large background crystal */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.055, pointerEvents: "none", zIndex: 0 }}>
          <CrystalMark size={700} spinning />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,144,217,0.1)", border: `1px solid ${B.border}`, borderRadius: 20, padding: "6px 18px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: B.crystal }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.light }}>Prëmo Inc. · AI Agent Vault</span>
          </div>

          {/* Crystal mark */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <CrystalMark size={180} spinning />
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(56px, 10vw, 96px)", fontWeight: 800, color: "#fff", letterSpacing: "-4px", lineHeight: 0.95, marginBottom: 24 }}>
            THE<br /><span style={{ color: B.light, letterSpacing: "-4px" }}>CRYSTAL</span>
          </h1>

          <p style={{ fontSize: 17, color: B.textMuted, maxWidth: 440, margin: "0 auto 16px", lineHeight: 1.8, fontWeight: 400 }}>
            A vault of AI agents.<br />Each one a petal.<br />Unlocked by a Fragment.
          </p>
          <p style={{ fontSize: 12, color: B.textFaint, marginBottom: 44, letterSpacing: "0.5px" }}>
            12 agents · 4 tiers · one key
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onGet} style={{ ...primaryBtn, padding: "14px 36px", fontSize: 14 }}>
              Acquire a Fragment →
            </button>
            <button onClick={onEnter} style={{ ...ghostBtn, padding: "14px 28px" }}>
              Enter Fragment Code
            </button>
          </div>
        </div>
      </div>

      {/* Architecture section */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.crystal, marginBottom: 14 }}>The Architecture</div>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 12 }}>Fragment → Petal → Agent</h2>
          <p style={{ fontSize: 14, color: B.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.8 }}>The Crystal contains 12 AI agents — each called a Petal. A Fragment is the key that unlocks them. The tier of your Fragment determines how many Petals you can access.</p>
        </div>

        {/* 3-step cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 88 }}>
          {[
            { icon: "◆", title: "The Fragment", desc: "A unique access code. Each Fragment holds a tier — I, III, VII, or XII — determining how deep into the crystal you go." },
            { icon: "⬡", title: "The Petal", desc: "Each petal is a fully-operational AI agent. Specialised. Precise. Built for a specific function in your empire." },
            { icon: "∞", title: "The Crystal", desc: "All 12 petals working as a unified system. The master intelligence. Reserved for Fragment XII holders only." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${B.border}`, borderRadius: 16, padding: "28px 22px", textAlign: "center" }}>
              <div style={{ fontSize: 30, color: B.crystal, marginBottom: 16 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: B.textMain, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: B.textMuted, lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Petals preview — all locked */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.crystal, marginBottom: 12 }}>The 12 Petals</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8 }}>Your AI Agent Stack</h2>
          <p style={{ fontSize: 13, color: B.textMuted }}>Acquire a Fragment to reveal what's inside.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 12, marginBottom: 88 }}>
          {PETALS.map(petal => (
            <PetalCard key={petal.id} petal={petal} unlocked={false} onClick={() => {}} />
          ))}
        </div>

        {/* Fragment tiers */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.crystal, marginBottom: 12 }}>Fragment Tiers</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", marginBottom: 8 }}>Choose Your Depth</h2>
          <p style={{ fontSize: 13, color: B.textMuted }}>One-time purchase. Lifetime access. Upgrade anytime.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14, marginBottom: 52 }}>
          {Object.entries(FRAGMENT_TIERS).map(([tier, data]) => {
            const [h, setH] = useState(false);
            const isTop = tier === "XII";
            return (
              <div key={tier} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onGet}
                style={{ background: isTop ? "rgba(74,144,217,0.09)" : h ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.02)", border: `1px solid ${isTop ? B.crystal : h ? B.border : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "24px 20px", cursor: "pointer", transition: "all 0.25s", transform: h ? "translateY(-2px)" : "none" }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: B.crystal, marginBottom: 6 }}>Fragment {tier}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.textMuted, marginBottom: 6 }}>{data.label}</div>
                <div style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 4 }}>${data.price}</div>
                <div style={{ fontSize: 11, color: B.textFaint, marginBottom: 12 }}>{data.petals.length} of 12 petals</div>
                <div style={{ fontSize: 12, color: B.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{data.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 16 }}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: data.petals.includes(i + 1) ? B.crystal : "rgba(255,255,255,0.07)" }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: B.light }}>Get Fragment {tier} →</div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={onGet} style={{ ...primaryBtn, padding: "16px 44px", fontSize: 15 }}>Acquire Your Fragment →</button>
        </div>
      </div>
    </div>
  );
}

// ─── FRAGMENT ENTRY ──────────────────────────────────────
function FragmentEntry({ onBack, onUnlock }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const attempt = async () => {
    if (!code.trim()) return;
    setLoading(true); setError("");
    const { data, error: err } = await supabase
      .from("crystal_fragments")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .eq("active", true)
      .single();
    setLoading(false);
    if (err || !data) { setError("Fragment not recognised. Check your code and try again."); return; }
    await supabase.from("crystal_access_log").insert({ fragment_code: data.code });
    onUnlock(data);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.05, pointerEvents: "none" }}>
        <CrystalMark size={560} spinning />
      </div>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 420, width: "100%", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <CrystalMark size={88} />
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.crystal, marginBottom: 10 }}>Fragment Authentication</div>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 10 }}>Enter Your Fragment</h2>
        <p style={{ fontSize: 13, color: B.textMuted, lineHeight: 1.75, marginBottom: 36 }}>Each Fragment is a unique code. Enter yours to authenticate and unlock your petals.</p>

        <input
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && attempt()}
          placeholder="CRYSTAL-XXXX-XXXX"
          autoFocus
          style={{ ...inp, textAlign: "center", marginBottom: 12 }}
        />

        {error && <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 14 }}>{error}</div>}

        <button onClick={attempt} disabled={loading || !code.trim()} style={{ ...primaryBtn, padding: "14px 0", width: "100%", marginBottom: 14, opacity: loading || !code.trim() ? 0.55 : 1, fontSize: 14 }}>
          {loading ? "Authenticating..." : "Unlock the Crystal →"}
        </button>
        <button onClick={onBack} style={{ background: "none", border: "none", color: B.textFaint, fontFamily: "'Montserrat', sans-serif", fontSize: 12, cursor: "pointer" }}>← Back</button>
      </div>
    </div>
  );
}

// ─── VAULT ───────────────────────────────────────────────
function Vault({ fragment, onLogout }) {
  const [activePetal, setActivePetal] = useState(null);
  const tierData = FRAGMENT_TIERS[fragment.tier];
  const unlocked = tierData?.petals || [];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 100px" }}>
      {/* Vault header */}
      <div style={{ background: "rgba(74,144,217,0.07)", border: `1px solid ${B.border}`, borderRadius: 18, padding: "20px 24px", marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <CrystalMark size={52} spinning />
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: B.crystal, marginBottom: 3 }}>Fragment {fragment.tier} · {tierData?.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>The Crystal — Vault Access</div>
            {fragment.holder_name && <div style={{ fontSize: 11, color: B.textMuted, marginTop: 2 }}>{fragment.holder_name}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
              {unlocked.length}<span style={{ fontSize: 14, color: B.textMuted, fontWeight: 400 }}>/12</span>
            </div>
            <div style={{ fontSize: 9, color: B.textMuted, letterSpacing: "1.5px", textTransform: "uppercase" }}>Petals Unlocked</div>
          </div>
          <button onClick={onLogout} style={{ ...ghostBtn, padding: "8px 16px", fontSize: 11 }}>Exit Vault</button>
        </div>
      </div>

      {/* Petal grid */}
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: B.textFaint, marginBottom: 18 }}>Your Petals</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(256px, 1fr))", gap: 14 }}>
        {PETALS.map(petal => (
          <PetalCard key={petal.id} petal={petal} unlocked={unlocked.includes(petal.id)} onClick={setActivePetal} />
        ))}
      </div>

      {/* Upgrade CTA */}
      {fragment.tier !== "XII" && (
        <div style={{ background: "rgba(74,144,217,0.06)", border: `1px solid ${B.border}`, borderRadius: 14, padding: "22px 24px", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: B.textMain, marginBottom: 4 }}>{12 - unlocked.length} petals still locked</div>
            <div style={{ fontSize: 12, color: B.textMuted }}>Upgrade your Fragment to unlock the full crystal.</div>
          </div>
          <button style={{ ...primaryBtn, padding: "10px 24px", fontSize: 13 }}>Upgrade Fragment →</button>
        </div>
      )}

      {/* Petal modal */}
      {activePetal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(5,10,20,0.94)" }}>
          <div style={{ background: "#0A1628", border: `1px solid ${B.border}`, borderRadius: 22, padding: 40, maxWidth: 540, width: "100%", position: "relative", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}>
            <button onClick={() => setActivePetal(null)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: B.textMuted, fontSize: 20, cursor: "pointer" }}>✕</button>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: `rgba(${hexToRgb(PETAL_COLORS[activePetal.id])},0.15)`, border: `1px solid rgba(${hexToRgb(PETAL_COLORS[activePetal.id])},0.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: PETAL_COLORS[activePetal.id], flexShrink: 0 }}>
                {activePetal.icon}
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>{activePetal.name}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: PETAL_COLORS[activePetal.id] }}>{activePetal.tagline}</div>
              </div>
            </div>

            <p style={{ fontSize: 14, color: B.textSub, lineHeight: 1.8, marginBottom: 24 }}>{activePetal.desc}</p>

            <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${B.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: B.textMuted, marginBottom: 6 }}>Agent Status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: B.crystal }} />
                <span style={{ fontSize: 13, color: B.light, fontWeight: 600 }}>
                  {activePetal.special ? "Master integration — all 12 petals synced" : "Integration in progress — full launch Q2 2026"}
                </span>
              </div>
            </div>

            <button onClick={() => setActivePetal(null)} style={{ ...primaryBtn, padding: "13px 0", width: "100%", fontSize: 14 }}>
              {activePetal.link ? `Launch ${activePetal.name} →` : `Coming Soon — Stay Ready`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GET FRAGMENT ─────────────────────────────────────────
function GetFragment({ onBack }) {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "52px 24px 80px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: B.textMuted, fontFamily: "'Montserrat', sans-serif", fontSize: 12, cursor: "pointer", marginBottom: 44 }}>← Back</button>

      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <CrystalMark size={80} />
        </div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: B.crystal, marginBottom: 12 }}>Acquire a Fragment</div>
        <h2 style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 12 }}>Choose Your Depth</h2>
        <p style={{ fontSize: 14, color: B.textMuted, maxWidth: 440, margin: "0 auto", lineHeight: 1.8 }}>Each Fragment is a one-time purchase. Access never expires. Upgrade anytime by paying the difference.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16, marginBottom: 52 }}>
        {Object.entries(FRAGMENT_TIERS).map(([tier, data]) => {
          const [h, setH] = useState(false);
          const isTop = tier === "XII";
          return (
            <div key={tier} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
              style={{ background: isTop ? "rgba(74,144,217,0.09)" : h ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.02)", border: `1px solid ${isTop ? B.crystal : h ? B.border : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "28px 22px", transition: "all 0.25s", transform: h ? "translateY(-3px)" : "none" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: B.crystal, marginBottom: 8 }}>Fragment {tier}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: B.textSub, marginBottom: 6 }}>{data.label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-1.5px", marginBottom: 4 }}>${data.price}</div>
              <div style={{ fontSize: 11, color: B.textFaint, marginBottom: 14 }}>{data.petals.length} petals unlocked</div>
              <div style={{ fontSize: 12, color: B.textMuted, lineHeight: 1.65, marginBottom: 18 }}>{data.desc}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 20 }}>
                {[...Array(12)].map((_, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: data.petals.includes(i + 1) ? B.crystal : "rgba(255,255,255,0.07)" }} />
                ))}
              </div>
              <button style={{ width: "100%", background: isTop ? `linear-gradient(135deg, ${B.mid}, ${B.crystal})` : "rgba(74,144,217,0.12)", color: "#fff", border: `1px solid ${isTop ? "transparent" : B.border}`, borderRadius: 10, padding: "11px 0", fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                Get Fragment {tier}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: B.textMuted, lineHeight: 1.7 }}>
          Payment via Stripe. Fragment code delivered instantly to your email.<br />No subscriptions. No renewal fees. Access never expires. Upgrade anytime.
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
  const [fragment, setFragment] = useState(null);

  const handleUnlock = (data) => { setFragment(data); setView("vault"); };
  const handleLogout = () => { setFragment(null); setView("landing"); };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: "100vh", background: B.bg, color: "#fff", position: "relative" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap'); *{box-sizing:border-box;margin:0;padding:0;} body{background:${B.bg};overflow-x:hidden;} button:hover{opacity:0.87;} input::placeholder{color:rgba(255,255,255,0.18);}`}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 200, background: "rgba(5,10,20,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(74,144,217,0.1)", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setView("landing")}>
          <CrystalMark size={34} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "2px" }}>THE CRYSTAL</div>
            <div style={{ fontSize: 8, color: B.textFaint, letterSpacing: "2.5px" }}>AI AGENT VAULT · PRËMO INC.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {view !== "vault" && (
            <button onClick={() => setView("enter")} style={{ ...ghostBtn, padding: "7px 16px", fontSize: 11, borderRadius: 8 }}>Enter Fragment</button>
          )}
          {view === "vault" && (
            <button onClick={handleLogout} style={{ ...ghostBtn, padding: "7px 16px", fontSize: 11, borderRadius: 8 }}>Exit Vault</button>
          )}
          {view !== "get" && (
            <button onClick={() => setView("get")} style={{ ...primaryBtn, padding: "8px 18px", fontSize: 11, borderRadius: 8 }}>Acquire Fragment</button>
          )}
        </div>
      </header>

      {view === "landing" && <Landing onEnter={() => setView("enter")} onGet={() => setView("get")} />}
      {view === "enter" && <FragmentEntry onBack={() => setView("landing")} onUnlock={handleUnlock} />}
      {view === "vault" && fragment && <Vault fragment={fragment} onLogout={handleLogout} />}
      {view === "get" && <GetFragment onBack={() => setView("landing")} />}

      {view !== "vault" && (
        <div style={{ textAlign: "center", padding: "28px 24px", fontSize: 10, color: B.textFaint, letterSpacing: "1.5px", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          THE CRYSTAL · PRËMO INC. · CANGGU, BALI · {new Date().getFullYear()}
        </div>
      )}
    </div>
  );
}
