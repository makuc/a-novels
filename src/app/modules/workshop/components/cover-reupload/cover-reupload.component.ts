import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { NovelService } from 'src/app/core/services/novel.service';
import { storageKeys } from 'src/app/keys.config';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-cover-reupload',
  templateUrl: './cover-reupload.component.html',
  styleUrls: ['./cover-reupload.component.scss'],
  animations: [
    // animation triggers go here
    trigger('hover', [
      state('true', style({
        opacity: 1
      })),
      state('false', style({
        opacity: 0
      })),
      transition('true => false', [
        animate('0.2s')
      ]),
      transition('false => true', [
        animate('0.2s')
      ])
    ])
  ]
})
export class CoverReuploadComponent implements OnInit {

  s = storageKeys;
  @Input() cover = false;
  @Input() novelId: string;
  uploadPercent: Observable<number>;

  hover = false;
  src: string;
  busy = false;
  msg: string;
  msgIcon: string;
  @ViewChild('sCover', {static: true}) elCover: ElementRef<HTMLInputElement>;

  constructor(
    private novels: NovelService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  get changed(): boolean {
    return (this.elCover.nativeElement.files.length > 0);
  }

  coverUrl() {
    if (this.cover) {
      return this.s.GEN_URL(storageKeys.BASIC_URL, storageKeys.NOVELS_COVER_PATH, this.novelId, storageKeys.NOVELS_COVER_THUMBNAIL);
    } else {
      return '/assets/img/novels/01/cover.jpg';
    }
  }

  reuploadCover() {
    if (this.elCover.nativeElement.files.length > 0) {
      this.busy = true;
      const task = this.novels.novelCoverUpload(this.novelId, this.elCover.nativeElement.files[0]);
      this.uploadPercent = task.percentageChanges();
      task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.clearSelected();
          this.busy = false;
          this.uploadPercent = null;
          this.displayMessage('Uploaded!', 'done');
        })
      )
      .subscribe();
    }
  }

  removeCover() {
    this.busy = true;
    this.novels.novelCoverRemove(this.novelId).then(
      () => {
        this.busy = false;
        this.displayMessage('Removed', 'done');
      },
      (err) => {
        this.busy = false;
        if (err.code === storageKeys.E404) {
          return console.log('It may take a minute for changes to take effect...');
        }
        console.error('Remove cover:', err);
      }
    );
  }

  clearSelected() {
    this.src = null;
    this.renderer.setProperty(this.elCover.nativeElement, 'value', '');
  }

  readImage() {
    const img = this.elCover.nativeElement.files[0];
    if (!img || img.type.match(/image\/*/) == null) {
      return console.error('Not image');
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.src = e.target.result;
    };
    reader.readAsDataURL(img);
  }

  private displayMessage(msg: string, msgIcon?: string) {
    this.msgIcon = msgIcon;
    this.msg = msg;
    setTimeout(() => {
      this.msg = null;
      this.msgIcon = null;
    } , 3000);
  }

}
