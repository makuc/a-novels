// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBpWCDzpB5rIGH1y7oYjBfbFZdPr0mXR3o',
    authDomain: 'testing-192515.firebaseapp.com',
    databaseURL: 'https://testing-192515.firebaseio.com',
    projectId: 'testing-192515',
    storageBucket: 'testing-192515.appspot.com',
    messagingSenderId: '729912964915',
    appId: '1:729912964915:web:d9f965a8c3370b6c'
  },
  algolia: {
    appId: '925VS84GFN',
    apiKey: '02570576af0698da680e7d7788b3e700'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
