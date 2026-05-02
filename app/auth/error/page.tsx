"use client";

import Link from "next/link";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const message =
    params.error === "AccessDenied"
      ? "Please sign in with an @estin email address."
      : "Unable to sign in. Please try again.";

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Access denied</h1>
        <p>{message}</p>
        <Link href="/auth/signin" className="primary-button">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
