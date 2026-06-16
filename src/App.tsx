import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Award, 
  Radio, 
  Tv, 
  Database, 
  Key, 
  Settings, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Shield, 
  User, 
  Info, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Users, 
  Heart, 
  Share2, 
  Volume2, 
  Maximize2, 
  CreditCard, 
  ChevronRight, 
  Zap, 
  RefreshCw, 
  BarChart3, 
  AlertCircle, 
  Trash2, 
  Check, 
  Lock, 
  Gift 
} from "lucide-react";

import { 
  Match, 
  MatchStatus, 
  WorldCupGroup, 
  BracketNode, 
  NewsArticle, 
  User as UserType, 
  ApiConfiguration, 
  BettingAffiliate, 
  ChatMessage 
} from "./types";

export default function App() {
  // STATE MANAGEMENT
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [worldCupGroups, setWorldCupGroups] = useState<WorldCupGroup[]>([]);
  const [worldCupBracket, setWorldCupBracket] = useState<BracketNode[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [affiliates, setAffiliates] = useState<BettingAffiliate[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>({
    id: "guest-id",
    email: "",
    name: "Guest Fan",
    role: "Guest",
    subscriptionPlan: "Free"
  });

  // UI tabs and controls
  const [activeTab, setActiveTab] = useState<"stream" | "scores" | "wc" | "news" | "vip" | "partners" | "schedules">("stream");
  const [matchDetailTab, setMatchDetailTab] = useState<"stats" | "lineup" | "commentary" | "events">("commentary");
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [loadingSummaryId, setLoadingSummaryId] = useState<string | null>(null);
  const [newsSummaries, setNewsSummaries] = useState<Record<string, string>>({});

  // Real-time Live Soccer TV Schedules Search Grounded States
  const [schedulesSearchQuery, setSchedulesSearchQuery] = useState("");
  const [schedulesResult, setSchedulesResult] = useState("");
  const [schedulesChunks, setSchedulesChunks] = useState<{ web: { uri: string; title: string } }[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  
  // Custom chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "ai", text: "Welcome to the **AdSLiveTv** Pundit Box! I'm your AI Tactical Analyst. Choose any live match, and I can forecast line statistics, 4-3-3 high-press plans, or tell you who is leading Group A!", timestamp: "16:47" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // Poll state
  const [pollVotes, setPollVotes] = useState<Record<string, { homeVotes: number; drawVotes: number; awayVotes: number; userVoted?: string }>>({});
  
  // Floating stream reactions
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; symbol: string; x: number; y: number }[]>([]);
  const [streamAudioLang, setStreamAudioLang] = useState("English (US)");
  const [streamResolution, setStreamResolution] = useState("1080p Ultra HD");
  const [viewerCount, setViewerCount] = useState(14820);
  const [mockChats, setMockChats] = useState<{ id: string; user: string; text: string; sub: string }[]>([
    { id: "c1", user: "Zizou_Fan", text: "What a screamer from Vinícius!", sub: "VIP" },
    { id: "c2", user: "GoonerSam", text: "Saka's extension has literally made my year 🔴⚪", sub: "Premium" },
    { id: "c3", user: "TacticalPep", text: "Madrid's high line will suffer against Haaland in the second half.", sub: "Free" }
  ]);
  const [newChatInput, setNewChatInput] = useState("");

  // Admin and API connection states
  const [maskedConfig, setMaskedConfig] = useState<Record<string, string>>({});
  const [actualConfig, setActualConfig] = useState<Record<string, string>>({});
  const [newConfigInput, setNewConfigInput] = useState({
    apiFootballKey: "",
    sportMonksKey: "",
    muxKey: "",
    cloudflareStreamKey: "",
    newsApiKey: "",
    googleAnalyticsId: "",
    firebaseKey: ""
  });
  const [testStatus, setTestStatus] = useState<Record<string, { status: string; latency?: string; details?: string }>>({});
  const [testingKey, setTestingKey] = useState<string | null>(null);

  // Subscription Checkout Simulation State
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<"Premium" | "VIP" | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<string | null>(null);
  const [creditCardNumber, setCreditCardNumber] = useState("4242 4242 4242 4242");
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  // Auth Modal/Sim states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");

  // Goal Builder Simulator state
  const [adminScorer, setAdminScorer] = useState("");
  const [adminAssist, setAdminAssist] = useState("");
  
  // States for tracking global active platform push notifications broadcast from Decoupled Admin Panel
  const [activeBroadcast, setActiveBroadcast] = useState<{ id: string; title: string; message: string; type: string } | null>(null);
  const [dismissedBroadcastId, setDismissedBroadcastId] = useState<string | null>(null);

  // --- NEW STATES FOR MATCH NOTIFICATION SUBSCRIPTIONS, TRAILERS, AND PIP ---
  const [subscribedMatchIds, setSubscribedMatchIds] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [goalAlert, setGoalAlert] = useState<{ matchId: string; title: string; subtitle: string; minute: number; homeTeam: string; awayTeam: string; homeScore: number; awayScore: number } | null>(null);
  const [isPlayoutActive, setIsPlayoutActive] = useState<boolean>(true);
  const [activeTrailer, setActiveTrailer] = useState<any>(null);
  const [isTrailerPlaying, setIsTrailerPlaying] = useState<boolean>(false);
  const [currentTrailerSceneIdx, setCurrentTrailerSceneIdx] = useState<number>(0);
  const [trailerLoading, setTrailerLoading] = useState<boolean>(false);
  const previousMatchesRef = useRef<Match[]>([]);

  // External Feeds Integration (RapidAPI, ESPN, Standings)
  const [selectedApiFeed, setSelectedApiFeed] = useState<"local" | "api-football" | "espn">("local");
  const [apiLeagues, setApiLeagues] = useState<any[]>([]);
  const [apiFeatures, setApiFeatures] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const selectedApiFeedRef = useRef(selectedApiFeed);

  useEffect(() => {
    selectedApiFeedRef.current = selectedApiFeed;
  }, [selectedApiFeed]);

  // Web Audio Synthesizer Beep for Bell click
  const playSubtleBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 high beep
      osc.type = "sine";
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  // Web Audio Synthesizer Goal Alert Stadium Horn for push alerts
  const playAudioGoalSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc1.frequency.setValueAtTime(330, audioCtx.currentTime); // E4
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";
      gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 1.2);
      osc2.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  const handleToggleSubscribe = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    let updated: string[];
    let subscribed: boolean;
    if (subscribedMatchIds.includes(matchId)) {
      updated = subscribedMatchIds.filter(id => id !== matchId);
      subscribed = false;
    } else {
      updated = [...subscribedMatchIds, matchId];
      subscribed = true;
    }
    setSubscribedMatchIds(updated);
    playSubtleBeep();
    
    const targetMatch = matches.find(m => m.id === matchId);
    if (targetMatch) {
      if (subscribed) {
        setSuccessToast(`🔔 Push subscribe active: You will receive real-time goal alerts for ${targetMatch.homeTeam} vs ${targetMatch.awayTeam}!`);
      } else {
        setSuccessToast(`🔕 Unsubscribed: Real-time goal alerts disabled for ${targetMatch.homeTeam} vs ${targetMatch.awayTeam}.`);
      }
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };
  // --- END OF NEW STATES ---
  
  // Ref to match container
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  // FETCH DATA ON MOUNT
  useEffect(() => {
    fetchInitialData();
    // Refresh scores and commentary periodically to create real-time ticker
    const interval = setInterval(refreshMatches, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sync spectator count simulation occasionally
  useEffect(() => {
    const spectatorInt = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 50) - 20);
    }, 4000);
    return () => clearInterval(spectatorInt);
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch User
      const userRes = await fetch("/api/user");
      if (userRes.ok) {
        const u = await userRes.json();
        setCurrentUser(u);
      }

      // 2. Fetch Matches
      await refreshMatches();

      // 3. Fetch World Cup Data
      const wcGroupsRes = await fetch("/api/worldcup/groups");
      if (wcGroupsRes.ok) {
        const data = await wcGroupsRes.json();
        setWorldCupGroups(data);
      }

      const wcBracketRes = await fetch("/api/worldcup/bracket");
      if (wcBracketRes.ok) {
        const data = await wcBracketRes.json();
        setWorldCupBracket(data);
      }

      // 4. Fetch News
      const newsRes = await fetch("/api/news");
      if (newsRes.ok) {
        const data = await newsRes.json();
        setNews(data);
        if (data.length > 0) {
          setSelectedNews(data[0]);
        }
      }

      // 5. Fetch Affiliates
      const affiliatesRes = await fetch("/api/affiliates");
      if (affiliatesRes.ok) {
        const data = await affiliatesRes.json();
        setAffiliates(data);
      }

      // 6. Fetch Admin masked settings
      fetchAdminConfig();

    } catch (err) {
      console.error("Error fetching initial files:", err);
    }
  };

  const refreshMatches = async () => {
    try {
      // 1. Fetch active global push alerts
      const activeAlertRes = await fetch("/api/broadcast/active");
      if (activeAlertRes.ok) {
        const alertData = await activeAlertRes.json();
        setActiveBroadcast(alertData.alert || null);
      }

      // 2. Sync profile attributes in real time in case admin modified subscription or privileges
      const userRes = await fetch("/api/user");
      if (userRes.ok) {
        const u = await userRes.json();
        setCurrentUser(u);
      }

      // 3. Fetch matches live scoring updates
      const matchesUrl = selectedApiFeedRef.current === "local" 
        ? "/api/matches" 
        : `/api/external/matches?provider=${selectedApiFeedRef.current}`;
      const matchesRes = await fetch(matchesUrl);
      if (matchesRes.ok) {
        const data = await matchesRes.json();
        
        // Real-time score change checking for subscribed matches
        const prevData = previousMatchesRef.current;
        if (prevData && prevData.length > 0) {
          data.forEach((newM: Match) => {
            const oldM = prevData.find(om => om.id === newM.id);
            if (oldM && subscribedMatchIds.includes(newM.id)) {
              const homeScoreChanged = newM.homeScore > oldM.homeScore;
              const awayScoreChanged = newM.awayScore > oldM.awayScore;
              if (homeScoreChanged || awayScoreChanged) {
                const scorerName = homeScoreChanged 
                  ? (newM.events[0]?.player || `${newM.homeTeam} Player`) 
                  : (newM.events[0]?.player || `${newM.awayTeam} Player`);
                
                setGoalAlert({
                  matchId: newM.id,
                  title: `⚽ GOAL FOR ${homeScoreChanged ? newM.homeTeam.toUpperCase() : newM.awayTeam.toUpperCase()}!`,
                  subtitle: `${scorerName} scores a magnificent strike!`,
                  minute: newM.minute || 90,
                  homeTeam: newM.homeTeam,
                  awayTeam: newM.awayTeam,
                  homeScore: newM.homeScore,
                  awayScore: newM.awayScore
                });
                playAudioGoalSound();
              }
            }
          });
        }
        previousMatchesRef.current = data;
        setMatches(data);
        
        // Auto select active match if none or update existing selected match state
        if (data.length > 0) {
          setMatches((prevMatches: Match[]) => {
            if (activeMatch) {
              const updated = data.find((m: Match) => m.id === activeMatch.id);
              if (updated) {
                // Smooth state sync
                setActiveMatch(updated);
              }
            } else {
              // Default to live match
              const firstLive = data.find((m: Match) => m.status === MatchStatus.LIVE);
              setActiveMatch(firstLive || data[0]);
            }
            return data;
          });
        }
      }
    } catch (e) {
      console.error("Error updates:", e);
    }
  };

  const selectApiFeed = async (feed: "local" | "api-football" | "espn") => {
    setSelectedApiFeed(feed);
    setApiLoading(true);
    try {
      if (feed === "local") {
        const res = await fetch("/api/matches");
        if (res.ok) {
          const data = await res.json();
          setMatches(data);
          if (data.length > 0) {
            setActiveMatch(data[0]);
          }
        }
        setApiLeagues([]);
        setApiFeatures([]);
      } else {
        // Fetch matches
        const matchesRes = await fetch(`/api/external/matches?provider=${feed}`);
        if (matchesRes.ok) {
          const data = await matchesRes.json();
          setMatches(data);
          if (data.length > 0) {
            setActiveMatch(data[0]);
          }
        }
        // Fetch leagues
        const leaguesRes = await fetch(`/api/external/leagues?provider=${feed}`);
        if (leaguesRes.ok) {
          const data = await leaguesRes.json();
          setApiLeagues(data);
        }
        // Fetch features
        const featuresRes = await fetch(`/api/external/features?provider=${feed}`);
        if (featuresRes.ok) {
          const data = await featuresRes.json();
          setApiFeatures(data);
        }
      }
    } catch (e) {
      console.error("Error switching API Feed:", e);
    } finally {
      setApiLoading(false);
    }
  };

  const fetchAdminConfig = async () => {
    try {
      const configRes = await fetch("/api/admin/config");
      if (configRes.ok) {
        const data = await configRes.json();
        setMaskedConfig(data.masked);
        setActualConfig(data.actual);
        setNewConfigInput(data.actual);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSoccerSchedules = async (searchQuery?: string) => {
    setSchedulesLoading(true);
    try {
      const res = await fetch("/api/gemini/soccer-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery || "" })
      });
      if (res.ok) {
        const data = await res.json();
        setSchedulesResult(data.text || "");
        setSchedulesChunks(data.chunks || []);
      } else {
        setSchedulesResult("Failed to download Google Grounded schedule streams. Please retry shortly.");
      }
    } catch (err: any) {
      console.error(err);
      setSchedulesResult("Failed to download livesoccer live guide schedules: " + err.message);
    } finally {
      setSchedulesLoading(false);
    }
  };

  const handleGenerateTrailer = async (matchId: string) => {
    if (currentUser.subscriptionPlan === "Free") {
      setSuccessToast("🔒 Match Trailer Previews are reserved for Premium/VIP accounts. Upgrade now to experience cinematic summaries!");
      setTimeout(() => setSuccessToast(null), 5000);
      setActiveTab("vip");
      return;
    }
    setTrailerLoading(true);
    try {
      const res = await fetch(`/api/matches/${matchId}/trailer`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setActiveTrailer(data.trailer);
        setIsTrailerPlaying(true);
        setCurrentTrailerSceneIdx(0);
        setIsPlayoutActive(true);
      } else {
        alert("Failed to connect with AI video generation tools!");
      }
    } catch (err) {
      console.error(err);
      alert("Error generating video trailer!");
    } finally {
      setTrailerLoading(false);
    }
  };

  // Pre-match trailer cinematic play progress
  useEffect(() => {
    let interval: any;
    if (isTrailerPlaying && activeTrailer) {
      interval = setInterval(() => {
        setCurrentTrailerSceneIdx(prev => {
          if (prev < activeTrailer.scenes.length - 1) {
            // Play a pleasant alert tone when scene shifts
            playSubtleBeep();
            return prev + 1;
          } else {
            setIsTrailerPlaying(false);
            return 0;
          }
        });
      }, 6000); // 6 seconds per beautiful cinematic scene slide
    }
    return () => clearInterval(interval);
  }, [isTrailerPlaying, activeTrailer]);

  const handleSelectMatch = (match: Match) => {
    setActiveMatch(match);
    fetchPoll(match.id);
    setIsTrailerPlaying(false);
    setActiveTrailer(null);
    setCurrentTrailerSceneIdx(0);
    setIsPlayoutActive(true);
  };

  const fetchPoll = async (matchId: string) => {
    try {
      const res = await fetch(`/api/polls/${matchId}`);
      if (res.ok) {
        const data = await res.json();
        setPollVotes(prev => ({ ...prev, [matchId]: data }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVotePoll = async (option: "home" | "draw" | "away") => {
    if (!activeMatch) return;
    try {
      const res = await fetch(`/api/polls/${activeMatch.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: option, userId: currentUser.id })
      });
      if (res.ok) {
        const data = await res.json();
        setPollVotes(prev => ({
          ...prev,
          [activeMatch.id]: { ...data.poll, userVoted: option }
        }));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to vote!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AUTO FEED STREAMING SCHEDULES ON TAB ACTIVE
  useEffect(() => {
    if (activeTab === "schedules" && !schedulesResult) {
      fetchSoccerSchedules();
    }
  }, [activeTab]);

  // TRIGGER PREDICTIONS VIA GEMINI
  const [generatingPrediction, setGeneratingPrediction] = useState(false);
  const handleGetPrediction = async () => {
    if (!activeMatch) return;
    setGeneratingPrediction(true);
    try {
      const res = await fetch("/api/gemini/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: activeMatch.id })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveMatch(prev => prev ? { ...prev, prediction: data.prediction } : null);
        
        // Add prediction as special message in AI assistant
        setChatMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "ai",
            text: `📊 **AdSLiveTv OPTA Pundit Prediction for ${activeMatch.homeTeam} vs ${activeMatch.awayTeam}**:\n\n${data.prediction}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPrediction(false);
    }
  };

  // SUMMARIZE BASE NEWS
  const handleSummarizeNews = async (articleId: string) => {
    setLoadingSummaryId(articleId);
    try {
      const res = await fetch(`/api/news/${articleId}/summarize`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setNewsSummaries(prev => ({ ...prev, [articleId]: data.summary }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummaryId(null);
    }
  };

  // SEND MESSAGE TO AI ASSISTANT CHAT
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const originalText = inputMessage;
    setInputMessage("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...chatMessages, userMsg] })
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "ai",
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  // LIVE EMOJI FLOATING SYSTEM
  const triggerReaction = (symbol: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40; // center scatter
    const y = 80;
    setFloatingReactions(prev => [...prev, { id, symbol, x, y }]);
    
    // Auto clean
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  // USER CHAT SIMULATION ON BROADCAST
  const handleSendMockChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    const item = {
      id: "my-chat-" + Date.now(),
      user: currentUser.name || "Anon Fan",
      text: newChatInput,
      sub: currentUser.subscriptionPlan
    };
    setMockChats(prev => [...prev, item]);
    setNewChatInput("");
  };

  // SAVE API CONFIG TO BACKEND
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfigInput)
      });
      if (res.ok) {
        await fetchAdminConfig();
        alert("API Configuration panel synchronized successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // TEST API CONNECTION HANDLERS
  const handleTestConnection = async (provider: string, keyVal: string) => {
    setTestingKey(provider);
    setTestStatus(prev => ({ ...prev, [provider]: { status: "TESTING" } }));
    
    try {
      const res = await fetch("/api/admin/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, key: keyVal })
      });
      if (res.ok) {
        const data = await res.json();
        setTestStatus(prev => ({
          ...prev,
          [provider]: {
            status: data.status,
            latency: data.latency,
            details: data.details
          }
        }));
      }
    } catch (err) {
      setTestStatus(prev => ({
        ...prev,
        [provider]: { status: "FAILED", details: "Timeout checking diagnostic nodes." }
      }));
    } finally {
      setTestingKey(null);
    }
  };

  // MANUAL GOAL SIMULATOR FOR ADMINS
  const handleAdminTriggerGoal = async (team: "home" | "away") => {
    if (!activeMatch) return;
    try {
      const res = await fetch(`/api/matches/${activeMatch.id}/goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team,
          player: adminScorer || "Super Talent",
          detail: adminAssist ? `Brilliant setup assist by ${adminAssist}.` : "Sensational fast transition shot!"
        })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveMatch(data.match);
        setAdminScorer("");
        setAdminAssist("");
        refreshMatches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // RESET MATCH SCORES INDIVIDUALLY
  const handleResetMatch = async (id: string) => {
    try {
      const res = await fetch(`/api/matches/${id}/reset`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (activeMatch && activeMatch.id === id) {
          setActiveMatch(data.match);
        }
        refreshMatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AFFILIATE BETTING TRACK METRIC
  const handleClickAffiliate = async (id: string, url: string) => {
    try {
      await fetch(`/api/affiliates/${id}/click`, { method: "POST" });
      const affiliatesRes = await fetch("/api/affiliates");
      if (affiliatesRes.ok) {
        const data = await affiliatesRes.json();
        setAffiliates(data);
      }
    } catch (err) {
      console.error(err);
    }
    window.open(url, "_blank");
  };

  // REGULAR AUTH SIGNUP PREVENTIONS
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authEmail, name: authName })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setAuthModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        alert("Logged out successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SUBSCRIPTION PAYMENT
  const triggerCheckout = (planName: "Premium" | "VIP") => {
    setCheckoutPlan(planName);
    setCheckoutModalOpen(true);
    setCouponCode("");
    setCouponResult(null);
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "ADSRULE") {
      setCouponResult("VALID: 20% Promo Applied! Check discounted total below.");
    } else {
      setCouponResult("INVALID COUPON: Choose 'ADSRULE' for structural testing discount.");
    }
  };

  const handleProcessCheckout = async () => {
    if (!checkoutPlan) return;
    setCheckoutProcessing(true);
    setTimeout(async () => {
      try {
        const res = await fetch("/api/user/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: checkoutPlan,
            coupon: couponCode.toUpperCase() === "ADSRULE" ? "ADSRULE" : ""
          })
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
          alert(`Success! You have officially upgraded to a VIP/Premium tier level. Price Paid: $${data.pricePaid.toFixed(2)}.`);
          setCheckoutModalOpen(false);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckoutProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-primary-blue selection:text-white flex flex-col">
      
      {/* GLOBAL DISPATCH / FCM BROADCAST PUSH BANNERS */}
      {activeBroadcast && dismissedBroadcastId !== activeBroadcast.id && (
        <div className={`py-2.5 px-4 sm:px-6 flex items-center justify-between gap-4 text-xs font-display transition-all ${
          activeBroadcast.type === 'danger' 
            ? 'bg-rose-600 text-white' 
            : activeBroadcast.type === 'warning'
            ? 'bg-amber-500 text-zinc-950 font-bold'
            : 'bg-primary-blue text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-sm animate-bounce">📡</span>
            <div className="inline-flex items-center gap-2 flex-wrap text-xs">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold tracking-widest ${
                activeBroadcast.type === 'warning' ? 'bg-black/10 text-black' : 'bg-black/40 text-white'
              }`}>
                {activeBroadcast.type === 'danger' ? 'Emergency' : activeBroadcast.type === 'warning' ? 'Alert Update' : 'Broadcast'}
              </span>
              <span className="font-bold underline">{activeBroadcast.title}</span> – <span>{activeBroadcast.message}</span>
            </div>
          </div>
          <button 
            onClick={() => setDismissedBroadcastId(activeBroadcast.id)} 
            className="text-base font-bold font-mono px-2 leading-none hover:opacity-75 transition-opacity"
            title="Acknowledge & Hide Broadcast Bulletin"
          >
            ×
          </button>
        </div>
      )}

      {/* BRAND HEADER BAR */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <div className="bg-primary-blue hover:bg-primary-blue/80 text-white p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer" onClick={() => setActiveTab("stream")}>
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-display tracking-tight bg-gradient-to-r from-primary-blue to-secondary-green bg-clip-text text-transparent">
              AdSLiveTv
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-secondary-green animate-ping inline-block"></span>
              LIVE HUB BROADCAST
            </div>
          </div>
        </div>

        {/* RESPONSIVE HORIZONTAL NAVIGATION RAILS */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button 
            id="nav-tab-stream"
            onClick={() => { setActiveTab("stream"); refreshMatches(); }}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "stream" ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            📺 Live Broadcast
          </button>
          <button 
            id="nav-tab-scores"
            onClick={() => { setActiveTab("scores"); refreshMatches(); }}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "scores" ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            📋 Live Scores
          </button>
          <button 
            id="nav-tab-wc"
            onClick={() => setActiveTab("wc")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "wc" ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            🏆 WC 2026 Arena
          </button>
          <button 
            id="nav-tab-news"
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "news" ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            🗞️ Football News
          </button>
          <button 
            id="nav-tab-schedules"
            onClick={() => setActiveTab("schedules")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "schedules" ? "bg-white/10 text-white font-semibold text-secondary-green border-b-2 border-secondary-green" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            📡 TV & stream Schedules
          </button>
          <button 
            id="nav-tab-vip"
            onClick={() => setActiveTab("vip")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "vip" ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold transform scale-105" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
          >
            ✨ Premium Packages
          </button>
          <button 
            id="nav-tab-partners"
            onClick={() => setActiveTab("partners")}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === "partners" ? "bg-white/10 text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
          >
            🎯 Betting Partner Rates
          </button>
        </nav>

        {/* PROFILE STATE */}
        <div className="flex items-center gap-3">
          {currentUser.role !== "Guest" ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-white">{currentUser.name}</p>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full inline-block ${
                  currentUser.subscriptionPlan === "VIP" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  currentUser.subscriptionPlan === "Premium" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  "bg-zinc-500/15 text-zinc-400"
                }`}>
                  {currentUser.subscriptionPlan.toUpperCase()} MEMBER {currentUser.role === "Administrator" && "🛡️"}
                </span>
              </div>
              <button 
                id="btn-logout"
                onClick={handleLogout}
                className="text-xs text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg px-2.5 py-1.5 transition-all bg-zinc-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              id="btn-login-trigger"
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-1.5 bg-primary-blue hover:bg-primary-blue/80 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <User className="w-4 h-4" /> Register / Sign In
            </button>
          )}
        </div>
      </header>

      {/* MOBILE SCROLLABLE TAB NAVIGATION */}
      <div className="lg:hidden flex overflow-x-auto gap-1.5 p-2 bg-brand-dark/50 border-b border-white/5 text-xs text-nowrap scrollbar-none">
        <button id="mob-tab-stream" onClick={() => setActiveTab("stream")} className={`px-3 py-1.5 rounded-md ${activeTab === "stream" ? "bg-white/15 text-white" : "text-zinc-400"}`}>📺 Live Broadcast</button>
        <button id="mob-tab-scores" onClick={() => setActiveTab("scores")} className={`px-3 py-1.5 rounded-md ${activeTab === "scores" ? "bg-white/15 text-white" : "text-zinc-400"}`}>📋 Scores</button>
        <button id="mob-tab-wc" onClick={() => setActiveTab("wc")} className={`px-3 py-1.5 rounded-md ${activeTab === "wc" ? "bg-white/15 text-white" : "text-zinc-400"}`}>🏆 World Cup</button>
        <button id="mob-tab-news" onClick={() => setActiveTab("news")} className={`px-3 py-1.5 rounded-md ${activeTab === "news" ? "bg-white/15 text-white" : "text-zinc-400"}`}>🗞️ News</button>
        <button id="mob-tab-schedules" onClick={() => setActiveTab("schedules")} className={`px-3 py-1.5 rounded-md ${activeTab === "schedules" ? "bg-white/15 text-secondary-green border border-secondary-green/20" : "text-zinc-400"}`}>📡 Schedules</button>
        <button id="mob-tab-vip" onClick={() => setActiveTab("vip")} className={`px-3 py-1.5 rounded-md bg-gradient-to-r from-teal-500/10 to-indigo-500/10 text-white border border-teal-500/20`}>✨ VIP Plan</button>
        <button id="mob-tab-partners" onClick={() => setActiveTab("partners")} className={`px-3 py-1.5 rounded-md ${activeTab === "partners" ? "bg-white/15 text-white" : "text-zinc-400"}`}>🎯 Betting</button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-6">

        {/* HERO REALtime NOTIFICATION TICKS OR PROMO banner */}
        <div className="bg-gradient-to-r from-primary-blue/30 via-brand-dark to-secondary-green/20 rounded-xl p-4 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-primary-blue px-2 py-0.5 rounded-full text-[10px] font-mono tracking-widest text-white shrink-0 animate-bounce">
              EXCLUSIVE CODE
            </span>
            <p className="text-xs sm:text-sm text-zinc-300">
              ⚡ Save <span className="text-secondary-green font-bold text-sm">20% off Premium or VIP upgrades</span>. Type promotional coupon <code className="bg-black/40 px-2 py-1 hover:text-white rounded text-white font-mono">ADSRULE</code> during VIP checkouts!
            </p>
          </div>
          <button 
            id="hero-vip-upgrade"
            onClick={() => setActiveTab("vip")}
            className="text-xs bg-white text-brand-dark hover:bg-zinc-200 font-bold px-3 py-1.5 rounded-lg transition-transform hover:scale-105 whitespace-nowrap"
          >
            Upgrade Instantly
          </button>
        </div>

        {/* ---------------- 1. TAB: LIVE STREAMING HUB ---------------- */}
        {activeTab === "stream" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* MATCH LIVE BROADCAST PLAYER SCREEN */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {activeMatch ? (
                <div className="bg-zinc-950/80 rounded-2xl border border-white/5 overflow-hidden shadow-2xl relative">
                  
                  {/* PLAYER HEADER STATS BAR Overlay */}
                  <div className="bg-brand-dark/90 px-4 py-3 flex items-center justify-between border-b border-white/5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                      <span className="font-bold text-xs uppercase tracking-wider text-red-400">LIVE FEED</span>
                      <span className="text-white/50">|</span>
                      <p className="text-xs font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">
                        {activeMatch.league}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="hidden sm:inline">🎙️ Audio: <b className="text-white">{streamAudioLang}</b></span>
                      <span>👥 Specs: <b className="text-white">{viewerCount.toLocaleString()}</b></span>
                      <span className="text-white/50">|</span>
                      <button 
                        id="toggle-pip-mode"
                        onClick={() => {
                          setIsPlayoutActive(!isPlayoutActive);
                          playSubtleBeep();
                        }}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all cursor-pointer flex items-center gap-1 ${isPlayoutActive ? "bg-secondary-green/20 text-secondary-green border border-secondary-green/30 font-semibold" : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white hover:bg-white/10"}`}
                        title={isPlayoutActive ? "PiP is active when you navigate away" : "PiP is disabled when you navigate away"}
                      >
                        📱 {isPlayoutActive ? "PiP: Active" : "PiP: Disabled"}
                      </button>
                    </div>
                  </div>

                  {/* VISUAL STREAM PREVIEW CANVAS CONTAINER */}
                  <div className="aspect-video bg-black relative flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Floating Reaction Emojis HUD Display */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                      {floatingReactions.map(fr => (
                        <div 
                          key={fr.id} 
                          className="absolute text-3xl animate-bounce"
                          style={{ 
                            left: `${fr.x}%`, 
                            bottom: `${fr.y}%`, 
                            transition: "all 2s ease-out",
                            transform: "translateY(-150px)",
                            opacity: 0,
                          }}
                        >
                          {fr.symbol}
                        </div>
                      ))}
                    </div>

                    {/* DYNAMIC PLAYER CONTAINER */}
                    {isTrailerPlaying && activeTrailer ? (
                      <div className="w-full h-full relative flex flex-col justify-between p-6 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${activeTrailer.scenes[currentTrailerSceneIdx]?.image})` }}>
                        
                        {/* Trailer Header HUD */}
                        <div className="flex justify-between items-center z-10 select-none pb-2 border-b border-white/5">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="bg-rose-500 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span> PLAYING TRAILER
                            </span>
                            <span className="text-zinc-500">|</span>
                            <span className="text-indigo-400 font-bold">{activeTrailer.title}</span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">🔊 Soundtrack: {activeTrailer.music}</span>
                        </div>
                        
                        {/* Central Scene Illustration */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-xl mx-auto text-center space-y-3 z-10">
                          <span className="text-indigo-400 text-xs font-mono tracking-widest uppercase">Scene {currentTrailerSceneIdx + 1} of {activeTrailer.scenes.length}</span>
                          <h3 className="text-lg sm:text-2xl font-black font-display text-white tracking-wide uppercase leading-tight">{activeTrailer.scenes[currentTrailerSceneIdx]?.title}</h3>
                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic font-sans select-none">
                            "{activeTrailer.scenes[currentTrailerSceneIdx]?.description}"
                          </p>
                        </div>
                        
                        {/* Controls bar */}
                        <div className="bg-black/60 border border-white/10 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 text-xs">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                setIsTrailerPlaying(false);
                                playSubtleBeep();
                              }}
                              className="bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition-all cursor-pointer"
                            >
                              Stop Preview 🎬
                            </button>
                            <div className="flex items-center gap-1">
                              {activeTrailer.scenes.map((_: any, idx: number) => (
                                <button 
                                  key={idx}
                                  onClick={() => {
                                    setCurrentTrailerSceneIdx(idx);
                                    playSubtleBeep();
                                  }}
                                  className={`h-2 rounded-full transition-all ${idx === currentTrailerSceneIdx ? "w-6 bg-indigo-500" : "w-2 bg-white/20 hover:bg-white/40"}`}
                                ></button>
                              ))}
                            </div>
                          </div>
                          <div className="font-mono text-[10px] text-zinc-500">
                            Pre-Match Cinematic Analyzer v3.3
                          </div>
                        </div>
                      </div>
                    ) : activeMatch.status === MatchStatus.UPCOMING ? (
                      // UPCOMING FIXTURES PRE-GAME INTERACTIVE PANEL
                      <div className="w-full h-full relative flex flex-col items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&fit=crop')` }}>
                        <div className="text-center max-w-sm sm:max-w-md space-y-5 z-10">
                          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wide">
                            Upcoming Event Preview Hub
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black font-display text-white">{activeMatch.homeTeam}</h3>
                            <p className="text-xs text-zinc-400">vs</p>
                            <h3 className="text-2xl font-black font-display text-white">{activeMatch.awayTeam}</h3>
                          </div>
                          
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl space-y-1 font-mono text-[10px] text-zinc-400 mx-auto w-fit">
                            <p>🏆 Tournament: <span className="text-white font-bold">{activeMatch.league}</span></p>
                            <p>📍 Location: <span>{activeMatch.venue}</span></p>
                            <p>⏰ Kick-Off: <span>{activeMatch.date} at {activeMatch.time}</span></p>
                          </div>

                          <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button 
                              id="btn-watch-trailer"
                              disabled={trailerLoading}
                              onClick={() => handleGenerateTrailer(activeMatch.id)}
                              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-103 cursor-pointer shadow-lg shadow-indigo-600/20"
                            >
                              {trailerLoading ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  Computing AI Film scenes...
                                </>
                              ) : (
                                <>
                                  🎬 Experience Cinematic Trailer {currentUser.subscriptionPlan === "Free" && <span className="text-[9px] bg-amber-400 font-extrabold text-black px-1.5 py-0.5 rounded ml-1 animate-pulse shrink-0">✨ PREMIUM</span>}
                                </>
                              )}
                            </button>
                            <button 
                              onClick={() => setActiveTab("vip")}
                              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                            >
                              Unlock Live DVR Nodes
                            </button>
                          </div>
                          <p className="text-[10px] text-zinc-500">
                            *Watch short 4-scene analytical trailers outlining key roster clashes and tactical systems.
                          </p>
                        </div>
                      </div>
                    ) : activeMatch.highlightsUrl ? (
                      <div className="w-full h-full relative group">
                        {/* Real video integration placeholder / HLS support fallback */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end text-xs opacity-0 group-hover:opacity-100 transition-opacity z-15">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button className="bg-primary-blue p-2 rounded-full text-white cursor-pointer hover:scale-105">
                                <Pause className="w-4 h-4 fill-white" />
                              </button>
                              <span>📶 Licensed Low-Latency Streaming Protocol via <b>{activeMatch.streamProvider} Ready</b></span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span>🔊 Live Stereo Audio</span>
                              <span className="bg-zinc-800 p-1 rounded font-mono text-xs">{streamResolution}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive HUD Overlay for Non-paying free guests */}
                        {currentUser.subscriptionPlan === "Free" && activeMatch.streamProvider === "HLS" && (
                          <div className="absolute inset-0 bg-brand-dark/95 flex flex-col items-center justify-center text-center p-6 z-20">
                            <div className="max-w-md space-y-4">
                              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-xs font-semibold mx-auto w-fit flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Guest View Blocked 
                              </div>
                              <h3 className="text-xl font-bold font-display">Upgrade to Unlock Low-Latency HLS Broadcasts</h3>
                              <p className="text-xs text-zinc-400">
                                This live stream is reserved under global sports licensing rules. Unlock Full HD, Multiple Devices, and DVR Controls today. 
                              </p>
                              <button 
                                id="btn-upgrade-stream-lock"
                                onClick={() => setActiveTab("vip")}
                                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-brand-dark font-extrabold rounded-lg text-xs transition-transform hover:scale-105"
                              >
                                Unlock Instantly with Plan ✨
                              </button>
                              <div className="pt-2">
                                <button className="text-[11px] text-zinc-400 underline hover:text-white" onClick={() => handleSelectMatch(matches.find(m => m.id === "m4") || matches[0])}>
                                  Or Watch Finished Match Highlights Instead
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* HIGHWAY/YOUTUBE VIDEO OVERLAY SIMULATOR */}
                        {activeMatch.status === MatchStatus.FINISHED ? (
                          <iframe 
                            className="w-full h-full"
                            src={activeMatch.highlightsUrl}
                            title="Match Highlights"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture-web-share"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          currentUser.subscriptionPlan !== "Free" ? (
                            <div className="w-full h-full relative bg-cover bg-center flex flex-col items-center justify-center p-6" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&h=800&fit=crop&q=80')" }}>
                              <div className="text-center space-y-4 z-10 w-full max-w-lg">
                                <div className="animate-spin text-primary-blue inline-block rounded-full border-t-2 border-r-2 border-white w-10 h-10 mb-2"></div>
                                <h4 className="text-lg font-bold font-display text-white">Connecting Stable CDN Stream Nodes...</h4>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5 text-xs text-zinc-300 text-left font-mono">
                                  <p className="flex justify-between"><span>📡 Transport Hub ID:</span> <span className="text-emerald-400">{activeMatch.streamProvider}</span></p>
                                  <p className="flex justify-between"><span>🌍 Handshake Latency:</span> <span>18ms (Low Latency)</span></p>
                                  <p className="flex justify-between"><span>🎥 Subtitles:</span> <span>Automatic (Multiple Languages)</span></p>
                                  <p className="flex justify-between"><span>🎯 Active Live Channel:</span> <span className="text-white font-bold">{activeMatch.homeTeam} vs {activeMatch.awayTeam}</span></p>
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                  *Broadcast is fully certified to run over Cloudflare Stream, Mux, or AWS media delivery edge systems.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                              <Tv className="w-12 h-12 text-zinc-600 animate-pulse" />
                              <p className="text-xs text-zinc-400">Unlock feed or sign up to experience complete stream control.</p>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center p-8 text-zinc-500">
                        <Tv className="w-16 h-16 mx-auto text-zinc-700 mb-3" />
                        <p className="text-sm font-semibold">No direct digital signal configured for this event</p>
                      </div>
                    )}
                  </div>

                  {/* SCORE TICKER & TEAM GRAPHICS Overlay Bar */}
                  <div className="bg-brand-dark/95 border-t border-white/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                          <img src={activeMatch.homeLogo} alt={activeMatch.homeTeam} className="w-8 h-8 object-cover rounded-full" />
                        </div>
                        <span className="font-bold sm:text-base text-sm">{activeMatch.homeTeam}</span>
                      </div>
                      
                      <div className="bg-black/60 px-4 py-1.5 rounded-xl border border-white/10 text-center font-mono">
                        <span className="text-xl font-bold tracking-wider text-white">
                          {activeMatch.homeScore} - {activeMatch.awayScore}
                        </span>
                        {activeMatch.status === MatchStatus.LIVE ? (
                          <div className="text-[10px] font-bold text-emerald-400 uppercase animate-pulse">
                            {activeMatch.minute}' MIN
                          </div>
                        ) : (
                          <div className="text-[10px] font-bold text-zinc-400 uppercase">
                            {activeMatch.status}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold sm:text-base text-sm">{activeMatch.awayTeam}</span>
                        <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
                          <img src={activeMatch.awayLogo} alt={activeMatch.awayTeam} className="w-8 h-8 object-cover rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <button 
                        id="stream-heart-reaction"
                        onClick={() => triggerReaction("❤️")}
                        className="p-2 hover:bg-white/10 rounded-lg text-rose-500 transition-all text-sm"
                        title="React Heart"
                      >
                        ❤️ Love
                      </button>
                      <button 
                        id="stream-fire-reaction"
                        onClick={() => triggerReaction("🔥")}
                        className="p-2 hover:bg-white/10 rounded-lg text-amber-500 transition-all text-sm"
                        title="React Fire"
                      >
                        🔥 Fire
                      </button>
                      <button 
                        id="stream-clap-reaction"
                        onClick={() => triggerReaction("👏")}
                        className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-all text-sm"
                        title="React Clap"
                      >
                        👏 Clap
                      </button>
                      <button 
                        id="stream-surprise-reaction"
                        onClick={() => triggerReaction("😮")}
                        className="p-2 hover:bg-white/10 rounded-lg text-yellow-500 transition-all text-sm"
                        title="React Mindblown"
                      >
                        😮 Omg
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-dark rounded-xl p-8 text-center text-zinc-400">
                  <p>Choose an upcoming, live or highlighting matchup below.</p>
                </div>
              )}

              {/* DYNAMIC MATCH CENTER CONFIGURATOR (STATS / TIMELINE / COMMENTARY) */}
              {activeMatch && (
                <div className="bg-brand-dark border border-white/5 rounded-2xl overflow-hidden shadow-md">
                  
                  {/* TAB SWITCHER */}
                  <div className="flex border-b border-white/5 bg-black/40">
                    <button 
                      id="match-tab-commentary"
                      onClick={() => setMatchDetailTab("commentary")}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all ${matchDetailTab === "commentary" ? "border-b-2 border-primary-blue text-white bg-white/5" : "text-zinc-400 hover:text-white"}`}
                    >
                      🗣️ Real-time Commentary
                    </button>
                    <button 
                      id="match-tab-events"
                      onClick={() => setMatchDetailTab("events")}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all ${matchDetailTab === "events" ? "border-b-2 border-primary-blue text-white bg-white/5" : "text-zinc-400 hover:text-white"}`}
                    >
                      📈 Pitch Events Timeline
                    </button>
                    <button 
                      id="match-tab-stats"
                      onClick={() => setMatchDetailTab("stats")}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all ${matchDetailTab === "stats" ? "border-b-2 border-primary-blue text-white bg-white/5" : "text-zinc-400 hover:text-white"}`}
                    >
                      🏟️ Match Statistics
                    </button>
                    <button 
                      id="match-tab-lineup"
                      onClick={() => setMatchDetailTab("lineup")}
                      className={`flex-1 py-3 text-xs sm:text-sm font-bold tracking-wide transition-all ${matchDetailTab === "lineup" ? "border-b-2 border-primary-blue text-white bg-white/5" : "text-zinc-400 hover:text-white"}`}
                    >
                      🛡️ Lineups
                    </button>
                  </div>

                  <div className="p-4 sm:p-5">
                    {/* A. DESIGN STATS TAB */}
                    {matchDetailTab === "stats" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 text-xs font-mono text-zinc-400 uppercase tracking-widest border-b border-white/5 pb-2">
                          <div>{activeMatch.homeTeam} (HOME)</div>
                          <div className="text-right">{activeMatch.awayTeam} (AWAY)</div>
                        </div>

                        {/* Possession Row Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span>{activeMatch.stats.possession.home}%</span>
                            <span className="text-zinc-400">Tactical Possession</span>
                            <span>{activeMatch.stats.possession.away}%</span>
                          </div>
                          <div className="h-2.5 bg-zinc-800 rounded-full flex overflow-hidden">
                            <div className="bg-primary-blue transition-all duration-550" style={{ width: `${activeMatch.stats.possession.home}%` }}></div>
                            <div className="bg-secondary-green transition-all duration-550" style={{ width: `${activeMatch.stats.possession.away}%` }}></div>
                          </div>
                        </div>

                        {/* Expected Goals (xG) Row Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-mono">
                            <span>{activeMatch.stats.xG.home.toFixed(2)}</span>
                            <span className="text-zinc-400">Expected Goals (xG) Value</span>
                            <span>{activeMatch.stats.xG.away.toFixed(2)}</span>
                          </div>
                          <div className="h-2.5 bg-zinc-800 rounded-full flex overflow-hidden">
                            <div className="bg-blue-500 transition-all duration-550" style={{ width: `${(activeMatch.stats.xG.home / (activeMatch.stats.xG.home + activeMatch.stats.xG.away || 1)) * 100}%` }}></div>
                            <div className="bg-emerald-400 transition-all duration-550" style={{ width: `${(activeMatch.stats.xG.away / (activeMatch.stats.xG.home + activeMatch.stats.xG.away || 1)) * 100}%` }}></div>
                          </div>
                        </div>

                        {/* Traditional Grid Counters */}
                        <div className="grid grid-cols-3 gap-3 pt-3">
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-white block">{activeMatch.stats.shots.home} / {activeMatch.stats.shots.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400">Total Shots</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-white block">{activeMatch.stats.shotsOnTarget.home} / {activeMatch.stats.shotsOnTarget.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400 font-bold text-secondary-green">Shots On Target</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-white block">{activeMatch.stats.corners.home} / {activeMatch.stats.corners.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold text-primary-blue">Corners Taken</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-warning block">{activeMatch.stats.yellowCards.home} / {activeMatch.stats.yellowCards.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400">Yellow Cards</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-red-500 block">{activeMatch.stats.redCards.home} / {activeMatch.stats.redCards.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400">Red Cards</span>
                          </div>
                          <div className="bg-black/40 border border-white/5 p-3 rounded-xl text-center">
                            <span className="text-lg font-bold text-white block">{activeMatch.stats.fouls.home} / {activeMatch.stats.fouls.away}</span>
                            <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold text-yellow-500">Fouls</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* B. DESIGN LINEUP TAB */}
                    {matchDetailTab === "lineup" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Home Lineup Column */}
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <h4 className="font-bold text-primary-blue">{activeMatch.homeTeam} Starting XI</h4>
                              <span className="text-xs font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{activeMatch.home.formation} Formation</span>
                            </div>
                            
                            {activeMatch.home.startingXI && activeMatch.home.startingXI.length > 0 ? (
                              <div className="space-y-1 text-sm font-mono">
                                {activeMatch.home.startingXI.map((player, idx) => (
                                  <div key={idx} className="flex justify-between py-1 border-b border-white/5 items-center hover:bg-white/5 px-2 rounded">
                                    <div className="flex gap-2.5 items-center">
                                      <span className="text-zinc-500 font-bold w-4 text-right">{player.number}</span>
                                      <span className="bg-zinc-800 text-[10px] px-1 text-zinc-400 rounded uppercase">{player.position}</span>
                                      <span className="text-zinc-200">{player.name}</span>
                                    </div>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 rounded">{player.rating || "6.5"}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-zinc-500 text-center py-4">Squad rosters not released yet. Check in 15 minutes before match!</div>
                            )}
                          </div>

                          {/* Away Lineup Column */}
                          <div className="bg-black/30 p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                              <h4 className="font-bold text-secondary-green">{activeMatch.awayTeam} Starting XI</h4>
                              <span className="text-xs font-mono font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{activeMatch.away.formation} Formation</span>
                            </div>
                            
                            {activeMatch.away.startingXI && activeMatch.away.startingXI.length > 0 ? (
                              <div className="space-y-1 text-sm font-mono">
                                {activeMatch.away.startingXI.map((player, idx) => (
                                  <div key={idx} className="flex justify-between py-1 border-b border-white/5 items-center hover:bg-white/5 px-2 rounded">
                                    <div className="flex gap-2.5 items-center">
                                      <span className="text-zinc-500 font-bold w-4 text-right">{player.number}</span>
                                      <span className="bg-zinc-800 text-[10px] px-1 text-zinc-400 rounded uppercase">{player.position}</span>
                                      <span className="text-zinc-200">{player.name}</span>
                                    </div>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-1.5 rounded">{player.rating || "6.5"}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-zinc-500 text-center py-4">Squad rosters not released yet. Check in 15 minutes before match!</div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Football Pitch Radar Preview */}
                        <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2">
                          <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] px-2 py-0.5 rounded">
                            TACTICAL GRAPHICS ENGINE ACTIVE
                          </span>
                          <p className="text-xs text-zinc-400 max-w-md">
                            Visual 2D radar pitch represents high block zones automatically tracking in OPTA. Enjoy premium sports coverage analytics directly.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* C. DESIGN COMMENTARY TAB */}
                    {matchDetailTab === "commentary" && (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center font-mono text-xs text-zinc-400 border-b border-white/5 pb-2">
                          <span>🔴 CONSTANT COMMENTARY REFRESH ACTIVE (10s)</span>
                          <span className="text-primary-blue">AdSLiveTv Commentary Staff</span>
                        </div>

                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                          {activeMatch.commentary && activeMatch.commentary.length > 0 ? (
                            activeMatch.commentary.map((item, idx) => (
                              <div key={idx} className={`p-3 rounded-xl border border-white/5 transition-all text-sm font-sans flex items-start gap-3 ${
                                item.type === "GOAL" ? "bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-400" :
                                item.type === "CARD" ? "bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-l-amber-400" :
                                item.type === "VAR" ? "bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-l-indigo-400" :
                                "bg-black/30"
                              }`}>
                                <div className="font-mono text-zinc-400 text-xs text-right w-10 shrink-0 font-bold">
                                  {item.minute}' min
                                </div>
                                <div className="text-xs space-y-0.5">
                                  <p className="text-zinc-200">
                                    {item.text}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-zinc-500 font-mono text-xs">Waiting for tactical developments... Pre-match coverage commencing.</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* D. DESIGN EVENTS TIMELINE */}
                    {matchDetailTab === "events" && (
                      <div className="space-y-4">
                        <div className="h-1 bg-zinc-800 rounded-full my-6 relative flex justify-between items-center px-4">
                          <span className="absolute left-0 text-[10px] font-mono font-bold text-zinc-400">Match kick-off</span>
                          <span className="absolute right-0 text-[10px] font-mono font-bold text-zinc-400">Full Time / Active</span>
                        </div>

                        <div className="space-y-3">
                          {activeMatch.events && activeMatch.events.length > 0 ? (
                            activeMatch.events.map((ev, index) => (
                              <div key={index} className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-xl text-sm hover:border-white/10 transition-all font-mono">
                                <div className="flex items-center gap-3">
                                  <span className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                    ev.type === "GOAL" ? "bg-emerald-500 text-black" :
                                    ev.type === "YELLOW_CARD" ? "bg-yellow-400 text-black" :
                                    ev.type === "RED_CARD" ? "bg-red-600 text-white" :
                                    "bg-zinc-800 text-zinc-300"
                                  }`}>
                                    {ev.type === "GOAL" ? "⚽" :
                                     ev.type === "YELLOW_CARD" ? "🟨" :
                                     ev.type === "RED_CARD" ? "🟥" : "🔄"}
                                  </span>
                                  <div>
                                    <p className="font-sans font-bold text-white text-xs">{ev.player}</p>
                                    <p className="text-[10px] text-zinc-400">{ev.detail}</p>
                                  </div>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-xs bg-zinc-800 border border-white/5 px-2.5 py-1 rounded text-zinc-300 font-bold">{ev.minute}' MIN</span>
                                  <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-1">{ev.team === "home" ? "Home Squad" : "Away Squad"}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-zinc-500 py-6 text-center font-mono">No card, substitution, or goal events recorded. Live simulation updates incoming.</div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* INTERACTIVE FAN OPINION POLL */}
              {activeMatch && (
                <div className="bg-gradient-to-br from-brand-dark to-[#091024] p-5 rounded-2xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-lg font-display text-white">AdSLiveTv Fan Opinion Poll</h4>
                    <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">COMMUNITY VOICE</span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Cast your prediction vote for the final score prediction. Registered communities decide who holds the global soccer leverage.
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      id="btn-vote-home"
                      onClick={() => handleVotePoll("home")}
                      className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                        pollVotes[activeMatch.id]?.userVoted === "home" ? "bg-primary-blue border-primary-blue text-white" : "bg-black/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {activeMatch.homeTeam} Wins
                    </button>
                    <button 
                      id="btn-vote-draw"
                      onClick={() => handleVotePoll("draw")}
                      className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                        pollVotes[activeMatch.id]?.userVoted === "draw" ? "bg-primary-blue border-primary-blue text-white" : "bg-black/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      Draw Match
                    </button>
                    <button 
                      id="btn-vote-away"
                      onClick={() => handleVotePoll("away")}
                      className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                        pollVotes[activeMatch.id]?.userVoted === "away" ? "bg-primary-blue border-primary-blue text-white" : "bg-black/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      {activeMatch.awayTeam} Wins
                    </button>
                  </div>

                  {pollVotes[activeMatch.id] && (
                    <div className="space-y-2 pt-2 text-xs font-mono">
                      <div className="flex justify-between text-zinc-400">
                        <span>Konsensus Results:</span>
                        <span>{(pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes).toLocaleString()} total votes cast</span>
                      </div>
                      <div className="h-4 rounded-lg bg-zinc-950 flex overflow-hidden border border-white/5 text-[9px] font-bold text-center">
                        <div className="bg-blue-600 flex items-center justify-center transition-all py-1" style={{ width: `${(pollVotes[activeMatch.id].homeVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100}%` }}>
                          H: {Math.round((pollVotes[activeMatch.id].homeVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100)}%
                        </div>
                        <div className="bg-zinc-700 flex items-center justify-center transition-all py-1 border-x border-white/10" style={{ width: `${(pollVotes[activeMatch.id].drawVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100}%` }}>
                          D: {Math.round((pollVotes[activeMatch.id].drawVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100)}%
                        </div>
                        <div className="bg-emerald-600 flex items-center justify-center transition-all py-1" style={{ width: `${(pollVotes[activeMatch.id].awayVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100}%` }}>
                          A: {Math.round((pollVotes[activeMatch.id].awayVotes / (pollVotes[activeMatch.id].homeVotes + pollVotes[activeMatch.id].drawVotes + pollVotes[activeMatch.id].awayVotes || 1)) * 100)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT SIDEBAR: CHAT + OTHER LIVE FIXTURES LIST */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* GEMINI CHAT ANALYST PUNDIT */}
              <div className="bg-[#0b1329] border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-[500px] shadow-lg">
                <div className="bg-brand-dark p-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                      <Sparkles className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm tracking-wide">Gemini Pundit Core AI</h4>
                      <p className="text-[10px] text-zinc-400">Match Predictions & Form Coach</p>
                    </div>
                  </div>
                  <button 
                    id="btn-gemini-tactics"
                    onClick={handleGetPrediction}
                    disabled={generatingPrediction || !activeMatch}
                    className="text-[10px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded transition-all flex items-center gap-1 shrink-0 disabled:opacity-55"
                  >
                    {generatingPrediction ? "Calculating..." : "🔍 Predict Match"}
                  </button>
                </div>

                {/* Chat window body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72 text-xs">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                      <div className={`p-2 rounded-xl max-w-[85%] leading-relaxed ${
                        msg.sender === "user" ? "bg-primary-blue text-white" : "bg-zinc-900 border border-white/5 text-zinc-200"
                      }`} style={{ whiteSpace: "pre-line" }}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-zinc-500 mt-1.5 font-mono px-1">{msg.timestamp}</span>
                    </div>
                  ))}
                  {loadingChat && (
                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-[10px] p-2 bg-black/20 rounded-lg">
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-t-2 border-indigo-400"></div>
                      <span>Connecting Gemini soccer models...</span>
                    </div>
                  )}
                </div>

                {/* Chat direct submit */}
                <form onSubmit={handleSendChat} className="p-3 bg-brand-dark/60 border-t border-white/5 flex gap-2">
                  <input 
                    type="text"
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    placeholder="Ask Gemini: 'Predict madrid match'..."
                    className="flex-1 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-all">
                    <Send className="w-4.5 h-4.5" />
                  </button>
                </form>
              </div>

              {/* LIVE CHAT FOR STREAM SPECTATORS */}
              {activeMatch && activeMatch.status === MatchStatus.LIVE && (
                <div className="bg-brand-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-[350px]">
                  <div className="bg-zinc-950 p-3 flex justify-between items-center border-b border-white/5">
                    <span className="text-xs font-bold tracking-wider uppercase text-zinc-400">💬 Broadcast Chat Feed</span>
                    <span className="text-[9px] font-mono text-emerald-400">ONLINE SPECTATORS</span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-48 text-xs font-sans">
                    {mockChats.map(item => (
                      <div key={item.id} className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-[10.5px] text-indigo-400">{item.user}</span>
                          <span className={`text-[8px] px-1 rounded uppercase font-bold font-mono ${
                            item.sub === "VIP" ? "bg-amber-500/15 text-amber-300" :
                            item.sub === "Premium" ? "bg-emerald-500/15 text-emerald-300" :
                            "bg-zinc-800 text-zinc-400"
                          }`}>{item.sub}</span>
                        </div>
                        <p className="text-zinc-300">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMockChat} className="p-2 border-t border-white/5 bg-black/30 flex gap-2">
                    <input 
                      type="text"
                      value={newChatInput}
                      onChange={e => setNewChatInput(e.target.value)}
                      placeholder="Comment something live..."
                      className="flex-1 bg-black/40 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300"
                    />
                    <button type="submit" className="bg-primary-blue text-white px-3 py-1 rounded-lg text-xs font-semibold">
                      Send
                    </button>
                  </form>
                </div>
              )}

              {/* OTHER FIXTURES MONITORING CORE GRID */}
              <div className="bg-gradient-to-b from-brand-dark to-[#040817] p-4 rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm tracking-wide text-white font-display">🗓️ Fixtures on AdSLiveTv</h4>
                  <button className="text-[10px] text-primary-blue underline" onClick={refreshMatches}>Refresh</button>
                </div>

                <div className="space-y-3">
                  {matches.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectMatch(item)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        activeMatch?.id === item.id ? "bg-primary-blue/10 border-primary-blue" : "bg-black/40 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono mb-2 text-zinc-400 uppercase">
                        <span>{item.league}</span>
                        {item.status === MatchStatus.LIVE ? (
                          <span className="text-red-400 bg-red-400/10 px-1.5 rounded flex items-center gap-1 font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> LIVE {item.minute}'
                          </span>
                        ) : (
                          <span>{item.date} or {item.time}</span>
                        )}
                      </div>

                      <div className="flex justify-between font-bold text-xs">
                        <span>{item.homeTeam}</span>
                        <span className="font-mono text-zinc-300">{item.homeScore}</span>
                      </div>
                      <div className="flex justify-between font-bold text-xs mt-1">
                        <span>{item.awayTeam}</span>
                        <span className="font-mono text-zinc-300">{item.awayScore}</span>
                      </div>

                      <div className="pt-2 mt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] text-zinc-500">Venue: {item.venue.split(",")[0]}</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => handleToggleSubscribe(e, item.id)}
                            title={subscribedMatchIds.includes(item.id) ? "Unsubscribe Alerts" : "Alert Me For Goals!"}
                            className={`p-1 rounded transition-all cursor-pointer ${
                              subscribedMatchIds.includes(item.id) ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {subscribedMatchIds.includes(item.id) ? (
                              <svg className="w-3 h-3 fill-current animate-bounce" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                            )}
                          </button>
                          <span className="text-[10px] text-primary-blue bg-white/5 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.streamProvider}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ---------------- 2. TAB: SCORES & DATA TABLE ---------------- */}
        {activeTab === "scores" && (
          <div className="space-y-6">
            <div className="bg-brand-dark/40 border border-white/5 p-5 rounded-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    Live Feed Active
                  </span>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full font-bold">
                    Provider: {selectedApiFeed === "local" ? "Local SportMonks" : selectedApiFeed === "api-football" ? "RapidAPI" : "ESPN Sports Data"}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">AdSLiveTv Live Match Center</h3>
                <p className="text-xs text-zinc-400">
                  Select your live football data feed. Connect directly to official public endpoints or RapidAPI relays.
                </p>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 font-mono text-[10px] sm:text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => selectApiFeed("local")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedApiFeed === "local" ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  🚀 SportMonks
                </button>
                <button
                  type="button"
                  onClick={() => selectApiFeed("api-football")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedApiFeed === "api-football" ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  ⚡ RapidAPI
                </button>
                <button
                  type="button"
                  onClick={() => selectApiFeed("espn")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${selectedApiFeed === "espn" ? "bg-primary-blue text-white shadow-md shadow-primary-blue/20" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}
                >
                  🔥 ESPN Soccernet
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center sm:bg-white/5 sm:p-3 sm:rounded-xl">
              <div>
                <h4 className="text-sm font-bold font-sans">
                  {selectedApiFeed === "local" ? "SportMonks Integrated Match Telemetry" : selectedApiFeed === "api-football" ? "RapidAPI Live Fixtures List" : "ESPN live Scoreboard CDN Feed"}
                </h4>
                <p className="text-[10px] text-zinc-500">
                  Showing real-time matches from {selectedApiFeed === "local" ? "SportMonks Core Database" : selectedApiFeed === "api-football" ? "api-football-v1.p.rapidapi.com" : "site.api.espn.com scoreboard"}
                </p>
              </div>
              <button 
                id="btn-scores-refresh"
                onClick={refreshMatches} 
                className="bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-bold font-mono text-zinc-300 flex items-center gap-2 transition-all shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${apiLoading ? "animate-spin" : ""}`} /> 
                Refetch {selectedApiFeed === "local" ? "SportMonks" : selectedApiFeed === "api-football" ? "RapidAPI" : "ESPN"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map(m => (
                <div key={m.id} className="bg-brand-dark p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all relative">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-2">
                      <span>{m.league}</span>
                      {m.status === MatchStatus.LIVE ? (
                        <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase animate-pulse">Live {m.minute}'</span>
                      ) : (
                        <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase">{m.status}</span>
                      )}
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={m.homeLogo} alt="" className="w-6 h-6 object-cover rounded-full" />
                          <span className="font-semibold text-sm">{m.homeTeam}</span>
                        </div>
                        <span className="font-mono text-base font-bold">{m.homeScore}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <img src={m.awayLogo} alt="" className="w-6 h-6 object-cover rounded-full" />
                          <span className="font-semibold text-sm">{m.awayTeam}</span>
                        </div>
                        <span className="font-mono text-base font-bold">{m.awayScore}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleToggleSubscribe(e, m.id)}
                        title={subscribedMatchIds.includes(m.id) ? "Mute Match Notifications" : "Alert Me For Goals!"}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                          subscribedMatchIds.includes(m.id) ? "bg-indigo-500/20 text-indigo-400 animate-pulse" : "bg-white/5 text-zinc-500 hover:text-white"
                        }`}
                      >
                        {subscribedMatchIds.includes(m.id) ? (
                          <svg className="w-3.5 h-3.5 fill-current animate-bounce" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        )}
                      </button>
                      <span className="text-zinc-400 font-mono text-[10px] max-w-28 truncate">📍 {m.venue.split(",")[1] || m.venue}</span>
                    </div>
                    <button 
                      onClick={() => {
                        handleSelectMatch(m);
                        setActiveTab("stream");
                      }}
                      className="text-primary-blue font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-[11px]"
                    >
                      Connect Stream <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedApiFeed !== "local" && (
              <div className="space-y-6 pt-6 border-t border-white/5 animate-fade-in">
                {/* 1. Leagues Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-bold font-display flex items-center gap-2 text-white">
                        <svg className="w-5 h-5 text-primary-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-5.25A1.125 1.125 0 007.875 15.375v3.375m9-10.125c.621 0 1.125-.504 1.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125h-9C5.25 2.25 4.746 2.754 4.746 3.375v3.375c0 .621.504 1.125 1.125 1.125m9.75 3.375V11.25c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 016.75 11.25V9m3.375-3h3.75" />
                        </svg>
                        Professional Leagues Table Standings
                      </h4>
                      <p className="text-xs text-zinc-400">Real-time standings fetched from {selectedApiFeed === "api-football" ? "RapidAPI" : "ESPN"} soccer feeds.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apiLeagues.map((league, idx) => (
                      <div key={idx} className="bg-brand-dark p-5 rounded-2xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <h5 className="font-bold text-sm font-sans text-zinc-300">{league.leagueName}</h5>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">STANDINGS TABLE</span>
                        </div>

                        <div className="overflow-x-auto text-[11px] font-mono">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="text-zinc-500 border-b border-white/5">
                                <th className="py-2 w-8">Pos</th>
                                <th>Team Name</th>
                                <th className="text-center w-8">Pl</th>
                                <th className="text-center w-8">W</th>
                                <th className="text-center w-8">D</th>
                                <th className="text-center w-8">L</th>
                                <th className="text-center w-8">GD</th>
                                <th className="text-right w-10">Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {league.teams?.map((t: any, teamIdx: number) => (
                                <tr key={teamIdx} className="border-b border-white/5 hover:bg-white/5">
                                  <td className="py-2.5 font-bold text-zinc-400">{t.position}</td>
                                  <td className="font-sans font-bold text-white text-xs">{t.teamName}</td>
                                  <td className="text-center">{t.played}</td>
                                  <td className="text-center text-emerald-400">{t.won}</td>
                                  <td className="text-center text-zinc-400">{t.drawn}</td>
                                  <td className="text-center text-red-400">{t.lost}</td>
                                  <td className={`text-center font-bold ${t.goalDifference >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                                    {t.goalDifference >= 0 ? `+${t.goalDifference}` : t.goalDifference}
                                  </td>
                                  <td className="text-right font-bold text-primary-blue">{t.points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Features Section */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div>
                    <h4 className="text-lg font-bold font-display flex items-center gap-2 text-white">
                      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.125-.381.657-.381.783 0l2.122 6.529a.5.5 0 00.476.347h6.883c.404 0 .57.519.244.757l-5.568 4.045a.5.5 0 00-.175.54l2.122 6.529c.125.381-.31.698-.636.467l-5.568-4.045a.5.5 0 00-.575 0l-5.568 4.045c-.326.231-.76-.086-.636-.467l2.122-6.529a.5.5 0 00-.175-.54l-5.568-4.045c-.326-.238-.16-.757.244-.757h6.883a.5.5 0 00.476-.347l2.122-6.529z" />
                      </svg>
                      Featured Analysis & Highlight Previews
                    </h4>
                    <p className="text-xs text-zinc-400">Exclusive football features and strategic telemetry breakdown.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {apiFeatures.map((feat, fIdx) => (
                      <div key={feat.id} className="bg-brand-dark p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center hover:border-white/10 transition-all">
                        <img 
                          src={feat.thumbnail} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full md:w-32 h-20 object-cover rounded-lg shrink-0 border border-white/5" 
                        />
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                            {feat.category}
                          </span>
                          <h5 className="font-semibold text-xs text-white leading-snug">{feat.title}</h5>
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">{feat.description}</p>
                          <a 
                            href={feat.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-primary-blue hover:underline font-bold transition-all"
                          >
                            Explore Editorial Broadcaster Feed 
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------------- 3. TAB: WORLD CUP CENTER ---------------- */}
        {activeTab === "wc" && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-900/30 via-brand-dark to-purple-900/10 p-6 rounded-2xl border border-indigo-500/15">
              <div className="max-w-xl space-y-2">
                <span className="inline-block bg-indigo-500/10 text-indigo-400 font-mono text-xs px-2 py-0.5 rounded border border-indigo-500/20">
                  METRO 2026 ARENA
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-display">Dedicated FIFA World Cup 2026 Portal</h3>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Global telemetry on brackets, groups standouts, and tournament schedules. Experience HD broadcasts exclusively.
                </p>
              </div>
            </div>

            {/* KNOCKOUT PROGRESS BRACKET */}
            <div className="bg-brand-dark p-5 rounded-2xl border border-white/5 space-y-4">
              <h4 className="font-bold text-lg font-display">Knockout Stage Live Bracket</h4>
              <p className="text-xs text-zinc-400 mb-4">Click matches to watch dynamic results progression.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
                {/* Round Of 16 */}
                <div className="space-y-4 min-w-[200px]">
                  <h5 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Round of 16</h5>
                  {worldCupBracket.filter(b => b.round === "Round of 16").map(b => (
                    <div key={b.id} className="bg-black/50 p-3 rounded-xl border border-white/5 text-xs font-mono">
                      <p className="text-[10px] text-zinc-500 border-b border-white/5 pb-1 mb-1">{b.date}</p>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.homeTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.homeTeam}</span>
                        <span className="font-bold">{b.homeScore}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.awayTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.awayTeam}</span>
                        <span className="font-bold">{b.awayScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quarter Finals */}
                <div className="space-y-8 min-w-[200px]">
                  <h5 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Quarter Finals</h5>
                  {worldCupBracket.filter(b => b.round === "Quarter-Finals").map(b => (
                    <div key={b.id} className="bg-black/50 p-3 rounded-xl border border-white/5 text-xs font-mono">
                      <p className="text-[10px] text-zinc-500 border-b border-white/5 pb-1 mb-1">{b.date}</p>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.homeTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.homeTeam}</span>
                        <span className="font-bold">{b.homeScore}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.awayTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.awayTeam}</span>
                        <span className="font-bold">{b.awayScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Semi Finals */}
                <div className="space-y-12 min-w-[200px]">
                  <h5 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">Semi Finals</h5>
                  {worldCupBracket.filter(b => b.round === "Semi-Finals").map(b => (
                    <div key={b.id} className="bg-[#0f1d3c] p-3 rounded-xl border border-indigo-500/25 text-xs font-mono">
                      <p className="text-[10px] text-indigo-400 border-b border-white/5 pb-1 mb-1">🔥 SF MATCH</p>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.homeTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.homeTeam}</span>
                        <span className="font-bold">{b.homeScore}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className={b.winnerId === b.awayTeam ? "text-emerald-400 font-bold" : "text-zinc-300"}>{b.awayTeam}</span>
                        <span className="font-bold">{b.awayScore}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Championship */}
                <div className="space-y-16 min-w-[200px]">
                  <h5 className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">⭐️ Final Championship</h5>
                  {worldCupBracket.filter(b => b.round === "Final").map(b => (
                    <div key={b.id} className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/25 text-xs font-mono">
                      <p className="text-[10px] text-amber-400 border-b border-white/5 pb-1 mb-1">MetLife NY Host</p>
                      <div className="flex justify-between py-1 font-bold">
                        <span>{b.homeTeam || "Argentina"}</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between py-1 font-bold">
                        <span>{b.awayTeam || "Brazil"}</span>
                        <span>-</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* GROUP TABLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {worldCupGroups.map((group, idx) => (
                <div key={idx} className="bg-brand-dark p-5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h5 className="font-bold text-base font-display">{group.groupName} Standing Table</h5>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Points Standings</span>
                  </div>

                  <div className="overflow-x-auto text-xs font-mono">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="text-zinc-500 border-b border-white/5">
                          <th className="py-2">Pos</th>
                          <th>Nation</th>
                          <th>Pl</th>
                          <th>W</th>
                          <th>D</th>
                          <th>L</th>
                          <th>GD</th>
                          <th className="text-right">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.teams.map((t, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2.5 font-bold">{t.position}</td>
                            <td className="font-sans font-bold text-white">{t.teamName}</td>
                            <td>{t.played}</td>
                            <td>{t.won}</td>
                            <td>{t.drawn}</td>
                            <td>{t.lost}</td>
                            <td>{t.goalDifference > 0 ? `+${t.goalDifference}` : t.goalDifference}</td>
                            <td className="text-right font-bold text-primary-blue">{t.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ---------------- 4. TAB: SOCCER BREAKING NEWS ---------------- */}
        {activeTab === "news" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-display">Breaking Football Newsroom</h3>
                <p className="text-xs text-zinc-400">Syncs directly with Reuters, ESPN and FIFA Feeds leveraging Gemini-powered summarizers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* NEWS ARTICLES FEED */}
              <div className="lg:col-span-8 space-y-4">
                {news.map(art => (
                  <div 
                    key={art.id} 
                    className={`p-4 rounded-2xl border transition-all text-left flex flex-col md:flex-row gap-4 items-start cursor-pointer ${
                      selectedNews?.id === art.id ? "bg-white/5 border-primary-blue" : "bg-black/30 border-white/5 hover:border-white/10"
                    }`}
                    onClick={() => setSelectedNews(art)}
                  >
                    <img src={art.image} alt="" className="w-full md:w-44 h-28 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="bg-primary-blue/15 text-primary-blue px-2 py-0.5 rounded-full uppercase font-bold">{art.category}</span>
                        <span className="text-zinc-500">{art.date}</span>
                      </div>
                      <h4 className="font-bold text-sm tracking-wide text-white">{art.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{art.description}</p>
                      
                      {/* AI GENERATED PORTION FOR NEWS */}
                      {newsSummaries[art.id] ? (
                        <div className="bg-indigo-950/20 border border-indigo-500/10 p-2 rounded text-[11px] text-indigo-300 leading-relaxed font-sans">
                          ✨ <b>AI Two-Sentence Summary</b>: {newsSummaries[art.id]}
                        </div>
                      ) : (
                        <button 
                          id={`btn-summarize-${art.id}`}
                          onClick={(e) => { e.stopPropagation(); handleSummarizeNews(art.id); }}
                          disabled={loadingSummaryId === art.id}
                          className="text-[10px] font-bold bg-white/5 hover:bg-white/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-1 rounded transition-all mt-1 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {loadingSummaryId === art.id ? "Synthesizing Summary..." : "⚡ Quick AI Summary"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* SINGLE EXPANDED ARTICLE SIDEBAR */}
              <div className="lg:col-span-4 select-none">
                {selectedNews ? (
                  <div className="bg-brand-dark p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                    <img src={selectedNews.image} alt="" className="w-full h-44 object-cover rounded-xl" />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>Source: <b>{selectedNews.source}</b></span>
                        <span>{selectedNews.date}</span>
                      </div>
                      <h3 className="font-bold text-base tracking-wide text-white font-display">{selectedNews.title}</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed pt-2" style={{ whiteSpace: "pre-line" }}>
                        {selectedNews.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 text-center text-xs text-zinc-500">
                      AdSLiveTv News Portal and Copyright © 2026 Sports Media
                    </div>
                  </div>
                ) : (
                  <div className="bg-brand-dark p-5 rounded-xl text-center text-zinc-400">
                    <p>Select any news card to read the deep publication reporting</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ---------------- 5. TAB: PREMIUM BILLING PACKAGES ---------------- */}
        {activeTab === "vip" && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2 pb-4">
              <span className="bg-teal-500/10 text-teal-300 border border-teal-500/30 px-3 py-1 text-xs tracking-widest uppercase rounded">
                MONETIZATION PORTFOLIO
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display">Premium Plans & VIP Ad-Free Telemetry</h3>
              <p className="text-xs sm:text-sm text-zinc-400">
                Support licensed digital infrastructure. Unlock Ultra HD pipelines, dynamic commentaries and live statistics tracking today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* PLAN 1: FREE */}
              <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all">
                <div className="space-y-4">
                  <span className="text-zinc-500 font-mono text-xs uppercase block">Basic Tier</span>
                  <h4 className="text-xl font-bold font-display">AdSLiveTv Guest Free</h4>
                  <div className="text-2xl font-bold font-mono text-white">$0 <span className="text-sm font-sans text-zinc-400 font-normal">/ month</span></div>
                  <p className="text-xs text-zinc-400">Standard community support providing fixture cards, general comments, and local charts.</p>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-zinc-300">
                    <p className="flex items-center gap-2"><span>✅</span> Fixture lists, timings & logs</p>
                    <p className="flex items-center gap-2 text-zinc-500"><span>❌</span> No Live Streaming Feeds</p>
                    <p className="flex items-center gap-2 text-zinc-500"><span>❌</span> No VIP AI Analyst tools</p>
                    <p className="flex items-center gap-2 text-zinc-500"><span>❌</span> Supported by dynamic Adsense ads</p>
                  </div>
                </div>
                
                <button 
                  disabled
                  className="w-full mt-6 py-2.5 bg-zinc-800 text-zinc-500 font-bold rounded-xl text-xs"
                >
                  Current Default Plan
                </button>
              </div>

              {/* PLAN 2: PREMIUM */}
              <div className="bg-gradient-to-br from-[#0c223c] to-brand-dark p-6 rounded-2xl border border-primary-blue/30 flex flex-col justify-between hover:border-primary-blue/40 transition-all ring-1 ring-primary-blue/20 relative">
                <span className="absolute -top-3 right-4 bg-primary-blue text-white px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-extrabold animate-bounce">RECOMMENDED</span>
                
                <div className="space-y-4">
                  <span className="text-primary-blue font-mono text-xs uppercase block">Pro Level</span>
                  <h4 className="text-xl font-bold font-display">AdSLiveTv Pro Premium</h4>
                  <div className="text-2xl font-bold font-mono text-white">$19.99 <span className="text-sm font-sans text-zinc-400 font-normal">/ month</span></div>
                  <p className="text-xs text-zinc-400">Ideal for football followers wanting uninterrupted low-latency streaming in HD.</p>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-zinc-300">
                    <p className="flex items-center gap-2"><span>✅</span> Licensed 720p HD streaming nodes</p>
                    <p className="flex items-center gap-2"><span>✅</span> Unlocked stream radar overlays</p>
                    <p className="flex items-center gap-2"><span>✅</span> Multi-language stereo audio feed</p>
                    <p className="flex items-center gap-2"><span>✅</span> Interactive fan voting & events</p>
                  </div>
                </div>

                <button 
                  id="btn-buy-premium"
                  onClick={() => triggerCheckout("Premium")}
                  className="w-full mt-6 py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white font-extrabold rounded-xl text-xs transition-transform hover:scale-103"
                >
                  Choose Premium Upgrade
                </button>
              </div>

              {/* PLAN 3: VIP */}
              <div className="bg-gradient-to-br from-[#281b3c] to-brand-dark p-6 rounded-2xl border border-purple-500/30 flex flex-col justify-between hover:border-purple-500/40 transition-all ring-1 ring-purple-500/10">
                <div className="space-y-4">
                  <span className="text-purple-400 font-mono text-xs uppercase block">Elite Sports Analytics</span>
                  <h4 className="text-xl font-bold font-display">AdSLiveTv Ultra VIP</h4>
                  <div className="text-2xl font-bold font-mono text-white">$49.99 <span className="text-sm font-sans text-zinc-400 font-normal">/ month</span></div>
                  <p className="text-xs text-zinc-400">The total stadium experience. Full 4K Ultra HD broadcasts, zero advertisements, and custom AI support.</p>
                  
                  <div className="border-t border-white/5 pt-4 space-y-2 text-xs text-zinc-300">
                    <p className="flex items-center gap-2"><span>✅</span> Dynamic 4K Ultra HD streams</p>
                    <p className="flex items-center gap-2"><span>✅</span> Unlimited model forecasting telemetry</p>
                    <p className="flex items-center gap-2"><span>✅</span> Full historical match video archives</p>
                    <p className="flex items-center gap-2"><span>✅</span> Direct WhatsApp / FCM news alerts</p>
                  </div>
                </div>

                <button 
                  id="btn-buy-vip"
                  onClick={() => triggerCheckout("VIP")}
                  className="w-full mt-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all hover:scale-103 shadow-lg"
                >
                  Choose VIP Access
                </button>
              </div>

            </div>

            {/* AD BANNER SIMULATION (MONETIZATION REQUIREMENTS) */}
            <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center space-y-2">
              <span className="text-[9px] font-mono text-zinc-500 tracking-widest block uppercase">ADVERTISEMENT PREVIEW (ADSENSE / AD MANAGER)</span>
              <div className="py-2.5 text-zinc-400 text-xs sm:text-sm font-bold flex flex-wrap justify-center items-center gap-4">
                <span>⚽ Buy Official Football Merchandise on AdStore — Use code <b>ADSGEAR10</b></span>
                <span className="text-zinc-600">|</span>
                <span className="text-secondary-green hover:underline cursor-pointer">Explore VIP Ticket Partner Packages</span>
              </div>
            </div>

          </div>
        )}

        {/* ---------------- 6. TAB: SPORTS BETTING AFFILIATES ---------------- */}
        {activeTab === "partners" && (
          <div className="space-y-6">
            <div className="max-w-xl space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold font-display">Betting Partner Rates & Promocodes</h3>
              <p className="text-xs text-zinc-400">
                Official affiliate integration module. Enjoy the best soccer rates without direct gambling operations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {affiliates.map((aff) => (
                <div key={aff.id} className="bg-brand-dark p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-sm font-bold text-white tracking-widest">{aff.name} Premium Affiliate</span>
                      <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">ACTIVE LINK</span>
                    </div>
                    <img src={aff.logo} alt="" className="w-12 h-12 object-cover rounded-xl border border-white/10" />
                    <div>
                      <p className="text-sm font-medium text-white">{aff.bannerUrl}</p>
                      <p className="text-xs text-zinc-400 mt-1">Unlock credits instantly by punching our promo during registration details.</p>
                    </div>
                    <div className="bg-black/40 border p-3 rounded-lg border-white/10 flex items-center justify-between text-xs">
                      <span className="text-zinc-400 font-mono">AFFILIATE PROMO CODE:</span>
                      <span className="font-mono font-bold text-primary-blue text-sm">{aff.promoCode}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between text-xs font-mono">
                    <div className="flex gap-4 text-zinc-500 text-[10px]">
                      <span>👤 Clicks tracked: <b>{aff.clicks}</b></span>
                      <span>💰 Commissions: <b>{aff.conversions} conversion points</b></span>
                    </div>
                    
                    <button 
                      id={`btn-partner-click-${aff.id}`}
                      onClick={() => handleClickAffiliate(aff.id, aff.targetUrl)}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-brand-dark rounded-xl font-bold text-xs transition-transform hover:scale-103"
                    >
                      Visit Partner Campaign
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 p-4 rounded-xl border border-white/5 text-center">
              <span className="text-[10px] font-mono text-zinc-500 block">RESPONSIBLE SPOKESSMANSHIP POLICY</span>
              <p className="text-[11px] text-zinc-400 max-w-lg mx-auto mt-1">
                AdSLiveTv remains completely independent from direct legal betting operations list. Direct users must be 18+ and adhere to domestic terms and limitations rules.
              </p>
            </div>
          </div>
        )}

        {/* ---------------- 7. TAB: LIVE SOCCER TV &STREAM SCHEDULES (SEARCH GROUNDING) ---------------- */}
        {activeTab === "schedules" && (
          <div className="space-y-6">
            
            {/* HERO INTRODUCTION PANEL */}
            <div className="bg-gradient-to-br from-[#10192e] to-brand-dark p-6 rounded-2xl border border-primary-blue/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 max-w-2xl">
                <span className="text-secondary-green font-mono text-[10px] px-2.5 py-1 bg-secondary-green/10 border border-secondary-green/20 rounded-full font-bold inline-flex items-center gap-1.5 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-green animate-ping"></span>
                  Grounded live search feeds
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                  📡 Live Soccer Broadcasts & TV Guides
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Real-time direct schedules from <span className="text-white hover:underline cursor-pointer">LiveSoccerTV.com</span> & top global providers. Simply query any league, match, or channel. Powered by <b>Gemini Search Grounding</b>.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10 px-2 py-1 rounded">
                  FuboTV, ESPN+, beIN
                </span>
                <span className="text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10 px-2 py-1 rounded">
                  UK BBC/ITVX, SBS Demand
                </span>
                <span className="text-[10px] font-mono bg-white/5 text-zinc-400 border border-white/10 px-2 py-1 rounded">
                  Tubi, Pluto, FIFA+
                </span>
              </div>
            </div>

            {/* QUICK PRE-FILTERS CAROUSEL */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">⚡ QUICK PLATFORM PRE-FILTERS:</h4>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "LiveSoccerTV", icon: "🌐", query: "Main live football match schedules playing today globally from LiveSoccerTV.com" },
                  { name: "FuboTV Streams", icon: "🖥️", query: "Matches broadcasting on FuboTV FS1 beIN Sports today and free trial guides" },
                  { name: "ESPN+ / Peacock", icon: "⚽", query: "Premier League on Peacock and La Liga/Bundesliga on ESPN+ schedules today" },
                  { name: "Paramount+", icon: "🏆", query: "UEFA Champions League and Serie A schedules on Paramount+ streams" },
                  { name: "DAZN global", icon: "🌍", query: "DAZN global soccer league live streams schedules for today" },
                  { name: "Tubi & Pluto TV (Free)", icon: "🆓", query: "Free legal live soccer matches and highlights on Tubi and Pluto TV" },
                  { name: "BBC iPlayer / ITVX", icon: "🇬🇧", query: "ITVX and BBC iPlayer UK free soccer streams and match highlights schedules" },
                  { name: "SBS on Demand (AU)", icon: "🇦🇺", query: "SBS on Demand Australia free legal football streams schedules today" },
                  { name: "FIFA+ Originals", icon: "➕", query: "Free live matches, highlights, and documentaries playing on FIFA+ stream portal" },
                  { name: "VPN Access Guide", icon: "🔒", query: "vpnoverview.com recommended sports VPN tips for geo-restricted broadcasting nodes" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    id={`btn-schedule-filter-${idx}`}
                    onClick={() => {
                      setSchedulesSearchQuery(item.query);
                      fetchSoccerSchedules(item.query);
                    }}
                    className="px-3 py-1.5 bg-black/40 hover:bg-neutral-800 text-zinc-300 hover:text-white rounded-xl text-xs border border-white/5 hover:border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{item.icon}</span> {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH AND CONTROL ROW */}
            <div className="bg-brand-dark p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row gap-3 shadow-lg">
              <input
                id="inp-schedule-search"
                type="text"
                placeholder="Search live fixtures (e.g. 'Premier League today', 'World Cup FOX FS1', 'BBC iPlayer free matches')..."
                value={schedulesSearchQuery}
                aria-label="Search schedules"
                onChange={(e) => setSchedulesSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") fetchSoccerSchedules(schedulesSearchQuery); }}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-green transition-all placeholder:text-zinc-500 font-sans"
              />
              <button
                id="btn-schedule-submit"
                onClick={() => fetchSoccerSchedules(schedulesSearchQuery)}
                disabled={schedulesLoading}
                className="bg-primary-blue hover:bg-primary-blue/90 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all tracking-wider font-mono hover:scale-102 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {schedulesLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Synthesizing...
                  </>
                ) : (
                  <>🔍 Search Live Guides</>
                )}
              </button>
            </div>

            {/* RESULTS SCREEN */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* PRIMARY GENERATED RESULT AND SUMMARY CARD */}
              <div className="lg:col-span-8 bg-brand-dark rounded-2xl border border-white/5 p-5 md:p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-secondary-green flex items-center gap-1.5">
                    📢 REAL-TIME STREAM PREVIEW RESULTS
                  </h4>
                  {schedulesLoading && (
                    <span className="text-[10px] font-mono bg-secondary-green/10 text-secondary-green px-2 py-0.5 rounded animate-pulse font-bold">
                      GROUNDING ACTIVE
                    </span>
                  )}
                </div>

                {schedulesLoading ? (
                  <div className="space-y-4 py-4 select-none">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 text-xs text-zinc-400 font-mono">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-green animate-ping shrink-0" />
                      <div>
                        <p className="font-bold text-white uppercase tracking-wider">Connecting with livesoccertv.com indices...</p>
                        <p className="text-[10px] text-zinc-500">Retrieving real-time official broadcasters & satellite channels feeds.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5 animate-pulse">
                      <div className="h-4 bg-white/10 rounded-full w-3/4"></div>
                      <div className="h-3.5 bg-white/5 rounded-full w-5/6"></div>
                      <div className="h-3.5 bg-white/5 rounded-full w-full"></div>
                      <div className="h-3.5 bg-white/5 rounded-full w-4/5"></div>
                      <div className="h-4 bg-white/10 rounded-full w-1/2 mt-6"></div>
                      <div className="h-3.5 bg-white/5 rounded-full w-11/12"></div>
                      <div className="h-3.5 bg-white/5 rounded-full w-5/6"></div>
                    </div>
                  </div>
                ) : schedulesResult ? (
                  <div className="prose prose-invert max-w-none">
                    {(() => {
                      const lines = schedulesResult.split("\n");
                      return (
                        <div className="space-y-4 text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed text-left">
                          {lines.map((line, idx) => {
                            if (line.startsWith("### ")) {
                              return (
                                <h4 key={idx} className="text-sm font-bold text-white font-display border-b border-white/5 pb-1.5 mt-6 flex items-center gap-2">
                                  ⚽ {line.substring(4)}
                                </h4>
                              );
                            }
                            if (line.startsWith("## ")) {
                              return (
                                <h4 key={idx} className="text-base font-bold text-secondary-green font-display border-b border-white/10 pb-2 mt-8 flex items-center gap-2">
                                  📡 {line.substring(3)}
                                </h4>
                              );
                            }
                            if (line.startsWith("* ") || line.startsWith("- ")) {
                              const content = line.substring(2);
                              const parts = content.split("**");
                              return (
                                <div key={idx} className="flex items-start gap-2 pl-3 py-1 bg-black/10 rounded-lg hover:bg-black/20 transition-all border border-white/[0.02] my-1">
                                  <span className="text-primary-blue mt-1 shrink-0">•</span>
                                  <p className="flex-1">
                                    {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p))}
                                  </p>
                                </div>
                              );
                            }
                            if (line.trim() === "") return <div key={idx} className="h-2" />;
                            
                            const parts = line.split("**");
                            return (
                              <p key={idx} className="py-0.5">
                                {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-semibold">{p}</strong> : p))}
                              </p>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 space-y-3">
                    <span className="text-4xl block font-sans">📺</span>
                    <p className="text-sm">Click any Platform Pre-filter above or write a search term to load schedule details in real-time!</p>
                  </div>
                )}
              </div>

              {/* CITATION SOURCES AND SECURITY COMPLIANCE SIDEBAR */}
              <div className="lg:col-span-4 space-y-5 select-none">
                
                {/* DYNAMIC GROUNDED WEB REFRESH CITATIONS */}
                <div className="bg-brand-dark p-4 rounded-2xl border border-white/10 space-y-3 shadow-xl text-left">
                  <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                    🔗 Grounded Verification Sources
                  </h5>
                  
                  {schedulesChunks.length > 0 ? (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                      {schedulesChunks.map((chunk, cIdx) => (
                        <a
                          key={cIdx}
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2 text-left bg-black/30 border border-white/5 hover:border-primary-blue/30 rounded-xl transition-all group cursor-pointer"
                        >
                          <p className="text-[11px] font-bold text-zinc-300 group-hover:text-primary-blue truncate">{chunk.web.title}</p>
                          <p className="text-[9px] text-zinc-500 truncate mt-0.5 font-mono">{chunk.web.uri}</p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[11px] text-zinc-500">
                      No active citations loaded. Search schedules to verify against live indices.
                    </div>
                  )}
                </div>

                {/* ADSLIVETV STREAM SECURITY COMPLIANCE RULES PANEL */}
                <div className="bg-brand-dark p-5 rounded-2xl border border-white/5 space-y-3 text-left shadow-lg text-xs leading-relaxed text-zinc-300">
                  <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1 border-b border-white/5 pb-2">
                    🛡️ LEGAL BROADCAST POLICY
                  </h5>
                  <p className="text-[11px] text-zinc-400">
                    AdSLiveTv strictly catalogs and indexes <b>official copyrighted TV schedules</b>. We do not host, link to, or encourage unauthorized, rogue streaming mirrors.
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    All linked sites (such as FuboTV, Peacock, Paramount+, and DAZN) constitute fully registered streaming partners obeying national and domestic distribution codes.
                  </p>
                  <div className="bg-teal-950/20 border border-teal-500/20 p-2.5 rounded text-[10px] text-teal-400 font-mono">
                    💡 <b>Tip</b>: Accessing free regional sites like UK's BBC iPlayer when travelling is secure via high-speed geo-unblocking as documented on vpnoverview.com.
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER METRICS INFO */}
      <footer className="bg-brand-dark border-t border-white/5 mt-auto py-8 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-1">
            <span className="text-base font-bold text-white font-display">AdSLiveTv Sports Broadcast Corp</span>
            <p className="text-[11px] text-zinc-500">Complying with copyright, feed distribution, and standard streaming credentials rules.</p>
          </div>
          <div className="flex gap-4 text-[11px] font-mono text-zinc-500">
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("stream")}>Interactive Streaming Feed</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("wc")}>Knockout Brackets</span>
            <span>•</span>
            <a href="/admin-panel" target="_blank" className="hover:text-white inline-flex items-center gap-1">
              🛡️ Decoupled Admin Panel
            </a>
          </div>
        </div>
      </footer>

      {/* ---------------- REGISTRATION / SIGN IN MODAL ---------------- */}
      {authModalOpen && (
        <div id="auth-modal" className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 w-full max-w-sm space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg font-display">Register / Quick Sign-In</h4>
              <button onClick={() => setAuthModalOpen(false)} className="text-zinc-400 hover:text-white font-bold text-sm">✕</button>
            </div>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Enter Your Name</label>
                <input 
                  type="text" 
                  value={authName} 
                  required
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs"
                  placeholder="e.g. Adedolapo Sims"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Enter Your Email</label>
                <input 
                  type="email" 
                  value={authEmail} 
                  required
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs"
                  placeholder="e.g. iamadedolaposims@gmail.com"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white text-xs font-bold rounded-xl transition-all"
              >
                Authenticate Live Sandbox Account
              </button>

              <div className="text-[10px] text-zinc-500 text-center leading-relaxed">
                By authenticating, you can cast consensus votes, simulate VIP premium mock checkout cards, and post chat feedbacks.
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- STRIPE CHECKOUT PAYMENT SIMULATOR MODAL ---------------- */}
      {checkoutModalOpen && (
        <div id="checkout-modal" className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 w-full max-w-md space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div>
                <h4 className="font-bold text-base font-display">Stripe Secured Checkout</h4>
                <p className="text-[11px] text-zinc-400">Synchronized upgrade for: <b>{checkoutPlan}</b> Plan</p>
              </div>
              <button onClick={() => setCheckoutModalOpen(false)} className="text-zinc-400 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-950 border rounded-xl border-white/5 flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold text-emerald-400">
                  {checkoutPlan === "VIP" ? (couponCode.toUpperCase() === "ADSRULE" ? "$39.99" : "$49.99") : (couponCode.toUpperCase() === "ADSRULE" ? "$15.99" : "$19.99")}
                </span>
              </div>

              {/* Stripe fields */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400">Cardholder Name</label>
                <input 
                  type="text" 
                  value={currentUser.name}
                  disabled
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-zinc-400">Stripe Test Card Number</label>
                <input 
                  type="text" 
                  value={creditCardNumber} 
                  onChange={(e) => setCreditCardNumber(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs"
                />
              </div>

              {/* Coupon inputs */}
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400">Promotional Code coupon</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Coupon code (e.g. ADSRULE)" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-sans"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] px-3 py-1 rounded-xl font-bold"
                  >
                    Apply
                  </button>
                </div>
                {couponResult && (
                  <p className="text-[10px] text-emerald-400 font-sans mt-1">{couponResult}</p>
                )}
              </div>

              <button 
                type="button"
                id="btn-confirm-checkout"
                disabled={checkoutProcessing}
                onClick={handleProcessCheckout}
                className="w-full py-3 bg-primary-blue hover:bg-primary-blue/95 text-white font-extrabold text-xs rounded-xl mt-4 flex items-center justify-center gap-2"
              >
                {checkoutProcessing ? (
                  <span className="animate-pulse">Authorizing payment with Stripe...</span>
                ) : (
                  <>🔑 Complete mock Payment & Upgrade Account</>
                )}
              </button>

              <p className="text-[9px] text-zinc-500 text-center leading-relaxed font-sans mt-2">
                *Stripe billing parameters, customer creation protocols, and webhook setups are simulated. No real funds are transferred during testing operations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- NEW OVERLAYS FOR INTEGRATIONS --- */}
      {/* 1. Success Notification Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 border border-white/20 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 mb-4 animate-bounce text-xs font-sans font-bold text-white transition-all duration-300">
          <span>🔔</span> {successToast}
        </div>
      )}

      {/* 2. Full Screen High-Priority Dynamic Goal Alert Pop-up */}
      {goalAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="bg-gradient-to-br from-indigo-950 via-zinc-950 to-brand-dark p-6 rounded-2xl border border-indigo-500/20 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center mx-auto text-xl animate-bounce">
              ⚽
            </div>
            
            <div className="space-y-1">
              <span className="text-red-400 font-mono text-[9px] font-bold tracking-widest uppercase bg-red-500/10 px-2 py-0.5 rounded-full inline-block animate-pulse">GOAL ALERT DETECTED</span>
              <h4 className="text-base font-black text-white tracking-wide">{goalAlert.title}</h4>
              <p className="text-xs text-zinc-300 italic">"{goalAlert.subtitle}"</p>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-zinc-400">{goalAlert.homeTeam}</span>
                <span className="font-mono text-zinc-400">{goalAlert.awayTeam}</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black font-mono text-white">
                <span>{goalAlert.homeScore}</span>
                <span className="text-zinc-500 text-lg font-normal">vs</span>
                <span>{goalAlert.awayScore}</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Minute: {goalAlert.minute}'</p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  const m = matches.find(item => item.id === goalAlert.matchId);
                  if (m) handleSelectMatch(m);
                  setActiveTab("stream");
                  setGoalAlert(null);
                }}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 font-extrabold text-[11px] rounded-lg text-white transition-all cursor-pointer"
              >
                Jump to Live Stream 📺
              </button>
              <button 
                onClick={() => setGoalAlert(null)}
                className="py-2 px-4 bg-zinc-800 hover:bg-zinc-700 font-bold text-[11px] rounded-lg text-zinc-400 transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Floating Picture-in-Picture mode */}
      {activeTab !== "stream" && activeMatch && isPlayoutActive && (
        <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 bg-zinc-950/95 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
          
          {/* Micro Custom Header */}
          <div className="bg-brand-dark px-3 py-2 border-b border-white/5 flex items-center justify-between text-[11px] font-mono select-none">
            <div className="flex items-center gap-1.5 max-w-[80%]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block"></span>
              <span className="text-zinc-400 shrink-0">PiP Player:</span>
              <span className="text-white font-bold truncate">{activeMatch.homeTeam} vs {activeMatch.awayTeam}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setActiveTab("stream");
                  setIsPlayoutActive(true);
                  playSubtleBeep();
                }}
                title="Maximize Player"
                className="text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setIsPlayoutActive(false)}
                title="Stop PiP"
                className="text-zinc-400 hover:text-red-400 font-bold text-xs transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* Miniature Canvas */}
          <div className="aspect-video relative bg-black flex flex-col justify-center items-center overflow-hidden">
            {isTrailerPlaying && activeTrailer ? (
              // Mini trailer slide
              <div className="w-full h-full relative" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${activeTrailer.scenes[currentTrailerSceneIdx]?.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="absolute inset-0 p-3 flex flex-col justify-between text-left">
                  <span className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider w-fit font-mono">🎥 AI TRAILER</span>
                  <div>
                    <h5 className="text-[10px] font-bold text-white tracking-wide truncate">{activeTrailer.scenes[currentTrailerSceneIdx]?.title}</h5>
                    <p className="text-[9px] text-zinc-400 line-clamp-2 mt-0.5 font-sans italic">"{activeTrailer.scenes[currentTrailerSceneIdx]?.description}"</p>
                  </div>
                  {/* progress bar */}
                  <div className="w-full bg-white/10 h-0.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${((currentTrailerSceneIdx + 1) / activeTrailer.scenes.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ) : activeMatch.highlightsUrl ? (
              // Mini highlights iframe
              <div className="w-full h-full">
                <iframe 
                  className="w-full h-full pointer-events-none"
                  src={`${activeMatch.highlightsUrl}?controls=0&mute=1&autoplay=1`}
                  title="PiP Highlights"
                ></iframe>
              </div>
            ) : (
              // Mini live cdn / stats
              <div className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center p-2 relative" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&fit=crop')" }}>
                {currentUser.subscriptionPlan === "Free" && activeMatch.streamProvider === "HLS" ? (
                  <div className="text-center p-2 space-y-1 select-none">
                    <span className="bg-amber-500/10 text-amber-300 px-1 py-0.5 rounded text-[8px] font-bold inline-block">GUEST SHUTDOWN</span>
                    <p className="text-[9px] text-zinc-400 font-sans leading-tight">Pro/VIP license required to watch live stream broadcast.</p>
                    <button onClick={() => setActiveTab("vip")} className="text-[9px] bg-amber-500 text-brand-dark font-extrabold px-2 py-0.5 rounded mt-1">Upgrade Tier</button>
                  </div>
                ) : (
                  <div className="text-center p-1 font-mono">
                    <div className="w-4 h-4 rounded-full border border-white border-t-transparent animate-spin mx-auto mb-1"></div>
                    <p className="text-[9px] text-emerald-400 font-bold tracking-wider animate-pulse">CDN STREAM RE-ROUTING...</p>
                    <p className="text-[8px] text-zinc-500">Latency: 14ms | Provider: {activeMatch.streamProvider}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Micro Footer control */}
          <div className="bg-brand-dark px-3 py-1.5 flex items-center justify-between text-[10px] select-none text-zinc-400 font-sans border-t border-white/5">
            <span>{activeMatch.homeTeam} {activeMatch.homeScore} - {activeMatch.awayScore} {activeMatch.awayTeam}</span>
            <span className="font-mono text-zinc-500">{activeMatch.status === MatchStatus.LIVE ? `${activeMatch.minute}'` : activeMatch.status}</span>
          </div>
        </div>
      )}
      {/* --- END OVERLAYS --- */}

    </div>
  );
}
