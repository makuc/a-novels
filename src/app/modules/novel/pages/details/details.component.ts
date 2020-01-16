import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap, share, switchMap, shareReplay } from 'rxjs/operators';
import { NovelService } from 'src/app/core/services/novel.service';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { firestore } from 'firebase';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { UnauthorizedHelper } from 'src/app/core/helpers/unauthorized.helper';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent extends UnauthorizedHelper implements OnInit {

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
    router: Router
  ) {
    super(router);

    this.novelID = this.route.snapshot.paramMap.get('novelID');
    this.novel$ = this.ns.novelGet(this.novelID).pipe(
      share()
    );
    this.toc$ = this.cs.toc(this.novelID).pipe(
      map(toc => this.cs.tocFilterPublic(toc)),
      shareReplay(1)
    );
    this.islib$ = this.ns.inLibrary(this.novelID);
    this.likeState$ = this.ns.likeState();
    this.likes$ = this.ns.getLikes();
    this.history$ = this.cs.readGet(this.novelID);
  }

  ngOnInit() { }


  like(like: Like) {
    this.busyFav = true;
    if (!like || !like.value) {
      this.ns.like().subscribe(
        () => this.busyFav = false,
        err => this.handleUnauthorized(err)
      );
    } else {
      this.ns.unlike().subscribe(
        () => this.busyFav = false,
        err => this.handleUnauthorized(err)
      );
    }
  }

  toggleLibrary(inLib: boolean) {
    this.busyLib = true;
    if (inLib) {
      this.ns.libRemove(this.novelID).then(
        () => this.busyLib = false,
        err => this.handleUnauthorized(err)
      );
    } else {
      this.ns.libAdd(this.novelID).then(
        () => this.busyLib = false,
        err => this.handleUnauthorized(err)
      );
    }
  }

  toDate(ts: firestore.Timestamp) {
    return ts.toDate();
  }

  calcReleaseRate(toc: TOC) {
    return this.cs.chaptersReleaseRate(toc);
  }

  linkChapter(nid: string, cid: string) {
    if (cid) {
      return `/novel/${nid}/${cid}`;
    }
    return `/novel/${nid}/${this.cs.readToc ? this.cs.readToc.toc[this.cs.readToc.indexes[0]].id : ''}`;
  }

}
