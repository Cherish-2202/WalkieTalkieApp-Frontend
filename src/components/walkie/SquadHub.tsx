import { motion, AnimatePresence } from "framer-motion";
import { Radio, Users, Lock, Plus, LogIn, WifiOff } from "lucide-react";
import SideScroller from "./SideScroller";
import type { ConnectivityMode } from "./DisplayPanel";

export interface Squad {
  id: string;
  name: string;
  members: { name: string; avatar: string; online: boolean }[];
  lastActive: string;
  secure: boolean;
}

interface SquadHubProps {
  mode: ConnectivityMode;
  squads: Squad[];
  activeIndex: number;
  onStep: (direction: "up" | "down") => void;
  onJoin: () => void;
  onCreate: () => void;
  onJoinByCode: () => void;
}

const ITEM_H = 62;

const SquadHub = ({
  mode, squads, activeIndex, onStep, onJoin, onCreate, onJoinByCode,
}: SquadHubProps) => {
  const isOnline = mode === "internet";
  const active = squads[activeIndex];

  return (
    <div className="relative mt-2">
      <div className="relative rounded-[32px] bg-device-body device-shadow overflow-hidden min-h-[430px] flex flex-col">
        {/* Highlighter bar */}
        <div className="px-4 pt-4">
          <div className="relative rounded-2xl bg-gradient-to-br from-display to-display-warm display-glow px-4 py-3 min-h-[72px] flex items-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              {isOnline && active ? (
                <motion.div
                  key={active.id}
                  initial={{ y: 26, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -26, opacity: 0 }}
                  transition={{ type: "spring", damping: 22, stiffness: 320 }}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-display-text/15 flex items-center justify-center">
                    <Radio className="w-5 h-5 text-display-text" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display font-bold text-lg text-display-text leading-tight truncate">
                      {active.name}
                    </h2>
                    <p className="text-[11px] font-semibold text-display-text/60">
                      {active.members.filter((m) => m.online).length} online · {active.lastActive}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-display-text/70">
                    {active.secure && <Lock className="w-3 h-3" />}
                    <span className="text-[10px] font-bold tracking-wider">READY</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="offline-bar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-display-text/15 flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-display-text" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-base text-display-text leading-tight">
                      No saved squads offline
                    </h2>
                    <p className="text-[11px] font-semibold text-display-text/60">
                      Start one on the spot
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Squad list */}
        <div className="relative flex-1 px-4 pt-4 pb-4 overflow-hidden">
          {isOnline ? (
            <div className="relative h-full overflow-hidden">
              <motion.div
                animate={{ y: -activeIndex * ITEM_H }}
                transition={{ type: "spring", damping: 26, stiffness: 280 }}
                className="flex flex-col"
              >
                {squads.map((squad, i) => {
                  const offset = i - activeIndex;
                  return (
                    <motion.div
                      key={squad.id}
                      animate={{
                        opacity: offset === 0 ? 0.25 : 1 - Math.min(Math.abs(offset), 4) * 0.18,
                        scale: offset === 0 ? 0.97 : 1,
                        x: offset === 0 ? 6 : 0,
                      }}
                      transition={{ type: "spring", damping: 26, stiffness: 280 }}
                      style={{ height: ITEM_H }}
                      className="flex items-center gap-3 pr-10"
                    >
                      <div className="w-9 h-9 rounded-xl bg-walkie-button flex items-center justify-center button-depth">
                        <Users className="w-4 h-4 text-card-foreground/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-card-foreground truncate">
                          {squad.name}
                        </p>
                        <p className="text-[11px] text-card-foreground/40 font-medium">
                          {squad.members.length} members · {squad.lastActive}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-device-body to-transparent" />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-card-foreground/30">
                {mode === "bluetooth" ? "Bluetooth" : "Wi-Fi Direct"} · create on the spot
              </p>
              <div className="w-full flex flex-col gap-3 px-2">
                <ActionPill icon={Plus} label="Create Squad" sub="New local channel" onClick={onCreate} primary />
                <ActionPill icon={LogIn} label="Join Squad" sub="Scan nearby devices" onClick={onJoinByCode} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-card-foreground/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-ready" />
            <span className="text-[11px] font-semibold tracking-wide text-card-foreground/50">
              {isOnline ? "Pull the wheel to join" : "Offline mode active"}
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-card-foreground/30">
            {isOnline ? `${activeIndex + 1}/${squads.length}` : "—"}
          </span>
        </div>
      </div>

      <SideScroller
        onStep={onStep}
        onPull={onJoin}
        disabled={!isOnline}
        label={isOnline ? "PULL TO JOIN" : "OFFLINE"}
      />
    </div>
  );
};

const ActionPill = ({
  icon: Icon, label, sub, onClick, primary,
}: {
  icon: typeof Plus; label: string; sub: string; onClick: () => void; primary?: boolean;
}) => (
  <motion.button
    whileTap={{ scale: 0.96 }}
    onClick={onClick}
    className={`flex items-center gap-3 rounded-2xl px-4 py-3 button-depth cursor-pointer ${
      primary ? "bg-gradient-to-b from-primary to-display-warm" : "bg-walkie-button"
    }`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${primary ? "bg-primary-foreground/15" : "bg-card-foreground/8"}`}>
      <Icon className={`w-4 h-4 ${primary ? "text-primary-foreground" : "text-card-foreground/70"}`} />
    </div>
    <div className="text-left">
      <p className={`font-display font-bold text-sm ${primary ? "text-primary-foreground" : "text-card-foreground"}`}>
        {label}
      </p>
      <p className={`text-[11px] font-medium ${primary ? "text-primary-foreground/70" : "text-card-foreground/40"}`}>
        {sub}
      </p>
    </div>
  </motion.button>
);

export default SquadHub;
