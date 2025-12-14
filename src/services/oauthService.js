"use-client";
import { signIn } from "next-auth/react";
import { saveInLocalStorage } from "./localStorageService";
import { useEffect } from "react";

export const oauthServices = {
  loginWithOAuth,
};

async function loginWithOAuth(provider) {
  try {
    const result = await signIn(provider, { redirect: false });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    const sessionResponse = await fetch("/api/auth/session");
    const session = await sessionResponse.json();

    if (!session?.user || !session?.access_token) {
      return { success: false, error: "OAuth login failed" };
    }
    saveInLocalStorage("user", session.user);
    saveInLocalStorage("token", session.access_token);

    return { success: true, user: session.user };
  } catch (err) {
    console.error("OAuth login error:", err);
    return { success: false, error: err.message };
  }
}
