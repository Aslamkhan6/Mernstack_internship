import React, { useState, useEffect } from "react";
import { FiX, FiUsers } from "react-icons/fi";
import axios from "axios";
import Avatar from "../common/Avatar";
import PostCard from "../posts/PostCard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    _id: user._id || user.id || user.email || "writer-user",
    username: user.username || user.name || user.email?.split("@")[0] || "Writer",
    profileImage: user.profileImage || user.avatar || "",
    following: user.following || [],
    followers: user.followers || [],
  };
}

function normalizePost(post) {
  const normalizedUser = normalizeUser(post.user || post.author);
  return {
    ...post,
    _id: post._id || post.id || crypto.randomUUID(),
    title: post.title || "Untitled post",
    content: post.content || post.Content || "",
    category: post.category || "Personal",
    user: normalizedUser,
    likes: post.likes || post.like || [],
    saved: post.saved || [],
    comments: post.comments || post.comment || [],
    views: post.views || 0,
    coverImage: post.coverImage || "",
    createdAt: post.createdAt || new Date().toISOString(),
  };
}

export function WriterProfileModal({
  writerId,
  currentUser,
  onFollow,
  onClose,
  onLikePost,
  onSavePost,
  onCommentPost,
  onDeleteComment,
  onEditPost,
  onDeletePost,
  token,
  showNotice,
  onPostClick,
}) {
  const [writer, setWriter] = useState(null);
  const [writerPosts, setWriterPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isFollowing = currentUser?.following?.some((id) => (id._id || id) === writerId);
  const isSelf = writerId === currentUser?._id;

  const handlePostClick = async (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    }
    try {
      const res = await api.get(`/singlepost/${postId}`);
      const updated = normalizePost(res.data);
      setWriterPosts((items) =>
        items.map((item) => (item._id === postId ? updated : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  useEffect(() => {
    if (!writerId) return;
    async function fetchWriterProfile() {
      setLoading(true);
      try {
        const [profileRes, postsRes] = await Promise.allSettled([
          api.get(`/user/${writerId}`),
          api.get(`/getuserpost/${writerId}`),
        ]);

        const profileData = profileRes.value?.data?.user || profileRes.value?.data;
        if (profileData) {
          setWriter(normalizeUser(profileData));
        }

        const postsData = postsRes.value?.data?.posts || postsRes.value?.data || [];
        setWriterPosts(postsData.map(normalizePost));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchWriterProfile();
  }, [writerId, currentUser?.following]);

  const followersCount = writer?.followers?.length || 0;

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/65 px-4 py-6 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] glass-panel p-6 shadow-2xl relative border border-white/10 z-50">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black text-white">Writer Profile</h2>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-violet-300 hover:bg-white/10"
            title="Close"
          >
            <FiX />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-violet-200/60 animate-pulse">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4" />
            <p className="text-xs font-semibold">Retrieving writer records...</p>
          </div>
        ) : (
          <div>
            {writer && (
              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl bg-white/5 border border-white/5 p-6 backdrop-blur-md mb-6">
                <Avatar user={writer} size="lg" />
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-xl font-black text-white">{writer.username}</p>
                  <p className="text-xs text-violet-300/50 mt-1">{writer.email}</p>
                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-violet-200">
                    <span>{writerPosts.length} posts published</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500/40" />
                    <span className="flex items-center gap-1">
                      <FiUsers className="text-violet-400" />
                      {followersCount} followers
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500/40" />
                    <span>{writer.following?.length || 0} following</span>
                  </div>
                </div>
                {!isSelf && (
                  <button
                    onClick={() => onFollow(writer._id)}
                    className={`rounded-full px-5 py-2.5 text-xs font-black transition ${
                      isFollowing
                        ? "bg-white/10 text-violet-200 border border-white/10"
                        : "bg-white text-slate-900"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            )}

            <h3 className="text-sm font-black uppercase tracking-wider text-violet-300 mb-4">
              Published Stories
            </h3>

            <div className="grid gap-4">
              {writerPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={currentUser}
                  onLike={onLikePost}
                  onSave={onSavePost}
                  onComment={onCommentPost}
                  onDeleteComment={onDeleteComment}
                  onEdit={isSelf ? onEditPost : null}
                  onDelete={isSelf ? onDeletePost : null}
                  onAvatarClick={() => {}}
                  token={token}
                  showNotice={showNotice}
                  onPostClick={handlePostClick}
                />
              ))}

              {!writerPosts.length && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                  <p className="text-xs font-bold text-violet-200/50">This writer has not published any posts yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriterProfileModal;
