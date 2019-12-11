import { keysConfig } from 'src/app/keys.config';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShortcutsComponent implements OnInit {

  constructor(
    private bottomSheet: MatBottomSheet,
    private config: AppSettingsService
  ) { }

  ngOnInit(): void {
    const fontSize = this.config.snapshotSetting<number>(keysConfig.FONT_SIZE_KEY);
    const theme = this.config.snapshotSetting<string>(keysConfig.SELECTED_THEME);

    if (!fontSize) { this.changeFontSize(); }
    if (!theme) { this.switchTheme(); }
  }

  noClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Implementation
  increaseFontSize(increase: boolean, event: MouseEvent = null) {
    if (event) { event.stopPropagation(); }

    const fontSize = this.config.snapshotSetting<number>(keysConfig.FONT_SIZE_KEY);
    this.changeFontSize(
      increase ? fontSize + keysConfig.FONT_SIZE_STEP : fontSize - keysConfig.FONT_SIZE_STEP
    );
  }

  changeFontSize(fontSize: number = keysConfig.FONT_SIZE_DEFAULT) {
    this.config.setSetting(keysConfig.FONT_SIZE_KEY, fontSize);
  }

  switchThemeMode(event: MouseEvent = null) {
    if (event) { event.stopPropagation(); }

    this.config.setSetting(keysConfig.SELECTED_DARK_MODE, (!this.themeMode));
  }

  get themeMode() {
    return this.config.snapshotSetting<boolean>(keysConfig.SELECTED_DARK_MODE);
  }

  switchTheme(event: MouseEvent = null) {
    if (event) { event.stopPropagation(); }

    const theme = this.config.snapshotSetting<string>(keysConfig.SELECTED_THEME);
    let i = keysConfig.THEMES.indexOf(theme);
    i = (i + 1) % keysConfig.THEMES.length;
    const nextTheme = keysConfig.THEMES[i];
    this.config.setSetting(keysConfig.SELECTED_THEME, nextTheme);
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
}
