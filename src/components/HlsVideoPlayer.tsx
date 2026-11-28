import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  PictureInPicture2,
  ShieldCheck,
  Lock,
  Sparkles,
  Users,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Match, StreamTransponder } from "../types";

interface HlsVideoPlayerProps {
  match: Match;
  transponders: StreamTransponder[];
  activeTransponder: StreamTransponder | null;
  onSelectTransponder: (t: StreamTransponder) => void;
  locked: boolean;
  lockReason?: string;
  viewsUsed: number;
  viewsLimit: number;
  onUpgradeClick: () => void;
  onOpenReferrals: () => void;
  onToggleFloatingPip: () => void;
  isFloatingPipActive: boolean;
  streamResolution: string;
  onResolutionChange: (res: string) => void;
}

export const HlsVideoPlayer: React.FC<HlsVideoPlayerProps> = ({
  match,
  transponders,
  activeTransponder,
  onSelectTransponder,
  locked,
  lockReason,
  viewsUsed,
  viewsLimit,
  onUpgradeClick,
  onOpenReferrals,
  onToggleFloatingPip,
  isFloatingPipActive,
  streamResolution,
  onResolutionChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.75);
  const [selectedQuality, setSelectedQuality] = useState<"Auto" | "1080p" | "720p" | "480p">("Auto");
  const [hlsLevels, setHlsLevels] = useState<{ index: number; height: number }[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);
  const [streamReady, setStreamReady] = useState(false);

  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const activeUrl =
    activeTransponder?.streamUrl ||
    match.streamUrl ||
    "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  const fallbackMp4 =
    activeTransponder?.fallbackMp4 ||
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  // Pause playback immediately if SleepMood locks the stream
  useEffect(() => {
    if (locked && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [locked]);

  // Attach HLS.js / Native HLS / MP4 fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setUsingFallback(false);
    setStreamReady(false);
    setValidationResult(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (locked) {
      video.pause();
      return;
    }

    const startPlayback = () => {
      video.muted = isMuted;
      video.volume = volume;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    if (Hls.isSupported() && activeUrl.includes(".m3u8")) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
      });
      hlsRef.current = hls;
      hls.loadSource(activeUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setStreamReady(true);
        const mapped = (data.levels || []).map((lvl, idx) => ({
          index: idx,
          height: lvl.height || 720,
        }));
        setHlsLevels(mapped);
        startPlayback();
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          hls.destroy();
          hlsRef.current = null;
          setUsingFallback(true);
          video.src = fallbackMp4;
          setStreamReady(true);
          startPlayback();
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeUrl;
      setStreamReady(true);
      startPlayback();
    } else {
      setUsingFallback(true);
      video.src = fallbackMp4;
      setStreamReady(true);
      startPlayback();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeUrl, fallbackMp4, locked]);

  // Sync mute & volume
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume]);

  const handleTogglePlay = () => {
    if (locked || !videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleQualityChange = (q: "Auto" | "1080p" | "720p" | "480p") => {
    setSelectedQuality(q);
    onResolutionChange(q === "1080p" || q === "Auto" ? "1080p Ultra HD" : `${q} HD`);
    const hls = hlsRef.current;
    if (!hls) return;
    if (q === "Auto") {
      hls.currentLevel = -1;
      return;
    }
    const targetHeight = parseInt(q.replace("p", ""), 10);
    if (hlsLevels.length > 0) {
      let bestIdx = 0;
      let bestDiff = Infinity;
      hlsLevels.forEach((lvl) => {
        const diff = Math.abs(lvl.height - targetHeight);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestIdx = lvl.index;
        }
      });
      hls.currentLevel = bestIdx;
    }
  };

  const handleNativePip = async () => {
    try {
      const video = videoRef.current as any;
      if (video && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
        await video.requestPictureInPicture();
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        onToggleFloatingPip();
      }
    } catch {
      onToggleFloatingPip();
    }
  };

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleValidateManifest = async () => {
    setValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch(`/api/streams/validate?url=${encodeURIComponent(activeUrl)}`);
      const data = await res.json();
      setValidationResult({
        valid: Boolean(data.valid),
        message: data.message || (data.valid ? "Manifest verified" : "Validation failed"),
      });
    } catch {
      setValidationResult({
        valid: false,
        message: "Unable to contact stream verification service",
      });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col bg-black select-none">
      {/* VIDEO VIEWPORT */}
      <div className="aspect-video w-full relative bg-black overflow-hidden group">
        <video
          ref={videoRef}
          playsInline
          loop
          onClick={handleTogglePlay}
          className="w-full h-full object-cover cursor-pointer"
          poster="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&fit=crop&q=80"
        />

        {/* Top-Left Live Signal Badge */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
          <span className="bg-red-600/90 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE {streamResolution}
          </span>
          <span className="bg-black/70 backdrop-blur-sm border border-white/10 text-zinc-200 text-[10px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400" />
            {activeTransponder?.name || `${match.streamProvider} Feed`}
          </span>
          {usingFallback && (
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
              MP4 Fallback Active
            </span>
          )}
        </div>

        {/* Top-Right Signed Token & Resolution Indicator */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {activeTransponder?.signedToken && (
            <span
              className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono px-2 py-1 rounded-md"
              title="HMAC-signed stream session active"
            >
              <ShieldCheck className="w-3 h-3" />
              Signed Stream
            </span>
          )}
        </div>

        {/* Center Play Prompt if paused and not locked */}
        {!isPlaying && !locked && (
          <button
            type="button"
            onClick={handleTogglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-primary-blue/90 hover:bg-primary-blue text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-10 cursor-pointer"
            aria-label="Play stream"
          >
            <Play className="w-7 h-7 fill-white ml-0.5" />
          </button>
        )}

        {/* Controls Overlay Bar */}
        {!locked && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/65 to-transparent px-3 sm:px-4 pt-8 pb-3 flex flex-wrap items-center justify-between gap-2 z-15">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="bg-primary-blue hover:bg-primary-blue/85 p-2 rounded-lg text-white transition-all cursor-pointer"
                title={isPlaying ? "Pause Stream" : "Play Stream"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  setIsMuted(v === 0);
                }}
                aria-label="Stream volume"
                className="w-16 sm:w-24 accent-blue-500 cursor-pointer"
              />

              <span className="hidden md:inline-block text-[10px] font-mono text-zinc-300">
                {streamReady ? "HLS Adaptive Ready" : "Buffering..."}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quality Selector */}
              <div className="flex items-center bg-black/70 border border-white/10 rounded-lg p-0.5 text-[10px] font-mono">
                {(["Auto", "1080p", "720p", "480p"] as const).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQualityChange(q)}
                    className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                      selectedQuality === q
                        ? "bg-primary-blue text-white font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNativePip}
                className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                  isFloatingPipActive
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/10 border-white/10 text-zinc-200 hover:bg-white/20"
                }`}
                title="Picture-in-Picture Mode"
              >
                <PictureInPicture2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFullscreen}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SLEEPMOOD LOCK OVERLAY MODAL */}
        {locked && (
          <div
            id="sleepmood-lock-overlay"
            className="absolute inset-0 bg-[#070b18]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-5 sm:p-8 z-30"
          >
            <div className="max-w-md space-y-4">
              <div className="mx-auto w-fit flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold">
                <Lock className="w-3.5 h-3.5" />
                SleepMood Active ({viewsUsed}/{viewsLimit} Free Views)
              </div>

              <h3 className="text-lg sm:text-2xl font-black font-display text-white leading-tight">
                SleepMood Active - Upgrade Account or Unlock via Referrals
              </h3>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {lockReason ||
                  "Free account viewing limit reached during active broadcast window. Upgrade to Premium/VIP (with coupon support) or invite friends to unlock uninterrupted streaming."}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  id="btn-sleepmood-upgrade"
                  type="button"
                  onClick={onUpgradeClick}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-transform hover:scale-105 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade Account (Apply Coupon)
                </button>
                <button
                  id="btn-sleepmood-referral"
                  type="button"
                  onClick={onOpenReferrals}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  Unlock Free via Referrals
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CHANNEL TRANSPONDER SWITCHER & MANIFEST VERIFIER */}
      <div className="bg-[#080d1c] border-t border-white/10 px-4 py-3 flex flex-col gap-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="font-bold text-white uppercase tracking-wider">📡 Channel Transponders:</span>
            <span className="text-zinc-500 hidden sm:inline">Switch feeds & verify live .m3u8 manifest</span>
          </div>

          <div className="flex items-center gap-2">
            {validationResult && (
              <span
                className={`text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                  validationResult.valid
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                {validationResult.valid ? (
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                )}
                {validationResult.message}
              </span>
            )}
            <button
              id="btn-validate-m3u8"
              type="button"
              onClick={handleValidateManifest}
              disabled={validating}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-mono font-bold text-blue-300 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${validating ? "animate-spin" : ""}`} />
              {validating ? "Verifying .m3u8..." : "Verify .m3u8"}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {transponders.map((t) => {
            const isSelected = activeTransponder?.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTransponder(t)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-sans font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-primary-blue text-white border-primary-blue shadow-md shadow-primary-blue/25"
                    : "bg-black/40 text-zinc-300 border-white/10 hover:border-white/25 hover:text-white"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-emerald-300 animate-pulse" : "bg-zinc-500"
                  }`}
                />
                <span>{t.name}</span>
                <span className="text-[9px] font-mono opacity-75 uppercase">({t.protocol})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
