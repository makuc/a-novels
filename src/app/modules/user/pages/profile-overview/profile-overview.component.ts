import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { UserService } from 'src/app/core/services/user.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { first, map, switchMap, tap, takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit, OnDestroy {
  private end: Subject<void> = new Subject();

  user$: Observable<UserProfile>;
  uid: string;
  me: boolean;

  editingName = false;
  editingNameLoading = false;

  constructor(
    private route: ActivatedRoute,
    private us: UserService,
    private auth: AuthenticationService,
    private alert: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('uid')),
      tap(uid => this.loadUser(uid)),
      takeUntil(this.end)
    ).subscribe();
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  loadUser(uid: string) {
    if (uid === 'me') {
      this.user$ = this.us.getMe();
      this.me = true;
    } else {
      this.user$ = this.us.getUser(uid);
      this.user$.pipe(
        first()
      ).subscribe(
        u => this.redirect(u)
      );
      this.auth.getUser.pipe(
        first()
      ).subscribe(
        user => this.me = user.uid === uid
      );
    }
    return null;
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
