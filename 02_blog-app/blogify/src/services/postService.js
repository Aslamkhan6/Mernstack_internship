import { api } from "./api";

export async function getLatestPosts(params = {}) {
  const response = await api.get("/latestpost", { params });
  return response.data;
}

export async function getTrendingPosts() {
  const response = await api.get("/gettrending");
  return response.data;
}

export async function getMyPosts(params = {}) {
  const response = await api.get("/getmypost", { params });
  return response.data;
}

export async function getSavedPosts(params = {}) {
  const response = await api.get("/getsavedpost", { params });
  return response.data;
}

export async function createPost(payload) {
  const response = await api.post("/postcontroller", payload);
  return response.data;
}

export async function updatePost(postId, payload) {
  const response = await api.put(`/updatepost/${postId}`, payload);
  return response.data;
}

export async function deletePost(postId) {
  const response = await api.delete(`/deletepost/${postId}`);
  return response.data;
}

export async function likePost(postId) {
  const response = await api.post(`/${postId}/like`);
  return response.data;
}

export async function savePost(postId) {
  const response = await api.post(`/${postId}/save`);
  return response.data;
}

export async function commentOnPost(postId, content) {
  const response = await api.post(`/${postId}/comment`, { content });
  return response.data;
}

export async function deleteComment(postId, commentId) {
  const response = await api.delete(`/${postId}/comment/${commentId}`);
  return response.data;
}