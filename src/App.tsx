import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Play, Trash2, Clock, ExternalLink, X, Youtube, Download, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// PWA Install Prompt 타입
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface HistoryItem {
  id: string;
  videoId: string;
  title: string;
  watchedAt: number;
}

function extractVideoId(input: string): string | null {
  const trimmed = input.trim();

  // Direct video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export default function App() {
  const [inputUrl, setInputUrl] = useState("");
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("barotube-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("barotube-history", JSON.stringify(history));
  }, [history]);

  // PWA Install prompt handling
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
    setShowInstallBanner(false);
  }, [installPrompt]);

  const playVideo = (videoId: string, title?: string) => {
    setCurrentVideoId(videoId);
    setError("");

    const newEntry: HistoryItem = {
      id: videoId,
      videoId,
      title: title || `Video ${videoId}`,
      watchedAt: Date.now(),
    };

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.videoId !== videoId);
      return [newEntry, ...filtered].slice(0, 50);
    });
  };

  const handlePlay = () => {
    const videoId = extractVideoId(inputUrl);
    if (!videoId) {
      setError("유효한 YouTube URL 또는 Video ID를 입력해주세요.");
      return;
    }
    playVideo(videoId);
    setInputUrl("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePlay();
    }
  };

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.videoId !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-lg p-1.5">
              <Play className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Baro<span className="text-red-500">Tube</span>
            </h1>
            <span className="text-xs text-gray-500 hidden sm:inline">광고 없이 영상 시청</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Install Button */}
            {!isInstalled && showInstallBanner && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">설치</span>
              </motion.button>
            )}
            {isInstalled && (
              <div className="flex items-center gap-1 px-3 py-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">설치됨</span>
              </div>
            )}

            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">기록</span>
              {history.length > 0 && (
                <span className="bg-red-600 text-xs px-1.5 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search / Input Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {!currentVideoId && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/10 rounded-full mb-4">
                <Youtube className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-3xl font-bold mb-2">광고 없이 YouTube 영상 시청</h2>
              <p className="text-gray-400">
                YouTube URL 또는 Video ID를 입력하면 바로 재생됩니다
              </p>
            </div>
          )}

          <div className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="YouTube URL 또는 Video ID를 입력하세요..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              {inputUrl && (
                <button
                  onClick={() => setInputUrl("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handlePlay}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors flex items-center gap-2 shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">재생</span>
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center mt-3"
            >
              {error}
            </motion.p>
          )}

          {/* Example URLs */}
          {!currentVideoId && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-xs text-gray-500">예시:</span>
              {[
                { label: "dQw4w9WgXcQ", id: "dQw4w9WgXcQ" },
                { label: "youtu.be/jNQOjAfhHSY", id: "jNQOjAfhHSY" },
              ].map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    setInputUrl(ex.label);
                    inputRef.current?.focus();
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Video Player */}
        <AnimatePresence mode="wait">
          {currentVideoId && (
            <motion.div
              key={currentVideoId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl shadow-black/50">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="BaroTube Player"
                  />
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Video ID:</span>
                  <code className="text-sm bg-white/10 px-2 py-1 rounded font-mono">
                    {currentVideoId}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://youtube.com/watch?v=${currentVideoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">YouTube에서 열기</span>
                  </a>
                  <button
                    onClick={() => setCurrentVideoId(null)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-sm transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">닫기</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    시청 기록
                  </h3>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      전체 삭제
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>아직 시청 기록이 없습니다</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <motion.div
                        key={item.videoId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <button
                          onClick={() => playVideo(item.videoId)}
                          className="shrink-0 relative w-28 h-16 rounded-lg overflow-hidden bg-black/50"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-6 h-6 fill-white" />
                          </div>
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => playVideo(item.videoId)}
                            className="text-sm font-medium truncate block hover:text-red-400 transition-colors text-left"
                          >
                            <code className="font-mono text-xs">{item.videoId}</code>
                          </button>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatTime(item.watchedAt)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`https://youtube.com/watch?v=${item.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            title="YouTube에서 열기"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                          <button
                            onClick={() => removeHistoryItem(item.videoId)}
                            className="p-2 rounded-full hover:bg-red-600/20 transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick History (when not showing full panel) */}
        {!showHistory && history.length > 0 && !currentVideoId && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              최근 시청
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {history.slice(0, 10).map((item) => (
                <motion.button
                  key={item.videoId}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => playVideo(item.videoId)}
                  className="group text-left"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 mb-2">
                    <img
                      src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 fill-white" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 truncate font-mono">{item.videoId}</p>
                  <p className="text-xs text-gray-600">{formatTime(item.watchedAt)}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Install Banner */}
      <AnimatePresence>
        {!isInstalled && showInstallBanner && !currentVideoId && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
          >
            <div className="flex items-start gap-3">
              <div className="bg-red-600 rounded-lg p-2 shrink-0">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">BaroTube 설치하기</h4>
                <p className="text-xs text-gray-400 mt-1">
                  앱으로 설치하면 더 빠르게 이용할 수 있어요. 홈 화면에 바로 접근할 수 있습니다.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleInstall}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 rounded-full text-xs font-medium transition-colors"
                  >
                    설치하기
                  </button>
                  <button
                    onClick={() => setShowInstallBanner(false)}
                    className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-gray-400 transition-colors"
                  >
                    나중에
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowInstallBanner(false)}
                className="text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-600">
          <p>BaroTube — YouTube 영상을 광고 없이 빠르게 시청하는 테스트 도구</p>
          <p className="mt-1">
            YouTube IFrame Player API를 사용합니다. 일부 영상에서는 광고가 표시될 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
