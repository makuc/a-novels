import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NovelService } from 'src/app/core/services/novel.service';

const ch = [
  { index: 1, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 1', url: '/novel/1/chapter/1' },
  { index: 2, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 2', url: '/novel/1/chapter/2' },
  { index: 3, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 3', url: '/novel/1/chapter/3' },
  { index: 4, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 4', url: '/novel/1/chapter/4' },
  { index: 5, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 5', url: '/novel/1/chapter/5' },
  { index: 6, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 6', url: '/novel/1/chapter/6' },
  { index: 7, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 7', url: '/novel/1/chapter/7' },
  { index: 8, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 8', url: '/novel/1/chapter/8' },
  { index: 9, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 9', url: '/novel/1/chapter/9' },
  { index: 10, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 10', url: '/novel/1/chapter/10' },
  { index: 11, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 11', url: '/novel/1/chapter/11' },
  { index: 12, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 12', url: '/novel/1/chapter/12' },
  { index: 13, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 13', url: '/novel/1/chapter/13' },
  { index: 14, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 14', url: '/novel/1/chapter/14' },
  { index: 15, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 15', url: '/novel/1/chapter/15' },
  { index: 16, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 16', url: '/novel/1/chapter/16' },
  { index: 17, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 17', url: '/novel/1/chapter/17' },
  { index: 18, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 18', url: '/novel/1/chapter/18' },
  { index: 19, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 19', url: '/novel/1/chapter/19' },
  { index: 20, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 20', url: '/novel/1/chapter/20' },
  { index: 21, volume: 1, volumeName: 'Becoming a Dungeon', name: 'Chapter 21', url: '/novel/1/chapter/21' },
  { index: 1, volume: 2, volumeName: 'A companion', name: 'Chapter 1', url: '/novel/1/chapter/1' },
  { index: 2, volume: 2, volumeName: 'A companion', name: 'Chapter 2', url: '/novel/1/chapter/2' },
  { index: 3, volume: 2, volumeName: 'A companion', name: 'Chapter 3', url: '/novel/1/chapter/3' },
  { index: 4, volume: 2, volumeName: 'A companion', name: 'Chapter 4', url: '/novel/1/chapter/4' },
  { index: 5, volume: 2, volumeName: 'A companion', name: 'Chapter 5', url: '/novel/1/chapter/5' },
  { index: 6, volume: 2, volumeName: 'A companion', name: 'Chapter 6', url: '/novel/1/chapter/6' },
  { index: 7, volume: 2, volumeName: 'A companion', name: 'Chapter 7', url: '/novel/1/chapter/7' },
  { index: 8, volume: 2, volumeName: 'A companion', name: 'Chapter 8', url: '/novel/1/chapter/8' },
  { index: 9, volume: 2, volumeName: 'A companion', name: 'Chapter 9', url: '/novel/1/chapter/9' },
  { index: 10, volume: 2, volumeName: 'A companion', name: 'Chapter 10', url: '/novel/1/chapter/10' },
  { index: 11, volume: 2, volumeName: 'A companion', name: 'Chapter 11', url: '/novel/1/chapter/11' },
  { index: 12, volume: 2, volumeName: 'A companion', name: 'Chapter 12', url: '/novel/1/chapter/12' },
  { index: 13, volume: 2, volumeName: 'A companion', name: 'Chapter 13', url: '/novel/1/chapter/13' },
  { index: 14, volume: 2, volumeName: 'A companion', name: 'Chapter 14', url: '/novel/1/chapter/14' },
  { index: 15, volume: 2, volumeName: 'A companion', name: 'Chapter 15', url: '/novel/1/chapter/15' },
  { index: 16, volume: 2, volumeName: 'A companion', name: 'Chapter 16', url: '/novel/1/chapter/16' },
  { index: 17, volume: 2, volumeName: 'A companion', name: 'Chapter 17', url: '/novel/1/chapter/17' },
  { index: 18, volume: 2, volumeName: 'A companion', name: 'Chapter 18', url: '/novel/1/chapter/18' },
  { index: 19, volume: 2, volumeName: 'A companion', name: 'Chapter 19', url: '/novel/1/chapter/19' },
  { index: 20, volume: 2, volumeName: 'A companion', name: 'Chapter 20', url: '/novel/1/chapter/20' },
  { index: 21, volume: 2, volumeName: 'A companion', name: 'Chapter 21', url: '/novel/1/chapter/21' }
];

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  storage: any;

  chaptersPageEvent: PageEvent;
  reviewsPageEvent: PageEvent;

  inLibrary = true;
  isFavorite = true;
  novel: Observable<Novel>;
  toc = ch;

  constructor(
    private novels: NovelService,
    private route: ActivatedRoute
  ) {
    this.storage = storageKeys;
    this.novel = this.route.paramMap
      .pipe(
        switchMap(params => this.novels.getNovel(params.get('id')))
      );
  }

  addFavorites() {
    this.isFavorite = true;
  }
  removeFavorites() {
    this.isFavorite = false;
  }
  addToLibrary() {
    this.inLibrary = true;
  }

  removeFromLibrary() {
    this.inLibrary = false;
  }

  ngOnInit() {
  }

}
