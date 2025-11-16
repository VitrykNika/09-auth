"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { logout, getMe } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function syncAuth() {
      try {
        const me = await getMe();

        if (!me) {
          clearIsAuthenticated();
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    syncAuth();
  }, [clearIsAuthenticated]);

  const isActive = (href: string) => (pathname === href ? "page" : undefined);

  if (checkingAuth) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link
            href="/sign-in"
            prefetch={false}
            aria-current={isActive("/sign-in")}
            className={css.navigationLink}
          >
            Login
          </Link>
        </li>
        <li className={css.navigationItem}>
          <Link
            href="/sign-up"
            prefetch={false}
            aria-current={isActive("/sign-up")}
            className={css.navigationLink}
          >
            Sign up
          </Link>
        </li>
      </>
    );
  }

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.replace("/sign-in");
    }
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link
          href="/profile"
          prefetch={false}
          aria-current={isActive("/profile")}
          className={css.navigationLink}
        >
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link
          href="/notes/filter/all"
          prefetch={false}
          aria-current={isActive("/notes/filter/all")}
          className={css.navigationLink}
        >
          Notes
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.email}</p>
        <button
          type="button"
          className={css.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </li>
    </>
  );
}