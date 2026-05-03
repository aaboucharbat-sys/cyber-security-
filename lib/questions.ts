export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};

export const questions: QuizQuestion[] = [
  {
    question: "What does DDoS stand for?",
    options: [
      "Distributed Denial of Service",
      "Direct Data Destruction System",
      "Digital Defense Operating System",
      "Data Denial Operating Service",
    ],
    correct: 0,
  },
  {
    question: "Which encryption standard is most secure?",
    options: ["DES", "AES-256", "MD5", "SHA-1"],
    correct: 1,
  },
  {
    question: "What is phishing?",
    options: [
      "A type of firewall",
      "A social engineering attack",
      "A password manager",
      "A secure network protocol",
    ],
    correct: 1,
  },
  {
    question: "Which system detects malicious traffic in real time?",
    options: ["VPN", "IDS/IPS", "SSL", "DNS"],
    correct: 1,
  },
  {
    question: "What does AES-256 protect?",
    options: [
      "Network routing",
      "Database schema",
      "Data confidentiality",
      "User interface design",
    ],
    correct: 2,
  },
  {
    question: "What is a zero-day vulnerability?",
    options: [
      "A vulnerability known for zero days",
      "A vulnerability with no known fix",
      "A vulnerability that takes zero days to exploit",
      "A vulnerability in day-zero patches",
    ],
    correct: 1,
  },
  {
    question: "Which of these is NOT a type of malware?",
    options: ["Virus", "Trojan", "Firewall", "Worm"],
    correct: 2,
  },
  {
    question: "What does MFA stand for?",
    options: [
      "Multi-Factor Authentication",
      "Main Firewall Access",
      "Malware Free Application",
      "Managed File Archive",
    ],
    correct: 0,
  },
  {
    question: "What is the primary purpose of a VPN?",
    options: [
      "To speed up internet connection",
      "To encrypt internet traffic",
      "To block ads",
      "To manage passwords",
    ],
    correct: 1,
  },
  {
    question: "Which protocol is used for secure web browsing?",
    options: ["HTTP", "FTP", "HTTPS", "SMTP"],
    correct: 2,
  },
];
