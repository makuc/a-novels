import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, first, concatMap } from 'rxjs/operators';
import { NovelService } from 'src/app/core/services/novel.service';
import { LibraryService } from 'src/app/core/services/library.service';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { firestore } from 'firebase';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  s: any;

  chaptersPageEvent: PageEvent;
  reviewsPageEvent: PageEvent;

  busyLib = false;
  busyFav = false;
  novelID: string;
  novel$: Observable<Novel>;
  toc$: Observable<TOC>;
  likes$: Observable<LikeStats>;
  likeState$: Observable<Like>;
  islib$: Observable<boolean>;
  history$: Observable<HistoryNovel>;

  constructor(
    private ns: NovelService,
    private cs: ChaptersService,
    private route: ActivatedRoute,
  ) {
    this.s = storageKeys;
    this.novelID = this.route.snapshot.paramMap.get('novelID');
  }

  ngOnInit() {
    this.novel$ = this.ns.novelGet(this.novelID);
    this.likes$ = this.ns.getLikes();
    this.likeState$ = this.ns.likeState();
    this.islib$ = this.ns.inLibrary(this.novelID);
    this.history$ = this.cs.readGet(this.novelID);
  }


  like(like: Like) {
    this.busyFav = true;
    if (like && !like.value) {
      this.ns.like().subscribe(
        () => this.busyFav = false,
        err => console.error(err)
      );
    } else {
      this.ns.unlike().subscribe(
        () => this.busyFav = false,
        err => console.error(err)
      );
    }
  }

  toggleLibrary() {
    this.busyLib = true;
    this.islib$
      .pipe(
        first(),
        switchMap(islib => {
          if (islib) {
            return this.ns.libRemove(this.novelID);
          } else {
            return this.ns.libAdd(this.novelID);
          }
        })
      )
      .subscribe(
        () => this.busyLib = false,
        console.error
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

  toDate(ts: firestore.Timestamp) {
    return ts.toDate();
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

  linkChapter(nid: string, cid: string) {
    if (cid) {
      return `/novel/${nid}/${cid}`;
    }
    return `/novel/${nid}/${this.cs.readToc ? this.cs.readToc.toc[this.cs.readToc.indexes[0]].id : ''}`;
  }

}
