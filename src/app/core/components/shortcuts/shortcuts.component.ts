import { keysConfig } from 'src/app/keys.config';
import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';
import { BottomSheetComponent } from './bottom-sheet/bottom-sheet.component';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Shortcuts } from './shortcuts.model';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShortcutsComponent implements OnInit, OnDestroy {

  constructor(
    private bottomSheet: MatBottomSheet,
    private appSettings: AppSettingsService
  ) { }
  private destroyed = new Subject<void>();
  public data: Shortcuts = {
    fontSize: keysConfig.FONT_SIZE_DEFAULT,
    darkMode: false,
    theme: keysConfig.DEFAULT_THEME
  };

  ngOnInit(): void {
    this.appSettings
      .getSetting(keysConfig.FONT_SIZE_KEY)
      .pipe(takeUntil(this.destroyed))
      .subscribe(updatedFontSize => {
        if (updatedFontSize) {
          this.data.fontSize = updatedFontSize as number;
        } else {
          this.changeFontSize();
        }
      });

    this.appSettings
      .getSetting(keysConfig.SELECTED_THEME_DARK_MODE)
      .pipe(takeUntil(this.destroyed))
      .subscribe(updatedThemeDarkMode => {
        if (updatedThemeDarkMode) {
          this.data.darkMode = (updatedThemeDarkMode === 'true') ? true : false;
        } else {
          this.appSettings
            .setSetting(
              keysConfig.SELECTED_THEME_DARK_MODE,
              keysConfig.SELECTED_THEME_DARK_MODE.toString()
            );
        }
      });

    this.appSettings
      .getSetting(keysConfig.SELECTED_THEME)
      .pipe(takeUntil(this.destroyed))
      .subscribe(updatedTheme => {
        if (updatedTheme) {
          this.data.theme = updatedTheme as string;
        } else {
          this.switchTheme();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  openShortcuts(): void {
    const shortcuts = this.bottomSheet.open(BottomSheetComponent, {
      ariaLabel: 'App settings for the Client',
      panelClass: 'tools-panel',
      disableClose: false,
      data: {
        fontSize: this.data.fontSize,
        darkMode: this.data.darkMode,
        theme: this.data.theme
      }
    });
    const destroy = new Subject<void>();
    shortcuts.instance.onThemeModeSwitch
      .pipe(takeUntil(destroy))
      .subscribe(() => {
        this.switchThemeMode();
      });
    shortcuts.instance.onFontSizeChange
      .pipe(takeUntil(destroy))
      .subscribe(updatedFontSize => {
        this.changeFontSize(updatedFontSize);
      });
    shortcuts.instance.onThemeSwitch
      .pipe(takeUntil(destroy))
      .subscribe(updatedTheme => {
        this.switchTheme(updatedTheme);
      });

    shortcuts.afterDismissed().subscribe(() => {
      destroy.next();
      destroy.unsubscribe();
    });
  }

  // Implementation
  changeFontSize(fontSize: number = keysConfig.FONT_SIZE_DEFAULT) {
    this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, fontSize);
  }
  switchThemeMode() {
    this.appSettings.setSetting(keysConfig.SELECTED_THEME_DARK_MODE, (!this.data.darkMode).toString());
  }
  switchTheme(themeName: string = keysConfig.DEFAULT_THEME) {
    this.appSettings.setSetting(keysConfig.SELECTED_THEME, themeName);
  }

}
