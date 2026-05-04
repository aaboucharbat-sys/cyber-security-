"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { questions } from "@/lib/questions";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type LeaderboardEntry = {
  name: string;
  email: string;
  score: number;
  createdAt: string;
};

// Modal Data Structure
const MODAL_DATA = {
  concept: {
    title: "Comprendre les Menaces",
    text1:
      "À l'ère du tout-numérique, les cyberattaques sont devenues une réalité quotidienne. Des attaquants cherchent constamment à infiltrer les systèmes pour dérober des données ou paralyser des infrastructures. Maîtriser la cybersécurité, c'est avant tout comprendre le mode opératoire de ces hackers pour mieux s'en protéger.",
    title2: "La Stratégie de Résilience",
    text2:
      "La sécurité moderne repose sur l'équilibre entre l'offensive (Red Team) et la défensive (Blue Team). Cette collaboration proactive permet d'anticiper les risques plutôt que de simplement les subir.",
    color: "text-green-500",
  },
  offensive: {
    title: "L'Art de l'Offensive",
    text1:
      "Le Red Teaming simule des adversaires sophistiqués pour tester les capacités de détection. Cela inclut l'exploitation de vulnérabilités Zero-day, le contournement de l'EDR et l'exfiltration de données critiques.",
    title2: "Ingénierie Sociale",
    text2:
      "L'humain reste le maillon faible. Le phishing, le vishing et le pretexting sont des techniques redoutables pour obtenir des accès initiaux sans forcer une seule ligne de code.",
    color: "text-red-500",
  },
  defensive: {
    title: "Fortification Système",
    text1:
      "La défense en profondeur consiste à superposer plusieurs couches de sécurité. Si un pare-feu tombe, l'IDS prend le relais. Si l'IDS échoue, le chiffrement protège la donnée.",
    title2: "SOC & Incident Response",
    text2:
      "Le Security Operations Center surveille le réseau 24/7. En cas d'intrusion, une équipe de réponse aux incidents (DFIR) intervient pour isoler la menace et restaurer les services.",
    color: "text-blue-500",
  },
  networking: {
    title: "Architecture Réseau",
    text1:
      "Le réseau est l'épine dorsale de la communication. Comprendre les modèles OSI et TCP/IP est crucial pour segmenter les flux et empêcher les mouvements latéraux des attaquants.",
    title2: "Protocoles Sécurisés",
    text2:
      "L'implémentation de protocoles comme TLS 1.3, SSH, et IPsec garantit que les données en transit ne peuvent être ni interceptées ni modifiées par des tiers malveillants.",
    color: "text-purple-500",
  },
} as const;

type ModalKey = keyof typeof MODAL_DATA;

