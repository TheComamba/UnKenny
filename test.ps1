param(
    [Alias('a')]
    [switch]$all,
    [Alias('o')]
    [switch]$openai
)

# Change to git root directory
cd "$(git rev-parse --show-toplevel)"

if ($all) {
    $env:RUN_OPENAI_TESTS = $true
}

if ($openai) {
    $env:RUN_OPENAI_TESTS = $true
}

Write-Host "Running tests..."
$env:OPENAI_API_KEY = $env:OPENAI_API_KEY; npm run test:coverage

$found = Select-String -Path .\src\* -Pattern 'mocks' -Quiet
if ($found)
{
    Write-Host "'mocks' found in src/ files:"
    Select-String -Path .\src\* -Pattern 'mocks'
    exit 1
}
