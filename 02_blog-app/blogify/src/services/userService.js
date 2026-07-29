import { api } from "./api";

export async function searchUsers(query) {
  const response = await api.get("/search", { params: { query } });
  return response.data;
}

export async function followUser(userId) {
  const response = await api.post(`/${userId}/follow`);
  return response.data;
}

export async function getFollowers(userId) {
  const response = await api.get(`/user/${userId}/followers`);
  return response.data;
}

export async function getUserById(userId) {
  const response = await api.get(`/user/${userId}`);
  return response.data;
}