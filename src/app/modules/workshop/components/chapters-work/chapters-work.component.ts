import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Observable } from 'rxjs';
import { switchMap, map, first } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChapterMeta, Chapter } from 'src/app/shared/models/novels/chapter.model';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';

@Component({
  selector: 'app-chapters-work',
  templateUrl: './chapters-work.component.html',
  styleUrls: ['./chapters-work.component.scss']
})
export class ChaptersWorkComponent implements OnInit {

  novelID: string;
  chsBusy = false;
  toc: Observable<TOC>;
  privateChapters: ChapterMeta[];
  displayedColumns: string[] = ['title'];

  constructor(
    private route: ActivatedRoute,
    private chapters: ChaptersService
  ) {
    this.toc = this.route.paramMap.pipe(
      switchMap(params => this.chapters.tocAll(params.get('novelID')))
    );
    this.route.paramMap.pipe(
      map(params => params.get('novelID')),
      first()
    ).subscribe(
      id => this.novelID = id,
      err => console.log('Getting novel ID:', err)
    );
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>, chs: TOC) {
    // moveItemInArray(this.chaptersList.public, event.previousIndex, event.currentIndex);
    this.chsBusy = true;
    this.chapters
      .switchChaptersIndexes(this.novelID, chs[event.previousIndex], chs[event.currentIndex])
      .subscribe(
        () => this.chsBusy = false,
        console.error
      );
  }

  displayIndex(index: string): number {
    return parseInt(index, 10) + 1;
  }

  togglePrivate(chapterID: string, state: boolean) {
    this.chsBusy = true;
    this.chapters.chapterPublicToggle(this.novelID, chapterID, state).subscribe(
      () => this.chsBusy = false,
      console.error
    );
  }

}
