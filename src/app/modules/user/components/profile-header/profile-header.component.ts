import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {

  @Input() user: UserProfile;

  constructor() { }

  ngOnInit() {
  }

}
