import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-favorites',
  templateUrl: './profile-favorites.component.html',
  styleUrls: ['./profile-favorites.component.scss']
})
export class ProfileFavoritesComponent {

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
