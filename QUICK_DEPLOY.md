# 🚀 빠른 배포 가이드

## ⚡ 가장 빠른 배포 방법 (5분)

### 1️⃣ Netlify에 즉시 배포 (드래그 앤 드롭)

```bash
# 1. 빌드
npm run build

# 2. https://app.netlify.com 접속
# 3. "Add new site" → "Deploy manually"
# 4. dist 폴더를 드래그 앤 드롭
# 5. 완료! 즉시 사용 가능한 URL 제공
```

**결과:** `https://random-name-123456.netlify.app`

---

### 2️⃣ Vercel에 즉시 배포

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 배포
vercel

# 3. 프롬프트에 따라 설정
# 4. 완료!
```

**결과:** `https://barotube.vercel.app`

---

### 3️⃣ GitHub Pages에 배포

```bash
# 1. gh-pages 설치
npm install -D gh-pages

# 2. 배포
npm run deploy:github-pages
```

**결과:** `https://username.github.io/barotube`

---

## 🎯 플랫폼별 배포 명령어

### 웹/PWA
```bash
# Netlify
npm run deploy:netlify

# Vercel
npm run deploy:vercel

# GitHub Pages
npm run deploy:github-pages

# 수동 배포
npm run deploy:web
# → dist 폴더를 서버에 업로드
```

### 데스크톱 앱
```bash
# Windows (.exe)
npm run electron:build:win
# → release/*.exe

# macOS (.dmg)
npm run electron:build:mac
# → release/*.dmg

# Linux (.AppImage, .deb)
npm run electron:build:linux
# → release/*.AppImage, release/*.deb
```

### 모바일 앱
```bash
# Android (APK)
npm run build:android
# → android/app/build/outputs/apk/release/app-release.apk

# iOS (Xcode 열기)
npm run build:ios
# → Xcode에서 Archive → Distribute
```

### 모든 플랫폼 한 번에
```bash
npm run deploy:all
```

---

## 🔄 자동 배포 설정 (GitHub Actions)

### 1. GitHub Secrets 설정

저장소 → Settings → Secrets and variables → Actions

```
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

### 2. Netlify Token 발급

1. https://app.netlify.com/user/applications
2. "New access token" 클릭
3. 토큰 복사

### 3. Site ID 확인

1. Netlify 대시보드 → Site settings → General
2. "Site ID" 복사

### 4. 자동 배포 활성화

```bash
# main 브랜치에 push하면 자동 배포
git push origin main
```

**결과:**
- ✅ 웹 앱이 Netlify에 자동 배포
- ✅ Windows/Mac/Linux 설치 파일이 GitHub Release에 업로드
- ✅ Android APK가 GitHub Release에 업로드

---

## 📱 PWA 설치 방법

### 웹 배포 후

**데스크톱 (Chrome/Edge):**
1. 배포된 URL 접속
2. 주소창 오른쪽 "앱 설치" 아이콘 클릭
3. 완료!

**모바일:**
- **Android (Chrome):** 메뉴 → "앱 설치" 또는 "홈 화면에 추가"
- **iOS (Safari):** 공유 버튼 → "홈 화면에 추가"

---

## 🎬 배포 스크립트 사용

### Linux/Mac
```bash
# 웹 배포
./scripts/deploy.sh web

# Netlify 배포
./scripts/deploy.sh netlify

# Vercel 배포
./scripts/deploy.sh vercel

# Windows 빌드
./scripts/deploy.sh windows

# 모든 플랫폼
./scripts/deploy.sh all
```

### Windows
```cmd
REM 웹 배포
deploy.bat web

REM Windows 빌드
deploy.bat windows

REM 모든 플랫폼
deploy.bat all
```

---

## ✅ 배포 체크리스트

### 배포 전
- [ ] `npm run build` 성공
- [ ] `dist` 폴더 확인
- [ ] 로컬에서 테스트 (`npx serve dist`)
- [ ] PWA 매니페스트 확인

### 배포 후
- [ ] 실제 URL에서 동작 확인
- [ ] PWA 설치 테스트
- [ ] 모바일에서 테스트
- [ ] 오프라인 동작 확인
- [ ] 성능 측정 (Lighthouse)

---

## 📊 배포 플랫폼 비교

| 플랫폼 | 비용 | 속도 | 특징 |
|--------|------|------|------|
| **Netlify** | 무료 | ⚡ 빠름 | 드래그 앤 드롭, 자동 HTTPS |
| **Vercel** | 무료 | ⚡ 빠름 | React 최적화, Edge Network |
| **GitHub Pages** | 무료 | 🐢 보통 | GitHub 통합, 커스텀 도메인 |
| **Cloudflare Pages** | 무료 | ⚡⚡ 매우 빠름 | 글로벌 CDN, 무제한 대역폭 |

---

## 🐛 문제 해결

### 빌드 실패
```bash
# 캐시 삭제
rm -rf node_modules dist
npm install
npm run build
```

### Netlify 404 오류
```bash
# netlify.toml 확인
cat netlify.toml

# SPA 라우팅 설정 확인
```

### GitHub Pages 404
```bash
# vite.config.js에 base 경로 추가
export default defineConfig({
  base: '/repository-name/',
  // ...
})
```

### PWA 설치 안됨
- HTTPS 환경에서만 설치 가능
- 브라우저가 PWA 지원 확인
- manifest.webmanifest 파일 확인

---

## 📞 지원

- **문서:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **설치 가이드:** [INSTALL_GUIDE.md](./INSTALL_GUIDE.md)
- **이슈:** GitHub Issues

---

**배포 완료!** 🎉

BaroTube가 모든 플랫폼에서 사용 가능합니다:
- 🌐 웹: Netlify/Vercel/GitHub Pages
- 🖥️ 데스크톱: Windows/Mac/Linux 설치 파일
- 📱 모바일: Android APK, iOS 앱
- 📲 PWA: 홈 화면에 설치
