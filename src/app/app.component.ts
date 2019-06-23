import { Component, OnInit, OnDestroy } from '@angular/core';
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
  title = 'a-novels';
  fontSize: number;
  theme: string;
  darkMode: boolean;

  constructor(
    private appSettings: AppSettingsService
  ) { }

  ngOnInit(): void {
    // Update root font-size
    this.appSettings
      .getSettings
      .pipe(takeUntil(this.destroyed))
      .subscribe(appSettings => {
        this.fontSize = appSettings[keysConfig.FONT_SIZE_KEY] as number;
        this.theme = appSettings[keysConfig.SELECTED_THEME] as string;
        this.darkMode = ((appSettings[keysConfig.SELECTED_THEME_DARK_MODE] as string) === 'true') ? true : false;

        // Change font size
        if (this.fontSize) {
          document.documentElement.style.fontSize = this.fontSize.toString() + 'rem';
        }

        // Change selected theme
        if (!this.theme) {
          this.theme = keysConfig.DEFAULT_THEME;
        }
        document.body.className = this.theme;
        document.body.classList.add('mat-app-background');
        document.body.classList.add('mat-typography');
        document.body.classList.add('app-panel');

        // Assign proper theme mode
        if (this.darkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.unsubscribe();
  }
}
