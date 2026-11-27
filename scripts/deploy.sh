#!/bin/bash

# BaroTube 배포 스크립트
# 사용법: ./scripts/deploy.sh [platform]

set -e

PLATFORM=${1:-web}

echo "🚀 BaroTube 배포 시작: $PLATFORM"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 빌드 함수
build_web() {
    echo -e "${YELLOW}📦 웹 앱 빌드 중...${NC}"
    npm run build
    echo -e "${GREEN}✅ 웹 빌드 완료!${NC}"
    echo -e "${GREEN}📁 dist/ 폴더를 웹 서버에 업로드하세요.${NC}"
}

# Netlify 배포
deploy_netlify() {
    echo -e "${YELLOW}🌐 Netlify에 배포 중...${NC}"
    
    if ! command -v netlify &> /dev/null; then
        echo -e "${RED}❌ Netlify CLI가 설치되어 있지 않습니다.${NC}"
        echo -e "${YELLOW}설치 방법: npm install -g netlify-cli${NC}"
        exit 1
    fi
    
    npm run build
    netlify deploy --prod --dir=dist
    echo -e "${GREEN}✅ Netlify 배포 완료!${NC}"
}

# Vercel 배포
deploy_vercel() {
    echo -e "${YELLOW}🌐 Vercel에 배포 중...${NC}"
    
    if ! command -v vercel &> /dev/null; then
        echo -e "${RED}❌ Vercel CLI가 설치되어 있지 않습니다.${NC}"
        echo -e "${YELLOW}설치 방법: npm install -g vercel${NC}"
        exit 1
    fi
    
    npm run build
    vercel --prod
    echo -e "${GREEN}✅ Vercel 배포 완료!${NC}"
}

# GitHub Pages 배포
deploy_github_pages() {
    echo -e "${YELLOW}🌐 GitHub Pages에 배포 중...${NC}"
    
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI가 설치되어 있지 않습니다.${NC}"
        echo -e "${YELLOW}설치 방법: https://cli.github.com/${NC}"
        exit 1
    fi
    
    npm run build
    
    # gh-pages 브랜치에 배포
    npx gh-pages -d dist
    echo -e "${GREEN}✅ GitHub Pages 배포 완료!${NC}"
}

# Electron Windows 빌드
build_windows() {
    echo -e "${YELLOW}🪟 Windows 설치 파일 빌드 중...${NC}"
    npm run electron:build:win
    echo -e "${GREEN}✅ Windows 빌드 완료!${NC}"
    echo -e "${GREEN}📁 release/ 폴더에서 .exe 파일을 확인하세요.${NC}"
}

# Electron macOS 빌드
build_macos() {
    echo -e "${YELLOW}🍎 macOS 설치 파일 빌드 중...${NC}"
    npm run electron:build:mac
    echo -e "${GREEN}✅ macOS 빌드 완료!${NC}"
    echo -e "${GREEN}📁 release/ 폴더에서 .dmg 파일을 확인하세요.${NC}"
}

# Electron Linux 빌드
build_linux() {
    echo -e "${YELLOW}🐧 Linux 설치 파일 빌드 중...${NC}"
    npm run electron:build:linux
    echo -e "${GREEN}✅ Linux 빌드 완료!${NC}"
    echo -e "${GREEN}📁 release/ 폴더에서 .AppImage, .deb 파일을 확인하세요.${NC}"
}

# Android APK 빌드
build_android() {
    echo -e "${YELLOW}🤖 Android APK 빌드 중...${NC}"
    
    if [ ! -d "android" ]; then
        echo -e "${YELLOW}Android 프로젝트 초기화 중...${NC}"
        npm run cap:add:android
    fi
    
    npm run build:android
    echo -e "${GREEN}✅ Android 빌드 완료!${NC}"
    echo -e "${GREEN}📁 android/app/build/outputs/apk/release/ 에서 APK를 확인하세요.${NC}"
}

# iOS 빌드
build_ios() {
    echo -e "${YELLOW}🍏 iOS 빌드 중...${NC}"
    
    if [ ! -d "ios" ]; then
        echo -e "${YELLOW}iOS 프로젝트 초기화 중...${NC}"
        npm run cap:add:ios
    fi
    
    npm run build:ios
    echo -e "${GREEN}✅ iOS 빌드 완료!${NC}"
    echo -e "${GREEN}📁 Xcode에서 Archive 후 배포하세요.${NC}"
}

# 플랫폼별 배포
case $PLATFORM in
    web)
        build_web
        ;;
    netlify)
        deploy_netlify
        ;;
    vercel)
        deploy_vercel
        ;;
    github-pages)
        deploy_github_pages
        ;;
    windows|win)
        build_windows
        ;;
    macos|mac)
        build_macos
        ;;
    linux)
        build_linux
        ;;
    android)
        build_android
        ;;
    ios)
        build_ios
        ;;
    all)
        echo -e "${YELLOW}🚀 모든 플랫폼 빌드 중...${NC}"
        build_web
        build_windows
        build_macos
        build_linux
        build_android
        echo -e "${GREEN}✅ 모든 플랫폼 빌드 완료!${NC}"
        ;;
    *)
        echo -e "${RED}❌ 알 수 없는 플랫폼: $PLATFORM${NC}"
        echo ""
        echo "사용법: ./scripts/deploy.sh [platform]"
        echo ""
        echo "지원 플랫폼:"
        echo "  web            - 웹 앱 빌드"
        echo "  netlify        - Netlify에 배포"
        echo "  vercel         - Vercel에 배포"
        echo "  github-pages   - GitHub Pages에 배포"
        echo "  windows        - Windows 설치 파일 빌드"
        echo "  macos          - macOS 설치 파일 빌드"
        echo "  linux          - Linux 설치 파일 빌드"
        echo "  android        - Android APK 빌드"
        echo "  ios            - iOS 앱 빌드 (Mac only)"
        echo "  all            - 모든 플랫폼 빌드"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ 배포 작업이 완료되었습니다!${NC}"
