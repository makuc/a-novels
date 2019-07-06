import { Component, OnInit, Input } from '@angular/core';
import { User } from 'firebase';

@Component({
  selector: 'app-profile-nav',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.scss']
})
export class ProfileNavComponent implements OnInit {

  @Input() user: User;

  constructor() { }

  ngOnInit() {
  }

}
