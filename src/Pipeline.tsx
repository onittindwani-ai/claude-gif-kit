import React from "react";
import { AbsoluteFill, Easing, Img, Loop, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Poppins";

/*
  The animated explainer from the Claude GIF Kit: footage in, content out.
  1080 x 1350 (4:5), 60 fps, 18.5 s. Every frame is a pure function of the frame number (no random, no CSS animation, no Date).
  Edit the constants near the top (clips, tools, agents, platforms, words) and keep the rest.
*/

export const PL_FPS = 60;
export const PL_FRAMES = 1110;
export const PL_MAIN_FRAME = 746;
const W = 1080;
const H = 1350;

const sans = loadSans("normal", { weights: ["500", "600", "700", "800"], subsets: ["latin"] }).fontFamily;

const K = {
  bg: "#050506",
  ink: "#FFFFFF",
  soft: "#A9A7B0",
  yellow: "#FFD60A",
  yellowInk: "#161100",
  blue: "#2D7BFF",
  blueDeep: "#1C57C9",
  green: "#22D37A",
  pink: "#FF3B8D",
  panel: "#0E0E12",
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (s: number) => Math.round(s * PL_FPS);
const t01 = (f: number, a: number, b: number, ease: (x: number) => number = Easing.bezier(0.33, 0, 0.2, 1)) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });
const inOut = Easing.bezier(0.65, 0, 0.35, 1);
const outBack = Easing.bezier(0.2, 0.9, 0.25, 1.15);
const blurIn = (p: number, px = 10) => `blur(${(1 - p) * px}px)`;

/* ---------- layout ---------- */
const TILE_W = 60;
const TILE_H = 108;
const TILE_GAP = 10;
const LABEL_Y = 258;
const GROUP_Y = 296;
const CX = [240, 540, 840];
const GROUPS = [
  { name: "a-roll", clips: ["a1", "a2", "a3"] },
  { name: "b-roll", clips: ["b1", "b2", "b3"] },
  { name: "raw footage", clips: ["c1", "c2", "c3"] },
];
const AI = { x: 540, y: 574, s: 118 };
const TOOL = 84;
const TOOL_GAP = 16;
const TOOLS_Y = 678;
const EDIT_LABEL_Y = 792;
const RULER_Y = 840;
const EDIT_W = 904;
const EDIT_X = 88;
const OUT_Y = 1004;
const OUT_W = 80;
const OUT_H = 142;
const OUT_CLIPS = ["a2", "b2", "c3", "a3"];
const PLATFORMS: Array<{ name: string; file?: string; full?: boolean; label?: string }> = [
  { name: "Instagram", file: "instagram.svg" },
  { name: "TikTok", file: "tiktok.svg" },
  { name: "LinkedIn", label: "in" },
  { name: "X", file: "x.svg" },
];
const OUT_CX = [0, 1, 2, 3].map((i) => EDIT_X + (EDIT_W * (i + 0.5)) / 4);

type P = { x: number; y: number };
const bez = (p0: P, p1: P, p2: P, p3: P, t: number): P => {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
};
const START_Y = GROUP_Y + TILE_H + 10;
const AI_TOP = AI.y - AI.s / 2;
const PATHS: Array<[P, P, P, P]> = [
  [{ x: CX[0], y: START_Y }, { x: CX[0], y: 490 }, { x: 430, y: AI_TOP }, { x: AI.x - 26, y: AI_TOP }],
  [{ x: CX[1], y: START_Y }, { x: CX[1], y: 455 }, { x: CX[1], y: 490 }, { x: CX[1], y: AI_TOP }],
  [{ x: CX[2], y: START_Y }, { x: CX[2], y: 490 }, { x: 650, y: AI_TOP }, { x: AI.x + 26, y: AI_TOP }],
];
const pathD = (p: [P, P, P, P]) => `M${p[0].x},${p[0].y} C${p[1].x},${p[1].y} ${p[2].x},${p[2].y} ${p[3].x},${p[3].y}`;

