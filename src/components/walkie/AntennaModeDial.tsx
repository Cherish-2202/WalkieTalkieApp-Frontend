import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Bluetooth, Globe, Wifi } from "lucide-react";
import type { ConnectivityMode } from "./DisplayPanel";

interface AntennaModeDialProps {
  mode?: ConnectivityMode;
  onChange?: (mode: ConnectivityMode) => void;
}

const modes: ConnectivityMode[] = ["bluetooth", "wifi-direct", "internet"];

const modeMeta: Record<
  ConnectivityMode,
  { label: string; icon: typeof Globe; tag: string; detail: string }
> = {
  bluetooth: {
    label: "BLUETOOTH",
    icon: Bluetooth,
    tag: "PEER-TO-PEER",
    detail: "Nearby offline audio",
  },
  "wifi-direct": {
    label: "WI-FI DIRECT",
    icon: Wifi,
    tag: "LOCAL MESH",
    detail: "High-speed direct link",
  },
  internet: {
    label: "INTERNET",
    icon: Globe,
    tag: "CLOUD SQUADS",
    detail: "Worldwide live voice",
  },
};

/** 3D Wheel Geometry (5mm diameter ≈ 18.9px, radius ≈ 9.4px) */
const NUM_TEETH = 8;
const RADIUS_PX = 9.4;
const STEP_RADIANS = (Math.PI * 2) / NUM_TEETH;

/** Tactile 3D Serrated Tooth on the Roller */
const SerratedTooth = ({
  angleProgress,
  toothIndex,
}: {
  angleProgress: any;
  toothIndex: number;
}) => {
  const baseAngle = toothIndex * STEP_RADIANS;

  const x = useTransform(angleProgress, (ang: number) => {
    const theta = baseAngle - ang;
    return Math.sin(theta) * RADIUS_PX;
  });

  const scaleX = useTransform(angleProgress, (ang: number) => {
    const theta = baseAngle - ang;
    return Math.max(0.12, Math.cos(theta));
  });

  const opacity = useTransform(angleProgress, (ang: number) => {
    const cosTheta = Math.cos(baseAngle - ang);
    return cosTheta > 0 ? 0.35 + 0.65 * cosTheta : 0;
  });

  return (
    <motion.div
      style={{ x, scaleX, opacity }}
      className="absolute left-1/2 -ml-[1px] inset-y-0.5 w-[2px] pointer-events-none flex flex-col justify-between py-1"
    >
      <div className="w-full h-full rounded-full bg-gradient-to-r from-zinc-900 via-zinc-400 to-zinc-800 shadow-[0.5px_0_0_rgba(255,255,255,0.2),-0.5px_0_0_rgba(0,0,0,0.9)]" />
    </motion.div>
  );
};

