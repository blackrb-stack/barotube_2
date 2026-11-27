#!/bin/bash

# BaroTube GitHub Pages 배포 스크립트
# 사용법: ./scripts/deploy-github-pages.sh

set -e

echo "🚀 BaroTube GitHub Pages 배포 시작"

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Git 저장소 확인
if [ ! -d .git ]; then
    echo -e "${RED}❌ Git 저장소가 아닙니다.${NC}"
    echo -e "${YELLOW}먼저 GitHub 저장소를 생성하고 클론하세요.${NC}"
    echo ""
    echo "1. https://github.com/new 에서 저장소 생성"
    echo "2. git clone https://github.com/YOUR_USERNAME/barotube.git"
    echo "3. cd barotube"
    echo "4. 이 스크립트 다시 실행"
    exit 1
fi

# GitHub 원격 저장소 확인
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [ -z "$REMOTE_URL" ]; then
    echo -e "${RED}❌ GitHub 원격 저장소가 설정되지 않았습니다.${NC}"
    echo -e "${YELLOW}다음 명령어로 추가하세요:${NC}"
    echo "git remote add origin https://github.com/YOUR_USERNAME/barotube.git"
    exit 1
fi

echo -e "${BLUE}📦 원격 저장소: $REMOTE_URL${NC}"

# gh-pages 패키지 확인
if ! npm list gh-pages > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 gh-pages 패키지 설치 중...${NC}"
    npm install -D gh-pages
fi

# vite.config.js의 base 경로 확인
echo -e "${YELLOW}⚙️  vite.config.js base 경로 확인 중...${NC}"
BASE_PATH=$(grep -o "base: '[^']*'" vite.config.js | head -1 | sed "s/base: '//;s/'//")
echo -e "${BLUE}   Base 경로: $BASE_PATH${NC}"

# 빌드
echo -e "${YELLOW}🔨 프로젝트 빌드 중...${NC}"
npm run build
echo -e "${GREEN}✅ 빌드 완료!${NC}"

# dist 폴더 확인
if [ ! -d dist ]; then
    echo -e "${RED}❌ dist 폴더가 생성되지 않았습니다.${NC}"
    exit 1
fi

# 404.html이 dist에 복사되었는지 확인
if [ ! -f dist/404.html ]; then
    echo -e "${YELLOW}⚠️  404.html이 dist에 없습니다. 수동으로 복사합니다...${NC}"
    cp public/404.html dist/404.html
fi

# 배포 확인
echo ""
echo -e "${YELLOW}🚀 GitHub Pages에 배포하시겠습니까?${NC}"
read -p "계속하시겠습니까? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}배포가 취소되었습니다.${NC}"
    exit 0
fi

# gh-pages로 배포
echo -e "${YELLOW}📤 gh-pages 브랜치에 배포 중...${NC}"
npx gh-pages -d dist -b gh-pages --dotfiles

echo ""
echo -e "${GREEN}✅ 배포 완료!${NC}"
echo ""

# URL 추출
REPO_NAME=$(basename -s .git $(git remote get-url origin))
USERNAME=$(echo $REMOTE_URL | sed -n 's/.*github.com[:\/]\([^\/]*\)\/.*/\1/p')

echo -e "${BLUE}🌐 배포 URL:${NC}"
echo -e "${GREEN}https://${USERNAME}.github.io/${REPO_NAME}/${NC}"
echo ""
echo -e "${YELLOW}⏳ GitHub Pages 활성화에 1-2분 소요될 수 있습니다.${NC}"
echo ""
echo -e "${YELLOW}📱 GitHub Pages 활성화 방법:${NC}"
echo "1. GitHub 저장소 페이지로 이동"
echo "2. Settings → Pages"
echo "3. Source: Branch 'gh-pages' / Folder '(root)'"
echo "4. Save 클릭"
echo ""
echo -e "${GREEN}✨ 배포가 완료되었습니다!${NC}"