/* ---------- tools: one line, real marks (public/logos/LICENSES.md) ---------- */
type Tool = { name: string; file?: string; bg: string; full?: boolean; pad?: number };
const TOOLS: Tool[] = [
  { name: "Earshot", bg: "#17171B" },
  { name: "Palmier Pro", bg: "#17171B" },
  { name: "Higgsfield", bg: "#17171B" },
  { name: "Nano Banana", file: "nanobanana.svg", bg: "#F4F2EC", pad: 24 },
  { name: "Deepgram", file: "deepgram.svg", bg: "#17171B", pad: 24 },
  { name: "FFmpeg", file: "ffmpeg.svg", bg: "#F4F2EC", pad: 24 },
  { name: "Figma", file: "figma.svg", bg: "#F4F2EC", pad: 24 },
];
const toolX = (i: number) => (W - (TOOLS.length * TOOL + (TOOLS.length - 1) * TOOL_GAP)) / 2 + i * (TOOL + TOOL_GAP);

/* ---------- the four agents orbiting inside the AI container ---------- */
const AGENTS = [
  { name: "Claude Code", file: "claudecode.svg" },
  { name: "Codex", file: "codex.svg" },
  { name: "Gemini", file: "gemini.svg" },
  { name: "Hermes Agent", file: "hermesagent.svg" },
];

/* ---------- timeline content (decorative, like an editor timeline) ---------- */
const V1: Array<[number, number, string]> = [
  [0, 150, K.blue], [154, 112, K.blueDeep], [270, 190, K.blue], [464, 92, K.blueDeep], [560, 172, K.blue], [736, 168, K.blueDeep],
];
const V2: Array<[number, number, string]> = [
  [56, 128, K.yellow], [336, 96, K.yellow], [590, 150, K.pink], [770, 110, K.yellow],
];
const WAVE_BARS = 113; // 8 px pitch over 904 px

const STRIP_WORDS = ["COMMENT", "RAW", "FOR", "THE", "CLAUDE", "GIF", "KIT"];
const END_WORDS = ["and", "I'll", "send", "you", "the", "Claude", "GIF", "Kit"];

/* ---------- pieces ---------- */
const Footage: React.FC<{ src: string; offset: number; style?: React.CSSProperties }> = ({ src, offset, style }) => (
  <div style={{ overflow: "hidden", background: "#111114", ...style }}>
    <Loop durationInFrames={190}>
      <OffthreadVideo
        src={staticFile(`clips/${src}.mp4`)}
        muted
        startFrom={offset}
        endAt={offset + 190}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: src === "b3" ? "scaleX(-1) scale(1.25)" : undefined }}
      />
    </Loop>
  </div>
);

const ToolTile: React.FC<{ tool: Tool; x: number; p: number }> = ({ tool, x, p }) => {
  const sc = 0.72 + 0.28 * outBack(p);
  const inner = TOOL - 2 * (tool.pad ?? 0);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: TOOLS_Y,
        width: TOOL,
        height: TOOL,
        borderRadius: 26,
        background: tool.bg,
        boxShadow: "0 0 0 2px rgba(255,255,255,0.2), 0 12px 26px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: Math.min(1, p * 1.6),
        transform: `scale(${sc})`,
        filter: blurIn(p, 8),
      }}
    >
      {tool.file ? (
        <Img src={staticFile(`logos/${tool.file}`)} style={tool.full ? { width: TOOL, height: TOOL } : { width: inner, height: inner, objectFit: "contain" }} />
      ) : (
        <div style={{ fontWeight: 800, fontSize: 15, color: "#F2F0EA", textAlign: "center", lineHeight: 1.15, padding: 4 }}>{tool.name}</div>
      )}
    </div>
  );
};

