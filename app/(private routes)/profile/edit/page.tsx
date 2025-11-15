"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";

import { getMe, updateProfile } from "@/lib/api/clientApi";
import type { User } from "@/types/user";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./EditProfilePage.module.css";

export default function EditProfile() {
  const [user, setUserState] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        if (data) {
          setUserState(data);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile data.");
      }
    };

    void fetchUser();
  }, []);

  const handleCancel = () => {
    router.push("/profile");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    const usernameRaw = formData.get("username");
    const username =
      typeof usernameRaw === "string" ? usernameRaw.trim() : "";

    if (!username) {
      setError("Username cannot be empty");
      return;
    }

    if (!user?.email) {
      setError("User data is not available");
      return;
    }

    try {
      const updatedUser = await updateProfile({
        email: user.email,
        username,
      });
      
      setUser(updatedUser);

      router.push("/profile");
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message as string);
      } else {
        setError("An unexpected error occurred")
      }
    }
  };
  
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user?.avatar && (
          <Image
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          {error && <p className={css.error}>{error}</p>}

          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              className={css.input}
              defaultValue={user?.username}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}