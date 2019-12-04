import { Component, OnInit, Input, ContentChild } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {

  @Input() color = 'normal';

  constructor() { }

  ngOnInit() {
  }

}
