import { Match, MatchStatus, WorldCupGroup, BracketNode, NewsArticle, BettingAffiliate } from "./types";

export const initialMatches: Match[] = [
  {
    id: "m1",
    league: "UEFA Champions League",
    homeTeam: "Real Madrid",
    homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80", // generic sports stadium theme or placeholder
    awayTeam: "Manchester City",
    awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
    homeScore: 2,
    awayScore: 2,
    status: MatchStatus.LIVE,
    minute: 74,
    date: "2026-06-15",
    time: "20:00",
    venue: "Santiago Bernabéu, Madrid",
    streamProvider: "HLS",
    streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // Licensed test HLS stream
    highlightsUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    events: [
      { id: "e1", minute: 14, type: "GOAL", player: "Erling Haaland", detail: "Powered header, assist by Kevin De Bruyne", team: "away" },
      { id: "e2", minute: 28, type: "YELLOW_CARD", player: "Antonio Rüdiger", detail: "Tactical foul in midfield", team: "home" },
      { id: "e3", minute: 39, type: "GOAL", player: "Vinícius Júnior", detail: "Sensational absolute screamer from outside the box", team: "home" },
      { id: "e4", minute: 55, type: "GOAL", player: "Jude Bellingham", detail: "Calm tap-in after defensive rebound", team: "home" },
      { id: "e5", minute: 68, type: "GOAL", player: "Phil Foden", detail: "Top corner curler, assist by Bernardo Silva", team: "away" }
    ],
    stats: {
      possession: { home: 44, away: 56 },
      shots: { home: 12, away: 15 },
      shotsOnTarget: { home: 5, away: 7 },
      xG: { home: 1.45, away: 1.82 },
      corners: { home: 4, away: 8 },
      fouls: { home: 11, away: 8 },
      saves: { home: 5, away: 3 },
      yellowCards: { home: 2, away: 1 },
      redCards: { home: 0, away: 0 }
    },
    lineups: {
      home: {
        formation: "4-3-3",
        startingXI: [
          { number: 1, name: "Thibaut Courtois", position: "GK", rating: 7.2 },
          { number: 2, name: "Dani Carvajal", position: "DEF", rating: 6.8 },
          { number: 22, name: "Antonio Rüdiger", position: "DEF", rating: 6.5 },
          { number: 3, name: "Éder Militão", position: "DEF", rating: 6.9 },
          { number: 23, name: "Ferland Mendy", position: "DEF", rating: 6.7 },
          { number: 8, name: "Federico Valverde", position: "MID", rating: 7.5 },
          { number: 14, name: "Aurélien Tchouaméni", position: "MID", rating: 7.0 },
          { number: 5, name: "Jude Bellingham", position: "MID", rating: 8.4 },
          { number: 11, name: "Rodrygo", position: "ATT", rating: 7.1 },
          { number: 9, name: "Kylian Mbappé", position: "ATT", rating: 7.4 },
          { number: 7, name: "Vinícius Júnior", position: "ATT", rating: 8.9 }
        ],
        substitutes: [
          { number: 13, name: "Andriy Lunin", position: "GK" },
          { number: 10, name: "Luka Modrić", position: "MID", rating: 6.5 },
          { number: 21, name: "Brahim Díaz", position: "ATT" },
          { number: 17, name: "Lucas Vázquez", position: "DEF" }
        ]
      },
      away: {
        formation: "4-1-4-1",
        startingXI: [
          { number: 31, name: "Ederson", position: "GK", rating: 6.5 },
          { number: 2, name: "Kyle Walker", position: "DEF", rating: 7.0 },
          { number: 3, name: "Rúben Dias", position: "DEF", rating: 6.9 },
          { number: 25, name: "Manuel Akanji", position: "DEF", rating: 6.6 },
          { number: 24, name: "Josko Gvardiol", position: "DEF", rating: 7.1 },
          { number: 16, name: "Rodri", position: "MID", rating: 7.8 },
          { number: 20, name: "Bernardo Silva", position: "MID", rating: 8.1 },
          { number: 17, name: "Kevin De Bruyne", position: "MID", rating: 8.5 },
          { number: 47, name: "Phil Foden", position: "MID", rating: 8.8 },
          { number: 10, name: "Jack Grealish", position: "MID", rating: 6.9 },
          { number: 9, name: "Erling Haaland", position: "ATT", rating: 7.9 }
        ],
        substitutes: [
          { number: 18, name: "Stefan Ortega", position: "GK" },
          { number: 82, name: "Rico Lewis", position: "DEF" },
          { number: 11, name: "Jeremy Doku", position: "ATT", rating: 6.8 },
          { number: 19, name: "Julián Álvarez", position: "ATT" }
        ]
      }
    },
    commentary: [
      { minute: 74, text: "Play is paused momentarily as Vinícius Júnior secures a throw-in on the far flank.", type: "INFO" },
      { minute: 68, text: "GOAL! Phil Foden scores a masterclass curler from outside the D bounds! He receives Bernardo's lay-off, switches to his left foot, and drives a bullet past Thibaut Courtois.", type: "GOAL" },
      { minute: 55, text: "GOAL! Real Madrid takes the lead! Dani Carvajal crosses low, Mbappé's first-time block is parried by Ederson, and Bellingham charges in to tap it into an open net!", type: "GOAL" },
      { minute: 45, text: "Halftime whistle blows. A beautiful feast of elite European football, 1-1.", type: "INFO" },
      { minute: 39, text: "GOAL! Real Madrid is level! Vinícius, with limited support, drives inboard from the touchline and fires a strike absolute lasers into the top corner! Out of nowhere!", type: "GOAL" },
      { minute: 28, text: "Yellow card issued to Antonio Rüdiger for dragging down Haaland as City tried to transition through Kevin De Bruyne.", type: "CARD" },
      { minute: 14, text: "GOAL! Haaland strikes early for Manchester City! De Bruyne floats a pinpoint corner right into the heart of the 6-yard area, Haaland rises above Rüdiger and fires a heavy volley down first time.", type: "GOAL" }
    ],
    prediction: "Real Madrid's high-octane home energy usually gives them a tactical edge. Expect Vinícius and Mbappé to threaten City's high defensive line. Recommended bet/prediction: 3-2 victory for Madrid, or full Over 2.5 goals."
  },
  {
    id: "m2",
    league: "Premier League",
    homeTeam: "Arsenal",
    homeLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
    awayTeam: "Chelsea",
    awayLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
    homeScore: 1,
    awayScore: 0,
    status: MatchStatus.LIVE,
    minute: 34,
    date: "2026-06-15",
    time: "17:30",
    venue: "Emirates Stadium, London",
    streamProvider: "HLS",
    streamUrl: "https://test-streams.mux.dev/pts_700k/playlist.m3u8",
    highlightsUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    events: [
      { id: "e10", minute: 23, type: "GOAL", player: "Bukayo Saka", detail: "Penalty scored after Marc Cucurella handball", team: "home" }
    ],
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 7, away: 3 },
      shotsOnTarget: { home: 3, away: 0 },
      xG: { home: 1.12, away: 0.24 },
      corners: { home: 3, away: 1 },
      fouls: { home: 4, away: 6 },
      saves: { home: 0, away: 2 },
      yellowCards: { home: 0, away: 2 },
      redCards: { home: 0, away: 0 }
    },
    lineups: {
      home: {
        formation: "4-3-3",
        startingXI: [
          { number: 22, name: "David Raya", position: "GK", rating: 7.0 },
          { number: 4, name: "Ben White", position: "DEF", rating: 7.1 },
          { number: 2, name: "William Saliba", position: "DEF", rating: 7.3 },
          { number: 6, name: "Gabriel Magalhaes", position: "DEF", rating: 7.2 },
          { number: 12, name: "Jurrien Timber", position: "DEF", rating: 6.9 },
          { number: 41, name: "Declan Rice", position: "MID", rating: 7.4 },
          { number: 5, name: "Thomas Partey", position: "MID", rating: 7.0 },
          { number: 8, name: "Martin Ødegaard", position: "MID", rating: 7.8 },
          { number: 7, name: "Bukayo Saka", position: "ATT", rating: 8.2 },
          { number: 29, name: "Kai Havertz", position: "ATT", rating: 6.9 },
          { number: 11, name: "Gabriel Martinelli", position: "ATT", rating: 7.1 }
        ],
        substitutes: []
      },
      away: {
        formation: "4-2-3-1",
        startingXI: [
          { number: 1, name: "Robert Sánchez", position: "GK", rating: 6.8 },
          { number: 27, name: "Malo Gusto", position: "DEF", rating: 6.5 },
          { number: 29, name: "Wesley Fofana", position: "DEF", rating: 6.6 },
          { number: 6, name: "Levi Colwill", position: "DEF", rating: 6.7 },
          { number: 3, name: "Marc Cucurella", position: "DEF", rating: 5.9 },
          { number: 25, name: "Moisés Caicedo", position: "MID", rating: 7.0 },
          { number: 8, name: "Enzo Fernández", position: "MID", rating: 6.8 },
          { number: 11, name: "Noni Madueke", position: "MID", rating: 6.4 },
          { number: 20, name: "Cole Palmer", position: "MID", rating: 7.2 },
          { number: 10, name: "Mykhailo Mudryk", position: "MID", rating: 6.1 },
          { number: 15, name: "Nicolas Jackson", position: "ATT", rating: 6.3 }
        ],
        substitutes: []
      }
    },
    commentary: [
      { minute: 34, text: "Enzo Fernández loses the ball in deep midfield, Ødegaard pounces but Malo Gusto intercepts.", type: "INFO" },
      { minute: 23, text: "GOAL! Bukayo Saka slots the penalty into the bottom right-hand corner, leaving Robert Sánchez diving the opposite way. Hands out for Arsenal!", type: "GOAL" },
      { minute: 21, text: "PENALTY! After a quick VAR review, Cucurella is penalised for a dynamic hand trailing on White's high header.", type: "VAR" }
    ]
  },
  {
    id: "m3",
    league: "La Liga",
    homeTeam: "Barcelona",
    homeLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
    awayTeam: "Atlético Madrid",
    awayLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
    homeScore: 0,
    awayScore: 0,
    status: MatchStatus.UPCOMING,
    date: "2026-06-16",
    time: "21:00",
    venue: "Estadi Olímpic Lluís Companys, Barcelona",
    streamProvider: "MUX",
    playbackId: "DS00S3ADBf02qK01I",
    events: [],
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      xG: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 0, away: 0 },
      saves: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 }
    },
    lineups: {
      home: { formation: "4-3-3", startingXI: [], substitutes: [] },
      away: { formation: "5-3-2", startingXI: [], substitutes: [] }
    },
    commentary: []
  },
  {
    id: "m4",
    league: "FIFA World Cup",
    homeTeam: "Argentina",
    homeLogo: "https://images.unsplash.com/photo-1540747737956-378724044432?w=100&h=100&fit=crop&q=80",
    awayTeam: "France",
    awayLogo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&h=100&fit=crop&q=80",
    homeScore: 3,
    awayScore: 3,
    status: MatchStatus.FINISHED,
    date: "2026-06-12",
    time: "18:00",
    venue: "MetLife Stadium, New York",
    streamProvider: "YOUTUBE",
    highlightsUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    events: [
      { id: "e20", minute: 23, type: "GOAL", player: "Lionel Messi", detail: "Penalty scored", team: "home" },
      { id: "e21", minute: 36, type: "GOAL", player: "Angel Di Maria", detail: "Beautiful fast-break finish", team: "home" },
      { id: "e22", minute: 80, type: "GOAL", player: "Kylian Mbappé", detail: "Penalty converted", team: "away" },
      { id: "e23", minute: 81, type: "GOAL", player: "Kylian Mbappé", detail: "Incredible volley, assist by Marcus Thuram", team: "away" },
      { id: "e24", minute: 108, type: "GOAL", player: "Lionel Messi", detail: "Close-range rebound scramble", team: "home" },
      { id: "e25", minute: 118, type: "GOAL", player: "Kylian Mbappé", detail: "Penalty scored after handball", team: "away" }
    ],
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 20, away: 17 },
      shotsOnTarget: { home: 10, away: 9 },
      xG: { home: 3.12, away: 2.85 },
      corners: { home: 6, away: 5 },
      fouls: { home: 18, away: 19 },
      saves: { home: 6, away: 7 },
      yellowCards: { home: 4, away: 3 },
      redCards: { home: 0, away: 0 }
    },
    lineups: {
      home: { formation: "4-3-3", startingXI: [], substitutes: [] },
      away: { formation: "4-2-3-1", startingXI: [], substitutes: [] }
    },
    commentary: [
      { minute: 120, text: "Unbelievable! Argentina secures the historic win on penalties after a spectacular 3-3 draw over 120 minutes of magic.", type: "INFO" },
      { minute: 118, text: "GOAL! Mbappe scores an electric World Cup hat-trick! He sends Martinez the wrong way to tie this once again, 3-3!", type: "GOAL" },
      { minute: 108, text: "GOAL! Messi makes it 3-2 for Argentina! Lautaro Martinez's shot parried into Messi's trajectory, who fires it across the line. Goalline technology confirms!", type: "GOAL" }
    ]
  }
];

