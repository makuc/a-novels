import { keysConfig } from 'src/app/keys.config';
import { Component, ViewEncapsulation, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
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
      .getSettings
      .pipe(takeUntil(this.destroyed))
      .subscribe(appSettings => {

        const updatedFontSize = appSettings[keysConfig.FONT_SIZE_KEY];
        const updatedTheme = appSettings[keysConfig.SELECTED_THEME];
        const updatedThemeDarkMode = appSettings[keysConfig.SELECTED_THEME_DARK_MODE];

        if (updatedFontSize) {
          this.data.fontSize = updatedFontSize as number;
        } else {
          this.changeFontSize();
        }

        if (updatedTheme) {
          this.data.theme = updatedTheme as string;
        } else {
          this.switchTheme();
        }

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
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }

  noClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  openShortcuts(): void {

  }
  /*
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
  */
  // Implementation
  increaseFontSize(increase: boolean, event: MouseEvent = null) {
    if (event) {
      event.stopPropagation();
    }
    if (increase) {
      this.changeFontSize(this.data.fontSize + keysConfig.FONT_SIZE_STEP);
    } else {
      this.changeFontSize(this.data.fontSize - keysConfig.FONT_SIZE_STEP);
    }
  }
  changeFontSize(fontSize: number = keysConfig.FONT_SIZE_DEFAULT) {
    this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, fontSize);
  }
  switchThemeMode(event: MouseEvent = null) {
    if (event) {
      event.stopPropagation();
    }
    this.appSettings.setSetting(keysConfig.SELECTED_THEME_DARK_MODE, (!this.data.darkMode).toString());
  }
  switchTheme(themeName: string = keysConfig.DEFAULT_THEME, event: MouseEvent = null) {
    if (event) {
      event.stopPropagation();
    }
    this.appSettings.setSetting(keysConfig.SELECTED_THEME, themeName);
  }
}
