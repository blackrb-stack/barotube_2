# BaroTube 설치 가이드

## 📱 플랫폼별 설치 방법

### 🖥️ Windows (윈도우)

#### 방법 1: PWA 설치 (권장 - 간단)
1. Chrome 또는 Edge 브라우저로 BaroTube 웹사이트 접속
2. 주소창 오른쪽의 **"앱 설치"** 아이콘 클릭
3. 또는 헤더의 빨간 **"설치"** 버튼 클릭
4. 설치 완료! 바탕화면에 바로가기가 생성됩니다.

#### 방법 2: Electron 앱 (exe 설치 파일)
```bash
# 1. 프로젝트 클론 및 의존성 설치
git clone <repository-url>
cd barotube
npm install

# 2. Windows용 exe 파일 빌드
npm run electron:build:win

# 3. release 폴더에서 설치 파일 찾기
# - BaroTube-Setup-1.0.0-x64.exe (64비트 설치)
# - BaroTube-1.0.0-x64.exe (64비트 포터블)
# - BaroTube-Setup-1.0.0-ia32.exe (32비트 설치)
```

**지원 Windows 버전:**
- Windows 10 (64비트/32비트)
- Windows 11
- Windows 8.1 (32비트/64비트)
- Windows 7 SP1 (32비트/64비트)

---

### 🍎 macOS (맥)

#### 방법 1: PWA 설치 (권장 - 간단)
1. Safari 또는 Chrome 브라우저로 BaroTube 웹사이트 접속
2. Safari: 공유 버튼 → **"Dock에 추가"**
3. Chrome: 주소창의 **"앱 설치"** 아이콘 클릭

#### 방법 2: Electron 앱 (dmg 설치 파일)
```bash
# 1. 프로젝트 클론 및 의존성 설치
git clone <repository-url>
cd barotube
npm install

# 2. macOS용 dmg 파일 빌드
npm run electron:build:mac

# 3. release 폴더에서 설치 파일 찾기
# - BaroTube-1.0.0-x64.dmg (Intel Mac)
# - BaroTube-1.0.0-arm64.dmg (Apple Silicon M1/M2)
```

**지원 macOS 버전:**
- macOS 10.13 (High Sierra) 이상
- Intel Mac 및 Apple Silicon (M1/M2/M3) 지원

---

### 🤖 Android (안드로이드)

#### 방법 1: PWA 설치 (권장 - 간단)
1. Chrome 브라우저로 BaroTube 웹사이트 접속
2. 메뉴 (⋮) → **"앱 설치"** 또는 **"홈 화면에 추가"**
3. 설치 확인 → 홈 화면에 아이콘 추가

**지원 Android 버전:**
- Android 5.0 (Lollipop) 이상
- Chrome 63 이상

#### 방법 2: APK 파일 (네이티브 앱)
```bash
# 1. 프로젝트 클론 및 의존성 설치
git clone <repository-url>
cd barotube
npm install

# 2. Android 프로젝트 초기화 (최초 1회)
npm run cap:add:android

# 3. Android APK 빌드
npm run build:android

# 4. APK 파일 위치
# android/app/build/outputs/apk/release/app-release.apk
```

**APK 설치 방법:**
1. 생성된 APK 파일을 안드로이드 기기로 전송
2. 설정 → 보안 → **"출처를 알 수 없는 앱 설치"** 허용
3. APK 파일 실행 → 설치

**지원 Android 버전:**
- Android 5.0 (API 21, Lollipop) 이상
- Android 6.0, 7.0, 8.0, 9.0, 10, 11, 12, 13, 14 모두 지원

**Android 구버전 (5.0-7.0) 추가 설정:**
```bash
# Android Studio에서 android 폴더 열기
npm run cap:open:android

# app/build.gradle에서 minSdkVersion 확인
# minSdkVersion 21 (Android 5.0)

# WebView 업데이트 필요 여부 확인
# Android 5.0-6.0: Chrome WebView 업데이트 필요
# Android 7.0+: 기본 WebView 사용 가능
```

---

### 🍏 iOS (아이폰/아이패드)

#### 방법 1: PWA 설치 (권장 - 간단)
1. Safari 브라우저로 BaroTube 웹사이트 접속
2. 공유 버튼 (📤) → **"홈 화면에 추가"**
3. 추가 → 홈 화면에 아이콘 추가

**지원 iOS 버전:**
- iOS 12.0 이상
- Safari 브라우저 필수

#### 방법 2: IPA 파일 (네이티브 앱)
```bash
# 1. 프로젝트 클론 및 의존성 설치
git clone <repository-url>
cd barotube
npm install

# 2. iOS 프로젝트 초기화 (최초 1회, Mac 필수)
npm run cap:add:ios

# 3. iOS 빌드 (Xcode 열기)
npm run build:ios

# 4. Xcode에서:
#    - 개발자 계정 설정
#    - Provisioning Profile 설정
#    - Product → Archive → Distribute App
```

**지원 iOS 버전:**
- iOS 12.0 이상
- iPhone, iPad 모두 지원

**필수 요구사항:**
- Mac 컴퓨터
- Xcode 14 이상
- Apple Developer Account (앱 스토어 배포 시)

---

## 🔧 개발자용 빌드 명령어

### 전체 빌드
```bash
# 웹 빌드
npm run build

# Electron (데스크톱)
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux

# 모바일
npm run build:android         # Android APK
npm run build:ios             # iOS (Mac only)
```

### 개발 모드
```bash
# 웹 개발 서버
npm run dev

# Electron 개발
npm run electron:dev
```

---

## 📋 시스템 요구사항

### 웹/PWA
- **브라우저**: Chrome 63+, Firefox 67+, Safari 12+, Edge 79+
- **Android**: 5.0+ with Chrome 63+
- **iOS**: 12.0+ with Safari

### Electron (데스크톱)
- **Windows**: 7 SP1+, 32비트/64비트
- **macOS**: 10.13+, Intel/Apple Silicon
- **Linux**: Ubuntu 18.04+, Debian 10+, Fedora 32+

### 모바일 네이티브
- **Android**: 5.0+ (API 21+)
- **iOS**: 12.0+
- **빌드 도구**: 
  - Android: Android Studio, JDK 11+
  - iOS: Mac with Xcode 14+

---

## 🐛 문제 해결

### Android 구버전에서 영상이 재생되지 않는 경우
1. Chrome WebView 업데이트 확인
   - Play Store → Chrome WebView → 업데이트
2. Android 5.0-6.0: 최신 WebView 필수
3. Android 7.0+: 기본 WebView 사용 가능

### PWA가 설치되지 않는 경우
1. HTTPS 환경에서만 설치 가능
2. 브라우저가 PWA를 지원하는지 확인
3. 캐시 삭제 후 다시 시도

### Electron 앱이 느린 경우
1. GPU 가속 활성화 확인
2. 하드웨어 가속 끄기/켜기 시도
3. 최신 그래픽 드라이버 설치

---

## 📞 지원

- 이슈 리포트: GitHub Issues
- 이메일: support@barotube.com

---

## 📄 라이선스

MIT License
