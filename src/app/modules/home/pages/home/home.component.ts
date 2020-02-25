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
  tabs = ['assets/img/carousel/pic1.jpg', 'assets/img/carousel/pic2.jpg', 'assets/img/carousel/pic3.jpg'];
  urls = ['/novel/oYVtELIBo9yItle7ZFZJ', '/novel/LSxDRnPrMupOWxBHEPfE', '/novel/1jpiDvAHvZZUU8XZps5p'];
  currentUser: User;
  users = [];

  constructor(
    private auth: AuthenticationService,
    private us: UserService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.auth.currentSnapshot;
  }

  ngOnDestroy(): void {
    this.destroyer.next();
    this.destroyer.unsubscribe();
  }

  public executeSelectedChange = (event) => {
    // console.log(event);
  }

}
