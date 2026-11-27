# 🚀 BaroTube 설치 파일 빌드 가이드

## ⚡ 빠른 시작

### 1️⃣ 웹/PWA (모든 플랫폼에서 즉시 사용 가능)

**이미 빌드 완료!** `dist/` 폴더를 웹 서버에 업로드하면 끝!

```bash
# 웹 배포 (Netlify, Vercel, GitHub Pages 등)
npm run deploy:netlify
# 또는
npm run deploy:vercel
# 또는
npm run deploy:github-pages
```

배포 후:
- **데스크톱**: 브라우저에서 "앱 설치" 클릭
- **Android**: Chrome → 메뉴 → "앱 설치"
- **iOS**: Safari → 공유 → "홈 화면에 추가"

---

## 🖥️ 데스크톱 설치 파일 빌드

### Windows (.exe)

**필요 환경:**
- Windows 10/11 (64비트 권장)
- Node.js 18+
- Git

**빌드 방법:**
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd barotube

# 2. 의존성 설치
npm install

# 3. Windows 설치 파일 빌드
npm run electron:build:win

# 4. 결과물 확인
# release/BaroTube-Setup-1.0.0-x64.exe (64비트 설치)
# release/BaroTube-1.0.0-x64.exe (64비트 포터블)
# release/BaroTube-Setup-1.0.0-ia32.exe (32비트 설치)
```

**생성 파일:**
- `BaroTube-Setup-1.0.0-x64.exe` - 64비트 설치 프로그램
- `BaroTube-1.0.0-x64.exe` - 64비트 포터블 (설치 불필요)
- `BaroTube-Setup-1.0.0-ia32.exe` - 32비트 설치 프로그램

---

### macOS (.dmg)

**필요 환경:**
- macOS 10.13+ (High Sierra 이상)
- Node.js 18+
- Xcode Command Line Tools

**빌드 방법:**
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd barotube

# 2. 의존성 설치
npm install

# 3. macOS 설치 파일 빌드
npm run electron:build:mac

# 4. 결과물 확인
# release/BaroTube-1.0.0-x64.dmg (Intel Mac)
# release/BaroTube-1.0.0-arm64.dmg (Apple Silicon M1/M2/M3)
```

**생성 파일:**
- `BaroTube-1.0.0-x64.dmg` - Intel Mac용
- `BaroTube-1.0.0-arm64.dmg` - Apple Silicon (M1/M2/M3)용

---

### Linux (.AppImage, .deb)

**필요 환경:**
- Ubuntu 18.04+ / Debian 10+ / Fedora 32+
- Node.js 18+

**빌드 방법:**
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd barotube

# 2. 의존성 설치
npm install

# 3. Linux 설치 파일 빌드
npm run electron:build:linux

# 4. 결과물 확인
# release/BaroTube-1.0.0-x64.AppImage
# release/barotube_1.0.0_amd64.deb
```

**생성 파일:**
- `BaroTube-1.0.0-x64.AppImage` - 모든 Linux 배포판에서 실행 가능
- `barotube_1.0.0_amd64.deb` - Debian/Ubuntu용 패키지

---

## 📱 모바일 앱 빌드

### Android (APK)

**필요 환경:**
- Windows/Mac/Linux
- Node.js 18+
- Android Studio
- JDK 17+
- Android SDK (API 21+)

**빌드 방법:**
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd barotube

# 2. 의존성 설치
npm install

# 3. Android 프로젝트 초기화 (최초 1회)
npm run cap:add:android

# 4. Android Studio 열기
npm run cap:open:android

# 5. Android Studio에서:
#    - File → Sync Project with Gradle Files
#    - Build → Generate Signed Bundle / APK
#    - APK 선택
#    - Keystore 생성 또는 기존 것 사용
#    - Release 빌드

# 또는 명령어로 빌드
npm run build:android

# 6. 결과물 확인
# android/app/build/outputs/apk/release/app-release.apk
```

**APK 설치:**
1. APK 파일을 Android 기기로 전송
2. 설정 → 보안 → "출처를 알 수 없는 앱" 허용
3. APK 파일 실행 → 설치

**지원 버전:** Android 5.0+ (Lollipop)

---

### iOS (IPA)

**필요 환경:**
- **Mac 필수**
- macOS 10.15+ (Catalina 이상)
- Xcode 14+
- Apple Developer Account ($99/년)
- Node.js 18+

