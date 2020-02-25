import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CarouselComponent implements OnInit {

  @Input() tabs: string[];
  @Input() urls: string[];
  selected = 0;

  constructor() { }

  ngOnInit() {
  }

  nextTab() {
    this.selected = (this.selected + 1) % this.tabs.length;
  }

  prevTab() {
    this.selected = (this.selected > 0) ? this.selected - 1 : this.tabs.length;
  }

}
