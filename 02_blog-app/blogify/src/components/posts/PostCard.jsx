import React, { useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiEye,
  FiBookmark,
  FiTrash2,
  FiEdit3,
  FiSend,
  FiShare2,
} from "react-icons/fi";
import Avatar from "../common/Avatar";

function formatCount(value = 0) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return value.toString();
}

function timeAgo(date) {
  const timestamp = new Date(date).getTime();
  if (!timestamp) return "just now";
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function PostCard({
  post,
  currentUser,
  onLike,
  onSave,
  onComment,
  onDeleteComment,
  onEdit,
  onDelete,
  onAvatarClick,
  token,
  showNotice,
  onPostClick,
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const isMine = post.user?._id === currentUser?._id;
  const liked = post.likes.some((u) => (u._id || u) === currentUser?._id);
  const saved = post.saved?.some((u) => (u._id || u) === currentUser?._id);

  function submitComment(event) {
    event.preventDefault();
    if (!commentText.trim()) return;
    onComment(post._id, commentText.trim());
    setCommentText("");
  }

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(post._id);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?post=${post._id}`;
    const shareData = {
      title: post.title,
      text: post.content.substring(0, 100) + "...",
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        if (showNotice) {
          showNotice("Link copied to clipboard!");
        } else {
          alert("Link copied to clipboard!");
        }
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  };

  return (
    <article className="rounded-[2rem] glass-card glass-card-hover p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => onAvatarClick(post.user?._id)} className="focus:outline-none">
            <Avatar user={post.user} />
          </button>
          <div className="min-w-0">
            <button
              onClick={() => onAvatarClick(post.user?._id)}
              className="truncate block text-left font-black text-white text-sm hover:text-purple-300"
            >
              {post.user?.username}
            </button>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-bold text-violet-300/50">
              <span>{timeAgo(post.createdAt)}</span>
              <span className="h-1 w-1 rounded-full bg-violet-500/30" />
              <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-violet-300">
                {post.category}
              </span>
            </div>
          </div>
        </div>
        {isMine && token && (
          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(post)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 transition hover:bg-violet-500/20"
              title="Edit post"
            >
              <FiEdit3 className="text-sm" />
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 transition hover:bg-rose-500/20"
              title="Delete post"
            >
              <FiTrash2 className="text-sm" />
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 cursor-pointer" onClick={handlePostClick}>
        {post.coverImage && (
          <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/5 shadow-lg max-h-[300px]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full max-h-[300px] object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <h2 className="text-lg font-black leading-snug text-white hover:text-purple-300 transition">
          {post.title}
        </h2>
        <p className="mt-2.5 whitespace-pre-wrap text-xs leading-5 text-violet-100/70">
          {post.content}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-white/5 py-3">
        <ActionButton
          active={liked}
          icon={<FiHeart className={liked ? "fill-current" : ""} />}
          label={formatCount(post.likes.length)}
          onClick={() => onLike(post._id)}
        />
        <ActionButton
          active={showComments}
          icon={<FiMessageCircle />}
          label={formatCount(post.comments.length)}
          onClick={() => setShowComments(!showComments)}
        />
        <ActionButton icon={<FiEye />} label={formatCount(post.views || 0)} />
        <ActionButton
          icon={<FiShare2 />}
          label="Share"
          onClick={handleShare}
        />
        <button
          onClick={() => onSave(post._id)}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
            saved
              ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
              : "bg-white/5 border border-white/5 hover:bg-white/10 text-violet-200/80"
          }`}
        >
          <FiBookmark /> {saved ? "Saved" : "Save"}
        </button>
      </div>

      {showComments && (
        <>
          {post.comments.length > 0 && (
            <div className="mt-4 grid gap-2.5">
              {post.comments.map((item) => {
                const isCommentMine = (item.user?._id || item.user) === currentUser?._id;
                return (
                  <div key={item._id || item.createdAt} className="flex gap-2.5 items-start">
                    <button onClick={() => onAvatarClick(item.user?._id || item.user)}>
                      <Avatar user={item.user} size="sm" />
                    </button>
                    <div className="min-w-0 flex-1 rounded-2xl bg-white/5 border border-white/5 px-4 py-2.5">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => onAvatarClick(item.user?._id || item.user)}
                          className="text-[11px] font-black text-white hover:text-purple-300 text-left"
                        >
                          {item.user?.username || "Reader"}
                        </button>
                        {isCommentMine && token && (
                          <button
                            onClick={() => onDeleteComment(post._id, item._id)}
                            className="text-rose-400 hover:text-rose-500 transition"
                            title="Delete comment"
                          >
                            <FiTrash2 className="text-[10px]" />
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-violet-100/80">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={submitComment} className="mt-4 flex items-center gap-2.5">
            <Avatar user={currentUser} size="sm" />
            <input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Share your thoughts..."
              className="min-w-0 flex-1 rounded-xl glass-input px-4 py-2.5 text-xs font-semibold"
            />
            <button
              className="grid h-9 w-9 place-items-center rounded-xl bg-violet-600 hover:bg-violet-700 text-white transition shrink-0"
              title="Send comment"
            >
              <FiSend className="text-sm" />
            </button>
          </form>
        </>
      )}
    </article>
  );
}

function ActionButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all ${
        active
          ? "bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300"
          : "bg-white/5 border border-white/5 text-violet-200/80 hover:bg-white/10 hover:text-white"
      }`}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

export default PostCard;
