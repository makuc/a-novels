import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-archive',
  templateUrl: './profile-archive.component.html',
  styleUrls: ['./profile-archive.component.scss']
})
export class ProfileArchiveComponent implements OnInit, OnDestroy {

  private destroyer = new Subject<void>();

  public user: UserProfile;
  public navId: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
      .pipe(takeUntil(this.destroyer))
      .subscribe(data => {
        this.user = data.user;
        this.navId = data.navId;
      });
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.unsubscribe();
  }

}
