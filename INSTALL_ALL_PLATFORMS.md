# 📱 BaroTube 설치 방법 (모든 플랫폼)

## ⚡ 가장 쉬운 방법: PWA 설치 (5분)

**PWA(Progressive Web App)를 사용하면 모든 플랫폼에서 앱처럼 설치할 수 있습니다!**

### 1단계: 웹 배포

```bash
# Netlify에 배포 (가장 쉬움)
npm run deploy:netlify

# 또는 Vercel
npm run deploy:vercel

# 또는 GitHub Pages
npm run deploy:github-pages
```

배포 완료 후 URL을 받습니다: `https://barotube.netlify.app`

### 2단계: 각 플랫폼에서 설치

---

## 🖥️ Windows (윈도우)

### 방법 1: Chrome/Edge에서 설치 (권장)

1. 배포된 URL 접속 (예: `https://barotube.netlify.app`)
2. 주소창 오른쪽의 **"앱 설치"** 아이콘 클릭 (📥)
3. 또는 메뉴 (⋮) → **"앱 설치"**
4. 설치 완료! 바탕화면에 바로가기가 생성됩니다.

### 방법 2: .exe 설치 파일 빌드

**Windows 컴퓨터에서:**
```bash
git clone <repository-url>
cd barotube
npm install
npm run electron:build:win
```

**결과:** `release/BaroTube-Setup-1.0.0-x64.exe`

---

## 🍎 macOS (맥)

### 방법 1: Safari에서 설치 (권장)

1. 배포된 URL 접속
2. Safari → 파일 → **"Dock에 추가"**
3. 또는 공유 버튼 → **"홈 화면에 추가"** (macOS Sonoma+)
4. 설치 완료!

### 방법 2: Chrome에서 설치

1. 배포된 URL 접속
2. Chrome 메뉴 → **"BaroTube 설치..."**
3. 설치 완료!

### 방법 3: .dmg 설치 파일 빌드

**Mac에서:**
```bash
git clone <repository-url>
cd barotube
npm install
npm run electron:build:mac
```

**결과:** `release/BaroTube-1.0.0-arm64.dmg`

---

## 🤖 Android (안드로이드)

### 방법 1: Chrome에서 설치 (권장)

1. 배포된 URL 접속 (Chrome 브라우저)
2. 메뉴 (⋮) → **"앱 설치"** 또는 **"홈 화면에 추가"**
3. 설치 확인
4. 홈 화면에 BaroTube 아이콘이 추가됩니다!

**지원:** Android 5.0+ (Lollipop)

### 방법 2: APK 파일 설치

**Android Studio가 있는 컴퓨터에서:**
```bash
git clone <repository-url>
cd barotube
npm install
npm run cap:add:android
npm run build:android
```

**결과:** `android/app/build/outputs/apk/release/app-release.apk`

**APK 설치:**
1. APK를 Android 기기로 전송
2. 설정 → 보안 → "출처를 알 수 없는 앱" 허용
3. APK 파일 실행 → 설치

---

## 🍏 iOS (아이폰/아이패드)

### 방법 1: Safari에서 설치 (유일한 방법)

1. 배포된 URL 접속 (**Safari 브라우저 필수**)
2. 하단 공유 버튼 (📤) 탭
3. 스크롤하여 **"홈 화면에 추가"** 선택
4. "추가" 탭
5. 홈 화면에 BaroTube 아이콘이 추가됩니다!

**지원:** iOS 12.0+

**주의:**
- Safari에서만 PWA 설치 가능
- Chrome, Firefox 등 다른 브라우저에서는 설치 불가

### 방법 2: 앱 스토어 배포 (복잡함)

**Mac + Apple Developer 계정 필요:**
```bash
git clone <repository-url>
cd barotube
npm install
npm run cap:add:ios
npm run cap:open:ios
# Xcode에서 빌드 → Archive → App Store 제출
```

---

## 🐧 Linux

### 방법 1: Chrome에서 설치 (권장)

1. 배포된 URL 접속
2. Chrome 메뉴 → **"BaroTube 설치..."**
3. 설치 완료!

