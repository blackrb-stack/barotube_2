import { useState, useRef } from "react";
import {
  Search,
  Play,
  X,
  Youtube,
  Menu,
  Bell,
  User,
  ExternalLink,
  TrendingUp,
  Music,
  Gamepad2,
  Newspaper,
  Film,
  Radio,
  UtensilsCrossed,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== 카테고리 ====================
const CATEGORIES = [
  { name: '트렌딩', id: 'trending', icon: TrendingUp, url: 'https://www.youtube.com/feed/trending' },
  { name: '음악', id: 'music', icon: Music, url: 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6F' },
  { name: '게임', id: 'gaming', icon: Gamepad2, url: 'https://www.youtube.com/gaming' },
  { name: '뉴스', id: 'news', icon: Newspaper, url: 'https://www.youtube.com/news' },
  { name: '영화', id: 'movies', icon: Film, url: 'https://www.youtube.com/movies' },
  { name: '라이브', id: 'live', icon: Radio, url: 'https://www.youtube.com/live' },
  { name: '요리', id: 'cooking', icon: UtensilsCrossed, url: 'https://www.youtube.com/results?search_query=cooking' },
  { name: '스포츠', id: 'sports', icon: Trophy, url: 'https://www.youtube.com/sports' },
];

// ==================== 유틸 ====================
function extractVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) return m[1];
  }
  return null;
}

// ==================== 메인 앱 ====================
export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 영상 재생
  const handlePlayVideo = (videoId: string) => {
    setPlayingVideoId(videoId);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 검색 실행
  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    // URL인 경우
    const videoId = extractVideoId(query);
    if (videoId) {
      handlePlayVideo(videoId);
      setSearchQuery("");
      return;
    }

    // 일반 검색어인 경우 YouTube로 이동
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  // 뒤로가기
  const handleBack = () => {
    setPlayingVideoId(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* ===== 헤더 ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b border-white/10">
        <div className="flex items-center justify-between h-14 px-4">
          {/* 좌측: 로고 */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => {
                handleBack();
                setSearchQuery("");
              }}
            >
              <div className="bg-red-600 rounded-lg p-1">
                <Play className="w-4 h-4 fill-white" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:inline">
                Baro<span className="text-red-500">Tube</span>
              </span>
            </div>
          </div>

          {/* 중앙: 검색바 */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="flex">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="YouTube URL 또는 검색어 입력..."
                  className="w-full px-4 py-2 bg-[#121212] border border-white/20 rounded-l-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-[#222] border border-white/20 border-l-0 rounded-r-full hover:bg-[#333] transition-colors"
              >
                <Search className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>

          {/* 우측: 아이콘 */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== 카테고리 칩 ===== */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-[#0f0f0f] border-b border-white/10">
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={cat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap bg-[#272727] text-white hover:bg-[#3a3a3a] transition-colors"
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* ===== 메인 콘텐츠 ===== */}
      <main className="pt-28 pb-8 px-4">
        <AnimatePresence mode="wait">
          {playingVideoId ? (
            /* ===== 플레이어 뷰 ===== */
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* 뒤로가기 */}
              <button
                onClick={handleBack}
                className="flex items-center gap-2 mb-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
                <span>돌아가기</span>
              </button>

              {/* 플레이어 - youtube-nocookie.com 사용 */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl mb-4">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${playingVideoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="BaroTube Player"
                  />
                </div>
              </div>

              {/* 영상 정보 */}
              <div className="flex items-center justify-between">
                <code className="text-sm bg-white/10 px-3 py-1.5 rounded-lg font-mono">
                  {playingVideoId}
                </code>
                <a
                  href={`https://youtube.com/watch?v=${playingVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">YouTube에서 열기</span>
                </a>
              </div>
            </motion.div>
          ) : (
            /* ===== 홈 뷰 ===== */
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto"
            >
              {/* 환영 메시지 */}
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600/10 rounded-full mb-4">
                  <Youtube className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">BaroTube에 오신 것을 환영합니다</h2>
                <p className="text-gray-400 mb-8">
                  YouTube URL을 입력하면 광고 없이 영상을 시청할 수 있습니다
                </p>

                {/* 빠른 입력 */}
                <div className="max-w-2xl mx-auto">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="YouTube URL 또는 Video ID를 입력하세요..."
                        className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a] border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors flex items-center gap-2"
                    >
                      <Play className="w-5 h-5 fill-white" />
                      <span>재생</span>
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm mt-3">{error}</p>
                  )}

                  {/* 예시 */}
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="text-xs text-gray-500">예시:</span>
                    <button
                      onClick={() => {
                        setSearchQuery("dQw4w9WgXcQ");
                        inputRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      dQw4w9WgXcQ
                    </button>
                    <button
                      onClick={() => {
                        setSearchQuery("https://youtu.be/jNQOjAfhHSY");
                        inputRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      youtu.be/jNQOjAfhHSY
                    </button>
                  </div>
                </div>
              </div>

              {/* 카테고리 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <a
                      key={cat.id}
                      href={cat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-3 p-6 bg-[#1a1a1a] hover:bg-[#272727] rounded-xl transition-colors"
                    >
                      <div className="w-12 h-12 bg-red-600/10 group-hover:bg-red-600/20 rounded-full flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6 text-red-500" />
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </a>
                  );
                })}
              </div>

              {/* 안내 */}
              <div className="mt-12 p-6 bg-[#1a1a1a] rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-500" />
                  사용 방법
                </h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• YouTube 영상 URL을 입력하면 광고 없이 재생됩니다</li>
                  <li>• Video ID (11자리)를 직접 입력할 수도 있습니다</li>
                  <li>• 검색어를 입력하면 YouTube에서 검색합니다</li>
                  <li>• 카테고리 버튼을 클릭하면 YouTube의 해당 페이지로 이동합니다</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
