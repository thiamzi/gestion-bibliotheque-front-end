// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url:"https://gestion-bibliotheque.herokuapp.com/api/",
  config : {
    apiKey: 'AIzaSyDiCgVlQPxqd_hfQo_nRqrlGBh3ShQ9pWE',
    authDomain: 'biblioteque-4dc77.firebaseapp.com',
    databaseURL: 'https://biblioteque-4dc77.firebaseio.com',
    projectId: 'biblioteque-4dc77',
    storageBucket: 'biblioteque-4dc77.appspot.com',
    messagingSenderId: '496827836757'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
