import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-swipe-tab',
  templateUrl: './swipe-tab.component.html',
  styleUrls: ['./swipe-tab.component.scss']
})
export class SwipeTabComponent implements OnInit {

  @Input() nTabs: number;

  @Output() selectedChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() selected: number;

  constructor() { }

  ngOnInit() {
  }

  nextTab() {
    this.selected = (this.selected + 1) % this.nTabs;
    this.selectedChange.emit(this.selected);
  }

  prevTab() {
    this.selected = (this.selected > 0) ? this.selected - 1 : this.nTabs;
    this.selectedChange.emit(this.selected);
  }

}
