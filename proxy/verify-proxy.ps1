<#
.SYNOPSIS
  Verify a deployed (or local) RentBasket API proxy in one command.

.DESCRIPTION
  Runs the four live checks against a proxy URL -- catalog, JWT mint, KYC multipart
  upload, CORS preflight -- all WITHOUT the client sending any secret key (the proxy
  must inject them). Optionally also greps a built website bundle to confirm the
  secret key values are absent.

  Exit code 0 = all checks passed; 1 = at least one failed.

.PARAMETER ProxyUrl
  Base URL of the proxy, e.g. https://abc123.netlify.app or https://api.rentbasket.com
  or http://localhost:8787 for the local dev-server. No trailing slash.

.PARAMETER DistDir
  Optional path to a built website 'dist' folder. If given, the script greps every
  file for the secret key values (read from ../.env.local) and FAILS if either is
  found -- i.e. confirms a proxy-mode build shipped no keys.

.EXAMPLE
  .\verify-proxy.ps1 -ProxyUrl https://abc123.netlify.app

.EXAMPLE
  .\verify-proxy.ps1 -ProxyUrl https://api.rentbasket.com -DistDir ..\dist
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$ProxyUrl,

  [string]$DistDir,

  # Origin used for the CORS check. Defaults to the live site; pass
  # http://localhost:8080 when testing the local dev-server (its default allow-list).
  [string]$Origin = "https://home.rentbasket.com"
)

$ProxyUrl = $ProxyUrl.TrimEnd('/')
$script:fails = 0

function Pass($msg) { Write-Host "  [PASS] $msg" -ForegroundColor Green }
function Fail($msg) { Write-Host "  [FAIL] $msg" -ForegroundColor Red; $script:fails++ }

Write-Host "`nVerifying proxy at: $ProxyUrl`n" -ForegroundColor Cyan

# --- 1. Catalog: no client key; proxy injects Authorization-Key ----------------
Write-Host "1. Catalog (GET /get-amenity-types, no client key)"
try {
  $r = Invoke-WebRequest -Uri "$ProxyUrl/get-amenity-types" -Method GET -UseBasicParsing -ErrorAction Stop
  $count = ([regex]::Matches($r.Content, 'amenity_type_name')).Count
  if ($r.StatusCode -eq 200 -and $count -ge 50) {
    Pass "200, $count items returned (proxy injected the catalog key)"
  } else {
    Fail "status $($r.StatusCode), only $count items -- check CATALOG_API_KEY on the proxy"
  }
} catch { Fail "request failed: $($_.Exception.Message)" }

# --- 2. JWT mint: send NO app_key; proxy injects it ----------------------------
Write-Host "2. JWT mint (POST /get-jwt-token, body has no app_key)"
try {
  $r = Invoke-WebRequest -Uri "$ProxyUrl/get-jwt-token" -Method POST `
        -ContentType "application/json" -Body '{}' -UseBasicParsing -ErrorAction Stop
  if ($r.StatusCode -eq 200 -and $r.Content -match '"jwt_token":"(?<tok>[^"]+)"') {
    $script:jwt = $Matches['tok']
    Pass "200, JWT minted (proxy injected the app key)"
  } else {
    Fail "status $($r.StatusCode), no jwt_token -- check API_APP_KEY on the proxy"
  }
} catch { Fail "request failed: $($_.Exception.Message)" }

# --- 3. KYC multipart upload: proves binary body survives the proxy ------------
Write-Host "3. KYC multipart upload (POST /update-kyc, binary file, Bearer JWT)"
$curl = (Get-Command curl.exe -ErrorAction SilentlyContinue)
if (-not $script:jwt) {
  Fail "skipped -- no JWT from step 2"
} elseif (-not $curl) {
  Fail "skipped -- curl.exe not found (used for the multipart upload; ships with Win10/11)"
} else {
  # Build a tiny binary file with non-UTF8 bytes; if those survive to upstream,
  # the proxy preserved the multipart body. Use curl.exe -- it builds the multipart
  # body reliably (PS 5.1's hand-rolled multipart is fragile).
  $tmp = Join-Path $env:TEMP "rbverify_kyc.bin"
  [System.IO.File]::WriteAllBytes($tmp, [byte[]](0x89,0x50,0x4E,0x47,0x00,0x01,0x02,0x03))
  try {
    $code = & $curl.Source -s -o "$env:TEMP\rbverify_kyc_resp.json" -w "%{http_code}" `
      -X POST "$ProxyUrl/update-kyc" `
      -H "Authorization: Bearer $($script:jwt)" `
      -F "mobile=9999999999" -F "doc_type=aadhaar_front" -F "kyc_pic=@$tmp;type=image/png"
    if ($code -eq "200") {
      Pass "200 -- multipart body reached upstream intact (boundary + binary preserved)"
    } else {
      # 401 = auth (not a body problem); 400/500 could indicate a corrupted body.
      Fail "HTTP $code -- upstream did not accept the upload (401=auth, 400/500=check body passthrough)"
    }
  } finally {
    Remove-Item $tmp -ErrorAction SilentlyContinue
  }
}

