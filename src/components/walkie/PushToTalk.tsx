import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

interface PushToTalkProps {
  isTalking: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  disabled: boolean;
}

const PushToTalk = ({ isTalking, onPressStart, onPressEnd, disabled }: PushToTalkProps) => {
  return (
    <div className="flex flex-col items-center py-4 px-5">
      <div className="relative flex items-center justify-center">
        {/* Outer rings */}
        <AnimatePresence>
          {isTalking && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                  className="absolute w-24 h-24 rounded-full border-2 border-ptt-ring"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Breathing ring when idle */}
        {!isTalking && !disabled && (
          <motion.div
            className="absolute w-28 h-28 rounded-full border border-card-foreground/10"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Dotted ring */}
        <div
          className="absolute w-[110px] h-[110px] rounded-full"
          style={{
            border: "2px dashed",
            borderColor: isTalking
              ? "hsl(var(--ptt-ring) / 0.5)"
              : "hsl(var(--card-foreground) / 0.1)",
            transition: "border-color 0.3s ease",
          }}
        />

        {/* Main button */}
        <motion.button
          onPointerDown={disabled ? undefined : onPressStart}
          onPointerUp={disabled ? undefined : onPressEnd}
          onPointerLeave={disabled ? undefined : onPressEnd}
          animate={isTalking ? { scale: 0.92 } : { scale: 1 }}
          whileTap={disabled ? {} : { scale: 0.88 }}
          transition={{ type: "spring", damping: 15, stiffness: 400 }}
          className={`
            relative z-10 w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-200
            ${isTalking ? "ptt-glow bg-gradient-to-br from-primary to-display-warm" : "ptt-idle bg-walkie-button"}
            ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          <Mic
            className={`w-8 h-8 transition-colors duration-200 ${
              isTalking ? "text-primary-foreground" : "text-card-foreground/60"
            }`}
          />
        </motion.button>
      </div>

      <motion.p
        animate={{ opacity: isTalking ? 1 : 0.5 }}
        className="mt-4 text-xs font-semibold tracking-wider uppercase text-card-foreground/50"
      >
        {disabled ? "POWER OFF" : isTalking ? "TRANSMITTING" : "HOLD TO TALK"}
      </motion.p>
    </div>
  );
};

export default PushToTalk;
