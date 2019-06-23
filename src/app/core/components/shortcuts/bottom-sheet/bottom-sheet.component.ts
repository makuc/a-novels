import { keysConfig } from 'src/app/keys.config';
import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { Shortcuts } from '../shortcuts.model';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent {
  /* tslint:disable: no-output-on-prefix */
  onFontSizeChange = new EventEmitter<number>();
  onThemeSwitch = new EventEmitter<string>();
  onThemeModeSwitch = new EventEmitter();
  /* tslint:enable: no-output-on-prefix */

  constructor(
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  close() {
    this.bottomSheet.dismiss();
  }

  fontSizeChange(event: MouseEvent, increaseFontSize: boolean = true): void {
    event.stopPropagation();
    if (increaseFontSize) {
      this.data.fontSize += keysConfig.FONT_SIZE_STEP;
      this.onFontSizeChange.emit(this.data.fontSize);
    } else {
      this.data.fontSize -= keysConfig.FONT_SIZE_STEP;
      this.onFontSizeChange.emit(this.data.fontSize);
    }
  }

  fontSizeDefault(event: MouseEvent): void {
    event.stopPropagation();
    this.data.fontSize = keysConfig.FONT_SIZE_DEFAULT;
    this.onFontSizeChange.emit(this.data.fontSize);
  }

  switchTheme(event: MouseEvent, themeName: string) {
    event.stopPropagation();
    this.data.themeName = themeName;
    this.onThemeSwitch.emit(themeName);
  }

  switchThemeMode(event: MouseEvent) {
    event.stopPropagation();
    this.data.darkMode = !this.data.darkMode;
    this.onThemeModeSwitch.emit();
  }

}
