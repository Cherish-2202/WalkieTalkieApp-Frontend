import { motion, AnimatePresence } from "framer-motion";
import { Bluetooth, Globe, Wifi } from "lucide-react";
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

const ModeStrip = ({ mode, onChange }: ModeStripProps) => {
  const ActiveIcon = meta[mode].icon;

  return (
    <div className="relative rounded-[28px] bg-device-body device-shadow px-3 pt-3 pb-3">
      {/* Antenna + active symbol */}
      <div className="flex items-center gap-3 px-1 pb-3">
        <div className="relative flex items-end">
          <motion.div
            animate={{ rotate: [0, -3, 0, 3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="origin-bottom"
          >
            <div className="w-[3px] h-7 rounded-full bg-device-body-light" />
          </motion.div>
          <div className="w-6 h-1.5 -ml-[3px] rounded-full bg-device-body-light" />
        </div>

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

      {/* Horizontally scrollable mode selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {modes.map((m) => {
          const Icon = meta[m].icon;
          const active = m === mode;
          return (
            <motion.button
              key={m}
              onClick={() => onChange(m)}
              whileTap={{ scale: 0.94 }}
              className={`relative flex-1 min-w-[104px] flex items-center gap-2 rounded-2xl px-3 py-2.5 transition-colors ${
                active ? "bg-transparent" : "bg-walkie-button button-depth"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="mode-pill"
                  transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary to-display-warm"
                />
              )}
              <Icon
                className={`relative w-4 h-4 ${active ? "text-primary-foreground" : "text-card-foreground/60"}`}
              />
              <span
                className={`relative text-[11px] font-bold tracking-wide ${
                  active ? "text-primary-foreground" : "text-card-foreground/55"
                }`}
              >
                {meta[m].label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ModeStrip;
