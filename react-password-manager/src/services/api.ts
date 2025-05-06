import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

// Must be called after login or on first dashboard mount
export const setAuthHeaders = (token: string | null, vaultKey: string | null) => {
  API.interceptors.request.clear(); // clear previous interceptors (optional but clean)

  API.interceptors.request.use((config) => {
    if (token) config.headers["Authorization"] = token;
    if (vaultKey) config.headers["Vault-Key"] = vaultKey;
    return config;
  });
};

export default API;
