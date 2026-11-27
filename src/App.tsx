import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  Play,
  X,
  Youtube,
  Menu,
  Bell,
  User,
  ExternalLink,
  CheckCircle2,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getTrending,
  getTrendingByCategory,
  searchVideos,
  CATEGORIES,
  type VideoItem,
  formatViews,
  formatDuration,
  extractVideoId,
} from "./api/youtube";

// ==================== 타입 ====================
type Tab = "home" | "player";

// ==================== 유틸 ====================
function extractVideoIdFromInput(input: string): string | null {
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
  const [tab, setTab] = useState<Tab>("home");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [region, setRegion] = useState("KR");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 피드 로드
  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let results: VideoItem[];

      if (activeSearch) {
        results = await searchVideos(activeSearch, region);
      } else {
        results = await getTrendingByCategory(selectedCategory, region);
      }

      setVideos(results);
    } catch (err) {
      setError("영상을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, activeSearch, region]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  // 검색 실행
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setActiveSearch(searchQuery.trim());
    setSelectedCategory("all");
  };

  // 카테고리 변경
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setActiveSearch("");
    setSearchQuery("");
  };

  // 영상 재생
  const handlePlayVideo = (videoId: string) => {
    setPlayingVideoId(videoId);
    setTab("player");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 뒤로가기
  const handleBack = () => {
    setPlayingVideoId(null);
    setTab("home");
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
                setActiveSearch("");
                setSearchQuery("");
                setSelectedCategory("all");
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
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="검색"
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
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id && !activeSearch
                  ? "bg-white text-black font-medium"
                  : "bg-[#272727] text-white hover:bg-[#3a3a3a]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ===== 메인 콘텐츠 ===== */}
      <main className="pt-28 pb-8">
        <AnimatePresence mode="wait">
          {tab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4"
            >
              {/* 검색 결과 헤더 */}
              {activeSearch && (
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">
                    "{activeSearch}" 검색 결과
                  </h2>
                  <button
                    onClick={() => {
                      setActiveSearch("");
                      setSearchQuery("");
                    }}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    전체 보기
                  </button>
                </div>
              )}

              {/* 로딩 */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
                  <p className="text-gray-400">영상을 불러오는 중...</p>
                </div>
              )}

              {/* 에러 */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={loadFeed}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시 시도
                  </button>
                </div>
              )}

              {/* 비디오 그리드 */}
              {!loading && !error && videos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Youtube className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-400">표시할 영상이 없습니다</p>
                </div>
              )}

              {!loading && !error && videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videos.map((video, idx) => (
                    <VideoCard
                      key={video.url + idx}
                      video={video}
                      onPlay={() =>
                        handlePlayVideo(extractVideoId(video.url))
                      }
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4"
            >
              {playingVideoId && (
                <PlayerView
                  videoId={playingVideoId}
                  onBack={handleBack}
                  onPlayVideo={handlePlayVideo}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==================== 비디오 카드 ====================
function VideoCard({
  video,
  onPlay,
  index,
}: {
  video: VideoItem;
  onPlay: () => void;
  index: number;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.5) }}
      className="cursor-pointer group"
      onClick={onPlay}
    >
      {/* 썸네일 */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1a1a1a] mb-3">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
        )}
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* 재생 오버레이 */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* 영상 길이 */}
        {video.duration > 0 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-medium">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>

      {/* 정보 */}
      <div className="flex gap-3">
        {/* 채널 아바타 */}
        <div className="shrink-0">
          {video.uploaderAvatar ? (
            <img
              src={video.uploaderAvatar}
              alt=""
              className="w-9 h-9 rounded-full bg-[#272727]"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#272727] flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
          )}
        </div>

        {/* 텍스트 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium leading-5 line-clamp-2 mb-1 group-hover:text-white text-gray-200">
            {video.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="hover:text-gray-300 truncate">
              {video.uploaderName}
            </span>
            {video.uploaderVerified && (
              <CheckCircle2 className="w-3 h-3 text-gray-400 shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {video.views > 0 && (
              <>
                <span>조회수 {formatViews(video.views)}회</span>
                <span className="mx-1">•</span>
              </>
            )}
            <span>{video.uploadedDate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== 플레이어 뷰 ====================
function PlayerView({
  videoId,
  onBack,
  onPlayVideo,
}: {
  videoId: string;
  onBack: () => void;
  onPlayVideo: (id: string) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-4 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
        <span>돌아가기</span>
      </button>

      {/* 플레이어 */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl mb-4">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="BaroTube Player"
          />
        </div>
      </div>

      {/* 영상 정보 */}
      <div className="flex items-center justify-between mb-6">
        <code className="text-sm bg-white/10 px-3 py-1.5 rounded-lg font-mono">
          {videoId}
        </code>
        <a
          href={`https://youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden sm:inline">YouTube에서 열기</span>
        </a>
      </div>
    </div>
  );
}
