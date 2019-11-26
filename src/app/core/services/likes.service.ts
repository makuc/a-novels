import { Injectable } from '@angular/core';
import { firestore } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { dbKeys } from 'src/app/keys.config';
import { first, switchMap, debounceTime, map } from 'rxjs/operators';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikesService {

  constructor(
    private afs: AngularFirestore,
    private us: UserService
  ) { }

  private reject() {
    return Promise.reject({ err: 403, msg: 'You must login' });
  }

  get timestamp() { return firestore.FieldValue.serverTimestamp(); }

  stats(elPath: string): Observable<LikeStats> {
    return this.afs.doc<LikeStats>(`${elPath}/${dbKeys.C_STATS}/${dbKeys.C_Likes}`).valueChanges();
  }

  state(elPath: string): Observable<Like> {
    return this.us.currentUser.pipe(
      switchMap(user => {
        if (!user) { return undefined; }
        return this.getLike(elPath, user.uid);
      })
    );
  }

  like(elPath: string) {
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.getLike(elPath, user.uid);
      }),
      first(),
      switchMap(current => this.setLike(elPath, current, true)),
    );
  }

  dislike(elPath: string) {
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.getLike(elPath, user.uid);
      }),
      first(),
      switchMap(current => this.setLike(elPath, current, false))
    );
  }

  reset(elPath: string) {
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.getLike(elPath, user.uid);
      }),
      first(),
      switchMap(like => this.deleteLike(elPath, like))
    );
  }

  private getLike(elPath: string, uid: string): Observable<Like> {
    return this.afs.doc<Like>(`${elPath}/${dbKeys.C_Likes}/${uid}`).valueChanges().pipe(
      map(like => {
        if (!like) {
          return {
            uid,
            value: undefined
          };
        }
        return like;
      })
    );
  }

  private setLike(elPath: string, like: Like, next: boolean) {
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

  private deleteLike(elPath: string, like: Like) {
    if (!like.createdAt) { // LIKE doesn't exist, just resolve
      return Promise.resolve();
    }

    // Prepare new entries
    const newStats: Partial<LikeStats> = {
      path: elPath,
      id: like.uid,
      pos: firestore.FieldValue.increment(like.value ? -1 : 0),
      neg: firestore.FieldValue.increment(like.value ? 0 : -1)
    };

    // Write new entries in batch
    const batch = this.afs.firestore.batch();
    const refLike = this.afs.doc<Like>(`${elPath}/${dbKeys.C_Likes}/${like.uid}`).ref;
    const refStats = this.afs.doc<LikeStats>(`${elPath}/${dbKeys.C_STATS}/${dbKeys.C_Likes}`).ref;

    batch.set(refStats, newStats, { merge: true });
    batch.delete(refLike);

    return batch.commit();
  }

}