### 방법 2: .AppImage 파일

**Linux에서:**
```bash
git clone <repository-url>
cd barotube
npm install
npm run electron:build:linux
```

**결과:** `release/BaroTube-1.0.0-x64.AppImage`

**실행:**
```bash
chmod +x BaroTube-1.0.0-x64.AppImage
./BaroTube-1.0.0-x64.AppImage
```

---

## 📊 플랫폼별 설치 방법 비교

| 플랫폼 | PWA 설치 | 네이티브 앱 | 권장 방법 |
|--------|----------|-------------|-----------|
| **Windows** | ✅ Chrome/Edge | .exe | PWA (간단) |
| **macOS** | ✅ Safari/Chrome | .dmg | PWA (간단) |
| **Android** | ✅ Chrome | .apk | PWA (자동 업데이트) |
| **iOS** | ✅ Safari | .ipa (심사 필요) | PWA (유일) |
| **Linux** | ✅ Chrome | .AppImage | PWA 또는 AppImage |

---

## 🎯 왜 PWA가 최선인가?

### PWA 장점

1. **모든 플랫폼에서 동일한 코드**
   - 한 번 배포하면 모든 기기에서 사용 가능

2. **자동 업데이트**
   - 서버에서 업데이트하면 즉시 모든 사용자에게 적용

3. **앱 스토어 심사 불필요**
   - 즉시 배포 가능

4. **작은 용량**
   - 네이티브 앱보다 훨씬 가벼움

5. **빠른 배포**
   - 빌드 → 배포 → 즉시 사용

### 네이티브 앱이 필요한 경우

- 오프라인 기능 강화
- 하드웨어 접근 (카메라, GPS 등)
- 앱 스토어 노출
- iOS 푸시 알림

---

## 🔧 PWA 설치 문제 해결

### 설치 버튼이 안 보일 때

1. **HTTPS 환경인지 확인**
   - PWA는 HTTPS에서만 작동
   - Netlify, Vercel은 자동으로 HTTPS 제공

2. **브라우저가 PWA를 지원하는지 확인**
   - Chrome 63+, Firefox 67+, Safari 12+, Edge 79+

3. **캐시 삭제 후 다시 시도**
   ```
   Ctrl + Shift + Delete (Windows)
   Cmd + Shift + Delete (Mac)
   ```

### Android에서 설치 안될 때

1. **Chrome WebView 업데이트**
   - Play Store → "Android System WebView" 검색
   - 최신 버전으로 업데이트

2. **Chrome 브라우저 사용**
   - 다른 브라우저에서는 PWA 설치 불가

### iOS에서 설치 안될 때

1. **Safari 브라우저 사용**
   - Chrome, Firefox 등 다른 브라우저에서는 설치 불가

2. **iOS 12 이상 확인**
   - 설정 → 일반 → 정보 → iOS 버전

---

## 📦 네이티브 앱 빌드 (고급 사용자)

### 모든 플랫폼 한 번에 빌드

```bash
# Linux/Mac
./scripts/deploy.sh all

# Windows
deploy.bat all
```

### 개별 플랫폼 빌드

```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux

# Android
npm run build:android

# iOS (Mac only)
npm run build:ios
```

---

## ✅ 설치 완료 후 확인

### PWA 설치 확인

**데스크톱:**
- 바탕화면에 BaroTube 아이콘이 있는지 확인
- 아이콘 더블클릭 → 앱처럼 실행되는지 확인

**모바일:**
- 홈 화면에 BaroTube 아이콘이 있는지 확인
- 아이콘 탭 → 전체 화면으로 실행되는지 확인

### 기능 테스트

- [ ] 영상 검색
- [ ] 카테고리 필터
- [ ] 영상 재생
- [ ] 오프라인 접속 (PWA)

---

## 📞 지원

설치 관련 문제:
- GitHub Issues: https://github.com/yourusername/barotube/issues
- Email: support@barotube.com

---

**결론:** PWA를 사용하면 모든 플랫폼에서 쉽게 설치할 수 있습니다. 네이티브 앱 빌드는 고급 사용자를 위한 옵션입니다.
