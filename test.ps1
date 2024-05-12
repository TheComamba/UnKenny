param (
    [Alias('a')]
    [switch]$all
)

if ($all) {
    $env:RUN_SLOW_TESTS = $true
}

Write-Host "Running tests..."
npm run test:coverage
