import { api } from "./api";

export async function loginUser(payload) {
  const response = await api.post("/login", {
    email: payload.email,
    password: payload.password,
  });

  return response.data;
}

export async function registerUser(payload) {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("email", payload.email);
  formData.append("password", payload.password);

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  const response = await api.post("/register", formData);
  return response.data;
}

export async function getProfile() {
  const response = await api.get("/profile");
  return response.data;
}

export async function updateProfile(userId, payload) {
  const formData = new FormData();
  formData.append("username", payload.username);
  formData.append("email", payload.email);

  if (payload.profileImage) {
    formData.append("profileImage", payload.profileImage);
  }

  const response = await api.post(`/updateprofile/${userId}`, formData);
  return response.data;
}
