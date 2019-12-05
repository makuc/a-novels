import { keysConfig } from 'src/app/keys.config';
import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { AppSettingsService } from '../../services/app-settings.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit, OnDestroy {
  private destroyer = new Subject<void>();

  @Input() isMobile: boolean;

  sideMax: boolean;

  constructor(
      private appSettings: AppSettingsService,
      private router: Router
  ) { }

  ngOnInit() {
      this.appSettings
          .getSetting(keysConfig.SIDENAV_MAXIMIZED)
          .pipe(takeUntil(this.destroyer))
          .subscribe(updatedSidenavMax => this.sideMax = updatedSidenavMax === 'true');
  }

  ngOnDestroy() {
      this.destroyer.next();
      this.destroyer.unsubscribe();
  }

  toggleCollapse() {
      this.appSettings.setSetting(keysConfig.SIDENAV_MAXIMIZED, (!this.sideMax).toString());
  }

  get returnQueryParams() {
    return {
      [keysConfig.RETURN_URL_KEY]: this.router.url
    };
  }
}
