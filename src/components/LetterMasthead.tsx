"use client";

import { useEffect, useRef } from "react";

const LETTERS = ["K", "U", "M", "S", "U", "N", "G"] as const;

/** Percent of the field. */
const PLACEMENT = [
  { x: 8, y: 16 },
  { x: 30, y: 6 },
  { x: 52, y: 20 },
  { x: 72, y: 5 },
  { x: 16, y: 58 },
  { x: 46, y: 66 },
  { x: 70, y: 46 },
];

type Axis = "wide" | "tall" | "disk";

/** A point runs the path, the line catches up, then the line opens into a plane. */
const GESTURES: { delay: number; axis: Axis }[] = [
  { delay: 0, axis: "wide" },
  { delay: 0.34, axis: "tall" },
  { delay: 0.67, axis: "disk" },
];

const CYCLE = 5.2;
const TRAIL = [0.018, 0.04, 0.068, 0.1];

function easeOut(t: number) {
  return 1 - (1 - t) ** 3;
}

function burst(t: number) {
  return 1 - (1 - t) ** 2.15;
}

function widePath(w: number, h: number, time: number, energy: number) {
  const a = Math.sin(time * 1.35);
  const b = Math.cos(time * 0.95);
  const y0 = h * (0.74 + a * 0.05 * energy);
  const y1 = h * (0.68 - 0.36 * energy + b * 0.05 * energy);
  const y2 = h * (0.8 - a * 0.04 * energy);
  const y3 = h * (0.66 - 0.1 * energy + b * 0.04 * energy);
  return `M ${w * -0.06} ${y0} C ${w * 0.3} ${y1}, ${w * 0.64} ${y2}, ${w * 1.05} ${y3}`;
}

function tallPath(w: number, h: number, time: number, energy: number) {
  const a = Math.cos(time * 1.2);
  const b = Math.sin(time * 0.88 + 1.2);
  const x0 = w * (0.93 + a * 0.02 * energy);
  const x1 = w * (0.9 - 0.24 * energy + b * 0.04 * energy);
  const x2 = w * (0.97 + a * 0.02 * energy);
  const x3 = w * (0.88 - 0.08 * energy);
  return `M ${x0} ${h * 1.04} C ${x1} ${h * 0.68}, ${x2} ${h * 0.34}, ${x3} ${h * -0.02}`;
}

function diskPath(w: number, h: number, time: number, energy: number) {
  const span = Math.min(w, h);
  const cx = w * (0.56 + Math.sin(time * 0.7) * 0.025 * energy);
  const cy = h * (0.4 + Math.cos(time * 0.62) * 0.03 * energy);
  const r = span * (0.11 + energy * 0.015);
  const x = cx + r;
  const y = cy;
  return `M ${x} ${y} A ${r} ${r} 0 1 1 ${x - 0.6} ${y + 0.6}`;
}

function pathData(axis: Axis, w: number, h: number, time: number, energy: number) {
  if (axis === "wide") return widePath(w, h, time, energy);
  if (axis === "tall") return tallPath(w, h, time, energy);
  return diskPath(w, h, time, energy);
}

function planeStroke(axis: Axis, w: number, h: number) {
  if (axis === "wide") return h * 0.2;
  if (axis === "tall") return w * 0.12;
  return Math.min(w, h) * 0.2;
}