export const mockWorldCupGroups: WorldCupGroup[] = [
  {
    groupName: "Group A",
    teams: [
      { position: 1, teamName: "USA", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 2, goalDifference: 4, points: 7 },
      { position: 2, teamName: "Mexico", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 5 },
      { position: 3, teamName: "Ecuador", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { position: 4, teamName: "Canada", played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 7, goalDifference: -6, points: 0 }
    ]
  },
  {
    groupName: "Group B",
    teams: [
      { position: 1, teamName: "England", played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 9, goalsAgainst: 1, goalDifference: 8, points: 9 },
      { position: 2, teamName: "Senegal", played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 4, goalDifference: 1, points: 6 },
      { position: 3, teamName: "Wales", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 6, goalDifference: -4, points: 1 },
      { position: 4, teamName: "Iran", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 6, goalDifference: -5, points: 1 }
    ]
  },
  {
    groupName: "Group C",
    teams: [
      { position: 1, teamName: "Argentina", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 6, goalsAgainst: 1, goalDifference: 5, points: 7 },
      { position: 2, teamName: "Poland", played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 3, goalsAgainst: 3, goalDifference: 0, points: 4 },
      { position: 3, teamName: "Saudi Arabia", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 5, goalDifference: -3, points: 3 },
      { position: 4, teamName: "Australia", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 }
    ]
  },
  {
    groupName: "Group D",
    teams: [
      { position: 1, teamName: "France", played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 3, goalDifference: 4, points: 7 },
      { position: 2, teamName: "Denmark", played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 4, goalsAgainst: 2, goalDifference: 2, points: 5 },
      { position: 3, teamName: "Tunisia", played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 3 },
      { position: 4, teamName: "Australia", played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1 }
    ]
  }
];

export const mockBracket: BracketNode[] = [
  // Round of 16
  { id: "R16-1", round: "Round of 16", homeTeam: "USA", awayTeam: "Senegal", homeScore: 2, awayScore: 1, winnerId: "USA", date: "2026-06-25", time: "15:00", nextMatchId: "QF-1" },
  { id: "R16-2", round: "Round of 16", homeTeam: "England", awayTeam: "Mexico", homeScore: 3, awayScore: 0, winnerId: "England", date: "2026-06-25", time: "20:00", nextMatchId: "QF-1" },
  { id: "R16-3", round: "Round of 16", homeTeam: "Argentina", awayTeam: "Denmark", homeScore: 2, awayScore: 0, winnerId: "Argentina", date: "2026-06-26", time: "15:00", nextMatchId: "QF-2" },
  { id: "R16-4", round: "Round of 16", homeTeam: "France", awayTeam: "Poland", homeScore: 4, awayScore: 1, winnerId: "France", date: "2026-06-26", time: "20:00", nextMatchId: "QF-2" },
  // Quarter-Finals
  { id: "QF-1", round: "Quarter-Finals", homeTeam: "USA", awayTeam: "England", homeScore: 1, awayScore: 2, winnerId: "England", date: "2026-06-30", time: "17:00", nextMatchId: "SF-1" },
  { id: "QF-2", round: "Quarter-Finals", homeTeam: "Argentina", awayTeam: "France", homeScore: 3, awayScore: 2, winnerId: "Argentina", date: "2026-07-01", time: "20:00", nextMatchId: "SF-1" },
  // Semi-Finals
  { id: "SF-1", round: "Semi-Finals", homeTeam: "England", awayTeam: "Argentina", homeScore: 1, awayScore: 2, winnerId: "Argentina", date: "2026-07-05", time: "20:00", nextMatchId: "F" },
  // Final
  { id: "F", round: "Final", homeTeam: "Argentina", awayTeam: "Brazil", date: "2026-07-12", time: "19:00" }
];

export const mockNews: NewsArticle[] = [
  {
    id: "n1",
    title: "Mbappé Clinches First Champions League Semi-Final Miracle With Real Madrid",
    description: "Kylian Mbappé steals headlines yet again as the Frenchman seals a brilliant brace to dump rival and elevate Real Madrid past PSG hurdles.",
    content: "Real Madrid reached yet another Champions League semi-final in dramatic fashion. Mbappé's combination play with Vinícius Júnior tore Parisian defenders apart. Real manager praised the maturity and transition intelligence of Mbappe, claiming, 'He has adapted to our cosmic slate theme beautifully'. Fans now anticipate an intense tactical showdown with Pep Guardiola's Manchester City side next week.",
    category: "Champions League",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop&q=80",
    date: "2026-06-15",
    source: "AdSLiveTv Newsroom"
  },
  {
    id: "n2",
    title: "Official: Golden Boy Star Signs Contract Extension Worth £200k/Week",
    description: "The Premier League giants have officially finalized a landmark financial extension, shutting off transfer speculations from Real Madrid and FC Barcelona.",
    content: "Arsenal and England's finest Bukayo Saka has penned a highly-coveted five-year extension keeping the London talisman at Emirates Stadium until 2031. Mikel Arteta highlighted Saka's tactical leadership as irreplaceable. Both parties successfully bypass complex buyout negotiations, allowing full focus on securing the coveted standard Premier League silverware against reigning kings Manchester City.",
    category: "Transfers",
    image: "https://images.unsplash.com/photo-1540747737956-378724044432?w=600&h=400&fit=crop&q=80",
    date: "2026-06-14",
    source: "Reuters Sports"
  },
  {
    id: "n3",
    title: "FIFA World Cup 2026 Group Stage Braces For Global Fans In Metropolitan Cities",
    description: "North America welcomes 48 national squads. Tour guides, futuristic venues, and flight logistics undergo tight final stress tests.",
    content: "The countdown to the largest global sporting spectacle is in full throttle. Organizers are preparing advanced public screens with low-latency capabilities in New York, Monterrey, and Vancouver. FIFA officials validated strict safety rules, security standards, and high-quality streaming permissions. FIFA president expressed extreme excitement regarding digital accessibility portals such as AdSLiveTv ensuring millions can access official matches worldwide.",
    category: "World Cup",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop&q=80",
    date: "2026-06-13",
    source: "FIFA News Feeds"
  },
  {
    id: "n4",
    title: "Super Eagles Rise: Nigeria Secures AFCON Favourites Tag After Stunning Run",
    description: "Dynamic tactical patterns and stellar attacking trios elevate expectations ahead of the semi-finals showdown.",
    content: "Victor Osimhen and Ademola Lookman continue their magnificent partnership, driving fear into continental defensive configurations. CAF analysts confirmed Nigeria's expected goals index (xG) isCurrently the highest in tournament history. The team stands strong in focus mode, hoping to lift the golden African trophy to the skies of Lagos.",
    category: "AFCON",
    image: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=600&h=400&fit=crop&q=80",
    date: "2026-06-11",
    source: "ESPN Africa"
  }
];

export const mockAffiliates: BettingAffiliate[] = [
  {
    id: "ba1",
    name: "Bet365",
    logo: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=100&h=100&fit=crop&q=80", // generic charts or financial aesthetics 
    bannerUrl: "Earn standard up to £100 in Bet Credits! *18+ T&Cs apply",
    targetUrl: "https://bet365.com",
    promoCode: "ADSLIVE365",
    clicks: 1420,
    conversions: 320,
    revenue: 4250
  },
  {
    id: "ba2",
    name: "Betway",
    logo: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop&q=80",
    bannerUrl: "Enjoy a £30 Matched Free Bet on your first football deposits!",
    targetUrl: "https://betway.com",
    promoCode: "ADSWAYFREE",
    clicks: 980,
    conversions: 180,
    revenue: 2150
  }
];
