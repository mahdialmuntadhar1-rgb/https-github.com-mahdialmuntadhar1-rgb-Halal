$API = "http://127.0.0.1:8787"

Write-Host "=== V2 LOCAL HEALTH ===" -ForegroundColor Cyan
Invoke-WebRequest -UseBasicParsing "$API/api/health" | Select-Object -ExpandProperty Content

Write-Host "`n=== V2 LOCAL REGISTER ===" -ForegroundColor Cyan
$Body = @{
  fullName = "Local V2 Test"
  governorate = "Baghdad"
  email = "localv2$(Get-Date -Format yyyyMMddHHmmss)@example.com"
  phone = "07700000000"
  password = "Test123456!"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Uri "$API/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $Body |
Select-Object -ExpandProperty Content
