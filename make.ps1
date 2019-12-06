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

function build {
  ng build --prod
  #ng build
}

function deploy {
  build
  firebase deploy
}

function fire-init {
  firebase init
}

function fire-update {
  npm i -g firebase-tools
}


# RUNS the COMMAND
Clear-Host
&$exeFunc
