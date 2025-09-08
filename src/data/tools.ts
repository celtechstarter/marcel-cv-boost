// Tool data for the tools page
export interface Tool {
  name: string;
  description: string;
  url: string;
  logoPath: string;
  altText: string;
}

export const tools: Tool[] = [
  {
    name: "ChatGPT Pro",
    description: "Optimierte Formulierungen, präzise Bullet-Points und ATS-freundliche Optimierung für deinen Lebenslauf und deine Bewerbungsunterlagen.",
    url: "https://chatgpt.com/",
    logoPath: "/public/tools/chatgpt.webp",
    altText: "ChatGPT Pro Logo - KI-Tool für Bewerbungsoptimierung"
  },
  {
    name: "Perplexity Pro", 
    description: "Umfassende Jobrecherche und Analyse offener Stellen. Strukturierte Ergebnisse fließen direkt in Google Sheets für optimales Bewerbungsmanagement.",
    url: "https://www.perplexity.ai/",
    logoPath: "/public/tools/perplexity.webp",
    altText: "Perplexity Pro Logo - KI-Recherche für Jobsuche"
  },
  {
    name: "Canva",
    description: "Modernes, professionelles Bewerbungsdesign mit konsistenter Typografie. Erstelle ansprechende Lebensläufe, die auch optisch überzeugen.",
    url: "https://www.canva.com/",
    logoPath: "/public/tools/canva.webp", 
    altText: "Canva Logo - Design-Tool für Bewerbungsunterlagen"
  },
  {
    name: "Google Sheets",
    description: "Professioneller Bewerbungstracker: Dokumentiere, wann und wo du dich beworben hast, verfolge Firmenstatus und plane Follow-ups strategisch.",
    url: "https://sheets.google.com/",
    logoPath: "/public/tools/google-sheets.webp",
    altText: "Google Sheets Logo - Bewerbungstracker und -management"
  }
];