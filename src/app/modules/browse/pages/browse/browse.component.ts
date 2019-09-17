import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { NovelService } from 'src/app/core/services/novel.service';
import { Observable, Subject, fromEvent } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { environment } from 'src/environments/environment';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnDestroy {
  destroyer = new Subject<void>();
  storage: any;
  novelsList: Observable<Novel[]>;
  novelsListData: Novel[];

  constructor(
    private el: ElementRef,
    private novels: NovelService
  ) {
    this.storage = storageKeys;
    this.novels.getNovels()
      .pipe(
        take(1)
      )
      .subscribe(
        novelsList => {
          this.novelsListData = novelsList;
        }
      );
    
    fromEvent(window, 'scroll')
      .pipe(
        takeUntil(this.destroyer)
      )
      .subscribe(
        event => {
          console.log('body.scrollHeight: ', document.body.scrollHeight);
          console.log('window.scrollY: ', window.scrollY);
          console.log('el.scrollingHeight: ', this.el.nativeElement.scrollHeight);
          console.log('el.offsetHeight', this.el.nativeElement.offsetHeight);
          console.log('window.height: ', window);
        }
      );
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  scrollHandler(e) {
    console.log(e);
  }

  nextPage(last?: Novel) {
    return console.log( 'dela!!' );
    this.novels.getNovels(
      this.novelsList[this.novelsListData.length - 1]
    );
  }

  prevPage(first: Novel) {
    // this.novelsList = this.novels.getNovelsPrev(first);
  }

}
