import { motion } from "framer-motion";
import { Power, Radio, Wifi, Smartphone, Volume2, Zap } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  isPowered: boolean;
  onPowerToggle: () => void;
  onCreateChannel: () => void;
  onConnectivityMode: () => void;
  onPairedDevices: () => void;
  onSpeaker: () => void;
  onQuickActions: () => void;
}

const ActionButtons = ({
  isPowered, onPowerToggle, onCreateChannel, onConnectivityMode,
  onPairedDevices, onSpeaker, onQuickActions,
}: ActionButtonsProps) => {
  const buttons = [
    { icon: Power, label: "Power", action: onPowerToggle, active: isPowered, accent: true },
    { icon: Radio, label: "Channel", action: onCreateChannel, active: false, accent: false },
    { icon: Wifi, label: "Connect", action: onConnectivityMode, active: false, accent: false },
    { icon: Smartphone, label: "Devices", action: onPairedDevices, active: false, accent: false },
    { icon: Volume2, label: "Speaker", action: onSpeaker, active: false, accent: false },
    { icon: Zap, label: "Quick", action: onQuickActions, active: false, accent: false },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 px-5 py-3">
      {buttons.map((btn) => (
        <ActionButton key={btn.label} {...btn} />
      ))}
    </div>
  );
};

interface ActionButtonProps {
  icon: typeof Power;
  label: string;
  action: () => void;
  active: boolean;
  accent: boolean;
}

const ActionButton = ({ icon: Icon, label, action, active, accent }: ActionButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); action(); }}
      onPointerLeave={() => setPressed(false)}
      whileTap={{ scale: 0.93 }}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl
        transition-all duration-150
        ${pressed ? "button-pressed" : "button-depth"}
        ${active && accent
          ? "bg-gradient-to-b from-primary to-display-warm"
          : "bg-walkie-button hover:bg-walkie-button-hover"
        }
      `}
    >
      <Icon className={`w-5 h-5 ${active && accent ? "text-primary-foreground" : "text-card-foreground/80"}`} />
      <span className={`text-[10px] font-semibold tracking-wide ${active && accent ? "text-primary-foreground" : "text-card-foreground/50"}`}>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-primary"
        />
      )}
    </motion.button>
  );
};

export default ActionButtons;
