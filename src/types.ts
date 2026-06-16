export enum MatchStatus {
  LIVE = "LIVE",
  UPCOMING = "UPCOMING",
  FINISHED = "FINISHED"
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "VAR";
  player: string;
  detail: string; // e.g. "Assist by Bruno Fernandes", "Foul on Saka", "OffSide Overturned"
  team: "home" | "away";
}

export interface Player {
  number: number;
  name: string;
  position: "GK" | "DEF" | "MID" | "ATT";
  rating?: number;
}

export interface MatchLineup {
  formation: string;
  startingXI: Player[];
  substitutes: Player[];
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  xG: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  saves: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
}

export interface CommentaryItem {
  minute: number;
  text: string;
  type: "GOAL" | "CARD" | "VAR" | "INFO" | "SUB";
}

export interface FanPoll {
  matchId: string;
  homeVotes: number;
  drawVotes: number;
  awayVotes: number;
  userVoted?: "home" | "draw" | "away";
}

export interface Match {
  id: string;
  league: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  minute?: number;
  date: string;
  time: string;
  venue: string;
  streamUrl?: string;
  playbackId?: string; // Mux style
  streamProvider: "MUX" | "CLOUDFLARE" | "HLS" | "YOUTUBE";
  highlightsUrl?: string;
  events: MatchEvent[];
  stats: MatchStats;
  lineups: {
    home: MatchLineup;
    away: MatchLineup;
  };
  commentary: CommentaryItem[];
  prediction?: string; // AI Prediction summary
}

export interface GroupStandingTeam {
  position: number;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface WorldCupGroup {
  groupName: string; // "Group A" - "Group H"
  teams: GroupStandingTeam[];
}

export interface BracketNode {
  id: string; // e.g., "R16-1", "QF-1", "SF-1", "F"
  round: "Round of 16" | "Quarter-Finals" | "Semi-Finals" | "Final";
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number;
  awayScore?: number;
  winnerId?: string;
  date: string;
  time: string;
  nextMatchId?: string; // Next match this winner advances to
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  summary?: string; // AI generated
  category: "Transfers" | "Match Reports" | "World Cup" | "Premier League" | "Champions League" | "AFCON" | "General";
  image: string;
  date: string;
  source: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "Guest" | "Registered User" | "Premium User" | "Moderator" | "Administrator";
  subscriptionPlan: "Free" | "Premium" | "VIP";
  stripeCustomerId?: string;
  cardLast4?: string;
  renewalDate?: string;
}

export interface ApiConfiguration {
  apiFootballKey: string;
  sportMonksKey: string;
  muxKey: string;
  cloudflareStreamKey: string;
  newsApiKey: string;
  googleAnalyticsId: string;
  firebaseKey: string;
}

export interface BettingAffiliate {
  id: string;
  name: string;
  logo: string;
  bannerUrl: string;
  targetUrl: string;
  promoCode: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
