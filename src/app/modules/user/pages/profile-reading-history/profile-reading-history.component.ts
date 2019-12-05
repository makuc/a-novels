import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-reading-history',
  templateUrl: './profile-reading-history.component.html',
  styleUrls: ['./profile-reading-history.component.scss']
})
export class ProfileReadingHistoryComponent {

  public user: Observable<UserProfile>;
  public uid: string;

  constructor(
    private route: ActivatedRoute,
    private users: UserService
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    if (this.uid === 'me') {
      this.user = this.users.currentUser;
    } else {
      this.user = this.users.getUser(this.uid);
    }
  }

}
