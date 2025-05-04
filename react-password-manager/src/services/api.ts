import axios from "axios";
import { getAuthData } from "../auth";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.request.use((config) => {
  const { token, vaultKey } = getAuthData();
  if (token) config.headers["Authorization"] = token;
  if (vaultKey) config.headers["Vault-Key"] = vaultKey;
  return config;
});

export default API;
