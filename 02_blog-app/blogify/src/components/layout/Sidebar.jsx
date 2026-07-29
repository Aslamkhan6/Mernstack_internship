import React from "react";
import {
  FiHome,
  FiTrendingUp,
  FiUsers,
  FiBookmark,
  FiSettings,
  FiEdit3,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiX,
} from "react-icons/fi";
import Avatar from "../common/Avatar";

export function Sidebar({
  currentUser,
  currentView,
  setCurrentView,
  onCompose,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  token,
  drawerOpen,
  onToggleDrawer,
}) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform flex-col justify-between rounded-r-[2rem] glass-panel p-4 shadow-2xl transition-transform duration-300 ease-in-out flex ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-lg font-black text-white shadow-md">
                B
              </div>
              <div>
                <p className="text-lg font-black tracking-tight text-white">Blogify</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                  Social spaces
                </p>
              </div>
            </div>
            <button
              onClick={onToggleDrawer}
              className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 border border-white/10 text-violet-300 hover:bg-white/10 transition"
              title="Close menu"
            >
              <FiX />
            </button>
          </div>

          <nav className="mt-6 grid gap-1">
            <SidebarNavButton
              icon={<FiHome />}
              label="Home"
              active={currentView === "home"}
              onClick={() => { setCurrentView("home"); onToggleDrawer(); }}
            />
            <SidebarNavButton
              icon={<FiTrendingUp />}
              label="Trending"
              active={currentView === "trending"}
              onClick={() => { setCurrentView("trending"); onToggleDrawer(); }}
            />
            <SidebarNavButton
              icon={<FiUsers />}
              label="Writers"
              active={currentView === "writers"}
              onClick={() => { setCurrentView("writers"); onToggleDrawer(); }}
            />
            <SidebarNavButton
              icon={<FiBookmark />}
              label="Saved"
              active={currentView === "saved"}
              onClick={() => { setCurrentView("saved"); onToggleDrawer(); }}
            />
            {token && (
              <SidebarNavButton
                icon={<FiUser />}
                label="My Posts"
                active={currentView === "my-posts"}
                onClick={() => { setCurrentView("my-posts"); onToggleDrawer(); }}
              />
            )}
            <SidebarNavButton
              icon={<FiSettings />}
              label="Profile settings"
              onClick={() => { onOpenProfile(); onToggleDrawer(); }}
            />
          </nav>

          <button
            onClick={() => { onCompose(); onToggleDrawer(); }}
            className="mt-6 glow-btn inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-lg transition"
          >
            <FiEdit3 /> Create post
          </button>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/5 p-3">
          <div className="flex items-center gap-3">
            <Avatar user={currentUser} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-white">{currentUser?.username || "Guest"}</p>
              <p className="truncate text-[10px] text-violet-200/50">{currentUser?.email || "No email"}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => { onOpenProfile(); onToggleDrawer(); }}
              className="inline-flex items-center justify-center gap-1 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-2 py-2 text-[11px] font-bold text-violet-200 transition"
            >
              <FiUser /> Profile
            </button>
            {token ? (
              <button
                onClick={() => { onLogout(); onToggleDrawer(); }}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-2 py-2 text-[11px] font-bold text-rose-300 transition"
              >
                <FiLogOut /> Logout
              </button>
            ) : (
              <button
                onClick={() => { onOpenAuth(); onToggleDrawer(); }}
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-violet-500/15 border border-violet-500/20 hover:bg-violet-500/35 px-2 py-2 text-[11px] font-bold text-violet-300 transition"
              >
                <FiLogIn /> Login
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarNavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-bold transition ${
        active
          ? "bg-violet-500/15 text-violet-300 border-l-4 border-violet-500"
          : "text-violet-200/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </button>
  );
}

export default Sidebar;
