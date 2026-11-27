# ⚡ BaroTube 즉시 배포 & 설치 가이드

## 🎯 가장 빠른 방법 (30초!)

### 1단계: GitHub CLI 설치

**Windows:**
```powershell
winget install --id GitHub.cli
```

**Mac:**
```bash
brew install gh
```

**Linux:**
```bash
sudo apt install gh
```

### 2단계: GitHub 로그인

```bash
gh auth login
```

### 3단계: 원클릭 배포

**Windows:**
```cmd
auto-deploy.bat
```

**Mac/Linux:**
```bash
npm run deploy:auto
```

**끝!** 자동으로 GitHub에 배포됩니다.

---

## 📱 배포 후 설치 방법

배포 완료 후 (1-2분 소요):

### 🖥️ Windows
1. `https://YOUR_USERNAME.github.io/barotube/` 접속
2. Chrome/Edge 주소창 오른쪽 **"앱 설치"** 아이콘 클릭
3. 완료!

### 🍎 Mac
1. `https://YOUR_USERNAME.github.io/barotube/` 접속
2. Safari → **"파일"** → **"Dock에 추가"**
3. 완료!

### 🤖 Android
1. `https://YOUR_USERNAME.github.io/barotube/` 접속 (Chrome)
2. 메뉴 (⋮) → **"앱 설치"**
3. 완료!

### 🍏 iPhone/iPad
1. `https://YOUR_USERNAME.github.io/barotube/` 접속 (Safari)
2. 공유 버튼 (📤) → **"홈 화면에 추가"**
3. 완료!

---

## 🔄 배포 과정 (자동)

```
npm run deploy:auto 실행
    ↓
✅ GitHub 저장소 생성 (barotube)
    ↓
✅ 코드 자동 업로드
    ↓
✅ GitHub Pages 활성화
    ↓
✅ 배포 시작 (1-2분)
    ↓
🎉 완료! URL 제공
```

---

## 📊 배포 URL 확인

배포 후:
```
https://YOUR_USERNAME.github.io/barotube/
```

배포 상태 확인:
```
https://github.com/YOUR_USERNAME/barotube/actions
```

---

## 🐛 문제 해결

### GitHub CLI가 설치되지 않음
```bash
# Windows
winget install --id GitHub.cli

# Mac
brew install gh

# Linux
sudo apt install gh
```

### GitHub 로그인 실패
```bash
gh auth login
# 브라우저가 열리면 로그인
```

### 배포가 안 됨
```bash
# GitHub Actions 확인
gh run list --limit 5

# 또는 브라우저에서 확인
# https://github.com/YOUR_USERNAME/barotube/actions
```

### PWA 설치 버튼이 안 보임
- 5분 기다린 후 새로고침
- 캐시 삭제 (Ctrl+Shift+Delete)
- 최신 브라우저 사용

---

## 📞 도움이 필요하신가요?

문제 발생 시:
1. 에러 메시지 확인
2. GitHub Actions 로그 확인
3. 브라우저 콘솔 확인 (F12)

---

**배포 완료 후 모든 플랫폼에서 앱처럼 사용할 수 있습니다!** 🎉
