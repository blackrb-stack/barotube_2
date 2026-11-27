#!/bin/bash

# BaroTube GitHub Pages 자동 배포 스크립트
# 사용법: ./auto-deploy.sh

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 BaroTube GitHub Pages 자동 배포${NC}"
echo ""

# GitHub CLI 확인
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI가 설치되어 있지 않습니다.${NC}"
    echo ""
    echo -e "${YELLOW}설치 방법:${NC}"
    echo "  Windows: winget install --id GitHub.cli"
    echo "  macOS: brew install gh"
    echo "  Linux: sudo apt install gh"
    echo ""
    echo -e "${BLUE}또는 https://cli.github.com/ 에서 다운로드${NC}"
    exit 1
fi

# GitHub 로그인 확인
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}🔐 GitHub에 로그인해주세요...${NC}"
    gh auth login
fi

# 사용자명 가져오기
USERNAME=$(gh api user --jq .login 2>/dev/null || echo "")
if [ -z "$USERNAME" ]; then
    echo -e "${RED}❌ GitHub 사용자 정보를 가져올 수 없습니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ GitHub 사용자: ${USERNAME}${NC}"
echo ""

# 저장소 이름
REPO_NAME="barotube"
REPO_URL="https://github.com/${USERNAME}/${REPO_NAME}"

# 저장소 존재 확인
if gh repo view "${USERNAME}/${REPO_NAME}" &> /dev/null; then
    echo -e "${YELLOW}⚠️  저장소가 이미 존재합니다: ${REPO_URL}${NC}"
    read -p "업데이트하시겠습니까? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    # 기존 저장소 업데이트
    echo -e "${BLUE}📝 코드 업데이트 중...${NC}"
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M')" || echo "변경사항 없음"
    git push
    echo -e "${GREEN}✓ 코드 업데이트 완료!${NC}"
else
    # 새 저장소 생성
    echo -e "${BLUE}📦 새 저장소 생성 중...${NC}"
    
    # Git 초기화
    if [ ! -d .git ]; then
        git init
        git branch -M main
    fi
    
    # 파일 추가
    git add .
    git commit -m "Initial commit: BaroTube - YouTube viewer without ads"
    
    # GitHub에 저장소 생성
    gh repo create "$REPO_NAME" --public --source=. --push
    
    echo -e "${GREEN}✓ 저장소 생성 완료!${NC}"
fi

echo ""
echo -e "${BLUE}🌐 GitHub Pages 활성화 중...${NC}"

# GitHub Pages 활성화
gh api repos/${USERNAME}/${REPO_NAME}/pages \
  -X POST \
  -f build_type=workflow \
  2>/dev/null || echo "Pages가 이미 활성화되어 있거나 활성화 중입니다."

echo -e "${GREEN}✓ GitHub Pages 활성화 완료!${NC}"
echo ""

# 배포 상태 확인
echo -e "${BLUE}⏳ 배포 진행 중... (약 1-2분 소요)${NC}"
sleep 5

# Actions 실행 확인
gh run list --repo ${USERNAME}/${REPO_NAME} --limit 1

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 배포가 시작되었습니다!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📱 배포 URL:${NC}"
echo -e "${YELLOW}https://${USERNAME}.github.io/${REPO_NAME}/${NC}"
echo ""
echo -e "${BLUE}📊 배포 상태 확인:${NC}"
echo -e "  ${REPO_URL}/actions"
echo ""
echo -e "${BLUE}📲 설치 방법:${NC}"
echo -e "  Windows/Mac: 브라우저에서 '앱 설치' 아이콘 클릭"
echo -e "  Android: Chrome 메뉴 → '앱 설치'"
echo -e "  iOS: Safari 공유 → '홈 화면에 추가'"
echo ""
echo -e "${GREEN}✨ 배포 완료까지 1-2분 정도 기다려주세요!${NC}"
