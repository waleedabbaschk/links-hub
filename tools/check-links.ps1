$root = Split-Path -Parent $PSScriptRoot
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Net.Http

$urls = Get-ChildItem (Join-Path $root "data") -Filter "links*.js" |
  ForEach-Object { [regex]::Matches([System.IO.File]::ReadAllText($_.FullName), '"(https?://[^"\s]+)"') } |
  ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
Write-Host ("Total unique links: {0}" -f $urls.Count)

$client = New-Object System.Net.Http.HttpClient
$client.Timeout = [TimeSpan]::FromSeconds(15)
[void]$client.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36")

$results = @()
$batch = 40
for ($i = 0; $i -lt $urls.Count; $i += $batch) {
  $end = [Math]::Min($i + $batch, $urls.Count) - 1
  $chunk = @($urls[$i..$end])
  $tasks = @()
  foreach ($u in $chunk) { $tasks += $client.GetAsync($u, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead) }
  try { [System.Threading.Tasks.Task]::WaitAll([System.Threading.Tasks.Task[]]$tasks) } catch {}
  for ($j = 0; $j -lt $chunk.Count; $j++) {
    $t = $tasks[$j]
    if ($t.IsFaulted -or $t.IsCanceled) { $null = $t.Exception; $status = "ERROR"; $code = 0 }
    else {
      $code = [int]$t.Result.StatusCode
      $t.Result.Dispose()
      if ($code -lt 400) { $status = "OK" }
      elseif ($code -in 401, 403, 429, 503, 999) { $status = "BLOCKED" }
      else { $status = "DEAD" }
    }
    $results += [pscustomobject]@{ Status = $status; Code = $code; Url = $chunk[$j] }
  }
  Write-Host ("Checked {0}/{1}" -f ($end + 1), $urls.Count)
}

$report = Join-Path $PSScriptRoot "link-report.csv"
$results | Sort-Object Status, Url | Export-Csv $report -NoTypeInformation -Encoding UTF8
Write-Host ""
$results | Group-Object Status | ForEach-Object { Write-Host ("{0}: {1}" -f $_.Name, $_.Count) }
Write-Host ""
Write-Host "DEAD / ERROR links (inhein check karo):" -ForegroundColor Yellow
$results | Where-Object { $_.Status -in "DEAD", "ERROR" } | Format-Table -AutoSize
Write-Host ("Poori report: {0}" -f $report) -ForegroundColor Green