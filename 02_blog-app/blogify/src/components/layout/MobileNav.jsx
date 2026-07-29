import React from "react";
import { FiHome, FiTrendingUp, FiUsers, FiUser } from "react-icons/fi";
import Avatar from "../common/Avatar";

export function MobileNav({
  onCompose,
  onOpenProfile,
  currentView,
  setCurrentView,
  token,
  currentUser,
}) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-[1.6rem] glass-panel p-2 shadow-2xl shadow-purple-500/5 lg:hidden">
      <MobileNavButton
        icon={<FiHome />}
        label="Home"
        active={currentView === "home"}
        onClick={() => setCurrentView("home")}
      />
      <MobileNavButton
        icon={<FiTrendingUp />}
        label="Trending"
        active={currentView === "trending"}
        onClick={() => setCurrentView("trending")}
      />
      <MobileNavButton
        icon={<FiUsers />}
        label="Writers"
        active={currentView === "writers"}
        onClick={() => setCurrentView("writers")}
      />
      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-bold text-violet-200/60"
      >
        {token ? (
          <Avatar user={currentUser} size="sm" />
        ) : (
          <>
            <FiUser className="text-lg" />
            <span>Profile</span>
          </>
        )}
      </button>
    </nav>
  );
}

function MobileNavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl text-[9px] font-bold ${
        active ? "text-violet-300" : "text-violet-200/60"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}

export default MobileNav;
