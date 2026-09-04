import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from "framer-motion";
import { Bluetooth, Globe, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ConnectivityMode } from "./DisplayPanel";

export const modes: ConnectivityMode[] = ["bluetooth", "wifi-direct", "internet"];

const meta: Record<
  ConnectivityMode,
  { icon: typeof Globe; label: string; sub: string; token: string }
> = {
  bluetooth: { icon: Bluetooth, label: "Bluetooth", sub: "Nearby · offline", token: "--mode-bluetooth" },
  "wifi-direct": { icon: Wifi, label: "Wi-Fi Direct", sub: "Local mesh", token: "--mode-wifi-direct" },
  internet: { icon: Globe, label: "Internet", sub: "Squads worldwide", token: "--mode-internet" },
};

/** Horizontal drag distance (px) that rolls the antenna one mode step. */
const STEP = 88;
/** Cylinder rotation per mode step: 120°. */
const ROLL = (Math.PI * 2) / 3;
/** Visual radius of the cylinder surface in px. */
const RADIUS = 8.5;
/** Knurl columns around the circumference. */
const COLS = 10;

const SNAP = { type: "spring" as const, damping: 25, stiffness: 300 };

const hsl = (token: string, alpha?: number) =>
  alpha === undefined ? `hsl(var(${token}))` : `hsl(var(${token}) / ${alpha})`;

const clampRoll = (v: number) => Math.min(modes.length - 1 + 0.35, Math.max(-0.35, v));

/** One vertical column of knurl grip dots riding the rolling cylinder surface. */
const KnurlColumn = ({
  roll,
  phase,
  offset,
}: {
  roll: MotionValue<number>;
  phase: number;
  offset: boolean;
}) => {
  const x = useTransform(roll, (p) => Math.sin(phase - p * ROLL) * RADIUS);
  const scaleX = useTransform(roll, (p) => Math.max(0.1, Math.cos(phase - p * ROLL)));
  const opacity = useTransform(roll, (p) => {
    const c = Math.cos(phase - p * ROLL);
    return c > 0 ? 0.2 + 0.6 * c : 0;
  });
  const dots = offset ? [0, 1, 2, 3] : [0, 1, 2, 3, 4];

  return (
    <motion.div
      style={{ x, scaleX, opacity }}
      className={`absolute left-1/2 -ml-[1.5px] flex w-[3px] flex-col items-center justify-between ${
        offset ? "top-4 bottom-4" : "top-2.5 bottom-2.5"
      }`}
    >
      {dots.map((d) => (
        <span key={d} className="h-[3px] w-[3px] rounded-full bg-display-text/70" />
      ))}
    </motion.div>
  );
};

interface AntennaModeDialProps {
  mode: ConnectivityMode;
  onChange: (mode: ConnectivityMode) => void;
}

