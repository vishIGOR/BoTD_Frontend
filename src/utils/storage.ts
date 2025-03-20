import { TokenData } from "../models/TokenData";

export function saveTokenData(tokenData: TokenData) {
  localStorage.setItem("token", tokenData.token);
  localStorage.setItem("expiresIn", tokenData.expiresIn);
}

export function getTokenData(): TokenData | null {
  const token = localStorage.getItem("token");
  const expiresIn = localStorage.getItem("expiresIn");

  if (!token || !expiresIn) {
    return null;
  }

  return {
    token,
    expiresIn,
  };
}

export function deleteTokenData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiresIn");
}
