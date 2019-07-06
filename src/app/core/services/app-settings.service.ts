import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { keysConfig } from 'src/app/keys.config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  // tslint:disable-next-line: variable-name
  private _settings: BehaviorSubject<any>;
  private privateSettings: {} = {};

  constructor() {
    this.init();
    this._settings = new BehaviorSubject(this.privateSettings);
  }

  private init() {
    const config = localStorage.getItem(keysConfig.SETTINGS_KEY);
    if (config) {
      try {
        this.privateSettings = JSON.parse(config);
      } catch (e) {
        this.deleteSettings();
      }
    }
  }

  get getSettings(): Observable<{}> {
    return this._settings.asObservable();
  }

  getSetting(key: string): Observable<string | number> {
    return this.getSettings.pipe(
      map(settings => settings[key])
    );
  }

  setSetting(key: string, value: any) {
    this.privateSettings[key] = value;
    this.publishSettings();
  }

  removeSetting(key: string) {
    this.privateSettings[key] = undefined;
    this.publishSettings();
  }

  deleteSettings(): void {
    this.privateSettings = {};
    localStorage.removeItem(keysConfig.SETTINGS_KEY);
    this.publishSettings();
  }

  private publishSettings(): void {
    localStorage.setItem(keysConfig.SETTINGS_KEY, JSON.stringify(this.privateSettings));
    // Publish settings globally
    this._settings.next(Object.assign({}, this.privateSettings));
  }

}
