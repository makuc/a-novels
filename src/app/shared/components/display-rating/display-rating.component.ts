import { Component, OnInit, Input } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-display-rating',
  templateUrl: './display-rating.component.html',
  styleUrls: ['./display-rating.component.scss']
})
export class DisplayRatingComponent {

  // tslint:disable: variable-name
  private _short: boolean;
  // tslint:enable: variable-name

  @Input() rating: number;
  @Input() icon: string;
  @Input() tooltip: string;
  @Input() number: number;
  @Input()
  get short(): boolean {
    return this._short;
  }
  set short(value: boolean) {
    this._short = coerceBooleanProperty(value);
  }

  constructor() { }

  showStar(star: number): string {
    const l1: number = star - .25;
    const l2: number = star - 0.75;

    if (this.rating >= l1) {
      return 'star';
    } else if (this.rating >= l2) {
      return 'star_half';
    } else {
      return 'star_outline';
    }
  }

  formatNumber() {
    let formatted = '';
    let n = this.number;

    while (n > 1000) {
      if (formatted.length > 0) {
        formatted = `${(n % 1000).toFixed(0)}.${formatted}`;
      } else {
        formatted = `${(n % 1000).toFixed(0)}`;
      }
      n = Math.floor(n / 1000);
    }

    if (formatted.length > 0) {
      formatted = `${n.toFixed(0)}.${formatted}`;
    } else {
      formatted = `${n.toFixed(0)}`;
    }

    return formatted;
  }

}
