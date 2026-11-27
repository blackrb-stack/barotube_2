// YouTube 데이터 API - 다중 소스 지원
// Invidious, Piped, YouTube RSS 조합

// ==================== Invidious API ====================
const INVIDIOUS_INSTANCES = [
  'https://vid.puffyan.us',
  'https://invidious.snopyta.org',
  'https://yewtu.be',
  'https://invidious.kavin.rocks',
  'https://inv.tux.pizza',
  'https://invidious.fdn.fr',
  'https://vt.roshless.me',
];

// ==================== Piped API ====================
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.projectsegfau.lt',
  'https://pipedapi.in.projectsegfau.lt',
  'https://pipedapi.leptons.xyz',
];

let currentInvidious = 0;
let currentPiped = 0;

// ==================== 타입 ====================
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

// ==================== 카테고리 ====================
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

// ==================== API 호출 ====================

// Invidious API 호출
async function fetchFromInvidious(path: string): Promise<any> {
  for (let i = 0; i < INVIDIOUS_INSTANCES.length; i++) {
    try {
      const instance = INVIDIOUS_INSTANCES[(currentInvidious + i) % INVIDIOUS_INSTANCES.length];
      const response = await fetch(`${instance}${path}`, {
        signal: AbortSignal.timeout(5000) // 5초 타임아웃
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      currentInvidious = (currentInvidious + i) % INVIDIOUS_INSTANCES.length;
      return data;
    } catch (err) {
      continue;
    }
  }
  throw new Error('All Invidious instances failed');
}

// Piped API 호출
async function fetchFromPiped(path: string): Promise<any> {
  for (let i = 0; i < PIPED_INSTANCES.length; i++) {
    try {
      const instance = PIPED_INSTANCES[(currentPiped + i) % PIPED_INSTANCES.length];
      const response = await fetch(`${instance}${path}`, {
        signal: AbortSignal.timeout(5000)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      currentPiped = (currentPiped + i) % PIPED_INSTANCES.length;
      return data;
    } catch (err) {
      continue;
    }
  }
  throw new Error('All Piped instances failed');
}

// 다중 소스에서 데이터 가져오기 (fallback)
async function fetchWithFallback(path: string, transformFn: (data: any, source: string) => VideoItem[]): Promise<VideoItem[]> {
  // 1. Invidious 시도
  try {
    const data = await fetchFromInvidious(path);
    const results = transformFn(data, 'invidious');
    if (results.length > 0) return results;
  } catch (err) {
    console.log('Invidious failed, trying Piped...');
  }

  // 2. Piped 시도
  try {
    const data = await fetchFromPiped(path);
    const results = transformFn(data, 'piped');
    if (results.length > 0) return results;
  } catch (err) {
    console.log('Piped failed');
  }

  throw new Error('All API sources failed');
}

// ==================== 데이터 변환 ====================

// Invidious 응답 변환
function transformInvidiousVideo(item: any): VideoItem {
  return {
    url: `/watch?v=${item.videoId}`,
    title: item.title || '',
    thumbnail: item.videoThumbnails?.[4]?.url || item.videoThumbnails?.[0]?.url || '',
    uploaderName: item.author || '',
    uploaderUrl: item.authorId ? `/channel/${item.authorId}` : '',
    uploaderAvatar: item.authorThumbnails?.[3]?.url || '',
    uploadedDate: item.publishedText || '',
    duration: item.lengthSeconds || 0,
    views: item.viewCount || 0,
    uploaderVerified: item.authorVerified || false,
    isShort: item.lengthSeconds < 60,
    type: item.type || 'video',
  };
}

// Piped 응답 변환
function transformPipedVideo(item: any): VideoItem {
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

// ==================== 메인 함수 ====================

// 트렌딩 영상 가져오기
export async function getTrending(region: string = 'KR'): Promise<VideoItem[]> {
  const path = `/api/v1/trending?region=${region}`;
  
  return fetchWithFallback(path, (data, source) => {
    if (source === 'invidious') {
      return (data || []).map(transformInvidiousVideo).filter((v: VideoItem) => v.type === 'video');
    } else {
      return (data || []).map(transformPipedVideo);
    }
  });
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
  // Invidious 검색
  const invidiousPath = `/api/v1/search?q=${encodeURIComponent(query)}&type=video&region=${region}`;
  
  try {
    const data = await fetchFromInvidious(invidiousPath);
    const results = (data || []).map(transformInvidiousVideo).filter((v: VideoItem) => v.type === 'video');
    if (results.length > 0) return results;
  } catch (err) {
    console.log('Invidious search failed, trying Piped...');
  }

  // Piped 검색
  const pipedPath = `/search?q=${encodeURIComponent(query)}&filter=videos&region=${region}`;
  
  try {
    const data = await fetchFromPiped(pipedPath);
    return (data.items || data || []).map(transformPipedVideo);
  } catch (err) {
    throw new Error('Search failed on all sources');
  }
}

// 영상 정보 가져오기
export async function getVideoInfo(videoId: string) {
  try {
    return await fetchFromInvidious(`/api/v1/videos/${videoId}`);
  } catch {
    return await fetchFromPiped(`/streams/${videoId}`);
  }
}

// ==================== 유틸리티 ====================

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
