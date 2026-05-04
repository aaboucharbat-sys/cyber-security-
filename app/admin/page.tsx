import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions, adminEmails } from "@/lib/auth";
import { readScoreboard, type ScoreEntry } from "@/lib/quiz-data";
import AdminControls from "./admin-controls";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email?.toLowerCase() || "";
  const isAdmin = adminEmails.includes(email);

  // Access Denied View
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-green-400 flex items-center justify-center p-6">
        <section className="bg-black border border-red-500/50 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] p-10 max-w-md w-full text-center backdrop-blur-md">
          <h1 className="text-4xl font-black mb-4 text-red-500 uppercase tracking-tighter">
            Accès refusé
          </h1>
          <p className="text-gray-400 mb-8">
            Autorisation insuffisante. Seuls les administrateurs peuvent accéder
            à ce terminal.
          </p>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-900/20"
          >
            Retour au Système
          </Link>
        </section>
      </main>
    );
  }

  let leaderboard: ScoreEntry[] = [];
  try {
    leaderboard = await readScoreboard();
  } catch (error) {
    console.error("Erreur lors du chargement du classement :", error);
  }

  leaderboard.sort((a, b) => b.score - a.score);
  const winner = leaderboard.length > 0 ? leaderboard[0] : null;

  return (
    <main className="min-h-screen bg-black bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black text-green-400 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Console */}
        <header className="relative bg-black/40 border border-green-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(34,197,94,0.1)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <h1 className="text-4xl md:text-6xl font-black mb-3 text-green-400 tracking-tight uppercase">
            Console <span className="text-white">Admin</span>
          </h1>
          <p className="text-green-600 font-mono tracking-widest text-sm uppercase">
            Live Leaderboard Protocol // Connected
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Admin Info & Winner */}
          <div className="space-y-8">
            {/* Admin Info */}
            <div className="bg-gray-950/50 border border-green-900 rounded-xl p-6 shadow-inner">
              <h3 className="text-xs font-bold text-green-700 uppercase mb-4 tracking-widest">
                Identité
              </h3>
              <p className="text-xl font-bold text-green-100 truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-green-800 font-mono text-sm">
                {session?.user?.email}
              </p>
            </div>

            {/* Admin Controls */}
            <AdminControls />

            {/* Winner Card */}
            {winner ? (
              <div className="bg-green-500/5 border-2 border-yellow-500/50 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-yellow-500/10 rotate-12 transition-transform group-hover:scale-110">
                  <svg
                    width="120"
                    height="120"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black mb-4 text-yellow-500 flex items-center gap-2">
                  <span>🏆</span> GAGNANT
                </h2>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-white">
                    {winner.name}
                  </p>
                  <p className="text-yellow-500 font-mono text-2xl">
                    {winner.score} <span className="text-sm">PTS</span>
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-yellow-500/20 text-xs text-gray-500 font-mono">
                  SOUCHON_DATE:{" "}
                  {new Date(winner.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            ) : (
              <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 text-gray-600 italic">
                En attente de données...
              </div>
            )}
          </div>

          {/* Right Column: Main Table */}
          <div className="lg:col-span-2">
            <div className="bg-black/60 border border-green-500/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-green-500/10 border-b border-green-500/30">
                      <th className="px-6 py-4 font-bold text-green-400 uppercase text-xs">
                        Rang
                      </th>
                      <th className="px-6 py-4 font-bold text-green-400 uppercase text-xs">
                        Utilisateur
                      </th>
                      <th className="px-6 py-4 font-bold text-green-400 uppercase text-xs text-right">
                        Score
                      </th>
                      <th className="px-6 py-4 font-bold text-green-400 uppercase text-xs text-right">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-900/30">
                    {leaderboard.length > 0 ? (
                      leaderboard.map((entry, index) => (
                        <tr
                          key={`${entry.email}-${entry.createdAt}`}
                          className="hover:bg-green-500/5 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={`font-mono font-bold ${index === 0 ? "text-yellow-500" : "text-gray-500"}`}
                            >
                              #{String(index + 1).padStart(2, "0")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-green-100 group-hover:text-green-400 transition-colors">
                              {entry.name}
                            </div>
                            <div className="text-xs text-gray-600 font-mono truncate max-w-[150px] md:max-w-xs">
                              {entry.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-black text-green-400">
                            {entry.score.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-gray-500 font-mono">
                            {new Date(entry.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="p-12 text-center text-gray-600 font-mono"
                        >
                          NO_RECORDS_FOUND
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <footer className="flex justify-center pt-6">
          <Link
            href="/"
            className="group relative px-[15px] py-4 bg-transparent border border-green-500 text-green-500 font-bold uppercase tracking-widest overflow-hidden rounded-3xl  transition-all hover:text-black"
          >
            <div className="absolute inset-0 w-0 bg-green-500 transition-all duration-300 group-hover:w-full -z-10 rounded-3xl  "></div>
            Retour au Hub
          </Link>
        </footer>
      </div>
    </main>
  );
}
