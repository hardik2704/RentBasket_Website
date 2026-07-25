import { safeSet, safeRemove } from "@/lib/safeStorage";

const KEY = "rentbasket_auth";

export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const setAuth = (data) => safeSet(KEY, JSON.stringify(data));

export const clearAuth = () => safeRemove(KEY);

export const isAuthenticated = () => Boolean(getAuth()?.token ?? getAuth()?.phone);
