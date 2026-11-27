# 🎬 BaroTube

**YouTube 영상을 광고 없이 빠르게 시청하는 크로스 플랫폼 앱**

![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 주요 기능

- 🎬 **광고 없이 영상 재생** - YouTube URL 또는 Video ID로 바로 재생
- 📱 **크로스 플랫폼** - Windows, macOS, Linux, Android, iOS 지원
- 📴 **오프라인 지원** - PWA로 설치 후 오프라인에서도 사용 가능
- 📜 **시청 기록** - 최근 시청한 영상 자동 저장
- 🎨 **다크 모드** - 눈이 편안한 다크 UI
- 📲 **앱 설치** - 홈 화면에 바로가기로 빠른 접근

## 📦 설치 방법

### 🌐 웹/PWA (모든 플랫폼) - GitHub Pages

**라이브 데모:** `https://YOUR_USERNAME.github.io/barotube/`

1. 웹 브라우저로 접속
2. 브라우저의 **"앱 설치"** 또는 **"홈 화면에 추가"** 클릭
3. 완료!

**GitHub Pages에 배포:**
```bash
# 1. GitHub 저장소 생성 후
git push origin main

# 2. Settings → Pages → GitHub Actions 선택
# 3. 자동 배포 완료!
```

**지원 브라우저:**
- Chrome 63+ (Android 5.0+)
- Firefox 67+
- Safari 12+ (iOS 12+)
- Edge 79+

### 🖥️ 데스크톱 (Windows/macOS/Linux)

#### Windows
```bash
# 설치 파일 빌드
npm run electron:build:win

# 생성 파일:
# - BaroTube-Setup-1.0.0-x64.exe (64비트 설치)
# - BaroTube-1.0.0-x64.exe (64비트 포터블)
# - BaroTube-Setup-1.0.0-ia32.exe (32비트 설치)
```

**지원:** Windows 7 SP1+, 8.1, 10, 11 (32비트/64비트)

#### macOS
```bash
# 설치 파일 빌드
npm run electron:build:mac

# 생성 파일:
# - BaroTube-1.0.0-x64.dmg (Intel Mac)
# - BaroTube-1.0.0-arm64.dmg (Apple Silicon M1/M2/M3)
```

**지원:** macOS 10.13+ (Intel & Apple Silicon)

#### Linux
```bash
# 설치 파일 빌드
npm run electron:build:linux

# 생성 파일:
# - BaroTube-1.0.0-x64.AppImage
# - barotube_1.0.0_amd64.deb
```

**지원:** Ubuntu 18.04+, Debian 10+, Fedora 32+

### 🤖 Android

#### 방법 1: PWA (권장)
1. Chrome으로 웹사이트 접속
2. 메뉴 → **"앱 설치"** 또는 **"홈 화면에 추가"**
3. 완료!

**지원:** Android 5.0+ (Lollipop)

#### 방법 2: APK 파일
```bash
# Android 프로젝트 초기화 (최초 1회)
npm run cap:add:android

# APK 빌드
npm run build:android

# APK 위치:
# android/app/build/outputs/apk/release/app-release.apk
```

**지원:** Android 5.0+ (API 21+)

**Android 구버전 (5.0-7.0) 주의사항:**
- Chrome WebView 업데이트 필요
- Play Store에서 "Android System WebView" 검색 후 업데이트

### 🍏 iOS

#### 방법 1: PWA (권장)
1. Safari로 웹사이트 접속
2. 공유 버튼 → **"홈 화면에 추가"**
3. 완료!

**지원:** iOS 12.0+

#### 방법 2: IPA 파일
```bash
# iOS 프로젝트 초기화 (Mac 필수, 최초 1회)
npm run cap:add:ios

# iOS 빌드 (Xcode 열기)
npm run build:ios

# Xcode에서 빌드 및 배포
```

**지원:** iOS 12.0+ (iPhone, iPad)

**필수 요구사항:**
- Mac 컴퓨터
- Xcode 14+
- Apple Developer Account (앱 스토어 배포 시)

## 🚀 개발

### 설치
```bash
npm install
```

### 개발 서버
```bash
# 웹 개발 서버
npm run dev

# Electron 개발
npm run electron:dev
```

### 빌드
```bash
# 웹 빌드
npm run build

# 전체 플랫폼 빌드
npm run electron:build        # 모든 데스크톱 플랫폼
npm run electron:build:win    # Windows만
npm run electron:build:mac    # macOS만
npm run electron:build:linux  # Linux만

# 모바일 빌드
npm run build:android         # Android APK
npm run build:ios             # iOS (Mac only)
```

## 📋 시스템 요구사항

### 웹/PWA
| 플랫폼 | 최소 버전 | 비고 |
|--------|-----------|------|
| Chrome | 63+ | Android 5.0+ |
| Firefox | 67+ | |
| Safari | 12+ | iOS 12+ |
| Edge | 79+ | |

### 데스크톱 (Electron)
| OS | 최소 버전 | 아키텍처 |
|----|-----------|----------|
| Windows | 7 SP1+ | 32비트, 64비트 |
| macOS | 10.13+ | Intel, Apple Silicon |
| Linux | Ubuntu 18.04+ | 64비트 |

### 모바일 (네이티브)
| OS | 최소 버전 | API 레벨 |
|----|-----------|----------|
| Android | 5.0 (Lollipop) | API 21 |
| iOS | 12.0 | |

## 🛠️ 기술 스택

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **PWA**: Vite PWA Plugin, Workbox
- **Desktop**: Electron
- **Mobile**: Capacitor
- **Build**: Vite, Terser

## 📱 플랫폼별 호환성

### Android 구버전 지원 (5.0-7.0)

BaroTube는 Android 5.0 (Lollipop)부터 지원합니다. 구버전 Android에서 최적의 경험을 위해:

1. **Chrome WebView 업데이트** (필수)
   - Play Store → "Android System WebView" 검색
   - 최신 버전으로 업데이트

2. **WebView 버전 확인**
   - 설정 → 앱 → Android System WebView
   - 버전 63 이상 필요

3. **Known Issues**
   - Android 5.0-6.0: 일부 애니메이션이 느릴 수 있음
   - Android 7.0+: 원활한 동작

### iOS 구버전 지원 (12-14)

1. **Safari 필수**
   - PWA 설치는 Safari만 지원
   - 다른 브라우저에서는 PWA 설치 불가

2. **iOS 12-14 주의사항**
   - 일부 최신 CSS 기능 제한
   - PWA 오프라인 지원 제한적

## 📄 라이선스

MIT License

## 🤝 기여

이슈와 PR을 환영합니다!

## 📞 지원

- 이슈: GitHub Issues
- 이메일: support@barotube.com

---

**BaroTube** - YouTube 영상을 더 빠르고 편리하게 시청하세요! 🎬