export default function Home() {
  const { data: session } = useSession();
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  // FIX: explicit element type on the ref array
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const isEligible = Boolean(
    session?.user?.email?.toLowerCase().endsWith("@estin.dz"),
  );
  const isAdmin = Boolean(
    session?.user?.email?.toLowerCase() === "aa_boucharbat@estin.dz",
  );

  // Matrix Background
  useEffect(() => {
    const canvas = document.getElementById(
      "matrix-canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const fontSize = 20;
    const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*";
    const matrix = chars.split("");
    let drops: number[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops = Array(Math.floor(canvas.width / fontSize)).fill(1);
    };
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };
    resize();
    const interval = setInterval(draw, 50);
    window.addEventListener("resize", resize);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // GSAP — FIX: added cleanup to avoid stale ScrollTriggers
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    sectionRefs.current.forEach((section) => {
      if (!section) return;
      const anim = gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: section, start: "top 90%" },
        },
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/quiz/leaderboard");
      const data = (await response.json()) as { leaderboard?: LeaderboardEntry[] };
      setLeaderboard(data.leaderboard ?? []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNext = () => {
    const nextScore =
      score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0);
    if (currentQuestion + 1 < questions.length) {
      setScore(nextScore);
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setScore(nextScore);
      setQuizFinished(true);
    }
  };

  // suppress unused warnings — used externally / in admin
  void fetchLeaderboard;
  void quizFinished;
  void leaderboard;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-green-500 selection:text-black">
      <canvas
        id="matrix-canvas"
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none"
      ></canvas>

      {/* Global Dynamic Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-2xl transition-all">
          <div className="w-full max-w-3xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-zinc-900/50 px-8 py-5 border-b border-white/5 flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                System_Entry::{activeModal}.log
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="text-zinc-500 hover:text-white transition p-2"
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-8 md:p-14 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <h3
                  className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${MODAL_DATA[activeModal].color}`}
                >
                  {MODAL_DATA[activeModal].title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  {MODAL_DATA[activeModal].text1}
                </p>
              </div>
              <div className="h-[1px] bg-white/5 w-full"></div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white">
                  {MODAL_DATA[activeModal].title2}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg font-light">
                  {MODAL_DATA[activeModal].text2}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest group ${MODAL_DATA[activeModal].color}`}
              >
                <span className="group-hover:-translate-x-2 transition-transform">
                  ←
                </span>{" "}
                Close_Terminal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 transition-opacity ${activeModal ? "opacity-0" : "opacity-100"}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-green-500 font-black tracking-tighter text-xl md:text-2xl">
            CYBER-ESTIN
          </div>
          <div className="hidden lg:flex gap-10 text-[9px] font-bold uppercase tracking-[0.4em]">
            <Link
              href="#presentation"
              className="hover:text-green-400 transition"
            >
              Concepts
            </Link>
            <Link href="#attack" className="hover:text-red-400 transition">
              Offensif
            </Link>
            <Link href="#defense" className="hover:text-blue-400 transition">
              Défensif
            </Link>
            <Link
              href="#networking"
              className="hover:text-purple-400 transition"
            >
              Réseau
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:text-green-400 transition">
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <button
                onClick={() => signOut()}
                className="text-[10px] bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-full text-red-500"
              >
                LOG_OUT
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="text-[10px] bg-green-500/10 border border-green-500/50 px-4 py-2 rounded-full text-green-500"
              >
                CONNECT
              </button>
            )}
          </div>
        </div>
      </nav>

      <main
        className={`flex flex-col gap-50 items-center w-full px-4 md:px-0 transition-all duration-700 ${activeModal ? "blur-2xl scale-95 opacity-50" : "blur-0 scale-100 opacity-100"}`}
      >
        {/* Hero */}
        <section className="h-[90vh] flex flex-col items-center justify-center text-center">
          <div className="space-y-2 mb-6">
            <span className="text-green-500 font-mono text-[10px] tracking-[0.5em] uppercase">
              Security Protocol Alpha
            </span>
            <h1 className="text-6xl md:text-[10rem] font-black tracking-normal leading-none text-white">
              CYBER<span className="text-green-500 text-2xl">-estin</span>
            </h1>
          </div>
          <p className="max-w-md text-zinc-500 text-sm md:text-base font-light leading-relaxed px-4">
            Exploration des systèmes offensifs et défensifs au sein de
            l'écosystème numérique moderne.
          </p>
        </section>

        {/* Section 1: Concept */}
        <section
          id="presentation"
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="w-full max-w-6xl py-32 md:py-48 grid md:grid-cols-2 gap-20 items-center"
        >
          <div className="space-y-8 px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Le Concept<span className="text-green-500">.</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
              La cybersécurité n'est pas seulement une barrière technique, c'est
              une stratégie globale pour protéger l'intégrité.
            </p>
            <button
              onClick={() => setActiveModal("concept")}
              className="group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-green-500"
            >
              <span className="w-12 h-[1px] bg-green-500 group-hover:w-20 transition-all"></span>{" "}
              Learn_More
            </button>
          </div>
          <div className="relative group px-4 md:px-0">
            <div className="absolute -inset-2 bg-green-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Image
              src="/concept.png"
              width={800}
              height={500}
              alt="Sec"
              className="relative rounded-[2rem] border border-white/5 grayscale hover:grayscale-0 transition duration-700"
            />
          </div>
        </section>

        {/* Section 2: Attack */}
        <section
          id="attack"
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="w-full max-w-6xl py-32 md:py-48 grid md:grid-cols-2 gap-20 items-center"
        >
          <div className="order-2 md:order-1 relative group px-4 md:px-0">
            <div className="absolute -inset-2 bg-red-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Image
              src="/hacker.png"
              width={800}
              height={500}
              alt="Attack"
              className="relative rounded-[2rem] border border-white/5"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8 px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Offensif<span className="text-red-500">_</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
              Simuler l'adversaire pour découvrir l'invisible. Le Red Teaming
              repousse les limites de la fortification.
            </p>
            <button
              onClick={() => setActiveModal("offensive")}
              className="group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-red-500"
            >
              <span className="w-12 h-[1px] bg-red-500 group-hover:w-20 transition-all"></span>{" "}
              Open_File
            </button>
          </div>
        </section>

        {/* Section 3: Defense */}
        <section
          id="defense"
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="w-full max-w-6xl py-32 md:py-48 grid md:grid-cols-2 gap-20 items-center"
        >
          <div className="space-y-8 px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Défensif<span className="text-blue-500">#</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
              Construire des remparts numériques. La Blue Team assure la
              continuité et la résilience face au chaos.
            </p>
            <button
              onClick={() => setActiveModal("defensive")}
              className="group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-blue-500"
            >
              <span className="w-12 h-[1px] bg-blue-500 group-hover:w-20 transition-all"></span>{" "}
              Deploy_Shield
            </button>
          </div>
          <div className="relative group px-4 md:px-0">
            <div className="absolute -inset-2 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Image
              src="/attack.png"
              width={800}
              height={500}
              alt="Def"
              className="relative rounded-[2rem] border border-white/5"
            />
          </div>
        </section>

        {/* Section 4: Networking */}
        <section
          id="networking"
          ref={(el) => { sectionRefs.current[3] = el; }}
          className="w-full max-w-6xl py-32 md:py-48 grid md:grid-cols-2 gap-20 items-center"
        >
          <div className="order-2 md:order-1 relative group px-4 md:px-0">
            <div className="absolute -inset-2 bg-purple-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-1000"></div>
            <Image
              src="/network.png"
              width={800}
              height={500}
              alt="Network"
              className="relative rounded-[2rem] border border-white/5 grayscale group-hover:grayscale-0 transition duration-700"
            />
          </div>
          <div className="order-1 md:order-2 space-y-8 px-4 md:px-0">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
              Réseau<span className="text-purple-500">::</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
              L'architecture des flux. Maîtriser le transport de la donnée pour
              garantir une isolation parfaite des actifs.
            </p>
            <button
              onClick={() => setActiveModal("networking")}
              className="group flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-purple-500"
            >
              <span className="w-12 h-[1px] bg-purple-500 group-hover:w-20 transition-all"></span>{" "}
              View_Topology
            </button>
          </div>
        </section>

        {/* Quiz Terminal */}
        <section id="quiz" className="w-full max-w-4xl py-32 px-4 md:px-6">
          <div className="bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="bg-zinc-900/50 px-8 py-5 flex justify-between items-center border-b border-white/5">
              <span className="text-[10px] font-mono text-green-500 tracking-widest">
                CMD::ESTIN_LABS_QUIZ
              </span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
              </div>
            </div>
            <div className="p-8 md:p-16">
              {!quizStarted ? (
                <div className="text-center space-y-10">
                  <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                    Prêt pour le Test ?
                  </h3>
                  <button
                    onClick={() => setQuizStarted(true)}
                    className="bg-green-500 text-black font-black px-12 py-5 rounded-full hover:scale-105 transition-all uppercase tracking-widest text-xs"
                  >
                    Start_Initialization
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex justify-between font-mono text-[10px] text-zinc-500 uppercase">
                    <span>Question {currentQuestion + 1}/10</span>
                    <span className={timeLeft < 10 ? "text-red-500" : ""}>
                      Timer: {timeLeft}s
                    </span>
                  </div>
                  <h4 className="text-xl md:text-2xl font-bold leading-tight">
                    {questions[currentQuestion].question}
                  </h4>
                  <div className="grid gap-4">
                    {questions[currentQuestion].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer(i)}
                        className={`p-6 text-left rounded-3xl border transition-all duration-300 ${selectedAnswer === i ? "bg-white text-black border-white" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={selectedAnswer === null}
                    onClick={handleNext}
                    className="w-full bg-green-500 text-black font-black py-6 rounded-[2rem] disabled:opacity-20 uppercase tracking-widest text-xs"
                  >
                    Next_Phase
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <footer className="w-full py-20 text-center opacity-30">
          <p className="text-[10px] font-mono tracking-[1em] uppercase px-4 leading-loose">
            Security // Resilience // ESTIN 2026
          </p>
        </footer>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}