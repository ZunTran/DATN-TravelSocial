@echo off
setlocal

title Travel Social - Docker Local

echo.
echo ----------------------------------
echo   TRAVEL SOCIAL - LOCAL DOCKER
echo ----------------------------------
echo.

echo [1/3] Checking Docker...
docker info >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Docker Desktop is not running.
    echo Please open Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo Docker is running.
echo.

echo [2/3] Starting containers...
docker compose --env-file .env.docker up -d --build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Docker startup failed.
    echo.
    echo Try:
    echo docker compose logs
    echo.
    pause
    exit /b 1
)

echo.
echo [3/3] Containers started successfully.
echo.

echo ------------------------
echo       TRAVEL SOCIAL
echo ------------------------
echo.
echo Frontend:
echo http://localhost:3000
echo.
echo API Gateway:
echo http://localhost:4000/graphql
echo.
echo Auth Service:
echo http://localhost:3001/graphql
echo.
echo User Service:
echo http://localhost:3002/graphql
echo.
echo Social Service:
echo http://localhost:3003/graphql
echo.
echo PostgreSQL:
echo localhost:5432
echo.
echo Redis:
echo localhost:6379
echo.
echo RabbitMQ:
echo localhost:5672
echo.
echo RabbitMQ Management:
echo http://localhost:15672
echo.
echo ---------------------------
echo.

pause