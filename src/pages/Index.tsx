import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/walkie/TopBar";
import SideDrawer from "@/components/walkie/SideDrawer";
import AntennaModeDial from "@/components/walkie/AntennaModeDial";
import SquadHub, { type Squad } from "@/components/walkie/SquadHub";
import SquadRoom from "@/components/walkie/SquadRoom";
import type { ConnectivityMode } from "@/components/walkie/DisplayPanel";
import { Plus, LogIn } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const squads: Squad[] = [
  {
    id: "inner-circle",
    name: "The Inner Circle",
    lastActive: "live now",
    secure: true,
    members: [
      { name: "Rahul", avatar: "R", online: true },
      { name: "Priya", avatar: "P", online: true },
      { name: "Amit", avatar: "A", online: false },
      { name: "Dev", avatar: "D", online: true },
    ],
  },
  {
    id: "sierra-echo",
    name: "Sierra Echo",
    lastActive: "2h ago",
    secure: true,
    members: [
      { name: "Sara", avatar: "S", online: true },
      { name: "Kabir", avatar: "K", online: false },
      { name: "Neha", avatar: "N", online: true },
    ],
  },
  {
    id: "base-camp",
    name: "Base Camp",
    lastActive: "5h ago",
    secure: false,
    members: [
      { name: "Arjun", avatar: "A", online: false },
      { name: "Meera", avatar: "M", online: true },
    ],
  },
  {
    id: "night-woods",
    name: "Night Woods",
    lastActive: "yesterday",
    secure: true,
    members: [
      { name: "Ishan", avatar: "I", online: true },
      { name: "Tara", avatar: "T", online: true },
      { name: "Vikram", avatar: "V", online: false },
    ],
  },
  {
    id: "alpha-7",
    name: "Alpha-7",
    lastActive: "2d ago",
    secure: false,
    members: [
      { name: "Rahul", avatar: "R", online: true },
      { name: "Zoya", avatar: "Z", online: false },
    ],
  },
];

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<ConnectivityMode>("internet");
  const [activeIndex, setActiveIndex] = useState(0);
  const [joined, setJoined] = useState<Squad | null>(null);

  const handleStep = useCallback((direction: "up" | "down") => {
    setActiveIndex((prev) =>
      direction === "up" ? Math.max(0, prev - 1) : Math.min(squads.length - 1, prev + 1)
    );
  }, []);

  const handleJoin = useCallback(() => {
    setJoined(squads[activeIndex]);
  }, [activeIndex]);

  const handleModeChange = useCallback((next: ConnectivityMode) => {
    setMode(next);
    setJoined(null);
  }, []);


  const createSquad = () =>
    toast({ title: "New squad", description: "Squad creation flow coming next." });
  const joinByCode = () =>
    toast({ title: "Join a squad", description: "Enter a code or scan nearby devices." });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-5">
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        <TopBar onMenuOpen={() => setDrawerOpen(true)} isPowered />

        <div className="mt-2">
          <AntennaModeDial mode={mode} onChange={handleModeChange} />
        </div>

        <AnimatePresence mode="wait">
          {joined ? (
            <SquadRoom
              key="room"
              squad={joined}
              mode={mode}
              onExit={() => setJoined(null)}
            />
          ) : (
            <motion.div
              key="hub"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
            >
              <SquadHub
                mode={mode}
                squads={squads}
                activeIndex={activeIndex}
                onStep={handleStep}
                onJoin={handleJoin}
                onCreate={createSquad}
                onJoinByCode={joinByCode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating actions — only online & outside a squad */}
        <AnimatePresence>
          {!joined && mode === "internet" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="mt-4 flex items-center justify-center gap-3"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={joinByCode}
                className="flex items-center gap-2 rounded-full bg-card px-5 py-3 button-depth"
              >
                <LogIn className="w-4 h-4 text-card-foreground/70" />
                <span className="text-sm font-semibold text-card-foreground/80">Join Squad</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={createSquad}
                className="flex items-center gap-2 rounded-full bg-gradient-to-b from-primary to-display-warm px-5 py-3 button-depth"
              >
                <Plus className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">Create Squad</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Index;
