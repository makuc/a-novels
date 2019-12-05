# ANovels

Appplication UI for ANovels. Written for Angular 9-rc3.

## Prepare dir

After cloning the repository run `./make install` in PowerShell to install all dependencies.

## Development server

Run `./make serve` in PowerShell for a dev server, then navigate to `https://localhost:4200/`. The app will automatically reload if you change any of the source files.

### SSL Certificate

Since Angular CLI configuration is set to run development server over HTTPS, a proper certificate must be installed on the local machine.

On Windows, this is done by running the following commands in BASH console (Git Console):

```bash
cd node_modules/webpack-dev-server/ssl
openssl x509 -outform der -in server.pem -out server.crt
```

Then navigate to the proper folder and install certificate `server.crt` as `Local Machine` and let it automatically place it.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `./make build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Deploy

To deploy to initialized Firebase Hosting run `./make deploy`. This command builds the application (see title 'Build' above) and automatically deploys it using Firebase Tools.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
