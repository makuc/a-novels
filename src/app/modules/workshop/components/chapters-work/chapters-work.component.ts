import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Observable } from 'rxjs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChapterMeta } from 'src/app/shared/models/novels/chapter.model';
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
  ) { }

  ngOnInit() {
    this.novelID = this.route.snapshot.paramMap.get('novelID');
    this.toc = this.chapters.tocAll(this.novelID);
  }

  drop(event: CdkDragDrop<string[]>, chs: TOC) {
    // moveItemInArray(this.chaptersList.public, event.previousIndex, event.currentIndex);
    this.chsBusy = true;
    this.chapters.switchChaptersIndexes(chs[event.previousIndex], chs[event.currentIndex]).subscribe(
      () => this.chsBusy = false,
      err => console.error(err)
    );
  }

  displayIndex(index: string): number {
    return parseInt(index, 10) + 1;
  }

  togglePrivate(chapterID: string, state: boolean) {
    this.chsBusy = true;
    this.chapters.chapterPublicToggle(chapterID, state).subscribe(
      () => this.chsBusy = false,
      err => console.error(err)
    );
  }

}
