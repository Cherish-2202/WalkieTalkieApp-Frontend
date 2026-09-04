import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import DisplayPanel, { type ConnectivityMode, type TalkingState } from "./DisplayPanel";
import ActionButtons from "./ActionButtons";
import PushToTalk from "./PushToTalk";
import DeviceWheel from "./DeviceWheel";
import type { Squad } from "./SquadHub";

interface SquadRoomProps {
  squad: Squad;
  mode: ConnectivityMode;
  onExit: () => void;
  onModeCycle: () => void;
}

const SquadRoom = ({ squad, mode, onExit, onModeCycle }: SquadRoomProps) => {
  const [talkingState, setTalkingState] = useState<TalkingState>("idle");
  const [memberIndex, setMemberIndex] = useState(0);
  const [wheelActive, setWheelActive] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const wheelTimeout = useRef<ReturnType<typeof setTimeout>>();

  const touchWheel = useCallback((ms = 2000) => {
    setWheelActive(true);
    if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => setWheelActive(false), ms);
  }, []);

  const handleWheelScroll = useCallback(
    (direction: "up" | "down") => {
      touchWheel();
      setMemberIndex((prev) =>
        direction === "up"
          ? Math.max(0, prev - 1)
          : Math.min(squad.members.length - 1, prev + 1)
      );
    },
    [squad.members.length, touchWheel]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      transition={{ type: "spring", damping: 24, stiffness: 260 }}
      className="relative mt-3"
    >
      <div className="bg-device-body rounded-[32px] pb-5 device-shadow overflow-hidden">
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1.5 rounded-full bg-device-body-light" />
        </div>

        <DisplayPanel
          status="connected"
          talkingState={talkingState}
          channelName={squad.name}
          connectivityMode={mode}
          pairedDevice={`${squad.members.filter((m) => m.online).length} online`}
          otherUser={squad.members[1]?.name}
          isWheelActive={wheelActive}
          wheelDeviceIndex={memberIndex}
          pairedDevices={squad.members}
        />

        <ActionButtons
          isPowered
          onPowerToggle={onExit}
          onCreateChannel={() => touchWheel(3000)}
          onConnectivityMode={onModeCycle}
          onPairedDevices={() => touchWheel(3000)}
          onSpeaker={() => setSpeakerOn((s) => !s)}
          onQuickActions={() => touchWheel(3000)}
          speakerOn={speakerOn}
          inSquad
        />

        <PushToTalk
          isTalking={talkingState === "you-talking"}
          onPressStart={() => setTalkingState("you-talking")}
          onPressEnd={() => setTalkingState("idle")}
          disabled={false}
        />
      </div>

      <DeviceWheel
        onScroll={handleWheelScroll}
        isActive={wheelActive}
        deviceCount={squad.members.length}
        currentIndex={memberIndex}
      />
    </motion.div>
  );
};

export default SquadRoom;
