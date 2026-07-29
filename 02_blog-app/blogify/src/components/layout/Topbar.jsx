import React from "react";
import { FiSearch, FiPlus, FiMenu } from "react-icons/fi";
import Avatar from "../common/Avatar";

export function Topbar({
  search,
  setSearch,
  currentUser,
  token,
  onCompose,
  onOpenAuth,
  onOpenProfile,
  onToggleDrawer,
}) {
  return (
    <header className="sticky top-4 z-20 flex items-center gap-3 rounded-[1.7rem] glass-panel p-2 shadow-2xl">
      <button
        onClick={onToggleDrawer}
        className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 border border-white/10 text-violet-300 hover:bg-white/10 transition"
        title="Open menu"
      >
        <FiMenu />
      </button>

      <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/5 border border-white/5 px-4 py-2">
        <FiSearch className="shrink-0 text-violet-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts, tags, writers..."
          className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-violet-200/40"
        />
      </div>
      <button
        onClick={onCompose}
        className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/10 transition"
        title="Create post"
      >
        <FiPlus />
      </button>
      <button
        onClick={token ? onOpenProfile : onOpenAuth}
        className="hidden h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-violet-200 hover:bg-white/10 md:inline-flex transition"
      >
        <Avatar user={currentUser} size="sm" />
        Account
      </button>
    </header>
  );
}

export default Topbar;
