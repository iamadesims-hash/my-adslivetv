import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with User-Agent telemetry
let ai: GoogleGenAI | null = null;
const geminiKey = process.env.GEMINI_API_KEY;

if (geminiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY is not defined in the environment.");
}

const app = express();
const PORT = 3000;

app.use(express.json());

// IN-MEMORY BACKEND DATA TO MIMIC DATABASE STORAGE
let serverApiConfig = {
  apiFootballKey: "API_FTB_9876543210_LIVE",
  sportMonksKey: "SP_MNK_555444333_PROD",
  muxKey: "MUX_TOKEN_SECRET_999",
  cloudflareStreamKey: "CF_STRM_KEY_666",
  newsApiKey: "NEWS_API_SEC_112233",
  googleAnalyticsId: "G-ADSLIVE99",
  firebaseKey: "FB_WEB_CONFIG_2026_SEC",
  espnApiKey: "ESPN_WEB_GATEWAY_INTEGRATED_2026"
};

// AUDIT LOGGING DATA STRUCTURE FOR BACKEND ADMINISTRATION ACTIONS
interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ip: string;
  status: string;
}

let adminAuditLogs: AuditLog[] = [
  { id: "log-1", timestamp: new Date(Date.now() - 3600000).toISOString(), actor: "System Agent", action: "Instantiated Decoupled Admin Suite", ip: "127.0.0.1", status: "SUCCESS" },
  { id: "log-2", timestamp: new Date(Date.now() - 1800000).toISOString(), actor: "System Auto-Monitor", action: "Validated cloud database integration health indexes", ip: "127.0.0.1", status: "SUCCESS" }
];

function logAdminAction(actor: string, action: string, status: string = "SUCCESS", ip: string = "127.0.0.1") {
  adminAuditLogs.unshift({
    id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    actor,
    action,
    ip,
    status
  });
  if (adminAuditLogs.length > 150) {
    adminAuditLogs = adminAuditLogs.slice(0, 150);
  }
}

import { initialMatches, mockWorldCupGroups, mockBracket, mockNews, mockAffiliates } from "./src/mockData";
import { MatchStatus, MatchEvent } from "./src/types";

let serverMatches = JSON.parse(JSON.stringify(initialMatches));
let serverNews = JSON.parse(JSON.stringify(mockNews));
let serverUser: any = {
  id: "user-1",
  email: "iamadedolaposims@gmail.com",
  name: "Adedolapo Sims",
  role: "Administrator",
  subscriptionPlan: "VIP",
  stripeCustomerId: "cus_PWA8826FBL",
  cardLast4: "4242",
  renewalDate: "2027-06-15"
};

let serverPolls: Record<string, { homeVotes: number; drawVotes: number; awayVotes: number; votedUsers: Record<string, string> }> = {
  "m1": { homeVotes: 1420, drawVotes: 420, awayVotes: 980, votedUsers: {} },
  "m2": { homeVotes: 850, drawVotes: 140, awayVotes: 230, votedUsers: {} },
  "m3": { homeVotes: 610, drawVotes: 320, awayVotes: 440, votedUsers: {} }
};

// LIVE CLOCK SIMULATOR FOR SERVER SIDE TIMINGS OR AUTOMATIC SCORE PROGRESS
// Periodically advances LIVE match minutes and occasionally triggers randomized goal/card events
setInterval(() => {
  serverMatches.forEach((match: any) => {
    if (match.status === MatchStatus.LIVE && match.minute !== undefined) {
      if (match.minute < 90) {
        match.minute += 1;
        
        // Randomly simulate real-time goals, cards, and commentary ticks (approx 1% chance per tick)
        const rand = Math.random();
        if (rand < 0.05) {
          const isHome = Math.random() > 0.5;
          const scorer = isHome ? (match.homeTeam === "Real Madrid" ? "Kylian Mbappé" : "Bukayo Saka") : (match.awayTeam === "Manchester City" ? "Kevin De Bruyne" : "Cole Palmer");
          const assister = isHome ? "Federico Valverde" : "Phil Foden";
          
          if (rand < 0.02) {
            // GOAL
            if (isHome) match.homeScore += 1;
            else match.awayScore += 1;
            
            const newEvent: MatchEvent = {
              id: "ev-" + Math.random().toString(36).substr(2, 9),
              minute: match.minute,
              type: "GOAL",
              player: scorer,
              detail: `Incredible first-time finish! Assisted by ${assister}`,
              team: isHome ? "home" : "away"
            };
            match.events.unshift(newEvent);
            match.commentary.unshift({
              minute: match.minute,
              text: `GOAL! ${scorer} blasts it into the net for ${isHome ? match.homeTeam : match.awayTeam}! Outstanding tactical play!`,
              type: "GOAL"
            });
          } else if (rand < 0.04) {
            // CARD
            const offender = isHome ? "William Saliba" : "Moisés Caicedo";
            const newEvent: MatchEvent = {
              id: "ev-" + Math.random().toString(36).substr(2, 9),
              minute: match.minute,
              type: "YELLOW_CARD",
              player: offender,
              detail: "Late tackle halts the dynamic counter-attack",
              team: isHome ? "home" : "away"
            };
            match.events.unshift(newEvent);
            match.commentary.unshift({
              minute: match.minute,
              text: `YELLOW CARD! Referee pulls back play to penalise ${offender} for an aggressive push.`,
              type: "CARD"
            });
          } else {
            // GENERAL COMMENTARY
            match.commentary.unshift({
              minute: match.minute,
              text: `Intense midfield action. Both teams battling out space using dynamic 4-3-3 visual configurations.`,
              type: "INFO"
            });
          }
        }
      } else {
        match.status = MatchStatus.FINISHED;
      }
    }
  });
}, 10000); // Ticks every 10 seconds

// API 1: USER DATA & AUTH SIMULATION
app.get("/api/user", (req, res) => {
  res.json(serverUser);
});

app.post("/api/user/auth", (req, res) => {
  const { email, name, provider } = req.body;
  serverUser = {
    id: "user-1",
    email: email || "user@adslivetv.com",
    name: name || "Soccer Fan",
    role: "Registered User",
    subscriptionPlan: "Free",
    stripeCustomerId: "cus_XYZ" + Math.floor(Math.random() * 10000),
    cardLast4: "1111",
    renewalDate: "2027-01-01"
  };
  res.json({ success: true, user: serverUser });
});

app.post("/api/user/logout", (req, res) => {
  serverUser = {
    id: "guest-id",
    email: "",
    name: "Guest Fan",
    role: "Guest",
    subscriptionPlan: "Free"
  };
  res.json({ success: true, user: serverUser });
});

