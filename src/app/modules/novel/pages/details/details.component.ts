import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, first, concatMap } from 'rxjs/operators';
import { NovelService } from 'src/app/core/services/novel.service';
import { LibraryService } from 'src/app/core/services/library.service';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';

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
  novel: Observable<Novel>;
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
    this.route.paramMap.pipe(
      map(params => params.get('novelID'))
    ).subscribe(novelID => this.novelID = novelID);
  }

  ngOnInit() {
    this.novel = this.ns.novelGet(this.novelID);
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
        console.error
      );
    } else {
      this.ns.unlike().subscribe(
        () => this.busyFav = false,
        console.error
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

}
