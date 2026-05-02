import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions, adminEmails } from "@/lib/auth";
import { readScoreboard } from "@/lib/quiz-data";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  const isAdmin = !!email && adminEmails.includes(email);

  if (!isAdmin) {
    return (
      <main className="admin-root">
        <section className="section admin-card">
          <h1>Access Denied</h1>
          <p>Only admin users can reach this page.</p>
          <Link href="/" className="primary-button">
            Return Home
          </Link>
        </section>
      </main>
    );
  }

  const leaderboard = await readScoreboard();
  const winner = leaderboard[0];

  return (
    <main className="admin-root">
      <section className="section admin-card">
        <h1>Admin Console</h1>
        <p className="section-subtitle">
          Live quiz leaderboard and score details.
        </p>

        {winner ? (
          <div className="glass-card admin-winner">
            <h2>Current Winner</h2>
            <p>
              <strong>{winner.name}</strong> with{" "}
              <strong>{winner.score} pts</strong>
            </p>
          </div>
        ) : (
          <p>No quiz results have been submitted yet.</p>
        )}

        <div className="leaderboard admin-leaderboard">
          {leaderboard.map((entry, index) => (
            <div key={entry.email + entry.createdAt} className="leader-row">
              <div className="rank">#{index + 1}</div>
              <div>{entry.name}</div>
              <div>{entry.score} pts</div>
            </div>
          ))}
        </div>

        <Link href="/" className="primary-button">
          Back to Cyber-Matrix
        </Link>
      </section>
    </main>
  );
}
