import { Component, OnInit, Input } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { storageKeys } from 'src/app/keys.config';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Observable } from 'rxjs';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { map } from 'rxjs/operators';
import { ChapterMeta } from 'src/app/shared/models/novels/chapter.model';
import { firestore } from 'firebase';

@Component({
  selector: 'app-novel-entry',
  templateUrl: './novel-entry.component.html',
  styleUrls: ['./novel-entry.component.scss'],
  providers: [
    ChaptersService
  ]
})
export class NovelEntryComponent implements OnInit {

  @Input() novel: Novel;

  toc$: Observable<TOC>;

  constructor(
    private cs: ChaptersService
  ) { }

  ngOnInit() {
    this.toc$ = this.cs.toc(this.novel.id).pipe(
      map(val => this.cs.tocFilterPublic(val))
    );
  }

  coverURL(custom: boolean, novelID: string): string {
    return storageKeys.GEN_URL(
      storageKeys.BASIC_URL,
      storageKeys.NOVELS_COVER_PATH,
      custom ? novelID : storageKeys.NOVELS_COVER_DEFAULT_NAME,
      storageKeys.NOVELS_COVER_THUMBNAIL
    );
  }

  calcReleaseRate(toc: TOC) {
    let rate = 0;
    const date = new Date();
    date.setDate(date.getDate() - 28);

    for (let i = toc.indexes.length - 1; i >= 0; i--) {
      const chDate = toc.toc[toc.indexes[i]].createdAt as firestore.Timestamp;
      if (chDate.toDate() >= date) {
        rate++;
      } else {
        break;
      }
    }
    return (rate / 4).toFixed(2);
  }

  toDate(timestamp: firestore.Timestamp) {
    return timestamp.toDate();
  }

}
