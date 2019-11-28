import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-reviews',
  templateUrl: './profile-reviews.component.html',
  styleUrls: ['./profile-reviews.component.scss']
})
export class ProfileReviewsComponent {

  public user: Observable<UserProfile>;
  public navId: string;

  constructor(
    private route: ActivatedRoute,
    private us: UserService
  ) {
    this.navId = this.route.snapshot.paramMap.get('uid');
    if (this.navId === 'me') {
      this.user = this.us.getMe();
    } else {
      this.user = this.us.getUser(this.navId);
    }
  }

}
