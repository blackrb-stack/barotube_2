@echo off
REM BaroTube GitHub Pages 자동 배포 스크립트 (Windows)
REM 사용법: auto-deploy.bat

setlocal enabledelayedexpansion

echo.
echo 🚀 BaroTube GitHub Pages 자동 배포
echo.

REM GitHub CLI 확인
where gh >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ GitHub CLI가 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   winget install --id GitHub.cli
    echo.
    echo 또는 https://cli.github.com/ 에서 다운로드
    pause
    exit /b 1
)

REM GitHub 로그인 확인
gh auth status >nul 2>nul
if %errorlevel% neq 0 (
    echo 🔐 GitHub에 로그인해주세요...
    gh auth login
)

REM 사용자명 가져오기
for /f "delims=" %%i in ('gh api user --jq .login 2^>nul') do set USERNAME=%%i

if "%USERNAME%"=="" (
    echo ❌ GitHub 사용자 정보를 가져올 수 없습니다.
    pause
    exit /b 1
)

echo ✓ GitHub 사용자: %USERNAME%
echo.

REM 저장소 이름
set REPO_NAME=barotube
set REPO_URL=https://github.com/%USERNAME%/%REPO_NAME%

REM 저장소 존재 확인
gh repo view %USERNAME%/%REPO_NAME% >nul 2>nul
if %errorlevel% equ 0 (
    echo ⚠️  저장소가 이미 존재합니다: %REPO_URL%
    set /p UPDATE="업데이트하시겠습니까? (y/n): "
    if /i not "%UPDATE%"=="y" (
        exit /b 0
    )
    
    REM 기존 저장소 업데이트
    echo 📝 코드 업데이트 중...
    git add .
    git commit -m "Update: %date% %time%" 2>nul
    git push
    echo ✓ 코드 업데이트 완료!
) else (
    REM 새 저장소 생성
    echo 📦 새 저장소 생성 중...
    
    REM Git 초기화
    if not exist .git (
        git init
        git branch -M main
    )
    
    REM 파일 추가
    git add .
    git commit -m "Initial commit: BaroTube - YouTube viewer without ads"
    
    REM GitHub에 저장소 생성
    gh repo create %REPO_NAME% --public --source=. --push
    
    echo ✓ 저장소 생성 완료!
)

echo.
echo 🌐 GitHub Pages 활성화 중...

REM GitHub Pages 활성화
gh api repos/%USERNAME%/%REPO_NAME%/pages -X POST -f build_type=workflow 2>nul
echo ✓ GitHub Pages 활성화 완료!
echo.

REM 배포 상태 확인
echo ⏳ 배포 진행 중... ^(약 1-2분 소요^)
timeout /t 5 /nobreak >nul

REM Actions 실행 확인
gh run list --repo %USERNAME%/%REPO_NAME% --limit 1

echo.
echo ========================================
echo 🎉 배포가 시작되었습니다!
echo ========================================
echo.
echo 📱 배포 URL:
echo   https://%USERNAME%.github.io/%REPO_NAME%/
echo.
echo 📊 배포 상태 확인:
echo   %REPO_URL%/actions
echo.
echo 📲 설치 방법:
echo   Windows/Mac: 브라우저에서 '앱 설치' 아이콘 클릭
echo   Android: Chrome 메뉴 → '앱 설치'
echo   iOS: Safari 공유 → '홈 화면에 추가'
echo.
echo ✨ 배포 완료까지 1-2분 정도 기다려주세요!
echo.
pause
