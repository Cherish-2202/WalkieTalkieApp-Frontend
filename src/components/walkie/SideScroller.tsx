import { motion, useMotionValue, animate, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronsRight } from "lucide-react";

interface SideScrollerProps {
  onStep: (direction: "up" | "down") => void;
  onPull: () => void;
  disabled?: boolean;
  label?: string;
}

/**
 * Vertical thumb-wheel on the right edge.
 * Drag vertically  -> steps the highlighted item.
 * Pull horizontally -> elastic stretch, release past threshold triggers onPull().
 */
const SideScroller = ({ onStep, onPull, disabled, label = "PULL TO JOIN" }: SideScrollerProps) => {
  const x = useMotionValue(0);
  const acc = useRef(0);
  const pulled = useRef(false);
  const stretch = useTransform(x, [0, 70], [1, 1.18]);

  return (
    <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
      <motion.div
        style={{ x, scaleY: stretch }}
        onPan={(_, info) => {
          if (disabled) return;
          acc.current += info.delta.y;
          if (Math.abs(acc.current) > 22) {
            onStep(acc.current > 0 ? "down" : "up");
            acc.current = 0;
          }
          const nx = Math.max(0, Math.min(70, info.offset.x));
          x.set(nx);
          if (nx > 46) pulled.current = true;
        }}
        onPanEnd={() => {
          acc.current = 0;
          if (pulled.current && !disabled) onPull();
          pulled.current = false;
          animate(x, 0, { type: "spring", damping: 12, stiffness: 420 });
        }}
        className={`relative w-8 h-32 rounded-2xl bg-device-body-light flex flex-col items-center justify-center gap-[5px] select-none touch-none ${
          disabled ? "opacity-40" : "cursor-grab active:cursor-grabbing"
        }`}
        >
      >
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "inset -2px 0 6px rgba(0,0,0,0.35), 3px 3px 10px rgba(0,0,0,0.45)" }}
        />
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-3.5 h-[1.5px] rounded-full bg-card-foreground/20" />
        ))}
        <ChevronsRight className="absolute -left-0.5 w-3 h-3 text-primary/50" />
      </motion.div>

      <span className="text-[8px] font-bold tracking-widest text-card-foreground/30 [writing-mode:vertical-rl]">
        {label}
      </span>
    </div>
  );
};

export default SideScroller;
