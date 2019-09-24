import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit } from '@angular/core';
import { NovelService } from 'src/app/core/services/novel.service';
import { UserService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {
  storage: any;
  novelsList: Observable<Novel[]>;

  constructor(
    private novels: NovelService,
    private users: UserService
  ) {
    this.storage = storageKeys;
    this.novelsList = this.users.getMe()
      .pipe(
        switchMap(user => this.novels.novelsGetSnapshotsBy(user.uid))
      );
  }

  ngOnInit() {
  }

}
