"use client";

import { useState, useRef } from "react";

export default function AdminControls() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleResetClick = () => {
    // Show confirmation dialog
    if (dialogRef.current) {
      dialogRef.current.classList.remove("hidden");
    }
  };

  const handleConfirmReset = async () => {
    if (dialogRef.current) {
      dialogRef.current.classList.add("hidden");
    }

    setIsResetting(true);
    setResetMessage(null);

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
      });

      if (response.ok) {
        setResetMessage({
          type: "success",
          text: "Classement réinitialisé avec succès!",
        });
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResetMessage({
          type: "error",
          text: "Erreur lors de la réinitialisation",
        });
      }
    } catch (error) {
      setResetMessage({ type: "error", text: "Erreur de connexion" });
    } finally {
      setIsResetting(false);
    }
  };

  const handleCancelReset = () => {
    if (dialogRef.current) {
      dialogRef.current.classList.add("hidden");
    }
  };

  return (
    <>
      {/* Reset Leaderboard Card */}
      <div className="bg-red-950/30 border border-red-900 rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-bold text-red-700 uppercase mb-4 tracking-widest">
          Contrôles
        </h3>

        <button
          onClick={handleResetClick}
          disabled={isResetting}
          className="w-full group relative px-4 py-3 bg-transparent border border-red-600 text-red-500 font-bold uppercase tracking-widest overflow-hidden rounded-lg transition-all hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 w-0 bg-red-600 transition-all duration-300 group-hover:w-full -z-10 rounded-lg"></div>
          {isResetting ? "Réinitialisation..." : "Réinitialiser le classement"}
        </button>

        {resetMessage && (
          <div
            className={`p-3 rounded-lg text-sm font-mono text-center ${
              resetMessage.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {resetMessage.text}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <div
        ref={dialogRef}
        className="hidden fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={handleCancelReset}
      >
        <div
          className="bg-black border-2 border-red-600 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">
            ⚠️ ATTENTION
          </h2>
          <p className="text-gray-300 mb-6 font-mono">
            Êtes-vous sûr de vouloir réinitialiser le classement ? Cette action
            est irréversible et supprimera tous les scores.
          </p>
          <div className="flex gap-4">
            <button
              onClick={handleCancelReset}
              className="flex-1 px-4 py-3 border border-green-500 text-green-500 font-bold uppercase rounded-lg hover:bg-green-500/10 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmReset}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-bold uppercase rounded-lg hover:bg-red-500 transition-colors"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
