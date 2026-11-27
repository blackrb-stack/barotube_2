@echo off
REM BaroTube 배포 스크립트 (Windows)
REM 사용법: deploy.bat [platform]

setlocal enabledelayedexpansion

set PLATFORM=%1

echo 🚀 BaroTube 배포 시작: %PLATFORM%

if "%PLATFORM%"=="" set PLATFORM=web

REM 웹 빌드
if "%PLATFORM%"=="web" (
    echo 📦 웹 앱 빌드 중...
    call npm run build
    echo ✅ 웹 빌드 완료!
    echo 📁 dist/ 폴더를 웹 서버에 업로드하세요.
    goto :end
)

REM Windows 빌드
if "%PLATFORM%"=="windows" (
    echo 🪟 Windows 설치 파일 빌드 중...
    call npm run electron:build:win
    echo ✅ Windows 빌드 완료!
    echo 📁 release/ 폴더에서 .exe 파일을 확인하세요.
    goto :end
)

REM Android 빌드
if "%PLATFORM%"=="android" (
    echo 🤖 Android APK 빌드 중...
    call npm run build:android
    echo ✅ Android 빌드 완료!
    echo 📁 android/app/build/outputs/apk/release/ 에서 APK를 확인하세요.
    goto :end
)

REM 모든 플랫폼 빌드
if "%PLATFORM%"=="all" (
    echo 🚀 모든 플랫폼 빌드 중...
    call npm run build
    call npm run electron:build:win
    echo ✅ 모든 플랫폼 빌드 완료!
    goto :end
)

echo ❌ 알 수 없는 플랫폼: %PLATFORM%
echo.
echo 사용법: deploy.bat [platform]
echo.
echo 지원 플랫폼:
echo   web       - 웹 앱 빌드
echo   windows   - Windows 설치 파일 빌드
echo   android   - Android APK 빌드
echo   all       - 모든 플랫폼 빌드
exit /b 1

:end
echo.
echo ✨ 배포 작업이 완료되었습니다!
endlocal
