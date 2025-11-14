"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";

import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import type { RegisterLoginData } from "@/types/user";
import { isAxiosError } from "axios";

type LoginErrorResponse = {
  error?: string;
  response?: {
    message?: string;
  };
  message?: string;
};

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const userData: RegisterLoginData = {
      email: (formData.get("email") as string)?.trim(),
      password: (formData.get("password") as string) ?? "",
    };

    try {
      const user = await login(userData);

      if (user) {
        setUser(user);
        router.push("/profile"); 
      } else {
        setError("Invalid credentials");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

     if (isAxiosError(err)) {
  const data = err.response?.data as LoginErrorResponse;

  const message =
    data?.response?.message ||
    data?.error ||
    "Login failed";

  setError(message);
} else {
  setError("Unexpected error");
 } }
};

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
}