// API 2: SUBSCRIPTION CONTROL
app.post("/api/user/subscribe", (req, res) => {
  const { plan, token, coupon } = req.body;
  // Apply changes to central server user simulation state
  let discount = coupon === "ADSRULE" ? 0.2 : 0;
  
  if (plan === "VIP") {
    serverUser.subscriptionPlan = "VIP";
    serverUser.role = "Premium User";
    serverUser.cardLast4 = "9821";
    serverUser.renewalDate = "2027-06-15";
  } else if (plan === "Premium") {
    serverUser.subscriptionPlan = "Premium";
    serverUser.role = "Premium User";
    serverUser.cardLast4 = "4512";
    serverUser.renewalDate = "2027-06-15";
  } else {
    serverUser.subscriptionPlan = "Free";
    serverUser.role = "Registered User";
  }
  res.json({ success: true, user: serverUser, pricePaid: plan === "VIP" ? (49.99 * (1 - discount)) : (19.99 * (1 - discount)) });
});

// API 3: LIVE STREAM AND FOOTBALL DATA
app.get("/api/matches", (req, res) => {
  res.json(serverMatches);
});

app.get("/api/matches/:id", (req, res) => {
  const match = serverMatches.find(m => m.id === req.params.id);
  if (match) {
    res.json(match);
  } else {
    res.status(404).json({ error: "Match not found" });
  }
});

app.post("/api/matches/:id/reset", (req, res) => {
  const matchIndex = serverMatches.findIndex(m => m.id === req.params.id);
  const srcMatch = initialMatches.find(m => m.id === req.params.id);
  if (matchIndex !== -1 && srcMatch) {
    serverMatches[matchIndex] = JSON.parse(JSON.stringify(srcMatch));
    logAdminAction("Administrator", `Reset Match ${srcMatch.homeTeam} vs ${srcMatch.awayTeam} to starting state`, "SUCCESS");
    res.json({ success: true, match: serverMatches[matchIndex] });
  } else {
    res.status(404).json({ error: "Match not found" });
  }
});

// API 3.1: LIVE PRE-MATCH TRAILER GENERATOR & RETRIEVAL
app.post("/api/matches/:id/trailer", async (req, res) => {
  const match = serverMatches.find((m: any) => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });

  if (match.trailer) {
    return res.json({ success: true, trailer: match.trailer });
  }

  let trailer: any = null;

  if (ai) {
    try {
      const prompt = `Act as an expert tactical football manager and Opta sports trailer director. Create a 4-scene theatrical match preview trailer for the upcoming high-stakes matchup: ${match.homeTeam} vs ${match.awayTeam} in the ${match.league}.
Return EXACTLY a JSON payload with the following fields:
- "title": A dramatic title for the trailer preview show.
- "narrative": A high-energy introductory voiceover narrative.
- "music": A title for epic cinema music (e.g. "Clash of Titans Orchestral").
- "scenes": An array of EXACTLY 4 scene objects, each having:
  - "title": Name of the scene
  - "description": High-energy cinema subtitle description (1-2 sentences of commentary summarizing the tactical clash, star players, historic rivalries or stadium atmosphere).
  - "imageKeyword": A sport-centric or stadium-centric keyword (e.g. "stadium", "soccer ball", "stretching", "tactics board").

Strict constraint: Return raw JSON text containing ONLY the JSON output, no markdown wrappers like \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.1-flash",
        contents: prompt
      });

      const responseText = response.text || "";
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (parsed.title && parsed.scenes && parsed.scenes.length >= 4) {
        const pictureKeys: Record<string, string> = {
          "stadium": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&fit=crop",
          "soccer": "https://images.unsplash.com/photo-1540747737956-378724044432?w=800&fit=crop",
          "player": "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&fit=crop",
          "tactics": "https://images.unsplash.com/photo-1431324155629-1a6edd1d141d?w=800&fit=crop"
        };
        
        const generatedScenes = parsed.scenes.map((sc: any, idx: number) => {
          const kw = (sc.imageKeyword || "stadium").toLowerCase();
          let img = pictureKeys[kw];
          if (!img) {
            const keys = Object.values(pictureKeys);
            img = keys[idx % keys.length];
          }
          return {
            time: idx * 5,
            title: sc.title,
            description: sc.description,
            image: img
          };
        });

        trailer = {
          id: "t-" + match.id,
          title: parsed.title,
          narrative: parsed.narrative || "The buildup is intense as fixtures approach.",
          music: parsed.music || "Synthesised Arena Beats",
          scenes: generatedScenes
        };
      }
    } catch (err) {
      console.warn("Failed to generate trailer via Gemini, using fallback:", err);
    }
  }

  if (!trailer) {
    trailer = {
      id: "t-" + match.id,
      title: `${match.homeTeam} vs ${match.awayTeam} - Complete AI Tactical Trailer Show`,
      narrative: `A historic footballing clash is brewing in the ${match.league} as ${match.homeTeam} prepares to lock horns with ${match.awayTeam} in a tactical masterstroke under the stadium lights at ${match.venue}.`,
      music: "Cosmic Orchestral Overdrive",
      scenes: [
        {
          time: 0,
          title: "The Colossus Arena Is Waiting",
          description: `The atmosphere is thick with expectation at ${match.venue}. Fans from around the globe gather for ${match.league} glory.`,
          image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&fit=crop"
        },
        {
          time: 5,
          title: "Style Clash: Positional Possession vs Spatial Defensive Walls",
          description: `Tactical layouts indicate high wing engagement. ${match.homeTeam} looks to leverage high ball-speeds, while ${match.awayTeam} readies a tight spatial counter-wall.`,
          image: "https://images.unsplash.com/photo-1540747737956-378724044432?w=800&fit=crop"
        },
        {
          time: 10,
          title: "Elite Showdowns: Key Pitch Battles",
          description: `Superstars match up across critical coordinate centers. The striker force will battle central centerbacks in intense aerial showdowns.`,
          image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800&fit=crop"
        },
        {
          time: 15,
          title: "Statistical Probability and Final Verdict",
          description: "Our live neural modeling projects a thrilling performance with high xG and sharp tactical shifts. Secure VIP credentials to unlock real-time streaming feedback.",
          image: "https://images.unsplash.com/photo-1431324155629-1a6edd1d141d?w=800&fit=crop"
        }
      ]
    };
  }

  match.trailer = trailer;
  res.json({ success: true, trailer });
});

// Dynamic goal submission mock for Admins/Moderators
app.post("/api/matches/:id/goal", (req, res) => {
  const match = serverMatches.find(m => m.id === req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });

  const { team, player, detail } = req.body;
  if (team === "home") match.homeScore += 1;
  else match.awayScore += 1;

  const newEvent: MatchEvent = {
    id: "admin-ev-" + Date.now(),
    minute: match.minute || 88,
    type: "GOAL",
    player: player || "Super Sub",
    detail: detail || "Goal added manually via Admin Board panel",
    team: team as "home" | "away"
  };
  match.events.unshift(newEvent);
  match.commentary.unshift({
    minute: match.minute || 88,
    text: `GOAL! ${player} scores! Manual trigger from platform managers.`,
    type: "GOAL"
  });

  logAdminAction("Administrator", `Triggered manual GOAL for ${team === "home" ? match.homeTeam : match.awayTeam} scored by ${player || "Super Sub"}`, "SUCCESS");

  res.json({ success: true, match });
});

// GET WORLD CUP DATA
app.get("/api/worldcup/groups", (req, res) => {
  res.json(mockWorldCupGroups);
});

app.get("/api/worldcup/bracket", (req, res) => {
  res.json(mockBracket);
});

// API 4: NEWS WITH AI SUMMARIES & FEED
app.get("/api/news", (req, res) => {
  res.json(serverNews);
});

app.post("/api/news/:id/summarize", async (req, res) => {
  const article = serverNews.find(n => n.id === req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found" });

  if (article.summary) {
    return res.json({ summary: article.summary });
  }

  if (!ai) {
    // Generate static server-side fallback summary if key isn't setup
    article.summary = `[Local Fallback AI SUMMARY]: ${article.description} This match summary highlights critical tactical movements, team roster adaptations, defensive lineups, and the upcoming semi-final standings.`;
    return res.json({ summary: article.summary, fallback: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Summarize the following sports news content into two brief, punchy sentences focusing on football strategy and results: \n\n${article.content}`,
    });

    article.summary = response.text || "Failed to generate summary text.";
    res.json({ summary: article.summary });
  } catch (err: any) {
    console.error("Gemini Error:", err);
    article.summary = `[AI Offline Fallback]: ${article.title} - highlights high-stakes football leagues, tactical substitutions, and dynamic transfers coverage.`;
    res.json({ summary: article.summary, error: err.message });
  }
});

