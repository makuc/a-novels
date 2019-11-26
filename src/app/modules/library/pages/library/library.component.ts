import { Component, OnInit } from '@angular/core';
import { NovelMeta } from 'src/app/shared/models/novels/novel.model';
import { Library } from 'src/app/shared/models/library/library.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NovelService } from 'src/app/core/services/novel.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent {
  novels$: Observable<string[]>;

  constructor(
    private ns: NovelService
  ) {
    this.novels$ = this.ns.libMyNovels();
  }

}
