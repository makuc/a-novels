import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, switchMap } from 'rxjs/operators';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent {

  public user: Observable<UserProfile>;
  public navId: string;

  constructor(
    private route: ActivatedRoute,
    private users: UserService
  ) {
    this.navId = this.route.snapshot.paramMap.get('uid');
    if (this.navId === 'me') {
      this.user = this.users.getMe();
    } else {
      this.user = this.users.getUser(this.navId);
    }
  }

}
