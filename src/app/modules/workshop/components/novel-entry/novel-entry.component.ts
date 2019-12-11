import { Component, OnInit, Input } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { NovelService } from 'src/app/core/services/novel.service';
import { Observable } from 'rxjs';
import { storageKeys } from 'src/app/keys.config';

@Component({
  selector: 'app-novel-entry',
  templateUrl: './novel-entry.component.html',
  styleUrls: ['./novel-entry.component.scss']
})
export class NovelEntryComponent implements OnInit {

  @Input() novel: Novel;

  constructor() { }

  ngOnInit() { }

}
