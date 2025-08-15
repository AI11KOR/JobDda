@echo off
echo Vercel 배포 준비 스크립트
echo.

echo Railway 관련 파일 삭제...
if exist railway.json (
    del railway.json
    echo railway.json 삭제됨
)
if exist .npmrc (
    del .npmrc
    echo .npmrc 삭제됨
)

echo.
echo Vercel 설정 파일 생성 완료!

echo.
echo Git 변경사항 추가...
git add .
git commit -m "Switch to Vercel deployment"

echo.
echo 다음 단계:
echo 1. https://vercel.com 접속
echo 2. GitHub 로그인
echo 3. Import Project 클릭
echo 4. 저장소 선택
echo 5. 자동 배포 완료!
echo.
pause