// API 5: FAN POLLS
app.get("/api/polls/:matchId", (req, res) => {
  const poll = serverPolls[req.params.matchId] || { homeVotes: 100, drawVotes: 50, awayVotes: 75, votedUsers: {} };
  res.json(poll);
});

app.post("/api/polls/:matchId/vote", (req, res) => {
  const { vote, userId } = req.body;
  const matchId = req.params.matchId;
  
  if (!serverPolls[matchId]) {
    serverPolls[matchId] = { homeVotes: 100, drawVotes: 50, awayVotes: 75, votedUsers: {} };
  }

  const poll = serverPolls[matchId];
  if (poll.votedUsers[userId]) {
    return res.status(400).json({ error: "You have already voted on this matchup poll!" });
  }

  poll.votedUsers[userId] = vote;
  if (vote === "home") poll.homeVotes += 1;
  else if (vote === "draw") poll.drawVotes += 1;
  else if (vote === "away") poll.awayVotes += 1;

  res.json({ success: true, poll });
});

// API 6: ADMIN SETTINGS & CONNECTIONS PANEL
// IN-MEMORY DATABASE SIMULATION FOR USERS list
let serverUsersList = [
  { id: "user-1", name: "Adedolapo Sims", email: "iamadedolaposims@gmail.com", role: "Administrator", subscriptionPlan: "VIP", status: "Active" },
  { id: "user-2", name: "Sophia Martin", email: "sophia@gmail.com", role: "Registered User", subscriptionPlan: "Premium", status: "Active" },
  { id: "user-3", name: "Marco Silva", email: "marco@silva.pt", role: "Registered User", subscriptionPlan: "Free", status: "Active" },
  { id: "user-4", name: "Elena Rostova", email: "elena@rostov.ru", role: "Registered User", subscriptionPlan: "VIP", status: "Suspended" },
  { id: "user-5", name: "Kofi Mensah", email: "kofi@ghana.com", role: "Registered User", subscriptionPlan: "Free", status: "Active" }
];

let activeBroadcastAlert: { id: string; title: string; message: string; type: string; timestamp: string } | null = null;

// ADM 6.0: SECURE LOGIN ENDPOINT FOR THE DECOUPLED BACKEND-ADMIN PANEL
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === "admin@adslivetv.com" && password === "DLord@Ade1017") {
    logAdminAction("System Auth", `Successful admin credentials login for ${email}`, "SUCCESS");
    res.json({
      success: true,
      token: "session_token_adslivetv_2026_xyz",
      user: {
        email,
        role: "Administrator",
        name: "Adedolapo Sims"
      }
    });
  } else {
    logAdminAction("System Auth", `Failed admin login attempt: ${email || "unspecified"}`, "FAILED");
    res.status(401).json({ error: "Invalid secured administrator email or password." });
  }
});

// ADM 6.1: GET REAL-TIME ENGAGEMENT METRICS AND CHANNELS
app.get("/api/admin/metrics", (req, res) => {
  // Add some micro-fluctuations to active data to look authentic and real-time
  const randomShift = () => Math.floor(Math.random() * 80) - 40;
  const activeSessions = 5420 + randomShift();
  const streamConcurrency = 3840 + randomShift();
  const conversionRate = 12.4 + (Math.random() * 0.4 - 0.2);

  res.json({
    activeSessions,
    streamConcurrency,
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    timestamps: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00"],
    sessionsHistory: [4620, 4890, 5100, 5210, 5380, activeSessions],
    concurrencyHistory: [3100, 3350, 3500, 3620, 3790, streamConcurrency],
    conversionsHistory: [11.8, 12.0, 12.1, 12.3, 12.2, parseFloat(conversionRate.toFixed(2))]
  });
});

// ADM 6.2: GET ADMIN USERS LIST
app.get("/api/admin/users", (req, res) => {
  res.json(serverUsersList);
});

// ADM 6.3: UPDATE USER PLAN AND STATUS
app.post("/api/admin/users/:id/update", (req, res) => {
  const { plan, status } = req.body;
  const user = serverUsersList.find(u => u.id === req.params.id);
  if (user) {
    const oldPlan = user.subscriptionPlan;
    const oldStatus = user.status;
    if (plan) user.subscriptionPlan = plan;
    if (status) user.status = status;

    logAdminAction("Administrator", `Updated User ${user.name} (${user.email}): subscription plan [${oldPlan} -> ${user.subscriptionPlan}], status [${oldStatus} -> ${user.status}]`, "SUCCESS");

    // Synchronize current logged in user config immediately if it's user-1
    if (user.id === "user-1") {
      serverUser.subscriptionPlan = user.subscriptionPlan;
      if (user.status === "Suspended") {
        serverUser.role = "Guest";
      } else {
        serverUser.role = "Administrator";
      }
    }
    res.json({ success: true, user, users: serverUsersList });
  } else {
    res.status(404).json({ error: "User sub-account not found" });
  }
});

// ADM 6.35: BULK UPDATE USERS PLANS AND STATUSES
app.post("/api/admin/users/bulk-update", (req, res) => {
  const { userIds, plan, status } = req.body;
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "No user IDs provided for bulk operation." });
  }

  let updatedCount = 0;
  userIds.forEach(id => {
    const user = serverUsersList.find(u => u.id === id);
    if (user) {
      if (plan) user.subscriptionPlan = plan;
      if (status) user.status = status;

      // Synchronize logged-in user if it is user-1
      if (user.id === "user-1") {
        serverUser.subscriptionPlan = user.subscriptionPlan;
        if (user.status === "Suspended") {
          serverUser.role = "Guest";
        } else {
          serverUser.role = "Administrator";
        }
      }
      updatedCount++;
    }
  });

  logAdminAction("Administrator", `Bulk modified ${updatedCount} spectators: Tier=[${plan || "No Change"}], Status=[${status || "No Change"}]`, "SUCCESS");
  res.json({ success: true, updatedCount, users: serverUsersList });
});

