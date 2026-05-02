"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { questions } from "@/lib/questions";

type LeaderboardEntry = {
  name: string;
  email: string;
  score: number;
  createdAt: string;
};

export default function Home() {
  const { data: session, status } = useSession();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [resultMessage, setResultMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEligible = Boolean(
    session?.user?.email?.toLowerCase().endsWith("@estin"),
  );
  const isAdmin = Boolean(
    session?.user?.email?.toLowerCase() === "admin@estin",
  );
  const question = questions[currentQuestion];

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById(
      "matrix-canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    let drops = Array(Math.floor(window.innerWidth / fontSize)).fill(1);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array(Math.floor(window.innerWidth / fontSize)).fill(1);
    };

    const drawMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const text =
          matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      }
    };

    resizeCanvas();
    const interval = window.setInterval(drawMatrix, 50);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/quiz/leaderboard");
      if (!response.ok) return;
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch {
      setLeaderboard([]);
    }
  };

  const submitQuiz = async (finalScore: number) => {
    if (!session?.user?.email) return;
    setSubmitting(true);

    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name || session.user.email,
          email: session.user.email,
          score: finalScore,
        }),
      });

      if (!response.ok) {
        setResultMessage("Unable to save your score. Try again later.");
        return;
      }

      setResultMessage("Score submitted successfully.");
      fetchLeaderboard();
    } catch {
      setResultMessage("Unable to save your score. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    const nextScore = score + (selectedAnswer === question.correct ? 1 : 0);

    if (currentQuestion + 1 < questions.length) {
      setScore(nextScore);
      setCurrentQuestion((current) => current + 1);
      setSelectedAnswer(null);
      return;
    }

    setScore(nextScore);
    setQuizFinished(true);
    submitQuiz(nextScore);
  };

  return (
    <main>
      <canvas id="matrix-canvas"></canvas>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <i className="fas fa-shield-alt"></i> CYBER-MATRIX
          </div>
          <div className="nav-links">
            <Link href="#home">Accueil</Link>
            <Link href="#presentation">Présentation</Link>
            <Link href="#intro">Menaces</Link>
            <Link href="#layers">Protection</Link>
            <Link href="#quiz">Quiz</Link>
            <Link href="#leaderboard">Classement</Link>
            {isAdmin && (
              <Link href="/admin" className="nav-button">
                Admin
              </Link>
            )}
          </div>
          <div className="nav-button-container">
            {status === "loading" ? (
              <span className="nav-button">Loading...</span>
            ) : session ? (
              <button
                className="nav-button"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign out
              </button>
            ) : (
              <button
                className="nav-button"
                onClick={() =>
                  signIn("google", { callbackUrl: window.location.origin })
                }
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <h1>CYBER-MATRIX</h1>
          <p>
            Bienvenue dans l'ère de l'information. Vos données sont aujourd'hui
            plus précieuses que l'or.
          </p>
          <div className="shield-container">
            <div className="shield-glow"></div>
            <div className="digital-shield">
              <div className="loading-text">SYSTÈME EN CHARGEMENT...</div>
            </div>
          </div>
        </div>
      </section>

      <section id="presentation" className="section">
        <h2 className="section-title">Présentation</h2>
        <div className="glass-card">
          <p>
            Bienvenue dans l'ère de l'information. Aujourd'hui, nos données sont
            plus précieuses que l'or. Mais comment protéger nos vies numériques
            face aux menaces invisibles ? Dans cette présentation, nous allons
            explorer les piliers de la cybersécurité, les menaces actuelles et
            les solutions pour bâtir un futur numérique sûr.
          </p>
        </div>
      </section>

      <section id="intro" className="section">
        <h2 className="section-title">
          Les Menaces Courantes 
        </h2>
        <div className="grid">
          <div className="glass-card">
            <h3>
              <i className="fas fa-envelope-open-text"></i> Hameçonnage
            </h3>
            <p>Vol d'identifiants via de faux emails.</p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-skull-crossbones"></i> Ransomwares
            </h3>
            <p>
              Logiciels malveillants qui cryptent vos fichiers contre une
              rançon.
            </p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-bolt"></i> Attaques DDoS
            </h3>
            <p>Saturation d'un serveur pour rendre un site inaccessible.</p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-user-secret"></i> Menaces invisibles
            </h3>
            <p>
              Risques cachés qui exploitent les failles humaines et techniques.
            </p>
          </div>
        </div>
      </section>

      <section id="layers" className="section">
        <h2 className="section-title">
          Les Piliers de la Protection 
        </h2>
        <div className="grid">
          <div className="glass-card">
            <h3>
              <i className="fas fa-lock"></i> Chiffrement
            </h3>
            <p>Transformer les données en code illisible.</p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-shield-alt"></i> Authentification
              Multi-Facteurs (MFA)
            </h3>
            <p>Ajouter une couche de sécurité au-delà du mot de passe.</p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-firewall"></i> Pare-feu
            </h3>
            <p>
              Le gardien qui filtre le trafic entre internet et votre réseau.
            </p>
          </div>
          <div className="glass-card">
            <h3>
              <i className="fas fa-network-wired"></i> Surveillance active
            </h3>
            <p>Détection et réponse aux menaces en temps réel.</p>
          </div>
        </div>
      </section>

      <section id="quiz" className="section">
        <h2 className="section-title">Page de l'Quiz </h2>
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <span>cyber-matrix@security:~$</span>
          </div>
          <div className="terminal-prompt">
            Êtes-vous un expert en sécurité ? Testez vos connaissances !
          </div>

          {status === "loading" ? (
            <div className="quiz-guard">
              <p>Vérification de votre session...</p>
            </div>
          ) : !session ? (
            <div className="quiz-guard">
              <p>Connectez-vous avec Google pour accéder au quiz.</p>
              <button
                className="primary-button"
                onClick={() =>
                  signIn("google", { callbackUrl: window.location.origin })
                }
              >
                Connexion Google
              </button>
            </div>
          ) : !isEligible ? (
            <div className="quiz-guard">
              <p>Seuls les emails @estin sont autorisés à participer.</p>
              <button
                className="primary-button"
                onClick={() => signOut({ callbackUrl: window.location.origin })}
              >
                Se déconnecter
              </button>
            </div>
          ) : quizFinished ? (
            <div className="question">
              <h4>Quiz terminé !</h4>
              <p>
                Score final : <strong>{score}</strong> / {questions.length}
              </p>
              {resultMessage && <p>{resultMessage}</p>}
            </div>
          ) : (
            <div id="quiz-container">
              <div className="question">
                <h4>
                  Q{currentQuestion + 1}: {question.question}
                </h4>
                <div className="options">
                  {question.options.map((option, index) => (
                    <div
                      key={option}
                      className={`option ${selectedAnswer === index ? "selected" : ""}`}
                      onClick={() => setSelectedAnswer(index)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="primary-button"
                onClick={handleNext}
                disabled={selectedAnswer === null}
              >
                {selectedAnswer === null
                  ? "CHOISISSEZ UNE OPTION"
                  : "EXÉCUTER LE PROTOCOLE SUIVANT"}
              </button>
              {submitting && (
                <p style={{ marginTop: "1rem" }}>Enregistrement du score...</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section id="leaderboard" className="section">
        <h2 className="section-title">Classement Mondial</h2>
        <div className="leaderboard">
          {leaderboard.length === 0 ? (
            <div className="glass-card">
              <p>
                Aucun score n'a encore été soumis. Soyez le premier à sécuriser
                le quiz Cyber-Matrix.
              </p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={`${entry.email}-${entry.createdAt}`}
                className="leader-row"
              >
                <div className="rank">#{index + 1}</div>
                <div>{entry.name}</div>
                <div>{entry.score} pts</div>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="conclusion" className="section">
        <h2 className="section-title">Conclusion </h2>
        <div className="glass-card">
          <p>
            Pour conclure, la cybersécurité n'est pas qu'une question de
            technologie, c'est avant tout une question de vigilance humaine.
            Restez prudents, restez protégés. Merci de votre attention.
          </p>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <a href="#home" className="primary-button">
              Retour en haut
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
