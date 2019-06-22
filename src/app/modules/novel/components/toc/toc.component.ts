import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit {

  @Input() toc: [];
  @Input() pagination: boolean;

  displayedColumns: string[] = ['index', 'name'];

  constructor() { }

  ngOnInit() {
  }

}
