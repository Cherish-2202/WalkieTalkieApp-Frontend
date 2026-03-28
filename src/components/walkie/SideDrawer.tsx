import { motion, AnimatePresence } from "framer-motion";
import {
  User, Settings, Bookmark, Smartphone, Volume2,
  Wifi, HelpCircle, Info, LogOut, X
} from "lucide-react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: User, label: "Profile", group: "account" },
  { icon: Settings, label: "Settings", group: "account" },
  { icon: Bookmark, label: "Saved Channels", group: "communication" },
  { icon: Smartphone, label: "Paired Devices", group: "communication" },
  { icon: Volume2, label: "Audio Preferences", group: "preferences" },
  { icon: Wifi, label: "Connectivity", group: "preferences" },
  { icon: HelpCircle, label: "Help & Support", group: "support" },
  { icon: Info, label: "About", group: "support" },
  { icon: LogOut, label: "Logout", group: "support" },
];

const groups = [
  { key: "account", label: "Account" },
  { key: "communication", label: "Communication" },
  { key: "preferences", label: "Preferences" },
  { key: "support", label: "Support" },
];

const SideDrawer = ({ isOpen, onClose }: SideDrawerProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-drawer-overlay/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-drawer-bg rounded-r-3xl overflow-hidden flex flex-col"
          >
            {/* Profile Header */}
            <div className="p-6 pb-4">
              <button onClick={onClose} className="mb-6">
                <X className="w-5 h-5 text-card-foreground/60" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-display-warm flex items-center justify-center">
                  <span className="font-display font-bold text-xl text-primary-foreground">R</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-card-foreground text-lg">Rahul</h3>
                  <p className="text-sm text-card-foreground/50 font-body">Online • Ready</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              {groups.map((group, gi) => (
                <div key={group.key} className={gi > 0 ? "mt-5" : ""}>
                  <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-card-foreground/30">
                    {group.label}
                  </p>
                  {menuItems
                    .filter((item) => item.group === group.key)
                    .map((item) => (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-card-foreground/70 hover:bg-card-foreground/5 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-card-foreground/8 flex items-center justify-center">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                      </motion.button>
                    ))}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideDrawer;
