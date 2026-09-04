import { motion } from "framer-motion";
import { Power, Radio, Smartphone, Volume2, VolumeX, Zap, LogOut, Users } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  isPowered: boolean;
  onPowerToggle: () => void;
  onCreateChannel: () => void;
  onPairedDevices: () => void;
  onSpeaker: () => void;
  onQuickActions: () => void;
  speakerOn?: boolean;
  inSquad?: boolean;
}

const ActionButtons = ({
  isPowered, onPowerToggle, onCreateChannel,
  onPairedDevices, onSpeaker, onQuickActions, speakerOn = true, inSquad = false,
}: ActionButtonsProps) => {
  const buttons = [
    inSquad
      ? { icon: LogOut, label: "Exit", action: onPowerToggle, active: false, accent: false, span: "col-span-2" }
      : { icon: Power, label: "Power", action: onPowerToggle, active: isPowered, accent: true, span: "col-span-2" },
    { icon: Radio, label: "Channel", action: onCreateChannel, active: false, accent: false, span: "col-span-2" },
    inSquad
      ? { icon: Users, label: "Members", action: onPairedDevices, active: false, accent: false, span: "col-span-2" }
      : { icon: Smartphone, label: "Devices", action: onPairedDevices, active: false, accent: false, span: "col-span-2" },
    {
      icon: speakerOn ? Volume2 : VolumeX,
      label: speakerOn ? "Speaker" : "Muted",
      action: onSpeaker,
      active: inSquad && speakerOn,
      accent: true,
      span: "col-span-3",
    },
    { icon: Zap, label: "Quick", action: onQuickActions, active: false, accent: false, span: "col-span-3" },
  ];


  return (
    <div className="grid grid-cols-6 gap-3 px-5 py-3">
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
  span: string;
}

const ActionButton = ({ icon: Icon, label, action, active, accent, span }: ActionButtonProps) => {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.button
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => { setPressed(false); action(); }}
      onPointerLeave={() => setPressed(false)}
      whileTap={{ scale: 0.93 }}
      className={`
        relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl
        transition-all duration-150 ${span}
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
