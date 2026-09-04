import { motion } from "framer-motion";

interface DeviceWheelProps {
  onScroll: (direction: "up" | "down") => void;
  isActive: boolean;
  deviceCount: number;
  currentIndex: number;
}

const DeviceWheel = ({ onScroll, isActive, deviceCount, currentIndex }: DeviceWheelProps) => {
  const notches = 8;

  return (
    <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
      <motion.div
        className="relative w-7 h-28 bg-device-body-light rounded-r-xl flex flex-col items-center justify-center overflow-hidden cursor-ns-resize select-none"
        style={{
          boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3), 2px 2px 8px rgba(0,0,0,0.4)",
        }}
        onPan={(_, info) => {
          if (Math.abs(info.delta.y) > 3) {
            onScroll(info.delta.y > 0 ? "down" : "up");
          }
        }}
        whileHover={{ backgroundColor: "hsl(240 8% 19%)" }}
      >
        {Array.from({ length: notches }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-[1.5px] bg-card-foreground/15 my-[4px] rounded-full"
          />
        ))}

        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-r-2 border-primary/60 rounded-r-xl"
          />
        )}
      </motion.div>

      <div className="mt-2 flex flex-col gap-1">
        {Array.from({ length: Math.min(deviceCount, 5) }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
              i === currentIndex % 5 ? "bg-primary" : "bg-card-foreground/15"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceWheel;
