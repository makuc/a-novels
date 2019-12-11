import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit, Input } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { Observable } from 'rxjs';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';
import { NovelService } from 'src/app/core/services/novel.service';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { share, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-lib-novel',
  templateUrl: './lib-novel.component.html',
  styleUrls: ['./lib-novel.component.scss'],
  providers: [NovelService]
})
export class LibNovelComponent implements OnInit {

  @Input() novelID: string;
  history$: Observable<HistoryNovel>;
  novel$: Observable<Novel>;
  toc$: Observable<TOC>;

  constructor(
    private ns: NovelService,
    private cs: ChaptersService
  ) { }

  ngOnInit() {
    this.history$ = this.cs.readGet(this.novelID);
    this.novel$ = this.ns.novelGet(this.novelID).pipe(
      share()
    );
    this.toc$ = this.cs.toc(this.novelID);
  }

  // ProperProgress returns the index of chapter based on public TOC,
  // entirely disregarding hidden/private chapters from the equation. Those are still indexed
  // and can be used for identifying reading status in case of deleted/hidden chapters...
  properProgress(toc: TOC, n: number) {
    return toc.indexes.indexOf(n.toFixed(0)) + 1;
  }

}
