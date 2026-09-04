import { motion } from "framer-motion";
import { Menu, Signal, BatteryMedium } from "lucide-react";

interface TopBarProps {
  onMenuOpen: () => void;
  isPowered: boolean;
}

const TopBar = ({ onMenuOpen, isPowered }: TopBarProps) => {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuOpen}
        className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center button-depth cursor-pointer"
      >
        <Menu className="w-4.5 h-4.5 text-card-foreground/70" />
      </motion.button>

      <h1 className="font-display font-bold text-lg text-foreground tracking-tight">
        WalkieX
      </h1>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-card rounded-xl px-2.5 py-1.5">
          <Signal className={`w-3.5 h-3.5 ${isPowered ? "text-status-ready" : "text-card-foreground/30"}`} />
          <BatteryMedium className="w-3.5 h-3.5 text-card-foreground/40" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
