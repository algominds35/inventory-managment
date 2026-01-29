# Fix for Windows npm install permission issues
# Run this script in PowerShell as Administrator if you encounter EPERM errors

Write-Host "Fixing npm install issues..." -ForegroundColor Green

# Stop all Node processes
Write-Host "Stopping Node processes..." -ForegroundColor Yellow
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "npm" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
}

Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm install" -ForegroundColor Cyan
Write-Host "Then run: npm run dev" -ForegroundColor Cyan
