import React from "react";
import { FiTrendingUp, FiUsers } from "react-icons/fi";
import Avatar from "../common/Avatar";

function formatCount(value = 0) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return value.toString();
}

export function RightPanel({ people, trendingPosts, currentUser, onFollow, onAvatarClick, token }) {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-80 shrink-0 overflow-y-auto rounded-[2rem] glass-panel p-4 shadow-2xl xl:block">
      <PanelTitle icon={<FiTrendingUp />} title="Trending Now" />
      <div className="mt-4 grid gap-3">
        {trendingPosts.map((post, index) => (
          <div
            key={post._id}
            className="rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10"
          >
            <p className="text-xs font-black text-fuchsia-400">0{index + 1}</p>
            <p className="mt-2 line-clamp-2 text-xs font-black leading-snug text-white">
              {post.title}
            </p>
            <p className="mt-2 text-[10px] font-bold text-violet-300/40">
              {formatCount(post.views)} views
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PanelTitle icon={<FiUsers />} title="Writers to Follow" />
        <div className="mt-4 grid gap-3">
          {people.map((person) => {
            const isFollowing = currentUser?.following?.some((id) => (id._id || id) === person._id);
            const isSelf = person._id === currentUser?._id;
            if (isSelf) return null;
            return (
              <div
                key={person._id}
                className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 p-3"
              >
                <button onClick={() => onAvatarClick(person._id)}>
                  <Avatar user={person} />
                </button>
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => onAvatarClick(person._id)}
                    className="block text-left truncate text-xs font-black text-white hover:text-purple-300"
                  >
                    {person.username}
                  </button>
                  <p className="truncate text-[10px] text-violet-300/50 mt-0.5">
                    {person.specialty || person.email}
                  </p>
                </div>
                <button
                  onClick={() => onFollow(person._id)}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-black transition shrink-0 ${
                    isFollowing
                      ? "bg-white/10 text-violet-200 border border-white/10"
                      : "bg-white text-slate-900"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

function PanelTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-violet-300">
      <span className="text-violet-500">{icon}</span>
      {title}
    </div>
  );
}

export default RightPanel;
