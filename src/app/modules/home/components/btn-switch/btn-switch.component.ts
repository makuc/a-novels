import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-btn-switch',
  templateUrl: './btn-switch.component.html',
  styleUrls: ['./btn-switch.component.scss']
})
export class BtnSwitchComponent implements OnInit {

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