/* ---------- underline, one pass: every word is underlined once, left to right, at a slow pace ---------- */
const UL_RAW_COLOR = "#2B6BFF";
const ulEase = Easing.bezier(0.45, 0, 0.55, 1);
// [start frame, duration]. The strip finishes on the last letter of KIT at frame 740, then the screen changes.
const STRIP_UL: Array<[number, number]> = [[10, 120], [140, 110], [260, 80], [350, 80], [440, 120], [570, 80], [660, 80]];
// Relative to the start of the end screen: COMMENT, RAW, then the eight words of the sentence.
const END_UL: Array<[number, number]> = [[30, 50], [86, 70], [164, 16], [183, 16], [202, 16], [221, 16], [240, 16], [259, 16], [278, 16], [297, 16]];
const ulP = (local: number, st: [number, number]) => interpolate(local, [st[0], st[0] + st[1]], [0, 1], { ...clamp, easing: ulEase });
const Underline: React.FC<{ local: number; st: [number, number]; height: number; color: string; bottom: number; radius?: number }> = ({ local, st, height, color, bottom, radius = 3 }) => (
  <span
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom,
      height,
      borderRadius: radius,
      background: color,
      transformOrigin: "0% 50%",
      transform: `scaleX(${ulP(local, st)})`,
    }}
  />
);
// An arc that bows upward, drawn left to right.
const CurvedUnderline: React.FC<{ local: number; st: [number, number]; color: string; stroke: number; w: number; h: number; style: React.CSSProperties }> = ({ local, st, color, stroke, w, h, style }) => (
  <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", overflow: "visible", ...style }}>
    <path d={`M${0.03 * w},${0.9 * h} Q ${0.5 * w},${-0.1 * h} ${0.97 * w},${0.9 * h}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ulP(local, st)} />
  </svg>
);

export const PlScene: React.FC<{ f: number; slotF?: number }> = ({ f, slotF }) => {
  /* headline: fully visible on frame 0, small punch */
  const punch = 1 + 0.045 * (1 - t01(f, 0, 16, Easing.out(Easing.cubic)));

  /* source tiles */
  const tileP = (g: number, i: number) => t01(f, S(0.15) + g * 10 + i * 7, S(0.95) + g * 10 + i * 7);

  /* AI container */
  const aiP = t01(f, S(0.8), S(1.4), outBack);
  /* one slot: the current logo slides up and out while the next one rises into the same place */
  const SLOT_PERIOD = 96;
  const SLOT_MOVE = 30;
  const SLOT_TRAVEL = 112;
  const slotT = Math.max(0, (slotF ?? f) - S(1.4));
  const slotStep = Math.floor(slotT / SLOT_PERIOD);
  const slotPhase = slotT - slotStep * SLOT_PERIOD;
  const slotD = slotPhase <= SLOT_PERIOD - SLOT_MOVE ? 0 : inOut((slotPhase - (SLOT_PERIOD - SLOT_MOVE)) / SLOT_MOVE);
  const slotCur = slotStep % AGENTS.length;
  const slotNext = (slotStep + 1) % AGENTS.length;
  const slotBlur = 3 * Math.sin(slotD * Math.PI);

  /* particles into the AI container */
  const dots: React.ReactNode[] = [];
  PATHS.forEach((p, g) => {
    for (let k = 0; k < 14; k++) {
      const start = S(1.15) + g * 6 + k * 14;
      const raw = (f - start) / 54;
      if (raw <= 0 || raw >= 1) continue;
      for (let j = 0; j < 6; j++) {
        const r = raw - j * 0.022;
        if (r <= 0) continue;
        const pt = bez(p[0], p[1], p[2], p[3], inOut(Math.min(1, r)));
        const a = (1 - j / 6) * (raw > 0.85 ? (1 - raw) / 0.15 : 1);
        dots.push(<circle key={`d${g}-${k}-${j}`} cx={pt.x} cy={pt.y} r={6.5 - j * 0.7} fill={j === 0 ? K.yellow : "#fff"} opacity={a * (j === 0 ? 1 : 0.55)} />);
      }
    }
  });

  /* connector to tools */
  const lineP = t01(f, S(3.0), S(3.5));

  /* timeline */
  const edLabelP = t01(f, S(5.4), S(5.8));
  const fill = t01(f, S(5.7), S(8.5), Easing.bezier(0.45, 0, 0.55, 1));

  /* outputs */
  const outP = (i: number) => t01(f, S(8.8) + i * 14, S(8.8) + i * 14 + 56, inOut);
  const outLabelP = (i: number) => t01(f, S(8.8) + i * 14 + 44, S(8.8) + i * 14 + 66);

  /* comment ask: a strip on the main screen, a full end screen after it */
  const EXIT_A = 748;
  const exitP = t01(f, EXIT_A, EXIT_A + 32, inOut);
  const cardIn = (a: number, b: number) => t01(f, EXIT_A + a, EXIT_A + b);
  const stripP = t01(f, 0, 14, Easing.out(Easing.cubic));
  const bob = Math.sin(f / 9) * 5;
  const c0 = cardIn(10, 38);
  const c1 = cardIn(20, 54);
  const c2 = cardIn(38, 68);
  const c3 = cardIn(50, 80);
  const c4 = cardIn(62, 90);
  const rawPulse = 1 + 0.012 * Math.sin(Math.max(0, f - EXIT_A) / 14);
  const stripLocal = f;
  const endLocal = f - EXIT_A;

  const trackBox = (top: number, h: number) => ({ position: "absolute" as const, left: EDIT_X, top, width: EDIT_W, height: h, borderRadius: 8, background: K.panel, boxShadow: "0 0 0 1.5px #25252C", opacity: edLabelP });

  return (
    <AbsoluteFill style={{ background: K.bg, color: K.ink, fontFamily: sans, fontWeight: 600 }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "50% 0", transform: `translateY(${75 - exitP * 110}px) scale(0.935)`, opacity: 1 - exitP, filter: `blur(${exitP * 10}px)` }}>
      {/* headline */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", transform: `scale(${punch})`, transformOrigin: "50% 40%" }}>
        <div style={{ fontWeight: 800, fontSize: 80, lineHeight: 1, letterSpacing: -1.8, color: K.ink }}>FOOTAGE IN.</div>
        <div style={{ display: "inline-block", marginTop: 10, padding: "2px 30px 7px", borderRadius: 14, background: K.yellow, color: K.yellowInk, fontWeight: 800, fontSize: 80, lineHeight: 1.04, letterSpacing: -1.8 }}>CONTENT OUT.</div>
      </div>

      {/* source groups */}
      {GROUPS.map((g, gi) => {
        const w = 3 * TILE_W + 2 * TILE_GAP;
        return (
          <React.Fragment key={g.name}>
            <div style={{ position: "absolute", left: CX[gi] - w / 2, width: w, top: LABEL_Y, textAlign: "center", fontSize: 28, fontWeight: 700, color: K.soft, opacity: tileP(gi, 0), letterSpacing: 0.4 }}>{g.name}</div>
            {g.clips.map((c, i) => {
              const p = tileP(gi, i);
              return (
                <div
                  key={c}
                  style={{
                    position: "absolute",
                    left: CX[gi] - w / 2 + i * (TILE_W + TILE_GAP),
                    top: GROUP_Y + (1 - p) * 16,
                    width: TILE_W,
                    height: TILE_H,
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 0 0 2px rgba(255,255,255,0.2)",
                    opacity: p,
                    filter: blurIn(p, 8),
                  }}
                >
                  <Footage src={c} offset={i * 14 + gi * 5} style={{ width: TILE_W, height: TILE_H }} />
                </div>
              );
            })}
          </React.Fragment>
        );
      })}

      {/* curves and particles */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>
        {PATHS.map((p, g) => (
          <path key={g} d={pathD(p)} fill="none" stroke="#3A3A44" strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - t01(f, S(0.9) + g * 6, S(1.6) + g * 6)} />
        ))}
        <g filter="url(#glow)" opacity={0.6}>{dots}</g>
        <g>{dots}</g>
        <line x1={AI.x} y1={AI.y + AI.s / 2 + 6} x2={AI.x} y2={AI.y + AI.s / 2 + 6 + 28 * lineP} stroke={K.yellow} strokeWidth={3} strokeDasharray="5 6" opacity={lineP > 0 ? 1 : 0} />
      </svg>

      {/* AI container: static, simple; the agents orbit inside */}
      <div
        style={{
          position: "absolute",
          left: AI.x - AI.s / 2,
          top: AI.y - AI.s / 2,
          width: AI.s,
          height: AI.s,
          borderRadius: 38,
          background: K.panel,
          boxShadow: `0 0 0 4px ${K.yellow}`,
          transform: `scale(${0.86 + 0.14 * aiP})`,
          opacity: Math.min(1, aiP * 1.5),
          overflow: "hidden",
        }}
      >
        {[
          { idx: slotCur, y: -slotD * SLOT_TRAVEL },
          { idx: slotNext, y: (1 - slotD) * SLOT_TRAVEL },
        ].map(({ idx, y }, k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: (AI.s - 90) / 2,
              top: (AI.s - 90) / 2 + y,
              width: 90,
              height: 90,
              borderRadius: 25,
              background: "#F4F2EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: `blur(${slotBlur}px)`,
            }}
          >
            <Img src={staticFile(`logos/${AGENTS[idx].file}`)} style={{ width: 60, height: 60, objectFit: "contain" }} />
          </div>
        ))}
      </div>

      {/* tools, one line */}
      {TOOLS.map((t, i) => (
        <ToolTile key={t.name} tool={t} x={toolX(i)} p={t01(f, S(3.45) + i * 10, S(3.45) + i * 10 + 32)} />
      ))}

      {/* the edit: label, ruler, three tracks */}
      <div style={{ position: "absolute", left: EDIT_X, top: EDIT_LABEL_Y, fontSize: 32, fontWeight: 800, letterSpacing: 0.2, opacity: edLabelP, filter: blurIn(edLabelP, 6) }}>one clean edit</div>
      <div style={{ ...trackBox(RULER_Y, 14), borderRadius: 4, background: "#08080B" }} />
      {Array.from({ length: 23 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: EDIT_X + 8 + i * 40, top: RULER_Y + 3, width: 2, height: i % 5 === 0 ? 8 : 5, background: "#5A5A66", opacity: edLabelP }} />
      ))}
      <div style={trackBox(RULER_Y + 22, 36)} />
      <div style={trackBox(RULER_Y + 64, 30)} />
      <div style={trackBox(RULER_Y + 100, 36)} />
      {V1.map(([l, w, col], i) => {
        const vis = Math.max(0, Math.min(w, EDIT_W * fill - l));
        return <div key={`v1${i}`} style={{ position: "absolute", left: EDIT_X + l, top: RULER_Y + 26, width: vis, height: 28, borderRadius: 5, background: col, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)" }} />;
      })}
      {V2.map(([l, w, col], i) => {
        const vis = Math.max(0, Math.min(w, EDIT_W * fill - l));
        return <div key={`v2${i}`} style={{ position: "absolute", left: EDIT_X + l, top: RULER_Y + 67, width: vis, height: 24, borderRadius: 5, background: col }} />;
      })}
      {Array.from({ length: WAVE_BARS }).map((_, i) => {
        const x = i * 8;
        if (x + 4 > EDIT_W * fill) return null;
        const h = 6 + 24 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11 + 1.3)) + 4 * Math.abs(Math.sin(i * 1.9));
        return <div key={`w${i}`} style={{ position: "absolute", left: EDIT_X + x + 2, top: RULER_Y + 118 - h / 2, width: 4, height: Math.min(30, h), borderRadius: 2, background: K.green }} />;
      })}
      <div style={{ position: "absolute", left: EDIT_X + EDIT_W * fill - 2, top: RULER_Y - 6, width: 4, height: 148, borderRadius: 2, background: "#fff", opacity: fill > 0.001 && fill < 0.999 ? 1 : 0 }} />

      {/* outputs */}
      {OUT_CX.map((cx, i) => {
        const p = outP(i);
        const fromX = 540;
        const fromY = RULER_Y + 60;
        const x = fromX + (cx - fromX) * p;
        const y = fromY + (OUT_Y - fromY) * p - Math.sin(p * Math.PI) * 46;
        const sc = 0.3 + 0.7 * p;
        return (
          <React.Fragment key={i}>
            {p > 0 && (
              <div style={{ position: "absolute", left: x - (OUT_W * sc) / 2, top: y, width: OUT_W * sc, height: OUT_H * sc, borderRadius: 16 * sc, overflow: "hidden", boxShadow: `0 0 0 3.5px ${K.yellow}`, background: "#111114" }}>
                <Footage src={OUT_CLIPS[i]} offset={i * 11} style={{ width: "100%", height: "100%" }} />
                <div style={{ position: "absolute", left: "10%", right: "10%", bottom: "13%", height: "9%", borderRadius: 4, background: "#fff" }} />
                <div style={{ position: "absolute", left: "22%", right: "22%", bottom: "5%", height: "4.5%", borderRadius: 3, background: K.yellow }} />
              </div>
            )}
            <div
              style={{
                position: "absolute",
                left: cx - 26,
                top: OUT_Y + OUT_H + 16,
                width: 52,
                height: 52,
                borderRadius: 15,
                background: PLATFORMS[i].full ? "transparent" : "#F4F2EC",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 2px rgba(255,255,255,0.2)",
                opacity: outLabelP(i),
                transform: `scale(${0.7 + 0.3 * outBack(outLabelP(i))})`,
                filter: blurIn(outLabelP(i), 6),
              }}
            >
              {PLATFORMS[i].file ? (
                <Img src={staticFile(`logos/${PLATFORMS[i].file}`)} style={{ width: 31, height: 31, objectFit: "contain" }} />
              ) : (
                <div style={{ fontWeight: 800, fontSize: 26, color: "#0A66C2", textAlign: "center" }}>{PLATFORMS[i].label ?? PLATFORMS[i].name}</div>
              )}
            </div>
          </React.Fragment>
        );
      })}
      </div>

      {/* comment strip, there from the first frame */}
      <div
        style={{
          position: "absolute",
          left: 80,
          width: 920,
          top: 18,
          height: 68,
          borderRadius: 34,
          background: "#FFFFFF",
          color: "#0A0A0A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 13,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 0.2,
          opacity: (1 - exitP) * stripP,
          transform: `scale(${0.96 + 0.04 * stripP})`,
          filter: `blur(${(1 - stripP) * 8 + exitP * 10}px)`,
        }}
      >
        {STRIP_WORDS.map((w, i) =>
          w === "RAW" ? (
            <span key={w} style={{ position: "relative", display: "inline-block", background: K.yellow, padding: "0 16px 13px", borderRadius: 14, lineHeight: "38px" }}>
              RAW
              <CurvedUnderline local={stripLocal} st={STRIP_UL[i]} color={UL_RAW_COLOR} stroke={6} w={76} h={12} style={{ left: 15, bottom: 3 }} />
            </span>
          ) : (
            <span key={`${w}${i}`} style={{ position: "relative", display: "inline-block", lineHeight: "42px" }}>
              {w}
              <Underline local={stripLocal} st={STRIP_UL[i]} height={4} color="#0A0A0A" bottom={-1} />
            </span>
          ),
        )}
        <span style={{ display: "inline-block", transform: `translateY(${bob}px)` }}>↓</span>
      </div>

      {/* end screen */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
        <div style={{ position: "relative", fontWeight: 800, fontSize: 130, letterSpacing: -3, lineHeight: 1, opacity: c0, filter: blurIn(c0, 12), transform: `translateY(${(1 - c0) * 30}px)` }}>
          COMMENT
          <Underline local={endLocal} st={END_UL[0]} height={9} color={K.yellow} bottom={-12} radius={5} />
        </div>
        <div style={{ position: "relative", marginTop: 26 }}>
          <div
            style={{
              background: K.yellow,
              color: K.yellowInk,
              fontWeight: 800,
              fontSize: 210,
              letterSpacing: -4,
              lineHeight: 1,
              padding: "0 52px 18px",
              borderRadius: 36,
              opacity: Math.min(1, c1 * 1.5),
              transform: `scale(${(0.8 + 0.2 * outBack(c1)) * rawPulse})`,
              filter: blurIn(c1, 10),
            }}
          >
            RAW
          </div>
          <CurvedUnderline local={endLocal} st={END_UL[1]} color={UL_RAW_COLOR} stroke={15} w={520} h={26} style={{ left: 45, bottom: -42, opacity: c1 }} />
        </div>
        <div style={{ marginTop: 60, fontWeight: 700, fontSize: 44, opacity: c2, filter: blurIn(c2, 8), transform: `translateY(${(1 - c2) * 20}px)`, display: "flex", gap: 13 }}>
          {END_WORDS.map((w, i) => (
            <span key={`${w}${i}`} style={{ position: "relative", display: "inline-block", lineHeight: "52px" }}>
              {w}
              <Underline local={endLocal} st={END_UL[i + 2]} height={4} color={K.yellow} bottom={1} />
            </span>
          ))}
        </div>
        <div style={{ marginTop: 8, fontWeight: 600, fontSize: 31, color: "#B9B7C0", opacity: c2, filter: blurIn(c2, 8) }}>the exact code, prompts and recipe behind this GIF</div>
        <div style={{ marginTop: 30, border: `4px solid ${K.yellow}`, color: K.yellow, borderRadius: 44, padding: "4px 36px 8px", fontWeight: 800, fontSize: 38, opacity: c3, filter: blurIn(c3, 8), transform: `scale(${0.9 + 0.1 * outBack(c3)})` }}>+ BONUS: Agent Editor</div>
        <div style={{ marginTop: 12, fontWeight: 700, fontSize: 34, opacity: c3, filter: blurIn(c3, 8) }}>7 AI video editors and 42 skills</div>
        <div style={{ marginTop: 22, fontWeight: 800, fontSize: 90, lineHeight: 1, color: K.ink, opacity: c4, transform: `translateY(${bob * 1.4}px)` }}>↓</div>
      </div>
    </AbsoluteFill>
  );
};

export const Pipeline: React.FC = () => {
  const f = useCurrentFrame();
  return <PlScene f={f} />;
};
export const PipelineEnd: React.FC = () => <PlScene f={PL_FRAMES - 1} />;
export const PipelineMain: React.FC = () => <PlScene f={PL_MAIN_FRAME} slotF={700} />;
