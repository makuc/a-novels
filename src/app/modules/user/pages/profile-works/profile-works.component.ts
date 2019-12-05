import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';

@Component({
  selector: 'app-profile-works',
  templateUrl: './profile-works.component.html',
  styleUrls: ['./profile-works.component.scss']
})
export class ProfileWorksComponent implements OnInit {

  uid: string;
  user$: Observable<UserProfile>;

  constructor(
    private route: ActivatedRoute,
    private us: UserService
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    if (this.uid === 'me') {
      this.user$ = this.us.currentUser;
    } else {
      this.user$ = this.us.getUser(this.uid);
    }
  }

  ngOnInit() {
  }

}
