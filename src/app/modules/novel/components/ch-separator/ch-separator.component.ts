import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ch-separator',
  templateUrl: './ch-separator.component.html',
  styleUrls: ['./ch-separator.component.scss']
})
export class ChSeparatorComponent implements OnInit {

  @Input() color = 'neutral';

  constructor() { }

  ngOnInit() {
  }

}