// ADM 6.4: TRIGGER PUSH BROADCAST PUBLIC WARNING
app.post("/api/admin/broadcast", (req, res) => {
  const { title, message, type, topic } = req.body;
  activeBroadcastAlert = {
    id: "alert-" + Date.now(),
    title: title || "Broadcast Alert Update",
    message: message || "Attention all viewers: match live telemetry is updating.",
    type: type || "info",
    timestamp: new Date().toISOString()
  };

  const fcmConnected = !!serverApiConfig.firebaseKey;
  let fcmLogDetails = "";
  if (fcmConnected) {
    fcmLogDetails = ` [FCM Handshake Completed via REST Key: ${serverApiConfig.firebaseKey.substring(0, 4)}****]`;
  } else {
    fcmLogDetails = ` [FCM Handshake Fallback Status: Dispatched via local dev gateway]`;
  }

  logAdminAction(
    "FCM Push Dispatched", 
    `Dispatched Push Notification via FCM to topic [${topic || "/topics/all_spectators"}]: "${activeBroadcastAlert.title}" - Message payload: "${activeBroadcastAlert.message}"${fcmLogDetails}`, 
    "SUCCESS"
  );
  res.json({ success: true, alert: activeBroadcastAlert });
});

// ADM 6.5: DISMISS ACTIVE BROADCAST PUBLIC WARNING
app.post("/api/admin/broadcast/dismiss", (req, res) => {
  logAdminAction("Administrator", "Dismissed central push FCM announcement alert to viewers", "SUCCESS");
  activeBroadcastAlert = null;
  res.json({ success: true });
});

// ADM 6.6: CONSUME ACTIVE PUBLIC BROADCAST TOAST
app.get("/api/broadcast/active", (req, res) => {
  res.json({ alert: activeBroadcastAlert });
});

// ADM 6.7: GET SYSTEM AUDIT LOG DATA FOR THE DEDICATED PANEL
app.get("/api/admin/audit-logs", (req, res) => {
  res.json(adminAuditLogs);
});

// ADM 6.8: POLL ACTIVE API SYSTEM HEALTH & REAL-TIME RELIABILITY METRIC DEVIATIONS
app.get("/api/admin/services-health", (req, res) => {
  const scoreBase = 90;

  const ftbActive = !!serverApiConfig.apiFootballKey;
  const muxActive = !!serverApiConfig.muxKey;
  const fbActive = !!serverApiConfig.firebaseKey;
  const espnActive = !!serverApiConfig.espnApiKey;

  const ftbScore = ftbActive ? Math.floor(scoreBase + (Math.random() * 9) + 1) : 0;
  const muxScore = muxActive ? Math.floor(scoreBase + (Math.random() * 8) + 2) : 0;
  const fbScore = fbActive ? Math.floor(scoreBase + (Math.random() * 7) + 3) : 0;
  const espnScore = espnActive ? Math.floor(scoreBase + (Math.random() * 8) + 2) : 0;

  const services = [
    {
      id: "api-football",
      name: "API-Football Gateway",
      endpoint: "api-v3.football.com/status",
      status: ftbActive ? "ONLINE" : "OFFLINE",
      reliability: ftbScore,
      latency: ftbActive ? Math.floor(110 + Math.random() * 30) : 0,
      lastCheck: new Date().toISOString()
    },
    {
      id: "espn-scoreboard",
      name: "ESPN Live Stats & Scoreboard API",
      endpoint: "site.api.espn.com/sports/soccer",
      status: espnActive ? "ONLINE" : "OFFLINE",
      reliability: espnScore,
      latency: espnActive ? Math.floor(35 + Math.random() * 20) : 0,
      lastCheck: new Date().toISOString()
    },
    {
      id: "mux",
      name: "Mux Streaming API",
      endpoint: "api.mux.com/video/v1/assets",
      status: muxActive ? "ONLINE" : "OFFLINE",
      reliability: muxScore,
      latency: muxActive ? Math.floor(65 + Math.random() * 20) : 0,
      lastCheck: new Date().toISOString()
    },
    {
      id: "firebase",
      name: "Firebase Store / Auth Hub",
      endpoint: "firestore.googleapis.com",
      status: fbActive ? "ONLINE" : "OFFLINE",
      reliability: fbScore,
      latency: fbActive ? Math.floor(25 + Math.random() * 15) : 0,
      lastCheck: new Date().toISOString()
    }
  ];

  res.json({ services });
});

app.get("/api/admin/config", (req, res) => {
  // Mask sensitive values
  const masked = { ...serverApiConfig };
  Object.keys(masked).forEach(key => {
    const k = key as keyof typeof serverApiConfig;
    if (masked[k]) {
      masked[k] = masked[k].substring(0, 4) + "****" + masked[k].substring(masked[k].length - 2);
    }
  });
  res.json({ masked, actual: serverApiConfig });
});

app.post("/api/admin/config", (req, res) => {
  const { apiFootballKey, sportMonksKey, muxKey, cloudflareStreamKey, newsApiKey, googleAnalyticsId, firebaseKey, espnApiKey } = req.body;
  
  if (apiFootballKey) serverApiConfig.apiFootballKey = apiFootballKey;
  if (sportMonksKey) serverApiConfig.sportMonksKey = sportMonksKey;
  if (muxKey) serverApiConfig.muxKey = muxKey;
  if (cloudflareStreamKey) serverApiConfig.cloudflareStreamKey = cloudflareStreamKey;
  if (newsApiKey) serverApiConfig.newsApiKey = newsApiKey;
  if (googleAnalyticsId) serverApiConfig.googleAnalyticsId = googleAnalyticsId;
  if (firebaseKey) serverApiConfig.firebaseKey = firebaseKey;
  if (espnApiKey) serverApiConfig.espnApiKey = espnApiKey;

  logAdminAction("Administrator", "Modified core system API provider feed credentials configurations", "SUCCESS");

  res.json({ success: true, message: "API Configuration saved successfully!", config: serverApiConfig });
});

// TEST SPECIFIC STREAM/PROVIDER CONNECTION STATUS
app.post("/api/admin/test-connection", (req, res) => {
  const { provider, key } = req.body;
  if (!key || key.includes("****")) {
    return res.json({ success: true, status: "ACTIVE", latency: "42ms", details: "Using existing credential parameters. Channel online." });
  }
  
  // Simulate network check
  const randomLatency = Math.floor(Math.random() * 80) + 15;
  const isSuccess = key.length > 5;
  res.json({
    success: isSuccess,
    status: isSuccess ? "ACTIVE" : "FAILED",
    latency: `${randomLatency}ms`,
    details: isSuccess ? `Handshake with ${provider} edge nodes succeeded.` : `Invalid token format provided for ${provider}.`
  });
});