# --- 4. CORS preflight: concrete allow-listed origin, not '*' -------------------
Write-Host "4. CORS preflight (OPTIONS, Origin: $Origin)"
try {
  $headers = @{ Origin = $Origin; "Access-Control-Request-Method" = "GET" }
  $r = Invoke-WebRequest -Uri "$ProxyUrl/get-amenity-types" -Method Options `
        -Headers $headers -UseBasicParsing -ErrorAction Stop
  $allow = $r.Headers["Access-Control-Allow-Origin"]
  if (($r.StatusCode -eq 204 -or $r.StatusCode -eq 200) -and $allow -eq $Origin) {
    Pass "$($r.StatusCode), Allow-Origin = $allow (concrete, allow-listed)"
  } else {
    Fail "status $($r.StatusCode), Allow-Origin = '$allow' (expected '$Origin') -- check ALLOWED_ORIGIN on the proxy"
  }
} catch { Fail "request failed: $($_.Exception.Message)" }

# --- 5. (optional) Bundle key-grep: confirm a proxy-mode build shipped no keys --
if ($DistDir) {
  Write-Host "5. Bundle check (grep $DistDir for secret key values)"
  $envFile = Join-Path $PSScriptRoot "..\.env.local"
  if (-not (Test-Path $envFile)) {
    Fail "skipped -- ..\.env.local not found (needed to know the secret values)"
  } elseif (-not (Test-Path $DistDir)) {
    Fail "DistDir '$DistDir' not found"
  } else {
    $envLines = Get-Content $envFile
    $appPrefix = "VITE_API_APP_KEY="
    $catPrefix = "VITE_CATALOG_API_KEY="
    $appVal = ($envLines | Where-Object { $_.StartsWith($appPrefix) } | Select-Object -First 1)
    if ($appVal) { $appVal = $appVal.Substring($appPrefix.Length) }
    $catVal = ($envLines | Where-Object { $_.StartsWith($catPrefix) } | Select-Object -First 1)
    if ($catVal) { $catVal = $catVal.Substring($catPrefix.Length) }
    $files = Get-ChildItem -Path $DistDir -Recurse -File
    $appHit = $false; $catHit = $false
    foreach ($f in $files) {
      $txt = Get-Content $f.FullName -Raw -ErrorAction SilentlyContinue
      if ($txt -and $appVal -and $txt.Contains($appVal)) { $appHit = $true }
      if ($txt -and $catVal -and $txt.Contains($catVal)) { $catHit = $true }
    }
    if ($appHit) { Fail "APP key value FOUND in bundle (not proxy-mode, or DCE failed)" } else { Pass "APP key absent from bundle" }
    if ($catHit) { Fail "CATALOG key value FOUND in bundle" } else { Pass "CATALOG key absent from bundle" }
  }
}

# --- summary -------------------------------------------------------------------
Write-Host ""
if ($script:fails -eq 0) {
  Write-Host "ALL CHECKS PASSED" -ForegroundColor Green
  exit 0
} else {
  Write-Host "$($script:fails) CHECK(S) FAILED" -ForegroundColor Red
  exit 1
}
