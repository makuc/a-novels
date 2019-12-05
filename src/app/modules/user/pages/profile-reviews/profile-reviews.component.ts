import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-reviews',
  templateUrl: './profile-reviews.component.html',
  styleUrls: ['./profile-reviews.component.scss']
})
export class ProfileReviewsComponent {

  public user: Observable<UserProfile>;
  public uid: string;

  constructor(
    private route: ActivatedRoute,
    private us: UserService
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    if (this.uid === 'me') {
      this.user = this.us.currentUser;
    } else {
      this.user = this.us.getUser(this.uid);
    }
  }

}
