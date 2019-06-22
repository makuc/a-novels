import { Component, OnInit } from '@angular/core';


export interface NovelStats {
  name: string;
  position: number;
  value: number;
}

const NOVEL_STATS: NovelStats[] = [
  { position: 1, name: 'Total chapters\' view', value: 10079 },
  { position: 2, name: 'Average chapters\' view', value: 3009 },
  { position: 3, name: 'In Libraries', value: 3000 },
  { position: 4, name: 'Favorites', value: 10079 },
  { position: 5, name: 'Ratings', value: 10079 },
  { position: 6, name: 'Pages', value: 10079 },
  { position: 7, name: 'Word count', value: 289079 },
];

@Component({
  selector: 'app-full-statistic',
  templateUrl: './full-statistic.component.html',
  styleUrls: ['./full-statistic.component.scss']
})
export class FullStatisticComponent implements OnInit {

  statsPanelOpen = false;
  displayedColumns: string[] = ['name', 'value'];
  dataSource = NOVEL_STATS;

  constructor() { }

  ngOnInit() {
  }

}
