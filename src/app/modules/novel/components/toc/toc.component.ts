import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { map, takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { AppSettingsService } from 'src/app/core/services/app-settings.service';
import { keysConfig } from 'src/app/keys.config';
import { coerceBooleanProperty } from '@angular/cdk/coercion';


@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit, OnDestroy {
  destroyer: Subject<void> = new Subject();

  // tslint:disable: variable-name
  private _pagination: boolean;
  // tslint:enable: variable-name

  @Input() novelID: string;
  @Input()
  get pagination() {
    return this._pagination;
  }
  set pagination(value: boolean) {
    this._pagination = coerceBooleanProperty(value);
  }

  toc: TOC;
  limit: number;
  tocPage: string[];
  displayedColumns: string[] = ['index', 'name'];

  constructor(
    private chapters: ChaptersService,
    private config: AppSettingsService
  ) {
    this.config.getSetting('toc-size').pipe(
      takeUntil(this.destroyer)
    ).subscribe(tocSize => this.limit = tocSize as number || keysConfig.TOC_SIZE);
  }

  ngOnInit() {
    this.chapters.toc(this.novelID).pipe(
      map(toc => this.chapters.tocFilterPublic(toc)),
      takeUntil(this.destroyer)
    ).subscribe(
      toc => {
        this.toc = toc;
        this.prepareTocPage();
      },
      console.error
    );
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  displayIndex(index: string): number {
    return parseInt(index, 10) + 1;
  }

  prepareTocPage(e?: PageEvent) {
    if (this.pagination) {
      if (!e) { e = { pageIndex: 0, pageSize: this.limit, length: 0 }; }
      if (this.limit !== e.pageSize) {
        this.config.setSetting('toc-size', e.pageSize);
      }
      const start = e.pageIndex * e.pageSize;
      this.tocPage = this.toc && this.toc.indexes ? this.toc.indexes.slice(start, start + e.pageSize) : [];
    } else {
      this.tocPage = this.toc && this.toc.indexes ? this.toc.indexes : [];
    }
  }

}