const AntennaModeDial = ({ mode, onChange }: AntennaModeDialProps) => {
  const index = Math.max(0, modes.indexOf(mode));
  const { icon: ActiveIcon, label, sub, token } = meta[mode];

  // Continuous roll position: 0 => bluetooth, 1 => wifi-direct, 2 => internet
  const roll = useMotionValue(index);
  const startRoll = useRef(index);
  const dragging = useRef(false);

  // Specular shimmer drifts slightly as the cylinder rolls
  const specX = useTransform(roll, (p) => Math.sin(p * Math.PI * 2) * 2);

  useEffect(() => {
    const controls = animate(roll, index, SNAP);
    return () => controls.stop();
  }, [index, roll]);

  const commit = (raw: number) => {
    const snapped = Math.round(Math.min(modes.length - 1, Math.max(0, raw)));
    if (modes[snapped] !== mode) onChange(modes[snapped]);
    else animate(roll, snapped, SNAP);
  };

  const cycle = () => {
    if (dragging.current) return;
    onChange(modes[(index + 1) % modes.length]);
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-device-body device-shadow px-4 pt-3 pb-2">
      {/* Ambient accent wash behind the antenna */}
      <div
        className="pointer-events-none absolute -left-4 top-0 h-full w-28 blur-2xl"
        style={{
          background: `radial-gradient(closest-side, ${hsl(token, 0.4)}, transparent)`,
          transition: "background 0.6s ease",
        }}
      />

      {/* Pencil-roll drag surface */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragStart={() => {
          startRoll.current = roll.get();
        }}
        onDrag={(_, info) => {
          if (Math.abs(info.offset.x) > 5) dragging.current = true;
          roll.set(clampRoll(startRoll.current - info.offset.x / STEP));
        }}
        onDragEnd={(_, info) => {
          commit(roll.get() - info.velocity.x / 1500);
          setTimeout(() => {
            dragging.current = false;
          }, 80);
        }}
        className="relative flex touch-none select-none items-center gap-3 cursor-grab active:cursor-grabbing"
      >
        {/* Upright antenna cylinder */}
        <motion.button
          type="button"
          onTap={cycle}
          whileTap={{ scale: 0.96 }}
          aria-label={`Connectivity mode: ${label}. Tap to switch`}
          className="relative flex flex-col items-center outline-none"
        >
          {/* Glowing tip LED */}
          <span
            className="relative z-10 mb-[3px] h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: hsl(token),
              boxShadow: `0 0 10px 2px ${hsl(token, 0.55)}`,
              transition: "background-color 0.45s ease, box-shadow 0.45s ease",
            }}
          />

          {/* Rolling cylinder body */}
          <span
            className="relative block h-16 w-6 overflow-hidden rounded-full bg-device-body-light"
            style={{
              boxShadow:
                "inset 4px 0 6px rgba(0,0,0,0.7), inset -4px 0 6px rgba(0,0,0,0.7), inset 0 3px 4px rgba(0,0,0,0.45), inset 0 -3px 4px rgba(0,0,0,0.45)",
            }}
          >
            {/* Knurled grip texture wrapping the surface */}
            {Array.from({ length: COLS }, (_, i) => (
              <KnurlColumn
                key={i}
                roll={roll}
                phase={(i / COLS) * Math.PI * 2}
                offset={i % 2 === 1}
              />
            ))}

            {/* Central specular reflection */}
            <motion.span
              style={{ x: specX }}
              className="absolute inset-y-1.5 left-1/2 -ml-[1.5px] block w-[3px] rounded-full bg-gradient-to-b from-card-foreground/70 via-card-foreground/25 to-card-foreground/55 blur-[1px]"
            />

            {/* Accent sheen bleeding from the tip */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(180deg, ${hsl(token, 0.3)}, transparent 45%)`,
                transition: "background 0.5s ease",
              }}
            />
          </span>

          {/* Base mount */}
          <span
            className="mt-[2px] block h-2 w-9 rounded-full bg-device-body-light"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.4)",
            }}
          />
        </motion.button>

        {/* Mode indicator pill */}
        <motion.button
          type="button"
          onTap={cycle}
          whileTap={{ scale: 0.95 }}
          aria-label={`Active mode: ${label}. Tap to switch`}
          className="relative flex items-center gap-2 rounded-full bg-walkie-button px-3.5 py-2 outline-none"
          style={{
            boxShadow: `0 4px 12px -2px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 18px 2px ${hsl(token, 0.3)}, inset 0 0 0 1px ${hsl(token, 0.45)}`,
            transition: "box-shadow 0.45s ease",
          }}
        >
          {/* Haptic-style snap pulse */}
          <AnimatePresence>
            <motion.span
              key={`pulse-${mode}`}
              initial={{ opacity: 0.6, scale: 1 }}
              animate={{ opacity: 0, scale: 1.35 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 0 2px ${hsl(token, 0.7)}` }}
            />
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.span
              key={`icon-${mode}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 25 }}
              transition={{ type: "spring", damping: 20, stiffness: 340 }}
              className="flex"
            >
              <ActiveIcon className="h-4 w-4" style={{ color: hsl(token) }} />
            </motion.span>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.span
              key={`label-${mode}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              className="whitespace-nowrap text-[11px] font-semibold tracking-wide text-card-foreground/80"
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* Right: context + step dots */}
        <div className="ml-auto flex flex-col items-end gap-1.5 pr-1">
          <span className="text-right text-[10px] font-medium uppercase tracking-wider text-card-foreground/35">
            {sub}
          </span>
          <div className="flex items-center gap-1">
            {modes.map((m, i) => (
              <span
                key={m}
                className="h-1 rounded-full bg-card-foreground/20"
                style={{
                  width: i === index ? 14 : 5,
                  backgroundColor: i === index ? hsl(meta[m].token) : undefined,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <p className="pt-1.5 text-center text-[9px] font-bold uppercase tracking-widest text-card-foreground/25">
        Roll the antenna · tap to switch
      </p>
    </div>
  );
};

export default AntennaModeDial;
