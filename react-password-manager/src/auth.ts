export const setAuthData = (token: string, vaultKey: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("vaultKey", vaultKey);
  };
  
  export const getAuthData = () => {
    const token = localStorage.getItem("token");
    const vaultKey = localStorage.getItem("vaultKey");
    return { token, vaultKey };
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vaultKey");
  };
  