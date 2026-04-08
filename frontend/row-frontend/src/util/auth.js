const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const USERNAME_KEY = "username";

export const setAuth = ({ token, role, username }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role || "USER");
  localStorage.setItem(USERNAME_KEY, username || "");
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getRole = () => localStorage.getItem(ROLE_KEY) || "USER";

export const getUsername = () => localStorage.getItem(USERNAME_KEY) || "";

export const isAuthenticated = () => Boolean(getToken());
