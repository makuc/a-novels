import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { UserService } from 'src/app/core/services/user.service';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';
import { User } from 'firebase/app';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent {

  user$: Observable<UserProfile | User>;
  uid: string;
  me: boolean;

  editingName = false;
  editingNameLoading = false;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private us: UserService,
    private alert: AlertService,
    private router: Router
  ) {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.loadUser();
  }

  loadUser() {
    if (this.uid === 'me') {
      this.user$ = this.us.currentUser;
      this.me = true;
    } else {
      this.user$ = this.us.getUser(this.uid);
      this.user$.pipe(
        first()
      ).subscribe(
        u => this.redirect(u)
      );
      this.me = this.auth.currentSnapshot.uid === this.uid;
    }
  }

  toggleEditName() {
    this.editingName = !this.editingName;
  }

  saveName(name: string) {
    if (name.length < 3) {
      this.alert.error('Display name must be at least 3 letters long');
    } else {
      this.us.changeDisplayName(name).subscribe(
        () => this.editingName = false,
        (err) => console.error(err)
      );
    }
  }

  redirect(u: any) {
    if (!u) {
      this.router.navigate(['../me'], { relativeTo: this.route });
    }
  }

}
