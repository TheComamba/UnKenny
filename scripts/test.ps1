param(
    [Alias('a')]
    [switch]$all,
    [Alias('l')]
    [switch]$local,
    [Alias('r')]
    [switch]$remote
)

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

if ($all) {
    $env:RUN_REMOTE_TESTS = $true
    $env:RUN_LOCAL_TESTS = $true
}

if ($local) {
    $env:RUN_LOCAL_TESTS = $true
}

if ($remote) {
    $env:RUN_REMOTE_TESTS = $true
}

if ($env:RUN_LOCAL_TESTS -eq $true) {
    Start-Process -FilePath "bash" -ArgumentList "./scripts/local_model.sh start" -NoNewWindow -Wait
}

Write-Host "Running tests..."
npm run test:coverage

$found = Select-String -Path .\src\* -Pattern 'mocks' -Quiet
if ($found)
{
    Write-Host "'mocks' found in src/ files:"
    Select-String -Path .\src\* -Pattern 'mocks'
    exit 1
}
