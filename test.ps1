param(
    [Alias('a')]
    [switch]$all,
    [Alias('o')]
    [switch]$openai,
    [Alias('s')]
    [switch]$slow
)

if ($all) {
    $env:RUN_SLOW_TESTS = $true
    $env:RUN_OPENAI_TESTS = $true
}

if ($openai) {
    $env:RUN_OPENAI_TESTS = $true
}

if ($slow) {
    $env:RUN_SLOW_TESTS = $true
}

if ($env:RUN_OPENAI_TESTS -eq $true -and -not $env:OPENAI_API_KEY) {
    Write-Host "OPENAI_API_KEY is not set. Before running OpenAI API tests, run:"
    Write-Host "$env:OPENAI_API_KEY=<your-api-key>"
    exit 1
}

Write-Host "Running tests..."
$env:OPENAI_API_KEY = $env:OPENAI_API_KEY; npm run test:coverage
