# 🚀 BaroTube 배포 가이드

## 📋 목차
1. [웹/PWA 배포](#웹pwa-배포)
2. [데스크톱 앱 배포](#데스크톱-앱-배포)
3. [모바일 앱 배포](#모바일-앱-배포)
4. [자동 배포 (GitHub Actions)](#자동-deploy-github-actions)

---

## 🌐 웹/PWA 배포

### 방법 1: Netlify (추천 - 무료)

#### CLI로 배포
```bash
# 1. Netlify CLI 설치
npm install -g netlify-cli

# 2. 로그인
netlify login

# 3. 배포
./scripts/deploy.sh netlify
```

#### 드래그 앤 드롭으로 배포
1. https://app.netlify.com 접속
2. "Add new site" → "Deploy manually"
3. `dist` 폴더를 드래그 앤 드롭
4. 완료! 자동으로 HTTPS와 PWA 지원

#### GitHub 연동 (자동 배포)
1. Netlify 대시보드 → "Add new site" → "Import an existing project"
2. GitHub 저장소 선택
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. "Deploy site" 클릭
5. 이후 push 시 자동 배포

### 방법 2: Vercel (추천 - 무료)

#### CLI로 배포
```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 배포
./scripts/deploy.sh vercel
```

#### GitHub 연동
1. https://vercel.com 접속
2. "Add New Project" → GitHub 저장소 선택
3. Framework Preset: "Other"
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. "Deploy" 클릭

### 방법 3: GitHub Pages (무료)

```bash
# 1. gh-pages 패키지 설치
npm install -D gh-pages

# 2. package.json에 스크립트 추가
# "deploy": "gh-pages -d dist"

# 3. 배포
npm run build
npm run deploy
```

**GitHub Pages 설정:**
1. 저장소 → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` / `root`
4. Save

**접속 URL:** `https://[username].github.io/[repository]/`

### 방법 4: 커스텀 서버

```bash
# 1. 빌드
npm run build

# 2. dist 폴더를 서버로 업로드
scp -r dist/* user@server:/var/www/barotube/

# 3. Nginx 설정 예시
server {
    listen 80;
    server_name barotube.com;
    root /var/www/barotube;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}
```

---

## 🖥️ 데스크톱 앱 배포

### Windows (.exe)

#### 로컬 빌드
```bash
# Windows 설치 파일 빌드
./scripts/deploy.sh windows

# 생성 파일:
# - release/BaroTube-Setup-1.0.0-x64.exe (64비트 설치)
# - release/BaroTube-1.0.0-x64.exe (64비트 포터블)
# - release/BaroTube-Setup-1.0.0-ia32.exe (32비트 설치)
```

#### 배포 방법
1. **GitHub Releases**
   ```bash
   # GitHub CLI로 릴리즈 생성
   gh release create v1.0.0 release/*.exe --title "v1.0.0" --notes "Release notes"
   ```

2. **직접 배포**
   - exe 파일을 웹 서버에 업로드
   - 다운로드 링크 제공

### macOS (.dmg)

#### 로컬 빌드 (Mac 필수)
```bash
./scripts/deploy.sh macos

# 생성 파일:
# - release/BaroTube-1.0.0-x64.dmg (Intel)
# - release/BaroTube-1.0.0-arm64.dmg (Apple Silicon)
```

#### 코드 서명 (선택)
```bash
# Apple Developer 계정 필요
# electron-builder.json에 추가:
{
  "mac": {
    "identity": "Your Name (Team ID)",
    "entitlements": "build/entitlements.mac.plist"
  }
}
```

### Linux (.AppImage, .deb)

```bash
./scripts/deploy.sh linux

# 생성 파일:
# - release/BaroTube-1.0.0-x64.AppImage
# - release/barotube_1.0.0_amd64.deb
```

**AppImage 배포:**
```bash
# 실행 권한 부여
chmod +x BaroTube-1.0.0-x64.AppImage

# 실행
./BaroTube-1.0.0-x64.AppImage
```

**deb 패키지 설치:**
```bash
sudo dpkg -i barotube_1.0.0_amd64.deb
```

---

## 📱 모바일 앱 배포

### Android (APK)

#### 로컬 빌드
```bash
# Android 프로젝트 초기화 (최초 1회)
npm run cap:add:android

# APK 빌드
./scripts/deploy.sh android

# APK 위치:
# android/app/build/outputs/apk/release/app-release.apk
```

#### 배포 방법

**1. 직접 배포 (APK 파일)**
```bash
# APK를 웹 서버에 업로드
scp android/app/build/outputs/apk/release/app-release.apk user@server:/var/www/downloads/
```

**2. Google Play Store**
```bash
# 1. Android Studio에서 프로젝트 열기
npm run cap:open:android

# 2. Build → Generate Signed Bundle / APK
# 3. Google Play Console에 업로드
```

**3. Firebase App Distribution (테스트)**
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# APK 업로드
firebase appdistribution:distribute app-release.apk \
  --app YOUR_APP_ID \
  --groups "testers"
```

### iOS (IPA)

#### 로컬 빌드 (Mac 필수)
```bash
# iOS 프로젝트 초기화 (최초 1회)
npm run cap:add:ios

# Xcode 열기
npm run cap:open:ios
```

#### Xcode에서 빌드
1. Product → Destination → 실제 기기 선택
2. Product → Archive
3. Window → Organizer
4. "Distribute App" 클릭
5. 배포 방법 선택:
   - App Store Connect
   - Ad Hoc
   - Enterprise

#### TestFlight 배포
1. Archive → Distribute → App Store Connect
2. Upload 완료 후 TestFlight에서 테스트
3. 테스트 초대장 발송

#### App Store 배포
1. App Store Connect에서 앱 등록
2. 스크린샷, 설명, 아이콘 등 준비
3. Archive → Upload to App Store
4. 심사 제출

---

## 🔄 자동 배포 (GitHub Actions)

### 설정 방법

1. **GitHub Secrets 설정**
   - 저장소 → Settings → Secrets and variables → Actions
   - 다음 시크릿 추가:

   ```
   NETLIFY_AUTH_TOKEN=<Netlify Access Token>
   NETLIFY_SITE_ID=<Netlify Site ID>
   ```

2. **Netlify Token 발급**
   - https://app.netlify.com/user/applications
   - "New access token" 생성

3. **Netlify Site ID 확인**
   - Netlify 대시보드 → Site settings → General
   - "Site ID" 복사

### 자동 배포 흐름

```
Push to main/master
    ↓
[GitHub Actions 트리거]
    ↓
┌─────────────┬─────────────┬─────────────┐
│  Web Build  │   Windows   │    macOS    │
│  + Netlify  │   .exe      │    .dmg     │
└─────────────┴─────────────┴─────────────┘
    ↓
[Linux + Android 빌드]
    ↓
[GitHub Release 생성]
    ↓
모든 파일이 Release에 자동 업로드
```

### 수동 트리거
```bash
# GitHub CLI로 워크플로우 수동 실행
gh workflow run deploy.yml
```

---

## 📦 배포 체크리스트

### 웹 배포 전
- [ ] `npm run build` 성공 확인
- [ ] `dist` 폴더 생성 확인
- [ ] PWA 매니페스트 확인
- [ ] Service Worker 동작 확인
- [ ] HTTPS 환경에서 테스트

### 데스크톱 배포 전
- [ ] 각 플랫폼에서 빌드 성공 확인
- [ ] 설치 파일 크기 확인
- [ ] Windows: 32비트/64비트 모두 빌드
- [ ] macOS: Intel/Apple Silicon 모두 빌드
- [ ] Linux: AppImage, deb 모두 빌드

### 모바일 배포 전
- [ ] Android: minSdkVersion 확인 (21)
- [ ] Android: APK 서명 확인
- [ ] iOS: Provisioning Profile 확인
- [ ] iOS: App Icons 모든 크기 준비
- [ ] 테스트 기기에서 동작 확인

---

## 🐛 문제 해결

### Netlify 배포 실패
```bash
# 로컬에서 테스트
netlify deploy --dir=dist

# 로그 확인
netlify logs
```

### GitHub Pages 404 오류
```bash
# vite.config.js에 base 경로 추가
export default defineConfig({
  base: '/repository-name/',
  // ...
})
```

### Electron 빌드 실패
```bash
# 캐시 삭제
rm -rf node_modules
rm -rf release
npm install

# Windows: 관리자 권한으로 실행
# macOS: Xcode Command Line Tools 설치
xcode-select --install
```

### Android 빌드 실패
```bash
# Android SDK 경로 확인
echo $ANDROID_HOME

# Gradle 캐시 삭제
cd android
./gradlew clean
```

---

## 📊 배포 후 모니터링

### Netlify
- 대시보드 → Analytics
- 배포 로그 확인
- 폼 제출 모니터링

### Vercel
- 대시보드 → Analytics
- Edge Network 상태 확인

### GitHub Releases
- 다운로드 통계 확인
- 이슈 모니터링

---

## 🔐 보안 설정

### 환경 변수
```bash
# .env 파일 생성 (git에 커밋하지 마세요!)
VITE_API_URL=https://api.barotube.com
VITE_ANALYTICS_ID=UA-XXXXX
```

### CSP (Content Security Policy)
```html
<!-- index.html <head>에 추가 -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               frame-src https://www.youtube.com;">
```

---

## 📞 지원

배포 관련 문제:
- GitHub Issues: https://github.com/yourusername/barotube/issues
- Email: support@barotube.com

---

**배포 완료 후:**
1. 실제 기기에서 테스트
2. PWA 설치 테스트
3. 오프라인 동작 확인
4. 성능 측정 (Lighthouse)
5. 사용자 피드백 수집
