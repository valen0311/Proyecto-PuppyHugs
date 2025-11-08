# mvnw.ps1 - simple Maven 'wrapper' for Windows using PowerShell
# Descarga Apache Maven (si falta) y ejecuta mvn con los argumentos proporcionados.
param(
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$mavenVersion = '3.9.4'
$installDir = Join-Path $scriptDir (".mvn\apache-maven-$mavenVersion")
$mvnExec = Join-Path $installDir 'bin\mvn.cmd'

function Download-Maven {
    Write-Host "Descargando Apache Maven $mavenVersion..."
    $zipUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
    $tmpZip = Join-Path $env:TEMP ("apache-maven-$mavenVersion.zip")
    Invoke-WebRequest -Uri $zipUrl -OutFile $tmpZip -UseBasicParsing
    Write-Host "Extrayendo Maven en $installDir..."
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
    Expand-Archive -Path $tmpZip -DestinationPath (Join-Path $env:TEMP ("maven-extract-$mavenVersion")) -Force
    $extractedRoot = Join-Path $env:TEMP ("maven-extract-$mavenVersion\apache-maven-$mavenVersion")
    Copy-Item -Path $extractedRoot\* -Destination $installDir -Recurse -Force
    Remove-Item -Path $tmpZip -Force
    Remove-Item -Path (Join-Path $env:TEMP ("maven-extract-$mavenVersion")) -Recurse -Force
}

if (-Not (Test-Path $mvnExec)) {
    try {
        Download-Maven
    } catch {
        Write-Error "Error descargando Maven: $_"
        exit 1
    }
}

# Ejecutar mvn con los argumentos pasados
$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName = $mvnExec
$startInfo.WorkingDirectory = $scriptDir
$startInfo.Arguments = [string]::Join(' ', $Args)
$startInfo.UseShellExecute = $false
$startInfo.RedirectStandardOutput = $true
$startInfo.RedirectStandardError = $true
$process = New-Object System.Diagnostics.Process
$process.StartInfo = $startInfo
$process.Start() | Out-Null
$stdout = $process.StandardOutput.ReadToEnd()
$stderr = $process.StandardError.ReadToEnd()
$process.WaitForExit()
Write-Output $stdout
if ($stderr) { Write-Error $stderr }
exit $process.ExitCode
