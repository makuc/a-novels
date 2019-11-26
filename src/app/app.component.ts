import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppSettingsService } from './core/services/app-settings.service';

import { keysConfig } from 'src/app/keys.config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroyed = new Subject<void>();

  mobileQuery: MediaQueryList;

  sideMax: boolean;
  sideOpen: boolean;

  // tslint:disable-next-line:variable-name
  private _mobileQueryListener: () => void;

  constructor(
    private appSettings: AppSettingsService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private elem: ElementRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    // tslint:disable-next-line:deprecation
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    // Apply all the App Settings
    this.appSettings
      .getSettings
      .pipe(takeUntil(this.destroyed))
      .subscribe(appSettings => {
        this.applyFontSize(appSettings[keysConfig.FONT_SIZE_KEY] as number);
        this.applyTheme(appSettings[keysConfig.SELECTED_THEME] as string);
        this.applyThemeMode(appSettings[keysConfig.SELECTED_THEME_DARK_MODE] as string);
        this.applySidenav(appSettings[keysConfig.SIDENAV_OPEN] as string);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.unsubscribe();
    // tslint:disable-next-line:deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  // Implementation
  applyFontSize(fontSize: number) {
    if (fontSize) {
      // this.elem.nativeElement.style.fontSize = fontSize.toString() + 'rem';
      document.documentElement.style.fontSize = fontSize.toString() + 'rem';
    }
  }

  applyTheme(theme: string) {
    // Change selected theme
    if (!theme) {
      theme = keysConfig.DEFAULT_THEME;
    }
    document.body.className = theme;
    document.body.classList.add('mat-app-background');
    document.body.classList.add('mat-typography');
    document.body.classList.add('app-panel');
  }

  applyThemeMode(darkMode: string) {
    const mode = (darkMode === 'true') ? true : false;
    // Assign proper theme mode
    if (mode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  applySidenav(open: string) {
    this.sideOpen = open === 'true';
  }

  toggleSidenav() {
    this.sideOpen = !this.sideOpen;
    this.appSettings.setSetting(keysConfig.SIDENAV_OPEN, this.sideOpen.toString());
  }
}
