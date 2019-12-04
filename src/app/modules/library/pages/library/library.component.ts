import { Component } from '@angular/core';
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
