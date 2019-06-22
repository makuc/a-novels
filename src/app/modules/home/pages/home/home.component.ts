import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { UserService } from 'src/app/core/services/user.service';
import { first } from 'rxjs/operators';
import { User } from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tabs = ['assets/img/carousel/bird2.jpg', 'assets/img/carousel/bird1.jpg', 'assets/img/carousel/bird3.jpg'];
  currentUser: User;
  users = [];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUser = this.authService.user;
  }

  ngOnInit() {
    //this.loadAllUsers();
  }

  public executeSelectedChange = (event) => {
    //console.log(event);
  }

}
