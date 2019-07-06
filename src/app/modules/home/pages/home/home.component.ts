import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { first, takeUntil } from 'rxjs/operators';
import { User } from 'firebase';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroyer = new Subject<void>();
  tabs = ['assets/img/carousel/bird2.jpg', 'assets/img/carousel/bird1.jpg', 'assets/img/carousel/bird3.jpg'];
  currentUser: User;
  users = [];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.authService.getUser
      .pipe(takeUntil(this.destroyer))
      .subscribe(user => this.currentUser = user);
  }

  ngOnDestroy(): void {
    this.destroyer.next();
    this.destroyer.unsubscribe();
  }

  public executeSelectedChange = (event) => {
    // console.log(event);
  }

}
