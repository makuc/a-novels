import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'firebase/app';

@Component({
  selector: 'app-userpane',
  templateUrl: './userpane.component.html',
  styleUrls: ['./userpane.component.scss']
})
export class UserpaneComponent implements OnInit {
  @Input() user: User | null;
  @Output() logout: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
