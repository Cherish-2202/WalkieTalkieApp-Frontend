import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/walkie/TopBar";
import SideDrawer from "@/components/walkie/SideDrawer";
import DisplayPanel, {
  type ConnectionStatus,
  type TalkingState,
  type ConnectivityMode,
} from "@/components/walkie/DisplayPanel";
import ActionButtons from "@/components/walkie/ActionButtons";
import PushToTalk from "@/components/walkie/PushToTalk";
import DeviceWheel from "@/components/walkie/DeviceWheel";

const pairedDevices = [
  { name: "Rahul's Phone", avatar: "R", online: true },
  { name: "Priya's Tab", avatar: "P", online: true },
  { name: "Amit's Radio", avatar: "A", online: false },
  { name: "Dev's Watch", avatar: "D", online: true },
  { name: "Sara's Pod", avatar: "S", online: false },
];

const connectivityModes: ConnectivityMode[] = ["bluetooth", "wifi-direct", "internet"];

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPowered, setIsPowered] = useState(true);
  const [status, setStatus] = useState<ConnectionStatus>("ready");
  const [talkingState, setTalkingState] = useState<TalkingState>("idle");
  const [connectivityMode, setConnectivityMode] = useState<ConnectivityMode>("bluetooth");
  const [wheelActive, setWheelActive] = useState(false);
  const [wheelIndex, setWheelIndex] = useState(0);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handlePowerToggle = useCallback(() => {
    if (isPowered) {
      setIsPowered(false);
      setStatus("off");
      setTalkingState("idle");
    } else {
      setIsPowered(true);
      setStatus("searching");
      setTimeout(() => setStatus("ready"), 2000);
    }
  }, [isPowered]);

  const handleConnectivityCycle = useCallback(() => {
    setConnectivityMode((prev) => {
      const idx = connectivityModes.indexOf(prev);
      return connectivityModes[(idx + 1) % connectivityModes.length];
    });
  }, []);

  const handleWheelScroll = useCallback(
    (direction: "up" | "down") => {
      setWheelActive(true);
      setWheelIndex((prev) => {
        if (direction === "up") return Math.max(0, prev - 1);
        return Math.min(pairedDevices.length - 1, prev + 1);
      });
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => setWheelActive(false), 2000);
    },
    []
  );

  const handleTalkStart = useCallback(() => {
    setTalkingState("you-talking");
  }, []);

  const handleTalkEnd = useCallback(() => {
    setTalkingState("idle");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-6">
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        <TopBar onMenuOpen={() => setDrawerOpen(true)} isPowered={isPowered} />

        {/* Walkie-talkie device body */}
        <div className="relative mt-3">
          <motion.div
            className="bg-device-body rounded-[32px] pb-5 device-shadow overflow-hidden"
            layout
          >
            {/* Antenna nub */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-8 h-1.5 rounded-full bg-device-body-light" />
            </div>

            {/* Display panel */}
            <DisplayPanel
              status={status}
              talkingState={talkingState}
              channelName="Alpha-7"
              connectivityMode={connectivityMode}
              pairedDevice="Rahul's Phone"
              otherUser="Priya"
              isWheelActive={wheelActive}
              wheelDeviceIndex={wheelIndex}
              pairedDevices={pairedDevices}
            />

            {/* Action buttons */}
            <ActionButtons
              isPowered={isPowered}
              onPowerToggle={handlePowerToggle}
              onCreateChannel={() => {}}
              onConnectivityMode={handleConnectivityCycle}
              onPairedDevices={() => {
                setWheelActive(true);
                if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
                wheelTimeout.current = setTimeout(() => setWheelActive(false), 3000);
              }}
              onSpeaker={() => {}}
              onQuickActions={() => {}}
            />

            {/* Push to talk */}
            <PushToTalk
              isTalking={talkingState === "you-talking"}
              onPressStart={handleTalkStart}
              onPressEnd={handleTalkEnd}
              disabled={!isPowered}
            />
          </motion.div>

          {/* Side wheel */}
          <DeviceWheel
            onScroll={handleWheelScroll}
            isActive={wheelActive}
            deviceCount={pairedDevices.length}
            currentIndex={wheelIndex}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
