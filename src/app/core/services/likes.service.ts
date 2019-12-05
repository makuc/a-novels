import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { dbKeys } from 'src/app/keys.config';
import { first, map, exhaustMap, switchMap } from 'rxjs/operators';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { Observable, EMPTY, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';

@Injectable({
  providedIn: 'root'
})
export class LikesService extends HttpErrorsHelper {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    super();
  }

  private get user() {
    return this.auth.currentSnapshot;
  }

  get timestamp() { return firestore.FieldValue.serverTimestamp(); }

  stats(elPath: string): Observable<LikeStats> {
    return this.afs.doc<LikeStats>(`${elPath}/${dbKeys.C_STATS}/${dbKeys.C_Likes}`).valueChanges();
  }

  state(elPath: string): Observable<Like> {
    return this.auth.getUser.pipe(
      switchMap(user => {
        if (!user) { return EMPTY; }
        const path = `${elPath}/${dbKeys.C_Likes}/${user.uid}`;
        return this.afs.doc<Like>(path).valueChanges();
      })
    );
  }

  like(elPath: string): Observable<void> {
    return this.getLike(elPath).pipe(
      exhaustMap(current => this.setLike(elPath, current, true)),
      first()
    );
  }

  dislike(elPath: string) {
    return this.getLike(elPath).pipe(
      exhaustMap(current => this.setLike(elPath, current, false)),
      first()
    );
  }

  reset(elPath: string) {
    return this.getLike(elPath).pipe(
      exhaustMap(like => this.deleteLike(elPath, like)),
      first()
    );
  }

  private getLike(elPath: string): Observable<Like> {
    if (!this.user) {// Must be logged in
      return EMPTY;
    }
    const uid = this.user.uid;
    return this.afs.doc<Like>(`${elPath}/${dbKeys.C_Likes}/${uid}`).valueChanges().pipe(
      map(like => this.mapLike(uid, like))
    );
  }

  private mapLike(uid: string, like: Like) {
    if (!like) {
      return {
        uid,
        value: undefined
      };
    }
    return like;
  }

  private setLike(elPath: string, like: Like, next: boolean): Promise<void> {
    if (like.value === next) { return Promise.resolve(); }// Already voted, new vote is the same!

    let pos = 0;
    let neg = 0;
    if (like.value === undefined) {// Hasn't voted yet, save it
      pos = next ? 1 : 0;
      neg = next ? 0 : 1;
    } else {// Already voted, replace
      pos = next ? 1 : -1;
      neg = next ? -1 : 1;
    }

    // Prepare new entries
    const newLike: Like = {
      uid: like.uid,
      createdAt: this.timestamp,
      value: next
    };
    const newStats: LikeStats = {
      id: like.uid,
      pos: firestore.FieldValue.increment(pos),
      neg: firestore.FieldValue.increment(neg)
    };

    // Write new entries in batch
    const batch = this.afs.firestore.batch();
    const refLike = this.afs.doc<Like>(`${elPath}/${dbKeys.C_Likes}/${like.uid}`).ref;
    const refStats = this.afs.doc<LikeStats>(`${elPath}/${dbKeys.C_STATS}/${dbKeys.C_Likes}`).ref;

    batch.set(refLike, newLike);
    batch.set(refStats, newStats, { merge: true });

    return batch.commit();
  }

  private deleteLike(elPath: string, like: Like): Promise<void> {
    if (!like.createdAt) { // LIKE doesn't exist, just resolve
      return Promise.resolve();
    }
    if (!this.user) {
      console.log('likes.deleteLike');
      return this.rejectLoginPromise;
    }

    // Prepare new entries
    const newStats: Partial<LikeStats> = {
      path: elPath,
      id: this.user.uid,
      pos: firestore.FieldValue.increment(like.value ? -1 : 0),
      neg: firestore.FieldValue.increment(like.value ? 0 : -1)
    };

    // Write new entries in batch
    const batch = this.afs.firestore.batch();
    const refLike = this.afs.doc<Like>(`${elPath}/${dbKeys.C_Likes}/${this.user.uid}`).ref;
    const refStats = this.afs.doc<LikeStats>(`${elPath}/${dbKeys.C_STATS}/${dbKeys.C_Likes}`).ref;

    batch.set(refStats, newStats, { merge: true });
    batch.delete(refLike);

    return batch.commit();
  }

}
