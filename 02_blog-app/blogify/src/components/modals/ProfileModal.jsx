import React, { useState } from "react";
import { FiCamera, FiUsers, FiEdit3, FiTrash2 } from "react-icons/fi";
import ModalShell from "./ModalShell";
import PostCard from "../posts/PostCard";

export function ProfileModal({ currentUser, onSaveProfile, myPosts, onClose, onEditPost, onDeletePost, onLikePost, onSavePost, onCommentPost, onDeleteComment, token }) {
  const [form, setForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUser?.profileImage || "");

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  function submit(event) {
    event.preventDefault();
    onSaveProfile(form.username, form.email, file);
    onClose();
  }

  const followersCount = currentUser?.followers?.length || 0;
  const followingCount = currentUser?.following?.length || 0;

  return (
    <ModalShell onClose={onClose} title="Profile Details">
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/5 border border-white/5 p-6 backdrop-blur-md">
        <div className="relative group">
          <img
            src={preview || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
            alt={form.username}
            className="h-20 w-20 rounded-3xl object-cover border border-white/20"
          />
          <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover:opacity-100 transition cursor-pointer">
            <FiCamera className="text-white text-lg" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <div className="text-center">
          <p className="text-lg font-black text-white">{currentUser?.username}</p>
          <p className="text-xs font-semibold text-violet-400">{myPosts.length} posts published</p>
        </div>
        <div className="mt-2 flex items-center justify-center gap-6 text-xs font-bold text-violet-200">
          <span className="flex items-center gap-1">
            <FiUsers className="text-violet-400" />
            {followersCount} followers
          </span>
          <span className="h-1 w-1 rounded-full bg-violet-500/40" />
          <span>{followingCount} following</span>
        </div>
      </div>

      <form onSubmit={submit} className="mt-5 grid gap-4">
        <label className="grid gap-1">
          <span className="text-[10px] font-black uppercase text-violet-300">Username</span>
          <input
            value={form.username}
            onChange={(event) =>
              setForm((current) => ({ ...current, username: event.target.value }))
            }
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[10px] font-black uppercase text-violet-300">Email Address</span>
          <input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white"
          />
        </label>
        <button className="glow-btn rounded-2xl py-3 text-xs font-black text-white mt-2">
          Save Profile Updates
        </button>
      </form>

      {/* User's posts section - no edit buttons */}
      {myPosts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-violet-300 mb-4">
            Your Posts
          </h3>
          <div className="grid gap-4">
            {myPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUser={currentUser}
                onLike={onLikePost}
                onSave={onSavePost}
                onComment={onCommentPost}
                onDeleteComment={onDeleteComment}
                onEdit={null}
                onDelete={onDeletePost}
                onAvatarClick={() => {}}
                token={token}
              />
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
}

export default ProfileModal;
