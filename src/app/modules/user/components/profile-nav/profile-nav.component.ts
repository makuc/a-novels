import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.scss']
})
export class ProfileNavComponent implements OnInit {

  @Input() navId: string;

  constructor() { }

  ngOnInit() {  }

}
