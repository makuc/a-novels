import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from 'firebase';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit, OnDestroy {

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
