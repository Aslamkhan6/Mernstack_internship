import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FiPlus,
  FiSearch,
  FiMenu,
} from "react-icons/fi";

// Layout components
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import MobileNav from "./components/layout/MobileNav";
import RightPanel from "./components/layout/RightPanel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Post components
import CategoryTabs from "./components/posts/CategoryTabs";
import PostCard from "./components/posts/PostCard";

// Modal components
import ComposerModal from "./components/modals/ComposerModal";
import AuthModal from "./components/modals/AuthModal";
import ProfileModal from "./components/modals/ProfileModal";
import WriterProfileModal from "./components/modals/WriterProfileModal";

// Common components
import Avatar from "./components/common/Avatar";
import ProcessIndicator from "./components/common/ProcessIndicator";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const categories = [
  "All",
  "Technology",
  "Lifestyle",
  "Travel",
  "Food",
  "Education",
  "Business",
  "Personal",
];

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function readStored(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    _id: user._id || user.id || user.email || "current-user",
    username: user.username || user.name || user.email?.split("@")[0] || "Writer",
    profileImage: user.profileImage || user.avatar || "",
    following: user.following || [],
    followers: user.followers || [],
  };
}

function normalizePost(post) {
  const normalizedUser = normalizeUser(post.user || post.author) || {
    _id: "unknown-user",
    username: "Anonymous Writer",
    email: "",
    profileImage: "",
    following: [],
    followers: [],
  };
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

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("blogify-token") || "");
  const [currentUser, setCurrentUser] = useState(() =>
    readStored("blogify-user", null),
  );
  const [posts, setPosts] = useState([]);
  const [people, setPeople] = useState([]);

  // Navigation: 'home', 'trending', 'writers', 'saved'
  const [currentView, setCurrentView] = useState("home");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login', 'register', 'forgot', 'reset'
  const [resetPasswordToken, setResetPasswordToken] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedWriterId, setSelectedWriterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [writerSearchQuery, setWriterSearchQuery] = useState("");
  const [searchedWriters, setSearchedWriters] = useState([]);



  useEffect(() => {
    if (token) localStorage.setItem("blogify-token", token);
    else localStorage.removeItem("blogify-token");
  }, [token]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("blogify-user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("blogify-user");
    }
  }, [currentUser]);

  useEffect(() => {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : "";
  }, [token]);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setToken("");
          setCurrentUser(null);
          localStorage.removeItem("blogify-token");
          localStorage.removeItem("blogify-user");
          showNotice("Session expired or user deleted. Please sign in again.");
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Debounce search query to prevent constant API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Check for password reset token in the URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token");
    if (resetToken) {
      setResetPasswordToken(resetToken);
      setAuthMode("reset");
      setAuthOpen(true);
      // Clean up URL query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch profile details
  useEffect(() => {
    if (!token) return;
    async function fetchProfile() {
      try {
        const response = await api.get("/profile");
        const userData = response.data?.data || response.data?.user || response.data;
        if (userData) {
          setCurrentUser(normalizeUser(userData));
        }
      } catch (err) {
        console.log("Could not sync profile from server", err);
      }
    }
    fetchProfile();
  }, [token]);

  // Fetch posts from API based on current active view
  useEffect(() => {
    let ignore = false;
    async function loadFeed() {
      setLoading(true);
      try {
        let postsEndpoint = "/latestpost";
        let params = { page: 1, limit: 30 };

        if (currentView === "trending") {
          postsEndpoint = "/gettrending";
        } else if (currentView === "home") {
          params.category = activeCategory;
          params.keyword = debouncedSearch;
        } else if (currentView === "saved") {
          postsEndpoint = "/getsavedpost";
          params.keyword = debouncedSearch;
        } else if (currentView === "my-posts") {
          postsEndpoint = "/getmypost";
          params.page = 1;
          params.limit = 50;
        }

        const [postsRes, trendingRes] = await Promise.allSettled([
          api.get(postsEndpoint, { params }),
          api.get("/gettrending"),
        ]);

        if (ignore) return;

        const latestData = postsRes.value?.data;
        const fetchedPosts =
          latestData?.posts || latestData?.mypost || latestData || [];

        if (Array.isArray(fetchedPosts)) {
          setPosts(fetchedPosts.map(normalizePost));
        } else if (Array.isArray(latestData)) {
          setPosts(latestData.map(normalizePost));
        }

        // Fetch writer recommendations
        const trendingData = trendingRes.value?.data;
        const trendingPostsList = Array.isArray(trendingData) ? trendingData : [];
        const authors = trendingPostsList.map((post) => normalizeUser(post.user));
        const uniqueAuthors = authors.filter(
          (person, index, all) =>
            person && all.findIndex((item) => item?._id === person._id) === index,
        );
        if (uniqueAuthors.length) setPeople(uniqueAuthors);
      } catch (err) {
        console.error("Error loading feed:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadFeed();
    return () => {
      ignore = true;
    };
  }, [activeCategory, debouncedSearch, token, currentView]);

  // Writers Search API Integration
  useEffect(() => {
    if (currentView !== "writers") return;

    if (!writerSearchQuery.trim()) {
      setSearchedWriters(people);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await api.get(`/search?query=${writerSearchQuery}`);
        setSearchedWriters(res.data?.users || []);
      } catch (err) {
        console.error(err);
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [writerSearchQuery, people, currentView]);

  const displayedPosts = useMemo(() => {
    if (currentView === "saved") {
      const query = search.trim().toLowerCase();
      return posts.filter((post) => {
        const isSaved = post.saved?.some((u) => (u._id || u) === currentUser?._id);
        if (!isSaved) return false;
        const matchesSearch =
          !query ||
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.user?.username?.toLowerCase().includes(query);
        return matchesSearch;
      });
    }

    // Apply search and category filters for home/trending/my-posts views
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "All" || post.category === activeCategory;
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.user?.username?.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, posts, search, currentView, currentUser?._id]);

  const myPosts = useMemo(
    () => posts.filter((post) => post.user?._id === currentUser?._id),
    [currentUser?._id, posts],
  );

  const trendingPosts = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (b.views || 0) + b.likes.length - ((a.views || 0) + a.likes.length))
        .slice(0, 4),
    [posts],
  );

  function showNotice(message) {
    toast(message, {
      position: "bottom-right",
      autoClose: 3200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  }

  async function handleAuth(payload) {
    setAuthLoading(true);
    try {
      const isRegister = authMode === "register";
      const isForgot = authMode === "forgot";
      const isReset = authMode === "reset";

      if (isReset) {
        if (payload.password !== payload.confirmPassword) {
          showNotice("Passwords do not match.");
          setAuthLoading(false);
          return;
        }
        const response = await api.post("/resetpassword", {
          token: resetPasswordToken,
          password: payload.password,
        });
        showNotice(response.data?.message || "Password reset successful. Please login.");
        setAuthMode("login");
        setAuthOpen(true);
        return;
      }

      if (isForgot) {
        const response = await api.post("/forgotpassword", { email: payload.email });
        showNotice(response.data?.message || "Password recovery email has been sent.");
        setAuthMode("login");
        return;
      }

      const body = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value) body.append(key, value);
      });

      const response = await api.post(
        isRegister ? "/register" : "/login",
        isRegister ? body : payload,
      );

      const responseData = response.data;
      const user = normalizeUser(responseData?.user || responseData);
      const receivedToken = responseData?.token || responseData?.data?.token;

      if (receivedToken) {
        setToken(receivedToken);
      }
      if (user) {
        setCurrentUser(user);
      }
      setAuthOpen(false);
      showNotice(isRegister ? "Account created successfully." : "Logged in successfully.");
    } catch (error) {
      showNotice(
        error.response?.data?.message ||
          "Error executing authentication request.",
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSavePost(payload) {
    if (!token) {
      showNotice("Please sign in to publish a post.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    const coverImageUrl = payload.coverImage instanceof File
      ? URL.createObjectURL(payload.coverImage)
      : (payload.coverImage || editingPost?.coverImage || "");

    const optimisticPost = normalizePost({
      ...(editingPost || {}),
      ...payload,
      coverImage: coverImageUrl,
      user: currentUser,
      likes: editingPost?.likes || [],
      saved: editingPost?.saved || [],
      comments: editingPost?.comments || [],
      views: editingPost?.views || 0,
      createdAt: editingPost?.createdAt || new Date().toISOString(),
    });

    if (editingPost) {
      setPosts((items) =>
        items.map((item) => (item._id === editingPost._id ? optimisticPost : item)),
      );
    } else {
      setPosts((items) => [optimisticPost, ...items]);
    }

    setComposerOpen(false);
    setEditingPost(null);

    // Build FormData payload for image upload support
    const body = new FormData();
    body.append("title", payload.title);
    body.append("category", payload.category);
    body.append("content", payload.content);
    if (payload.coverImage instanceof File) {
      body.append("coverImage", payload.coverImage);
    }

    try {
      if (editingPost) {
        const response = await api.put(`/updatepost/${editingPost._id}`, body);
        const saved = normalizePost({ ...response.data, user: currentUser });
        setPosts((items) =>
          items.map((item) => (item._id === editingPost._id ? saved : item)),
        );
        showNotice("Post updated.");
      } else {
        const response = await api.post("/postcontroller", body);
        const saved = normalizePost({ ...response.data, user: currentUser });
        setPosts((items) =>
          items.map((item) => (item._id === optimisticPost._id ? saved : item)),
        );
        showNotice("Post published.");
      }
    } catch {
      showNotice("Failed to save post. Please check your connection.");
      // Rollback optimistic updates
      if (editingPost) {
        setPosts((items) =>
          items.map((item) => (item._id === editingPost._id ? editingPost : item)),
        );
      } else {
        setPosts((items) => items.filter((item) => item._id !== optimisticPost._id));
      }
    }
  }

  async function handlePostClick(postId) {
    if (!token) return;
    try {
      const response = await api.get(`/singlepost/${postId}`);
      const updatedPost = normalizePost(response.data);
      setPosts((items) =>
        items.map((item) => (item._id === postId ? updatedPost : item))
      );
    } catch (err) {
      console.error("Error updating post views:", err);
    }
  }

  async function handleDeletePost(postId) {
    if (!token) return;
    const previous = posts;
    setPosts((items) => items.filter((post) => post._id !== postId));
    try {
      await api.delete(`/deletepost/${postId}`);
      showNotice("Post deleted.");
    } catch {
      showNotice("Failed to delete post. Please check your connection.");
      setPosts(previous);
    }
  }

  async function handleLike(postId) {
    if (!token) {
      showNotice("Please sign in to like posts.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    const hasLiked = posts
      .find((post) => post._id === postId)
      ?.likes.some((u) => (u._id || u) === currentUser?._id);

    setPosts((items) =>
      items.map((post) => {
        if (post._id === postId) {
          const updatedLikes = hasLiked
            ? post.likes.filter((u) => (u._id || u) !== currentUser?._id)
            : [...post.likes, currentUser];
          return { ...post, likes: updatedLikes };
        }
        return post;
      }),
    );

    try {
      await api.post(`/${postId}/like`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSave(postId) {
    if (!token) {
      showNotice("Please sign in to save posts.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    const hasSaved = posts
      .find((post) => post._id === postId)
      ?.saved?.some((u) => (u._id || u) === currentUser?._id);

    setPosts((items) =>
      items.map((post) => {
        if (post._id === postId) {
          const updatedSaved = hasSaved
            ? post.saved.filter((u) => (u._id || u) !== currentUser?._id)
            : [...post.saved, currentUser];
          return { ...post, saved: updatedSaved };
        }
        return post;
      }),
    );

    try {
      await api.post(`/${postId}/save`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleComment(postId, content) {
    if (!token) {
      showNotice("Please sign in to comment.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    const newComment = {
      _id: crypto.randomUUID(),
      content,
      user: currentUser,
      createdAt: new Date().toISOString(),
    };

    setPosts((items) =>
      items.map((post) =>
        post._id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post,
      ),
    );

    try {
      const response = await api.post(`/${postId}/comment`, { content });
      if (response.data?.comments) {
        setPosts((items) =>
          items.map((post) =>
            post._id === postId
              ? { ...post, comments: response.data.comments.map((c) => ({ ...c, user: c.user || currentUser })) }
              : post,
          ),
        );
      }
    } catch {
      showNotice("Comment saved locally.");
    }
  }

  async function handleDeleteComment(postId, commentId) {
    if (!token) return;
    setPosts((items) =>
      items.map((post) =>
        post._id === postId
          ? { ...post, comments: post.comments.filter((c) => c._id !== commentId) }
          : post,
      ),
    );

    try {
      await api.delete(`/${postId}/comment/${commentId}`);
      showNotice("Comment deleted.");
    } catch {
      showNotice("Deleted locally. Sync pending.");
    }
  }

  async function handleFollow(personId) {
    if (!token) {
      showNotice("Please sign in to follow writers.");
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    if (personId === currentUser._id) {
      showNotice("You cannot follow yourself.");
      return;
    }

    const following = currentUser.following || [];
    const isFollowing = following.some((id) => (id._id || id) === personId);
    setCurrentUser((user) => ({
      ...user,
      following: isFollowing
        ? following.filter((id) => (id._id || id) !== personId)
        : [...following, personId],
    }));

    try {
      await api.post(`/${personId}/follow`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUpdateProfile(username, email, file) {
    try {
      const body = new FormData();
      body.append("username", username);
      body.append("email", email);
      if (file) {
        body.append("profileImage", file);
      }

      const response = await api.post(`/updateprofile/${currentUser._id}`, body);
      const updatedUser = normalizeUser(response.data?.user || response.data);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        showNotice("Profile updated successfully.");
      }
    } catch (error) {
      showNotice(
        error.response?.data?.message || "Failed to sync profile update. Saved locally.",
      );
      setCurrentUser((user) => ({ ...user, username, email }));
    }
  }

  async function handleLogout() {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log("Backend logout failed", err);
    }
    setToken("");
    setCurrentUser(null);
    localStorage.removeItem("blogify-token");
    localStorage.removeItem("blogify-user");
    showNotice("Logged out.");
    // Redirect to login page
    setAuthMode("login");
    setAuthOpen(true);
  }

  function startEdit(post) {
    if (!token) return;
    setEditingPost(post);
    setComposerOpen(true);
  }

  const handleComposeClick = () => {
    if (!token) {
      showNotice("Please login to write a post.");
      setAuthMode("login");
      setAuthOpen(true);
    } else {
      setEditingPost(null);
      setComposerOpen(true);
    }
  };

  const handleProfileClick = () => {
    if (!token) {
      setAuthMode("login");
      setAuthOpen(true);
    } else {
      setProfileOpen(true);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="min-h-screen bg-[#07020d] text-slate-100 relative overflow-hidden font-sans pb-20 lg:pb-0">
      {/* Background ambient blobs */}
      <div className="absolute top-[-10%] left-[-15%] h-[600px] w-[600px] rounded-full bg-purple-700/10 blur-[130px] pointer-events-none animate-blob-slow" />
      <div className="absolute bottom-[10%] right-[-10%] h-[700px] w-[700px] rounded-full bg-fuchsia-600/10 blur-[150px] pointer-events-none animate-blob-fast" />

      <div className="relative mx-auto flex min-h-screen max-w-screen-2xl gap-6 px-4 py-4 lg:px-6">
        <Sidebar
          currentUser={currentUser}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onCompose={handleComposeClick}
          onOpenAuth={() => {
            setAuthMode("login");
            setAuthOpen(true);
          }}
          onOpenProfile={handleProfileClick}
          onLogout={handleLogout}
          token={token}
          drawerOpen={drawerOpen}
          onToggleDrawer={toggleDrawer}
        />

        {/* Drawer backdrop overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
            onClick={toggleDrawer}
          />
        )}

        <main className="min-w-0 flex-1 pb-16 lg:pb-8">
          <Topbar
            search={search}
            setSearch={setSearch}
            currentUser={currentUser}
            token={token}
            onCompose={handleComposeClick}
            onOpenAuth={() => {
              setAuthMode("login");
              setAuthOpen(true);
            }}
            onOpenProfile={handleProfileClick}
            onToggleDrawer={toggleDrawer}
          />

          {/* Navigation Title Display */}
          <div className="mt-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white capitalize">
                {currentView === "home" ? "Community Feed" : currentView === "my-posts" ? "My Publications" : `${currentView} view`}
              </h1>
              <p className="text-xs text-violet-300/60 mt-1">
                {currentView === "home" && "Discover recent posts and insights from our authors."}
                {currentView === "trending" && "Highly visited and recommended community stories."}
                {currentView === "writers" && "Find, search, and connect with creative minds."}
                {currentView === "saved" && "Stories you saved to read later."}
                {currentView === "my-posts" && "Manage, edit, or delete your published articles."}
              </p>
            </div>
            {currentView === "home" && (
              <button
                onClick={handleComposeClick}
                className="glow-btn hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold text-white shadow-lg transition"
              >
                <FiPlus /> Write Post
              </button>
            )}
          </div>

          {currentView === "home" && (
            <CategoryTabs
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={categories}
            />
          )}

          {/* Dynamic Views Rendering */}
          {currentView === "writers" ? (
            <div className="mt-6">
              {/* Writers directory search bar */}
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 px-4 py-3 mb-6 backdrop-blur-md">
                <FiSearch className="text-violet-400" />
                <input
                  value={writerSearchQuery}
                  onChange={(e) => setWriterSearchQuery(e.target.value)}
                  placeholder="Search user profile name or email..."
                  className="bg-transparent outline-none text-xs font-semibold flex-1 text-white placeholder:text-violet-200/40"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {searchedWriters.map((person) => {
                  const isFollowing = currentUser.following?.some((id) => (id._id || id) === person._id);
                  const isSelf = person._id === currentUser._id;
                  return (
                    <div
                      key={person._id}
                      className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur-md"
                    >
                      <button onClick={() => setSelectedWriterId(person._id)}>
                        <Avatar user={person} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <button
                          onClick={() => setSelectedWriterId(person._id)}
                          className="block text-left truncate text-xs font-black text-white hover:text-purple-300"
                        >
                          {person.username}
                        </button>
                        <p className="truncate text-[10px] text-violet-300/50 mt-0.5">
                          {person.specialty || person.email}
                        </p>
                      </div>
                      {!isSelf && (
                        <button
                          onClick={() => handleFollow(person._id)}
                          className={`rounded-full px-4 py-2 text-[10px] font-black transition ${
                            isFollowing
                              ? "bg-white/10 text-violet-200 border border-white/10"
                              : "bg-white text-slate-900"
                          }`}
                        >
                          {isFollowing ? "Following" : "Follow"}
                        </button>
                      )}
                    </div>
                  );
                })}

                {!searchedWriters.length && (
                  <div className="col-span-2 rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
                    <p className="text-sm font-bold text-violet-200/60">No writers match your search query.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="mt-6 rounded-3xl border border-white/5 bg-white/5 p-12 text-center text-violet-200/60 backdrop-blur-xl animate-pulse">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4" />
                  <p className="text-sm font-semibold">Retrieving community feed...</p>
                </div>
              ) : (
                <div className="mt-6 grid gap-5">
                  {displayedPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLike}
                      onSave={handleSave}
                      onComment={handleComment}
                      onDeleteComment={handleDeleteComment}
                      onEdit={startEdit}
                      onDelete={handleDeletePost}
                      onAvatarClick={(writerId) => setSelectedWriterId(writerId)}
                      token={token}
                      showNotice={showNotice}
                      onPostClick={handlePostClick}
                    />
                  ))}

                  {!displayedPosts.length && (
                    <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
                      <p className="text-lg font-bold text-white">No posts available</p>
                      <p className="mt-2 text-sm text-violet-200/60">
                        {currentView === "saved"
                          ? "You haven't saved any posts yet. Saved stories appear here."
                          : "Try another search, select a category, or publish a new post."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>

        <RightPanel
          people={people}
          trendingPosts={trendingPosts}
          currentUser={currentUser}
          onFollow={handleFollow}
          onAvatarClick={(writerId) => setSelectedWriterId(writerId)}
          token={token}
        />

      </div>

      <MobileNav
        onCompose={handleComposeClick}
        onOpenProfile={handleProfileClick}
        currentView={currentView}
        setCurrentView={setCurrentView}
        token={token}
        currentUser={currentUser}
      />

      {composerOpen && (
        <ComposerModal
          post={editingPost}
          onClose={() => {
            setComposerOpen(false);
            setEditingPost(null);
          }}
          onSave={handleSavePost}
          categories={categories}
        />
      )}

      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSubmit={handleAuth}
          loading={authLoading}
        />
      )}

      {profileOpen && (
        <ProfileModal
          currentUser={currentUser}
          onSaveProfile={handleUpdateProfile}
          myPosts={myPosts}
          onClose={() => setProfileOpen(false)}
        />
      )}

      {selectedWriterId && (
        <WriterProfileModal
          writerId={selectedWriterId}
          currentUser={currentUser}
          onFollow={handleFollow}
          onClose={() => setSelectedWriterId(null)}
          onLikePost={handleLike}
          onSavePost={handleSave}
          onCommentPost={handleComment}
          onDeleteComment={handleDeleteComment}
          onEditPost={startEdit}
          onDeletePost={handleDeletePost}
          token={token}
          showNotice={showNotice}
          onPostClick={handlePostClick}
        />
      )}

      {authLoading && <ProcessIndicator message="Processing..." />}

      <ToastContainer />
    </div>
  );
}

export default App;
