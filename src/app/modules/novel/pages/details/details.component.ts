import { Component, OnInit } from '@angular/core';
import Novel from 'src/app/shared/models/novel.model';
import { PageEvent } from '@angular/material';

const tn = {
  title: 'Mikayla the Dungeon, with extra long title for the lolz... And to see how it looks',
  author: {
    displayName: 'Armin Makovec',
    uid: 'Vt9rGYLvbKZQaT7rL1fWPBE1OqF2'
  },
  cover: '/assets/img/novel/01/cover.jpg',
  // tslint:disable-next-line: max-line-length
  description: 'Mikayla, a girl titled as genius in body-enhancement magic!\nYet she knows better. She is naught but a handicapped human, after all, ever since a magical accident when she was just a little girl. A human with an affliction preventing her from using casting her magic outside her own body. Something everyone else take for granted.\nThat is, until another accident happens and she loses her own body as well, becoming a pure crystalline being.\nFollow her as she learns to interact with the world as a crystal anew, find companionship and rediscover her new self.',
  tags: ['Female MC', 'Magic', 'Dungeon Core', 'Monsters', 'Non-human MC', 'Game Elements', 'Dungeon Master'],
  dateCreated: '2018-07-23T13:24:57',
  nFavorites: 1242,
  nRatings: 24,
  storyRating: 3.84,
  styleRating: 4.12,
  charsRating: 4.58,
  worldRating: 3.33,
  grammRating: 4.0
};

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

  chaptersPageEvent: PageEvent;
  reviewsPageEvent: PageEvent;

  inLibrary = true;
  isFavorite = true;
  novel: Novel;
  toc = ch;

  constructor() {

    this.novel = {
      id: 'really-hard-id',

      title: tn.title,
      author: tn.author,
      coverURL: tn.cover,
      published: true,

      description: tn.description,
      tags: tn.tags,

      // created: firebase.firestore.Timestamp = new firebase.firestore.Timestamp(new Date(''));
      nFavorites: tn.nFavorites,

      nRatings: tn.nRatings,
      storyRating: tn.storyRating,
      styleRating: tn.styleRating,
      charsRating: tn.charsRating,
      worldRating: tn.worldRating,
      grammRating: tn.grammRating
    };
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