export function LetterMasthead() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const headRefs = useRef<(SVGCircleElement | null)[]>([]);
  const trailRefs = useRef<(SVGCircleElement | null)[][]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const started = performance.now();

    const paint = (time: number) => {
      const width = field.clientWidth;
      const height = field.clientHeight;
      if (!width || !height) return;

      GESTURES.forEach((gesture, index) => {
        const phase = reduce ? 0.66 : ((time / CYCLE) + gesture.delay) % 1;
        const traveling = phase < 0.48 || phase > 0.9;
        const energy = reduce ? 0.15 : traveling ? 1 : 0.18;
        const path = pathRefs.current[index];
        if (!path) return;

        path.setAttribute("d", pathData(gesture.axis, width, height, time, energy));
        const total = path.getTotalLength();
        if (!total) return;

        const maxStroke = planeStroke(gesture.axis, width, height);
        let head = 0;
        let tail = 0;
        let stroke = 0;
        let headR = 0;
        let opacity = 1;
        let showTrail = false;

        if (phase < 0.06) {
          const t = easeOut(phase / 0.06);
          head = 0;
          tail = 0;
          headR = 3 + t * 8;
          opacity = t;
        } else if (phase < 0.4) {
          const t = burst((phase - 0.06) / 0.34);
          head = t;
          tail = Math.max(0, t - 0.16);
          stroke = 5;
          headR = 9;
          showTrail = true;
        } else if (phase < 0.5) {
          const t = easeOut((phase - 0.4) / 0.1);
          head = 1;
          tail = 0.16 * (1 - t);
          stroke = 5;
          headR = 9 * (1 - t);
          showTrail = t < 0.4;
        } else if (phase < 0.64) {
          const t = easeOut((phase - 0.5) / 0.14);
          const overshoot = Math.sin(t * Math.PI) * 0.08;
          head = 1;
          tail = 0;
          stroke = 5 + Math.min(1.08, t + overshoot) * (maxStroke - 5);
        } else if (phase < 0.8) {
          const breathe = 1 + Math.sin(time * 2.6 + index) * 0.04;
          head = 1;
          tail = 0;
          stroke = maxStroke * breathe;
        } else if (phase < 0.9) {
          const t = easeOut((phase - 0.8) / 0.1);
          head = 1;
          tail = 0;
          stroke = maxStroke * (1 - t) + 5 * t;
        } else {
          const t = burst((phase - 0.9) / 0.1);
          head = 1 - t;
          tail = Math.max(0, head - 0.14);
          stroke = 5 * (1 - t * 0.45);
          headR = 8;
          showTrail = true;
          opacity = 1 - t * 0.35;
        }

        const headLen = Math.max(0, Math.min(total, head * total));
        const tailLen = Math.max(0, Math.min(headLen, tail * total));
        const vis = Math.max(headLen - tailLen, stroke > 0 ? 0.5 : 0);
        path.setAttribute("stroke-dasharray", `${vis} ${total + 4}`);
        path.setAttribute("stroke-dashoffset", `${-tailLen}`);
        path.setAttribute("stroke-width", String(Math.max(stroke, 0)));
        path.style.opacity = stroke > 0.4 ? String(opacity) : "0";

        const tip = path.getPointAtLength(headLen);
        const headDot = headRefs.current[index];
        if (headDot) {
          headDot.setAttribute("cx", String(tip.x));
          headDot.setAttribute("cy", String(tip.y));
          headDot.setAttribute("r", String(headR));
          headDot.style.opacity = headR > 0.4 ? String(opacity) : "0";
        }

        const trails = trailRefs.current[index] ?? [];
        trails.forEach((dot, trailIndex) => {
          if (!dot) return;
          const at = head - TRAIL[trailIndex];
          const visible = showTrail && at > tail && headR > 0;
          const point = path.getPointAtLength(Math.max(0, at) * total);
          dot.setAttribute("cx", String(point.x));
          dot.setAttribute("cy", String(point.y));
          dot.setAttribute("r", String(Math.max(2.2, 6 - trailIndex * 1.15)));
          dot.style.opacity = visible ? String((0.55 - trailIndex * 0.12) * opacity) : "0";
        });
      });
    };

    const tick = (now: number) => {
      paint((now - started) / 1000);
      if (!reduce) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="px-[var(--page-x)] pt-8 pb-2 md:pt-10">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-[var(--ink)] pb-3 text-[0.68rem] tracking-[0.18em] uppercase">
        <span>Vol. 01</span>
        <span className="text-[var(--signal)]">Architecture</span>
        <span>[ Kumsung ]</span>
      </div>

      <h1 className="sr-only">Kumsung Engineering</h1>
      <p className="mb-4 font-display text-5xl leading-none tracking-[-0.04em] text-[var(--signal)] md:hidden">
        portfolio
      </p>
      <div className="flex items-stretch gap-3 md:gap-6">
        <div ref={fieldRef} className="relative h-[clamp(20rem,46vh,30rem)] min-w-0 flex-1 overflow-hidden" aria-hidden>
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {GESTURES.map((gesture) => (
              <g key={gesture.axis}>
                <path
                  ref={(node) => {
                    pathRefs.current[GESTURES.indexOf(gesture)] = node;
                  }}
                  fill="none"
                  stroke="var(--signal)"
                  strokeLinecap="round"
                />
                {TRAIL.map((step) => (
                  <circle
                    key={step}
                    ref={(node) => {
                      const index = GESTURES.indexOf(gesture);
                      if (!trailRefs.current[index]) trailRefs.current[index] = [];
                      trailRefs.current[index][TRAIL.indexOf(step)] = node;
                    }}
                    fill="var(--signal)"
                  />
                ))}
                <circle
                  ref={(node) => {
                    headRefs.current[GESTURES.indexOf(gesture)] = node;
                  }}
                  fill="var(--signal)"
                />
              </g>
            ))}
          </svg>
          {LETTERS.map((letter, index) => (
            <div
              key={`${letter}-${index}`}
              className="absolute z-10 -translate-x-1/2"
              style={{ left: `${PLACEMENT[index].x}%`, top: `${PLACEMENT[index].y}%` }}
            >
              <span className="block font-display text-[clamp(4.6rem,9vw,8.75rem)] leading-none font-medium tracking-[-0.06em]">
                {letter}
              </span>
            </div>
          ))}
        </div>
        <p
          className="hidden shrink-0 font-display text-[clamp(2.8rem,4vw,4.25rem)] leading-none font-medium tracking-[-0.05em] text-[var(--signal)] md:block"
          style={{ writingMode: "vertical-rl" }}
          aria-hidden
        >
          portfolio
        </p>
      </div>
    </section>
  );
}
