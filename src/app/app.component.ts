import { Component, OnInit } from '@angular/core';
import { AppSettingsService } from './core/services/app-settings.service';

import { keysConfig } from 'src/app/keys.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'a-novels';
  fontSize: number;

  constructor(
    private appSettings: AppSettingsService
  ) { }

  ngOnInit() {
    // Update root font-size
    this.appSettings.getSetting(keysConfig.FONT_SIZE_KEY).subscribe(updatedFontSize => {
      if (updatedFontSize) {
        document.documentElement.style.fontSize = (updatedFontSize as string) + 'rem';
      }
    });
    // Assign proper theme to the app
    this.appSettings.getSetting(keysConfig.SELECTED_THEME).subscribe(updatedSelectedTheme => {
      if (updatedSelectedTheme) {
        document.body.classList.add(updatedSelectedTheme as string);
      }
    });
    // Assign proper theme's mode to the app
    this.appSettings.getSetting(keysConfig.SELECTED_THEME_MODE).subscribe(updatedSelectedThemeMode => {
      if (updatedSelectedThemeMode) {
        document.body.classList.add(updatedSelectedThemeMode as string);
      }
    });
  }
}
