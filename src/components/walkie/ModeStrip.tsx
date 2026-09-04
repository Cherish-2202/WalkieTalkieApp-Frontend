import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { Bluetooth, Globe, Wifi } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ConnectivityMode } from "./DisplayPanel";

export const modes: ConnectivityMode[] = ["internet", "bluetooth", "wifi-direct"];

const meta: Record<ConnectivityMode, { icon: typeof Globe; label: string; sub: string }> = {
  internet: { icon: Globe, label: "Internet", sub: "Squads worldwide" },
  bluetooth: { icon: Bluetooth, label: "Bluetooth", sub: "Nearby · offline" },
  "wifi-direct": { icon: Wifi, label: "Wi-Fi Direct", sub: "Local mesh" },
};

interface ModeStripProps {
  mode: ConnectivityMode;
  onChange: (mode: ConnectivityMode) => void;
}

/** Horizontal drag distance that equals one mode step. */
const STEP = 84;

const ModeStrip = ({ mode, onChange }: ModeStripProps) => {
  const ActiveIcon = meta[mode].icon;
  const index = Math.max(0, modes.indexOf(mode));

  // Continuous drag position: 0 => internet, 1 => bluetooth, 2 => wifi-direct
  const pos = useMotionValue(index);
  const startPos = useRef(index);

  // Antenna spins as you scroll horizontally
  const rotate = useTransform(pos, (p) => p * 180);
  const rodTilt = useTransform(pos, (p) => Math.sin(p * Math.PI) * 14);
  const shade = useTransform(pos, (p) => 0.35 + 0.4 * Math.abs(Math.cos(p * Math.PI)));

  useEffect(() => {
    const controls = animate(pos, index, { type: "spring", damping: 20, stiffness: 220 });
    return () => controls.stop();
  }, [index, pos]);

  const commit = (raw: number) => {
    const snapped = Math.round(Math.min(modes.length - 1, Math.max(0, raw)));
    if (modes[snapped] !== mode) onChange(modes[snapped]);
    else animate(pos, snapped, { type: "spring", damping: 20, stiffness: 220 });
  };

  return (
    <div className="relative rounded-[28px] bg-device-body device-shadow px-3 pt-3 pb-3">
      {/* Antenna + active symbol */}
      <div className="flex items-center gap-3 px-1 pb-3">
        <motion.div style={{ rotate: rodTilt }} className="relative flex items-end origin-bottom">
          <motion.div style={{ rotateY: rotate }} className="relative h-8 w-[10px] [transform-style:preserve-3d]">
            <div className="absolute inset-x-[3px] inset-y-0 rounded-full bg-device-body-light" />
            {/* segment rings that read as rotation */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-[3px] rounded-full bg-card-foreground/25"
                style={{ top: 4 + i * 7 }}
              />
            ))}
            <motion.div
              style={{ opacity: shade }}
              className="absolute inset-x-[3px] inset-y-0 rounded-full bg-primary/40"
            />
          </motion.div>
          <div className="w-6 h-1.5 -ml-[4px] rounded-full bg-device-body-light" />
        </motion.div>

        <div className="flex items-center gap-2 rounded-xl bg-walkie-button px-2.5 py-1.5 button-depth">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ type: "spring", damping: 18, stiffness: 320 }}
            >
              <ActiveIcon className="w-4 h-4 text-primary" />
            </motion.div>
          </AnimatePresence>
          <span className="text-[11px] font-semibold tracking-wide text-card-foreground/70">
            {meta[mode].label}
          </span>
        </div>

        <span className="ml-auto pr-1 text-[10px] font-medium uppercase tracking-wider text-card-foreground/35">
          {meta[mode].sub}
        </span>
      </div>

      {/* Rotary track: drag horizontally to spin the antenna between modes */}
      <motion.div
        onPanStart={() => {
          startPos.current = pos.get();
        }}
        onPan={(_, info) => {
          const next = startPos.current - info.offset.x / STEP;
          pos.set(Math.min(modes.length - 1 + 0.25, Math.max(-0.25, next)));
        }}
        onPanEnd={(_, info) => {
          commit(pos.get() - info.velocity.x / 1400);
        }}
        className="relative h-14 rounded-2xl bg-walkie-button button-depth overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing"
      >
        {/* moving label reel */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ x: useTransform(pos, (p) => -p * 120 + 60) }}
        >
          {modes.map((m) => {
            const Icon = meta[m].icon;
            const active = m === mode;
            return (
              <div key={m} className="w-[120px] shrink-0 flex flex-col items-center justify-center">
                <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-card-foreground/40"}`} />
                <span
                  className={`mt-0.5 text-[10px] font-bold tracking-wide ${
                    active ? "text-card-foreground" : "text-card-foreground/40"
                  }`}
                >
                  {meta[m].label}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* center detent + edge fades */}
        <div className="pointer-events-none absolute left-1/2 top-1 bottom-1 w-[112px] -translate-x-1/2 rounded-xl border border-primary/40" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-device-body/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-device-body/80 to-transparent" />
      </motion.div>
      <p className="pt-2 text-center text-[9px] font-bold uppercase tracking-widest text-card-foreground/25">
        Swipe to rotate antenna
      </p>
    </div>
  );
};

export default ModeStrip;
