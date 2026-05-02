"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Sign in with Google</h1>
        <p>
          Only @estin email addresses are allowed to join the Cyber-Matrix quiz.
        </p>
        <button
          className="primary-button"
          onClick={() =>
            signIn("google", { callbackUrl: window.location.origin })
          }
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}
