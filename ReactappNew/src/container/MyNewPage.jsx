import React, { useMemo, useRef, useState } from "react";

function MyNewPage() {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState("normal"); // "slow" | "normal" | "fast"
  const [theme, setTheme] = useState("ocean"); // "ocean" | "sunset" | "forest"
  const [shape, setShape] = useState("circle"); // "circle" | "square" | "triangle"
  const mountRef = useRef(null);

  const themeColors = useMemo(() => {
    switch (theme) {
      case "sunset":
        return { bg1: "#ffedd5", bg2: "#fed7aa", accent: "#fb7185" };
      case "forest":
        return { bg1: "#ecfdf5", bg2: "#d1fae5", accent: "#10b981" };
      default:
        return { bg1: "#e0f2fe", bg2: "#bae6fd", accent: "#38bdf8" }; // ocean
    }
  }, [theme]);

  const durationSec = speed === "slow" ? 10 : speed === "fast" ? 3 : 6;

  return (
    <div style={styles.page(themeColors)}>
      <div style={styles.panel}>
        <h1 style={styles.title}>My Animation Demo Page</h1>
        <div style={styles.controls}>
          <button
            style={styles.button(playing ? themeColors.accent : "#64748b")}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <label style={styles.groupLabel}>
            Speed:
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              style={styles.select}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </label>

          <label style={styles.groupLabel}>
            Theme:
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              style={styles.select}
            >
              <option value="ocean">Ocean</option>
              <option value="sunset">Sunset</option>
              <option value="forest">Forest</option>
            </select>
          </label>

          <label style={styles.groupLabel}>
            Shape:
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              style={styles.select}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="triangle">Triangle</option>
            </select>
          </label>
        </div>
      </div>

      <div style={styles.stage} ref={mountRef}>
        <AnimatedShape
          playing={playing}
          durationSec={durationSec}
          accent={themeColors.accent}
          shape={shape}
        />
      </div>

      <p style={styles.note}>
        Tip: Try switching theme, shape, and speed. Hit Pause to freeze the
        animation.
      </p>
    </div>
  );
}

function AnimatedShape({ playing, durationSec, accent, shape }) {
  // CSS variables control animation timing; fallback to JS class toggling.
  const base = {
    ...styles.shapeBase,
    "--duration": `${durationSec}s`,
    background:
      shape === "triangle" ? "transparent" : `radial-gradient(circle at 30% 30%, #fff8, transparent 60%), ${accent}`,
    borderRadius: shape === "circle" ? "999px" : shape === "square" ? "20px" : "0px",
    clipPath:
      shape === "triangle"
        ? "polygon(50% 0%, 0% 100%, 100% 100%)"
        : "none",
    filter:
      "drop-shadow(0 10px 20px rgba(0,0,0,0.12)) drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
    animationPlayState: playing ? "running" : "paused",
  };

  return (
    <div style={styles.shapeWrap}>
      <div style={base} className="spin-bob" />
      {/* Decorative orbs */}
      <div style={styles.orb(accent, 0.25, 16)} className="float-orb" />
      <div style={styles.orb("#ffffff", 0.18, -14)} className="float-orb" />
      {/* Inline style tag to inject keyframes once */}
      <StyleOnce />
    </div>
  );
}

function StyleOnce() {
  if (typeof document !== "undefined" && !document.getElementById("mynewpage-anim-css")) {
    const css = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes bob {
        0%   { transform: translateY(0px); }
        50%  { transform: translateY(-14px); }
        100% { transform: translateY(0px); }
      }
      @keyframes floatOrb {
        0%   { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.9; }
        50%  { transform: translateY(-10px) translateX(6px) scale(1.03); opacity: 1; }
        100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.9; }
      }
      .spin-bob {
        animation:
          spin var(--duration, 6s) linear infinite,
          bob calc(var(--duration, 6s) * 0.8) ease-in-out infinite;
      }
      .float-orb {
        animation: floatOrb 5s ease-in-out infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .spin-bob, .float-orb { animation: none !important; }
      }
    `;
    const tag = document.createElement("style");
    tag.id = "mynewpage-anim-css";
    tag.textContent = css;
    document.head.appendChild(tag);
  }
  return null;
}

const styles = {
  page: (c) => ({
    minHeight: "100vh",
    padding: "24px 16px 40px",
    background: `linear-gradient(180deg, ${c.bg1} 0%, ${c.bg2} 100%)`,
    color: "#0f172a",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 16,
  }),
  panel: {
    maxWidth: 960,
    margin: "0 auto",
    width: "100%",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
    letterSpacing: "-0.02em",
  },
  controls: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
  },
  button: (bg) => ({
    padding: "10px 14px",
    background: bg,
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    transition: "transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease",
    fontWeight: 600,
  }),
  select: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "white",
    color: "#0f172a",
    outline: "none",
  },
  groupLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 8px",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
  },
  stage: {
    position: "relative",
    maxWidth: 960,
    width: "100%",
    margin: "4px auto 0",
    aspectRatio: "16 / 9",
    background:
      "radial-gradient(1200px 600px at 10% -10%, rgba(255,255,255,0.7) 0%, transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.6), rgba(148,163,184,0.25))",
    borderRadius: 24,
    border: "1px solid rgba(15,23,42,0.08)",
    overflow: "hidden",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    boxShadow:
      "0 1px 0 rgba(15,23,42,0.04), 0 10px 25px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.4)",
  },
  shapeWrap: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
  },
  shapeBase: {
    width: "34vmin",
    height: "34vmin",
    transition: "border-radius 250ms ease, clip-path 250ms ease, background 250ms ease",
  },
  orb: (color, opacity = 0.2, offset = 0) => ({
    position: "absolute",
    width: "16vmin",
    height: "16vmin",
    borderRadius: "999px",
    background: color,
    opacity,
    top: `calc(22% + ${offset}px)`,
    left: "16%",
    filter: "blur(6px)",
    pointerEvents: "none",
  }),
  note: {
    textAlign: "center",
    color: "rgba(15,23,42,0.65)",
    marginTop: 10,
  },
};

export default MyNewPage;