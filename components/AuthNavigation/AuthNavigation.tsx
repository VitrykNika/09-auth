"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { logoutRequest } from "@/lib/api/clientApi";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      clearIsAuthenticated();
      router.replace("/sign-in");
    }
  }

  const isActive = (href: string) => (pathname === href ? "page" : undefined);

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