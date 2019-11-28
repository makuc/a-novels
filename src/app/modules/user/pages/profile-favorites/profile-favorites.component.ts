import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-favorites',
  templateUrl: './profile-favorites.component.html',
  styleUrls: ['./profile-favorites.component.scss']
})
export class ProfileFavoritesComponent {

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
