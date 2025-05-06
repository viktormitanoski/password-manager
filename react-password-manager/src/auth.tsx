import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
  } from "react";
  import { setAuthHeaders } from "./services/api";
  
  // Auth context type
  interface AuthContextType {
    token: string | null;
    vaultKey: string | null;
    loading: boolean;
    setAuthData: (token: string, vaultKey: string) => void;
    clearAuthData: () => void;
  }
  
  // Create context
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  // Utility: set auth data to sessionStorage
  export function setAuthDataToStorage(token: string, vaultKey: string) {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("vaultKey", vaultKey);
  }
  
  // Utility: get auth data from sessionStorage
  export function getAuthDataFromStorage() {
    return {
      token: sessionStorage.getItem("token"),
      vaultKey: sessionStorage.getItem("vaultKey"),
    };
  }
  
  // Utility: clear auth data
  export function clearAuthDataFromStorage() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("vaultKey");
  }
  
  // Provider component
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [vaultKey, setVaultKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    // On initial load, restore from sessionStorage
    useEffect(() => {
      const { token, vaultKey } = getAuthDataFromStorage();
      if (token && vaultKey) {
        setToken(token);
        setVaultKey(vaultKey);
        setAuthHeaders(token, vaultKey);
      }
      setLoading(false); // ✅ done loading
    }, []);
  
    const setAuthData = (newToken: string, newVaultKey: string) => {
      setToken(newToken);
      setVaultKey(newVaultKey);
      setAuthDataToStorage(newToken, newVaultKey);
      setAuthHeaders(newToken, newVaultKey);
    };
  
    const clearAuthData = () => {
      setToken(null);
      setVaultKey(null);
      clearAuthDataFromStorage();
    };
  
    return (
      <AuthContext.Provider
        value={{ token, vaultKey, loading, setAuthData, clearAuthData }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Hook to access auth
  export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }
  