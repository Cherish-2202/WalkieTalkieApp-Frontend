import { motion, AnimatePresence } from "framer-motion";
import { Bluetooth, Wifi, Globe, Mic } from "lucide-react";

export type ConnectionStatus = "off" | "searching" | "ready" | "connected";
export type TalkingState = "idle" | "you-talking" | "other-talking" | "listening";
export type ConnectivityMode = "bluetooth" | "wifi-direct" | "internet";

interface DisplayPanelProps {
  status: ConnectionStatus;
  talkingState: TalkingState;
  channelName: string;
  connectivityMode: ConnectivityMode;
  pairedDevice: string;
  otherUser?: string;
  isWheelActive: boolean;
  wheelDeviceIndex: number;
  pairedDevices: { name: string; avatar: string; online: boolean }[];
}

const statusLabels: Record<ConnectionStatus, string> = {
  off: "OFF",
  searching: "SCANNING...",
  ready: "READY",
  connected: "CONNECTED",
};

const statusColors: Record<ConnectionStatus, string> = {
  off: "bg-status-off",
  searching: "bg-status-searching",
  ready: "bg-status-ready",
  connected: "bg-status-ready",
};

const connectivityIcons: Record<ConnectivityMode, typeof Bluetooth> = {
  bluetooth: Bluetooth,
  "wifi-direct": Wifi,
  internet: Globe,
};

const connectivityLabels: Record<ConnectivityMode, string> = {
  bluetooth: "BT",
  "wifi-direct": "Wi-Fi",
  internet: "NET",
};

const talkingLabels = (state: TalkingState, otherUser?: string) => {
  switch (state) {
    case "idle": return "No one talking";
    case "you-talking": return "You're talking";
    case "other-talking": return `${otherUser || "Someone"} is talking`;
    case "listening": return "Listening...";
  }
};

const MicBars = () => (
  <div className="flex items-end gap-[2px] h-4">
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="w-[3px] rounded-full bg-display-text/80"
        animate={{
          scaleY: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          delay: i * 0.08,
          ease: "easeInOut",
        }}
        style={{ height: 16, transformOrigin: "bottom" }}
      />
    ))}
  </div>
);

const DisplayPanel = ({
  status, talkingState, channelName, connectivityMode,
  pairedDevice, otherUser, isWheelActive, wheelDeviceIndex, pairedDevices,
}: DisplayPanelProps) => {
  const ConnIcon = connectivityIcons[connectivityMode];
  const isTalking = talkingState === "you-talking" || talkingState === "other-talking";

  return (
    <div className="relative mx-4 rounded-2xl overflow-hidden display-glow">
      {/* Display background */}
      <div className="bg-gradient-to-br from-display to-display-warm p-4 min-h-[160px] flex flex-col justify-between">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}>
              {status === "searching" && (
                <motion.div
                  className={`w-2 h-2 rounded-full ${statusColors[status]}`}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </div>
            <span className="font-display font-bold text-xs text-display-text/70 tracking-wider">
              {statusLabels[status]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-display-text/10 rounded-lg px-2 py-1">
            <ConnIcon className="w-3 h-3 text-display-text/70" />
            <span className="text-[10px] font-bold text-display-text/70">
              {connectivityLabels[connectivityMode]}
            </span>
          </div>
        </div>

        {/* Center content */}
        <AnimatePresence mode="wait">
          {isWheelActive ? (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center py-2"
            >
              <p className="text-[10px] font-semibold text-display-text/50 mb-2 tracking-wider uppercase">
                Select Device
              </p>
              <div className="relative w-full overflow-hidden h-[60px] flex items-center justify-center">
                {pairedDevices.map((device, i) => {
                  const offset = i - wheelDeviceIndex;
                  if (Math.abs(offset) > 1) return null;
                  return (
                    <motion.div
                      key={device.name}
                      initial={false}
                      animate={{
                        y: offset * 28,
                        opacity: offset === 0 ? 1 : 0.35,
                        scale: offset === 0 ? 1 : 0.85,
                      }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="absolute flex items-center gap-2"
                    >
                      <div className="w-7 h-7 rounded-lg bg-display-text/15 flex items-center justify-center text-xs font-bold text-display-text">
                        {device.avatar}
                      </div>
                      <span className="font-display font-bold text-display-text text-sm">
                        {device.name}
                      </span>
                      <div className={`w-1.5 h-1.5 rounded-full ${device.online ? 'bg-status-ready' : 'bg-status-off'}`} />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex-1 flex flex-col items-center justify-center py-2"
            >
              <h2 className="font-display font-bold text-2xl text-display-text leading-tight">
                {channelName}
              </h2>
              {status !== "off" && (
                <p className="text-xs text-display-text/60 mt-0.5 font-medium">
                  {pairedDevice}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTalking && <MicBars />}
            <span className="text-xs font-semibold text-display-text/60">
              {talkingLabels(talkingState, otherUser)}
            </span>
          </div>
          {isTalking && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Mic className="w-3.5 h-3.5 text-display-text/80" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPanel;
