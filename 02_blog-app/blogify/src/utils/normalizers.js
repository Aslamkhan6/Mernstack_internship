export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    _id: user._id || user.id || user.email || "",
    username: user.username || user.name || user.email?.split("@")[0] || "Writer",
    profileImage: user.profileImage || user.avatar || "",
    following: user.following || [],
    followers: user.followers || [],
  };
}

export function normalizePost(post) {
  if (!post) return null;

  return {
    ...post,
    _id: post._id || post.id || "",
    title: post.title || "Untitled post",
    content: post.content || post.Content || "",
    category: post.category || "Personal",
    user: normalizeUser(post.user || post.author),
    likes: post.likes || post.like || [],
    saved: post.saved || [],
    comments: post.comments || post.comment || [],
    views: post.views || 0,
    createdAt: post.createdAt || post.updatedAt || new Date().toISOString(),
  };
}

export function extractPosts(payload) {
  const posts = payload?.posts || payload?.mypost || payload?.data || payload;
  if (!Array.isArray(posts)) return [];
  return posts.map(normalizePost).filter(Boolean);
}

export function extractAuthors(posts) {
  const authors = posts.map((post) => post.user).filter(Boolean);

  return authors.filter(
    (author, index, list) =>
      author._id && list.findIndex((item) => item._id === author._id) === index,
  );
}
