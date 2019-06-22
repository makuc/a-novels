import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { keysConfig } from 'src/app/keys.config';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html'
})
export class BottomSheetComponent implements OnInit {
  fontSize: number;

  constructor(
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    private appSettings: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.appSettings.getSetting(keysConfig.FONT_SIZE_KEY).subscribe(updatedFontSize => {
      if (updatedFontSize) {
        this.fontSize = updatedFontSize as number;
      } else {
        this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, keysConfig.FONT_SIZE_DEFAULT);
      }
    });
  }

  fontSizeChange(event: MouseEvent, increaseFontSize: boolean = true): void {
    event.stopPropagation();
    if (increaseFontSize) {
      this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, this.fontSize + keysConfig.FONT_SIZE_STEP);
    } else {
      this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, this.fontSize - keysConfig.FONT_SIZE_STEP);
    }
  }
  fontSizeDefault(event: MouseEvent): void {
    event.stopPropagation();
    this.appSettings.setSetting(keysConfig.FONT_SIZE_KEY, keysConfig.FONT_SIZE_DEFAULT);
  }

  public close() {
    this.bottomSheet.dismiss();
  }

}
