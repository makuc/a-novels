import { Component, OnInit } from '@angular/core';
import { NovelService } from 'src/app/core/services/novel.service';
import { WorkshopService } from 'src/app/core/services/workshop.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {

  constructor(
    private n: NovelService,
    private ws: WorkshopService
  ) { }

  ngOnInit() {
  }

}
