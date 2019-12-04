param(
    # Script to execute
    [Parameter()]
    [string]
    $exeFunc
)

function setup {
    Write-Host "Installing Node Project"
    npm install
}

function rules {
  Write-Host "Deploying onl Firestore Rules"
  firebase deploy --only firestore:rules
}

function serve {
  Clear-Host
  ng serve
}


# RUNS the COMMAND
Clear-Host
&$exeFunc
