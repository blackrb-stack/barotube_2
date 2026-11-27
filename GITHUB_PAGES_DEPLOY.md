# 🚀 GitHub Pages 배포 가이드 (5분 완성)

## 📋 준비물

- GitHub 계정
- Git 설치 (https://git-scm.com/downloads)
- Node.js 18+ (https://nodejs.org)

---

## ⚡ 빠른 배포 (5단계)

### 1단계: GitHub 저장소 생성

1. https://github.com/new 접속
2. Repository name: `barotube` (또는 원하는 이름)
3. Public 선택
4. "Create repository" 클릭

### 2단계: 로컬에 클론

```bash
# 터미널 또는 명령 프롬프트에서 실행
git clone https://github.com/YOUR_USERNAME/barotube.git
cd barotube
```

**중요:** `YOUR_USERNAME`을 실제 GitHub 사용자명으로 변경하세요!

### 3단계: 프로젝트 파일 복사

이 환경의 모든 파일을 `barotube` 폴더에 복사합니다.

**또는** Git으로 직접 가져오기:
```bash
# 이 환경에서 파일을 다운로드 받았다면
# 압축을 풀고 barotube 폴더에 복사
```

### 4단계: 의존성 설치 및 배포

```bash
# 1. 의존성 설치
npm install

# 2. GitHub Pages에 배포 (자동으로 빌드 + gh-pages 브랜치에 푸시)
npm run deploy:github-pages
```

### 5단계: GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. Settings → Pages
3. Source:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. "Save" 클릭

**완료!** 1-2분 후 다음 URL에서 접속 가능:
```
https://YOUR_USERNAME.github.io/barotube/
```

---

## 🔧 설정 파일 확인

### vite.config.js (base 경로)

```javascript
export default defineConfig({
  // GitHub Pages용 base 경로
  // 저장소 이름이 'barotube'인 경우:
  base: '/barotube/',
  
  // 사용자 페이지(username.github.io)인 경우:
  // base: '/',
  
  // ...
});
```

**중요:** 저장소 이름을 변경했다면 `vite.config.js`의 `base` 경로도 수정해야 합니다!

예시:
- 저장소 이름: `my-youtube-app` → `base: '/my-youtube-app/'`
- 사용자 페이지: `username.github.io` → `base: '/'`

---

## 📱 배포 후 PWA 설치

배포된 URL에 접속한 후:

### Windows/Mac (Chrome/Edge)
1. URL 접속: `https://YOUR_USERNAME.github.io/barotube/`
2. 주소창 오른쪽 "앱 설치" 아이콘 클릭 (📥)
3. 설치 완료!

### Android (Chrome)
1. URL 접속
2. 메뉴 (⋮) → "앱 설치" 또는 "홈 화면에 추가"
3. 설치 완료!

### iOS (Safari)
1. URL 접속 (**Safari 필수**)
2. 공유 버튼 (📤) → "홈 화면에 추가"
3. 설치 완료!

---

## 🔄 업데이트 방법

코드를 수정한 후:

```bash
# 1. 변경사항 커밋
git add .
git commit -m "Update features"

# 2. GitHub에 푸시
git push origin main

# 3. GitHub Pages에 재배포
npm run deploy:github-pages
```

**자동 배포 설정:**
GitHub Actions를 사용하면 push 시 자동 배포됩니다.

---

## 🐛 문제 해결

### 1. 페이지가 404 오류

**원인:** base 경로가 잘못됨

**해결:**
```javascript
// vite.config.js 수정
base: '/barotube/',  // 저장소 이름과 일치해야 함
```

다시 빌드:
```bash
npm run deploy:github-pages
```

### 2. CSS/JS가 로드되지 않음

**원인:** 상대 경로 문제

**해결:**
- `vite.config.js`의 `base` 경로 확인
- 브라우저 개발자 도구(F12) → Console에서 404 오류 확인
- 경로가 `/barotube/assets/...` 형식인지 확인

### 3. PWA가 설치되지 않음

**원인:** HTTPS가 아니거나 manifest 오류

**해결:**
- GitHub Pages는 자동으로 HTTPS 제공
- 브라우저 캐시 삭제 (Ctrl+Shift+Delete)
- manifest.webmanifest 파일이 제대로 생성되었는지 확인

### 4. gh-pages 브랜치가 생성되지 않음

**원인:** Git 권한 문제

**해결:**
```bash
# GitHub CLI 설치 (https://cli.github.com)
gh auth login

# 다시 배포 시도
npm run deploy:github-pages
```

또는 수동으로 푸시:
```bash
npm run build
npx gh-pages -d dist -b gh-pages
```

---

## 📊 배포 구조

```
GitHub 저장소
├── main 브랜치 (소스 코드)
│   ├── src/
│   ├── dist/
│   └── ...
│
└── gh-pages 브랜치 (배포 파일)
    ├── index.html
    ├── assets/
    ├── manifest.webmanifest
    └── sw.js
```

**GitHub Pages는 `gh-pages` 브랜치의 파일만 제공합니다.**

---

## 🎯 배포 후 확인 사항

- [ ] URL 접속 가능: `https://YOUR_USERNAME.github.io/barotube/`
- [ ] 비디오 피드 로드됨
- [ ] 검색 기능 작동
- [ ] 영상 재생 가능
- [ ] PWA 설치 가능
- [ ] 모바일에서 정상 동작

---

## 💡 팁

### 커스텀 도메인 사용

1. GitHub 저장소 → Settings → Pages → Custom domain
2. 도메인 입력 (예: `barotube.com`)
3. DNS 설정:
   - A 레코드: `185.199.108.153`
   - CNAME: `YOUR_USERNAME.github.io`

### 자동 배포 (GitHub Actions)

`.github/workflows/deploy.yml` 파일이 이미 설정되어 있습니다.

`main` 브랜치에 push하면 자동으로 GitHub Pages에 배포됩니다.

### 빌드 최적화

```bash
# 빌드 분석
npm run build
# → dist 폴더 크기 확인

# Lighthouse로 성능 측정
# Chrome 개발자 도구 → Lighthouse 탭
```

---

## 📞 지원

문제 발생 시:
1. 브라우저 개발자 도구(F12) → Console 확인
2. GitHub 저장소 → Actions 탭에서 빌드 로그 확인
3. GitHub Issues에 문제 보고

---

**배포 완료!** 🎉

BaroTube가 GitHub Pages에서 실행 중입니다:
`https://YOUR_USERNAME.github.io/barotube/`