**빌드 방법:**
```bash
# 1. 프로젝트 클론
git clone <repository-url>
cd barotube

# 2. 의존성 설치
npm install

# 3. iOS 프로젝트 초기화 (최초 1회)
npm run cap:add:ios

# 4. Xcode 열기
npm run cap:open:ios

# 5. Xcode에서 설정:
#    - Signing & Capabilities → Team 선택
#    - Product → Destination → 실제 기기 선택
#    - Product → Archive

# 6. Archive 완료 후:
#    - Window → Organizer
#    - "Distribute App" 클릭
#    - 배포 방식 선택:
#      - App Store Connect (앱 스토어 배포)
#      - Ad Hoc (테스트 배포)
#      - Enterprise (기업 배포)

# 7. 결과물
# .ipa 파일이 생성됩니다
```

**지원 버전:** iOS 12.0+

---

## 🔄 자동 빌드 (GitHub Actions)

GitHub에 push하면 자동으로 모든 플랫폼 빌드!

### 설정 방법

1. **GitHub Secrets 설정**
   - 저장소 → Settings → Secrets and variables → Actions
   - 다음 시크릿 추가:
   ```
   NETLIFY_AUTH_TOKEN=your_token
   NETLIFY_SITE_ID=your_site_id
   ```

2. **자동 빌드 트리거**
   ```bash
   git push origin main
   ```

3. **결과**
   - ✅ 웹 앱이 Netlify에 자동 배포
   - ✅ Windows/Mac/Linux 설치 파일이 GitHub Release에 업로드
   - ✅ Android APK가 GitHub Release에 업로드

**GitHub Release 확인:**
- 저장소 → Releases
- 모든 플랫폼 설치 파일 다운로드 가능

---

## 📦 빌드 스크립트 사용

### Linux/Mac
```bash
# 웹 빌드
./scripts/deploy.sh web

# Windows 빌드
./scripts/deploy.sh windows

# macOS 빌드
./scripts/deploy.sh macos

# Linux 빌드
./scripts/deploy.sh linux

# Android 빌드
./scripts/deploy.sh android

# iOS 빌드
./scripts/deploy.sh ios

# 모든 플랫폼
./scripts/deploy.sh all
```

### Windows
```cmd
REM 웹 빌드
deploy.bat web

REM Windows 빌드
deploy.bat windows

REM 모든 플랫폼
deploy.bat all
```

---

## 🎯 플랫폼별 권장 배포 방법

| 플랫폼 | 권장 방법 | 이유 |
|--------|-----------|------|
| **웹** | PWA (Netlify/Vercel) | 모든 플랫폼에서 설치 가능 |
| **Windows** | PWA 또는 .exe | PWA가 더 가볍고 빠름 |
| **macOS** | PWA 또는 .dmg | PWA가 더 간편 |
| **Linux** | .AppImage 또는 PWA | AppImage가 범용성 높음 |
| **Android** | PWA 또는 APK | PWA가 자동 업데이트됨 |
| **iOS** | PWA (강력 권장) | IPA는 Apple 심사 필요 |

---

## 💡 팁

### PWA vs 네이티브 앱

**PWA 장점:**
- ✅ 모든 플랫폼에서 동일한 코드
- ✅ 자동 업데이트
- ✅ 앱 스토어 심사 불필요
- ✅ 빠른 배포
- ✅ 작은 용량

**네이티브 앱 장점:**
- ✅ 오프라인 기능 강화
- ✅ 하드웨어 접근 (카메라, GPS 등)
- ✅ 앱 스토어 노출
- ✅ 푸시 알림 (iOS)

### 빌드 시간 단축

```bash
# 캐시 활용
npm ci  # npm install보다 빠름

# 병렬 빌드
npm run electron:build  # 모든 플랫폼 동시 빌드

# 특정 플랫폼만 빌드
npm run electron:build:win  # Windows만
```

---

## 🐛 문제 해결

### Windows 빌드 실패
```bash
# 관리자 권한으로 실행
# 또는
# Windows Defender에서 제외 폴더 추가
```

### macOS 빌드 실패
```bash
# Xcode Command Line Tools 설치
xcode-select --install

# 캐시 삭제
rm -rf node_modules release
npm install
```

### Android 빌드 실패
```bash
# Android SDK 경로 확인
echo $ANDROID_HOME

# Gradle 캐시 삭제
cd android
./gradlew clean
```

### iOS 빌드 실패
```bash
# Provisioning Profile 확인
# Apple Developer 계정 상태 확인
# Xcode 버전 확인 (14+)
```

---

## 📞 지원

빌드 관련 문제:
- GitHub Issues: https://github.com/yourusername/barotube/issues
- Email: support@barotube.com

---

**빌드 완료 후:**
1. 각 플랫폼에서 설치 테스트
2. 기능 정상 동작 확인
3. 성능 테스트
4. 사용자 피드백 수집
