import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
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
  private end = new Subject<void>();

  mobileQuery: MediaQueryList;

  sideMax: boolean;
  sideOpen: boolean;

  constructor(
    private appSettings: AppSettingsService,
    private rend: Renderer2,
    private media: MediaMatcher
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    // Apply all the App Settings
    this.appSettings.getSettings.pipe(
      takeUntil(this.end)
    ).subscribe(appSettings => {
      this.applyFontSize(appSettings[keysConfig.FONT_SIZE_KEY] as number);
      this.applyTheme(appSettings[keysConfig.SELECTED_THEME] as string);
      this.applyThemeMode(appSettings[keysConfig.SELECTED_THEME_DARK_MODE] as boolean);
      let sidenav = appSettings[keysConfig.SIDENAV_OPEN] === undefined;
      sidenav = sidenav === undefined ? true : sidenav as boolean;
      this.applySidenav(sidenav);
    });
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.unsubscribe();
  }

  // Implementation
  private applyFontSize(fontSize: number) {
    if (fontSize) {
      // this.elem.nativeElement.style.fontSize = fontSize.toString() + 'rem';
      document.documentElement.style.fontSize = fontSize.toString() + 'rem';
    }
  }
  private applyTheme(theme: string) {
    // Change selected theme
    if (theme) {
      const classes = [
        theme,
        'mat-app-background',
        'mat-typography',
        'app-panel'
      ];
      this.rend.setAttribute(document.body, 'class', classes.join(' '));
    }
  }
  private applyThemeMode(darkMode: boolean) {
    // Assign proper theme mode
    this.rend[darkMode ? 'addClass' : 'removeClass'](document.body, 'dark');
  }
  private applySidenav(state: boolean) {
    this.sideOpen = state;
  }
  saveState(state: boolean) {
    this.appSettings.setSetting(keysConfig.SIDENAV_OPEN, state);
  }
}
