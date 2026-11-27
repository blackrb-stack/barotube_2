// Piped API - YouTube 데이터를 API 키 없이 가져오는 서비스
// https://github.com/TeamPiped/Piped

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.projectsegfau.lt',
  'https://pipedapi.in.projectsegfau.lt',
];

let currentInstance = 0;

function getInstance() {
  return PIPED_INSTANCES[currentInstance];
}

function rotateInstance() {
  currentInstance = (currentInstance + 1) % PIPED_INSTANCES.length;
  return PIPED_INSTANCES[currentInstance];
}

async function fetchWithFallback(path: string) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < PIPED_INSTANCES.length; i++) {
    try {
      const instance = PIPED_INSTANCES[(currentInstance + i) % PIPED_INSTANCES.length];
      const response = await fetch(`${instance}${path}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      lastError = err as Error;
      continue;
    }
  }
  
  throw lastError || new Error('All Piped instances failed');
}

export interface VideoItem {
  url: string;
  title: string;
  thumbnail: string;
  uploaderName: string;
  uploaderUrl: string;
  uploaderAvatar?: string;
  uploadedDate: string;
  duration: number;
  views: number;
  uploaderVerified?: boolean;
  isShort?: boolean;
  type?: string;
}

export interface Category {
  name: string;
  id: string;
}

// 카테고리 목록 (YouTube 홈페이지 카테고리)
export const CATEGORIES: Category[] = [
  { name: '전체', id: 'all' },
  { name: '음악', id: 'music' },
  { name: '게임', id: 'gaming' },
  { name: '뉴스', id: 'news' },
  { name: '영화', id: 'movies' },
  { name: '라이브', id: 'live' },
  { name: '요리', id: 'cooking' },
  { name: '스포츠', id: 'sports' },
];

// 트렌딩 영상 가져오기
export async function getTrending(region: string = 'KR'): Promise<VideoItem[]> {
  const data = await fetchWithFallback(`/trending?region=${region}`);
  return data.map(normalizeVideo);
}

// 카테고리별 트렌딩
export async function getTrendingByCategory(category: string, region: string = 'KR'): Promise<VideoItem[]> {
  if (category === 'all') {
    return getTrending(region);
  }
  
  const categoryMap: Record<string, string> = {
    music: '음악',
    gaming: '게임',
    news: '뉴스',
    movies: '영화',
    live: '라이브',
    cooking: '요리',
    sports: '스포츠',
  };
  
  const searchQuery = categoryMap[category] || category;
  return searchVideos(searchQuery, region);
}

// 검색
export async function searchVideos(query: string, region: string = 'KR'): Promise<VideoItem[]> {
  const data = await fetchWithFallback(`/search?q=${encodeURIComponent(query)}&filter=videos&region=${region}`);
  return (data.items || data || []).map(normalizeVideo);
}

// 추천 영상 (홈 피드)
export async function getHomeFeed(region: string = 'KR'): Promise<VideoItem[]> {
  try {
    // Piped는 직접적인 "home feed"가 없으므로 trending + 인기 검색어 조합
    const trending = await getTrending(region);
    return trending;
  } catch {
    return [];
  }
}

// 채널 영상 가져오기
export async function getChannelVideos(channelId: string): Promise<VideoItem[]> {
  const data = await fetchWithFallback(`/channels/tabs?data=${channelId}&tab=videos`);
  return (data.content || []).map(normalizeVideo);
}

// 영상 정보 가져오기
export async function getVideoInfo(videoId: string) {
  return fetchWithFallback(`/streams/${videoId}`);
}

// 영상 정규화
function normalizeVideo(item: any): VideoItem {
  const videoId = item.url?.replace('/watch?v=', '') || '';
  
  return {
    url: item.url || '',
    title: item.title || '',
    thumbnail: item.thumbnail || '',
    uploaderName: item.uploaderName || '',
    uploaderUrl: item.uploaderUrl || '',
    uploaderAvatar: item.uploaderAvatar || '',
    uploadedDate: item.uploadedDate || '',
    duration: item.duration || 0,
    views: item.views || 0,
    uploaderVerified: item.uploaderVerified || false,
    isShort: item.isShort || false,
    type: item.type || 'stream',
  };
}

// 포맷 유틸리티
export function formatViews(views: number): string {
  if (views >= 100000000) {
    return `${(views / 100000000).toFixed(1)}억`;
  }
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}만`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}천`;
  }
  return views.toString();
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) return '';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function extractVideoId(url: string): string {
  return url.replace('/watch?v=', '');
}