const AntennaModeDial = ({ mode = "internet", onChange }: AntennaModeDialProps) => {
  const currentStep = useRef(Math.max(0, modes.indexOf(mode)));
  const [activeStep, setActiveStep] = useState(currentStep.current);
  const [pulseKey, setPulseKey] = useState(0);

  // Rotation angle in radians
  const angle = useMotionValue(currentStep.current * STEP_RADIANS);

  // Gesture drag tracker for live physical sway of popup and text
  const dragSway = useMotionValue(0);
  const popupX = useTransform(dragSway, [-35, 35], [-6, 6]);
  const popupRotate = useTransform(dragSway, [-35, 35], [-2.5, 2.5]);

  // Description text slides horizontally with lively springy inertia
  const textSlideX = useTransform(dragSway, [-35, 35], [-14, 14]);

  // Specular sheen sweep on the antenna cylinder
  const glintX = useTransform(angle, (a: number) => Math.sin(a * 2) * 1.8);

  // Strict 1-step per swipe latch
  const hasSteppedInGesture = useRef(false);
  const dragAccumulator = useRef(0);

  useEffect(() => {
    const targetIdx = Math.max(0, modes.indexOf(mode));
    if (targetIdx !== currentStep.current) {
      currentStep.current = targetIdx;
      setActiveStep(targetIdx);
      setPulseKey((k) => k + 1);
      animate(angle, targetIdx * STEP_RADIANS, {
        type: "spring",
        damping: 22,
        stiffness: 400,
      });
    }
  }, [mode, angle]);

  /** Execute exactly 1 single stepped rotation */
  const triggerSingleStep = (direction: 1 | -1) => {
    const nextIdx = (currentStep.current + direction + modes.length) % modes.length;
    currentStep.current = nextIdx;
    setActiveStep(nextIdx);
    setPulseKey((k) => k + 1);

    animate(angle, angle.get() + direction * STEP_RADIANS, {
      type: "spring",
      damping: 22,
      stiffness: 400,
    });

    if (onChange) {
      onChange(modes[nextIdx]);
    }
  };

  const currentMeta = modeMeta[modes[activeStep]] || modeMeta.internet;
  const ActiveIcon = currentMeta.icon;

  return (
    <div className="relative w-full flex items-end justify-start pl-6 gap-3.5 select-none pt-1 pb-1">
      {/* 
        1. HORIZONTAL ROTARY ANTENNA WHEEL:
        - 5mm thick x 2cm height
        - High-contrast 3D serrated teeth
        - Strict 1-step per gesture lock
      */}
      <div
        className="relative flex flex-col items-center cursor-ew-resize touch-none select-none flex-shrink-0"
        title="Horizontal antenna roller: scroll or drag to rotate 1 step"
      >
        {/* Top Hardware Cap (5mm) */}
        <div
          className="rounded-t-full z-10 -mb-[0.5px]"
          style={{
            width: "5.2mm",
            height: "2.6mm",
            background:
              "linear-gradient(180deg, hsl(240 8% 28%) 0%, hsl(240 12% 11%) 100%)",
            boxShadow:
              "0 1.5px 2px rgba(0,0,0,0.7), inset 0 0.5px 0.5px rgba(255,255,255,0.25)",
          }}
        />

        {/* Roller Body */}
        <motion.div
          onPanStart={() => {
            hasSteppedInGesture.current = false;
            dragAccumulator.current = 0;
            dragSway.set(0);
          }}
          onPan={(_, info) => {
            dragSway.set(Math.max(-35, Math.min(35, info.offset.x)));

            if (hasSteppedInGesture.current) return;

            dragAccumulator.current += info.delta.x;

            if (dragAccumulator.current > 14) {
              hasSteppedInGesture.current = true;
              triggerSingleStep(1);
            } else if (dragAccumulator.current < -14) {
              hasSteppedInGesture.current = true;
              triggerSingleStep(-1);
            }
          }}
          onPanEnd={() => {
            hasSteppedInGesture.current = false;
            dragAccumulator.current = 0;
            animate(dragSway, 0, { type: "spring", damping: 18, stiffness: 350 });
          }}
          onClick={() => triggerSingleStep(1)}
          whileTap={{ scale: 0.95 }}
          style={{
            width: "5mm",
            height: "2cm",
            background:
              "linear-gradient(90deg, hsl(240 12% 5%) 0%, hsl(240 8% 20%) 28%, hsl(240 12% 12%) 65%, hsl(240 12% 4%) 100%)",
            boxShadow:
              "2px 4px 10px rgba(0,0,0,0.55), inset 1.5px 0 2px rgba(0,0,0,0.95), inset -1.5px 0 2px rgba(0,0,0,0.95)",
          }}
          className="relative overflow-hidden rounded-xs cursor-ew-resize active:cursor-grabbing"
        >
          {/* Knurl grip ridges */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2.5px, rgba(0,0,0,0.9) 2.5px, rgba(255,255,255,0.08) 3.5px)",
            }}
          />

          {/* 3D Teeth */}
          {Array.from({ length: NUM_TEETH }).map((_, i) => (
            <SerratedTooth key={i} angleProgress={angle} toothIndex={i} />
          ))}

          {/* Glint line */}
          <motion.div
            style={{ x: glintX }}
            className="absolute inset-y-0 left-[35%] w-[1.2mm] bg-gradient-to-b from-white/25 via-white/10 to-white/20 blur-[0.4px] pointer-events-none"
          />

          {/* Detent bead */}
          <div className="absolute bottom-1 left-1/2 -ml-[1px] w-[2px] h-[3px] rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
        </motion.div>

        {/* Mounting Collar */}
        <div
          className="rounded-t-sm -mt-[0.5px] z-10"
          style={{
            width: "8mm",
            height: "2.4mm",
            background:
              "linear-gradient(90deg, hsl(240 12% 7%) 0%, hsl(240 8% 25%) 45%, hsl(240 12% 9%) 100%)",
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.6), inset 0 0.5px 0.5px rgba(255,255,255,0.15)",
          }}
        />
      </div>

      {/* 
        2. HORIZONTAL ROW: POPUP BUTTON + SLIDING BLACK DESCRIPTION TEXT
        - Located on the right side of the antenna
        - Fills the empty horizontal space
        - Text is solid BLACK
        - Slides horizontally as the wheel scrolls
      */}
      <div className="flex-1 flex items-center gap-3 pb-1 min-w-0 overflow-visible">
        {/* Glowing Amber Curved Popup Button */}
        <motion.button
          type="button"
          style={{ x: popupX, rotate: popupRotate }}
          onClick={() => triggerSingleStep(1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex items-center gap-2 px-3.5 py-2 rounded-2xl cursor-pointer outline-none flex-shrink-0 transition-shadow duration-200"
          style={{
            background:
              "linear-gradient(135deg, #FDE047 0%, #F59E0B 45%, #D97706 100%)",
            boxShadow:
              "0 0 22px 3px rgba(245, 158, 11, 0.55), 0 4px 12px rgba(0,0,0,0.22), inset 0 1px 1.5px rgba(255,255,255,0.7), inset 0 -1.5px 2px rgba(180,83,9,0.5)",
          }}
          title="Click to switch mode"
        >
          {/* Expansion Wave Ripple on Snap */}
          <AnimatePresence>
            <motion.span
              key={`ripple-${pulseKey}`}
              initial={{ opacity: 0.8, scale: 0.92 }}
              animate={{ opacity: 0, scale: 1.28 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-300"
              style={{
                boxShadow: "0 0 14px 2px rgba(245, 158, 11, 0.7)",
              }}
            />
          </AnimatePresence>

          {/* Animated Icon Swap */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`icon-${activeStep}`}
              initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 25 }}
              transition={{ type: "spring", damping: 16, stiffness: 420 }}
              className="flex items-center justify-center text-black"
            >
              <ActiveIcon className="w-4 h-4 stroke-[2.5]" />
            </motion.div>
          </AnimatePresence>

          {/* Bold Black Mode Name */}
          <AnimatePresence mode="wait">
            <motion.span
              key={`label-${activeStep}`}
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 400 }}
              className="font-display font-extrabold text-xs text-black tracking-wider whitespace-nowrap"
            >
              {currentMeta.label}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        {/* 
          3. BLACK DESCRIPTION TEXT ON THE RIGHT:
          - Sits to the right of the popup in empty space
          - Black text styling
          - Slides dynamically left/right while scrolling the wheel
        */}
        <motion.div
          style={{ x: textSlideX }}
          className="flex flex-col justify-center min-w-0 pr-1 select-none pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`desc-${activeStep}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", damping: 22, stiffness: 380 }}
            >
              <span className="text-[11px] font-black text-black tracking-wider uppercase block truncate leading-tight drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                {currentMeta.tag}
              </span>
              <span className="text-[10px] font-bold text-zinc-900 tracking-tight block truncate leading-tight mt-0.5">
                {currentMeta.detail}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AntennaModeDial;