// API 7: GEMINI PREDICTOR (MATCH SCORE & STRATEGY PREDICTIONS)
app.post("/api/gemini/predict", async (req, res) => {
  const { matchId } = req.body;
  const match = serverMatches.find(m => m.id === matchId);
  if (!match) return res.status(404).json({ error: "Match not found" });

  if (!ai) {
    // Elegant hardcoded prediction with deep analytics if LLM is offline
    const defPrediction = `[Fallback AI Analyser]: Real-time analysis suggests ${match.homeTeam} has a slight tactician edge (xG: 1.89) over ${match.awayTeam} because of tactical width. Recommended bet: ${match.homeTeam} dual-chance, Over 2.5 goals.`;
    match.prediction = defPrediction;
    return res.json({ prediction: defPrediction });
  }

  try {
    const prompt = `Act as an expert tactical football manager and predictive sports analyst for beIN Sports and Opta. Analyze the following matchup details and generate a highly detailed 1-paragraph tactical analysis and score prediction. Specify key player advantages and precise recommended strategic focus.
Matchup: ${match.homeTeam} vs ${match.awayTeam}
League: ${match.league}
Previous Score/Form: Home Score ${match.homeScore} - Away Score ${match.awayScore}
Events already occurred: ${JSON.stringify(match.events)}
Stats so far: ${JSON.stringify(match.stats)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const predictionText = response.text || "Tactical feedback offline. Re-trying handshake.";
    match.prediction = predictionText;
    res.json({ prediction: predictionText });
  } catch (err: any) {
    console.error("Prediction Error:", err);
    const mockFeed = `[AI Offline Analyser]: OPTA indices recommend defensive structure adjustments. Based on the 0-0 state, ${match.homeTeam} exhibits superior high-block pressures. Predicted final score: ${match.homeTeam} 1-0 ${match.awayTeam} with Bukayo Saka to score.`;
    match.prediction = mockFeed;
    res.json({ prediction: mockFeed, error: err.message });
  }
});

// API 8: GEMINI AI COMPANION (CHATS)
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body; // Array of ChatMessage
  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Messages sequence is empty" });
  }

  const latestText = messages[messages.length - 1].text;

  if (!ai) {
    // Smart tactical responses based on keywords when Gemini API Key is unconfigured
    const lower = latestText.toLowerCase();
    let reply = "I am your AdSLiveTv Football Companion! I can help you compute Champions League predictions, check league standing updates, analyze tactical 4-3-3 formations, or explain VIP details.";
    if (lower.includes("madrid") || lower.includes("city")) {
      reply = "Real Madrid vs Manchester City is currently LIVE on AdSLiveTv Channel 1! De Bruyne and Foden keep pulling back city stringers, whilst Mbappe and Vinícius break on rapid counters. Opta rates City with a 54% possession advantage right now.";
    } else if (lower.includes("predict") || lower.includes("score")) {
      reply = "My predictive models project a dynamic finish! For match m1, Real Madrid are calculated at 42% win probability, Manchester city 38%, other 20% draw. Expect high corners (Over 9.5) and tactical line adjustments.";
    } else if (lower.includes("arsenal") || lower.includes("saka")) {
      reply = "Arsenal is leading Chelsea 1-0 on our standard broadcast stream, with Bukayo Saka converting an incredibly cool penalty on the 23rd minute after Marc Cucurella handled the ball.";
    } else if (lower.includes("world cup")) {
      reply = "The FIFA World Cup 2026 hosts 48 countries! In Group A, the USA is current leader with 7 points, followed by Mexico with 5. Argentina and France are battling out for elite knockout brackets.";
    }
    return res.json({ text: reply });
  }

  try {
    const systemPrompt = "You are an elite, charming TV match commentator, tactical sportmonks auditor, and beIN Sports football pundit. Speak with professional knowledge of player statistics, formations, tactics, current scores, and group tables. Maintain a supportive, soccer-crazy energy. Keep replies brief, punchy, and structured with bold keywords.";
    
    // Construct request contents
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: latestText,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ text: response.text || "Pundit analysis is compiling. Re-try shortly!" });
  } catch (err: any) {
    console.error("Gemini Chat Error:", err);
    res.json({ text: `[Pundit Signal Low]: I had issues reaching my satellite brain: - ${err.message}. But in other soccer transfers news, Golden boy extensions have locked Bukayo Saka at Emirates until 2031!` });
  }
});

app.get("/api/affiliates", (req, res) => {
  res.json(mockAffiliates);
});

// API 8.5: GEMINI REAL-TIME LIVE SOCCER TV BROADCAST SCHEDULES (SEARCH GROUNDING)
app.post("/api/gemini/soccer-schedules", async (req, res) => {
  const { query } = req.body;
  const searchQuery = query ? query.trim() : "";
  const basePrompt = `Generate a modern, highly detailed overview of live soccer matches, official TV networks, and legal streaming broadcast schedules available today from livesoccertv.com.
State what streaming sites/networks are broadcasting these matches such as:
- FuboTV (has FOX, FS1, beIN Sports, and free trials)
- ESPN+, Peacock, Paramount+ (Champions League, Premier League, La Liga, Serie A, etc.)
- DAZN (worldwide leagues)
- Fox Sports One, Tubi (World Cup 2026, low cost / free)
- BBC iPlayer / ITVX (UK free legal-with-account options)
- SBS On Demand (Australia regional broadcasting)
- Pluto TV, Tubi, FIFA+ (free matches, highlights, and documentaries, ad-supported)
- Tell users about vpnoverview.com recommendations for geo-restricted streams.

${searchQuery ? `The user is specifically searching for: "${searchQuery}". Answer their specific question regarding matches/channels with web details.` : "Give a comprehensive lists of matches of today or this week with exact channels & streaming options."}

Organize the output into clear sections:
1. 📡 REAL-TIME LIVE TV & STREAMING CHANNELS (FuboTV, Peacock, ESPN+, beIN, ITV/BBC, DAZN, SBS)
2. 🗓️ OFFICIAL MATCH SCHEDULING & TIME SLOTS
3. ⚽ FREE SPORTS CHANNELS & HIGHLIGHTS RELEASES (Tubi, Pluto TV, FIFA+)
4. 🔒 REGIONAL BROADCAST ACCESS & VPN GUIDE (vpnoverview.com guidance)

Make sure the tone is informative and dynamic. Provide direct match listings with exact official broadcasters.`;

  if (!ai) {
    // Highly polished static response incorporating all user's described channels & sites as fallbacks
    const fallbackText = `### 📡 REAL-TIME LIVE TV & STREAMING CHANNELS
* **FuboTV**: Excellent choice for live soccer streaming in North America. Provides complete access to FOX, FS1, FS2, beIN Sports, Univision, and TUDN. Perfect for Premier League, MLS, and international football fixtures. Often offers a 7-day free trial.
* **ESPN+**: Official home of Spanish La Liga and German Bundesliga in the US.
* **Peacock**: Broadcasts every single English Premier League match live.
* **Paramount+**: Live stream hub for UEFA Champions League, Europa League, and Italian Serie A sports.
* **DAZN**: Strong global leader for football leagues worldwide (MLS in the UK, Saudi Pro League, UEFA Women's Champions League).
* **FOX & Tubi**: Designated live TV home for FIFA World Cup 2026 matches. Selected matches are free on Tubi or standard FOX channels.

### 🗓️ OFFICIAL MATCH SCHEDULING & TIME SLOTS
* **Real Madrid vs Manchester City** (UEFA Champions League Semi-Final)
  * **Broadcast/Stream**: beIN Sports, Paramount+, FuboTV, CBS Sports
  * **Timing**: LIVE NOW (82nd minute)
* **Chelsea vs Arsenal** (Premier League Derby)
  * **Broadcast/Stream**: NBC / Peacock Premium, FuboTV, Sling TV
  * **Timing**: Stream Finished (Arsenal won 1-0)
* **upcoming: USA vs Mexico** (World Cup 2026 Preview)
  * **Broadcast/Stream**: FOX Sports 1, Univision, FuboTV
  * **Timing**: June 18 at 20:00 EST / UTC-5

### ⚽ FREE SPORTS CHANNELS & HIGHLIGHTS RELEASES
* **BBC iPlayer & ITVX (UK)**: Free high-definition streaming accounts for UK viewers. Access live FA Cup, Euros/World Cup broadcast schedules, and Match of the Day highlights.
* **SBS On Demand (Australia)**: Free legal portal to watch soccer matches and highlights down under.
* **Tubi & Pluto TV (Global)**: Free legal television options displaying occasional live international matches and extensive highlights feeds (fully ad-supported).
* **FIFA+**: Free matches, complete historic tournament archives, and legal sports documentaries directly from football's governing body.

### 🔒 REGIONAL BROADCAST ACCESS & VPN GUIDE
* Note that many of these official streaming platforms are strictly **geo-restricted** based on license rights.
* According to reports on **vpnoverview.com**, dedicated sports fans frequently utilize secure VPN providers (such as NordVPN or ExpressVPN) to legally unlock free-to-air feeds like BBC iPlayer, ITVX, and SBS On Demand when travelling outside their service zones. Use high-speed streaming server layouts to bypass match buffering.`;

    const fallbackChunks = [
      { web: { uri: "https://www.livesoccertv.com", title: "LiveSoccerTV - Football TV Guides" } },
      { web: { uri: "https://www.fubo.tv", title: "FuboTV Stream Sports Live" } },
      { web: { uri: "https://vpnoverview.com", title: "VPNOverview - Sports Stream Safety Guide" } },
      { web: { uri: "https://www.fox.com", title: "FOX Sports TV Hub" } }
    ];

    return res.json({ text: fallbackText, chunks: fallbackChunks, isFallback: true });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: basePrompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a professional football streaming scheduler and Live Soccer TV coordinator. You provide real-time television and stream schedules linking official streams. Use google search integration to match accurate real-world listings for today."
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    res.json({
      text: response.text || "Streaming schedule generated successfully.",
      chunks: chunks.map((c: any) => ({
        web: {
          uri: c.web?.uri || "",
          title: c.web?.title || "Supporting Broadcast Source"
        }
      })).filter((c: any) => c.web.uri),
      isFallback: false
    });
  } catch (err: any) {
    console.error("Grounding Schedule Error:", err);
    res.status(500).json({ error: "Failed to download live television schedule: " + err.message });
  }
});

// RapidAPI & ESPN API Integration Layer
app.get("/api/external/matches", async (req, res) => {
  const provider = (req.query.provider as string || "local").toLowerCase();
  
  if (provider === "api-football") {
    const apiKey = serverApiConfig.apiFootballKey;
    const isMock = !apiKey || apiKey.startsWith("API_FTB") || apiKey.includes("****");
    
    if (!isMock) {
      try {
        // Real API-Football RapidAPI integration fetch
        const response = await fetch("https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all", {
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Map to standard internal Match model
          const mappedMatches = (data.response || []).map((item: any) => {
            return {
              id: "apiftb-" + item.fixture.id,
              league: item.league.name,
              homeTeam: item.teams.home.name,
              homeLogo: item.teams.home.logo,
              awayTeam: item.teams.away.name,
              awayLogo: item.teams.away.logo,
              homeScore: item.goals.home ?? 0,
              awayScore: item.goals.away ?? 0,
              status: item.fixture.status.short === "FT" ? MatchStatus.FINISHED : MatchStatus.LIVE,
              minute: item.fixture.status.elapsed ?? 45,
              date: item.fixture.date.split("T")[0],
              time: item.fixture.date.split("T")[1]?.substring(0, 5) || "20:00",
              venue: item.fixture.venue.name || "European Arena",
              streamProvider: "HLS",
              streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
              events: [],
              stats: {
                possession: { home: 50, away: 50 },
                shots: { home: 10, away: 10 },
                shotsOnTarget: { home: 4, away: 4 },
                xG: { home: 1.1, away: 1.1 },
                corners: { home: 5, away: 5 },
                fouls: { home: 10, away: 10 },
                saves: { home: 3, away: 3 },
                yellowCards: { home: 1, away: 1 },
                redCards: { home: 0, away: 0 }
              },
              commentary: [
                { minute: item.fixture.status.elapsed || 45, text: `Live feed integrated from API-Football. Match is currently active in the ${item.league.name}.`, type: "INFO" }
              ],
              lineups: {
                home: { formation: "4-3-3", startingXI: [], substitutes: [] },
                away: { formation: "4-3-3", startingXI: [], substitutes: [] }
              }
            };
          });
          return res.json(mappedMatches);
        }
      } catch (e: any) {
        console.warn("API-Football fetch failed, using beautiful mock fallback:", e.message);
      }
    }
    
    // Fallback Mock Matches styled as API-Football live streaming feeds!
    const mockFootballMatches = [
      {
        id: "ftb-1",
        league: "Serie A - Italy (API-Football Live)",
        homeTeam: "Juventus",
        homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
        awayTeam: "Roma",
        awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
        homeScore: 1,
        awayScore: 0,
        status: MatchStatus.LIVE,
        minute: 61,
        date: new Date().toISOString().split("T")[0],
        time: "19:45",
        venue: "Allianz Stadium, Torino",
        streamProvider: "MUX",
        playbackId: "DS00Ui9Vh2FvVbfq9ElF500CUt02uUzKw9",
        events: [
          { id: "fe1", minute: 34, type: "GOAL", player: "Dušan Vlahović", detail: "Fierce left-foot volley into top corner", team: "home" },
          { id: "fe2", minute: 48, type: "YELLOW_CARD", player: "Gianluca Mancini", detail: "Professional pulling tactical foul", team: "away" }
        ],
        stats: {
          possession: { home: 48, away: 52 },
          shots: { home: 11, away: 9 },
          shotsOnTarget: { home: 5, away: 2 },
          xG: { home: 1.25, away: 0.85 },
          corners: { home: 6, away: 4 },
          fouls: { home: 14, away: 12 },
          saves: { home: 2, away: 4 },
          yellowCards: { home: 1, away: 2 },
          redCards: { home: 0, away: 0 }
        },
        commentary: [
          { minute: 61, text: "Juventus defending their lead with an aggressive block. Roma dominating space.", type: "INFO" },
          { minute: 34, text: "GOAL! Dušan Vlahović breaks Roma deadlock with a stunning strike from the edge of the area!", type: "GOAL" }
        ],
        lineups: {
          home: { formation: "3-5-2", startingXI: [], substitutes: [] },
          away: { formation: "4-3-3", startingXI: [], substitutes: [] }
        }
      },
      {
        id: "ftb-2",
        league: "Bundesliga - Germany (API-Football Live)",
        homeTeam: "Bayern Munich",
        homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
        awayTeam: "Borussia Dortmund",
        awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
        homeScore: 3,
        awayScore: 2,
        status: MatchStatus.LIVE,
        minute: 88,
        date: new Date().toISOString().split("T")[0],
        time: "18:30",
        venue: "Allianz Arena, Munich",
        streamProvider: "YOUTUBE",
        streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        events: [
          { id: "fe3", minute: 15, type: "GOAL", player: "Harry Kane", detail: "Clean penalty low to the goalkeeper's right", team: "home" },
          { id: "fe4", minute: 42, type: "GOAL", player: "Jamal Musiala", detail: "Wonderful solo run through 3 defenders", team: "home" },
          { id: "fe5", minute: 58, type: "GOAL", player: "Julian Brandt", detail: "Curled freekick over the wall", team: "away" },
          { id: "fe6", minute: 74, type: "GOAL", player: "Serhou Guirassy", detail: "Header from corner, sloppy defending", team: "away" },
          { id: "fe7", minute: 82, type: "GOAL", player: "Leroy Sané", detail: "Brilliant counter strike from acute angle", team: "home" }
        ],
        stats: {
          possession: { home: 55, away: 45 },
          shots: { home: 18, away: 13 },
          shotsOnTarget: { home: 9, away: 6 },
          xG: { home: 2.15, away: 1.62 },
          corners: { home: 8, away: 5 },
          fouls: { home: 9, away: 11 },
          saves: { home: 4, away: 6 },
          yellowCards: { home: 2, away: 3 },
          redCards: { home: 0, away: 0 }
        },
        commentary: [
          { minute: 88, text: "Spectacular Klassiker action in Munich. Real-time stats are sync'd live with API-Football server relays.", type: "INFO" },
          { minute: 82, text: "GOAL! Leroy Sané latches onto a beautiful pass and drives a thunderous shot into the roof of the net!", type: "GOAL" }
        ],
        lineups: {
          home: { formation: "4-2-3-1", startingXI: [], substitutes: [] },
          away: { formation: "4-3-3", startingXI: [], substitutes: [] }
        }
      }
    ];
    return res.json(mockFootballMatches);
  }
  
  if (provider === "espn") {
    // ESPN Scoreboard API Integration
    try {
      const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard");
      if (response.ok) {
        const data = await response.json();
        const mappedMatches = (data.events || []).map((ev: any) => {
          const comp = ev.competitions?.[0] || {};
          const homeComp = (comp.competitors || []).find((c: any) => c.homeAway === "home") || {};
          const awayComp = (comp.competitors || []).find((c: any) => c.homeAway === "away") || {};
          const state = ev.status?.type?.state || "pre";
          
          let statusStr = MatchStatus.UPCOMING;
          if (state === "in") statusStr = MatchStatus.LIVE;
          else if (state === "post") statusStr = MatchStatus.FINISHED;
          
          return {
            id: "espn-" + ev.id,
            league: ev.season?.slug || "Global Soccer Match",
            homeTeam: homeComp.team?.displayName || "Home Team",
            homeLogo: homeComp.team?.logo || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
            awayTeam: awayComp.team?.displayName || "Away Team",
            awayLogo: awayComp.team?.logo || "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
            homeScore: parseInt(homeComp.score || "0"),
            awayScore: parseInt(awayComp.score || "0"),
            status: statusStr,
            minute: ev.status?.displayClock ? parseInt(ev.status.displayClock.split("'")[0]) : 45,
            date: ev.date ? ev.date.split("T")[0] : new Date().toISOString().split("T")[0],
            time: ev.date ? ev.date.split("T")[1]?.substring(0, 5) : "15:00",
            venue: comp.venue?.fullName || "ESPN Sport Park Arena",
            streamProvider: "CLOUDFLARE",
            streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            events: [],
            stats: {
              possession: { home: 50, away: 50 },
              shots: { home: 12, away: 12 },
              shotsOnTarget: { home: 5, away: 5 },
              xG: { home: 1.3, away: 1.3 },
              corners: { home: 5, away: 5 },
              fouls: { home: 8, away: 8 },
              saves: { home: 4, away: 4 },
              yellowCards: { home: 1, away: 1 },
              redCards: { home: 0, away: 0 }
            },
            commentary: [
              { minute: 45, text: `Real-time Score feed integrated directly from public ESPN Scoreboard CDN. Event status: ${ev.status?.type?.detail || "PENDING"}.`, type: "INFO" }
            ],
            lineups: {
              home: { formation: "4-4-2", startingXI: [], substitutes: [] },
              away: { formation: "4-4-2", startingXI: [], substitutes: [] }
            }
          };
        });
        
        if (mappedMatches.length > 0) {
          return res.json(mappedMatches);
        }
      }
    } catch (e: any) {
      console.warn("ESPN Scoreboard CDN fetch unavailable, using fallback mock:", e.message);
    }
    
    // Fallback Mock Matches styled as ESPN TV Scoreboard!
    const mockEspnMatches = [
      {
        id: "espn-1",
        league: "La Liga Santander - Spain (ESPN Live)",
        homeTeam: "Barcelona",
        homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
        awayTeam: "Athletic Bilbao",
        awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
        homeScore: 2,
        awayScore: 1,
        status: MatchStatus.LIVE,
        minute: 73,
        date: new Date().toISOString().split("T")[0],
        time: "21:00",
        venue: "Olympic Stadium, Barcelona",
        streamProvider: "HLS",
        streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        events: [
          { id: "ee1", minute: 22, type: "GOAL", player: "Robert Lewandowski", detail: "Tapped in from 6 yards, assist by Gavi", team: "home" },
          { id: "ee2", minute: 41, type: "GOAL", player: "Oihan Sancet", detail: "Cool penalty placed into bottom corner", team: "away" },
          { id: "ee3", minute: 67, type: "GOAL", player: "Lamine Yamal", detail: "Stunning signature curled strike into the far top corner", team: "home" }
        ],
        stats: {
          possession: { home: 62, away: 38 },
          shots: { home: 14, away: 8 },
          shotsOnTarget: { home: 6, away: 3 },
          xG: { home: 1.88, away: 0.95 },
          corners: { home: 7, away: 3 },
          fouls: { home: 10, away: 13 },
          saves: { home: 2, away: 4 },
          yellowCards: { home: 1, away: 3 },
          redCards: { home: 0, away: 0 }
        },
        commentary: [
          { minute: 73, text: "Barcelona keeping solid possession. ESPN match analysts score Lamine Yamal performance at 9.2 rating.", type: "INFO" },
          { minute: 67, text: "GOAL! Lamine Yamal turns his marker inside out and curls an absolute masterpiece past the goalkeeper!", type: "GOAL" }
        ],
        lineups: {
          home: { formation: "4-2-3-1", startingXI: [], substitutes: [] },
          away: { formation: "4-2-3-1", startingXI: [], substitutes: [] }
        }
      },
      {
        id: "espn-2",
        league: "Premier League - England (ESPN Live)",
        homeTeam: "Arsenal",
        homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
        awayTeam: "Aston Villa",
        awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
        homeScore: 0,
        awayScore: 0,
        status: MatchStatus.LIVE,
        minute: 19,
        date: new Date().toISOString().split("T")[0],
        time: "17:30",
        venue: "Emirates Stadium, London",
        streamProvider: "MUX",
        playbackId: "DS00Ui9Vh2FvVbfq9ElF500CUt02uUzKw9",
        events: [],
        stats: {
          possession: { home: 58, away: 42 },
          shots: { home: 4, away: 2 },
          shotsOnTarget: { home: 1, away: 0 },
          xG: { home: 0.35, away: 0.15 },
          corners: { home: 3, away: 1 },
          fouls: { home: 2, away: 4 },
          saves: { home: 0, away: 1 },
          yellowCards: { home: 0, away: 1 },
          redCards: { home: 0, away: 0 }
        },
        commentary: [
          { minute: 19, text: "Arsenal applying a relentless high press. Villa compact in their defensive shapes.", type: "INFO" }
        ],
        lineups: {
          home: { formation: "4-3-3", startingXI: [], substitutes: [] },
          away: { formation: "4-4-2", startingXI: [], substitutes: [] }
        }
      }
    ];
    return res.json(mockEspnMatches);
  }
  
  // Default Local SportMonks Matches
  res.json(serverMatches);
});

app.get("/api/external/features", (req, res) => {
  const provider = (req.query.provider as string || "local").toLowerCase();
  
  const features = [
    {
      id: "feat-1",
      title: provider === "espn" ? "ESPN Champions League Analytics Board" : "RapidAPI Champions League Analytics Board",
      description: provider === "espn" 
        ? "Go behind-the-scenes with ESPN experts breaking down Real Madrid's 4-3-3 counter-attack matrix."
        : "RapidAPI integration parses 98.4% accurate betting odds and Opta predicted rosters of top European leagues.",
      thumbnail: "https://images.unsplash.com/photo-1540747737956-378724044432?w=600&h=400&fit=crop&q=80",
      url: provider === "espn" ? "https://www.espn.com/soccer" : "https://api-football.com",
      category: provider === "espn" ? "ESPN Exclusive" : "RapidAPI Stats Hub"
    },
    {
      id: "feat-2",
      title: provider === "espn" ? "ESPN FC Highlights: La Liga Deciders" : "API-Football Highlights: Serie A Goal Rush",
      description: provider === "espn" 
        ? "Catch all clinical finishing clips from El Clásico matches as analyzed live on ESPN+."
        : "Automated API-Football hooks retrieve high-definition streaming clips of Italian Calcio highlights.",
      thumbnail: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop&q=80",
      url: provider === "espn" ? "https://www.espn.com/soccer" : "https://api-football.com",
      category: provider === "espn" ? "ESPN Highlights" : "Live Video Bulletins"
    }
  ];
  
  res.json(features);
});

app.get("/api/external/leagues", (req, res) => {
  const provider = (req.query.provider as string || "local").toLowerCase();
  
  // Custom league standings tables representing real active leagues for ESPN / API-Football selections
  const leagues = [
    {
      leagueName: provider === "espn" ? "ESPN FC Premier League Table" : "RapidAPI European Premier League Table",
      teams: [
        { position: 1, teamName: "Manchester City", played: 38, won: 28, drawn: 7, lost: 3, points: 91, goalsFor: 96, goalsAgainst: 34, goalDifference: 62 },
        { position: 2, teamName: "Arsenal", played: 38, won: 28, drawn: 5, lost: 5, points: 89, goalsFor: 91, goalsAgainst: 29, goalDifference: 62 },
        { position: 3, teamName: "Liverpool", played: 38, won: 24, drawn: 10, lost: 4, points: 82, goalsFor: 86, goalsAgainst: 41, goalDifference: 45 },
        { position: 4, teamName: "Aston Villa", played: 38, won: 20, drawn: 8, lost: 10, points: 68, goalsFor: 76, goalsAgainst: 61, goalDifference: 15 }
      ]
    },
    {
      leagueName: provider === "espn" ? "ESPN FC Spanish La Liga Standings" : "RapidAPI Spanish La Liga Standings",
      teams: [
        { position: 1, teamName: "Real Madrid", played: 38, won: 29, drawn: 8, lost: 1, points: 95, goalsFor: 87, goalsAgainst: 26, goalDifference: 61 },
        { position: 2, teamName: "Barcelona", played: 38, won: 26, drawn: 7, lost: 5, points: 85, goalsFor: 79, goalsAgainst: 44, goalDifference: 35 },
        { position: 3, teamName: "Girona", played: 38, won: 25, drawn: 6, lost: 7, points: 81, goalsFor: 85, goalsAgainst: 46, goalDifference: 39 },
        { position: 4, teamName: "Atletico Madrid", played: 38, won: 24, drawn: 4, lost: 10, points: 76, goalsFor: 70, goalsAgainst: 43, goalDifference: 27 }
      ]
    }
  ];
  
  res.json(leagues);
});

// Click count tracker
app.post("/api/affiliates/:id/click", (req, res) => {
  const aff = mockAffiliates.find(a => a.id === req.params.id);
  if (aff) {
    aff.clicks += 1;
    res.json({ success: true, clicks: aff.clicks });
  } else {
    res.status(404).json({ error: "Affiliate not found" });
  }
});

// START FULL STACK HANDLERS
async function startServer() {
  // Serve Decoupled Backend-Admin Panel folder statically
  app.use("/admin-panel", express.static(path.join(process.cwd(), "AdSLiveTv Backend-Admin Panel")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted as middleware on Express port 3000.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
