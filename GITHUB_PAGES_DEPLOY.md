# 🚀 GitHub Pages 배포 가이드

## ✅ 준비 완료!

빌드가 완료되었습니다. 이제 GitHub Pages에 배포할 준비가 되었습니다.

---

## 📦 배포 방법 (3가지)

### 방법 1: GitHub Actions 자동 배포 (추천) ⭐

가장 쉬운 방법! 코드를 push하면 자동으로 배포됩니다.

**1단계: GitHub 저장소 생성**
```bash
# 로컬에서
git init
git add .
git commit -m "Initial commit: BaroTube"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/barotube.git
git push -u origin main
```

**2단계: GitHub에서 Pages 활성화**
1. GitHub 저장소 페이지로 이동
2. **Settings** → **Pages**
3. Source에서 **"GitHub Actions"** 선택
4. 완료! 자동으로 배포됩니다.

**3단계: 배포 확인**
- Actions 탭에서 워크플로우 실행 확인
- 배포 완료 후 URL: `https://YOUR_USERNAME.github.io/barotube/`

---

### 방법 2: gh-pages 브랜치로 배포 (수동)

**1단계: GitHub 저장소 생성**
```bash
git init
git add .
git commit -m "Initial commit: BaroTube"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/barotube.git
git push -u origin main
```

**2단계: 배포 실행**
```bash
# 한 줄로 배포
npm run deploy:github-pages
```

**3단계: GitHub에서 Pages 활성화**
1. GitHub 저장소 → **Settings** → **Pages**
2. Source에서 **"Deploy from a branch"** 선택
3. Branch: **gh-pages** / **root** 선택
4. **Save** 클릭

**4단계: 배포 확인**
- URL: `https://YOUR_USERNAME.github.io/barotube/`
- 배포 완료까지 1-2분 소요

---

### 방법 3: GitHub 웹에서 직접 배포

**1단계: GitHub에서 새 저장소 생성**
1. https://github.com/new 접속
2. Repository name: `barotube`
3. Public 선택
4. **Create repository** 클릭

**2단계: 코드 업로드**
```bash
# 로컬에서
git init
git add .
git commit -m "Initial commit: BaroTube"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/barotube.git
git push -u origin main
```

**3단계: GitHub Actions로 배포**
1. 저장소 → **Actions** 탭
2. "Deploy to GitHub Pages" 워크플로우 선택
3. **"Run workflow"** 클릭
4. 배포 완료!

---

## 🔧 설정 파일 설명

### 이미 설정된 파일들

**1. `.github/workflows/github-pages.yml`**
- GitHub Actions 자동 배포 워크플로우
- `main` 브랜치에 push하면 자동 배포

**2. `vite.config.js`**
```javascript
base: process.env.GITHUB_PAGES === 'true' ? './' : '/'
```
- GitHub Pages에서 상대 경로 사용

**3. `public/404.html`**
- SPA 라우팅 지원
- GitHub Pages에서 새로고침 시 404 오류 방지

**4. `package.json`**
```json
"deploy:github-pages": "npm run build && gh-pages -d dist -b gh-pages"
```
- 한 줄로 배포 명령어

---

## 📱 배포 후 설치 방법

배포된 URL에 접속한 후:

### Windows/Mac
1. Chrome 또는 Edge 브라우저로 접속
2. 주소창 오른쪽 **"앱 설치"** 아이콘 클릭
3. 설치 완료!

### Android
1. Chrome으로 접속
2. 메뉴 (⋮) → **"앱 설치"** 또는 **"홈 화면에 추가"**
3. 설치 완료!

### iOS
1. **Safari**로 접속 (필수!)
2. 공유 버튼 (📤) → **"홈 화면에 추가"**
3. 설치 완료!

---

## 🎯 배포 후 확인 사항

### 1. 웹사이트 정상 작동 확인
```bash
# 배포된 URL 접속
https://YOUR_USERNAME.github.io/barotube/
```

### 2. 기능 테스트
- [ ] 영상 검색
- [ ] 카테고리 필터
- [ ] 영상 재생
- [ ] PWA 설치

### 3. 모바일 테스트
- [ ] 반응형 레이아웃
- [ ] 터치 인터페이스
- [ ] PWA 설치

---

## 🐛 문제 해결

### 1. 페이지가 404 오류 표시

**원인:** GitHub Pages가 아직 배포되지 않음

**해결:**
```bash
# 1-2분 기다린 후 새로고침
# 또는
# Actions 탭에서 배포 상태 확인
```

### 2. CSS/JS 파일이 로드되지 않음

**원인:** base 경로 문제

**해결:**
```bash
# vite.config.js 확인
base: './'  # 상대 경로로 설정되어 있어야 함

# 다시 빌드 및 배포
npm run deploy:github-pages
```

### 3. gh-pages 브랜치가 생성되지 않음

**원인:** gh-pages 패키지 문제

**해결:**
```bash
# gh-pages 재설치
npm install -D gh-pages

# 다시 배포
npm run deploy:github-pages
```

### 4. PWA가 설치되지 않음

**원인:** HTTPS가 아니거나 manifest 문제

**해결:**
```bash
# GitHub Pages는 자동으로 HTTPS 제공
# 1-2분 기다린 후 다시 시도
# 또는 캐시 삭제 후 새로고침
```

---

## 📊 배포 URL

배포 후 접근 가능한 URL:

- **메인 페이지:** `https://YOUR_USERNAME.github.io/barotube/`
- **PWA 매니페스트:** `https://YOUR_USERNAME.github.io/barotube/manifest.webmanifest`
- **Service Worker:** `https://YOUR_USERNAME.github.io/barotube/sw.js`

---

## 🔄 업데이트 방법

코드를 수정한 후:

### 자동 배포 (GitHub Actions)
```bash
git add .
git commit -m "Update: 새로운 기능 추가"
git push origin main
# → 자동으로 배포됨!
```

### 수동 배포
```bash
npm run deploy:github-pages
```

---

## 🎉 배포 완료!

축하합니다! BaroTube가 GitHub Pages에 배포되었습니다.

**다음 단계:**
1. 친구들에게 URL 공유
2. 모바일에서 PWA 설치 테스트
3. 기능 개선 및 버그 수정
4. GitHub Stars 받기! ⭐

---

## 📞 지원

문제 발생 시:
- GitHub Issues: https://github.com/YOUR_USERNAME/barotube/issues
- GitHub Pages 문서: https://docs.github.com/ko/pages

---

**즐거운 BaroTube 사용 되세요!** 🎬
