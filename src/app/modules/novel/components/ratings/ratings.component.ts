import { Component, OnInit, Input } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit {

  @Input() novel: Novel;

  constructor() { }

  showRating(tRat: number) {
    const rat = [0, 0, 0, 0, 0];
    let i = 0;
    while (tRat >= 0.85) {
      rat[i++] = 1;
      tRat--;
    }
    if (tRat >= 0.15) {
      rat[i] = 0.5;
    }
    return rat;
  }

  ngOnInit() {
  }

}
